package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.AccessPool;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccessPoolRepository extends JpaRepository<AccessPool, UUID> {
    Optional<AccessPool> findByTenantIdAndKey(UUID tenantId, String key);

    Optional<AccessPool> findByTenantIdAndId(UUID tenantId, UUID id);

    Optional<AccessPool> findByTenantIdAndPilotLaunchIdAndId(UUID tenantId, UUID pilotLaunchId, UUID id);
}
