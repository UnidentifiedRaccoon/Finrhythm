package com.finrhythm.api.consent.service;

import com.finrhythm.api.common.web.ApiException;
import com.finrhythm.api.common.web.ApiFieldError;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class LegalAcceptanceException extends ApiException {
    private final LegalAcceptanceFailureReason reason;

    LegalAcceptanceException(
            HttpStatus httpStatus,
            LegalAcceptanceFailureReason reason,
            String message,
            List<ApiFieldError> fieldErrors
    ) {
        super(httpStatus, reason.name(), message, fieldErrors);
        this.reason = reason;
    }
}
