package com.finrhythm.api.tenant.service;

import java.util.UUID;

public record InviteActivationResult(
        UUID inviteCodeId,
        UUID tenantId,
        UUID cohortId,
        String activationSubjectRef,
        boolean idempotentRetry
) {
}
