package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "ApiErrorResponse")
public record ApiErrorResponse(
        @Schema(example = "INVALID_INVITE_CODE")
        String code,

        @Schema(example = "Invite code is invalid.")
        String message,

        List<ApiFieldError> fieldErrors
) {
    public static ApiErrorResponse withoutFields(String code, String message) {
        return new ApiErrorResponse(code, message, List.of());
    }
}
