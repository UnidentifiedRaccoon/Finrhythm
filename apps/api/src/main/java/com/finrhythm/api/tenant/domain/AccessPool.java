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
@Table(name = "access_pools")
public class AccessPool {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pilot_launch_id", nullable = false)
    private PilotLaunch pilotLaunch;

    @Column(name = "pool_key", nullable = false, length = 64)
    private String key;

    @Column(nullable = false, length = 160)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AccessPoolStatus status;

    @Column(nullable = false)
    private int capacity;

    private Instant startsAt;

    private Instant endsAt;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected AccessPool() {
    }

    private AccessPool(Tenant tenant, PilotLaunch pilotLaunch, String key, String name, int capacity) {
        this.tenant = Objects.requireNonNull(tenant, "tenant");
        this.pilotLaunch = Objects.requireNonNull(pilotLaunch, "pilotLaunch");
        if (!pilotLaunch.isOwnedBy(tenant)) {
            throw new IllegalArgumentException("Access pool pilot launch must belong to the same tenant.");
        }
        this.key = Tenant.normalizeSlug(key);
        this.name = Tenant.requireText(name, "name");
        this.status = AccessPoolStatus.PLANNED;
        this.capacity = capacity;
        validateCapacity(capacity);
    }

    public static AccessPool create(Tenant tenant, PilotLaunch pilotLaunch, String key, String name, int capacity) {
        return new AccessPool(tenant, pilotLaunch, key, name, capacity);
    }

    public UUID getId() {
        return id;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public PilotLaunch getPilotLaunch() {
        return pilotLaunch;
    }

    public String getKey() {
        return key;
    }

    public String getName() {
        return name;
    }

    public AccessPoolStatus getStatus() {
        return status;
    }

    public int getCapacity() {
        return capacity;
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
        pilotLaunch = Objects.requireNonNull(pilotLaunch, "pilotLaunch");
        if (!pilotLaunch.isOwnedBy(tenant)) {
            throw new IllegalArgumentException("Access pool pilot launch must belong to the same tenant.");
        }
        key = Tenant.normalizeSlug(key);
        name = Tenant.requireText(name, "name");
        status = Objects.requireNonNull(status, "status");
        validateCapacity(capacity);
        if (startsAt != null && endsAt != null && !endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException("Access pool end time must be after start time.");
        }
    }

    private static void validateCapacity(int capacity) {
        if (capacity < 1 || capacity > 5000) {
            throw new IllegalArgumentException("Access pool capacity must be between 1 and 5000.");
        }
    }
}
