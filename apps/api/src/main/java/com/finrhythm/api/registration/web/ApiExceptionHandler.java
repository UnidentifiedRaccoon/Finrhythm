package com.finrhythm.api.registration.web;

import com.finrhythm.api.registration.service.EmployeeRegistrationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Comparator;
import java.util.List;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(EmployeeRegistrationException.class)
    ResponseEntity<ApiErrorResponse> handleEmployeeRegistration(EmployeeRegistrationException exception) {
        return ResponseEntity.badRequest().body(ApiErrorResponse.withoutFields(
                exception.getReason().name(),
                exception.getMessage()
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        List<ApiFieldError> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
                .sorted(Comparator.comparing(FieldError::getField))
                .map(error -> new ApiFieldError(
                        error.getField(),
                        error.getCode(),
                        "Field is required or invalid."
                ))
                .toList();
        return ResponseEntity.badRequest().body(new ApiErrorResponse(
                "VALIDATION_FAILED",
                "Submitted fields are invalid.",
                fieldErrors
        ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiErrorResponse> handleUnreadableJson() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiErrorResponse.withoutFields(
                "VALIDATION_FAILED",
                "Submitted JSON is invalid."
        ));
    }
}
