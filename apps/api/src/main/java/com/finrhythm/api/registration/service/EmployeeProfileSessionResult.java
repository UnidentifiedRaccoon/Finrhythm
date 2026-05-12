package com.finrhythm.api.registration.service;

import java.time.Instant;
import java.util.UUID;

public record EmployeeProfileSessionResult(
        String profileSessionToken,
        Instant expiresAt,
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        boolean contactVerifiedByRegistrationMatch
) {
}
