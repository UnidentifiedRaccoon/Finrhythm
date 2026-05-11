package com.finrhythm.api.registration.service;

import com.finrhythm.api.common.web.ApiException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class EmployeeRegistrationException extends ApiException {
    private final EmployeeRegistrationFailureReason reason;

    public EmployeeRegistrationException(EmployeeRegistrationFailureReason reason, String message) {
        super(HttpStatus.BAD_REQUEST, reason.name(), message, List.of());
        this.reason = reason;
    }

    public EmployeeRegistrationException(EmployeeRegistrationFailureReason reason, String message, Throwable cause) {
        super(HttpStatus.BAD_REQUEST, reason.name(), message, cause, List.of());
        this.reason = reason;
    }
}
