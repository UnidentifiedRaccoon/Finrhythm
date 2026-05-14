package com.finrhythm.api.learning.domain;

public record LearningLessonBlock(
        String blockId,
        String blockType,
        String title,
        String body,
        boolean displayOnly,
        boolean sensitiveDataNotice,
        String ctaLabel
) {
}
