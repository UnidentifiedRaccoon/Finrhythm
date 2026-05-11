package com.finrhythm.api.registration.domain;

import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "employee_registrations")
public class EmployeeRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private UUID tenantId;

    @Column(nullable = false, updatable = false)
    private UUID cohortId;

    @Column(nullable = false, updatable = false)
    private UUID inviteCodeId;

    @Column(nullable = false, length = 64, updatable = false)
    private String activationSubjectRef;

    @Column(nullable = false, length = 160)
    private String fullName;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(nullable = false, length = 16)
    private String phone;

    @Column(nullable = false, updatable = false)
    private Instant registeredAt;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected EmployeeRegistration() {
    }

    private EmployeeRegistration(
            UUID tenantId,
            UUID cohortId,
            UUID inviteCodeId,
            ActivationSubjectRef activationSubjectRef,
            RegistrationContact contact,
            Instant registeredAt
    ) {
        this.tenantId = Objects.requireNonNull(tenantId, "tenantId");
        this.cohortId = Objects.requireNonNull(cohortId, "cohortId");
        this.inviteCodeId = Objects.requireNonNull(inviteCodeId, "inviteCodeId");
        this.activationSubjectRef = Objects.requireNonNull(activationSubjectRef, "activationSubjectRef").value();
        applyContact(contact);
        this.registeredAt = Objects.requireNonNull(registeredAt, "registeredAt");
    }

    public static EmployeeRegistration register(
            UUID tenantId,
            UUID cohortId,
            UUID inviteCodeId,
            ActivationSubjectRef activationSubjectRef,
            RegistrationContact contact,
            Instant registeredAt
    ) {
        return new EmployeeRegistration(tenantId, cohortId, inviteCodeId, activationSubjectRef, contact, registeredAt);
    }

    public UUID getId() {
        return id;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public UUID getCohortId() {
        return cohortId;
    }

    public UUID getInviteCodeId() {
        return inviteCodeId;
    }

    public String getActivationSubjectRef() {
        return activationSubjectRef;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Instant getRegisteredAt() {
        return registeredAt;
    }

    public boolean matchesContact(RegistrationContact contact) {
        return new RegistrationContact(fullName, email, phone).sameContact(contact);
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
        tenantId = Objects.requireNonNull(tenantId, "tenantId");
        cohortId = Objects.requireNonNull(cohortId, "cohortId");
        inviteCodeId = Objects.requireNonNull(inviteCodeId, "inviteCodeId");
        activationSubjectRef = ActivationSubjectRef.fromSha256Hex(activationSubjectRef).value();
        applyContact(new RegistrationContact(fullName, email, phone));
        registeredAt = Objects.requireNonNull(registeredAt, "registeredAt");
    }

    private void applyContact(RegistrationContact contact) {
        RegistrationContact normalized = Objects.requireNonNull(contact, "contact");
        fullName = normalized.fullName();
        email = normalized.email();
        phone = normalized.phone();
    }
}
