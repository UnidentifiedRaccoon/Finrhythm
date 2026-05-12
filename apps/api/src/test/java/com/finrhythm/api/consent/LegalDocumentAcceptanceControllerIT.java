package com.finrhythm.api.consent;

import com.finrhythm.api.registration.domain.EmployeeRegistration;
import com.finrhythm.api.registration.domain.RegistrationContact;
import com.finrhythm.api.registration.persistence.EmployeeRegistrationRepository;
import com.finrhythm.api.tenant.domain.AccessPool;
import com.finrhythm.api.tenant.domain.ActivationSubjectRef;
import com.finrhythm.api.tenant.domain.PilotLaunch;
import com.finrhythm.api.tenant.domain.Tenant;
import com.finrhythm.api.tenant.persistence.AccessPoolRepository;
import com.finrhythm.api.tenant.persistence.PilotLaunchRepository;
import com.finrhythm.api.tenant.persistence.TenantRepository;
import com.finrhythm.api.tenant.service.InviteCodeAccessService;
import com.finrhythm.api.tenant.service.IssuedInviteCode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
class LegalDocumentAcceptanceControllerIT {
    private static final Instant ISSUED_AT = Instant.parse("2026-05-04T09:00:00Z");
    private static final Instant NON_EXPIRED_AT = Instant.parse("2030-05-04T09:00:00Z");
    private static final Instant REGISTERED_AT = Instant.parse("2026-05-12T05:30:00Z");
    private static final AtomicInteger SUBJECT_SEQUENCE = new AtomicInteger(2_000);

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_legal_acceptance_test")
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
    EmployeeRegistrationRepository employeeRegistrationRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void migrationCreatesAppendOnlyAcceptanceLogAnchoredToRegistrationScope() {
        List<String> columns = jdbcTemplate.queryForList("""
                select column_name
                from information_schema.columns
                where table_schema = 'public'
                  and table_name = 'legal_document_acceptance_log'
                order by ordinal_position
                """, String.class);

        assertThat(columns).containsExactly(
                "id",
                "employee_registration_id",
                "tenant_id",
                "pilot_launch_id",
                "access_pool_id",
                "document_type",
                "document_version",
                "accepted_at",
                "source",
                "created_at",
                "updated_at"
        );

        List<String> indexes = jdbcTemplate.queryForList("""
                select indexname
                from pg_indexes
                where schemaname = 'public'
                  and tablename = 'legal_document_acceptance_log'
                """, String.class);

        assertThat(indexes).contains("ux_legal_document_acceptance_log_employee_document_version");
    }

