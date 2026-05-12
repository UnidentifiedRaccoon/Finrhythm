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
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

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
    void returnsProfileSummaryForMatchingInviteAndContactWithoutMutatingRegistration() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        JsonNode created = postRegistration("""
                {
                  "fullName": "  Profile   Contact  ",
                  "email": "PROFILE.CONTACT@EXAMPLE.TEST",
                  "phone": "+7 (000) 000-00-07",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated())
                .andReturnJson();

        UUID registrationId = UUID.fromString(created.get("employeeRegistrationId").asText());

        String response = postProfileSummary("""
                {
                  "fullName": "Profile Contact",
                  "email": "profile.contact@example.test",
                  "phone": "+70000000007",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeRegistrationId").value(registrationId.toString()))
                .andExpect(jsonPath("$.fullName").value("Profile Contact"))
                .andExpect(jsonPath("$.email").value("profile.contact@example.test"))
                .andExpect(jsonPath("$.phone").value("+70000000007"))
                .andExpect(jsonPath("$.tenantId").value(tenant.getId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(accessPool.getPilotLaunch().getId().toString()))
                .andExpect(jsonPath("$.accessPoolId").value(accessPool.getId().toString()))
                .andExpect(jsonPath("$.contactVerifiedByRegistrationMatch").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertRegisteredAtMatchesPersistedPrecision(created, OBJECT_MAPPER.readTree(response));
        assertThat(response)
                .doesNotContain(issuedCode.code())
                .doesNotContain("activationSubjectRef")
                .doesNotContain("lookupHash")
                .doesNotContain("inviteCodeId");
        assertThat(countRegistrationsForInvite(issuedCode.inviteCodeId())).isEqualTo(1);
    }

    @Test
    void profileSummaryRejectsUnknownInviteAndContactMismatchWithoutEchoingSensitiveValues() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        postRegistration("""
                {
                  "fullName": "Profile First",
                  "email": "profile.first@example.test",
                  "phone": "+70000000008",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated());

        String mismatchResponse = postProfileSummary("""
                {
                  "fullName": "Profile Intruder",
                  "email": "profile.intruder@example.test",
                  "phone": "+70000000009",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("PROFILE_LOOKUP_NOT_FOUND"))
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(mismatchResponse)
                .doesNotContain("Profile First")
                .doesNotContain("profile.first@example.test")
                .doesNotContain("+70000000008")
                .doesNotContain("Profile Intruder")
                .doesNotContain("profile.intruder@example.test")
                .doesNotContain("+70000000009")
                .doesNotContain(issuedCode.code())
                .doesNotContain("activationSubjectRef")
                .doesNotContain("lookupHash");

        String unknownInvite = "UNKNOWN-PROFILE-CODE";
        String unknownResponse = postProfileSummary("""
                {
                  "fullName": "Profile Missing",
                  "email": "profile.missing@example.test",
                  "phone": "+70000000010",
                  "inviteCode": "%s"
                }
                """.formatted(unknownInvite))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("PROFILE_LOOKUP_NOT_FOUND"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(unknownResponse)
                .doesNotContain("Profile Missing")
                .doesNotContain("profile.missing@example.test")
                .doesNotContain("+70000000010")
                .doesNotContain(unknownInvite);
        assertThat(countRegistrationsForInvite(issuedCode.inviteCodeId())).isEqualTo(1);
    }

    @Test
    void profileSummaryValidationErrorsDoNotEchoSubmittedPiiOrInviteCode() throws Exception {
        String response = postProfileSummary("""
                {
                  "fullName": " ",
                  "email": "bad-profile-email",
                  "phone": "10",
                  "inviteCode": "PROFILE-RAW-CODE"
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
                .doesNotContain("bad-profile-email")
                .doesNotContain("PROFILE-RAW-CODE")
                .doesNotContain("10");
    }

    @Test
    void createsProfileSessionAndReadsMeSummaryWithoutPersistingRawToken() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        JsonNode created = postRegistration("""
                {
                  "fullName": "  Session   Contact  ",
                  "email": "SESSION.CONTACT@EXAMPLE.TEST",
                  "phone": "+7 (000) 000-00-11",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated())
                .andReturnJson();

        UUID registrationId = UUID.fromString(created.get("employeeRegistrationId").asText());
        JsonNode session = postProfileSession("""
                {
                  "fullName": "Session Contact",
                  "email": "session.contact@example.test",
                  "phone": "+70000000011",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.employeeRegistrationId").value(registrationId.toString()))
                .andExpect(jsonPath("$.tenantId").value(tenant.getId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(accessPool.getPilotLaunch().getId().toString()))
                .andExpect(jsonPath("$.accessPoolId").value(accessPool.getId().toString()))
                .andExpect(jsonPath("$.contactVerifiedByRegistrationMatch").value(true))
                .andReturnJson();

        String token = session.get("profileSessionToken").asText();
        assertThat(token)
                .matches("^[A-Za-z0-9_-]{43}$")
                .doesNotContain(".");
        assertThat(Instant.parse(session.get("expiresAt").asText())).isAfter(Instant.now());
        assertThat(tokenHashForRegistration(registrationId))
                .matches("^[a-f0-9]{64}$")
                .isNotEqualTo(token);

        String firstRead = getMeProfileSummary(token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeRegistrationId").value(registrationId.toString()))
                .andExpect(jsonPath("$.fullName").value("Session Contact"))
                .andExpect(jsonPath("$.email").value("session.contact@example.test"))
                .andExpect(jsonPath("$.phone").value("+70000000011"))
                .andExpect(jsonPath("$.tenantId").value(tenant.getId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(accessPool.getPilotLaunch().getId().toString()))
                .andExpect(jsonPath("$.accessPoolId").value(accessPool.getId().toString()))
                .andExpect(jsonPath("$.contactVerifiedByRegistrationMatch").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertRegisteredAtMatchesPersistedPrecision(created, OBJECT_MAPPER.readTree(firstRead));
        getMeProfileSummary(token).andExpect(status().isOk());
        assertThat(countActiveProfileSessions(registrationId)).isEqualTo(1);
        assertThat(firstRead)
                .doesNotContain(token)
                .doesNotContain(issuedCode.code())
                .doesNotContain("activationSubjectRef")
                .doesNotContain("lookupHash")
                .doesNotContain("inviteCodeId");
    }

    @Test
    void newProfileSessionRevokesPreviousSessionForSameRegistration() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        JsonNode created = postRegistration("""
                {
                  "fullName": "Session Rotate",
                  "email": "session.rotate@example.test",
                  "phone": "+70000000012",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated())
                .andReturnJson();
        UUID registrationId = UUID.fromString(created.get("employeeRegistrationId").asText());

        String firstToken = postProfileSession(profileSessionJson(issuedCode.code(), "+70000000012"))
                .andExpect(status().isCreated())
                .andReturnJson()
                .get("profileSessionToken")
                .asText();
        String secondToken = postProfileSession(profileSessionJson(issuedCode.code(), "+70000000012"))
                .andExpect(status().isCreated())
                .andReturnJson()
                .get("profileSessionToken")
                .asText();

        assertThat(secondToken).isNotEqualTo(firstToken);
        assertThat(countRevokedProfileSessions(registrationId)).isEqualTo(1);
        assertThat(countActiveProfileSessions(registrationId)).isEqualTo(1);

        String revokedResponse = getMeProfileSummary(firstToken)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(revokedResponse).doesNotContain(firstToken);
        getMeProfileSummary(secondToken).andExpect(status().isOk());
    }

    @Test
    void profileSessionRejectsProofFailuresAndValidationWithoutSensitiveEchoes() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        postRegistration("""
                {
                  "fullName": "Session Owner",
                  "email": "session.owner@example.test",
                  "phone": "+70000000013",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated());

        String mismatchResponse = postProfileSession("""
                {
                  "fullName": "Session Intruder",
                  "email": "session.intruder@example.test",
                  "phone": "+70000000014",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("PROFILE_LOOKUP_NOT_FOUND"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(mismatchResponse)
                .doesNotContain("Session Owner")
                .doesNotContain("session.owner@example.test")
                .doesNotContain("+70000000013")
                .doesNotContain("Session Intruder")
                .doesNotContain("session.intruder@example.test")
                .doesNotContain("+70000000014")
                .doesNotContain(issuedCode.code())
                .doesNotContain("activationSubjectRef")
                .doesNotContain("lookupHash");

        String validationResponse = postProfileSession("""
                {
                  "fullName": " ",
                  "email": "bad-session-email",
                  "phone": "13",
                  "inviteCode": "SESSION-RAW-CODE"
                }
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(validationResponse)
                .doesNotContain("bad-session-email")
                .doesNotContain("SESSION-RAW-CODE")
                .doesNotContain("13");
    }

    @Test
    void meProfileSummaryRejectsMissingMalformedUnknownExpiredAndRevokedSessionTokensSafely() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = issueOne(tenant, accessPool, NON_EXPIRED_AT);

        postRegistration("""
                {
                  "fullName": "Session Expire",
                  "email": "session.expire@example.test",
                  "phone": "+70000000015",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated());

        String token = postProfileSession("""
                {
                  "fullName": "Session Expire",
                  "email": "session.expire@example.test",
                  "phone": "+70000000015",
                  "inviteCode": "%s"
                }
                """.formatted(issuedCode.code()))
                .andExpect(status().isCreated())
                .andReturnJson()
                .get("profileSessionToken")
                .asText();

        getMeProfileSummaryWithoutToken()
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"));

        String malformedToken = "bad.profile.session.token";
        String malformedResponse = getMeProfileSummary(malformedToken)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(malformedResponse).doesNotContain(malformedToken);

        String unknownToken = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        String unknownResponse = getMeProfileSummary(unknownToken)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(unknownResponse).doesNotContain(unknownToken);

        expireProfileSessions();
        String expiredResponse = getMeProfileSummary(token)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("PROFILE_SESSION_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(expiredResponse)
                .doesNotContain(token)
                .doesNotContain(issuedCode.code())
                .doesNotContain("session.expire@example.test");
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
                .contains("/api/v1/employee-registrations/profile-summary")
                .contains("/api/v1/employee-registrations/profile-sessions")
                .contains("/api/v1/employee-registrations/me/profile-summary")
                .contains("EmployeeRegistrationRequest")
                .contains("EmployeeRegistrationResponse")
                .contains("EmployeeProfileSummaryRequest")
                .contains("EmployeeProfileSummaryResponse")
                .contains("EmployeeProfileSessionRequest")
                .contains("EmployeeProfileSessionResponse")
                .contains("ApiErrorResponse")
                .contains("employeeRegistrationId")
                .contains("idempotentRetry")
                .contains("contactVerifiedByRegistrationMatch")
                .contains("employeeProfileSessionBearerAuth")
                .contains("INVALID_INVITE_CODE")
                .contains("DUPLICATE_INVITE_CODE")
                .contains("PROFILE_LOOKUP_NOT_FOUND")
                .contains("PROFILE_SESSION_AUTHENTICATION_REQUIRED");
    }

    private RegistrationResultActions postRegistration(String json) throws Exception {
        return new RegistrationResultActions(mockMvc.perform(post("/api/v1/employee-registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private RegistrationResultActions postProfileSummary(String json) throws Exception {
        return new RegistrationResultActions(mockMvc.perform(post("/api/v1/employee-registrations/profile-summary")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private RegistrationResultActions postProfileSession(String json) throws Exception {
        return new RegistrationResultActions(mockMvc.perform(post("/api/v1/employee-registrations/profile-sessions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)));
    }

    private RegistrationResultActions getMeProfileSummary(String profileSessionToken) throws Exception {
        return new RegistrationResultActions(mockMvc.perform(get("/api/v1/employee-registrations/me/profile-summary")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + profileSessionToken)));
    }

    private RegistrationResultActions getMeProfileSummaryWithoutToken() throws Exception {
        return new RegistrationResultActions(mockMvc.perform(get("/api/v1/employee-registrations/me/profile-summary")));
    }

    private static String profileSessionJson(String inviteCode, String phone) {
        return """
                {
                  "fullName": "Session Rotate",
                  "email": "session.rotate@example.test",
                  "phone": "%s",
                  "inviteCode": "%s"
                }
                """.formatted(phone, inviteCode);
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

    private String tokenHashForRegistration(UUID registrationId) {
        return jdbcTemplate.queryForObject("""
                select token_hash
                from employee_profile_sessions
                where employee_registration_id = ?
                """, String.class, registrationId);
    }

    private int countActiveProfileSessions(UUID registrationId) {
        return jdbcTemplate.queryForObject("""
                select count(*)
                from employee_profile_sessions
                where employee_registration_id = ?
                  and revoked_at is null
                  and expires_at > now()
                """, Integer.class, registrationId);
    }

    private int countRevokedProfileSessions(UUID registrationId) {
        return jdbcTemplate.queryForObject("""
                select count(*)
                from employee_profile_sessions
                where employee_registration_id = ?
                  and revoked_at is not null
                """, Integer.class, registrationId);
    }

    private void expireProfileSessions() {
        jdbcTemplate.update("""
                update employee_profile_sessions
                set created_at = now() - interval '2 minutes',
                    expires_at = now() - interval '1 minute',
                    updated_at = now()
                """);
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

    private static void assertRegisteredAtMatchesPersistedPrecision(JsonNode created, JsonNode actual) {
        Instant createdRegisteredAt = Instant.parse(created.get("registeredAt").asText());
        Instant actualRegisteredAt = Instant.parse(actual.get("registeredAt").asText());

        assertThat(actualRegisteredAt).isBetween(
                createdRegisteredAt.minus(1, ChronoUnit.MICROS),
                createdRegisteredAt.plus(1, ChronoUnit.MICROS)
        );
    }

    private static final class RegistrationResultActions {
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
