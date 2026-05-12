package com.finrhythm.api.consent.service;

import java.util.List;
import java.util.UUID;

public record LegalAcceptanceResult(
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        List<AcceptedLegalDocument> acceptedDocuments,
        int createdCount,
        boolean idempotentRetry
) {
    public LegalAcceptanceResult {
        acceptedDocuments = List.copyOf(acceptedDocuments);
    }
}
