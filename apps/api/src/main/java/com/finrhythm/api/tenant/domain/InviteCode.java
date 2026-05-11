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
 * Persisted invite-code state that stores only hashed lookup data, never the raw invite code.
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "invite_codes")
public class InviteCode extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "access_pool_id", nullable = false)
    private AccessPool accessPool;

    @Column(nullable = false, length = 64)
    private String lookupHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private InviteCodeStatus status;

    private Instant issuedAt;

    private Instant expiresAt;

    private Instant activatedAt;

    @Column(length = 64)
    private String activationSubjectRef;

    private InviteCode(
            Tenant tenant,
            AccessPool accessPool,
            InviteCodeHash lookupHash,
            InviteCodeStatus status,
            Instant issuedAt,
            Instant expiresAt,
            Instant activatedAt,
            ActivationSubjectRef activationSubjectRef
    ) {
        this.tenant = Objects.requireNonNull(tenant, "tenant");
        this.accessPool = Objects.requireNonNull(accessPool, "accessPool");
        this.lookupHash = Objects.requireNonNull(lookupHash, "lookupHash").value();
        this.status = Objects.requireNonNull(status, "status");
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
        this.activatedAt = activatedAt;
        this.activationSubjectRef = activationSubjectRef == null ? null : activationSubjectRef.value();
        validate();
    }

    public static InviteCode created(Tenant tenant, AccessPool accessPool, InviteCodeHash lookupHash) {
        return new InviteCode(tenant, accessPool, lookupHash, InviteCodeStatus.CREATED, null, null, null, null);
    }

    public static InviteCode issued(
            Tenant tenant,
            AccessPool accessPool,
            InviteCodeHash lookupHash,
            Instant issuedAt,
            Instant expiresAt
    ) {
        return new InviteCode(tenant, accessPool, lookupHash, InviteCodeStatus.ISSUED, issuedAt, expiresAt, null, null);
    }

    public static InviteCode activated(
            Tenant tenant,
            AccessPool accessPool,
            InviteCodeHash lookupHash,
            Instant issuedAt,
            Instant activatedAt,
            ActivationSubjectRef activationSubjectRef
    ) {
        return new InviteCode(
                tenant,
                accessPool,
                lookupHash,
                InviteCodeStatus.ACTIVATED,
                issuedAt,
                null,
                activatedAt,
                activationSubjectRef
        );
    }

    public boolean isActivatedFor(ActivationSubjectRef subjectRef) {
        return status == InviteCodeStatus.ACTIVATED
                && activationSubjectRef != null
                && activationSubjectRef.equals(Objects.requireNonNull(subjectRef, "subjectRef").value());
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
        accessPool = Objects.requireNonNull(accessPool, "accessPool");
        if (!accessPool.isOwnedBy(tenant)) {
            throw new IllegalArgumentException("Invite code access pool must belong to the same tenant.");
        }
        lookupHash = InviteCodeHash.fromSha256Hex(lookupHash).value();
        status = Objects.requireNonNull(status, "status");
        if (activationSubjectRef != null) {
            activationSubjectRef = ActivationSubjectRef.fromSha256Hex(activationSubjectRef).value();
        }
        validateLifecycle();
    }

    private void validateLifecycle() {
        if (status == InviteCodeStatus.CREATED) {
            requireNull(issuedAt, "issuedAt");
            requireNull(activatedAt, "activatedAt");
            requireNull(activationSubjectRef, "activationSubjectRef");
            return;
        }
        if (status == InviteCodeStatus.ACTIVATED) {
            requirePresent(issuedAt, "issuedAt");
            requirePresent(activatedAt, "activatedAt");
            requirePresent(activationSubjectRef, "activationSubjectRef");
        } else {
            requirePresent(issuedAt, "issuedAt");
            requireNull(activatedAt, "activatedAt");
            requireNull(activationSubjectRef, "activationSubjectRef");
        }
        if (expiresAt != null && issuedAt != null && !expiresAt.isAfter(issuedAt)) {
            throw new IllegalArgumentException("Invite code expiry must be after issue time.");
        }
        if (activatedAt != null && issuedAt != null && activatedAt.isBefore(issuedAt)) {
            throw new IllegalArgumentException("Invite code activation cannot be before issue time.");
        }
    }

    private static void requirePresent(Object value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " is required for invite status.");
        }
    }

    private static void requireNull(Object value, String fieldName) {
        if (value != null) {
            throw new IllegalArgumentException(fieldName + " is not allowed for invite status.");
        }
    }
}
