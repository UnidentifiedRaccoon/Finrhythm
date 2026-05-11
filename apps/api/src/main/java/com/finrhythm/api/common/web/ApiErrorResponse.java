package com.finrhythm.api.common.web;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "ApiErrorResponse", description = "A sanitized API error response.")
public record ApiErrorResponse(
        @Schema(description = "Stable machine-readable error code.", example = "VALIDATION_FAILED")
        String code,

        @Schema(description = "Safe human-readable message that does not echo submitted PII or invite codes.", example = "Request parameters are invalid.")
        String message,

        @ArraySchema(
                schema = @Schema(implementation = ApiFieldError.class),
                arraySchema = @Schema(description = "Field-level validation errors, empty when not applicable.")
        )
        List<ApiFieldError> fieldErrors
) {
    public ApiErrorResponse {
        fieldErrors = fieldErrors == null ? List.of() : List.copyOf(fieldErrors);
    }

    public static ApiErrorResponse withoutFields(String code, String message) {
        return new ApiErrorResponse(code, message, List.of());
    }
}
