package com.finrhythm.api.learning.persistence;

import com.finrhythm.api.learning.domain.LessonProgress;
import com.finrhythm.api.learning.domain.LessonProgressStatus;
import com.finrhythm.api.registration.service.AuthenticatedEmployeeProfileSession;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class LessonProgressRepository {
    private final JdbcTemplate jdbcTemplate;

    public LessonProgress startOrResume(
            AuthenticatedEmployeeProfileSession authenticated,
            String lessonId,
            Instant now
    ) {
        UUID progressId = UUID.randomUUID();
        return jdbcTemplate.queryForObject("""
                with existing as (
                    select id
                    from employee_lesson_progress
                    where employee_registration_id = ?
                      and lesson_id = ?
                    for update
                ),
                updated as (
                    update employee_lesson_progress
                    set last_opened_at = ?,
                        updated_at = ?
                    where id in (select id from existing)
                    returning
                        id,
                        employee_registration_id,
                        tenant_id,
                        pilot_launch_id,
                        access_pool_id,
                        lesson_id,
                        status,
                        started_at,
                        last_opened_at,
                        created_at,
                        updated_at,
                        true as idempotent_resume
                ),
                inserted as (
                    insert into employee_lesson_progress (
                        id,
                        employee_registration_id,
                        tenant_id,
                        pilot_launch_id,
                        access_pool_id,
                        lesson_id,
                        status,
                        started_at,
                        last_opened_at,
                        created_at,
                        updated_at
                    )
                    select ?, ?, ?, ?, ?, ?, 'STARTED', ?, ?, ?, ?
                    where not exists (select 1 from existing)
                    returning
                        id,
                        employee_registration_id,
                        tenant_id,
                        pilot_launch_id,
                        access_pool_id,
                        lesson_id,
                        status,
                        started_at,
                        last_opened_at,
                        created_at,
                        updated_at,
                        false as idempotent_resume
                )
                select * from updated
                union all
                select * from inserted
                """,
                lessonProgressRowMapper(),
                authenticated.employeeRegistrationId(),
                lessonId,
                Timestamp.from(now),
                Timestamp.from(now),
                progressId,
                authenticated.employeeRegistrationId(),
                authenticated.tenantId(),
                authenticated.pilotLaunchId(),
                authenticated.accessPoolId(),
                lessonId,
                Timestamp.from(now),
                Timestamp.from(now),
                Timestamp.from(now),
                Timestamp.from(now));
    }

    private RowMapper<LessonProgress> lessonProgressRowMapper() {
        return (rs, rowNum) -> new LessonProgress(
                rs.getObject("id", UUID.class),
                rs.getObject("employee_registration_id", UUID.class),
                rs.getObject("tenant_id", UUID.class),
                rs.getObject("pilot_launch_id", UUID.class),
                rs.getObject("access_pool_id", UUID.class),
                rs.getString("lesson_id"),
                LessonProgressStatus.valueOf(rs.getString("status")),
                rs.getTimestamp("started_at").toInstant(),
                rs.getTimestamp("last_opened_at").toInstant(),
                rs.getTimestamp("created_at").toInstant(),
                rs.getTimestamp("updated_at").toInstant(),
                rs.getBoolean("idempotent_resume")
        );
    }
}
