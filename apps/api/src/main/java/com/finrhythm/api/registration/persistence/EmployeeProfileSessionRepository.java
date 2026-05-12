package com.finrhythm.api.registration.persistence;

import com.finrhythm.api.registration.domain.EmployeeProfileSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeProfileSessionRepository extends JpaRepository<EmployeeProfileSession, UUID> {
    Optional<EmployeeProfileSession> findByTokenHash(String tokenHash);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
                    update employee_profile_sessions
                    set revoked_at = :revokedAt,
                        updated_at = :revokedAt
                    where employee_registration_id = :employeeRegistrationId
                      and revoked_at is null
                      and expires_at > :asOf
                    """,
            nativeQuery = true
    )
    int revokeActiveForRegistration(
            @Param("employeeRegistrationId") UUID employeeRegistrationId,
            @Param("asOf") Instant asOf,
            @Param("revokedAt") Instant revokedAt
    );
}
