package com.finrhythm.api.learning.persistence;

import com.finrhythm.api.learning.domain.LearningRouteDiagnosticState;
import com.finrhythm.api.learning.domain.LearningRouteN1Progress;
import com.finrhythm.api.learning.domain.LearningRouteN1Status;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class LearningRouteProgressRepository {
    private final JdbcTemplate jdbcTemplate;

    public Optional<DiagnosticRouteSnapshot> findDiagnosticSnapshot(UUID employeeRegistrationId) {
        List<DiagnosticRouteSnapshot> snapshots = jdbcTemplate.query("""
                select state, route_preview, recommended_first_lesson_id
                from diagnostic_attempts
                where employee_registration_id = ?
                """, (rs, rowNum) -> new DiagnosticRouteSnapshot(
                LearningRouteDiagnosticState.valueOf(rs.getString("state")),
                rs.getBoolean("route_preview"),
                rs.getString("recommended_first_lesson_id")
        ), employeeRegistrationId);
        return snapshots.stream().findFirst();
    }

    public Optional<LearningRouteN1Progress> findN1Progress(UUID employeeRegistrationId) {
        List<LearningRouteN1Progress> progress = jdbcTemplate.query("""
                select status, started_at, last_opened_at
                from employee_lesson_progress
                where employee_registration_id = ?
                  and lesson_id = 'N1'
                """, (rs, rowNum) -> new LearningRouteN1Progress(
                LearningRouteN1Status.valueOf(rs.getString("status")),
                rs.getTimestamp("started_at").toInstant(),
                rs.getTimestamp("last_opened_at").toInstant()
        ), employeeRegistrationId);
        return progress.stream().findFirst();
    }

    public record DiagnosticRouteSnapshot(
            LearningRouteDiagnosticState state,
            boolean routePreview,
            String recommendedFirstLessonId
    ) {
    }
}
