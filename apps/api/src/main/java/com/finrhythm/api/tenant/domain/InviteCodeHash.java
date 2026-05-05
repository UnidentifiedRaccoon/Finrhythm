package com.finrhythm.api.tenant.domain;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;
import java.util.regex.Pattern;

public record InviteCodeHash(String value) {
    private static final Pattern SHA_256_HEX = Pattern.compile("^[a-f0-9]{64}$");

    public InviteCodeHash {
        if (value == null) {
            throw new IllegalArgumentException("Invite lookup hash is required.");
        }
        value = value.toLowerCase(Locale.ROOT);
        if (!SHA_256_HEX.matcher(value).matches()) {
            throw new IllegalArgumentException("Invite lookup hash must be a SHA-256 hex digest.");
        }
    }

    public static InviteCodeHash fromSha256Hex(String value) {
        return new InviteCodeHash(value);
    }

    public static InviteCodeHash fromEnteredCode(String value) {
        return new InviteCodeHash(sha256Hex(normalizeEnteredCode(value)));
    }

    public static String normalizeEnteredCode(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Invite code is required.");
        }
        String normalized = value.replaceAll("[\\s-]", "").toUpperCase(Locale.ROOT);
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Invite code is required.");
        }
        return normalized;
    }

    private static String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }
}
