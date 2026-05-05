package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.Cohort;
import com.finrhythm.api.tenant.domain.CohortKind;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.Tenant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class TenantPersistenceIT {
    private static final String HASH_A = "a".repeat(64);
    private static final String HASH_B = "b".repeat(64);
    private static final String HASH_C = "c".repeat(64);
    private static final String HASH_D = "d".repeat(64);

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_test")
            .withUsername("finlit")
            .withPassword("finlit_local");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    CohortRepository cohortRepository;

    @Autowired
    InviteCodeRepository inviteCodeRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void flywaySchemaPersistsTenantCohortsAndInviteHashes() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-a", "Pilot tenant A"));
        Cohort waveZero = cohortRepository.saveAndFlush(
                Cohort.createWave(tenant, "wave-0", "Wave 0", CohortKind.WAVE_0, 50)
        );
        Cohort waveOne = cohortRepository.saveAndFlush(
                Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500)
        );

        InviteCode inviteCode = inviteCodeRepository.saveAndFlush(InviteCode.issued(
                tenant,
                waveOne,
                InviteCodeHash.fromSha256Hex(HASH_A),
                Instant.parse("2026-05-04T09:00:00Z"),
                Instant.parse("2026-06-04T09:00:00Z")
        ));

        assertThat(tenantRepository.findBySlug("pilot-tenant-a")).map(Tenant::getId).contains(tenant.getId());
        assertThat(cohortRepository.findByTenantIdAndKey(tenant.getId(), "wave-0")).map(Cohort::getId).contains(waveZero.getId());
        assertThat(cohortRepository.findByTenantIdAndKey(tenant.getId(), "wave-1")).map(Cohort::getId).contains(waveOne.getId());
        assertThat(inviteCodeRepository.findByLookupHash(HASH_A)).map(InviteCode::getId).contains(inviteCode.getId());
    }

    @Test
    void inviteLookupHashIsUnique() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-b", "Pilot tenant B"));
        Cohort wave = cohortRepository.saveAndFlush(
                Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500)
        );
        Instant issuedAt = Instant.parse("2026-05-04T09:00:00Z");
        inviteCodeRepository.saveAndFlush(InviteCode.issued(
                tenant,
                wave,
                InviteCodeHash.fromSha256Hex(HASH_B),
                issuedAt,
                null
        ));

        assertThatThrownBy(() -> inviteCodeRepository.saveAndFlush(InviteCode.issued(
                tenant,
                wave,
                InviteCodeHash.fromSha256Hex(HASH_B),
                issuedAt,
                null
        )))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void databaseRejectsInviteLinkedToCohortFromAnotherTenant() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-c", "Pilot tenant C"));
        Tenant otherTenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-d", "Pilot tenant D"));
        Cohort otherWave = cohortRepository.saveAndFlush(
                Cohort.createWave(otherTenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500)
        );

        assertThatThrownBy(() -> insertInviteRow(UUID.randomUUID(), tenant.getId(), otherWave.getId(), HASH_C, "CREATED", null, null))
                .isInstanceOf(DataAccessException.class);
    }

    @Test
    void databaseRejectsActivatedStatusWithoutActivatedTimestamp() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-e", "Pilot tenant E"));
        Cohort wave = cohortRepository.saveAndFlush(
                Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500)
        );

        assertThatThrownBy(() -> insertInviteRow(
                UUID.randomUUID(),
                tenant.getId(),
                wave.getId(),
                HASH_D,
                "ACTIVATED",
                Instant.parse("2026-05-04T09:00:00Z"),
                null
        ))
                .isInstanceOf(DataAccessException.class);
    }

    @Test
    void inviteCodeTableStoresLookupHashButNoRawCodeColumn() {
        List<String> columns = jdbcTemplate.queryForList("""
                select column_name
                from information_schema.columns
                where table_schema = 'public'
                  and table_name = 'invite_codes'
                """, String.class);

        assertThat(columns).contains("lookup_hash");
        assertThat(columns).doesNotContain("code", "raw_code", "plain_code", "invite_code");
    }

    private void insertInviteRow(
            UUID id,
            UUID tenantId,
            UUID cohortId,
            String lookupHash,
            String status,
            Instant issuedAt,
            Instant activatedAt
    ) {
        Instant now = Instant.parse("2026-05-04T09:00:00Z");
        jdbcTemplate.update("""
                insert into invite_codes (
                    id,
                    tenant_id,
                    cohort_id,
                    lookup_hash,
                    status,
                    issued_at,
                    activated_at,
                    created_at,
                    updated_at
                )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                id,
                tenantId,
                cohortId,
                lookupHash,
                status,
                toTimestamp(issuedAt),
                toTimestamp(activatedAt),
                Timestamp.from(now),
                Timestamp.from(now)
        );
    }

    private static Timestamp toTimestamp(Instant instant) {
        return instant == null ? null : Timestamp.from(instant);
    }
}
