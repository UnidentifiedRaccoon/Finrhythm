package com.finrhythm.api.learning.domain;

import java.util.List;

public record LearningLessonSensitiveDataPolicy(
        List<String> notRequired,
        String hrReportingBoundary,
        String adviceBoundary
) {
    public LearningLessonSensitiveDataPolicy {
        notRequired = List.copyOf(notRequired);
    }
}
