package com.finrhythm.api.diagnostic.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.finrhythm.api.common.config.OpenApiConfig;
import com.finrhythm.api.common.web.ApiErrorResponse;
import com.finrhythm.api.diagnostic.domain.DiagnosticAllowedIds;
import com.finrhythm.api.diagnostic.domain.DiagnosticAttempt;
import com.finrhythm.api.diagnostic.service.DiagnosticAttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Employee diagnostics",
        description = "Profile-session scoped MVP diagnostic draft and safe submission handoff."
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/diagnostics/me")
public class DiagnosticAttemptController {
    private final DiagnosticAttemptService diagnosticAttemptService;

    @Operation(
            summary = "Read the current employee diagnostic draft",
            description = "Returns the current draft/submitted attempt or an empty shell for the authenticated employee registration.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH)
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Current diagnostic attempt or empty shell.",
                    content = @Content(schema = @Schema(implementation = DiagnosticAttemptResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @GetMapping("/draft")
    public DiagnosticAttemptResponse currentDraft(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        return toResponse(diagnosticAttemptService.currentDraft(authorizationHeader));
    }

    @Operation(
            summary = "Create or replace the current employee diagnostic draft",
            description = "Accepts only Q0, SA1-SA3 and Q1-Q3 allowlisted draft data; scope is resolved from the bearer profile session.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = DiagnosticDraftUpdateRequest.class))
            )
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Draft created or replaced.",
                    content = @Content(schema = @Schema(implementation = DiagnosticAttemptResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Payload is outside the strict diagnostic allowlist.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Submitted diagnostic attempt cannot be changed.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PutMapping("/draft")
    public DiagnosticAttemptResponse saveDraft(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @RequestBody JsonNode request
    ) {
        return toResponse(diagnosticAttemptService.saveDraft(authorizationHeader, request));
    }

    @Operation(
            summary = "Submit the current employee diagnostic draft",
            description = "Marks the current draft as submitted and returns only safe route preview handoff fields.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH)
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Draft submitted or idempotent repeat for the same submitted attempt.",
                    content = @Content(schema = @Schema(implementation = DiagnosticSubmitResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Draft is missing or incomplete.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping("/submit")
    public DiagnosticSubmitResponse submit(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        return toSubmitResponse(diagnosticAttemptService.submit(authorizationHeader));
    }

    private DiagnosticAttemptResponse toResponse(DiagnosticAttempt attempt) {
        DiagnosticAllowedIds allowedIds = diagnosticAttemptService.allowedIds();
        return new DiagnosticAttemptResponse(
                attempt.attemptId(),
                attempt.employeeRegistrationId(),
                attempt.tenantId(),
                attempt.pilotLaunchId(),
                attempt.accessPoolId(),
                attempt.state(),
                new DiagnosticAllowedAnswerIdsResponse(
                        allowedIds.q0QuestionIds(),
                        allowedIds.q0OptionIds(),
                        allowedIds.selfAssessmentQuestionIds(),
                        allowedIds.routingQuestionOptions().stream()
                                .map(item -> new DiagnosticAllowedRoutingOptionsResponse(item.id(), item.optionIds()))
                                .toList()
                ),
                new DiagnosticQ0MetadataResponse("Q0", attempt.q0().selectedOptionIds()),
                attempt.selfAssessment().stream()
                        .map(answer -> new DiagnosticSelfAssessmentAnswerResponse(answer.id(), answer.value()))
                        .toList(),
                attempt.routingAnswers().stream()
                        .map(answer -> new DiagnosticRoutingAnswerResponse(answer.id(), answer.optionId()))
                        .toList(),
                attempt.routePreview(),
                attempt.recommendedFirstLessonId(),
                attempt.createdAt(),
                attempt.updatedAt(),
                attempt.submittedAt()
        );
    }

    private DiagnosticSubmitResponse toSubmitResponse(DiagnosticAttempt attempt) {
        return new DiagnosticSubmitResponse(
                attempt.state(),
                attempt.routePreview(),
                attempt.recommendedFirstLessonId(),
                attempt.createdAt(),
                attempt.updatedAt(),
                attempt.submittedAt()
        );
    }
}
