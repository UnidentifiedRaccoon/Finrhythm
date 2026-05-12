package com.finrhythm.api.admin.audit;

public enum AdminAccessAuditOutcome {
    SUCCESS,
    AUTHENTICATION_REQUIRED,
    PERMISSION_DENIED,
    NOT_FOUND,
    VALIDATION_FAILED,
    ERROR;

    static AdminAccessAuditOutcome fromStatusCode(int statusCode) {
        if (statusCode >= 200 && statusCode < 400) {
            return SUCCESS;
        }
        return switch (statusCode) {
            case 401 -> AUTHENTICATION_REQUIRED;
            case 403 -> PERMISSION_DENIED;
            case 404 -> NOT_FOUND;
            default -> statusCode >= 400 && statusCode < 500 ? VALIDATION_FAILED : ERROR;
        };
    }
}
