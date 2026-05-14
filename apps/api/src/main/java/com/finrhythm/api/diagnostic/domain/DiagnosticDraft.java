package com.finrhythm.api.diagnostic.domain;

import java.util.List;

public record DiagnosticDraft(
        DiagnosticQ0Metadata q0,
        List<DiagnosticSelfAssessmentAnswer> selfAssessment,
        List<DiagnosticRoutingAnswer> routingAnswers
) {
    public DiagnosticDraft {
        q0 = q0 == null ? new DiagnosticQ0Metadata(List.of()) : q0;
        selfAssessment = List.copyOf(selfAssessment == null ? List.of() : selfAssessment);
        routingAnswers = List.copyOf(routingAnswers == null ? List.of() : routingAnswers);
    }
}
