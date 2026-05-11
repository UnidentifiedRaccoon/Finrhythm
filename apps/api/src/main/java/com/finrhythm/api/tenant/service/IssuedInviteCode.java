package com.finrhythm.api.tenant.service;

import java.time.Instant;
import java.util.UUID;

public record IssuedInviteCode(
        UUID inviteCodeId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        String code,
        Instant expiresAt
) {
}
