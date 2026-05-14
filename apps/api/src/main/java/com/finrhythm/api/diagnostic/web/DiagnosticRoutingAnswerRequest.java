package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Q1-Q3 routing-preview answer request.")
public record DiagnosticRoutingAnswerRequest(
        @Schema(description = "Routing question id.", example = "Q1")
        String id,
        @Schema(description = "Selected option id.", example = "B")
        String optionId
) {
}
