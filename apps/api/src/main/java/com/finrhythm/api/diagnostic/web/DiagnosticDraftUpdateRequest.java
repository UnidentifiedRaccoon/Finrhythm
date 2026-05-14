package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Strict diagnostic draft update payload. Unknown fields are rejected.")
public record DiagnosticDraftUpdateRequest(
        @Schema(description = "Q0 privacy/expectation metadata.")
        DiagnosticQ0MetadataRequest q0,
        @Schema(description = "SA1-SA3 self-assessment values from 1 to 5.")
        List<DiagnosticSelfAssessmentAnswerRequest> selfAssessment,
        @Schema(description = "Q1-Q3 routing-preview answers.")
        List<DiagnosticRoutingAnswerRequest> routingAnswers
) {
}
