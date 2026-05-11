package com.finrhythm.api.registration.persistence;

import com.finrhythm.api.registration.domain.EmployeeRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface EmployeeRegistrationRepository extends JpaRepository<EmployeeRegistration, UUID> {
    Optional<EmployeeRegistration> findByInviteCodeId(UUID inviteCodeId);

    long countByTenantIdAndCohortId(UUID tenantId, UUID cohortId);

    @Query(
            value = """
                    select registration.*
                    from employee_registrations registration
                    join invite_codes invite_code on invite_code.id = registration.invite_code_id
                    where invite_code.lookup_hash = :lookupHash
                    """,
            nativeQuery = true
    )
    Optional<EmployeeRegistration> findByInviteLookupHash(@Param("lookupHash") String lookupHash);
}
