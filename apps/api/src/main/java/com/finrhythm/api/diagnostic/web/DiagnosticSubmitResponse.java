package com.finrhythm.api.diagnostic.web;

import com.finrhythm.api.diagnostic.domain.DiagnosticAttemptState;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Safe diagnostic submission handoff without draft answers or resolved scope identifiers.")
public record DiagnosticSubmitResponse(
        @Schema(description = "Submitted attempt state.")
        DiagnosticAttemptState state,
        @Schema(description = "True after diagnostic submission when route preview handoff is available.")
        boolean routePreview,
        @Schema(description = "Safe first lesson handoff. N1 for the MVP diagnostic route preview.")
        String recommendedFirstLessonId,
        @Schema(description = "Attempt creation timestamp.")
        Instant createdAt,
        @Schema(description = "Attempt update timestamp.")
        Instant updatedAt,
        @Schema(description = "Submission timestamp.")
        Instant submittedAt
) {
}
