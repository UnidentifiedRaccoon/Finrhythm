package com.finrhythm.api.tenant.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "pilot_launches")
public class PilotLaunch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "launch_key", nullable = false, length = 64)
    private String key;

    @Column(nullable = false, length = 160)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PilotLaunchStatus status;

    @Column(nullable = false)
    private int targetSize;

    private Instant startsAt;

    private Instant endsAt;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected PilotLaunch() {
    }

    private PilotLaunch(Tenant tenant, String key, String name, int targetSize) {
        this.tenant = Objects.requireNonNull(tenant, "tenant");
        this.key = Tenant.normalizeSlug(key);
        this.name = Tenant.requireText(name, "name");
        this.status = PilotLaunchStatus.PLANNED;
        this.targetSize = targetSize;
        validateTargetSize(targetSize);
    }

    public static PilotLaunch create(Tenant tenant, String key, String name, int targetSize) {
        return new PilotLaunch(tenant, key, name, targetSize);
    }

    public UUID getId() {
        return id;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public String getKey() {
        return key;
    }

    public String getName() {
        return name;
    }

    public PilotLaunchStatus getStatus() {
        return status;
    }

    public int getTargetSize() {
        return targetSize;
    }

    public boolean isOwnedBy(Tenant candidate) {
        if (tenant == candidate) {
            return true;
        }
        if (tenant == null || candidate == null || tenant.getId() == null || candidate.getId() == null) {
            return false;
        }
        return tenant.getId().equals(candidate.getId());
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        validate();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
        validate();
    }

    void validate() {
        tenant = Objects.requireNonNull(tenant, "tenant");
        key = Tenant.normalizeSlug(key);
        name = Tenant.requireText(name, "name");
        status = Objects.requireNonNull(status, "status");
        validateTargetSize(targetSize);
        if (startsAt != null && endsAt != null && !endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException("Pilot launch end time must be after start time.");
        }
    }

    private static void validateTargetSize(int targetSize) {
        if (targetSize < 1 || targetSize > 5000) {
            throw new IllegalArgumentException("Pilot launch target size must be between 1 and 5000.");
        }
    }
}
