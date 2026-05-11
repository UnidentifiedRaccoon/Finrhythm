package com.finrhythm.api.admin.service;

import com.finrhythm.api.common.web.ApiException;
import com.finrhythm.api.common.web.ApiFieldError;
import org.springframework.http.HttpStatus;

import java.util.List;

public class AdminCodeStatusException extends ApiException {
    private AdminCodeStatusException(
            HttpStatus httpStatus,
            String code,
            String message,
            List<ApiFieldError> fieldErrors
    ) {
        super(httpStatus, code, message, fieldErrors);
    }

    public static AdminCodeStatusException notFound() {
        return new AdminCodeStatusException(
                HttpStatus.NOT_FOUND,
                "ACCESS_POOL_STATUS_VIEW_NOT_FOUND",
                "Access-pool status view was not found.",
                List.of()
        );
    }

    public static AdminCodeStatusException invalidParameter(
            String field,
            String validationCode,
            String message
    ) {
        return new AdminCodeStatusException(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_FAILED",
                "Request parameters are invalid.",
                List.of(new ApiFieldError(field, validationCode, message))
        );
    }
}
