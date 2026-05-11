package com.finrhythm.api.common.web;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ApiFieldError", description = "A sanitized field-level validation error.")
public record ApiFieldError(
        @Schema(description = "Request field or parameter name.", example = "email")
        String field,

        @Schema(description = "Stable validation code.", example = "NotBlank")
        String code,

        @Schema(description = "Safe validation message that does not echo submitted PII or invite codes.", example = "Field is required or invalid.")
        String message
) {
}
