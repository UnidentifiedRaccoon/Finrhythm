package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Q0 privacy/expectation metadata response.")
public record DiagnosticQ0MetadataResponse(
        @Schema(description = "Q0 question id.", example = "Q0")
        String id,
        @Schema(description = "Selected allowlisted Q0 option ids.")
        List<String> selectedOptionIds
) {
}
