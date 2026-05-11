package com.finrhythm.api.tenant;

import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import com.finrhythm.api.tenant.domain.PilotLaunch;
import com.finrhythm.api.tenant.domain.Tenant;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TenantDomainTest {
    private static final String HASH_A = "a".repeat(64);
    private static final String HASH_B = "b".repeat(64);

    @Test
    void supportsPilotLaunchAndAccessPoolSizingWithoutGeneratingCodes() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");

        PilotLaunch pilotLaunch = PilotLaunch.create(tenant, "pilot-launch-main", "Pilot launch main", 500);
        AccessPool accessPool = AccessPool.create(
                tenant,
                pilotLaunch,
                "access-pool-main",
                "Access pool main",
                500
        );

        assertThat(pilotLaunch.getTargetSize()).isEqualTo(500);
        assertThat(accessPool.getCapacity()).isEqualTo(500);
    }

    @Test
    void rejectsInvalidAccessPoolCapacity() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");
        PilotLaunch pilotLaunch = PilotLaunch.create(tenant, "pilot-launch-main", "Pilot launch main", 500);

        assertThatThrownBy(() -> AccessPool.create(tenant, pilotLaunch, "access-pool-main", "Access pool main", 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("capacity");
    }

    @Test
    void inviteCodeMustReferenceAccessPoolFromSameTenant() {
        Tenant tenant = Tenant.create("pilot-tenant", "Pilot tenant");
        Tenant otherTenant = Tenant.create("other-pilot", "Other pilot");
        PilotLaunch pilotLaunch = PilotLaunch.create(tenant, "pilot-launch-main", "Pilot launch main", 500);
        AccessPool accessPool = AccessPool.create(
                tenant,
                pilotLaunch,
                "access-pool-main",
                "Access pool main",
                500
        );

        assertThatThrownBy(() -> InviteCode.created(
                otherTenant,
                accessPool,
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
        PilotLaunch pilotLaunch = PilotLaunch.create(tenant, "pilot-launch-main", "Pilot launch main", 500);
        AccessPool accessPool = AccessPool.create(tenant, pilotLaunch, "access-pool-main", "Access pool main", 500);
        Instant issuedAt = Instant.parse("2026-05-04T09:00:00Z");

        assertThatThrownBy(() -> InviteCode.activated(
                tenant,
                accessPool,
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
        PilotLaunch pilotLaunch = PilotLaunch.create(tenant, "pilot-launch-main", "Pilot launch main", 500);
        AccessPool accessPool = AccessPool.create(tenant, pilotLaunch, "access-pool-main", "Access pool main", 500);
        InviteCode inviteCode = InviteCode.issued(
                tenant,
                accessPool,
                InviteCodeHash.fromSha256Hex(HASH_B),
                Instant.parse("2026-05-04T09:00:00Z"),
                Instant.parse("2026-06-04T09:00:00Z")
        );

        assertThat(inviteCode.getStatus()).isEqualTo(InviteCodeStatus.ISSUED);
        assertThat(inviteCode.getLookupHash()).isEqualTo(HASH_B);
    }
}
