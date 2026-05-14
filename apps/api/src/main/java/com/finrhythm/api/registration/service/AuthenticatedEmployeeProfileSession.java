package com.finrhythm.api.registration.service;

import java.time.Instant;
import java.util.UUID;

public record AuthenticatedEmployeeProfileSession(
        UUID employeeProfileSessionId,
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        Instant registeredAt
) {
}
