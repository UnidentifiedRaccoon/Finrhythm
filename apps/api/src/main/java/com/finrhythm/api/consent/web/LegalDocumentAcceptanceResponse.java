package com.finrhythm.api.consent.web;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@Schema(
        name = "LegalDocumentAcceptanceResponse",
        description = "Result of recording the current draft legal document version set."
)
public record LegalDocumentAcceptanceResponse(
        @Schema(description = "Employee registration that accepted the draft document versions.", example = "11111111-1111-4111-8111-111111111111")
        UUID employeeRegistrationId,

        @Schema(description = "Tenant scope copied from the employee registration.", example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(description = "Pilot launch scope copied from the employee registration.", example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(description = "Access pool scope copied from the employee registration.", example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @ArraySchema(
                schema = @Schema(implementation = AcceptedLegalDocumentResponse.class),
                arraySchema = @Schema(description = "Accepted draft document metadata. Legal text bodies are never returned.")
        )
        List<AcceptedLegalDocumentResponse> acceptedDocuments,

        @Schema(description = "Number of new log rows created by this call.", example = "4")
        int createdCount,

        @Schema(description = "True when all submitted same-version acceptances already existed.", example = "false")
        boolean idempotentRetry
) {
}
