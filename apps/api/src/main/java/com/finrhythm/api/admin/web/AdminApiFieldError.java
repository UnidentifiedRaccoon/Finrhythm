package com.finrhythm.api.admin.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminApiFieldError")
public record AdminApiFieldError(
        @Schema(example = "status")
        String field,

        @Schema(example = "ENUM")
        String code,

        @Schema(example = "Parameter is invalid.")
        String message
) {
}
