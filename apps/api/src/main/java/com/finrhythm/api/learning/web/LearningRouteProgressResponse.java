package com.finrhythm.api.learning.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.finrhythm.api.learning.domain.LearningRouteDiagnosticState;
import com.finrhythm.api.learning.domain.LearningRouteNextAction;
import io.swagger.v3.oas.annotations.media.Schema;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(name = "LearningRouteProgressResponse", description = "Read-only safe route/progress summary for the authenticated employee.")
public record LearningRouteProgressResponse(
        @Schema(description = "Diagnostic state for route handoff. NOT_STARTED is response-level only.")
        LearningRouteDiagnosticState diagnosticState,
        @Schema(description = "True only when a submitted diagnostic safely exposes the N1 handoff.")
        boolean routePreview,
        @Schema(description = "Safe first lesson handoff. Omitted until diagnostic submit safely recommends N1.", example = "N1")
        String recommendedFirstLessonId,
        @Schema(description = "N1-only progress summary.")
        LearningRouteN1ProgressResponse n1,
        @Schema(description = "Safe next action for the mounted profile-session UI.")
        LearningRouteNextAction nextAction
) {
}
