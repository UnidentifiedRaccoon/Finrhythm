package com.finrhythm.api.common.web;

import org.springframework.core.convert.ConversionFailedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Comparator;
import java.util.List;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<ApiErrorResponse> handleApiException(ApiException exception) {
        return ResponseEntity.status(exception.getHttpStatus()).body(new ApiErrorResponse(
                exception.getCode(),
                exception.getMessage(),
                exception.getFieldErrors()
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

    @ExceptionHandler({MethodArgumentTypeMismatchException.class, ConversionFailedException.class})
    ResponseEntity<ApiErrorResponse> handleTypeMismatch(Exception exception) {
        return ResponseEntity.badRequest().body(new ApiErrorResponse(
                "VALIDATION_FAILED",
                "Request parameters are invalid.",
                List.of(new ApiFieldError(fieldName(exception), "TYPE_MISMATCH", "Parameter is invalid."))
        ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiErrorResponse> handleUnreadableJson() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiErrorResponse.withoutFields(
                "VALIDATION_FAILED",
                "Submitted JSON is invalid."
        ));
    }

    private static String fieldName(Exception exception) {
        if (exception instanceof MethodArgumentTypeMismatchException mismatch && mismatch.getName() != null) {
            return mismatch.getName();
        }
        return "request";
    }
}
