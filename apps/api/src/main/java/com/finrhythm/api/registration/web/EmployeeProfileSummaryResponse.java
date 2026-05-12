package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(name = "EmployeeProfileSummaryResponse", description = "Read-only support-safe employee registration profile summary.")
public record EmployeeProfileSummaryResponse(
        @Schema(description = "Existing employee registration identifier.", example = "11111111-1111-4111-8111-111111111111")
        UUID employeeRegistrationId,

        @Schema(description = "Normalized full name stored on the employee registration.", example = "Sample Learner")
        String fullName,

        @Schema(description = "Normalized email stored on the employee registration.", example = "learner@example.test")
        String email,

        @Schema(description = "Normalized phone stored on the employee registration.", example = "+70000000001")
        String phone,

        @Schema(description = "Tenant that owns the registration.", example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(description = "Pilot launch associated with the registration.", example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(description = "Access pool associated with the registration.", example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @Schema(description = "Timestamp when the registration was first created.", example = "2026-05-09T09:00:00Z")
        Instant registeredAt,

        @Schema(description = "True only when submitted contact matched the existing registration.", example = "true")
        boolean contactVerifiedByRegistrationMatch
) {
}
