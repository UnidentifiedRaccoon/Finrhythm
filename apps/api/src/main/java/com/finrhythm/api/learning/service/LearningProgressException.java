package com.finrhythm.api.learning.service;

import com.finrhythm.api.common.web.ApiException;
import com.finrhythm.api.common.web.ApiFieldError;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class LearningProgressException extends ApiException {
    private final LearningProgressFailureReason reason;

    public LearningProgressException(
            HttpStatus status,
            LearningProgressFailureReason reason,
            String message,
            List<ApiFieldError> fieldErrors
    ) {
        super(status, reason.name(), message, fieldErrors);
        this.reason = reason;
    }
}
