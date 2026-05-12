package com.finrhythm.api.registration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finrhythm.api.registration.service.RegistrationSubjectRefGenerator;
import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.InviteCode;
import com.finrhythm.api.tenant.domain.InviteCodeHash;
import com.finrhythm.api.tenant.domain.PilotLaunch;
import com.finrhythm.api.tenant.domain.Tenant;
import com.finrhythm.api.tenant.persistence.AccessPoolRepository;
import com.finrhythm.api.tenant.persistence.InviteCodeRepository;
import com.finrhythm.api.tenant.persistence.PilotLaunchRepository;
import com.finrhythm.api.tenant.persistence.TenantRepository;
import com.finrhythm.api.tenant.service.InviteCodeAccessService;
import com.finrhythm.api.tenant.service.InviteCodeGenerator;
import com.finrhythm.api.tenant.service.IssuedInviteCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
class EmployeeRegistrationControllerIT {
    private static final Instant ISSUED_AT = Instant.parse("2026-05-04T09:00:00Z");
    private static final Instant NON_EXPIRED_AT = Instant.parse("2030-05-04T09:00:00Z");
    private static final AtomicInteger SUBJECT_SEQUENCE = new AtomicInteger(1_000);

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_employee_registration_test")
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
    InviteCodeRepository inviteCodeRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @MockBean
    RegistrationSubjectRefGenerator subjectRefGenerator;

    @BeforeEach
    void configureSubjectRefs() {
        reset(subjectRefGenerator);
        given(subjectRefGenerator.generate()).willAnswer(invocation -> subjectRef(SUBJECT_SEQUENCE.getAndIncrement()));
    }

    @Test
    void registersEmployeeAndTreatsSameContactRetryAsIdempotent() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        JsonNode created = postRegistration("""
                {
                  "fullName": "  Alex   Pilot  ",
                  "email": "ALEX.PILOT@EXAMPLE.TEST",
                  "phone": "+7 (000) 000-00-01",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tenantId").value(tenant.getId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(accessPool.getPilotLaunch().getId().toString()))
                .andExpect(jsonPath("$.accessPoolId").value(accessPool.getId().toString()))
                .andExpect(jsonPath("$.inviteCodeId").value(issuedCode.inviteCodeId().toString()))
                .andExpect(jsonPath("$.idempotentRetry").value(false))
                .andReturnJson();

        UUID registrationId = UUID.fromString(created.get("employeeRegistrationId").asText());
        assertThat(registrationId).isNotNull();
        assertThat(countRegistrationsForInvite(issuedCode.inviteCodeId())).isEqualTo(1);
        assertThat(jdbcTemplate.queryForObject("""
                select full_name || '|' || email || '|' || phone
                from employee_registrations
                where id = ?
                """, String.class, registrationId)).isEqualTo("Alex Pilot|alex.pilot@example.test|+70000000001");
        assertInviteActivated(issuedCode.inviteCodeId());

        JsonNode retry = postRegistration("""
                {
                  "fullName": "Alex Pilot",
                  "email": "alex.pilot@example.test",
                  "phone": "+70000000001",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeRegistrationId").value(registrationId.toString()))
                .andExpect(jsonPath("$.idempotentRetry").value(true))
                .andReturnJson();

        Instant createdRegisteredAt = Instant.parse(created.get("registeredAt").asText());
        Instant retryRegisteredAt = Instant.parse(retry.get("registeredAt").asText());
        assertThat(retryRegisteredAt).isBetween(
                createdRegisteredAt.minus(1, ChronoUnit.MICROS),
                createdRegisteredAt.plus(1, ChronoUnit.MICROS));
        assertThat(countRegistrationsForInvite(issuedCode.inviteCodeId())).isEqualTo(1);
    }

    @Test
    void returnsStructuredErrorsForInvalidExpiredRevokedAndUnissuedCodesWithoutEchoingSubmittedCode() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 10);

        assertInviteError("NOT-A-REAL-CODE", "INVALID_INVITE_CODE", "NOT-A-REAL-CODE");

        IssuedInviteCode expiredCode = issueOne(tenant, accessPool, ISSUED_AT.plusSeconds(60));
        assertInviteError(expiredCode.code(), "EXPIRED_INVITE_CODE", expiredCode.code());

