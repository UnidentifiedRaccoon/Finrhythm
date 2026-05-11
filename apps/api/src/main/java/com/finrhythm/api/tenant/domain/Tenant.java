package com.finrhythm.api.tenant.domain;

import com.finrhythm.api.common.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Tenant account that scopes pilot launches, access pools and invite-code lifecycle data.
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "tenants")
public class Tenant extends AuditedEntity {
    private static final Pattern SLUG = Pattern.compile("^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$");

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 64)
    private String slug;

    @Column(nullable = false, length = 160)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TenantStatus status;

    private Tenant(String slug, String displayName) {
        this.slug = normalizeSlug(slug);
        this.displayName = requireText(displayName, "displayName");
        this.status = TenantStatus.ACTIVE;
    }

    public static Tenant create(String slug, String displayName) {
        return new Tenant(slug, displayName);
    }

    @PrePersist
    void prePersist() {
        validate();
    }

    @PreUpdate
    void preUpdate() {
        validate();
    }

    void validate() {
        slug = normalizeSlug(slug);
        displayName = requireText(displayName, "displayName");
        status = Objects.requireNonNull(status, "status");
    }

    static String normalizeSlug(String value) {
        String normalized = requireText(value, "slug").toLowerCase(Locale.ROOT);
        if (!SLUG.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Slug must be lower-case letters, digits and hyphens.");
        }
        return normalized;
    }

    static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }
}
