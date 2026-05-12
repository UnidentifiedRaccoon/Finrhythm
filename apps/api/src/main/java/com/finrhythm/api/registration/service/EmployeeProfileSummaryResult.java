package com.finrhythm.api.registration.service;

import java.time.Instant;
import java.util.UUID;

public record EmployeeProfileSummaryResult(
        UUID employeeRegistrationId,
        String fullName,
        String email,
        String phone,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        Instant registeredAt,
        boolean contactVerifiedByRegistrationMatch
) {
}
