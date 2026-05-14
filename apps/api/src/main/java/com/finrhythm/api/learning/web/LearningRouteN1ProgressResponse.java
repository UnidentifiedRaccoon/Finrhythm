package com.finrhythm.api.learning.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.finrhythm.api.learning.domain.LearningRouteN1Status;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(name = "LearningRouteN1ProgressResponse", description = "Safe N1 progress summary for the profile-session route panel.")
public record LearningRouteN1ProgressResponse(
        @Schema(description = "N1 response-level progress state. NOT_STARTED is not persisted in employee_lesson_progress.")
        LearningRouteN1Status status,
        @Schema(description = "First successful N1 start timestamp. Omitted until a progress row exists.")
        Instant startedAt,
        @Schema(description = "Most recent N1 start/resume timestamp. Omitted until a progress row exists.")
        Instant lastOpenedAt
) {
}
