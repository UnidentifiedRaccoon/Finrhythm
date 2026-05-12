package com.finrhythm.api.consent.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LegalDocumentVersionRequest", description = "One draft legal document version accepted by the employee.")
public record LegalDocumentVersionRequest(
        @Schema(
                description = "Draft legal document type. Unknown values are rejected without echoing the submitted value.",
                example = "PRIVACY_POLICY"
        )
        String documentType,

        @Schema(
                description = "Draft legal document version identifier.",
                example = "draft-2026-05-12"
        )
        String documentVersion
) {
}
