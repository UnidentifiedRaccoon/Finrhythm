package com.finrhythm.api.registration.domain;

import com.finrhythm.api.common.persistence.AuditedEntity;
import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
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

/**
 * Employee registration produced after a successful invite-code activation.
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "employee_registrations")
public class EmployeeRegistration extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private UUID tenantId;

    @Column(nullable = false, updatable = false)
    private UUID pilotLaunchId;

    @Column(nullable = false, updatable = false)
    private UUID accessPoolId;

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

    private EmployeeRegistration(
            UUID tenantId,
            UUID pilotLaunchId,
            UUID accessPoolId,
            UUID inviteCodeId,
            ActivationSubjectRef activationSubjectRef,
            RegistrationContact contact,
            Instant registeredAt
    ) {
        this.tenantId = Objects.requireNonNull(tenantId, "tenantId");
        this.pilotLaunchId = Objects.requireNonNull(pilotLaunchId, "pilotLaunchId");
        this.accessPoolId = Objects.requireNonNull(accessPoolId, "accessPoolId");
        this.inviteCodeId = Objects.requireNonNull(inviteCodeId, "inviteCodeId");
        this.activationSubjectRef = Objects.requireNonNull(activationSubjectRef, "activationSubjectRef").value();
        applyContact(contact);
        this.registeredAt = Objects.requireNonNull(registeredAt, "registeredAt");
    }

    public static EmployeeRegistration register(
            UUID tenantId,
            UUID pilotLaunchId,
            UUID accessPoolId,
            UUID inviteCodeId,
            ActivationSubjectRef activationSubjectRef,
            RegistrationContact contact,
            Instant registeredAt
    ) {
        return new EmployeeRegistration(
                tenantId,
                pilotLaunchId,
                accessPoolId,
                inviteCodeId,
                activationSubjectRef,
                contact,
                registeredAt
        );
    }

    public boolean matchesContact(RegistrationContact contact) {
        return new RegistrationContact(fullName, email, phone).sameContact(contact);
    }

    public void updateContact(String email, String phone) {
        RegistrationContact normalized = new RegistrationContact(fullName, email, phone);
        this.email = normalized.email();
        this.phone = normalized.phone();
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
        tenantId = Objects.requireNonNull(tenantId, "tenantId");
        pilotLaunchId = Objects.requireNonNull(pilotLaunchId, "pilotLaunchId");
        accessPoolId = Objects.requireNonNull(accessPoolId, "accessPoolId");
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
