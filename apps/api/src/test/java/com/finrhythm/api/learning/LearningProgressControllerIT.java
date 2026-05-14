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
    void openApiExposesLearningEndpointSchemaAndProfileSessionSecurity() throws Exception {
        String spec = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode openApi = OBJECT_MAPPER.readTree(spec);

        assertThat(spec)
                .contains("/api/v1/learning/me/lessons/{lessonId}/start")
                .contains("LessonProgressResponse")
                .contains("employeeProfileSessionBearerAuth")
                .contains("idempotentResume")
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

    private Result startLesson(String token, String lessonId) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/learning/me/lessons/{lessonId}/start", lessonId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)));
    }

    private Result startLessonWithoutToken(String lessonId) throws Exception {
        return new Result(mockMvc.perform(post("/api/v1/learning/me/lessons/{lessonId}/start", lessonId)));
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
