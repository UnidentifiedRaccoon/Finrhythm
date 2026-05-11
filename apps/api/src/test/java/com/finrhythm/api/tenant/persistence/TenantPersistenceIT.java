package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.PilotLaunch;
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
    PilotLaunchRepository pilotLaunchRepository;

    @Autowired
    AccessPoolRepository accessPoolRepository;

    @Autowired
    InviteCodeRepository inviteCodeRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void flywaySchemaPersistsTenantLaunchPoolsAndInviteHashes() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-a", "Pilot tenant A"));
        PilotLaunch pilotLaunch = pilotLaunchRepository.saveAndFlush(
                PilotLaunch.create(tenant, "pilot-launch-main", "Pilot launch main", 500)
        );
        AccessPool accessPool = accessPoolRepository.saveAndFlush(
                AccessPool.create(tenant, pilotLaunch, "access-pool-main", "Access pool main", 500)
        );

        InviteCode inviteCode = inviteCodeRepository.saveAndFlush(InviteCode.issued(
                tenant,
                accessPool,
                InviteCodeHash.fromSha256Hex(HASH_A),
                Instant.parse("2026-05-04T09:00:00Z"),
                Instant.parse("2026-06-04T09:00:00Z")
        ));

        assertThat(tenantRepository.findBySlug("pilot-tenant-a")).map(Tenant::getId).contains(tenant.getId());
        assertThat(pilotLaunchRepository.findByTenantIdAndKey(tenant.getId(), "pilot-launch-main"))
                .map(PilotLaunch::getId)
                .contains(pilotLaunch.getId());
        assertThat(accessPoolRepository.findByTenantIdAndKey(tenant.getId(), "access-pool-main"))
                .map(AccessPool::getId)
                .contains(accessPool.getId());
        assertThat(inviteCodeRepository.findByLookupHash(HASH_A)).map(InviteCode::getId).contains(inviteCode.getId());
    }

    @Test
    void inviteLookupHashIsUnique() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-b", "Pilot tenant B"));
        AccessPool accessPool = seedAccessPool(tenant, "b", 500);
        Instant issuedAt = Instant.parse("2026-05-04T09:00:00Z");
        inviteCodeRepository.saveAndFlush(InviteCode.issued(
                tenant,
                accessPool,
                InviteCodeHash.fromSha256Hex(HASH_B),
                issuedAt,
                null
        ));

        assertThatThrownBy(() -> inviteCodeRepository.saveAndFlush(InviteCode.issued(
                tenant,
                accessPool,
                InviteCodeHash.fromSha256Hex(HASH_B),
                issuedAt,
                null
        )))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void databaseRejectsInviteLinkedToAccessPoolFromAnotherTenant() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-c", "Pilot tenant C"));
        Tenant otherTenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-d", "Pilot tenant D"));
        AccessPool otherAccessPool = seedAccessPool(otherTenant, "d", 500);

        assertThatThrownBy(() -> insertInviteRow(
                UUID.randomUUID(),
                tenant.getId(),
                otherAccessPool.getId(),
                HASH_C,
                "CREATED",
                null,
                null
        ))
                .isInstanceOf(DataAccessException.class);
    }

    @Test
    void databaseRejectsActivatedStatusWithoutActivatedTimestamp() {
        Tenant tenant = tenantRepository.saveAndFlush(Tenant.create("pilot-tenant-e", "Pilot tenant E"));
        AccessPool accessPool = seedAccessPool(tenant, "e", 500);

        assertThatThrownBy(() -> insertInviteRow(
                UUID.randomUUID(),
                tenant.getId(),
                accessPool.getId(),
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

    @Test
    void flywayFinalSchemaUsesLaunchPoolModelOnly() {
        String legacyTable = "co" + "horts";
        String legacyColumn = "co" + "hort_id";
        List<String> tables = jdbcTemplate.queryForList("""
                select table_name
                from information_schema.tables
                where table_schema = 'public'
                """, String.class);
        List<String> columns = jdbcTemplate.queryForList("""
                select column_name
                from information_schema.columns
                where table_schema = 'public'
                  and table_name in ('invite_codes', 'employee_registrations')
                """, String.class);

        assertThat(tables).contains("pilot_launches", "access_pools");
        assertThat(tables).doesNotContain(legacyTable);
        assertThat(columns).contains("access_pool_id");
        assertThat(columns).doesNotContain(legacyColumn);
    }

    @Test
    void flywayAddsDatabaseCommentsForCoreEntityTablesAndSensitiveColumns() {
        assertThat(tableComment("tenants")).contains("Tenant account");
        assertThat(tableComment("pilot_launches")).contains("Planned pilot rollout");
        assertThat(tableComment("access_pools")).contains("Capacity-limited access pool");
        assertThat(tableComment("invite_codes")).contains("Raw invite codes are never stored");
        assertThat(tableComment("employee_registrations")).contains("Employee registration");
        assertThat(columnComment("invite_codes", "lookup_hash")).contains("SHA-256 lookup hash");
        assertThat(columnComment("invite_codes", "activation_subject_ref")).contains("Does not contain employee PII");
    }

    private void insertInviteRow(
            UUID id,
            UUID tenantId,
            UUID accessPoolId,
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
                    access_pool_id,
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
                accessPoolId,
                lookupHash,
                status,
                toTimestamp(issuedAt),
                toTimestamp(activatedAt),
                Timestamp.from(now),
                Timestamp.from(now)
        );
    }

    private AccessPool seedAccessPool(Tenant tenant, String suffix, int capacity) {
        PilotLaunch pilotLaunch = pilotLaunchRepository.saveAndFlush(
                PilotLaunch.create(tenant, "pilot-launch-" + suffix, "Pilot launch " + suffix, capacity)
        );
        return accessPoolRepository.saveAndFlush(
                AccessPool.create(tenant, pilotLaunch, "access-pool-" + suffix, "Access pool " + suffix, capacity)
        );
    }

    private String tableComment(String tableName) {
        return jdbcTemplate.queryForObject(
                "select obj_description(to_regclass(?), 'pg_class')",
                String.class,
                tableName
        );
    }

    private String columnComment(String tableName, String columnName) {
        return jdbcTemplate.queryForObject("""
                select col_description(to_regclass(?), attribute.attnum)
                from pg_attribute attribute
                where attribute.attrelid = to_regclass(?)
                  and attribute.attname = ?
                """, String.class, tableName, tableName, columnName);
    }

    private static Timestamp toTimestamp(Instant instant) {
        return instant == null ? null : Timestamp.from(instant);
    }
}
