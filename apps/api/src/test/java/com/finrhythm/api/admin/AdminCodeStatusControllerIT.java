package com.finrhythm.api.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finrhythm.api.tenant.domain.AccessPool;
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
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Timestamp;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
class AdminCodeStatusControllerIT {
    private static final Instant ISSUED_AT = Instant.parse("2026-05-09T09:00:00Z");
    private static final Instant ADMIN_READ_AT = Instant.parse("2026-05-12T09:00:00Z");
    private static final Instant EXPIRES_AT = Instant.parse("2026-06-09T09:00:00Z");
    private static final Instant STALE_EXPIRES_AT = Instant.parse("2026-05-10T09:00:00Z");
    private static final Instant ACTIVATED_AT = Instant.parse("2026-05-09T10:00:00Z");
    private static final Instant REGISTERED_AT = Instant.parse("2026-05-09T10:01:00Z");
    private static final AtomicInteger SUBJECT_SEQUENCE = new AtomicInteger(10_000);
    private static final String ADMIN_TOKEN = "test-admin-token";
    private static final String CODE_STATUS_PATH =
            "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("finrhythm_admin_code_status_test")
            .withUsername("finlit")
            .withPassword("finlit_local");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("finrhythm.admin.security.token", () -> ADMIN_TOKEN);
    }

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

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

    @TestConfiguration
    static class FixedClockConfig {
        @Bean
        @Primary
        Clock fixedClock() {
            return Clock.fixed(ADMIN_READ_AT, ZoneOffset.UTC);
        }
    }

    @Test
    void flywayCreatesAdminAccessAuditLogWithSafeMetadataShape() {
        Set<String> columns = Set.copyOf(jdbcTemplate.queryForList("""
                select column_name
                from information_schema.columns
                where table_name = 'admin_access_audit_log'
                """, String.class));

        assertThat(columns).contains(
                "id",
                "occurred_at",
                "http_method",
                "route",
                "action",
                "permission",
                "tenant_id",
                "pilot_launch_id",
                "access_pool_id",
                "status_code",
                "outcome",
                "principal_type",
                "principal_ref",
                "created_at"
        );
        assertThat(columns).doesNotContain(
                "authorization_header",
                "bearer_token",
                "invite_code",
                "raw_invite_code",
                "activation_subject_ref",
                "full_name",
                "email",
                "phone",
                "request_body",
                "response_body",
                "query_string",
                "legal_text"
        );
    }

    @Test
    void logsSuccessfulCodeStatusReadWithScopeAndSafePrincipal() throws Exception {
        SeededAccessPool seededAccessPool = seedMixedAccessPool();
        long before = auditCount();

        mockMvc.perform(adminCodeStatusRequest(
                        seededAccessPool.tenant().getId(),
                        seededAccessPool.accessPool().getPilotLaunch().getId(),
                        seededAccessPool.accessPool().getId()
                )
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk());

        assertThat(auditCount()).isEqualTo(before + 1);
        List<Map<String, Object>> rows = auditRowsByScope(
                seededAccessPool.tenant().getId(),
                seededAccessPool.accessPool().getPilotLaunch().getId(),
                seededAccessPool.accessPool().getId()
        );
        assertThat(rows).hasSize(1);

        Map<String, Object> row = rows.get(0);
        assertThat(row)
                .containsEntry("http_method", "GET")
                .containsEntry("route", CODE_STATUS_PATH)
                .containsEntry("action", "admin.code_status.read")
                .containsEntry("permission", "admin.code-status.read")
                .containsEntry("tenant_id", seededAccessPool.tenant().getId())
                .containsEntry("pilot_launch_id", seededAccessPool.accessPool().getPilotLaunch().getId())
                .containsEntry("access_pool_id", seededAccessPool.accessPool().getId())
                .containsEntry("status_code", 200)
                .containsEntry("outcome", "SUCCESS")
                .containsEntry("principal_type", "ADMIN_API_TOKEN")
                .containsEntry("principal_ref", "admin-api-token");
        assertAuditRowSafe(row, ADMIN_TOKEN, seededAccessPool.issuedCodes().get(0).code());
    }

    @Test
    void logsMissingAndInvalidTokenAttemptsWithoutTokenMaterialOrQueryString() throws Exception {
        UUID tenantId = UUID.randomUUID();
        UUID pilotLaunchId = UUID.randomUUID();
        UUID accessPoolId = UUID.randomUUID();
        long before = auditCount();

        mockMvc.perform(get(CODE_STATUS_PATH, tenantId, pilotLaunchId, accessPoolId)
                        .param("inviteCode", "RAW-CODE-123456"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("ADMIN_AUTHENTICATION_REQUIRED"));

        mockMvc.perform(get(CODE_STATUS_PATH, tenantId, pilotLaunchId, accessPoolId)
                        .param("email", "synthetic.learner@example.test")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer wrong-admin-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("ADMIN_AUTHENTICATION_REQUIRED"));

        assertThat(auditCount()).isEqualTo(before + 2);
        List<Map<String, Object>> rows = auditRowsByScope(tenantId, pilotLaunchId, accessPoolId);
        assertThat(rows).hasSize(2);
        assertThat(rows).allSatisfy(row -> {
            assertThat(row)
                    .containsEntry("http_method", "GET")
                    .containsEntry("route", CODE_STATUS_PATH)
                    .containsEntry("action", "admin.code_status.read")
                    .containsEntry("permission", "admin.code-status.read")
                    .containsEntry("status_code", 401)
                    .containsEntry("outcome", "AUTHENTICATION_REQUIRED")
                    .containsEntry("principal_type", "ANONYMOUS");
            assertThat(row.get("principal_ref")).isNull();
            assertAuditRowSafe(
                    row,
                    "wrong-admin-token",
                    "RAW-CODE-123456",
                    "synthetic.learner@example.test",
                    "?"
            );
        });
    }

    @Test
    void logsKnownRouteNotFoundAndValidationFailures() throws Exception {
        UUID tenantId = UUID.randomUUID();
        UUID pilotLaunchId = UUID.randomUUID();
        UUID accessPoolId = UUID.randomUUID();
        long before = auditCount();

        mockMvc.perform(adminCodeStatusRequest(tenantId, pilotLaunchId, accessPoolId)
                        .param("status", "REGISTERED"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));

        mockMvc.perform(adminCodeStatusRequest(tenantId, pilotLaunchId, accessPoolId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("ACCESS_POOL_STATUS_VIEW_NOT_FOUND"));

        assertThat(auditCount()).isEqualTo(before + 2);
        assertThat(auditRowsByScope(tenantId, pilotLaunchId, accessPoolId))
                .anySatisfy(row -> assertThat(row)
                        .containsEntry("status_code", 400)
                        .containsEntry("outcome", "VALIDATION_FAILED"))
                .anySatisfy(row -> assertThat(row)
                        .containsEntry("status_code", 404)
                        .containsEntry("outcome", "NOT_FOUND"));
    }

    @Test
    void logsDefaultDeniedAdminPathWithCoarseRouteOnly() throws Exception {
        long before = auditCount();

        mockMvc.perform(get("/api/v1/admin/export/raw-token-like-value")
                        .param("inviteCode", "RAW-CODE-XYZ")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + ADMIN_TOKEN))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("ADMIN_PERMISSION_DENIED"));

        assertThat(auditCount()).isEqualTo(before + 1);
        List<Map<String, Object>> rows = jdbcTemplate.queryForList("""
                select *
                from admin_access_audit_log
                where action = 'admin.default_denied'
                  and status_code = 403
                  and principal_type = 'ADMIN_API_TOKEN'
                """);
        assertThat(rows).anySatisfy(row -> {
            assertThat(row)
                    .containsEntry("http_method", "GET")
                    .containsEntry("route", "/api/v1/admin/**")
                    .containsEntry("permission", null)
                    .containsEntry("outcome", "PERMISSION_DENIED")
                    .containsEntry("principal_ref", "admin-api-token");
            assertThat(row.get("tenant_id")).isNull();
            assertThat(row.get("pilot_launch_id")).isNull();
            assertThat(row.get("access_pool_id")).isNull();
            assertAuditRowSafe(row, ADMIN_TOKEN, "raw-token-like-value", "RAW-CODE-XYZ", "?");
        });
    }

    @Test
    void rejectsAdminCodeStatusWithoutValidAdminBearerToken() throws Exception {
        UUID tenantId = UUID.randomUUID();
        UUID pilotLaunchId = UUID.randomUUID();
        UUID accessPoolId = UUID.randomUUID();

        String unauthenticated = mockMvc.perform(get(
                        CODE_STATUS_PATH,
                        tenantId,
                        pilotLaunchId,
                        accessPoolId
                ))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("ADMIN_AUTHENTICATION_REQUIRED"))
                .andExpect(jsonPath("$.fieldErrors.length()").value(0))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(unauthenticated)
                .doesNotContain(tenantId.toString())
                .doesNotContain(pilotLaunchId.toString())
                .doesNotContain(accessPoolId.toString());

        String invalidToken = mockMvc.perform(get(
                        CODE_STATUS_PATH,
                        tenantId,
                        pilotLaunchId,
                        accessPoolId
                )
                        .header(HttpHeaders.AUTHORIZATION, "Bearer wrong-admin-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("ADMIN_AUTHENTICATION_REQUIRED"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(invalidToken).doesNotContain("wrong-admin-token");
    }

    @Test
    void deniesOtherAdminApiPathsByDefaultEvenWithCodeStatusToken() throws Exception {
        mockMvc.perform(get("/api/v1/admin/unknown")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + ADMIN_TOKEN))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("ADMIN_PERMISSION_DENIED"));
    }

    @Test
    void returnsPilotAccessPoolScaleCountsFunnelPaginationAndPrivacySafeRows() throws Exception {
        SeededAccessPool seededAccessPool = seedMixedAccessPool();

        String response = mockMvc.perform(adminCodeStatusRequest(
                        seededAccessPool.tenant().getId(),
                        seededAccessPool.accessPool().getPilotLaunch().getId(),
                        seededAccessPool.accessPool().getId()
                )
                        .param("page", "0")
                        .param("size", "25"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenantId").value(seededAccessPool.tenant().getId().toString()))
                .andExpect(jsonPath("$.pilotLaunchId").value(seededAccessPool.accessPool().getPilotLaunch().getId().toString()))
                .andExpect(jsonPath("$.pilotLaunchKey").value(seededAccessPool.accessPool().getPilotLaunch().getKey()))
                .andExpect(jsonPath("$.pilotLaunchName").value("Pilot launch main"))
                .andExpect(jsonPath("$.accessPoolId").value(seededAccessPool.accessPool().getId().toString()))
                .andExpect(jsonPath("$.accessPoolKey").value(seededAccessPool.accessPool().getKey()))
                .andExpect(jsonPath("$.accessPoolName").value("Access pool main"))
                .andExpect(jsonPath("$.accessPoolStatus").value("PLANNED"))
                .andExpect(jsonPath("$.poolCapacity").value(500))
                .andExpect(jsonPath("$.summary.issuedCount").value(500))
                .andExpect(jsonPath("$.summary.activatedCount").value(120))
                .andExpect(jsonPath("$.summary.registeredCount").value(60))
                .andExpect(jsonPath("$.summary.revokedCount").value(20))
                .andExpect(jsonPath("$.summary.expiredCount").value(10))
                .andExpect(jsonPath("$.summary.totalCodeCount").value(500))
                .andExpect(jsonPath("$.summary.remainingCapacity").value(0))
                .andExpect(jsonPath("$.codes.page").value(0))
                .andExpect(jsonPath("$.codes.size").value(25))
                .andExpect(jsonPath("$.codes.totalItems").value(500))
                .andExpect(jsonPath("$.codes.totalPages").value(20))
                .andExpect(jsonPath("$.codes.items.length()").value(25))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode body = objectMapper.readTree(response);
        assertStatusCount(body, "CREATED", 0);
        assertStatusCount(body, "ISSUED", 350);
        assertStatusCount(body, "RESERVED", 0);
        assertStatusCount(body, "ACTIVATED", 120);
        assertStatusCount(body, "REVOKED", 20);
        assertStatusCount(body, "EXPIRED", 10);
        assertPrivacySafeResponse(response, seededAccessPool.issuedCodes().get(0).code());
    }

    @Test
    void computesExpiredIssuedCodesForAdminReadModelWithoutMutatingInviteLifecycle() throws Exception {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 4);
        List<IssuedInviteCode> issuedCodes = inviteCodeAccessService.issueBatch(
                tenant.getId(),
                accessPool.getId(),
                4,
                ISSUED_AT,
                EXPIRES_AT
        );
        expireIssuedCodeByTime(issuedCodes.get(0).inviteCodeId(), STALE_EXPIRES_AT);
        setTerminalStatus(issuedCodes.get(1).inviteCodeId(), "EXPIRED");
        activate(
                issuedCodes.get(2).inviteCodeId(),
                activationSubjectRef(SUBJECT_SEQUENCE.getAndIncrement(), 0),
                ACTIVATED_AT
        );

        String response = mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        accessPool.getPilotLaunch().getId(),
                        accessPool.getId()
                )
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary.issuedCount").value(4))
                .andExpect(jsonPath("$.summary.activatedCount").value(1))
                .andExpect(jsonPath("$.summary.registeredCount").value(0))
                .andExpect(jsonPath("$.summary.revokedCount").value(0))
                .andExpect(jsonPath("$.summary.expiredCount").value(2))
                .andExpect(jsonPath("$.summary.totalCodeCount").value(4))
                .andExpect(jsonPath("$.summary.remainingCapacity").value(0))
                .andExpect(jsonPath("$.codes.totalItems").value(4))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode body = objectMapper.readTree(response);
        assertStatusCount(body, "ISSUED", 1);
        assertStatusCount(body, "ACTIVATED", 1);
        assertStatusCount(body, "EXPIRED", 2);
        assertThat(body.path("codes").path("items"))
                .anySatisfy(row -> {
                    assertThat(row.path("inviteCodeId").asText())
                            .isEqualTo(issuedCodes.get(0).inviteCodeId().toString());
                    assertThat(row.path("status").asText()).isEqualTo("EXPIRED");
                });

        String expiredFilter = mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        accessPool.getPilotLaunch().getId(),
                        accessPool.getId()
                )
                        .param("status", "EXPIRED")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codes.totalItems").value(2))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode expiredItems = objectMapper.readTree(expiredFilter).path("codes").path("items");
        assertThat(expiredItems).allSatisfy(row -> assertThat(row.path("status").asText()).isEqualTo("EXPIRED"));
        assertThat(expiredItems)
                .anySatisfy(row -> assertThat(row.path("inviteCodeId").asText())
                        .isEqualTo(issuedCodes.get(0).inviteCodeId().toString()))
                .anySatisfy(row -> assertThat(row.path("inviteCodeId").asText())
                        .isEqualTo(issuedCodes.get(1).inviteCodeId().toString()));

        String issuedFilter = mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        accessPool.getPilotLaunch().getId(),
                        accessPool.getId()
                )
                        .param("status", "ISSUED")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codes.totalItems").value(1))
                .andExpect(jsonPath("$.codes.items[0].inviteCodeId").value(issuedCodes.get(3).inviteCodeId().toString()))
                .andExpect(jsonPath("$.codes.items[0].status").value("ISSUED"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertPrivacySafeResponse(response, issuedCodes.get(0).code());
        assertPrivacySafeResponse(expiredFilter, issuedCodes.get(0).code());
        assertPrivacySafeResponse(issuedFilter, issuedCodes.get(3).code());
        assertThat(inviteStatus(issuedCodes.get(0).inviteCodeId())).isEqualTo("ISSUED");
        assertThat(inviteStatus(issuedCodes.get(1).inviteCodeId())).isEqualTo("EXPIRED");
    }

    @Test
    void filtersByStatusAndPaginatesDeterministicallyWithMixedRegistrationRows() throws Exception {
        SeededAccessPool seededAccessPool = seedMixedAccessPool();

        String firstPage = mockMvc.perform(adminCodeStatusRequest(
                        seededAccessPool.tenant().getId(),
                        seededAccessPool.accessPool().getPilotLaunch().getId(),
                        seededAccessPool.accessPool().getId()
                )
                        .param("status", "ACTIVATED")
                        .param("page", "0")
                        .param("size", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codes.page").value(0))
                .andExpect(jsonPath("$.codes.size").value(100))
                .andExpect(jsonPath("$.codes.totalItems").value(120))
                .andExpect(jsonPath("$.codes.totalPages").value(2))
                .andExpect(jsonPath("$.codes.items.length()").value(100))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode items = objectMapper.readTree(firstPage).path("codes").path("items");
        assertThat(items).allSatisfy(row -> assertThat(row.path("status").asText()).isEqualTo("ACTIVATED"));
        assertThat(items).anySatisfy(row -> assertThat(row.path("registered").asBoolean()).isTrue());
        assertThat(items).anySatisfy(row -> assertThat(row.path("registered").asBoolean()).isFalse());
        assertPrivacySafeResponse(firstPage, seededAccessPool.issuedCodes().get(0).code());

        mockMvc.perform(adminCodeStatusRequest(
                        seededAccessPool.tenant().getId(),
                        seededAccessPool.accessPool().getPilotLaunch().getId(),
                        seededAccessPool.accessPool().getId()
                )
                        .param("status", "activated")
                        .param("page", "1")
                        .param("size", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codes.page").value(1))
                .andExpect(jsonPath("$.codes.totalItems").value(120))
                .andExpect(jsonPath("$.codes.items.length()").value(20));
    }

    @Test
    void returnsSafeNotFoundAndValidationErrorsWithoutScopeOrInputEchoes() throws Exception {
        Tenant tenant = seedTenant();
        Tenant otherTenant = seedTenant();
        AccessPool otherAccessPool = seedAccessPool(otherTenant, 5);

        String mismatch = mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        otherAccessPool.getPilotLaunch().getId(),
                        otherAccessPool.getId()
                ))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("ACCESS_POOL_STATUS_VIEW_NOT_FOUND"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(mismatch)
                .doesNotContain(otherTenant.getId().toString())
                .doesNotContain(otherAccessPool.getId().toString());

        String invalidStatus = mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        otherAccessPool.getPilotLaunch().getId(),
                        otherAccessPool.getId()
                )
                        .param("status", "REGISTERED"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("status"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(invalidStatus).doesNotContain("REGISTERED");

        mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        otherAccessPool.getPilotLaunch().getId(),
                        otherAccessPool.getId()
                )
                        .param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("page"));

        mockMvc.perform(adminCodeStatusRequest(
                        tenant.getId(),
                        otherAccessPool.getPilotLaunch().getId(),
                        otherAccessPool.getId()
                )
                        .param("size", "101"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("size"));

        String invalidUuid = mockMvc.perform(adminCodeStatusRequest(
                        "not-a-uuid",
                        otherAccessPool.getPilotLaunch().getId(),
                        otherAccessPool.getId()
                ))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(invalidUuid).doesNotContain("not-a-uuid");
    }

    @Test
    void openApiExposesAdminCodeStatusEndpointSchemasAndSafeErrors() throws Exception {
        String spec = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(spec)
                .contains("/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status")
                .contains("AdminCodeStatusResponse")
                .contains("AdminCodeStatusSummary")
                .contains("AdminCodeStatusRow")
                .contains("ApiErrorResponse")
                .contains("adminBearerAuth")
                .contains("ADMIN_AUTHENTICATION_REQUIRED")
                .contains("ADMIN_PERMISSION_DENIED")
                .contains("ACCESS_POOL_STATUS_VIEW_NOT_FOUND")
                .contains("VALIDATION_FAILED")
                .doesNotContain("lookupHash")
                .doesNotContain("activationSubjectRef")
                .doesNotContain("co" + "hortId")
                .doesNotContain("/co" + "horts/");
    }

    private static MockHttpServletRequestBuilder adminCodeStatusRequest(
            Object tenantId,
            Object pilotLaunchId,
            Object accessPoolId
    ) {
        return get(CODE_STATUS_PATH, tenantId, pilotLaunchId, accessPoolId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + ADMIN_TOKEN);
    }

    private SeededAccessPool seedMixedAccessPool() {
        Tenant tenant = seedTenant();
        AccessPool accessPool = seedAccessPool(tenant, 500);
        int subjectBase = SUBJECT_SEQUENCE.getAndAdd(1_000);
        List<IssuedInviteCode> issuedCodes = inviteCodeAccessService.issueBatch(
                tenant.getId(),
                accessPool.getId(),
                500,
                ISSUED_AT,
                EXPIRES_AT
        );

        for (int index = 0; index < 120; index++) {
            activate(
                    issuedCodes.get(index).inviteCodeId(),
                    activationSubjectRef(subjectBase, index),
                    ACTIVATED_AT.plusSeconds(index)
            );
        }
        for (int index = 0; index < 60; index++) {
            register(
                    tenant,
                    accessPool,
                    issuedCodes.get(index).inviteCodeId(),
                    activationSubjectRef(subjectBase, index),
                    index
            );
        }
        for (int index = 120; index < 140; index++) {
            setTerminalStatus(issuedCodes.get(index).inviteCodeId(), "REVOKED");
        }
        for (int index = 140; index < 150; index++) {
            setTerminalStatus(issuedCodes.get(index).inviteCodeId(), "EXPIRED");
        }
        return new SeededAccessPool(tenant, accessPool, issuedCodes);
    }

    private Tenant seedTenant() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return tenantRepository.saveAndFlush(Tenant.create("synthetic-" + suffix, "Synthetic Pilot Tenant"));
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

    private void activate(UUID inviteCodeId, String subjectRef, Instant activatedAt) {
        jdbcTemplate.update("""
                update invite_codes
                set status = 'ACTIVATED',
                    activated_at = ?,
                    activation_subject_ref = ?,
                    updated_at = ?
                where id = ?
                """,
                Timestamp.from(activatedAt),
                subjectRef,
                Timestamp.from(activatedAt),
                inviteCodeId
        );
    }

    private void register(Tenant tenant, AccessPool accessPool, UUID inviteCodeId, String subjectRef, int index) {
        Instant registeredAt = REGISTERED_AT.plusSeconds(index);
        jdbcTemplate.update("""
                insert into employee_registrations (
                    id,
                    tenant_id,
                    pilot_launch_id,
                    access_pool_id,
                    invite_code_id,
                    activation_subject_ref,
                    full_name,
                    email,
                    phone,
                    registered_at,
                    created_at,
                    updated_at
                )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                UUID.randomUUID(),
                tenant.getId(),
                accessPool.getPilotLaunch().getId(),
                accessPool.getId(),
                inviteCodeId,
                subjectRef,
                "Synthetic Learner %03d".formatted(index),
                "synthetic.learner%03d@example.test".formatted(index),
                "+700001%05d".formatted(index),
                Timestamp.from(registeredAt),
                Timestamp.from(registeredAt),
                Timestamp.from(registeredAt)
        );
    }

    private void setTerminalStatus(UUID inviteCodeId, String status) {
        jdbcTemplate.update("""
                update invite_codes
                set status = ?,
                    activated_at = null,
                    activation_subject_ref = null,
                    updated_at = ?
                where id = ?
                """,
                status,
                Timestamp.from(ACTIVATED_AT),
                inviteCodeId
        );
    }

    private void expireIssuedCodeByTime(UUID inviteCodeId, Instant expiresAt) {
        jdbcTemplate.update("""
                update invite_codes
                set expires_at = ?,
                    updated_at = ?
                where id = ?
                """,
                Timestamp.from(expiresAt),
                Timestamp.from(expiresAt),
                inviteCodeId
        );
    }

    private String inviteStatus(UUID inviteCodeId) {
        return jdbcTemplate.queryForObject("""
                select status
                from invite_codes
                where id = ?
                """, String.class, inviteCodeId);
    }

    private long auditCount() {
        return jdbcTemplate.queryForObject("""
                select count(*)
                from admin_access_audit_log
                """, Long.class);
    }

    private List<Map<String, Object>> auditRowsByScope(UUID tenantId, UUID pilotLaunchId, UUID accessPoolId) {
        return jdbcTemplate.queryForList("""
                select *
                from admin_access_audit_log
                where tenant_id = ?
                  and pilot_launch_id = ?
                  and access_pool_id = ?
                order by created_at, id
                """, tenantId, pilotLaunchId, accessPoolId);
    }

    private void assertStatusCount(JsonNode body, String status, long count) {
        JsonNode statusCounts = body.path("statusCounts");
        assertThat(statusCounts)
                .anySatisfy(row -> {
                    assertThat(row.path("status").asText()).isEqualTo(status);
                    assertThat(row.path("count").asLong()).isEqualTo(count);
                });
    }

    private static void assertPrivacySafeResponse(String response, String rawInviteCode) {
        assertThat(response)
                .doesNotContain(rawInviteCode)
                .doesNotContain("lookupHash")
                .doesNotContain("activationSubjectRef")
                .doesNotContain("fullName")
                .doesNotContain("email")
                .doesNotContain("phone")
                .doesNotContain("Synthetic Learner")
                .doesNotContain("example.test")
                .doesNotContain("Лемана")
                .doesNotContain("Lemana");
    }

    private static void assertAuditRowSafe(Map<String, Object> row, String... forbiddenValues) {
        String rowText = row.values().toString();
        assertThat(rowText)
                .doesNotContain("Bearer ")
                .doesNotContain("activationSubjectRef")
                .doesNotContain("fullName")
                .doesNotContain("email")
                .doesNotContain("phone")
                .doesNotContain("request_body")
                .doesNotContain("response_body")
                .doesNotContain("query_string");
        for (String forbiddenValue : forbiddenValues) {
            assertThat(rowText).doesNotContain(forbiddenValue);
        }
    }

    private static String activationSubjectRef(int subjectBase, int index) {
        return "%064x".formatted(subjectBase + index);
    }

    private record SeededAccessPool(Tenant tenant, AccessPool accessPool, List<IssuedInviteCode> issuedCodes) {
    }
}
