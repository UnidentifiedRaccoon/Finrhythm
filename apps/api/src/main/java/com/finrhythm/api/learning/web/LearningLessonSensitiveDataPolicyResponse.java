package com.finrhythm.api.learning.web;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "LearningLessonSensitiveDataPolicyResponse", description = "Sensitive data boundary shown with the lesson.")
public record LearningLessonSensitiveDataPolicyResponse(
        @ArraySchema(arraySchema = @Schema(description = "Data categories not required for this lesson."))
        List<String> notRequired,
        @Schema(description = "Employee-facing HR reporting boundary.")
        String hrReportingBoundary,
        @Schema(description = "Educational, non-advisory boundary.")
        String adviceBoundary
) {
}
