package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ApiFieldError")
public record ApiFieldError(
        @Schema(example = "email")
        String field,

        @Schema(example = "NotBlank")
        String code,

        @Schema(example = "Field is required or invalid.")
        String message
) {
}
