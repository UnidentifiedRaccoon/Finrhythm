package com.finrhythm.api.admin.web;

import com.finrhythm.api.admin.service.AdminCodeStatusException;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice(assignableTypes = AdminCodeStatusController.class)
public class AdminCodeStatusExceptionHandler {
    @ExceptionHandler(AdminCodeStatusException.class)
    ResponseEntity<AdminApiErrorResponse> handleAdminCodeStatus(AdminCodeStatusException exception) {
        return ResponseEntity.status(exception.getHttpStatus()).body(new AdminApiErrorResponse(
                exception.getCode(),
                exception.getMessage(),
                exception.getFieldViolations().stream()
                        .map(violation -> new AdminApiFieldError(
                                violation.field(),
                                violation.code(),
                                violation.message()
                        ))
                        .toList()
        ));
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class, ConversionFailedException.class})
    ResponseEntity<AdminApiErrorResponse> handleTypeMismatch(Exception exception) {
        return ResponseEntity.badRequest().body(new AdminApiErrorResponse(
                "VALIDATION_FAILED",
                "Request parameters are invalid.",
                java.util.List.of(new AdminApiFieldError(fieldName(exception), "TYPE_MISMATCH", "Parameter is invalid."))
        ));
    }

    private static String fieldName(Exception exception) {
        if (exception instanceof MethodArgumentTypeMismatchException mismatch && mismatch.getName() != null) {
            return mismatch.getName();
        }
        return "request";
    }
}
