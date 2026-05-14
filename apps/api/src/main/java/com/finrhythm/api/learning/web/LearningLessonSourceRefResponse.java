package com.finrhythm.api.learning.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LearningLessonSourceRefResponse", description = "Active local source ref for a draft lesson.")
public record LearningLessonSourceRefResponse(
        @Schema(description = "Local source path.")
        String path,
        @Schema(description = "Source title.")
        String title,
        @Schema(description = "Source human review state.", example = "required")
        String humanReview
) {
}
