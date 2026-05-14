package com.finrhythm.api.diagnostic.service;

import com.finrhythm.api.common.web.ApiException;
import com.finrhythm.api.common.web.ApiFieldError;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class DiagnosticAttemptException extends ApiException {
    private final DiagnosticAttemptFailureReason reason;

    public DiagnosticAttemptException(DiagnosticAttemptFailureReason reason, String message) {
        this(HttpStatus.BAD_REQUEST, reason, message, List.of());
    }

    public DiagnosticAttemptException(
            HttpStatus status,
            DiagnosticAttemptFailureReason reason,
            String message
    ) {
        this(status, reason, message, List.of());
    }

    public DiagnosticAttemptException(
            HttpStatus status,
            DiagnosticAttemptFailureReason reason,
            String message,
            List<ApiFieldError> fieldErrors
    ) {
        super(status, reason.name(), message, fieldErrors);
        this.reason = reason;
    }
}
