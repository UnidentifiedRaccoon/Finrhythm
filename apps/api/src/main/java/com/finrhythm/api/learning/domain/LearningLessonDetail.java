package com.finrhythm.api.learning.domain;

import java.util.List;

public record LearningLessonDetail(
        String lessonId,
        String displayTitle,
        String shortTitle,
        String trackTitle,
        String userPromise,
        String estimatedTime,
        List<String> competencyCodes,
        String disclaimerType,
        LearningLessonReview review,
        LearningLessonProvenance provenance,
        LearningLessonSensitiveDataPolicy sensitiveDataPolicy,
        List<LearningLessonBlock> blocks
) {
    public LearningLessonDetail {
        competencyCodes = List.copyOf(competencyCodes);
        blocks = List.copyOf(blocks);
    }
}
