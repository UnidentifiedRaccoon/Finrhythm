package com.finrhythm.api.diagnostic.persistence;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finrhythm.api.diagnostic.domain.DiagnosticAttempt;
import com.finrhythm.api.diagnostic.domain.DiagnosticAttemptState;
import com.finrhythm.api.diagnostic.domain.DiagnosticDraft;
import com.finrhythm.api.diagnostic.domain.DiagnosticQ0Metadata;
import com.finrhythm.api.diagnostic.domain.DiagnosticRoutingAnswer;
import com.finrhythm.api.diagnostic.domain.DiagnosticSelfAssessmentAnswer;
import com.finrhythm.api.registration.service.AuthenticatedEmployeeProfileSession;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DiagnosticAttemptRepository {
    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public Optional<DiagnosticAttempt> findByEmployeeRegistrationId(UUID employeeRegistrationId) {
        List<AttemptRow> rows = jdbcTemplate.query("""
                select *
                from diagnostic_attempts
                where employee_registration_id = ?
                """, attemptRowMapper(), employeeRegistrationId);
        return rows.stream().findFirst().map(this::toAttempt);
    }

    public DiagnosticAttempt createDraft(
            AuthenticatedEmployeeProfileSession authenticated,
            DiagnosticDraft draft,
            Instant now
    ) {
        UUID attemptId = UUID.randomUUID();
        jdbcTemplate.update("""
                insert into diagnostic_attempts (
                    id,
                    employee_registration_id,
                    tenant_id,
                    pilot_launch_id,
                    access_pool_id,
                    state,
                    route_preview,
                    recommended_first_lesson_id,
                    submitted_at,
                    created_at,
                    updated_at
                )
                values (?, ?, ?, ?, ?, 'DRAFT', false, null, null, ?, ?)
                """,
                attemptId,
                authenticated.employeeRegistrationId(),
                authenticated.tenantId(),
                authenticated.pilotLaunchId(),
                authenticated.accessPoolId(),
                Timestamp.from(now),
                Timestamp.from(now));
        replaceAnswers(attemptId, draft, now);
        return findById(attemptId).orElseThrow();
    }

    public DiagnosticAttempt replaceDraftAnswers(UUID attemptId, DiagnosticDraft draft, Instant now) {
        jdbcTemplate.update("""
                update diagnostic_attempts
                set updated_at = ?
                where id = ?
                  and state = 'DRAFT'
                """, Timestamp.from(now), attemptId);
        replaceAnswers(attemptId, draft, now);
        return findById(attemptId).orElseThrow();
    }

    public DiagnosticAttempt markSubmitted(UUID attemptId, Instant now) {
        jdbcTemplate.update("""
                update diagnostic_attempts
                set state = 'SUBMITTED',
                    route_preview = true,
                    recommended_first_lesson_id = 'N1',
                    submitted_at = ?,
                    updated_at = ?
                where id = ?
                  and state = 'DRAFT'
                """, Timestamp.from(now), Timestamp.from(now), attemptId);
        return findById(attemptId).orElseThrow();
    }

    private Optional<DiagnosticAttempt> findById(UUID attemptId) {
        List<AttemptRow> rows = jdbcTemplate.query("""
                select *
                from diagnostic_attempts
                where id = ?
                """, attemptRowMapper(), attemptId);
        return rows.stream().findFirst().map(this::toAttempt);
    }

    private void replaceAnswers(UUID attemptId, DiagnosticDraft draft, Instant now) {
        jdbcTemplate.update("delete from diagnostic_attempt_q0_metadata where attempt_id = ?", attemptId);
        jdbcTemplate.update("delete from diagnostic_attempt_self_assessment_answers where attempt_id = ?", attemptId);
        jdbcTemplate.update("delete from diagnostic_attempt_routing_answers where attempt_id = ?", attemptId);

        jdbcTemplate.update("""
                insert into diagnostic_attempt_q0_metadata (
                    attempt_id,
                    question_id,
                    selected_option_ids,
                    created_at,
                    updated_at
                )
                values (?, 'Q0', ?::jsonb, ?, ?)
                """,
                attemptId,
                writeStringList(draft.q0().selectedOptionIds()),
                Timestamp.from(now),
                Timestamp.from(now));

        jdbcTemplate.batchUpdate("""
                insert into diagnostic_attempt_self_assessment_answers (
                    attempt_id,
                    question_id,
                    scale_value,
                    created_at,
                    updated_at
                )
                values (?, ?, ?, ?, ?)
                """, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement statement, int index) throws SQLException {
                DiagnosticSelfAssessmentAnswer answer = draft.selfAssessment().get(index);
                statement.setObject(1, attemptId);
                statement.setString(2, answer.id());
                statement.setInt(3, answer.value());
                statement.setTimestamp(4, Timestamp.from(now));
                statement.setTimestamp(5, Timestamp.from(now));
            }

            @Override
            public int getBatchSize() {
                return draft.selfAssessment().size();
            }
        });

        jdbcTemplate.batchUpdate("""
                insert into diagnostic_attempt_routing_answers (
                    attempt_id,
                    question_id,
                    option_id,
                    created_at,
                    updated_at
                )
                values (?, ?, ?, ?, ?)
                """, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement statement, int index) throws SQLException {
                DiagnosticRoutingAnswer answer = draft.routingAnswers().get(index);
                statement.setObject(1, attemptId);
                statement.setString(2, answer.id());
                statement.setString(3, answer.optionId());
                statement.setTimestamp(4, Timestamp.from(now));
                statement.setTimestamp(5, Timestamp.from(now));
            }

            @Override
            public int getBatchSize() {
                return draft.routingAnswers().size();
            }
        });
    }

    private DiagnosticAttempt toAttempt(AttemptRow row) {
        return new DiagnosticAttempt(
                row.id(),
                row.employeeRegistrationId(),
                row.tenantId(),
                row.pilotLaunchId(),
                row.accessPoolId(),
                row.state(),
                readQ0(row.id()),
                readSelfAssessment(row.id()),
                readRoutingAnswers(row.id()),
                row.routePreview(),
                row.recommendedFirstLessonId(),
                row.createdAt(),
                row.updatedAt(),
                row.submittedAt()
        );
    }

    private DiagnosticQ0Metadata readQ0(UUID attemptId) {
        try {
            String json = jdbcTemplate.queryForObject("""
                    select selected_option_ids::text
                    from diagnostic_attempt_q0_metadata
                    where attempt_id = ?
                    """, String.class, attemptId);
            return new DiagnosticQ0Metadata(objectMapper.readValue(json, STRING_LIST));
        } catch (EmptyResultDataAccessException exception) {
            return new DiagnosticQ0Metadata(List.of());
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Persisted diagnostic Q0 metadata is not readable.", exception);
        }
    }

    private List<DiagnosticSelfAssessmentAnswer> readSelfAssessment(UUID attemptId) {
        return jdbcTemplate.query("""
                select question_id, scale_value
                from diagnostic_attempt_self_assessment_answers
                where attempt_id = ?
                order by question_id
                """, (rs, rowNum) -> new DiagnosticSelfAssessmentAnswer(
                rs.getString("question_id"),
                rs.getInt("scale_value")
        ), attemptId);
    }

    private List<DiagnosticRoutingAnswer> readRoutingAnswers(UUID attemptId) {
        return jdbcTemplate.query("""
                select question_id, option_id
                from diagnostic_attempt_routing_answers
                where attempt_id = ?
                order by question_id
                """, (rs, rowNum) -> new DiagnosticRoutingAnswer(
                rs.getString("question_id"),
                rs.getString("option_id")
        ), attemptId);
    }

    private String writeStringList(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Diagnostic metadata cannot be serialized.", exception);
        }
    }

    private RowMapper<AttemptRow> attemptRowMapper() {
        return (rs, rowNum) -> new AttemptRow(
                rs.getObject("id", UUID.class),
                rs.getObject("employee_registration_id", UUID.class),
                rs.getObject("tenant_id", UUID.class),
                rs.getObject("pilot_launch_id", UUID.class),
                rs.getObject("access_pool_id", UUID.class),
                DiagnosticAttemptState.valueOf(rs.getString("state")),
                rs.getBoolean("route_preview"),
                rs.getString("recommended_first_lesson_id"),
                rs.getTimestamp("created_at").toInstant(),
                rs.getTimestamp("updated_at").toInstant(),
                rs.getTimestamp("submitted_at") == null ? null : rs.getTimestamp("submitted_at").toInstant()
        );
    }

    private record AttemptRow(
            UUID id,
            UUID employeeRegistrationId,
            UUID tenantId,
            UUID pilotLaunchId,
            UUID accessPoolId,
            DiagnosticAttemptState state,
            boolean routePreview,
            String recommendedFirstLessonId,
            Instant createdAt,
            Instant updatedAt,
            Instant submittedAt
    ) {
    }
}
