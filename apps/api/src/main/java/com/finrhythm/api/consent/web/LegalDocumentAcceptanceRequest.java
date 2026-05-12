package com.finrhythm.api.consent.web;

import com.finrhythm.api.consent.service.LegalAcceptanceCommand;
import com.finrhythm.api.consent.service.LegalAcceptanceDocumentCommand;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(
        name = "LegalDocumentAcceptanceRequest",
        description = "Current draft legal document version set accepted for one employee registration."
)
public record LegalDocumentAcceptanceRequest(
        @ArraySchema(
                minItems = 4,
                maxItems = 4,
                schema = @Schema(implementation = LegalDocumentVersionRequest.class),
                arraySchema = @Schema(description = "Accepted current draft document versions.")
        )
        List<LegalDocumentVersionRequest> documents,

        @Schema(
                description = "Minimal technical acceptance source. Defaults to onboarding_privacy when omitted.",
                example = "onboarding_privacy"
        )
        String source
) {
    LegalAcceptanceCommand toCommand() {
        return new LegalAcceptanceCommand(
                documents == null ? null : documents.stream()
                        .map(document -> new LegalAcceptanceDocumentCommand(
                                document == null ? null : document.documentType(),
                                document == null ? null : document.documentVersion()
                        ))
                        .toList(),
                source
        );
    }
}
