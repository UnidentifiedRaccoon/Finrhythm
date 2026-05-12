package com.finrhythm.api.consent.domain;

import com.finrhythm.api.common.persistence.AuditedEntity;
import com.finrhythm.api.registration.domain.EmployeeRegistration;
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

import java.time.Instant;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "legal_document_acceptance_log")
public class LegalDocumentAcceptance extends AuditedEntity {
    private static final Pattern SOURCE = Pattern.compile("^[a-z0-9][a-z0-9_:-]{0,63}$");

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private UUID employeeRegistrationId;

    @Column(nullable = false, updatable = false)
    private UUID tenantId;

    @Column(nullable = false, updatable = false)
    private UUID pilotLaunchId;

    @Column(nullable = false, updatable = false)
    private UUID accessPoolId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 64, updatable = false)
    private LegalDocumentType documentType;

    @Column(nullable = false, length = 64, updatable = false)
    private String documentVersion;

    @Column(nullable = false, updatable = false)
    private Instant acceptedAt;

    @Column(nullable = false, length = 64, updatable = false)
    private String source;

    private LegalDocumentAcceptance(
            EmployeeRegistration employeeRegistration,
            LegalDocumentType documentType,
            String documentVersion,
            Instant acceptedAt,
            String source
    ) {
        this.employeeRegistrationId = Objects.requireNonNull(employeeRegistration.getId(), "employeeRegistration.id");
        this.tenantId = Objects.requireNonNull(employeeRegistration.getTenantId(), "tenantId");
        this.pilotLaunchId = Objects.requireNonNull(employeeRegistration.getPilotLaunchId(), "pilotLaunchId");
        this.accessPoolId = Objects.requireNonNull(employeeRegistration.getAccessPoolId(), "accessPoolId");
        this.documentType = Objects.requireNonNull(documentType, "documentType");
        this.documentVersion = requireText(documentVersion, "documentVersion");
        this.acceptedAt = Objects.requireNonNull(acceptedAt, "acceptedAt");
        this.source = normalizeSource(source);
    }

    public static LegalDocumentAcceptance accept(
            EmployeeRegistration employeeRegistration,
            LegalDocumentType documentType,
            String documentVersion,
            Instant acceptedAt,
            String source
    ) {
        return new LegalDocumentAcceptance(employeeRegistration, documentType, documentVersion, acceptedAt, source);
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
        employeeRegistrationId = Objects.requireNonNull(employeeRegistrationId, "employeeRegistrationId");
        tenantId = Objects.requireNonNull(tenantId, "tenantId");
        pilotLaunchId = Objects.requireNonNull(pilotLaunchId, "pilotLaunchId");
        accessPoolId = Objects.requireNonNull(accessPoolId, "accessPoolId");
        documentType = Objects.requireNonNull(documentType, "documentType");
        documentVersion = requireText(documentVersion, "documentVersion");
        acceptedAt = Objects.requireNonNull(acceptedAt, "acceptedAt");
        source = normalizeSource(source);
    }

    public boolean matches(LegalDocumentType candidateType, String candidateVersion) {
        return documentType == candidateType && documentVersion.equals(candidateVersion);
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }

    public static String normalizeSource(String value) {
        String normalized = requireText(value, "source").toLowerCase(Locale.ROOT);
        if (!SOURCE.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Acceptance source is invalid.");
        }
        return normalized;
    }
}
