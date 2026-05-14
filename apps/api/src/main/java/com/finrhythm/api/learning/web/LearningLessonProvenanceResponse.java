package com.finrhythm.api.learning.web;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "LearningLessonProvenanceResponse", description = "Active methodology and content source refs for a draft lesson.")
public record LearningLessonProvenanceResponse(
        @Schema(description = "Canonical methodology ref for N1.")
        String methodologyRef,
        @Schema(description = "Active GetCourse source root.")
        String activeSourceRoot,
        @Schema(description = "Active content brief ref.")
        String contentBriefRef,
        @Schema(description = "Active content baseline manifest ref.")
        String sourceManifestRef,
        @ArraySchema(
                schema = @Schema(implementation = LearningLessonSourceRefResponse.class),
                arraySchema = @Schema(description = "Source lesson refs used for this draft.")
        )
        List<LearningLessonSourceRefResponse> sourceRefs
) {
}
