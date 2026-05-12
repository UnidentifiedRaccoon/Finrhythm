package com.finrhythm.api.consent.service;

public record LegalAcceptanceDocumentCommand(
        String documentType,
        String documentVersion
) {
}
