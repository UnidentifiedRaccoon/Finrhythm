package com.finrhythm.api.diagnostic;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finrhythm.api.registration.service.RegistrationSubjectRefGenerator;
import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.Tenant;
import com.finrhythm.api.tenant.persistence.AccessPoolRepository;
import com.finrhythm.api.tenant.persistence.PilotLaunchRepository;
import com.finrhythm.api.tenant.persistence.TenantRepository;
import com.finrhythm.api.tenant.service.InviteCodeAccessService;
import com.finrhythm.api.tenant.service.IssuedInviteCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
class DiagnosticAttemptControllerIT {
    private static final Instant ISSUED_AT = Instant.parse("2026-05-04T09:00:00Z");
    private static final Instant NON_EXPIRED_AT = Instant.parse("2030-05-04T09:00:00Z");
    private static final AtomicInteger SUBJECT_SEQUENCE = new AtomicInteger(20_000);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_diagnostic_attempt_test")
            .withUsername("finlit")
            .withPassword("finlit_local");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    MockMvc mockMvc;

    @Autowired
    InviteCodeAccessService inviteCodeAccessService;

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    PilotLaunchRepository pilotLaunchRepository;

    @Autowired
    AccessPoolRepository accessPoolRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @MockBean
    RegistrationSubjectRefGenerator subjectRefGenerator;

    @BeforeEach
    void configureSubjectRefs() {
        jdbcTemplate.update("delete from diagnostic_attempt_routing_answers");
        jdbcTemplate.update("delete from diagnostic_attempt_self_assessment_answers");
        jdbcTemplate.update("delete from diagnostic_attempt_q0_metadata");
        jdbcTemplate.update("delete from diagnostic_attempts");

        reset(subjectRefGenerator);
        given(subjectRefGenerator.generate()).willAnswer(invocation -> subjectRef(SUBJECT_SEQUENCE.getAndIncrement()));
    }

    @Test
    void getDraftReturnsEmptyShellForAuthenticatedRegistrationAndUnauthorizedDoesNotPersist() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000001001");

        getDraft(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attemptId").doesNotExist())
                .andExpect(jsonPath("$.employeeRegistrationId").value(employee.employeeRegistrationId().toString()))
                .andExpect(jsonPath("$.tenantId").value(employee.tenantId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(employee.pilotLaunchId().toString()))
                .andExpect(jsonPath("$.accessPoolId").value(employee.accessPoolId().toString()))
                .andExpect(jsonPath("$.state").value("DRAFT"))
                .andExpect(jsonPath("$.allowedAnswerIds.q0QuestionIds[0]").value("Q0"))
                .andExpect(jsonPath("$.allowedAnswerIds.selfAssessmentQuestionIds[0]").value("SA1"))
                .andExpect(jsonPath("$.allowedAnswerIds.routingQuestionOptions[0].id").value("Q1"))
                .andExpect(jsonPath("$.q0.id").value("Q0"))
                .andExpect(jsonPath("$.q0.selectedOptionIds").isEmpty())
                .andExpect(jsonPath("$.selfAssessment").isEmpty())
                .andExpect(jsonPath("$.routingAnswers").isEmpty())
                .andExpect(jsonPath("$.routePreview").value(false))
                .andExpect(jsonPath("$.recommendedFirstLessonId").doesNotExist())
                .andExpect(jsonPath("$.createdAt").doesNotExist())
                .andExpect(jsonPath("$.updatedAt").doesNotExist())
                .andExpect(jsonPath("$.submittedAt").doesNotExist());

        assertThat(countDiagnosticAttempts()).isZero();

        putDraftWithoutToken(completeDraftJson())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"));
        assertThat(countDiagnosticAttempts()).isZero();
    }

    @Test
    void putDraftPersistsSeparatedAnswersAndGetResumesAcrossNewProfileSession() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000001002");

        JsonNode saved = putDraft(employee.profileSessionToken(), completeDraftJson())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value("DRAFT"))
                .andExpect(jsonPath("$.q0.selectedOptionIds[0]").value("WHO_SEES_ANSWERS"))
                .andExpect(jsonPath("$.q0.selectedOptionIds[1]").value("READY_TO_START"))
                .andExpect(jsonPath("$.selfAssessment[0].id").value("SA1"))
                .andExpect(jsonPath("$.selfAssessment[0].value").value(4))
                .andExpect(jsonPath("$.routingAnswers[0].id").value("Q1"))
                .andExpect(jsonPath("$.routingAnswers[0].optionId").value("B"))
                .andReturnJson();

