package com.finrhythm.api.diagnostic.web;

import com.finrhythm.api.diagnostic.domain.DiagnosticAttemptState;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(description = "Current diagnostic draft/submission state for the authenticated employee registration.")
public record DiagnosticAttemptResponse(
        @Schema(description = "Diagnostic attempt id. Null for an empty shell before the first draft save.", nullable = true)
        UUID attemptId,
        @Schema(description = "Employee registration resolved from the bearer profile session.")
        UUID employeeRegistrationId,
        @Schema(description = "Tenant resolved from the authenticated employee registration.")
        UUID tenantId,
        @Schema(description = "Pilot launch resolved from the authenticated employee registration.")
        UUID pilotLaunchId,
        @Schema(description = "Access pool resolved from the authenticated employee registration.")
        UUID accessPoolId,
        @Schema(description = "Current attempt state.")
        DiagnosticAttemptState state,
        @Schema(description = "Strict ID allowlist for this MVP foundation slice.")
        DiagnosticAllowedAnswerIdsResponse allowedAnswerIds,
        @Schema(description = "Q0 privacy/expectation metadata kept separate from answer sections.")
        DiagnosticQ0MetadataResponse q0,
        @Schema(description = "SA1-SA3 non-scoring self-assessment answers.")
        List<DiagnosticSelfAssessmentAnswerResponse> selfAssessment,
        @Schema(description = "Q1-Q3 routing-preview answers only.")
        List<DiagnosticRoutingAnswerResponse> routingAnswers,
        @Schema(description = "True only after submission; does not mean final scoring/routing is complete.")
        boolean routePreview,
        @Schema(description = "Safe first lesson handoff. Null until submit; N1 after submit.", nullable = true)
        String recommendedFirstLessonId,
        @Schema(description = "Attempt creation timestamp. Null for an empty shell.", nullable = true)
        Instant createdAt,
        @Schema(description = "Attempt update timestamp. Null for an empty shell.", nullable = true)
        Instant updatedAt,
        @Schema(description = "Submission timestamp. Null before submit.", nullable = true)
        Instant submittedAt
) {
}
