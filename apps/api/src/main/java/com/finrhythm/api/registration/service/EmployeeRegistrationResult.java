package com.finrhythm.api.registration.service;

import java.time.Instant;
import java.util.UUID;

public record EmployeeRegistrationResult(
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID cohortId,
        UUID inviteCodeId,
        Instant registeredAt,
        boolean idempotentRetry
) {
}
