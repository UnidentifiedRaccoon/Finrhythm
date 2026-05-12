package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.AccessPool;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface AccessPoolRepository extends JpaRepository<AccessPool, UUID> {
    Optional<AccessPool> findByTenantIdAndKey(UUID tenantId, String key);

    Optional<AccessPool> findByTenantIdAndId(UUID tenantId, UUID id);

    Optional<AccessPool> findByTenantIdAndPilotLaunchIdAndId(UUID tenantId, UUID pilotLaunchId, UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select accessPool from AccessPool accessPool where accessPool.id = :id")
    Optional<AccessPool> lockById(@Param("id") UUID id);
}
