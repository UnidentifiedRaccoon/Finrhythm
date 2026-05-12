package com.finrhythm.api.registration.domain;

import com.finrhythm.api.common.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "employee_profile_sessions")
public class EmployeeProfileSession extends AuditedEntity {
    private static final Pattern SHA_256_HEX = Pattern.compile("^[a-f0-9]{64}$");

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private UUID employeeRegistrationId;

    @Column(nullable = false, length = 64, updatable = false)
    private String tokenHash;

    @Column(nullable = false, updatable = false)
    private Instant expiresAt;

    private Instant revokedAt;

    private EmployeeProfileSession(UUID employeeRegistrationId, String tokenHash, Instant expiresAt) {
        this.employeeRegistrationId = Objects.requireNonNull(employeeRegistrationId, "employeeRegistrationId");
        this.tokenHash = normalizeTokenHash(tokenHash);
        this.expiresAt = Objects.requireNonNull(expiresAt, "expiresAt");
    }

    public static EmployeeProfileSession create(UUID employeeRegistrationId, String tokenHash, Instant expiresAt) {
        return new EmployeeProfileSession(employeeRegistrationId, tokenHash, expiresAt);
    }

    public boolean isUsableAt(Instant asOf) {
        Objects.requireNonNull(asOf, "asOf");
        return revokedAt == null && expiresAt.isAfter(asOf);
    }

    public void revoke(Instant revokedAt) {
        this.revokedAt = Objects.requireNonNull(revokedAt, "revokedAt");
    }

    @PrePersist
    @PreUpdate
    void validate() {
        employeeRegistrationId = Objects.requireNonNull(employeeRegistrationId, "employeeRegistrationId");
        tokenHash = normalizeTokenHash(tokenHash);
        expiresAt = Objects.requireNonNull(expiresAt, "expiresAt");
    }

    private static String normalizeTokenHash(String value) {
        String normalized = Objects.requireNonNull(value, "tokenHash").trim();
        if (!SHA_256_HEX.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Profile session token hash must be a SHA-256 hex digest.");
        }
        return normalized;
    }
}
