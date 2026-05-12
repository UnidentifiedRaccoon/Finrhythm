package com.finrhythm.api.admin.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Clock;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminAccessAuditService {
    private final JdbcTemplate jdbcTemplate;
    private final Clock clock;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(
            String method,
            AdminAccessAuditRoute route,
            int statusCode,
            AdminAccessAuditPrincipal principal
    ) {
        Instant occurredAt = clock.instant();
        jdbcTemplate.update("""
                        insert into admin_access_audit_log (
                            id,
                            occurred_at,
                            http_method,
                            route,
                            action,
                            permission,
                            tenant_id,
                            pilot_launch_id,
                            access_pool_id,
                            status_code,
                            outcome,
                            principal_type,
                            principal_ref,
                            created_at
                        )
                        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                UUID.randomUUID(),
                Timestamp.from(occurredAt),
                safeMethod(method),
                route.route(),
                route.action(),
                route.permission(),
                route.tenantId(),
                route.pilotLaunchId(),
                route.accessPoolId(),
                statusCode,
                AdminAccessAuditOutcome.fromStatusCode(statusCode).name(),
                principal.principalType(),
                principal.principalRef(),
                Timestamp.from(occurredAt)
        );
    }

    private static String safeMethod(String method) {
        if (method == null || method.isBlank()) {
            return "GET";
        }
        return method.strip().toUpperCase(Locale.ROOT);
    }
}
