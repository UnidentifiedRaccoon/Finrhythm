package com.finrhythm.api.tenant.service;

public enum InviteActivationFailureReason {
    INVALID_CODE,
    EXPIRED_CODE,
    REVOKED_CODE,
    UNISSUED_CODE,
    ALREADY_ACTIVATED_BY_ANOTHER_SUBJECT
}
