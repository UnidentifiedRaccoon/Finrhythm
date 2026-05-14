package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Allowed option ids for one routing question.")
public record DiagnosticAllowedRoutingOptionsResponse(
        @Schema(description = "Routing question id.", example = "Q1")
        String id,
        @Schema(description = "Allowed option ids for the question.", example = "[\"A\",\"B\",\"C\",\"D\"]")
        List<String> optionIds
) {
}
