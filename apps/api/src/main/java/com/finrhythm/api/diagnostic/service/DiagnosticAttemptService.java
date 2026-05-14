package com.finrhythm.api.diagnostic.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.finrhythm.api.common.web.ApiFieldError;
import com.finrhythm.api.diagnostic.domain.DiagnosticAllowedIds;
import com.finrhythm.api.diagnostic.domain.DiagnosticAttempt;
import com.finrhythm.api.diagnostic.domain.DiagnosticAttemptState;
import com.finrhythm.api.diagnostic.domain.DiagnosticDraft;
import com.finrhythm.api.diagnostic.domain.DiagnosticQ0Metadata;
import com.finrhythm.api.diagnostic.domain.DiagnosticRoutingAnswer;
import com.finrhythm.api.diagnostic.domain.DiagnosticRoutingOptions;
import com.finrhythm.api.diagnostic.domain.DiagnosticSelfAssessmentAnswer;
import com.finrhythm.api.diagnostic.persistence.DiagnosticAttemptRepository;
import com.finrhythm.api.registration.service.AuthenticatedEmployeeProfileSession;
import com.finrhythm.api.registration.service.EmployeeRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DiagnosticAttemptService {
    private static final List<String> Q0_QUESTION_IDS = List.of("Q0");
    private static final List<String> Q0_OPTION_IDS = List.of(
            "WHO_SEES_ANSWERS",
            "TRAINING_TIME",
            "ASSIGNMENTS_REQUIRED",
            "POINTS_ACCRUAL",
            "READY_TO_START"
    );
    private static final List<String> SELF_ASSESSMENT_IDS = List.of("SA1", "SA2", "SA3");
    private static final Map<String, List<String>> ROUTING_OPTIONS = Map.of(
            "Q1", List.of("A", "B", "C", "D"),
            "Q2", List.of("A", "B", "C", "D", "E"),
            "Q3", List.of("A", "B", "C", "D")
    );
    private static final Set<String> TOP_LEVEL_FIELDS = Set.of("q0", "selfAssessment", "routingAnswers");
    private static final Set<String> Q0_FIELDS = Set.of("selectedOptionIds");
    private static final Set<String> SELF_ASSESSMENT_FIELDS = Set.of("id", "value");
    private static final Set<String> ROUTING_FIELDS = Set.of("id", "optionId");

    private final EmployeeRegistrationService employeeRegistrationService;
    private final DiagnosticAttemptRepository diagnosticAttemptRepository;
    private final Clock clock;

    public DiagnosticAllowedIds allowedIds() {
        return new DiagnosticAllowedIds(
                Q0_QUESTION_IDS,
                Q0_OPTION_IDS,
                SELF_ASSESSMENT_IDS,
                ROUTING_OPTIONS.entrySet().stream()
                        .sorted(Map.Entry.comparingByKey())
                        .map(entry -> new DiagnosticRoutingOptions(entry.getKey(), entry.getValue()))
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public DiagnosticAttempt currentDraft(String authorizationHeader) {
        AuthenticatedEmployeeProfileSession authenticated =
                employeeRegistrationService.authenticateProfileSessionBearer(authorizationHeader);
        return diagnosticAttemptRepository.findByEmployeeRegistrationId(authenticated.employeeRegistrationId())
                .orElseGet(() -> emptyAttempt(authenticated));
    }

    @Transactional
    public DiagnosticAttempt saveDraft(String authorizationHeader, JsonNode payload) {
        AuthenticatedEmployeeProfileSession authenticated =
                employeeRegistrationService.authenticateProfileSessionBearer(authorizationHeader);
        DiagnosticDraft draft = parseDraft(payload);
        return diagnosticAttemptRepository.findByEmployeeRegistrationId(authenticated.employeeRegistrationId())
                .map(existing -> replaceExistingDraft(existing, draft))
                .orElseGet(() -> diagnosticAttemptRepository.createDraft(authenticated, draft, clock.instant()));
    }

    @Transactional
    public DiagnosticAttempt submit(String authorizationHeader) {
        AuthenticatedEmployeeProfileSession authenticated =
                employeeRegistrationService.authenticateProfileSessionBearer(authorizationHeader);
        DiagnosticAttempt attempt = diagnosticAttemptRepository.findByEmployeeRegistrationId(authenticated.employeeRegistrationId())
                .orElseThrow(() -> new DiagnosticAttemptException(
                        DiagnosticAttemptFailureReason.DIAGNOSTIC_DRAFT_REQUIRED,
                        "Diagnostic draft is required before submission."
                ));

        if (attempt.state() == DiagnosticAttemptState.SUBMITTED) {
            return attempt;
        }
        requireCompleteDraft(attempt);
        return diagnosticAttemptRepository.markSubmitted(attempt.attemptId(), clock.instant());
    }

    private DiagnosticAttempt replaceExistingDraft(DiagnosticAttempt existing, DiagnosticDraft draft) {
        if (existing.state() == DiagnosticAttemptState.SUBMITTED) {
            throw new DiagnosticAttemptException(
                    HttpStatus.CONFLICT,
                    DiagnosticAttemptFailureReason.DIAGNOSTIC_ATTEMPT_ALREADY_SUBMITTED,
                    "Submitted diagnostic attempt cannot be changed."
            );
        }
        return diagnosticAttemptRepository.replaceDraftAnswers(existing.attemptId(), draft, clock.instant());
    }

    private DiagnosticAttempt emptyAttempt(AuthenticatedEmployeeProfileSession authenticated) {
        return new DiagnosticAttempt(
                null,
                authenticated.employeeRegistrationId(),
                authenticated.tenantId(),
                authenticated.pilotLaunchId(),
                authenticated.accessPoolId(),
                DiagnosticAttemptState.DRAFT,
                new DiagnosticQ0Metadata(List.of()),
                List.of(),
                List.of(),
                false,
                null,
                null,
                null,
                null
        );
    }

    private DiagnosticDraft parseDraft(JsonNode payload) {
        requireObject(payload, "request");
        rejectUnknownFields(payload, TOP_LEVEL_FIELDS, "request");
        return new DiagnosticDraft(
                parseQ0(payload.get("q0")),
                parseSelfAssessment(payload.get("selfAssessment")),
                parseRoutingAnswers(payload.get("routingAnswers"))
        );
    }

    private DiagnosticQ0Metadata parseQ0(JsonNode q0Node) {
        if (q0Node == null || q0Node.isNull()) {
            return new DiagnosticQ0Metadata(List.of());
        }
        requireObject(q0Node, "q0");
        rejectUnknownFields(q0Node, Q0_FIELDS, "q0");

        JsonNode selectedNode = q0Node.get("selectedOptionIds");
        if (selectedNode == null || selectedNode.isNull()) {
            return new DiagnosticQ0Metadata(List.of());
        }
        if (!selectedNode.isArray()) {
            throw validationFailed("q0.selectedOptionIds must be an array.", "q0.selectedOptionIds");
        }

        LinkedHashSet<String> selected = new LinkedHashSet<>();
        for (int index = 0; index < selectedNode.size(); index++) {
            JsonNode optionNode = selectedNode.get(index);
            if (!optionNode.isTextual()) {
                throw validationFailed("Q0 option id must be a string.", "q0.selectedOptionIds");
            }
            String optionId = optionNode.asText();
            if (!Q0_OPTION_IDS.contains(optionId)) {
                throw validationFailed("Q0 option id is not allowed.", "q0.selectedOptionIds");
            }
            if (!selected.add(optionId)) {
                throw validationFailed("Q0 option ids must be unique.", "q0.selectedOptionIds");
            }
        }
        return new DiagnosticQ0Metadata(List.copyOf(selected));
    }

    private List<DiagnosticSelfAssessmentAnswer> parseSelfAssessment(JsonNode selfAssessmentNode) {
        if (selfAssessmentNode == null || selfAssessmentNode.isNull()) {
            return List.of();
        }
        if (!selfAssessmentNode.isArray()) {
            throw validationFailed("selfAssessment must be an array.", "selfAssessment");
        }

        Map<String, DiagnosticSelfAssessmentAnswer> answers = new LinkedHashMap<>();
        for (int index = 0; index < selfAssessmentNode.size(); index++) {
            JsonNode answerNode = selfAssessmentNode.get(index);
            requireObject(answerNode, "selfAssessment");
            rejectUnknownFields(answerNode, SELF_ASSESSMENT_FIELDS, "selfAssessment");

            String id = requiredText(answerNode, "id", "selfAssessment.id");
            if (!SELF_ASSESSMENT_IDS.contains(id)) {
                throw validationFailed("Self-assessment id is not allowed.", "selfAssessment.id");
            }
            JsonNode valueNode = answerNode.get("value");
            if (valueNode == null || !valueNode.canConvertToInt()) {
                throw validationFailed("Self-assessment value must be an integer from 1 to 5.", "selfAssessment.value");
            }
            int value = valueNode.asInt();
            if (value < 1 || value > 5) {
                throw validationFailed("Self-assessment value must be from 1 to 5.", "selfAssessment.value");
            }
            if (answers.putIfAbsent(id, new DiagnosticSelfAssessmentAnswer(id, value)) != null) {
                throw validationFailed("Self-assessment ids must be unique.", "selfAssessment.id");
            }
        }
        return orderedSelfAssessment(answers);
    }

    private List<DiagnosticRoutingAnswer> parseRoutingAnswers(JsonNode routingNode) {
        if (routingNode == null || routingNode.isNull()) {
            return List.of();
        }
        if (!routingNode.isArray()) {
            throw validationFailed("routingAnswers must be an array.", "routingAnswers");
        }

        Map<String, DiagnosticRoutingAnswer> answers = new LinkedHashMap<>();
        for (int index = 0; index < routingNode.size(); index++) {
            JsonNode answerNode = routingNode.get(index);
            requireObject(answerNode, "routingAnswers");
            rejectUnknownFields(answerNode, ROUTING_FIELDS, "routingAnswers");

            String id = requiredText(answerNode, "id", "routingAnswers.id");
            List<String> allowedOptions = ROUTING_OPTIONS.get(id);
            if (allowedOptions == null) {
                throw validationFailed("Routing question id is not allowed.", "routingAnswers.id");
            }
            String optionId = requiredText(answerNode, "optionId", "routingAnswers.optionId");
            if (!allowedOptions.contains(optionId)) {
                throw validationFailed("Routing option id is not allowed for this question.", "routingAnswers.optionId");
            }
            if (answers.putIfAbsent(id, new DiagnosticRoutingAnswer(id, optionId)) != null) {
                throw validationFailed("Routing answer ids must be unique.", "routingAnswers.id");
            }
        }
        return orderedRoutingAnswers(answers);
    }

    private void requireCompleteDraft(DiagnosticAttempt attempt) {
        Set<String> selfAssessmentIds = new LinkedHashSet<>();
        for (DiagnosticSelfAssessmentAnswer answer : attempt.selfAssessment()) {
            selfAssessmentIds.add(answer.id());
        }
        Set<String> routingIds = new LinkedHashSet<>();
        for (DiagnosticRoutingAnswer answer : attempt.routingAnswers()) {
            routingIds.add(answer.id());
        }
        if (!selfAssessmentIds.containsAll(SELF_ASSESSMENT_IDS) || !routingIds.containsAll(ROUTING_OPTIONS.keySet())) {
            throw new DiagnosticAttemptException(
                    DiagnosticAttemptFailureReason.DIAGNOSTIC_DRAFT_INCOMPLETE,
                    "Diagnostic draft must include SA1-SA3 and Q1-Q3 before submission."
            );
        }
    }

    private static void requireObject(JsonNode node, String field) {
        if (node == null || node.isNull() || !node.isObject()) {
            throw validationFailed("Diagnostic draft payload must be an object.", field);
        }
    }

    private static void rejectUnknownFields(JsonNode node, Set<String> allowedFields, String parentField) {
        Iterator<String> fieldNames = node.fieldNames();
        while (fieldNames.hasNext()) {
            String fieldName = fieldNames.next();
            if (!allowedFields.contains(fieldName)) {
                throw validationFailed("Unknown diagnostic draft field is not allowed.", parentField + "." + fieldName);
            }
        }
    }

    private static String requiredText(JsonNode node, String fieldName, String fieldPath) {
        JsonNode value = node.get(fieldName);
        if (value == null || !value.isTextual() || value.asText().isBlank()) {
            throw validationFailed("Diagnostic id fields must be non-empty strings.", fieldPath);
        }
        return value.asText();
    }

    private static List<DiagnosticSelfAssessmentAnswer> orderedSelfAssessment(
            Map<String, DiagnosticSelfAssessmentAnswer> answers
    ) {
        List<DiagnosticSelfAssessmentAnswer> ordered = new ArrayList<>();
        for (String id : SELF_ASSESSMENT_IDS) {
            DiagnosticSelfAssessmentAnswer answer = answers.get(id);
            if (answer != null) {
                ordered.add(answer);
            }
        }
        return List.copyOf(ordered);
    }

    private static List<DiagnosticRoutingAnswer> orderedRoutingAnswers(Map<String, DiagnosticRoutingAnswer> answers) {
        List<DiagnosticRoutingAnswer> ordered = new ArrayList<>();
        ROUTING_OPTIONS.keySet().stream().sorted().forEach(id -> {
            DiagnosticRoutingAnswer answer = answers.get(id);
            if (answer != null) {
                ordered.add(answer);
            }
        });
        return List.copyOf(ordered);
    }

    private static DiagnosticAttemptException validationFailed(String message, String field) {
        return new DiagnosticAttemptException(
                HttpStatus.BAD_REQUEST,
                DiagnosticAttemptFailureReason.VALIDATION_FAILED,
                message,
                List.of(new ApiFieldError("diagnosticDraft", "ALLOWLIST", "Field is not allowed or has an invalid value."))
        );
    }
}