        IssuedInviteCode revokedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);
        updateInviteStatus(revokedCode.inviteCodeId(), "REVOKED");
        assertInviteError(revokedCode.code(), "REVOKED_INVITE_CODE", revokedCode.code());

        String unissuedRawCode = new InviteCodeGenerator().generate();
        inviteCodeRepository.saveAndFlush(InviteCode.created(
                tenant,
                accessPool,
                InviteCodeHash.fromEnteredCode(unissuedRawCode)
        ));
        assertInviteError(unissuedRawCode, "UNISSUED_INVITE_CODE", unissuedRawCode);
    }

    @Test
    void rejectsDifferentContactForActivatedCodeWithoutRevealingExistingEmployeeData() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        postRegistration("""
                {
                  "fullName": "First Synthetic",
                  "email": "first.synthetic@example.test",
                  "phone": "+70000000002",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated());

        String response = postRegistration("""
                {
                  "fullName": "Second Synthetic",
                  "email": "second.synthetic@example.test",
                  "phone": "+70000000003",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("DUPLICATE_INVITE_CODE"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response)
                .doesNotContain("First Synthetic")
                .doesNotContain("first.synthetic@example.test")
                .doesNotContain("+70000000002")
                .doesNotContain(issuedCode.code());
        assertThat(countRegistrationsForInvite(issuedCode.inviteCodeId())).isEqualTo(1);
    }

    @Test
    void validationErrorsDoNotEchoSubmittedPiiOrInviteCode() throws Exception {
        String response = postRegistration("""
                {
                  "fullName": " ",
                  "email": "not-an-email",
                  "phone": "12",
                  "inviteCode": "SYNTH-RAW-CODE"
                }
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors[?(@.field == 'fullName')]").exists())
                .andExpect(jsonPath("$.fieldErrors[?(@.field == 'email')]").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response)
                .doesNotContain("not-an-email")
                .doesNotContain("SYNTH-RAW-CODE")
                .doesNotContain("12");
    }

    @Test
    void rollsBackInviteActivationWhenRegistrationPersistenceFails() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode firstCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);
        IssuedInviteCode secondCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);
        ActivationSubjectRef reusedSubjectRef = subjectRef(SUBJECT_SEQUENCE.getAndIncrement());
        given(subjectRefGenerator.generate()).willReturn(reusedSubjectRef, reusedSubjectRef);

        postRegistration("""
                {
                  "fullName": "Rollback First",
                  "email": "rollback.first@example.test",
                  "phone": "+70000000004",
                  "inviteCode": "%s"
                }
                """.formatted(firstCode.code()))
                .andExpect(status().isCreated());

        postRegistration("""
                {
                  "fullName": "Rollback Second",
                  "email": "rollback.second@example.test",
                  "phone": "+70000000005",
                  "inviteCode": "%s"
                }
                """.formatted(secondCode.code()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("DUPLICATE_INVITE_CODE"));

        assertThat(countRegistrationsForInvite(secondCode.inviteCodeId())).isZero();
        assertThat(jdbcTemplate.queryForObject("""
                select status
                from invite_codes
                where id = ?
                """, String.class, secondCode.inviteCodeId())).isEqualTo("ISSUED");
    }

    @Test
    void openApiExposesRegistrationEndpointSchemasAndSafeErrorExamples() throws Exception {
        String spec = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(spec)
                .contains("/api/v1/employee-registrations")
                .contains("EmployeeRegistrationRequest")
                .contains("EmployeeRegistrationResponse")
                .contains("ApiErrorResponse")
                .contains("employeeRegistrationId")
                .contains("idempotentRetry")
                .contains("INVALID_INVITE_CODE")
                .contains("DUPLICATE_INVITE_CODE");
    }

    private RegistrationResultActions postRegistration(String json) throws Exception {
        return new RegistrationResultActions(mockMvc.perform(post("/api/v1/employee-registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private void assertInviteError(String inviteCode, String expectedCode, String forbiddenEcho) throws Exception {
        String response = postRegistration("""
                {
                  "fullName": "Error Path",
                  "email": "error.path@example.test",
                  "phone": "+70000000006",
                  "inviteCode": "%s"
                }
                """.formatted(inviteCode))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(expectedCode))
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response).doesNotContain(forbiddenEcho);
    }

    private Tenant seedTenant() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return tenantRepository.saveAndFlush(Tenant.create("pilot-" + suffix, "Pilot tenant"));
    }

    private AccessPool seedAccessPool(Tenant tenant, int capacity) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        PilotLaunch pilotLaunch = pilotLaunchRepository.saveAndFlush(PilotLaunch.create(
                tenant,
                "pilot-launch-" + suffix,
                "Pilot launch main",
                capacity
        ));
        return accessPoolRepository.saveAndFlush(AccessPool.create(
                tenant,
                pilotLaunch,
                "access-pool-" + suffix,
                "Access pool main",
                capacity
        ));
    }

    private IssuedInviteCode issueOne(Tenant tenant, AccessPool accessPool, Instant expiresAt) {
        return inviteCodeAccessService.issueBatch(tenant.getId(), accessPool.getId(), 1, ISSUED_AT, expiresAt).get(0);
    }

    private void updateInviteStatus(UUID inviteCodeId, String status) {
        jdbcTemplate.update("""
                update invite_codes
                set status = ?,
                    updated_at = ?
                where id = ?
                """, status, Timestamp.from(Instant.now()), inviteCodeId);
    }

    private int countRegistrationsForInvite(UUID inviteCodeId) {
        return jdbcTemplate.queryForObject("""
                select count(*)
                from employee_registrations
                where invite_code_id = ?
                """, Integer.class, inviteCodeId);
    }

    private void assertInviteActivated(UUID inviteCodeId) {
        Map<String, Object> row = jdbcTemplate.queryForMap("""
                select status, activation_subject_ref
                from invite_codes
                where id = ?
                """, inviteCodeId);

        assertThat(row.get("status")).isEqualTo("ACTIVATED");
        assertThat(row.get("activation_subject_ref")).asString().matches("^[a-f0-9]{64}$");
    }

    private static ActivationSubjectRef subjectRef(int value) {
        return ActivationSubjectRef.fromSha256Hex("%064x".formatted(value));
    }

    private static final class RegistrationResultActions {
        private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

        private final org.springframework.test.web.servlet.ResultActions delegate;

        private RegistrationResultActions(org.springframework.test.web.servlet.ResultActions delegate) {
            this.delegate = delegate;
        }

        RegistrationResultActions andExpect(org.springframework.test.web.servlet.ResultMatcher matcher) throws Exception {
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
