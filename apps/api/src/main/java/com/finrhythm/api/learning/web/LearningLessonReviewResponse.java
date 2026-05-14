package com.finrhythm.api.learning.web;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "LearningLessonReviewResponse", description = "Draft review flags for N1 content.")
public record LearningLessonReviewResponse(
        @Schema(description = "Current draft review status.", example = "method_adapted")
        String reviewStatus,
        @Schema(description = "True because final financial/content review remains human-gated.")
        boolean humanReviewRequired,
        @Schema(description = "False until the production content approval gate is closed.")
        boolean productionReady,
        @Schema(description = "Wording review state.", example = "required")
        String wordingReviewStatus,
        @Schema(description = "Financial review state.", example = "required")
        String financialReviewStatus,
        @Schema(description = "Legal review state.", example = "required")
        String legalReviewStatus,
        @Schema(description = "HR wording review state.", example = "required")
        String hrWordingReviewStatus,
        @ArraySchema(arraySchema = @Schema(description = "Human-gate and draft-status notes."))
        List<String> notes
) {
}
