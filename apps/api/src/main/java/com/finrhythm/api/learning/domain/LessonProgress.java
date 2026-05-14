package com.finrhythm.api.learning.domain;

import java.time.Instant;
import java.util.UUID;

public record LessonProgress(
        UUID id,
        UUID employeeRegistrationId,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId,
        String lessonId,
        LessonProgressStatus status,
        Instant startedAt,
        Instant lastOpenedAt,
        Instant createdAt,
        Instant updatedAt,
        boolean idempotentResume
) {
}
