package com.finrhythm.api.consent.persistence;

import com.finrhythm.api.consent.domain.LegalDocumentAcceptance;
import com.finrhythm.api.consent.domain.LegalDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface LegalDocumentAcceptanceRepository extends JpaRepository<LegalDocumentAcceptance, UUID> {
    List<LegalDocumentAcceptance> findByEmployeeRegistrationIdAndDocumentTypeIn(
            UUID employeeRegistrationId,
            Collection<LegalDocumentType> documentTypes
    );
}
