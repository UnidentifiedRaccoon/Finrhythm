package com.finrhythm.api.registration.service;

import java.time.Instant;
import java.util.UUID;

public record EmployeeRegistrationResult(
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        UUID inviteCodeId,
        Instant registeredAt,
        boolean idempotentRetry
) {
}
