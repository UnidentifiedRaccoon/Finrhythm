package com.finrhythm.api.admin.service;

import org.springframework.http.HttpStatus;

import java.util.List;

public class AdminCodeStatusException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;
    private final List<AdminCodeStatusFieldViolation> fieldViolations;

    private AdminCodeStatusException(
            HttpStatus httpStatus,
            String code,
            String message,
            List<AdminCodeStatusFieldViolation> fieldViolations
    ) {
        super(message);
        this.httpStatus = httpStatus;
        this.code = code;
        this.fieldViolations = List.copyOf(fieldViolations);
    }

    public static AdminCodeStatusException notFound() {
        return new AdminCodeStatusException(
                HttpStatus.NOT_FOUND,
                "COHORT_STATUS_VIEW_NOT_FOUND",
                "Cohort status view was not found.",
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
                List.of(new AdminCodeStatusFieldViolation(field, validationCode, message))
        );
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getCode() {
        return code;
    }

    public List<AdminCodeStatusFieldViolation> getFieldViolations() {
        return fieldViolations;
    }
}
