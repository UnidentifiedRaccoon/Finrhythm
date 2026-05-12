package com.finrhythm.api.consent.service;

import com.finrhythm.api.common.web.ApiFieldError;
import com.finrhythm.api.consent.domain.LegalDocumentAcceptance;
import com.finrhythm.api.consent.domain.LegalDocumentType;
import com.finrhythm.api.consent.persistence.LegalDocumentAcceptanceRepository;
import com.finrhythm.api.registration.domain.EmployeeRegistration;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LegalAcceptanceService {
    public static final String CURRENT_DRAFT_VERSION = "draft-2026-05-12";
    public static final String DEFAULT_SOURCE = "onboarding_privacy";

    private static final List<LegalDocumentType> REQUIRED_DOCUMENTS = List.of(
            LegalDocumentType.PRIVACY_POLICY,
            LegalDocumentType.PERSONAL_DATA_CONSENT,
            LegalDocumentType.TERMS_OF_USE,
            LegalDocumentType.FINANCIAL_DISCLAIMER
    );
    private static final Map<LegalDocumentType, String> CURRENT_DOCUMENT_VERSIONS = currentVersions();

    private final EmployeeRegistrationRepository employeeRegistrationRepository;
    private final LegalDocumentAcceptanceRepository legalDocumentAcceptanceRepository;
    private final Clock clock;

    @Transactional
    public LegalAcceptanceResult accept(UUID employeeRegistrationId, LegalAcceptanceCommand command) {
        EmployeeRegistration employeeRegistration = employeeRegistrationRepository.findById(employeeRegistrationId)
                .orElseThrow(() -> notFound());
        Map<LegalDocumentType, String> acceptedVersions = validateCurrentDocuments(command);
        String source = normalizeSource(command);

        List<LegalDocumentAcceptance> existingAcceptances = currentAcceptances(employeeRegistration.getId());
        List<LegalDocumentAcceptance> missingAcceptances = missingAcceptances(
                employeeRegistration,
                acceptedVersions,
                existingAcceptances,
                source,
                clock.instant()
        );

        if (missingAcceptances.isEmpty()) {
            return toResult(employeeRegistration, existingAcceptances, 0, true);
        }

        try {
            legalDocumentAcceptanceRepository.saveAllAndFlush(missingAcceptances);
        } catch (DataIntegrityViolationException exception) {
            List<LegalDocumentAcceptance> afterRace = currentAcceptances(employeeRegistration.getId());
            if (containsAllCurrentDocuments(afterRace)) {
                return toResult(employeeRegistration, afterRace, 0, true);
            }
            throw exception;
        }

        List<LegalDocumentAcceptance> allAcceptances = currentAcceptances(employeeRegistration.getId());
        return toResult(employeeRegistration, allAcceptances, missingAcceptances.size(), false);
    }

    private Map<LegalDocumentType, String> validateCurrentDocuments(LegalAcceptanceCommand command) {
        List<LegalAcceptanceDocumentCommand> documents = command == null ? null : command.documents();
        if (documents == null || documents.isEmpty()) {
            throw missingRequiredDocuments(REQUIRED_DOCUMENTS);
        }

        Map<LegalDocumentType, String> versions = new EnumMap<>(LegalDocumentType.class);
        Set<LegalDocumentType> seen = new HashSet<>();
        for (int index = 0; index < documents.size(); index += 1) {
            LegalAcceptanceDocumentCommand document = documents.get(index);
            LegalDocumentType documentType = parseDocumentType(document, index);
            if (!seen.add(documentType)) {
                throw fieldError(
                        LegalAcceptanceFailureReason.DUPLICATE_DOCUMENT_TYPE,
                        "Document type was submitted more than once.",
                        "documents[%d].documentType".formatted(index),
                        "DUPLICATE_DOCUMENT_TYPE",
                        "Document type must appear once."
                );
            }
            String documentVersion = normalizedVersion(document, index);
            String currentVersion = CURRENT_DOCUMENT_VERSIONS.get(documentType);
            if (!Objects.equals(currentVersion, documentVersion)) {
                throw fieldError(
                        LegalAcceptanceFailureReason.UNSUPPORTED_DOCUMENT_VERSION,
                        "Document version is not supported.",
                        "documents[%d].documentVersion".formatted(index),
                        "UNSUPPORTED_DOCUMENT_VERSION",
                        "Document version is not supported for current draft acceptance."
                );
            }
            versions.put(documentType, documentVersion);
        }

        List<LegalDocumentType> missing = REQUIRED_DOCUMENTS.stream()
                .filter(type -> !versions.containsKey(type))
                .toList();
        if (!missing.isEmpty()) {
            throw missingRequiredDocuments(missing);
        }
        return versions;
    }

    private LegalDocumentType parseDocumentType(LegalAcceptanceDocumentCommand document, int index) {
        String value = document == null ? null : document.documentType();
        if (value == null || value.isBlank()) {
            throw fieldError(
                    LegalAcceptanceFailureReason.VALIDATION_FAILED,
                    "Submitted legal document acceptance fields are invalid.",
                    "documents[%d].documentType".formatted(index),
                    "NotBlank",
                    "Field is required or invalid."
            );
        }
        try {
            return LegalDocumentType.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw fieldError(
                    LegalAcceptanceFailureReason.UNKNOWN_DOCUMENT_TYPE,
                    "Document type is not supported.",
                    "documents[%d].documentType".formatted(index),
                    "UNKNOWN_DOCUMENT_TYPE",
                    "Document type is not supported."
            );
        }
    }

    private String normalizedVersion(LegalAcceptanceDocumentCommand document, int index) {
        String value = document == null ? null : document.documentVersion();
        if (value == null || value.isBlank()) {
            throw fieldError(
                    LegalAcceptanceFailureReason.VALIDATION_FAILED,
                    "Submitted legal document acceptance fields are invalid.",
                    "documents[%d].documentVersion".formatted(index),
                    "NotBlank",
                    "Field is required or invalid."
            );
        }
        return value.trim();
    }

    private String normalizeSource(LegalAcceptanceCommand command) {
        String source = command == null ? null : command.source();
        if (source == null || source.isBlank()) {
            return DEFAULT_SOURCE;
        }
        try {
            return LegalDocumentAcceptance.normalizeSource(source);
        } catch (IllegalArgumentException exception) {
            throw fieldError(
                    LegalAcceptanceFailureReason.VALIDATION_FAILED,
                    "Submitted legal document acceptance fields are invalid.",
                    "source",
                    "SOURCE_FORMAT",
                    "Field is required or invalid."
            );
        }
    }

    private List<LegalDocumentAcceptance> currentAcceptances(UUID employeeRegistrationId) {
        return legalDocumentAcceptanceRepository.findByEmployeeRegistrationIdAndDocumentTypeIn(
                        employeeRegistrationId,
                        REQUIRED_DOCUMENTS
                ).stream()
                .filter(acceptance -> acceptance.matches(
                        acceptance.getDocumentType(),
                        CURRENT_DOCUMENT_VERSIONS.get(acceptance.getDocumentType())
                ))
                .toList();
    }

    private List<LegalDocumentAcceptance> missingAcceptances(
            EmployeeRegistration employeeRegistration,
            Map<LegalDocumentType, String> acceptedVersions,
            Collection<LegalDocumentAcceptance> existingAcceptances,
            String source,
            Instant acceptedAt
    ) {
        List<LegalDocumentAcceptance> missing = new ArrayList<>();
        for (LegalDocumentType documentType : REQUIRED_DOCUMENTS) {
            String documentVersion = acceptedVersions.get(documentType);
            boolean alreadyAccepted = existingAcceptances.stream()
                    .anyMatch(acceptance -> acceptance.matches(documentType, documentVersion));
            if (!alreadyAccepted) {
                missing.add(LegalDocumentAcceptance.accept(
                        employeeRegistration,
                        documentType,
                        documentVersion,
                        acceptedAt,
                        source
                ));
            }
        }
        return missing;
    }

    private boolean containsAllCurrentDocuments(Collection<LegalDocumentAcceptance> acceptances) {
        return REQUIRED_DOCUMENTS.stream()
                .allMatch(documentType -> acceptances.stream()
                        .anyMatch(acceptance -> acceptance.matches(
                                documentType,
                                CURRENT_DOCUMENT_VERSIONS.get(documentType)
                        )));
    }

    private LegalAcceptanceResult toResult(
            EmployeeRegistration employeeRegistration,
            List<LegalDocumentAcceptance> acceptances,
            int createdCount,
            boolean idempotentRetry
    ) {
        return new LegalAcceptanceResult(
                employeeRegistration.getId(),
                employeeRegistration.getTenantId(),
                employeeRegistration.getPilotLaunchId(),
                employeeRegistration.getAccessPoolId(),
                REQUIRED_DOCUMENTS.stream()
                        .map(documentType -> acceptedDocument(acceptances, documentType))
                        .toList(),
                createdCount,
                idempotentRetry
        );
    }

    private AcceptedLegalDocument acceptedDocument(
            Collection<LegalDocumentAcceptance> acceptances,
            LegalDocumentType documentType
    ) {
        LegalDocumentAcceptance acceptance = acceptances.stream()
                .filter(candidate -> candidate.matches(documentType, CURRENT_DOCUMENT_VERSIONS.get(documentType)))
                .findFirst()
                .orElseThrow();
        return new AcceptedLegalDocument(
                acceptance.getDocumentType(),
                acceptance.getDocumentVersion(),
                acceptance.getAcceptedAt(),
                acceptance.getSource()
        );
    }

    private static LegalAcceptanceException notFound() {
        return new LegalAcceptanceException(
                HttpStatus.NOT_FOUND,
                LegalAcceptanceFailureReason.EMPLOYEE_REGISTRATION_NOT_FOUND,
                "Employee registration was not found.",
                List.of()
        );
    }

    private static LegalAcceptanceException missingRequiredDocuments(List<LegalDocumentType> missing) {
        return new LegalAcceptanceException(
                HttpStatus.BAD_REQUEST,
                LegalAcceptanceFailureReason.MISSING_REQUIRED_DOCUMENT,
                "Current draft legal document set is incomplete.",
                missing.stream()
                        .map(type -> new ApiFieldError(
                                "documents",
                                "MISSING_REQUIRED_DOCUMENT",
                                "Required document is missing: %s.".formatted(type.name())
                        ))
                        .toList()
        );
    }

    private static LegalAcceptanceException fieldError(
            LegalAcceptanceFailureReason reason,
            String message,
            String field,
            String code,
            String fieldMessage
    ) {
        return new LegalAcceptanceException(
                HttpStatus.BAD_REQUEST,
                reason,
                message,
                List.of(new ApiFieldError(field, code, fieldMessage))
        );
    }

    private static Map<LegalDocumentType, String> currentVersions() {
        Map<LegalDocumentType, String> versions = new EnumMap<>(LegalDocumentType.class);
        REQUIRED_DOCUMENTS.forEach(type -> versions.put(type, CURRENT_DRAFT_VERSION));
        return Map.copyOf(versions);
    }
}
