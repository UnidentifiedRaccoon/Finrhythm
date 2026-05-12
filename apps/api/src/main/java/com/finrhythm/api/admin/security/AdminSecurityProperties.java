package com.finrhythm.api.admin.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@ConfigurationProperties(prefix = "finrhythm.admin.security")
public record AdminSecurityProperties(
        String token
) {
    public boolean matchesBearerToken(String candidate) {
        String expected = configuredToken();
        if (!StringUtils.hasText(expected) || !StringUtils.hasText(candidate)) {
            return false;
        }

        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] candidateBytes = candidate.getBytes(StandardCharsets.UTF_8);
        return expectedBytes.length == candidateBytes.length
                && MessageDigest.isEqual(expectedBytes, candidateBytes);
    }

    private String configuredToken() {
        return token == null ? "" : token.strip();
    }
}
