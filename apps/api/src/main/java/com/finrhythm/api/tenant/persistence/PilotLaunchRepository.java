package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.PilotLaunch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PilotLaunchRepository extends JpaRepository<PilotLaunch, UUID> {
    Optional<PilotLaunch> findByTenantIdAndKey(UUID tenantId, String key);

    Optional<PilotLaunch> findByTenantIdAndId(UUID tenantId, UUID id);
}
