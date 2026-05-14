package com.finrhythm.api.diagnostic.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Q0 privacy/expectation metadata request.")
public record DiagnosticQ0MetadataRequest(
        @Schema(
                description = "Selected allowlisted Q0 option ids.",
                example = "[\"WHO_SEES_ANSWERS\",\"READY_TO_START\"]"
        )
        List<String> selectedOptionIds
) {
}
