package com.finrhythm.api.diagnostic.domain;

import java.util.List;

public record DiagnosticRoutingOptions(String id, List<String> optionIds) {
    public DiagnosticRoutingOptions {
        optionIds = List.copyOf(optionIds);
    }
}
