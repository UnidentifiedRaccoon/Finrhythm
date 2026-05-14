package com.finrhythm.api.learning.domain;

public record LearningRouteProgressSummary(
        LearningRouteDiagnosticState diagnosticState,
        boolean routePreview,
        String recommendedFirstLessonId,
        LearningRouteN1Progress n1,
        LearningRouteNextAction nextAction
) {
}
