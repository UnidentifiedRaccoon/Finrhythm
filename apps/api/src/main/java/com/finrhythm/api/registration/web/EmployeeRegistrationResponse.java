package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(name = "EmployeeRegistrationResponse", description = "Result of an employee registration attempt.")
public record EmployeeRegistrationResponse(
        @Schema(description = "Created or existing employee registration identifier.", example = "11111111-1111-4111-8111-111111111111")
        UUID employeeRegistrationId,

        @Schema(description = "Tenant that owns the accepted invite code.", example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(description = "Pilot launch associated with the accepted invite code.", example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(description = "Access pool associated with the accepted invite code.", example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @Schema(description = "Invite-code row identifier. Raw invite codes are never returned.", example = "44444444-4444-4444-8444-444444444444")
        UUID inviteCodeId,

        @Schema(description = "Timestamp when the registration was first created.", example = "2026-05-09T09:00:00Z")
        Instant registeredAt,

        @Schema(description = "True when the response represents a retry with the same invite and same contact.", example = "false")
        boolean idempotentRetry
) {
}
