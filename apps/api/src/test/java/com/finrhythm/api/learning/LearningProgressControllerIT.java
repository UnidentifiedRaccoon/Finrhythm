package com.finrhythm.api.learning;

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
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
class LearningProgressControllerIT {
    private static final Instant ISSUED_AT = Instant.parse("2026-05-04T09:00:00Z");
    private static final Instant NON_EXPIRED_AT = Instant.parse("2030-05-04T09:00:00Z");
    private static final AtomicInteger SUBJECT_SEQUENCE = new AtomicInteger(30_000);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_learning_progress_test")
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
        jdbcTemplate.update("delete from employee_lesson_progress");
        jdbcTemplate.update("delete from diagnostic_attempt_routing_answers");
        jdbcTemplate.update("delete from diagnostic_attempt_self_assessment_answers");
        jdbcTemplate.update("delete from diagnostic_attempt_q0_metadata");
        jdbcTemplate.update("delete from diagnostic_attempts");

        reset(subjectRefGenerator);
        given(subjectRefGenerator.generate()).willAnswer(invocation -> subjectRef(SUBJECT_SEQUENCE.getAndIncrement()));
    }

    @Test
    void startN1CreatesMinimalProgressAndRepeatedStartResumesSameRow() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000002001");

        JsonNode started = startLesson(employee.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value("N1"))
                .andExpect(jsonPath("$.status").value("STARTED"))
                .andExpect(jsonPath("$.startedAt").isString())
                .andExpect(jsonPath("$.lastOpenedAt").isString())
                .andExpect(jsonPath("$.idempotentResume").value(false))
                .andExpect(jsonPath("$.employeeRegistrationId").doesNotExist())
                .andExpect(jsonPath("$.tenantId").doesNotExist())
                .andExpect(jsonPath("$.pilotLaunchId").doesNotExist())
                .andExpect(jsonPath("$.accessPoolId").doesNotExist())
                .andReturnJson();

        assertThat(countLessonProgress()).isEqualTo(1);
        Map<String, Object> row = lessonProgressRow(employee.employeeRegistrationId(), "N1");
        assertThat(row.get("employee_registration_id")).isEqualTo(employee.employeeRegistrationId());
        assertThat(row.get("tenant_id")).isEqualTo(employee.tenantId());
        assertThat(row.get("pilot_launch_id")).isEqualTo(employee.pilotLaunchId());
        assertThat(row.get("access_pool_id")).isEqualTo(employee.accessPoolId());
        assertThat(row.get("lesson_id")).isEqualTo("N1");
        assertThat(row.get("status")).isEqualTo("STARTED");

        JsonNode resumed = startLesson(employee.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value("N1"))
                .andExpect(jsonPath("$.status").value("STARTED"))
                .andExpect(jsonPath("$.idempotentResume").value(true))
                .andReturnJson();

        assertThat(countLessonProgress()).isEqualTo(1);
        assertThat(resumed.get("startedAt").asText()).isEqualTo(started.get("startedAt").asText());
        assertThat(Instant.parse(resumed.get("lastOpenedAt").asText()))
                .isAfterOrEqualTo(Instant.parse(started.get("lastOpenedAt").asText()));
    }

    @Test
    void anotherRegistrationStartsOnlyItsOwnN1Progress() throws Exception {
        RegisteredEmployee first = registeredEmployee("+70000002002");
        RegisteredEmployee second = registeredEmployee("+70000002003");

        startLesson(first.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idempotentResume").value(false));
        startLesson(second.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idempotentResume").value(false));

        assertThat(countLessonProgress()).isEqualTo(2);
        assertThat(countLessonProgress(first.employeeRegistrationId())).isEqualTo(1);
        assertThat(countLessonProgress(second.employeeRegistrationId())).isEqualTo(1);

        startLesson(first.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idempotentResume").value(true));

        assertThat(countLessonProgress()).isEqualTo(2);
        assertThat(countLessonProgress(first.employeeRegistrationId())).isEqualTo(1);
        assertThat(countLessonProgress(second.employeeRegistrationId())).isEqualTo(1);
    }

    @Test
    void routeProgressSummaryReturnsSafeDiagnosticAndN1StatesWithoutPersistence() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000002007");

        routeProgress(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("NOT_STARTED"))
                .andExpect(jsonPath("$.routePreview").value(false))
                .andExpect(jsonPath("$.recommendedFirstLessonId").doesNotExist())
                .andExpect(jsonPath("$.n1.status").value("NOT_STARTED"))
                .andExpect(jsonPath("$.n1.startedAt").doesNotExist())
                .andExpect(jsonPath("$.n1.lastOpenedAt").doesNotExist())
                .andExpect(jsonPath("$.nextAction").value("COMPLETE_DIAGNOSTIC"))
                .andExpect(jsonPath("$.employeeRegistrationId").doesNotExist())
                .andExpect(jsonPath("$.tenantId").doesNotExist())
                .andExpect(jsonPath("$.pilotLaunchId").doesNotExist())
                .andExpect(jsonPath("$.accessPoolId").doesNotExist())
                .andExpect(jsonPath("$.attemptId").doesNotExist());
        assertThat(countDiagnosticAttempts()).isZero();
        assertThat(countLessonProgress()).isZero();

        saveCompleteDiagnosticDraft(employee.profileSessionToken())
                .andExpect(status().isOk());

        routeProgress(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("DRAFT"))
                .andExpect(jsonPath("$.routePreview").value(false))
                .andExpect(jsonPath("$.recommendedFirstLessonId").doesNotExist())
                .andExpect(jsonPath("$.n1.status").value("NOT_STARTED"))
                .andExpect(jsonPath("$.nextAction").value("COMPLETE_DIAGNOSTIC"));
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isZero();

        submitDiagnostic(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.routePreview").value(true))
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"));

        routeProgress(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("SUBMITTED"))
                .andExpect(jsonPath("$.routePreview").value(true))
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"))
                .andExpect(jsonPath("$.n1.status").value("NOT_STARTED"))
                .andExpect(jsonPath("$.n1.startedAt").doesNotExist())
                .andExpect(jsonPath("$.n1.lastOpenedAt").doesNotExist())
                .andExpect(jsonPath("$.nextAction").value("START_N1"));
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isZero();

        JsonNode started = startLesson(employee.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("STARTED"))
                .andReturnJson();
        Map<String, Object> rowBeforeSummary = lessonProgressRow(employee.employeeRegistrationId(), "N1");

        routeProgress(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("SUBMITTED"))
                .andExpect(jsonPath("$.routePreview").value(true))
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"))
                .andExpect(jsonPath("$.n1.status").value("STARTED"))
                .andExpect(jsonPath("$.n1.startedAt").value(started.get("startedAt").asText()))
                .andExpect(jsonPath("$.n1.lastOpenedAt").value(started.get("lastOpenedAt").asText()))
                .andExpect(jsonPath("$.nextAction").value("RESUME_N1"))
                .andExpect(jsonPath("$.n1.lessonId").doesNotExist());

        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isEqualTo(1);
        assertThat(lessonProgressRow(employee.employeeRegistrationId(), "N1"))
                .containsAllEntriesOf(rowBeforeSummary);
    }

    @Test
    void routeProgressSummaryIsIsolatedByRegistration() throws Exception {
        RegisteredEmployee first = registeredEmployee("+70000002008");
        RegisteredEmployee second = registeredEmployee("+70000002009");

        saveCompleteDiagnosticDraft(first.profileSessionToken()).andExpect(status().isOk());
        submitDiagnostic(first.profileSessionToken()).andExpect(status().isOk());
        startLesson(first.profileSessionToken(), "N1").andExpect(status().isOk());

        routeProgress(first.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("SUBMITTED"))
                .andExpect(jsonPath("$.routePreview").value(true))
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"))
                .andExpect(jsonPath("$.n1.status").value("STARTED"))
                .andExpect(jsonPath("$.nextAction").value("RESUME_N1"));

        routeProgress(second.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("NOT_STARTED"))
                .andExpect(jsonPath("$.routePreview").value(false))
                .andExpect(jsonPath("$.recommendedFirstLessonId").doesNotExist())
                .andExpect(jsonPath("$.n1.status").value("NOT_STARTED"))
                .andExpect(jsonPath("$.nextAction").value("COMPLETE_DIAGNOSTIC"));

        assertThat(countDiagnosticAttempts(first.employeeRegistrationId())).isEqualTo(1);
        assertThat(countDiagnosticAttempts(second.employeeRegistrationId())).isZero();
        assertThat(countLessonProgress(first.employeeRegistrationId())).isEqualTo(1);
        assertThat(countLessonProgress(second.employeeRegistrationId())).isZero();
    }

    @Test
    void lessonDetailRequiresSubmittedDiagnosticAndStartedN1WithoutPersistence() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000002012");

        lessonDetail(employee.profileSessionToken(), "N1")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("LESSON_DETAIL_NOT_READY"))
                .andExpect(jsonPath("$.lessonId").doesNotExist())
                .andExpect(jsonPath("$.blocks").doesNotExist());
        assertThat(countDiagnosticAttempts()).isZero();
        assertThat(countLessonProgress()).isZero();

        saveCompleteDiagnosticDraft(employee.profileSessionToken())
                .andExpect(status().isOk());

        lessonDetail(employee.profileSessionToken(), "N1")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("LESSON_DETAIL_NOT_READY"))
                .andExpect(jsonPath("$.lessonId").doesNotExist())
                .andExpect(jsonPath("$.blocks").doesNotExist());
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isZero();

        submitDiagnostic(employee.profileSessionToken())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendedFirstLessonId").value("N1"));

        lessonDetail(employee.profileSessionToken(), "N1")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("LESSON_DETAIL_NOT_READY"))
                .andExpect(jsonPath("$.lessonId").doesNotExist())
                .andExpect(jsonPath("$.blocks").doesNotExist());
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isZero();

        startLesson(employee.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("STARTED"));
        Map<String, Object> rowBeforeDetail = lessonProgressRow(employee.employeeRegistrationId(), "N1");

        String response = lessonDetail(employee.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value("N1"))
                .andExpect(jsonPath("$.displayTitle").value("N1: первый резерв"))
                .andExpect(jsonPath("$.shortTitle").value("Первый резерв"))
                .andExpect(jsonPath("$.estimatedTime").value("7-9 минут"))
                .andExpect(jsonPath("$.competencyCodes[0]").value("C1"))
                .andExpect(jsonPath("$.competencyCodes[1]").value("C2"))
                .andExpect(jsonPath("$.competencyCodes[2]").value("C8"))
                .andExpect(jsonPath("$.competencyCodes[3]").value("C9"))
                .andExpect(jsonPath("$.disclaimerType").value("education"))
                .andExpect(jsonPath("$.review.humanReviewRequired").value(true))
                .andExpect(jsonPath("$.review.productionReady").value(false))
                .andExpect(jsonPath("$.review.reviewStatus").value("method_adapted"))
                .andExpect(jsonPath("$.provenance.methodologyRef").value("docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md#n1"))
                .andExpect(jsonPath("$.provenance.sourceRefs[0].path").value("content/getcourse-finstrategy/24-lesson-235010163.md"))
                .andExpect(jsonPath("$.sensitiveDataPolicy.notRequired").isArray())
                .andExpect(jsonPath("$.blocks[0].blockType").value("situation"))
                .andExpect(jsonPath("$.blocks[0].displayOnly").value(true))
                .andExpect(jsonPath("$.employeeRegistrationId").doesNotExist())
                .andExpect(jsonPath("$.tenantId").doesNotExist())
                .andExpect(jsonPath("$.pilotLaunchId").doesNotExist())
                .andExpect(jsonPath("$.accessPoolId").doesNotExist())
                .andExpect(jsonPath("$.attemptId").doesNotExist())
                .andExpect(jsonPath("$.progressId").doesNotExist())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response)
                .doesNotContain("correctOptionId")
                .doesNotContain("answerKey")
                .doesNotContain("score")
                .doesNotContain("finalLevel")
                .doesNotContain("R1")
                .doesNotContain("weakZones")
                .doesNotContain("hrInsights")
                .doesNotContain("diagnosticAnswers")
                .doesNotContain("token")
                .doesNotContain(employee.profileSessionToken())
                .doesNotContain(employee.inviteCode())
                .doesNotContain("points")
                .doesNotContain("reward")
                .doesNotContain("completion");
        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isEqualTo(1);
        assertThat(lessonProgressRow(employee.employeeRegistrationId(), "N1"))
                .containsAllEntriesOf(rowBeforeDetail);
    }

    @Test
    void lessonDetailIsN1OnlyAndIsolatedByRegistration() throws Exception {
        RegisteredEmployee first = registeredEmployee("+70000002013");
        RegisteredEmployee second = registeredEmployee("+70000002014");

        saveCompleteDiagnosticDraft(first.profileSessionToken()).andExpect(status().isOk());
        submitDiagnostic(first.profileSessionToken()).andExpect(status().isOk());
        startLesson(first.profileSessionToken(), "N1").andExpect(status().isOk());

        lessonDetail(first.profileSessionToken(), "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value("N1"));

        lessonDetail(second.profileSessionToken(), "N1")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("LESSON_DETAIL_NOT_READY"))
                .andExpect(jsonPath("$.lessonId").doesNotExist())
                .andExpect(jsonPath("$.blocks").doesNotExist());

        lessonDetail(first.profileSessionToken(), "N2")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("UNSUPPORTED_LESSON_ID"))
                .andExpect(jsonPath("$.lessonId").doesNotExist())
                .andExpect(jsonPath("$.blocks").doesNotExist());

        assertThat(countDiagnosticAttempts(first.employeeRegistrationId())).isEqualTo(1);
        assertThat(countDiagnosticAttempts(second.employeeRegistrationId())).isZero();
        assertThat(countLessonProgress(first.employeeRegistrationId())).isEqualTo(1);
        assertThat(countLessonProgress(second.employeeRegistrationId())).isZero();
    }

    @Test
    void unsupportedLessonIdReturnsSafeClientErrorWithoutPersistence() throws Exception {
        RegisteredEmployee employee = registeredEmployee("+70000002004");

        String response = startLesson(employee.profileSessionToken(), "N2")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("UNSUPPORTED_LESSON_ID"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response)
                .doesNotContain("completion")
                .doesNotContain("quiz")
                .doesNotContain("points")
                .doesNotContain("R1");
        assertThat(countLessonProgress()).isZero();
    }

    @Test
    void authenticationFailuresReturn401AndDoNotPersistLearningProgress() throws Exception {
        startLessonWithoutToken("N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"));

        String malformedToken = "bad.profile.session.token";
        String malformedResponse = startLesson(malformedToken, "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(malformedResponse).doesNotContain(malformedToken);

        String unknownToken = "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
        String unknownResponse = startLesson(unknownToken, "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(unknownResponse).doesNotContain(unknownToken);

        RegisteredEmployee expiredEmployee = registeredEmployee("+70000002005");
        expireProfileSessions(expiredEmployee.employeeRegistrationId());
        String expiredResponse = startLesson(expiredEmployee.profileSessionToken(), "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(expiredResponse).doesNotContain(expiredEmployee.profileSessionToken());

        RegisteredEmployee revokedEmployee = registeredEmployee("+70000002006");
        String revokedToken = revokedEmployee.profileSessionToken();
        String activeToken = createProfileSession(revokedEmployee);
        String revokedResponse = startLesson(revokedToken, "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(revokedResponse).doesNotContain(revokedToken);
        startLesson(activeToken, "N1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value("N1"));

        assertThat(countLessonProgress()).isEqualTo(1);
        assertThat(countLessonProgress(revokedEmployee.employeeRegistrationId())).isEqualTo(1);
        assertThat(countLessonProgress(expiredEmployee.employeeRegistrationId())).isZero();
    }

    @Test
    void routeProgressAuthenticationFailuresReturn401AndDoNotPersistDiagnosticOrLearningData() throws Exception {
        routeProgressWithoutToken()
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"));
        lessonDetailWithoutToken("N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"));

        String malformedToken = "bad.profile.session.token";
        String malformedResponse = routeProgress(malformedToken)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(malformedResponse).doesNotContain(malformedToken);
        String malformedDetailResponse = lessonDetail(malformedToken, "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(malformedDetailResponse).doesNotContain(malformedToken);

        String unknownToken = "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD";
        String unknownResponse = routeProgress(unknownToken)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(unknownResponse).doesNotContain(unknownToken);
        String unknownDetailResponse = lessonDetail(unknownToken, "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(unknownDetailResponse).doesNotContain(unknownToken);

        RegisteredEmployee expiredEmployee = registeredEmployee("+70000002010");
        saveCompleteDiagnosticDraft(expiredEmployee.profileSessionToken()).andExpect(status().isOk());
        submitDiagnostic(expiredEmployee.profileSessionToken()).andExpect(status().isOk());
        startLesson(expiredEmployee.profileSessionToken(), "N1").andExpect(status().isOk());
        expireProfileSessions(expiredEmployee.employeeRegistrationId());
        Map<String, Object> expiredProgressRow = lessonProgressRow(expiredEmployee.employeeRegistrationId(), "N1");

        String expiredResponse = routeProgress(expiredEmployee.profileSessionToken())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(expiredResponse).doesNotContain(expiredEmployee.profileSessionToken());
        assertThat(lessonProgressRow(expiredEmployee.employeeRegistrationId(), "N1"))
                .containsAllEntriesOf(expiredProgressRow);
        String expiredDetailResponse = lessonDetail(expiredEmployee.profileSessionToken(), "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(expiredDetailResponse).doesNotContain(expiredEmployee.profileSessionToken());
        assertThat(lessonProgressRow(expiredEmployee.employeeRegistrationId(), "N1"))
                .containsAllEntriesOf(expiredProgressRow);

        RegisteredEmployee revokedEmployee = registeredEmployee("+70000002011");
        String revokedToken = revokedEmployee.profileSessionToken();
        String activeToken = createProfileSession(revokedEmployee);
        String revokedResponse = routeProgress(revokedToken)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(revokedResponse).doesNotContain(revokedToken);
        String revokedDetailResponse = lessonDetail(revokedToken, "N1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(revokedDetailResponse).doesNotContain(revokedToken);
        routeProgress(activeToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosticState").value("NOT_STARTED"))
                .andExpect(jsonPath("$.n1.status").value("NOT_STARTED"));

        assertThat(countDiagnosticAttempts()).isEqualTo(1);
        assertThat(countLessonProgress()).isEqualTo(1);
    }

    @Test
    void openApiExposesLearningEndpointSchemaAndProfileSessionSecurity() throws Exception {
        String spec = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode openApi = OBJECT_MAPPER.readTree(spec);

        assertThat(spec)
                .contains("/api/v1/learning/me/lessons/{lessonId}/start")
                .contains("/api/v1/learning/me/lessons/{lessonId}")
                .contains("/api/v1/learning/me/route-progress")
                .contains("LessonProgressResponse")
                .contains("LearningLessonDetailResponse")
                .contains("LearningRouteProgressResponse")
                .contains("employeeProfileSessionBearerAuth")
                .contains("idempotentResume")
                .contains("humanReviewRequired")
                .contains("productionReady")
                .contains("COMPLETE_DIAGNOSTIC")
                .contains("START_N1")
                .contains("RESUME_N1")
                .doesNotContain("lessonCompleted")
                .doesNotContain("quiz")
                .doesNotContain("points")
                .doesNotContain("R1")
                .doesNotContain("hrInsights");

        JsonNode operation = openApi.at("/paths/~1api~1v1~1learning~1me~1lessons~1{lessonId}~1start/post");
        assertThat(operation.isMissingNode()).isFalse();
        assertThat(operation.at("/responses/200/content/*~1*/schema/$ref").asText())
                .isEqualTo("#/components/schemas/LessonProgressResponse");
        assertThat(operation.at("/requestBody").isMissingNode()).isTrue();
        assertThat(operation.at("/security/0/employeeProfileSessionBearerAuth").isArray()).isTrue();

        JsonNode responseProperties = openApi.at("/components/schemas/LessonProgressResponse/properties");
        assertThat(responseProperties.has("lessonId")).isTrue();
        assertThat(responseProperties.has("status")).isTrue();
        assertThat(responseProperties.at("/status/enum").toString()).contains("STARTED");
        assertThat(responseProperties.has("startedAt")).isTrue();
        assertThat(responseProperties.has("lastOpenedAt")).isTrue();
        assertThat(responseProperties.has("idempotentResume")).isTrue();
        assertThat(responseProperties.has("employeeRegistrationId")).isFalse();
        assertThat(responseProperties.has("tenantId")).isFalse();
        assertThat(responseProperties.has("pilotLaunchId")).isFalse();
        assertThat(responseProperties.has("accessPoolId")).isFalse();

        JsonNode routeProgressOperation = openApi.at("/paths/~1api~1v1~1learning~1me~1route-progress/get");
        assertThat(routeProgressOperation.isMissingNode()).isFalse();
        assertThat(routeProgressOperation.at("/responses/200/content/*~1*/schema/$ref").asText())
                .isEqualTo("#/components/schemas/LearningRouteProgressResponse");
        assertThat(routeProgressOperation.at("/requestBody").isMissingNode()).isTrue();
        JsonNode routeProgressParameters = routeProgressOperation.at("/parameters");
        assertThat(routeProgressParameters).hasSize(1);
        assertThat(routeProgressParameters.get(0).get("name").asText()).isEqualTo("Authorization");
        assertThat(routeProgressParameters.get(0).get("in").asText()).isEqualTo("header");
        assertThat(routeProgressParameters.toString())
                .doesNotContain("employeeRegistrationId")
                .doesNotContain("tenantId")
                .doesNotContain("pilotLaunchId")
                .doesNotContain("accessPoolId")
                .doesNotContain("organization")
                .doesNotContain("subscription")
                .doesNotContain("seat");
        assertThat(routeProgressOperation.at("/security/0/employeeProfileSessionBearerAuth").isArray()).isTrue();

        JsonNode routeProgressProperties = openApi.at("/components/schemas/LearningRouteProgressResponse/properties");
        assertThat(routeProgressProperties.has("diagnosticState")).isTrue();
        assertThat(routeProgressProperties.at("/diagnosticState/enum").toString())
                .contains("NOT_STARTED")
                .contains("DRAFT")
                .contains("SUBMITTED");
        assertThat(routeProgressProperties.has("routePreview")).isTrue();
        assertThat(routeProgressProperties.has("recommendedFirstLessonId")).isTrue();
        assertThat(routeProgressProperties.has("n1")).isTrue();
        assertThat(routeProgressProperties.has("nextAction")).isTrue();
        assertThat(routeProgressProperties.has("employeeRegistrationId")).isFalse();
        assertThat(routeProgressProperties.has("tenantId")).isFalse();
        assertThat(routeProgressProperties.has("pilotLaunchId")).isFalse();
        assertThat(routeProgressProperties.has("accessPoolId")).isFalse();
        assertThat(routeProgressProperties.has("attemptId")).isFalse();

        JsonNode lessonDetailOperation = openApi.at("/paths/~1api~1v1~1learning~1me~1lessons~1{lessonId}/get");
        assertThat(lessonDetailOperation.isMissingNode()).isFalse();
        assertThat(lessonDetailOperation.at("/responses/200/content/*~1*/schema/$ref").asText())
                .isEqualTo("#/components/schemas/LearningLessonDetailResponse");
        assertThat(lessonDetailOperation.at("/requestBody").isMissingNode()).isTrue();
        JsonNode lessonDetailParameters = lessonDetailOperation.at("/parameters");
        assertThat(lessonDetailParameters).hasSize(2);
        assertThat(lessonDetailParameters.toString())
                .contains("Authorization")
                .contains("lessonId")
                .doesNotContain("employeeRegistrationId")
                .doesNotContain("tenantId")
                .doesNotContain("pilotLaunchId")
                .doesNotContain("accessPoolId")
                .doesNotContain("organization")
                .doesNotContain("subscription")
                .doesNotContain("seat");
        assertThat(lessonDetailOperation.at("/security/0/employeeProfileSessionBearerAuth").isArray()).isTrue();

        JsonNode lessonDetailProperties = openApi.at("/components/schemas/LearningLessonDetailResponse/properties");
        assertThat(lessonDetailProperties.has("lessonId")).isTrue();
        assertThat(lessonDetailProperties.has("displayTitle")).isTrue();
        assertThat(lessonDetailProperties.has("review")).isTrue();
        assertThat(lessonDetailProperties.has("provenance")).isTrue();
        assertThat(lessonDetailProperties.has("sensitiveDataPolicy")).isTrue();
        assertThat(lessonDetailProperties.has("blocks")).isTrue();
        assertThat(lessonDetailProperties.has("employeeRegistrationId")).isFalse();
        assertThat(lessonDetailProperties.has("tenantId")).isFalse();
        assertThat(lessonDetailProperties.has("pilotLaunchId")).isFalse();
        assertThat(lessonDetailProperties.has("accessPoolId")).isFalse();
        assertThat(lessonDetailProperties.has("attemptId")).isFalse();
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
                  "fullName": "Learning Learner",
                  "email": "learning.learner%s@example.test",
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
                  "fullName": "Learning Learner",
                  "email": "learning.learner%s@example.test",
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

    private Result saveCompleteDiagnosticDraft(String token) throws Exception {
        return new Result(mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/v1/diagnostics/me/draft")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "q0": {"selectedOptionIds": ["READY_TO_START"]},
                          "selfAssessment": [
                            {"id": "SA1", "value": 3},
                            {"id": "SA2", "value": 4},
                            {"id": "SA3", "value": 2}
                          ],
                          "routingAnswers": [
                            {"id": "Q1", "optionId": "A"},
                            {"id": "Q2", "optionId": "B"},
                            {"id": "Q3", "optionId": "C"}
                          ]
                        }
                        """)));
    }

    private Result submitDiagnostic(String token) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/diagnostics/me/submit")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private Result startLesson(String token, String lessonId) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/learning/me/lessons/{lessonId}/start", lessonId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private Result startLessonWithoutToken(String lessonId) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/learning/me/lessons/{lessonId}/start", lessonId)));
    }

    private Result routeProgress(String token) throws Exception {
        return new Result(mockMvc.perform(get("/api/v1/learning/me/route-progress")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private Result routeProgressWithoutToken() throws Exception {
        return new Result(mockMvc.perform(get("/api/v1/learning/me/route-progress")));
    }

    private Result lessonDetail(String token, String lessonId) throws Exception {
        return new Result(mockMvc.perform(get("/api/v1/learning/me/lessons/{lessonId}", lessonId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private Result lessonDetailWithoutToken(String lessonId) throws Exception {
        return new Result(mockMvc.perform(get("/api/v1/learning/me/lessons/{lessonId}", lessonId)));
    }

    private Tenant seedTenant() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return tenantRepository.saveAndFlush(Tenant.create("learning-" + suffix, "Learning tenant"));
    }

    private AccessPool seedAccessPool(Tenant tenant, int capacity) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return accessPoolRepository.saveAndFlush(AccessPool.create(
                tenant,
                pilotLaunchRepository.saveAndFlush(com.finrhythm.api.tenant.domain.PilotLaunch.create(
                        tenant,
                        "learning-launch-" + suffix,
                        "Learning launch",
                        capacity
                )),
                "learning-access-" + suffix,
                "Learning access pool",
                capacity
        ));
    }

    private int countLessonProgress() {
        return jdbcTemplate.queryForObject("select count(*) from employee_lesson_progress", Integer.class);
    }

    private int countLessonProgress(UUID employeeRegistrationId) {
        return jdbcTemplate.queryForObject(
                "select count(*) from employee_lesson_progress where employee_registration_id = ?",
                Integer.class,
                employeeRegistrationId
        );
    }

    private int countDiagnosticAttempts() {
        return jdbcTemplate.queryForObject("select count(*) from diagnostic_attempts", Integer.class);
    }

    private int countDiagnosticAttempts(UUID employeeRegistrationId) {
        return jdbcTemplate.queryForObject(
                "select count(*) from diagnostic_attempts where employee_registration_id = ?",
                Integer.class,
                employeeRegistrationId
        );
    }

    private Map<String, Object> lessonProgressRow(UUID employeeRegistrationId, String lessonId) {
        return jdbcTemplate.queryForMap("""
                select *
                from employee_lesson_progress
                where employee_registration_id = ?
                  and lesson_id = ?
                """, employeeRegistrationId, lessonId);
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
