package com.finrhythm.api.admin.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "AdminApiErrorResponse")
public record AdminApiErrorResponse(
        @Schema(example = "VALIDATION_FAILED")
        String code,

        @Schema(example = "Request parameters are invalid.")
        String message,

        List<AdminApiFieldError> fieldErrors
) {
    static AdminApiErrorResponse withoutFields(String code, String message) {
        return new AdminApiErrorResponse(code, message, List.of());
    }
}
