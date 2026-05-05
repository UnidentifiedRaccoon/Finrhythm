package com.finrhythm.api.tenant.service;

import java.time.Instant;
import java.util.UUID;

public record IssuedInviteCode(
        UUID inviteCodeId,
        UUID tenantId,
        UUID cohortId,
        String code,
        Instant expiresAt
) {
}
