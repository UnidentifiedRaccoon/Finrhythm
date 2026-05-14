package com.finrhythm.api.learning.domain;

import java.time.Instant;

public record LearningRouteN1Progress(
        LearningRouteN1Status status,
        Instant startedAt,
        Instant lastOpenedAt
) {
    public static LearningRouteN1Progress notStarted() {
        return new LearningRouteN1Progress(LearningRouteN1Status.NOT_STARTED, null, null);
    }
}
