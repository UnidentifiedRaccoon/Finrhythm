package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "SA1-SA3 self-assessment answer request.")
public record DiagnosticSelfAssessmentAnswerRequest(
        @Schema(description = "Self-assessment id.", example = "SA1")
        String id,
        @Schema(description = "Scale value from 1 to 5.", example = "4", minimum = "1", maximum = "5")
        Integer value
) {
}