    @Test
    void recordsCurrentDraftAcceptanceAndTreatsSameVersionRetryAsIdempotent() throws Exception {
        SeededRegistration seeded = seedRegistration();

        String createdResponse = postAcceptance(seeded.registration().getId(), currentDraftRequest())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.employeeRegistrationId").value(seeded.registration().getId().toString()))
                .andExpect(jsonPath("$.tenantId").value(seeded.registration().getTenantId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(seeded.registration().getPilotLaunchId().toString()))
                .andExpect(jsonPath("$.accessPoolId").value(seeded.registration().getAccessPoolId().toString()))
                .andExpect(jsonPath("$.acceptedDocuments.length()").value(4))
                .andExpect(jsonPath("$.createdCount").value(4))
                .andExpect(jsonPath("$.idempotentRetry").value(false))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(createdResponse)
                .contains("PRIVACY_POLICY")
                .contains("PERSONAL_DATA_CONSENT")
                .contains("TERMS_OF_USE")
                .contains("FINANCIAL_DISCLAIMER")
                .doesNotContain(seeded.rawInviteCode())
                .doesNotContain(seeded.activationSubjectRef().value())
                .doesNotContain("Consent Synthetic")
                .doesNotContain("consent.synthetic@example.test")
                .doesNotContain("+70000000007")
                .doesNotContain("privacy policy body")
                .doesNotContain("legal text");

        assertThat(countAcceptances(seeded.registration().getId())).isEqualTo(4);
        assertStoredScope(seeded.registration());

        String retryResponse = postAcceptance(seeded.registration().getId(), currentDraftRequest())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeRegistrationId").value(seeded.registration().getId().toString()))
                .andExpect(jsonPath("$.acceptedDocuments.length()").value(4))
                .andExpect(jsonPath("$.createdCount").value(0))
                .andExpect(jsonPath("$.idempotentRetry").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(retryResponse)
                .doesNotContain(seeded.rawInviteCode())
                .doesNotContain(seeded.activationSubjectRef().value());
        assertThat(countAcceptances(seeded.registration().getId())).isEqualTo(4);
    }

    @Test
    void rejectsUnknownDocumentTypeUnsupportedVersionAndMissingRequiredDocumentWithSafeErrors() throws Exception {
        SeededRegistration seeded = seedRegistration();

        String unknownTypeResponse = postAcceptance(seeded.registration().getId(), """
                {
                  "source": "onboarding_privacy",
                  "documents": [
                    {"documentType": "COOKIE_POLICY", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "PERSONAL_DATA_CONSENT", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "TERMS_OF_USE", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "FINANCIAL_DISCLAIMER", "documentVersion": "draft-2026-05-12"}
                  ]
                }
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("UNKNOWN_DOCUMENT_TYPE"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(unknownTypeResponse).doesNotContain("COOKIE_POLICY");

        String unsupportedVersionResponse = postAcceptance(seeded.registration().getId(), """
                {
                  "source": "onboarding_privacy",
                  "documents": [
                    {"documentType": "PRIVACY_POLICY", "documentVersion": "final-v1"},
                    {"documentType": "PERSONAL_DATA_CONSENT", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "TERMS_OF_USE", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "FINANCIAL_DISCLAIMER", "documentVersion": "draft-2026-05-12"}
                  ]
                }
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("UNSUPPORTED_DOCUMENT_VERSION"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(unsupportedVersionResponse).doesNotContain("final-v1");

        postAcceptance(seeded.registration().getId(), """
                {
                  "source": "onboarding_privacy",
                  "documents": [
                    {"documentType": "PRIVACY_POLICY", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "PERSONAL_DATA_CONSENT", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "TERMS_OF_USE", "documentVersion": "draft-2026-05-12"}
                  ]
                }
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MISSING_REQUIRED_DOCUMENT"))
                .andExpect(jsonPath("$.fieldErrors[0].message").value("Required document is missing: FINANCIAL_DISCLAIMER."));

        assertThat(countAcceptances(seeded.registration().getId())).isZero();
    }

    @Test
    void rejectsUnknownRegistrationWithoutEchoingSubmittedDocumentDetails() throws Exception {
        String response = postAcceptance(UUID.randomUUID(), currentDraftRequest())
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("EMPLOYEE_REGISTRATION_NOT_FOUND"))
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response)
                .doesNotContain("draft-2026-05-12")
                .doesNotContain("onboarding_privacy");
    }

    @Test
    void openApiExposesLegalAcceptanceEndpointSchemasAndSafeErrors() throws Exception {
        String spec = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(spec)
                .contains("/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances")
                .contains("LegalDocumentAcceptanceRequest")
                .contains("LegalDocumentAcceptanceResponse")
                .contains("LegalDocumentType")
                .contains("PRIVACY_POLICY")
                .contains("PERSONAL_DATA_CONSENT")
                .contains("TERMS_OF_USE")
                .contains("FINANCIAL_DISCLAIMER")
                .contains("idempotentRetry")
                .contains("UNSUPPORTED_DOCUMENT_VERSION")
                .contains("MISSING_REQUIRED_DOCUMENT")
                .contains("EMPLOYEE_REGISTRATION_NOT_FOUND");
    }

    private org.springframework.test.web.servlet.ResultActions postAcceptance(UUID registrationId, String json)
            throws Exception {
        return mockMvc.perform(post("/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances",
                        registrationId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
    }

    private SeededRegistration seedRegistration() {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 5);
        IssuedInviteCode issuedCode = inviteCodeAccessService.issueBatch(
                tenant.getId(),
                accessPool.getId(),
                1,
                ISSUED_AT,
                NON_EXPIRED_AT
        ).get(0);
        ActivationSubjectRef subjectRef = subjectRef(SUBJECT_SEQUENCE.getAndIncrement());
        inviteCodeAccessService.activate(issuedCode.code(), subjectRef, REGISTERED_AT);
        EmployeeRegistration registration = employeeRegistrationRepository.saveAndFlush(EmployeeRegistration.register(
                tenant.getId(),
                accessPool.getPilotLaunch().getId(),
                accessPool.getId(),
                issuedCode.inviteCodeId(),
                subjectRef,
                new RegistrationContact(
                        "Consent Synthetic",
                        "consent.synthetic@example.test",
                        "+70000000007"
                ),
                REGISTERED_AT
        ));
        return new SeededRegistration(registration, issuedCode.code(), subjectRef);
    }

    private Tenant seedTenant() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return tenantRepository.saveAndFlush(Tenant.create("consent-" + suffix, "Consent tenant"));
    }

    private AccessPool seedAccessPool(Tenant tenant, int capacity) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        PilotLaunch pilotLaunch = pilotLaunchRepository.saveAndFlush(PilotLaunch.create(
                tenant,
                "consent-launch-" + suffix,
                "Consent pilot launch",
                capacity
        ));
        return accessPoolRepository.saveAndFlush(AccessPool.create(
                tenant,
                pilotLaunch,
                "consent-pool-" + suffix,
                "Consent access pool",
                capacity
        ));
    }

    private void assertStoredScope(EmployeeRegistration registration) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList("""
                select tenant_id, pilot_launch_id, access_pool_id, source
                from legal_document_acceptance_log
                where employee_registration_id = ?
                """, registration.getId());

        assertThat(rows).hasSize(4);
        for (Map<String, Object> row : rows) {
            assertThat(row.get("tenant_id")).isEqualTo(registration.getTenantId());
            assertThat(row.get("pilot_launch_id")).isEqualTo(registration.getPilotLaunchId());
            assertThat(row.get("access_pool_id")).isEqualTo(registration.getAccessPoolId());
            assertThat(row.get("source")).isEqualTo("onboarding_privacy");
        }
    }

    private int countAcceptances(UUID registrationId) {
        return jdbcTemplate.queryForObject("""
                select count(*)
                from legal_document_acceptance_log
                where employee_registration_id = ?
                """, Integer.class, registrationId);
    }

    private static String currentDraftRequest() {
        return """
                {
                  "source": "onboarding_privacy",
                  "documents": [
                    {"documentType": "PRIVACY_POLICY", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "PERSONAL_DATA_CONSENT", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "TERMS_OF_USE", "documentVersion": "draft-2026-05-12"},
                    {"documentType": "FINANCIAL_DISCLAIMER", "documentVersion": "draft-2026-05-12"}
                  ]
                }
                """;
    }

    private static ActivationSubjectRef subjectRef(int value) {
        return ActivationSubjectRef.fromSha256Hex("%064x".formatted(value));
    }

    private record SeededRegistration(
            EmployeeRegistration registration,
            String rawInviteCode,
            ActivationSubjectRef activationSubjectRef
    ) {
    }
}
