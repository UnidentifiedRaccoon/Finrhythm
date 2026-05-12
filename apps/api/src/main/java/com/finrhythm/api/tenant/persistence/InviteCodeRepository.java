package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InviteCodeRepository extends JpaRepository<InviteCode, UUID> {
    Optional<InviteCode> findByLookupHash(String lookupHash);

    boolean existsByLookupHash(String lookupHash);

    long countByTenantIdAndAccessPoolId(UUID tenantId, UUID accessPoolId);

    @Query("""
            select case
                       when inviteCode.status = :issuedStatus
                         and inviteCode.expiresAt is not null
                         and inviteCode.expiresAt <= :asOf
                       then :expiredStatus
                       else inviteCode.status
                   end as status,
                   count(inviteCode) as count
            from InviteCode inviteCode
            where inviteCode.tenant.id = :tenantId
              and inviteCode.accessPool.id = :accessPoolId
            group by inviteCode.status, inviteCode.expiresAt
            """)
    List<InviteCodeStatusCountProjection> countEffectiveStatusesByTenantIdAndAccessPoolId(
            @Param("tenantId") UUID tenantId,
            @Param("accessPoolId") UUID accessPoolId,
            @Param("asOf") Instant asOf,
            @Param("issuedStatus") InviteCodeStatus issuedStatus,
            @Param("expiredStatus") InviteCodeStatus expiredStatus
    );

    @Query("""
            select count(inviteCode)
            from InviteCode inviteCode
            where inviteCode.tenant.id = :tenantId
              and inviteCode.accessPool.id = :accessPoolId
              and inviteCode.issuedAt is not null
            """)
    long countIssuedByTenantIdAndAccessPoolId(
            @Param("tenantId") UUID tenantId,
            @Param("accessPoolId") UUID accessPoolId
    );

    @Query(
            value = """
                    select inviteCode.id as inviteCodeId,
                           case
                               when inviteCode.status = :issuedStatus
                                 and inviteCode.expiresAt is not null
                                 and inviteCode.expiresAt <= :asOf
                               then :expiredStatus
                               else inviteCode.status
                           end as status,
                           inviteCode.issuedAt as issuedAt,
                           inviteCode.expiresAt as expiresAt,
                           inviteCode.activatedAt as activatedAt,
                           registration.registeredAt as registeredAt
                    from InviteCode inviteCode
                    left join EmployeeRegistration registration
                      on registration.inviteCodeId = inviteCode.id
                    where inviteCode.tenant.id = :tenantId
                      and inviteCode.accessPool.id = :accessPoolId
                      and (:status is null or (case
                              when inviteCode.status = :issuedStatus
                                and inviteCode.expiresAt is not null
                                and inviteCode.expiresAt <= :asOf
                              then :expiredStatus
                              else inviteCode.status
                          end) = :status)
                    order by inviteCode.createdAt asc, inviteCode.id asc
                    """,
            countQuery = """
                    select count(inviteCode)
                    from InviteCode inviteCode
                    where inviteCode.tenant.id = :tenantId
                      and inviteCode.accessPool.id = :accessPoolId
                      and (:status is null or (case
                              when inviteCode.status = :issuedStatus
                                and inviteCode.expiresAt is not null
                                and inviteCode.expiresAt <= :asOf
                              then :expiredStatus
                              else inviteCode.status
                          end) = :status)
                    """
    )
    Page<InviteCodeStatusRowProjection> findCodeStatusRows(
            @Param("tenantId") UUID tenantId,
            @Param("accessPoolId") UUID accessPoolId,
            @Param("asOf") Instant asOf,
            @Param("issuedStatus") InviteCodeStatus issuedStatus,
            @Param("expiredStatus") InviteCodeStatus expiredStatus,
            @Param("status") InviteCodeStatus status,
            Pageable pageable
    );

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
