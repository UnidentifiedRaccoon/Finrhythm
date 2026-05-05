package com.finrhythm.api.tenant;

import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.Cohort;
import com.finrhythm.api.tenant.domain.CohortKind;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import com.finrhythm.api.tenant.domain.Tenant;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TenantDomainTest {
    private static final String HASH_A = "a".repeat(64);
    private static final String HASH_B = "b".repeat(64);

    @Test
    void supportsWaveZeroAndWaveOneSizingWithoutGeneratingCodes() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");

        Cohort waveZero = Cohort.createWave(tenant, "wave-0", "Wave 0", CohortKind.WAVE_0, 50);
        Cohort waveOne = Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500);

        assertThat(waveZero.getTargetSize()).isEqualTo(50);
        assertThat(waveOne.getTargetSize()).isEqualTo(500);
    }

    @Test
    void rejectsInvalidWaveTargetSize() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");

        assertThatThrownBy(() -> Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("target size");
    }

    @Test
    void inviteCodeMustReferenceCohortFromSameTenant() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");
        Tenant otherTenant = Tenant.create("other-pilot", "Other pilot");
        Cohort cohort = Cohort.createWave(tenant, "wave-0", "Wave 0", CohortKind.WAVE_0, 50);

        assertThatThrownBy(() -> InviteCode.created(
                otherTenant,
                cohort,
                InviteCodeHash.fromSha256Hex(HASH_A)
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("same tenant");
    }

    @Test
    void inviteLookupHashMustBeSha256HexOnly() {
        assertThat(InviteCodeHash.fromSha256Hex(HASH_A.toUpperCase()).value()).isEqualTo(HASH_A);

        assertThatThrownBy(() -> InviteCodeHash.fromSha256Hex("raw-invite-code"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("SHA-256");
    }

    @Test
    void activatedInviteRequiresIssuedAndActivatedTimestamps() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");
        Cohort cohort = Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500);
        Instant issuedAt = Instant.parse("2026-05-04T09:00:00Z");

        assertThatThrownBy(() -> InviteCode.activated(
                tenant,
                cohort,
                InviteCodeHash.fromSha256Hex(HASH_A),
                issuedAt,
                null,
                ActivationSubjectRef.fromSha256Hex(HASH_B)
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("activatedAt");
    }

    @Test
    void issuedInviteHasLifecycleStatusPreparedForLaterActivation() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");
        Cohort cohort = Cohort.createWave(tenant, "wave-1", "Wave 1", CohortKind.WAVE_1, 500);
        InviteCode inviteCode = InviteCode.issued(
                tenant,
                cohort,
                InviteCodeHash.fromSha256Hex(HASH_B),
                Instant.parse("2026-05-04T09:00:00Z"),
                Instant.parse("2026-06-04T09:00:00Z")
        );

        assertThat(inviteCode.getStatus()).isEqualTo(InviteCodeStatus.ISSUED);
        assertThat(inviteCode.getLookupHash()).isEqualTo(HASH_B);
    }
}
