package com.finrhythm.api.consent.domain;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        name = "LegalDocumentType",
        description = "Current draft legal document types that can be accepted in the MVP pilot.",
        enumAsRef = true
)
public enum LegalDocumentType {
    PRIVACY_POLICY,
    PERSONAL_DATA_CONSENT,
    TERMS_OF_USE,
    FINANCIAL_DISCLAIMER
}
