package com.finrhythm.api.tenant.domain;

import java.util.Locale;
import java.util.regex.Pattern;

public record ActivationSubjectRef(String value) {
    private static final Pattern OPAQUE_REF = Pattern.compile("^[a-f0-9]{64}$");

    public ActivationSubjectRef {
        if (value == null) {
            throw new IllegalArgumentException("Activation subject reference is required.");
        }
        value = value.toLowerCase(Locale.ROOT);
        if (!OPAQUE_REF.matcher(value).matches()) {
            throw new IllegalArgumentException("Activation subject reference must be an opaque SHA-256 hex digest.");
        }
    }

    public static ActivationSubjectRef fromSha256Hex(String value) {
        return new ActivationSubjectRef(value);
    }
}
