package com.finrhythm.api.tenant.service;

import lombok.Getter;

@Getter
public class InviteCodeActivationException extends RuntimeException {
    private final InviteActivationFailureReason reason;

    public InviteCodeActivationException(InviteActivationFailureReason reason, String message) {
        super(message);
        this.reason = reason;
    }
}
