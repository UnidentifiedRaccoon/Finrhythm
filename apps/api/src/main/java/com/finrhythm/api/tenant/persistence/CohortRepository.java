package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.Cohort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CohortRepository extends JpaRepository<Cohort, UUID> {
    Optional<Cohort> findByTenantIdAndKey(UUID tenantId, String key);

    Optional<Cohort> findByTenantIdAndId(UUID tenantId, UUID id);
}
