package com.finrhythm.api.registration.web;

import com.finrhythm.api.common.config.OpenApiConfig;
import com.finrhythm.api.common.web.ApiErrorResponse;
import com.finrhythm.api.registration.service.EmployeeContactUpdateCommand;
import com.finrhythm.api.registration.service.EmployeeContactUpdateResult;
import com.finrhythm.api.registration.service.EmployeeProfileSessionCommand;
import com.finrhythm.api.registration.service.EmployeeProfileSessionResult;
import com.finrhythm.api.registration.service.EmployeeProfileSummaryCommand;
import com.finrhythm.api.registration.service.EmployeeProfileSummaryResult;
import com.finrhythm.api.registration.service.EmployeeRegistrationCommand;
import com.finrhythm.api.registration.service.EmployeeRegistrationResult;
import com.finrhythm.api.registration.service.EmployeeRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Employee registrations",
        description = "Invite-code based employee registration without raw invite-code or PII echoes in errors."
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employee-registrations")
public class EmployeeRegistrationController {
    private final EmployeeRegistrationService employeeRegistrationService;

    @Operation(
            summary = "Register an employee with an invite code",
            description = "Creates an employee registration and activates the invite code once."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "First registration created.",
                    content = @Content(
                            schema = @Schema(implementation = EmployeeRegistrationResponse.class),
                            examples = @ExampleObject(
                                    name = "created",
                                    value = """
                                            {
                                              "employeeRegistrationId": "11111111-1111-4111-8111-111111111111",
                                              "tenantId": "22222222-2222-4222-8222-222222222222",
                                              "pilotLaunchId": "33333333-3333-4333-8333-333333333333",
                                              "accessPoolId": "55555555-5555-4555-8555-555555555555",
                                              "inviteCodeId": "44444444-4444-4444-8444-444444444444",
                                              "registeredAt": "2026-05-09T09:00:00Z",
                                              "idempotentRetry": false
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Idempotent retry for the same invite/contact.",
                    content = @Content(schema = @Schema(implementation = EmployeeRegistrationResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation or invite-code failure. Raw PII and raw invite code are not echoed.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidCode",
                                            value = """
                                                    {
                                                      "code": "INVALID_INVITE_CODE",
                                                      "message": "Invite code is invalid.",
                                                      "fieldErrors": []
                                                    }
                                                    """
                                    ),
                                    @ExampleObject(
                                            name = "duplicateCode",
                                            value = """
                                                    {
                                                      "code": "DUPLICATE_INVITE_CODE",
                                                      "message": "Invite code is already registered.",
                                                      "fieldErrors": []
                                                    }
                                                    """
                                    ),
                                    @ExampleObject(
                                            name = "validation",
                                            value = """
                                                    {
                                                      "code": "VALIDATION_FAILED",
                                                      "message": "Submitted fields are invalid.",
                                                      "fieldErrors": [
                                                        {
                                                          "field": "email",
                                                          "code": "Email",
                                                          "message": "Field is required or invalid."
                                                        }
                                                      ]
                                                    }
                                                    """
                                    )
                            }
                    )
            )
    })
    @PostMapping
    public ResponseEntity<EmployeeRegistrationResponse> register(
            @Valid @RequestBody EmployeeRegistrationRequest request
    ) {
        EmployeeRegistrationResult result = employeeRegistrationService.register(new EmployeeRegistrationCommand(
                request.fullName(),
                request.email(),
                request.phone(),
                request.inviteCode()
        ));
        HttpStatus status = result.idempotentRetry() ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(new EmployeeRegistrationResponse(
                result.employeeRegistrationId(),
                result.tenantId(),
                result.pilotLaunchId(),
                result.accessPoolId(),
                result.inviteCodeId(),
                result.registeredAt(),
                result.idempotentRetry()
        ));
    }

    @Operation(
            summary = "Read a support-safe employee profile summary",
            description = "Looks up an existing registration only when the submitted invite code and normalized contact match."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile summary found for the matching invite/contact.",
                    content = @Content(
                            schema = @Schema(implementation = EmployeeProfileSummaryResponse.class),
                            examples = @ExampleObject(
                                    name = "found",
                                    value = """
                                            {
                                              "employeeRegistrationId": "11111111-1111-4111-8111-111111111111",
                                              "fullName": "Sample Learner",
                                              "email": "learner@example.test",
                                              "phone": "+70000000001",
                                              "tenantId": "22222222-2222-4222-8222-222222222222",
                                              "pilotLaunchId": "33333333-3333-4333-8333-333333333333",
                                              "accessPoolId": "55555555-5555-4555-8555-555555555555",
                                              "registeredAt": "2026-05-09T09:00:00Z",
                                              "contactVerifiedByRegistrationMatch": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Submitted contact or invite-code fields are invalid. Submitted PII and raw invite code are not echoed.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No registration matched the submitted invite/contact proof.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = @ExampleObject(
                                    name = "notFound",
                                    value = """
                                            {
                                              "code": "PROFILE_LOOKUP_NOT_FOUND",
                                              "message": "Registration profile was not found.",
                                              "fieldErrors": []
                                            }
                                            """
                            )
                    )
            )
    })
    @PostMapping("/profile-summary")
    public EmployeeProfileSummaryResponse profileSummary(
            @Valid @RequestBody EmployeeProfileSummaryRequest request
    ) {
        EmployeeProfileSummaryResult result = employeeRegistrationService.profileSummary(new EmployeeProfileSummaryCommand(
                request.fullName(),
                request.email(),
                request.phone(),
                request.inviteCode()
        ));
        return new EmployeeProfileSummaryResponse(
                result.employeeRegistrationId(),
                result.fullName(),
                result.email(),
                result.phone(),
                result.tenantId(),
                result.pilotLaunchId(),
                result.accessPoolId(),
                result.registeredAt(),
                result.contactVerifiedByRegistrationMatch()
        );
    }

