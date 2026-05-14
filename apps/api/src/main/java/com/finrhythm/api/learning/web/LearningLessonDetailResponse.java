package com.finrhythm.api.learning.web;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "LearningLessonDetailResponse", description = "Read-only backend-owned N1 lesson detail for mounted continuation.")
public record LearningLessonDetailResponse(
        @Schema(description = "N1-only lesson id supported by this MVP slice.", example = "N1")
        String lessonId,
        @Schema(description = "User-facing lesson display title.")
        String displayTitle,
        @Schema(description = "Short user-facing lesson title.")
        String shortTitle,
        @Schema(description = "User-facing novice track label.")
        String trackTitle,
        @Schema(description = "Educational promise without personal advice.")
        String userPromise,
        @Schema(description = "Estimated reading time.")
        String estimatedTime,
        @ArraySchema(arraySchema = @Schema(description = "Competency codes covered by this draft lesson."))
        List<String> competencyCodes,
        @Schema(description = "Disclaimer type. Education only for this slice.", example = "education")
        String disclaimerType,
        @Schema(description = "Draft review and human-gate status.")
        LearningLessonReviewResponse review,
        @Schema(description = "Active methodology and GetCourse source refs.")
        LearningLessonProvenanceResponse provenance,
        @Schema(description = "Sensitive learning-data boundary.")
        LearningLessonSensitiveDataPolicyResponse sensitiveDataPolicy,
        @ArraySchema(
                schema = @Schema(implementation = LearningLessonBlockResponse.class),
                arraySchema = @Schema(description = "Display-only lesson blocks.")
        )
        List<LearningLessonBlockResponse> blocks
) {
}
