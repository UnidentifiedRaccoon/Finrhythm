package com.finrhythm.api.diagnostic.domain;

import java.util.List;

public record DiagnosticQ0Metadata(List<String> selectedOptionIds) {
    public DiagnosticQ0Metadata {
        selectedOptionIds = List.copyOf(selectedOptionIds == null ? List.of() : selectedOptionIds);
    }
}