    @Operation(
            summary = "Create a short-lived employee profile session",
            description = "Creates a read-only profile session only when the submitted invite code and normalized contact match."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Profile session created. The opaque token is returned only once.",
                    content = @Content(
                            schema = @Schema(implementation = EmployeeProfileSessionResponse.class),
                            examples = @ExampleObject(
                                    name = "created",
                                    value = """
                                            {
                                              "profileSessionToken": "UdfH5yTtfAq5mthWScNgWc2Q64PsAVtmFZEnpK9ClPg",
                                              "expiresAt": "2026-05-12T10:15:00Z",
                                              "employeeRegistrationId": "11111111-1111-4111-8111-111111111111",
                                              "tenantId": "22222222-2222-4222-8222-222222222222",
                                              "pilotLaunchId": "33333333-3333-4333-8333-333333333333",
                                              "accessPoolId": "55555555-5555-4555-8555-555555555555",
                                              "contactVerifiedByRegistrationMatch": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Submitted contact or invite-code fields are invalid. Submitted PII and raw invite code are not echoed.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No registration matched the submitted invite/contact proof.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PostMapping("/profile-sessions")
    public ResponseEntity<EmployeeProfileSessionResponse> createProfileSession(
            @Valid @RequestBody EmployeeProfileSessionRequest request
    ) {
        EmployeeProfileSessionResult result = employeeRegistrationService.createProfileSession(
                new EmployeeProfileSessionCommand(
                        request.fullName(),
                        request.email(),
                        request.phone(),
                        request.inviteCode()
                )
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(new EmployeeProfileSessionResponse(
                result.profileSessionToken(),
                result.expiresAt(),
                result.employeeRegistrationId(),
                result.tenantId(),
                result.pilotLaunchId(),
                result.accessPoolId(),
                result.contactVerifiedByRegistrationMatch()
        ));
    }

    @Operation(
            summary = "Read the current employee profile summary",
            description = "Reads a support-safe profile summary using a valid short-lived employee profile-session bearer token.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH)
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile summary for the valid profile session.",
                    content = @Content(schema = @Schema(implementation = EmployeeProfileSummaryResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown. Raw token is not echoed.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = @ExampleObject(
                                    name = "required",
                                    value = """
                                            {
                                              "code": "PROFILE_SESSION_AUTHENTICATION_REQUIRED",
                                              "message": "Employee profile session authentication is required.",
                                              "fieldErrors": []
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Registration referenced by the session was not found.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @GetMapping("/me/profile-summary")
    public EmployeeProfileSummaryResponse profileSummaryForSession(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        EmployeeProfileSummaryResult result = employeeRegistrationService.profileSummaryForSession(authorizationHeader);
        return new EmployeeProfileSummaryResponse(
                result.employeeRegistrationId(),
                result.fullName(),
                result.email(),
                result.phone(),
                result.tenantId(),
                result.pilotLaunchId(),
                result.accessPoolId(),
                result.registeredAt(),
                result.contactVerifiedByRegistrationMatch()
        );
    }

    @Operation(
            summary = "Update the current employee contact fields",
            description = "Updates only email and/or phone for the registration resolved from a valid profile-session bearer token.",
            security = @SecurityRequirement(name = OpenApiConfig.PROFILE_SESSION_BEARER_AUTH)
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Accepted contact update or normalized no-op. One audit row is appended.",
                    content = @Content(
                            schema = @Schema(implementation = EmployeeContactUpdateResponse.class),
                            examples = @ExampleObject(
                                    name = "updated",
                                    value = """
                                            {
                                              "employeeRegistrationId": "11111111-1111-4111-8111-111111111111",
                                              "fullName": "Sample Learner",
                                              "email": "learner.new@example.test",
                                              "phone": "+70000000002",
                                              "tenantId": "22222222-2222-4222-8222-222222222222",
                                              "pilotLaunchId": "33333333-3333-4333-8333-333333333333",
                                              "accessPoolId": "55555555-5555-4555-8555-555555555555",
                                              "registeredAt": "2026-05-09T09:00:00Z",
                                              "changed": true,
                                              "outcome": "updated",
                                              "changedFields": ["email", "phone"],
                                              "contactVerifiedByProfileSession": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Empty payload or invalid contact field. Submitted raw values are not echoed.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = @ExampleObject(
                                    name = "validation",
                                    value = """
                                            {
                                              "code": "VALIDATION_FAILED",
                                              "message": "At least one contact field must be submitted.",
                                              "fieldErrors": []
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Profile session token is missing, malformed, expired, revoked or unknown. Raw token is not echoed.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Registration referenced by the session was not found.",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    @PatchMapping("/me/contact")
    public EmployeeContactUpdateResponse updateContactForSession(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @RequestBody EmployeeContactUpdateRequest request
    ) {
        EmployeeContactUpdateResult result = employeeRegistrationService.updateContactForSession(
                authorizationHeader,
                new EmployeeContactUpdateCommand(
                        request == null ? null : request.email(),
                        request == null ? null : request.phone()
                )
        );
        return new EmployeeContactUpdateResponse(
                result.employeeRegistrationId(),
                result.fullName(),
                result.email(),
                result.phone(),
                result.tenantId(),
                result.pilotLaunchId(),
                result.accessPoolId(),
                result.registeredAt(),
                result.changed(),
                result.outcome(),
                result.changedFields(),
                result.contactVerifiedByProfileSession()
        );
    }
}
