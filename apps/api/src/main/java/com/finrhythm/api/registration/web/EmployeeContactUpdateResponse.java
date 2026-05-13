package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "EmployeeContactUpdateResponse", description = "Profile-session scoped employee contact update result.")
public record EmployeeContactUpdateResponse(
        @Schema(description = "Existing employee registration identifier.", example = "11111111-1111-4111-8111-111111111111")
        UUID employeeRegistrationId,

        @Schema(description = "Normalized full name stored on the employee registration. This endpoint never mutates it.", example = "Sample Learner")
        String fullName,

        @Schema(description = "Current normalized email after the accepted attempt.", example = "learner.new@example.test")
        String email,

        @Schema(description = "Current normalized phone after the accepted attempt.", example = "+70000000002")
        String phone,

        @Schema(description = "Tenant that owns the registration.", example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(description = "Pilot launch associated with the registration.", example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(description = "Access pool associated with the registration.", example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @Schema(description = "Timestamp when the registration was first created.", example = "2026-05-09T09:00:00Z")
        Instant registeredAt,

        @Schema(description = "True when normalized email or phone changed.", example = "true")
        boolean changed,

        @Schema(description = "Accepted attempt outcome.", allowableValues = {"updated", "noop"}, example = "updated")
        String outcome,

        @Schema(description = "Normalized contact fields that changed in this attempt.", example = "[\"email\", \"phone\"]")
        List<String> changedFields,

        @Schema(description = "True because the profile-session bearer token resolved to this registration.", example = "true")
        boolean contactVerifiedByProfileSession
) {
    public EmployeeContactUpdateResponse {
        changedFields = List.copyOf(changedFields);
    }
}
