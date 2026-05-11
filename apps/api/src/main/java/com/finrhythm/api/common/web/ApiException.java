package com.finrhythm.api.common.web;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public abstract class ApiException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;
    private final List<ApiFieldError> fieldErrors;

    protected ApiException(HttpStatus httpStatus, String code, String message, List<ApiFieldError> fieldErrors) {
        super(message);
        this.httpStatus = httpStatus;
        this.code = code;
        this.fieldErrors = List.copyOf(fieldErrors);
    }

    protected ApiException(
            HttpStatus httpStatus,
            String code,
            String message,
            Throwable cause,
            List<ApiFieldError> fieldErrors
    ) {
        super(message, cause);
        this.httpStatus = httpStatus;
        this.code = code;
        this.fieldErrors = List.copyOf(fieldErrors);
    }
}
