package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Strict MVP diagnostic allowlist exposed for the current foundation slice.")
public record DiagnosticAllowedAnswerIdsResponse(
        @Schema(description = "Allowed privacy metadata question ids.", example = "[\"Q0\"]")
        List<String> q0QuestionIds,
        @Schema(description = "Allowed Q0 metadata option ids.")
        List<String> q0OptionIds,
        @Schema(description = "Allowed self-assessment ids.", example = "[\"SA1\",\"SA2\",\"SA3\"]")
        List<String> selfAssessmentQuestionIds,
        @Schema(description = "Allowed routing question ids with option ids.")
        List<DiagnosticAllowedRoutingOptionsResponse> routingQuestionOptions
) {
}
