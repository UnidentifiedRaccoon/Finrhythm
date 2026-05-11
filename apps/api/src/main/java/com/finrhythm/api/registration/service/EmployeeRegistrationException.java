package com.finrhythm.api.registration.service;

public class EmployeeRegistrationException extends RuntimeException {
    private final EmployeeRegistrationFailureReason reason;

    public EmployeeRegistrationException(EmployeeRegistrationFailureReason reason, String message) {
        super(message);
        this.reason = reason;
    }

    public EmployeeRegistrationException(EmployeeRegistrationFailureReason reason, String message, Throwable cause) {
        super(message, cause);
        this.reason = reason;
    }

    public EmployeeRegistrationFailureReason getReason() {
        return reason;
    }
}
