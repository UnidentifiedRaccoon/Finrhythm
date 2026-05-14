package com.finrhythm.api.diagnostic.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record DiagnosticAttempt(
        UUID attemptId,
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        DiagnosticAttemptState state,
        DiagnosticQ0Metadata q0,
        List<DiagnosticSelfAssessmentAnswer> selfAssessment,
        List<DiagnosticRoutingAnswer> routingAnswers,
        boolean routePreview,
        String recommendedFirstLessonId,
        Instant createdAt,
        Instant updatedAt,
        Instant submittedAt
) {
    public DiagnosticAttempt {
        q0 = q0 == null ? new DiagnosticQ0Metadata(List.of()) : q0;
        selfAssessment = List.copyOf(selfAssessment == null ? List.of() : selfAssessment);
        routingAnswers = List.copyOf(routingAnswers == null ? List.of() : routingAnswers);
    }
}
