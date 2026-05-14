package com.finrhythm.api.learning.web;

import com.finrhythm.api.common.config.OpenApiConfig;
import com.finrhythm.api.common.web.ApiErrorResponse;
import com.finrhythm.api.learning.domain.LessonProgress;
import com.finrhythm.api.learning.domain.LearningRouteN1Progress;
import com.finrhythm.api.learning.domain.LearningRouteProgressSummary;
import com.finrhythm.api.learning.service.LearningProgressService;
import com.finrhythm.api.learning.service.LearningRouteProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Employee learning",
        description = "Profile-session scoped MVP N1 lesson progress start/resume."
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/learning/me")
public class LessonProgressController {
    private final LearningProgressService learningProgressService;
    private final LearningRouteProgressService learningRouteProgressService;

    @Operation(
            summary = "Read diagnostic route and N1 progress summary",
            description = "Reads only safe diagnostic handoff and N1 start/resume state for the authenticated employee registration. No request body or client-provided scope identifiers are accepted, and the read does not create or update progress.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH)
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Read-only route/progress summary.",
                    content = @Content(schema = @Schema(implementation = LearningRouteProgressResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @GetMapping("/route-progress")
    public LearningRouteProgressResponse routeProgress(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        return toResponse(learningRouteProgressService.currentSummary(authorizationHeader));
    }

    @Operation(
            summary = "Start or resume N1 lesson progress",
            description = "Idempotently starts or resumes minimal N1 progress for the authenticated employee registration. No request body or client-provided scope identifiers are accepted.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH)
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "N1 progress was created or resumed.",
                    content = @Content(schema = @Schema(implementation = LessonProgressResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Only lesson id N1 is supported by this MVP slice.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping("/lessons/{lessonId}/start")
    public LessonProgressResponse startOrResume(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @Parameter(description = "N1 is the only supported lesson id in this MVP slice.", example = "N1")
            @PathVariable String lessonId
    ) {
        return toResponse(learningProgressService.startOrResume(authorizationHeader, lessonId));
    }

    private static LessonProgressResponse toResponse(LessonProgress progress) {
        return new LessonProgressResponse(
                progress.lessonId(),
                progress.status(),
                progress.startedAt(),
                progress.lastOpenedAt(),
                progress.idempotentResume()
        );
    }

    private static LearningRouteProgressResponse toResponse(LearningRouteProgressSummary summary) {
        return new LearningRouteProgressResponse(
                summary.diagnosticState(),
                summary.routePreview(),
                summary.recommendedFirstLessonId(),
                toResponse(summary.n1()),
                summary.nextAction()
        );
    }

    private static LearningRouteN1ProgressResponse toResponse(LearningRouteN1Progress progress) {
        return new LearningRouteN1ProgressResponse(
                progress.status(),
                progress.startedAt(),
                progress.lastOpenedAt()
        );
    }
}
