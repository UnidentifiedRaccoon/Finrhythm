package com.finrhythm.api.tenant.service;

public class InviteCodeActivationException extends RuntimeException {
    private final InviteActivationFailureReason reason;

    public InviteCodeActivationException(InviteActivationFailureReason reason, String message) {
        super(message);
        this.reason = reason;
    }

    public InviteActivationFailureReason getReason() {
        return reason;
    }
}
