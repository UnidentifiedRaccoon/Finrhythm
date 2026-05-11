package com.finrhythm.api.admin.service;

public record AdminCodeStatusFieldViolation(
        String field,
        String code,
        String message
) {
}
