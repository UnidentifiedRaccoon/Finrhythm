package com.finrhythm.api.admin.web;

import com.finrhythm.api.admin.readmodel.AdminCodeStatusQuery;
import com.finrhythm.api.admin.readmodel.AdminCodeStatusResponse;
import com.finrhythm.api.admin.service.AdminCodeStatusService;
import com.finrhythm.api.common.web.ApiErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Tag(
        name = "Admin code status",
        description = "Privacy-safe operational views for tenant pilot access-pool invite-code status."
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status")
public class AdminCodeStatusController {
    private final AdminCodeStatusService adminCodeStatusService;

    @Operation(
            summary = "Read access-pool invite-code status for admin operations",
            description = """
                    Returns privacy-safe pilot launch and access-pool metadata, invite-code status counts,
                    activation/registration funnel counts
                    and paginated per-code operational rows. The response never includes sensitive invite identifiers
                    or employee contact fields.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Access-pool code-status view.",
                    content = @Content(
                            schema = @Schema(implementation = AdminCodeStatusResponse.class),
                            examples = @ExampleObject(
                                    name = "pilotAccessPoolCodeStatus",
                                    value = """
                                            {
                                              "tenantId": "22222222-2222-4222-8222-222222222222",
                                              "pilotLaunchId": "33333333-3333-4333-8333-333333333333",
                                              "pilotLaunchKey": "pilot-launch-main",
                                              "pilotLaunchName": "Main pilot launch",
                                              "pilotLaunchStatus": "PLANNED",
                                              "accessPoolId": "55555555-5555-4555-8555-555555555555",
                                              "accessPoolKey": "access-pool-main",
                                              "accessPoolName": "Main access pool",
                                              "accessPoolStatus": "PLANNED",
                                              "poolCapacity": 500,
                                              "summary": {
                                                "issuedCount": 500,
                                                "activatedCount": 120,
                                                "registeredCount": 60,
                                                "revokedCount": 20,
                                                "expiredCount": 10,
                                                "totalCodeCount": 500,
                                                "remainingCapacity": 0
                                              },
                                              "statusCounts": [
                                                { "status": "CREATED", "count": 0 },
                                                { "status": "ISSUED", "count": 350 },
                                                { "status": "RESERVED", "count": 0 },
                                                { "status": "ACTIVATED", "count": 120 },
                                                { "status": "REVOKED", "count": 20 },
                                                { "status": "EXPIRED", "count": 10 }
                                              ],
                                              "codes": {
                                                "page": 0,
                                                "size": 50,
                                                "totalItems": 500,
                                                "totalPages": 10,
                                                "items": [
                                                  {
                                                    "inviteCodeId": "44444444-4444-4444-8444-444444444444",
                                                    "status": "ACTIVATED",
                                                    "issuedAt": "2026-05-09T09:00:00Z",
                                                    "expiresAt": "2026-06-09T09:00:00Z",
                                                    "activatedAt": "2026-05-09T10:00:00Z",
                                                    "registeredAt": "2026-05-09T10:01:00Z",
                                                    "registered": true
                                                  }
                                                ]
                                              }
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid UUID, status filter, page or size. Raw invite codes and PII are not echoed.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = @ExampleObject(
                                    name = "invalidStatus",
                                    value = """
                                            {
                                              "code": "VALIDATION_FAILED",
                                              "message": "Request parameters are invalid.",
                                              "fieldErrors": [
                                                {
                                                  "field": "status",
                                                  "code": "ENUM",
                                                  "message": "Status must be a known invite-code status."
                                                }
                                              ]
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tenant/access-pool status view not found or not in the requested tenant and pilot-launch scope.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = @ExampleObject(
                                    name = "notFound",
                                    value = """
                                            {
                                              "code": "ACCESS_POOL_STATUS_VIEW_NOT_FOUND",
                                              "message": "Access-pool status view was not found.",
                                              "fieldErrors": []
                                            }
                                            """
                            )
                    )
            )
    })
    @GetMapping
    public ResponseEntity<AdminCodeStatusResponse> getCodeStatus(
            @Parameter(description = "Tenant identifier.", example = "22222222-2222-4222-8222-222222222222")
            @PathVariable UUID tenantId,

            @Parameter(description = "Pilot launch identifier.", example = "33333333-3333-4333-8333-333333333333")
            @PathVariable UUID pilotLaunchId,

            @Parameter(description = "Access pool identifier.", example = "55555555-5555-4555-8555-555555555555")
            @PathVariable UUID accessPoolId,

            @Parameter(
                    description = "Optional invite-code status filter.",
                    schema = @Schema(
                            allowableValues = {"CREATED", "ISSUED", "RESERVED", "ACTIVATED", "REVOKED", "EXPIRED"}
                    )
            )
            @RequestParam(required = false) String status,

            @Parameter(
                    description = "Zero-based page index.",
                    schema = @Schema(defaultValue = "0", minimum = "0", example = "0")
            )
            @RequestParam(defaultValue = "0") Integer page,

            @Parameter(
                    description = "Page size, bounded for pilot access-pool operational pagination.",
                    schema = @Schema(defaultValue = "50", minimum = "1", maximum = "100", example = "50")
            )
            @RequestParam(defaultValue = "50") Integer size
    ) {
        return ResponseEntity.ok(adminCodeStatusService.getCodeStatus(
                tenantId,
                pilotLaunchId,
                accessPoolId,
                new AdminCodeStatusQuery(status, page, size)
        ));
    }
}
