package com.finrhythm.api.registration.domain;

import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

public record RegistrationContact(String fullName, String email, String phone) {
    private static final int MAX_FULL_NAME_LENGTH = 160;
    private static final int MAX_EMAIL_LENGTH = 254;
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE = Pattern.compile("^\\+[1-9][0-9]{7,14}$");

    public RegistrationContact {
        fullName = normalizeFullName(fullName);
        email = normalizeEmail(email);
        phone = normalizePhone(phone);
    }

    public boolean sameContact(RegistrationContact other) {
        return Objects.equals(fullName, other.fullName)
                && Objects.equals(email, other.email)
                && Objects.equals(phone, other.phone);
    }

    private static String normalizeFullName(String value) {
        String normalized = requireText(value, "fullName").replaceAll("\\s+", " ");
        if (normalized.length() > MAX_FULL_NAME_LENGTH) {
            throw new IllegalArgumentException("fullName is too long.");
        }
        return normalized;
    }

    private static String normalizeEmail(String value) {
        String normalized = requireText(value, "email").toLowerCase(Locale.ROOT);
        if (normalized.length() > MAX_EMAIL_LENGTH || !EMAIL.matcher(normalized).matches()) {
            throw new IllegalArgumentException("email is invalid.");
        }
        return normalized;
    }

    private static String normalizePhone(String value) {
        String normalized = requireText(value, "phone").replaceAll("[\\s().-]", "");
        if (normalized.startsWith("00")) {
            normalized = "+" + normalized.substring(2);
        } else if (!normalized.startsWith("+")) {
            normalized = "+" + normalized;
        }
        if (!PHONE.matcher(normalized).matches()) {
            throw new IllegalArgumentException("phone is invalid.");
        }
        return normalized;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }
}