        UUID attemptId = UUID.fromString(saved.get("attemptId").asText());
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countQ0Rows(attemptId)).isEqualTo(1);
        assertThat(countSelfAssessmentRows(attemptId)).isEqualTo(3);
        assertThat(countRoutingRows(attemptId)).isEqualTo(3);
        Map<String, Object> attemptRow = diagnosticAttemptRow(attemptId);
        assertThat(attemptRow.get("employee_registration_id")).isEqualTo(employee.employeeRegistrationId());
        assertThat(attemptRow.get("tenant_id")).isEqualTo(employee.tenantId());
        assertThat(attemptRow.get("pilot_launch_id")).isEqualTo(employee.pilotLaunchId());
        assertThat(attemptRow.get("access_pool_id")).isEqualTo(employee.accessPoolId());

        String replacementToken = createProfileSession(employee);
        getDraft(replacementToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attemptId").value(attemptId.toString()))
                .andExpect(jsonPath("$.employeeRegistrationId").value(employee.employeeRegistrationId().toString()))
                .andExpect(jsonPath("$.q0.selectedOptionIds[0]").value("WHO_SEES_ANSWERS"))
                .andExpect(jsonPath("$.selfAssessment[2].id").value("SA3"))
                .andExpect(jsonPath("$.routingAnswers[2].id").value("Q3"));
    }

    @Test
    void anotherRegistrationCannotReadOrMutateExistingAttempt() throws Exception {
        RegisteredEmployee first = registeredEmployee("+70000001003");
        RegisteredEmployee second = registeredEmployee("+70000001004");

        UUID firstAttemptId = UUID.fromString(putDraft(first.profileSessionToken(), completeDraftJson())
                .andExpect(status().isOk())
                .andReturnJson()
                .get("attemptId")
                .asText());

        getDraft(second.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attemptId").doesNotExist())
                .andExpect(jsonPath("$.employeeRegistrationId").value(second.employeeRegistrationId().toString()))
                .andExpect(jsonPath("$.q0.selectedOptionIds").isEmpty());

        UUID secondAttemptId = UUID.fromString(putDraft(second.profileSessionToken(), alternateCompleteDraftJson())
                .andExpect(status().isOk())
                .andReturnJson()
                .get("attemptId")
                .asText());

        assertThat(secondAttemptId).isNotEqualTo(firstAttemptId);
        getDraft(first.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attemptId").value(firstAttemptId.toString()))
                .andExpect(jsonPath("$.routingAnswers[0].optionId").value("B"));
        assertThat(countDiagnosticAttempts()).isEqualTo(2);
    }

    @Test
    void submitIsIdempotentAndReturnsOnlySafeN1Handoff() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000001005");
        putDraft(employee.profileSessionToken(), completeDraftJson())
                .andExpect(status().isOk());

        JsonNode submitted = submit(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value("SUBMITTED"))
                .andExpect(jsonPath("$.routePreview").value(true))
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"))
                .andExpect(jsonPath("$.createdAt").isString())
                .andExpect(jsonPath("$.updatedAt").isString())
                .andExpect(jsonPath("$.submittedAt").isString())
                .andExpect(jsonPath("$.attemptId").doesNotExist())
                .andExpect(jsonPath("$.employeeRegistrationId").doesNotExist())
                .andExpect(jsonPath("$.tenantId").doesNotExist())
                .andExpect(jsonPath("$.pilotLaunchId").doesNotExist())
                .andExpect(jsonPath("$.accessPoolId").doesNotExist())
                .andExpect(jsonPath("$.allowedAnswerIds").doesNotExist())
                .andExpect(jsonPath("$.q0").doesNotExist())
                .andExpect(jsonPath("$.selfAssessment").doesNotExist())
                .andExpect(jsonPath("$.routingAnswers").doesNotExist())
                .andReturnJson();

        assertSafeSubmitPayload(submitted);

        JsonNode repeated = submit(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value("SUBMITTED"))
                .andExpect(jsonPath("$.routePreview").value(true))
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"))
                .andExpect(jsonPath("$.createdAt").isString())
                .andExpect(jsonPath("$.updatedAt").isString())
                .andExpect(jsonPath("$.submittedAt").isString())
                .andExpect(jsonPath("$.attemptId").doesNotExist())
                .andExpect(jsonPath("$.employeeRegistrationId").doesNotExist())
                .andExpect(jsonPath("$.tenantId").doesNotExist())
                .andExpect(jsonPath("$.pilotLaunchId").doesNotExist())
                .andExpect(jsonPath("$.accessPoolId").doesNotExist())
                .andExpect(jsonPath("$.allowedAnswerIds").doesNotExist())
                .andExpect(jsonPath("$.q0").doesNotExist())
                .andExpect(jsonPath("$.selfAssessment").doesNotExist())
                .andExpect(jsonPath("$.routingAnswers").doesNotExist())
                .andReturnJson();

        assertSafeSubmitPayload(repeated);
        assertThat(repeated.get("submittedAt").asText()).isEqualTo(submitted.get("submittedAt").asText());
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
    }

    @Test
    void putAfterSubmitReturnsConflictAndDoesNotMutateSubmittedAttempt() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000001006");
        UUID attemptId = UUID.fromString(putDraft(employee.profileSessionToken(), completeDraftJson())
                .andExpect(status().isOk())
                .andReturnJson()
                .get("attemptId")
                .asText());
        submit(employee.profileSessionToken()).andExpect(status().isOk());

        String response = putDraft(employee.profileSessionToken(), alternateCompleteDraftJson())
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("DIAGNOSTIC_ATTEMPT_ALREADY_SUBMITTED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(response)
                .doesNotContain("Q27")
                .doesNotContain("overallScore")
                .doesNotContain("R1");

        getDraft(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attemptId").value(attemptId.toString()))
                .andExpect(jsonPath("$.state").value("SUBMITTED"))
                .andExpect(jsonPath("$.routingAnswers[0].optionId").value("B"));
    }

    @Test
    void rejectsInvalidIdsSensitiveUnknownFieldsAndDoesNotPersistDraft() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000001007");

        assertRejectedDraft(employee.profileSessionToken(), """
                {
                  "q0": {"selectedOptionIds": ["READY_TO_START"]},
                  "selfAssessment": [{"id": "SA1", "value": 4}],
                  "routingAnswers": [{"id": "Q4", "optionId": "A"}]
                }
                """, "Q4");
        assertRejectedDraft(employee.profileSessionToken(), """
                {
                  "q0": {"selectedOptionIds": ["READY_TO_START"]},
                  "selfAssessment": [{"id": "SA1", "value": 4}],
                  "routingAnswers": [{"id": "Q28", "optionId": "A"}]
                }
                """, "Q28");
        assertRejectedDraft(employee.profileSessionToken(), """
                {
                  "q0": {"selectedOptionIds": ["READY_TO_START"]},
                  "selfAssessment": [{"id": "SA1", "value": 4}],
                  "routingAnswers": [{"id": "R1", "optionId": "A"}],
                  "overallScore": 100
                }
                """, "overallScore");
        assertRejectedDraft(employee.profileSessionToken(), """
                {
                  "q0": {
                    "selectedOptionIds": ["READY_TO_START"],
                    "exactIncome": "100000"
                  },
                  "selfAssessment": [{"id": "SA1", "value": 4, "score": 100}],
                  "routingAnswers": [{"id": "Q1", "optionId": "B"}],
                  "personalAdvice": "tell me exact debt strategy"
                }
                """, "exactIncome");

        assertThat(countDiagnosticAttempts()).isZero();
        assertThat(countQ0Rows()).isZero();
        assertThat(countSelfAssessmentRows()).isZero();
        assertThat(countRoutingRows()).isZero();
    }

    @Test
    void submitRequiresCompleteDraft() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000001008");
        putDraft(employee.profileSessionToken(), """
                {
                  "q0": {"selectedOptionIds": ["READY_TO_START"]},
                  "selfAssessment": [{"id": "SA1", "value": 4}],
                  "routingAnswers": [{"id": "Q1", "optionId": "B"}]
                }
                """).andExpect(status().isOk());

        submit(employee.profileSessionToken())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("DIAGNOSTIC_DRAFT_INCOMPLETE"));
    }

    @Test
    void authenticationFailuresDoNotPersistDiagnosticDataOrEchoPayload() throws Exception {
        String sensitiveBody = """
                {
                  "q0": {"selectedOptionIds": ["READY_TO_START"]},
                  "selfAssessment": [{"id": "SA1", "value": 4}],
                  "routingAnswers": [{"id": "Q1", "optionId": "B"}],
                  "exactDebt": "raw-sensitive-debt"
                }
                """;

        String malformedToken = "bad.profile.session.token";
        String malformedResponse = putDraft(malformedToken, sensitiveBody)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(malformedResponse)
                .doesNotContain(malformedToken)
                .doesNotContain("raw-sensitive-debt");

        String unknownToken = "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
        String unknownResponse = putDraft(unknownToken, sensitiveBody)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(unknownResponse)
                .doesNotContain(unknownToken)
                .doesNotContain("raw-sensitive-debt");

        RegisteredEmployee expiredEmployee = registeredEmployee("+70000001009");
        expireProfileSessions(expiredEmployee.employeeRegistrationId());
        String expiredResponse = putDraft(expiredEmployee.profileSessionToken(), sensitiveBody)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(expiredResponse)
                .doesNotContain(expiredEmployee.profileSessionToken())
                .doesNotContain("raw-sensitive-debt");

        RegisteredEmployee revokedEmployee = registeredEmployee("+70000001010");
        String revokedToken = revokedEmployee.profileSessionToken();
        String activeToken = createProfileSession(revokedEmployee);
        String revokedResponse = putDraft(revokedToken, sensitiveBody)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(revokedResponse)
                .doesNotContain(revokedToken)
                .doesNotContain("raw-sensitive-debt");
        getDraft(activeToken).andExpect(status().isOk());

        assertThat(countDiagnosticAttempts()).isZero();
    }

    @Test
    void openApiExposesDiagnosticEndpointsSchemasAndProfileSessionSecurity() throws Exception {
        String spec = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode openApi = OBJECT_MAPPER.readTree(spec);

        assertThat(spec)
                .contains("/api/v1/diagnostics/me/draft")
                .contains("/api/v1/diagnostics/me/submit")
                .contains("DiagnosticDraftUpdateRequest")
                .contains("DiagnosticAttemptResponse")
                .contains("DiagnosticSubmitResponse")
                .contains("DiagnosticQ0MetadataRequest")
                .contains("DiagnosticSelfAssessmentAnswerRequest")
                .contains("DiagnosticRoutingAnswerRequest")
                .contains("DiagnosticAllowedAnswerIdsResponse")
                .contains("employeeProfileSessionBearerAuth")
                .contains("routePreview")
                .contains("recommendedFirstLessonId")
                .doesNotContain("overallScore")
                .doesNotContain("weakZones")
                .doesNotContain("hrInsights");
        assertThat(openApi.at("/paths/~1api~1v1~1diagnostics~1me~1draft/get/responses/200/content/*~1*/schema/$ref").asText())
                .isEqualTo("#/components/schemas/DiagnosticAttemptResponse");
        assertThat(openApi.at("/paths/~1api~1v1~1diagnostics~1me~1draft/put/responses/200/content/*~1*/schema/$ref").asText())
                .isEqualTo("#/components/schemas/DiagnosticAttemptResponse");
        assertThat(openApi.at("/paths/~1api~1v1~1diagnostics~1me~1submit/post/responses/200/content/*~1*/schema/$ref").asText())
                .isEqualTo("#/components/schemas/DiagnosticSubmitResponse");

        JsonNode submitSchemaProperties = openApi.at("/components/schemas/DiagnosticSubmitResponse/properties");
        assertThat(submitSchemaProperties.has("state")).isTrue();
        assertThat(submitSchemaProperties.has("routePreview")).isTrue();
        assertThat(submitSchemaProperties.has("recommendedFirstLessonId")).isTrue();
        assertThat(submitSchemaProperties.has("createdAt")).isTrue();
        assertThat(submitSchemaProperties.has("updatedAt")).isTrue();
        assertThat(submitSchemaProperties.has("submittedAt")).isTrue();
        assertThat(submitSchemaProperties.has("attemptId")).isFalse();
        assertThat(submitSchemaProperties.has("employeeRegistrationId")).isFalse();
        assertThat(submitSchemaProperties.has("tenantId")).isFalse();
        assertThat(submitSchemaProperties.has("pilotLaunchId")).isFalse();
        assertThat(submitSchemaProperties.has("accessPoolId")).isFalse();
        assertThat(submitSchemaProperties.has("allowedAnswerIds")).isFalse();
        assertThat(submitSchemaProperties.has("q0")).isFalse();
        assertThat(submitSchemaProperties.has("selfAssessment")).isFalse();
        assertThat(submitSchemaProperties.has("routingAnswers")).isFalse();
    }

    private RegisteredEmployee registeredEmployee(String phone) throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = inviteCodeAccessService.issueBatch(
                tenant.getId(),
                accessPool.getId(),
                1,
                ISSUED_AT,
                NON_EXPIRED_AT
        ).get(0);

        JsonNode registration = postRegistration("""
                {
                  "fullName": "Diagnostic Learner",
                  "email": "diagnostic.learner%s@example.test",
                  "phone": "%s",
                  "inviteCode": "%s"
                }
                """.formatted(phone.substring(phone.length() - 2), phone, issuedCode.code()))
                .andExpect(status().isCreated())
                .andReturnJson();

        RegisteredEmployee employee = new RegisteredEmployee(
                UUID.fromString(registration.get("employeeRegistrationId").asText()),
                tenant.getId(),
                accessPool.getPilotLaunch().getId(),
                accessPool.getId(),
                issuedCode.code(),
                phone,
                null
        );
        return employee.withProfileSessionToken(createProfileSession(employee));
    }

    private String createProfileSession(RegisteredEmployee employee) throws Exception {
        return postProfileSession("""
                {
                  "fullName": "Diagnostic Learner",
                  "email": "diagnostic.learner%s@example.test",
                  "phone": "%s",
                  "inviteCode": "%s"
                }
                """.formatted(employee.phone().substring(employee.phone().length() - 2), employee.phone(), employee.inviteCode()))
                .andExpect(status().isCreated())
                .andReturnJson()
                .get("profileSessionToken")
                .asText();
    }

    private Result postRegistration(String json) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/employee-registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private Result postProfileSession(String json) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/employee-registrations/profile-sessions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private Result getDraft(String token) throws Exception {
        return new Result(mockMvc.perform(get("/api/v1/diagnostics/me/draft")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private Result putDraft(String token, String json) throws Exception {
        return new Result(mockMvc.perform(put("/api/v1/diagnostics/me/draft")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private Result putDraftWithoutToken(String json) throws Exception {
        return new Result(mockMvc.perform(put("/api/v1/diagnostics/me/draft")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private Result submit(String token) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/diagnostics/me/submit")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private void assertRejectedDraft(String token, String json, String forbiddenEcho) throws Exception {
        String response = putDraft(token, json)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(response)
                .doesNotContain(forbiddenEcho)
                .doesNotContain("100000")
                .doesNotContain("tell me exact debt strategy");
    }

    private static String completeDraftJson() {
        return """
                {
                  "q0": {"selectedOptionIds": ["WHO_SEES_ANSWERS", "READY_TO_START"]},
                  "selfAssessment": [
                    {"id": "SA1", "value": 4},
                    {"id": "SA2", "value": 3},
                    {"id": "SA3", "value": 5}
                  ],
                  "routingAnswers": [
                    {"id": "Q1", "optionId": "B"},
                    {"id": "Q2", "optionId": "E"},
                    {"id": "Q3", "optionId": "A"}
                  ]
                }
                """;
    }

    private static String alternateCompleteDraftJson() {
        return """
                {
                  "q0": {"selectedOptionIds": ["TRAINING_TIME"]},
                  "selfAssessment": [
                    {"id": "SA1", "value": 2},
                    {"id": "SA2", "value": 2},
                    {"id": "SA3", "value": 2}
                  ],
                  "routingAnswers": [
                    {"id": "Q1", "optionId": "A"},
                    {"id": "Q2", "optionId": "A"},
                    {"id": "Q3", "optionId": "D"}
                  ]
                }
                """;
    }

    private Tenant seedTenant() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return tenantRepository.saveAndFlush(Tenant.create("diagnostic-" + suffix, "Diagnostic tenant"));
    }

    private AccessPool seedAccessPool(Tenant tenant, int capacity) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return accessPoolRepository.saveAndFlush(AccessPool.create(
                tenant,
                pilotLaunchRepository.saveAndFlush(com.finrhythm.api.tenant.domain.PilotLaunch.create(
                        tenant,
                        "diagnostic-launch-" + suffix,
                        "Diagnostic launch",
                        capacity
                )),
                "diagnostic-access-" + suffix,
                "Diagnostic access pool",
                capacity
        ));
    }

    private int countDiagnosticAttempts() {
        return jdbcTemplate.queryForObject("select count(*) from diagnostic_attempts", Integer.class);
    }

    private int countQ0Rows() {
        return jdbcTemplate.queryForObject("select count(*) from diagnostic_attempt_q0_metadata", Integer.class);
    }

    private int countQ0Rows(UUID attemptId) {
        return jdbcTemplate.queryForObject(
                "select count(*) from diagnostic_attempt_q0_metadata where attempt_id = ?",
                Integer.class,
                attemptId
        );
    }

    private int countSelfAssessmentRows() {
        return jdbcTemplate.queryForObject("select count(*) from diagnostic_attempt_self_assessment_answers", Integer.class);
    }

    private int countSelfAssessmentRows(UUID attemptId) {
        return jdbcTemplate.queryForObject(
                "select count(*) from diagnostic_attempt_self_assessment_answers where attempt_id = ?",
                Integer.class,
                attemptId
        );
    }

    private int countRoutingRows() {
        return jdbcTemplate.queryForObject("select count(*) from diagnostic_attempt_routing_answers", Integer.class);
    }

    private int countRoutingRows(UUID attemptId) {
        return jdbcTemplate.queryForObject(
                "select count(*) from diagnostic_attempt_routing_answers where attempt_id = ?",
                Integer.class,
                attemptId
        );
    }

    private Map<String, Object> diagnosticAttemptRow(UUID attemptId) {
        return jdbcTemplate.queryForMap("select * from diagnostic_attempts where id = ?", attemptId);
    }

    private void expireProfileSessions(UUID employeeRegistrationId) {
        jdbcTemplate.update("""
                update employee_profile_sessions
                set created_at = timestamp with time zone '2020-01-01T00:00:00Z',
                    updated_at = timestamp with time zone '2020-01-01T00:00:00Z',
                    expires_at = timestamp with time zone '2020-01-01T00:15:00Z'
                where employee_registration_id = ?
                """, employeeRegistrationId);
    }

    private static void assertSafeSubmitPayload(JsonNode response) {
        List<String> fieldNames = new ArrayList<>();
        response.fieldNames().forEachRemaining(fieldNames::add);
        assertThat(fieldNames)
                .containsExactlyInAnyOrder(
                        "state",
                        "routePreview",
                        "recommendedFirstLessonId",
                        "createdAt",
                        "updatedAt",
                        "submittedAt"
                );
        assertThat(response.get("state").asText()).isEqualTo("SUBMITTED");
        assertThat(response.get("routePreview").asBoolean()).isTrue();
        assertThat(response.get("recommendedFirstLessonId").asText()).isEqualTo("N1");
        assertThat(response.get("createdAt").isTextual()).isTrue();
        assertThat(response.get("updatedAt").isTextual()).isTrue();
        assertThat(response.get("submittedAt").isTextual()).isTrue();
        assertSafeSubmitPayloadText(response.toString());
    }

    private static void assertSafeSubmitPayloadText(String response) {
        assertThat(response)
                .doesNotContain("attemptId")
                .doesNotContain("employeeRegistrationId")
                .doesNotContain("tenantId")
                .doesNotContain("pilotLaunchId")
                .doesNotContain("accessPoolId")
                .doesNotContain("allowedAnswerIds")
                .doesNotContain("q0")
                .doesNotContain("selfAssessment")
                .doesNotContain("routingAnswers")
                .doesNotContain("WHO_SEES_ANSWERS")
                .doesNotContain("READY_TO_START")
                .doesNotContain("\"Q0\"")
                .doesNotContain("\"SA1\"")
                .doesNotContain("\"SA2\"")
                .doesNotContain("\"SA3\"")
                .doesNotContain("\"Q1\"")
                .doesNotContain("\"Q2\"")
                .doesNotContain("\"Q3\"")
                .doesNotContain("overallScore")
                .doesNotContain("competency")
                .doesNotContain("level")
                .doesNotContain("routeId")
                .doesNotContain("R1")
                .doesNotContain("R2")
                .doesNotContain("R3")
                .doesNotContain("R4")
                .doesNotContain("R5")
                .doesNotContain("R6")
                .doesNotContain("weak")
                .doesNotContain("hrInsight");
    }

    private static ActivationSubjectRef subjectRef(int value) {
        return ActivationSubjectRef.fromSha256Hex("%064x".formatted(value));
    }

    private record RegisteredEmployee(
            UUID employeeRegistrationId,
            UUID tenantId,
            UUID pilotLaunchId,
            UUID accessPoolId,
            String inviteCode,
            String phone,
            String profileSessionToken
    ) {
        RegisteredEmployee withProfileSessionToken(String token) {
            return new RegisteredEmployee(
                    employeeRegistrationId,
                    tenantId,
                    pilotLaunchId,
                    accessPoolId,
                    inviteCode,
                    phone,
                    token
            );
        }
    }

    private static final class Result {
        private final org.springframework.test.web.servlet.ResultActions delegate;

        private Result(org.springframework.test.web.servlet.ResultActions delegate) {
            this.delegate = delegate;
        }

        Result andExpect(org.springframework.test.web.servlet.ResultMatcher matcher) throws Exception {
            delegate.andExpect(matcher);
            return this;
        }

        org.springframework.test.web.servlet.MvcResult andReturn() throws Exception {
            return delegate.andReturn();
        }

        JsonNode andReturnJson() throws Exception {
            return OBJECT_MAPPER.readTree(andReturn().getResponse().getContentAsString());
        }
    }
}
