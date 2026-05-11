package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(name = "EmployeeRegistrationResponse")
public record EmployeeRegistrationResponse(
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        UUID inviteCodeId,
        Instant registeredAt,
        boolean idempotentRetry
) {
}
