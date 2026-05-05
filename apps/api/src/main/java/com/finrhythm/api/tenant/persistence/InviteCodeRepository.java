package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface InviteCodeRepository extends JpaRepository<InviteCode, UUID> {
    Optional<InviteCode> findByLookupHash(String lookupHash);

    boolean existsByLookupHash(String lookupHash);

    long countByTenantIdAndCohortId(UUID tenantId, UUID cohortId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update InviteCode inviteCode
            set inviteCode.status = :activatedStatus,
                inviteCode.activatedAt = :activatedAt,
                inviteCode.activationSubjectRef = :activationSubjectRef,
                inviteCode.updatedAt = :activatedAt
            where inviteCode.lookupHash = :lookupHash
              and inviteCode.status = :issuedStatus
              and (inviteCode.expiresAt is null or inviteCode.expiresAt > :activatedAt)
            """)
    int claimIssuedByLookupHash(
            @Param("lookupHash") String lookupHash,
            @Param("activationSubjectRef") String activationSubjectRef,
            @Param("activatedAt") Instant activatedAt,
            @Param("activatedStatus") InviteCodeStatus activatedStatus,
            @Param("issuedStatus") InviteCodeStatus issuedStatus
    );
}
