package com.finrhythm.api.consent.service;

import com.finrhythm.api.consent.domain.LegalDocumentType;

import java.time.Instant;

public record AcceptedLegalDocument(
        LegalDocumentType documentType,
        String documentVersion,
        Instant acceptedAt,
        String source
) {
}
