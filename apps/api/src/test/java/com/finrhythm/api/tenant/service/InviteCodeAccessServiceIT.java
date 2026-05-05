package com.finrhythm.api.tenant.service;

import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.Cohort;
import com.finrhythm.api.tenant.domain.CohortKind;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.Tenant;
import com.finrhythm.api.tenant.persistence.CohortRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeRepository;
import com.finrhythm.api.tenant.persistence.TenantRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class InviteCodeAccessServiceIT {
    private static final Instant ISSUED_AT = Instant.parse("2026-05-04T09:00:00Z");
    private static final Instant ACTIVATED_AT = Instant.parse("2026-05-04T10:00:00Z");
    private static final Pattern HUMAN_ENTERABLE_CODE = Pattern.compile(
            "^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}"
                    + "(-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}){3}$"
    );

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_invite_test")
            .withUsername("finlit")
            .withPassword("finlit_local");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    InviteCodeAccessService inviteCodeAccessService;

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    CohortRepository cohortRepository;

    @Autowired
    InviteCodeRepository inviteCodeRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void issuesRequestedWaveOneBatchWithUniqueHashesAndNoRawPersistence() {
        Tenant tenant = seedTenant();
        Cohort cohort = seedWaveOne(tenant, 500);

        List<IssuedInviteCode> issuedCodes = inviteCodeAccessService.issueBatch(
                tenant.getId(),
                cohort.getId(),
                500,
                ISSUED_AT,
                ISSUED_AT.plusSeconds(86_400)
        );

        assertThat(issuedCodes).hasSize(500);
        assertThat(issuedCodes.stream().map(IssuedInviteCode::code).collect(Collectors.toSet())).hasSize(500);
        issuedCodes.forEach(this::assertHumanEnterableCode);

        Set<String> lookupHashes = new HashSet<>(jdbcTemplate.queryForList("""
                select lookup_hash
                from invite_codes
                where tenant_id = ?
                  and cohort_id = ?
                """, String.class, tenant.getId(), cohort.getId()));

        assertThat(inviteCodeRepository.countByTenantIdAndCohortId(tenant.getId(), cohort.getId())).isEqualTo(500);
        assertThat(lookupHashes).hasSize(500);
        assertThat(lookupHashes).allSatisfy(hash -> assertThat(hash).matches("^[a-f0-9]{64}$"));
        assertReturnedCodesAreOnlyOneTimeOutputs(issuedCodes, lookupHashes);
        assertInviteTableHasNoRawCodeColumn();
    }

    @Test
    void activatesIssuedNonExpiredCodeAndRetriesSameSubjectIdempotently() {
        Tenant tenant = seedTenant();
        Cohort cohort = seedWaveOne(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, cohort, ISSUED_AT.plusSeconds(86_400));
        ActivationSubjectRef subjectRef = subjectRef('1');
        String enteredVariant = issuedCode.code().toLowerCase(Locale.ROOT).replace("-", " ");

        InviteActivationResult result = inviteCodeAccessService.activate(enteredVariant, subjectRef, ACTIVATED_AT);
        InviteActivationResult retry = inviteCodeAccessService.activate(
                issuedCode.code(),
                subjectRef,
                ACTIVATED_AT.plusSeconds(5)
        );

        assertThat(result.inviteCodeId()).isEqualTo(issuedCode.inviteCodeId());
        assertThat(result.tenantId()).isEqualTo(tenant.getId());
        assertThat(result.cohortId()).isEqualTo(cohort.getId());
        assertThat(result.activationSubjectRef()).isEqualTo(subjectRef.value());
        assertThat(result.idempotentRetry()).isFalse();
        assertThat(retry.inviteCodeId()).isEqualTo(issuedCode.inviteCodeId());
        assertThat(retry.idempotentRetry()).isTrue();
        assertActivatedInDatabase(issuedCode.inviteCodeId(), subjectRef);
    }

    @Test
    void rejectsInvalidExpiredRevokedAndUnissuedActivationPaths() {
        Tenant tenant = seedTenant();
        Cohort cohort = seedWaveOne(tenant, 10);

        assertActivationFailure("   ", subjectRef('1'), ACTIVATED_AT, InviteActivationFailureReason.INVALID_CODE);

        IssuedInviteCode expiredCode = issueOne(tenant, cohort, ISSUED_AT.plusSeconds(60));
        assertActivationFailure(
                expiredCode.code(),
                subjectRef('1'),
                ISSUED_AT.plusSeconds(61),
                InviteActivationFailureReason.EXPIRED_CODE
        );

        IssuedInviteCode revokedCode = issueOne(tenant, cohort, ISSUED_AT.plusSeconds(86_400));
        updateInviteStatus(revokedCode.inviteCodeId(), "REVOKED");
        assertActivationFailure(
                revokedCode.code(),
                subjectRef('1'),
                ACTIVATED_AT,
                InviteActivationFailureReason.REVOKED_CODE
        );

        String unissuedCode = new InviteCodeGenerator().generate();
        inviteCodeRepository.saveAndFlush(InviteCode.created(
                tenant,
                cohort,
                InviteCodeHash.fromEnteredCode(unissuedCode)
        ));
        assertActivationFailure(
                unissuedCode,
                subjectRef('1'),
                ACTIVATED_AT,
                InviteActivationFailureReason.UNISSUED_CODE
        );
    }

    @Test
    void rejectsDifferentSubjectAfterActivation() {
        Tenant tenant = seedTenant();
        Cohort cohort = seedWaveOne(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, cohort, ISSUED_AT.plusSeconds(86_400));

        inviteCodeAccessService.activate(issuedCode.code(), subjectRef('1'), ACTIVATED_AT);

        assertActivationFailure(
                issuedCode.code(),
                subjectRef('2'),
                ACTIVATED_AT.plusSeconds(1),
                InviteActivationFailureReason.ALREADY_ACTIVATED_BY_ANOTHER_SUBJECT
        );
    }

    @Test
    void concurrentDifferentSubjectActivationAllowsOnlyOneBinding() throws Exception {
        Tenant tenant = seedTenant();
        Cohort cohort = seedWaveOne(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, cohort, ISSUED_AT.plusSeconds(86_400));
        ActivationSubjectRef firstSubject = subjectRef('1');
        ActivationSubjectRef secondSubject = subjectRef('2');
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);
        ExecutorService executor = Executors.newFixedThreadPool(2);

        try {
            Future<ActivationAttempt> first = executor.submit(
                    activationAttempt(issuedCode.code(), firstSubject, ready, start)
            );
            Future<ActivationAttempt> second = executor.submit(
                    activationAttempt(issuedCode.code(), secondSubject, ready, start)
            );

            if (!ready.await(5, TimeUnit.SECONDS)) {
                fail("Activation attempts did not reach the concurrency gate.");
            }
            start.countDown();

            List<ActivationAttempt> attempts = List.of(first.get(10, TimeUnit.SECONDS), second.get(10, TimeUnit.SECONDS));

            assertThat(attempts.stream().filter(ActivationAttempt::activated).count()).isEqualTo(1);
            assertThat(attempts.stream()
                    .filter(attempt -> !attempt.activated())
                    .map(ActivationAttempt::failureReason)
                    .toList()).containsExactly(InviteActivationFailureReason.ALREADY_ACTIVATED_BY_ANOTHER_SUBJECT);
            assertThat(jdbcTemplate.queryForObject("""
                    select count(*)
                    from invite_codes
                    where id = ?
                      and status = 'ACTIVATED'
                      and activation_subject_ref in (?, ?)
                    """, Integer.class, issuedCode.inviteCodeId(), firstSubject.value(), secondSubject.value()))
                    .isEqualTo(1);
        } finally {
            executor.shutdownNow();
        }
    }

    private Callable<ActivationAttempt> activationAttempt(
            String code,
            ActivationSubjectRef subjectRef,
            CountDownLatch ready,
            CountDownLatch start
    ) {
        return () -> {
            ready.countDown();
            if (!start.await(5, TimeUnit.SECONDS)) {
                fail("Activation attempt did not start.");
            }
            try {
                inviteCodeAccessService.activate(code, subjectRef, ACTIVATED_AT);
                return ActivationAttempt.succeeded();
            } catch (InviteCodeActivationException exception) {
                return ActivationAttempt.failed(exception.getReason());
            }
        };
    }

    private Tenant seedTenant() {
        return tenantRepository.saveAndFlush(Tenant.create("pilot-" + UUID.randomUUID(), "Pilot tenant"));
    }

    private Cohort seedWaveOne(Tenant tenant, int targetSize) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return cohortRepository.saveAndFlush(Cohort.createWave(
                tenant,
                "wave-" + suffix,
                "Wave 1",
                CohortKind.WAVE_1,
                targetSize
        ));
    }

    private IssuedInviteCode issueOne(Tenant tenant, Cohort cohort, Instant expiresAt) {
        return inviteCodeAccessService.issueBatch(tenant.getId(), cohort.getId(), 1, ISSUED_AT, expiresAt).get(0);
    }

    private void updateInviteStatus(UUID inviteCodeId, String status) {
        jdbcTemplate.update("""
                update invite_codes
                set status = ?,
                    updated_at = ?
                where id = ?
                """, status, Timestamp.from(ACTIVATED_AT), inviteCodeId);
    }

    private void assertHumanEnterableCode(IssuedInviteCode issuedCode) {
        if (!HUMAN_ENTERABLE_CODE.matcher(issuedCode.code()).matches()) {
            fail("Issued invite code did not match the human-enterable format.");
        }
    }

    private static void assertReturnedCodesAreOnlyOneTimeOutputs(
            List<IssuedInviteCode> issuedCodes,
            Set<String> lookupHashes
    ) {
        for (IssuedInviteCode issuedCode : issuedCodes) {
            String lookupHash = InviteCodeHash.fromEnteredCode(issuedCode.code()).value();
            if (!lookupHashes.contains(lookupHash)) {
                fail("Persisted lookup hash was missing for a returned one-time invite code.");
            }
            if (lookupHashes.contains(issuedCode.code())) {
                fail("A returned one-time invite code was persisted as a lookup value.");
            }
        }
    }

    private void assertInviteTableHasNoRawCodeColumn() {
        List<String> columns = jdbcTemplate.queryForList("""
                select column_name
                from information_schema.columns
                where table_schema = 'public'
                  and table_name = 'invite_codes'
                """, String.class);

        assertThat(columns).contains("lookup_hash");
        assertThat(columns).doesNotContain("code", "raw_code", "plain_code", "invite_code");
    }

    private void assertActivatedInDatabase(UUID inviteCodeId, ActivationSubjectRef subjectRef) {
        assertThat(jdbcTemplate.queryForObject("""
                select count(*)
                from invite_codes
                where id = ?
                  and status = 'ACTIVATED'
                  and activated_at is not null
                  and activation_subject_ref = ?
                """, Integer.class, inviteCodeId, subjectRef.value())).isEqualTo(1);
    }

    private void assertActivationFailure(
            String submittedCode,
            ActivationSubjectRef subjectRef,
            Instant activatedAt,
            InviteActivationFailureReason expectedReason
    ) {
        try {
            inviteCodeAccessService.activate(submittedCode, subjectRef, activatedAt);
            fail("Expected invite activation to fail.");
        } catch (InviteCodeActivationException exception) {
            assertThat(exception.getReason()).isEqualTo(expectedReason);
        }
    }

    private static ActivationSubjectRef subjectRef(char hexDigit) {
        return ActivationSubjectRef.fromSha256Hex(String.valueOf(hexDigit).repeat(64));
    }

    private record ActivationAttempt(boolean activated, InviteActivationFailureReason failureReason) {
        private static ActivationAttempt succeeded() {
            return new ActivationAttempt(true, null);
        }

        private static ActivationAttempt failed(InviteActivationFailureReason reason) {
            return new ActivationAttempt(false, reason);
        }
    }
}
