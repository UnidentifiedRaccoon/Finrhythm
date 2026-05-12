package com.finrhythm.api.consent.service;

import java.util.List;

public record LegalAcceptanceCommand(
        List<LegalAcceptanceDocumentCommand> documents,
        String source
) {
}
