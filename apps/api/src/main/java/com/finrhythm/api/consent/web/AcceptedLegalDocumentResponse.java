package com.finrhythm.api.consent.web;

import com.finrhythm.api.consent.domain.LegalDocumentType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(name = "AcceptedLegalDocumentResponse", description = "Accepted draft legal document metadata.")
public record AcceptedLegalDocumentResponse(
        @Schema(description = "Accepted legal document type.", example = "PRIVACY_POLICY")
        LegalDocumentType documentType,

        @Schema(description = "Accepted draft document version.", example = "draft-2026-05-12")
        String documentVersion,

        @Schema(description = "Backend-recorded acceptance timestamp.", example = "2026-05-12T06:00:00Z")
        Instant acceptedAt,

        @Schema(description = "Minimal technical source without PII or invite-code data.", example = "onboarding_privacy")
        String source
) {
}
