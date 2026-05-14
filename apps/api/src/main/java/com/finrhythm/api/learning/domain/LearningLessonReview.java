package com.finrhythm.api.learning.domain;

import java.util.List;

public record LearningLessonReview(
        String reviewStatus,
        boolean humanReviewRequired,
        boolean productionReady,
        String wordingReviewStatus,
        String financialReviewStatus,
        String legalReviewStatus,
        String hrWordingReviewStatus,
        List<String> notes
) {
    public LearningLessonReview {
        notes = List.copyOf(notes);
    }
}
