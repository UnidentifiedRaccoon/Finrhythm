package com.finrhythm.api.diagnostic.domain;

import java.util.List;

public record DiagnosticAllowedIds(
        List<String> q0QuestionIds,
        List<String> q0OptionIds,
        List<String> selfAssessmentQuestionIds,
        List<DiagnosticRoutingOptions> routingQuestionOptions
) {
    public DiagnosticAllowedIds {
        q0QuestionIds = List.copyOf(q0QuestionIds);
        q0OptionIds = List.copyOf(q0OptionIds);
        selfAssessmentQuestionIds = List.copyOf(selfAssessmentQuestionIds);
        routingQuestionOptions = List.copyOf(routingQuestionOptions);
    }
}
