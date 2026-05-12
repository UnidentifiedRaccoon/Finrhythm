package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(name = "EmployeeProfileSessionResponse", description = "One-time-visible employee profile session token response.")
public record EmployeeProfileSessionResponse(
        @Schema(description = "Opaque non-JWT profile-session token. Returned only in this creation response.", example = "UdfH5yTtfAq5mthWScNgWc2Q64PsAVtmFZEnpK9ClPg")
        String profileSessionToken,

        @Schema(description = "Timestamp when this profile session expires.", example = "2026-05-12T10:15:00Z")
        Instant expiresAt,

        @Schema(description = "Existing employee registration identifier scoped to this session.", example = "11111111-1111-4111-8111-111111111111")
        UUID employeeRegistrationId,

        @Schema(description = "Tenant that owns the registration.", example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(description = "Pilot launch associated with the registration.", example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(description = "Access pool associated with the registration.", example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @Schema(description = "True only when submitted contact matched the existing registration.", example = "true")
        boolean contactVerifiedByRegistrationMatch
) {
}
