package com.finrhythm.api.learning.web;

import com.finrhythm.api.learning.domain.LessonProgressStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(name = "LessonProgressResponse", description = "Profile-session scoped MVP N1 start/resume progress.")
public record LessonProgressResponse(
        @Schema(description = "N1-only lesson id supported by this MVP slice.", example = "N1")
        String lessonId,
        @Schema(description = "Minimal start/resume progress status. Completion is out of scope.")
        LessonProgressStatus status,
        @Schema(description = "First successful N1 start timestamp.")
        Instant startedAt,
        @Schema(description = "Most recent N1 start/resume timestamp.")
        Instant lastOpenedAt,
        @Schema(description = "True when the call resumed an existing N1 progress row instead of creating one.")
        boolean idempotentResume
) {
}
