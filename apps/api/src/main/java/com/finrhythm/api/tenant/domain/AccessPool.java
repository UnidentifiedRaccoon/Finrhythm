package com.finrhythm.api.tenant.domain;

import com.finrhythm.api.common.persistence.AuditedEntity;
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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * Capacity-limited access pool within a pilot launch where invite codes are issued and tracked.
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "access_pools")
public class AccessPool extends AuditedEntity {
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
        validate();
    }

    @PreUpdate
    void preUpdate() {
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
