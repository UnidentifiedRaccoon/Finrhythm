package com.finrhythm.api.registration.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeContactUpdateAuditService {
    private static final String CONTACT_HASH_NAMESPACE = "employee-contact-update-audit:v1:";
    private static final String ACTOR_TYPE = "employee_profile_session";

    private final JdbcTemplate jdbcTemplate;
    private final EmployeeProfileSessionTokenService profileSessionTokenService;

    @Transactional(propagation = Propagation.MANDATORY)
    public void record(ContactUpdateAuditEvent event) {
        jdbcTemplate.update("""
                        insert into employee_contact_update_audit_log (
                            id,
                            occurred_at,
                            employee_registration_id,
                            tenant_id,
                            pilot_launch_id,
                            access_pool_id,
                            changed_fields,
                            outcome,
                            old_email_hash,
                            new_email_hash,
                            old_phone_hash,
                            new_phone_hash,
                            actor_type,
                            employee_profile_session_id,
                            created_at
                        )
                        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                UUID.randomUUID(),
                Timestamp.from(event.occurredAt()),
                event.employeeRegistrationId(),
                event.tenantId(),
                event.pilotLaunchId(),
                event.accessPoolId(),
                changedFieldsValue(event.changedFields()),
                event.outcome(),
                contactHash(event.oldEmail()),
                contactHash(event.newEmail()),
                contactHash(event.oldPhone()),
                contactHash(event.newPhone()),
                ACTOR_TYPE,
                event.employeeProfileSessionId(),
                Timestamp.from(event.occurredAt())
        );
    }

    private String contactHash(String normalizedValue) {
        return profileSessionTokenService.sha256Hex(CONTACT_HASH_NAMESPACE + normalizedValue);
    }

    private static String changedFieldsValue(List<String> changedFields) {
        if (changedFields.isEmpty()) {
            return "none";
        }
        return String.join(",", changedFields);
    }

    public record ContactUpdateAuditEvent(
            Instant occurredAt,
            UUID employeeRegistrationId,
            UUID tenantId,
            UUID pilotLaunchId,
            UUID accessPoolId,
            List<String> changedFields,
            String outcome,
            String oldEmail,
            String newEmail,
            String oldPhone,
            String newPhone,
            UUID employeeProfileSessionId
    ) {
        public ContactUpdateAuditEvent {
            changedFields = List.copyOf(changedFields);
        }
    }
}
