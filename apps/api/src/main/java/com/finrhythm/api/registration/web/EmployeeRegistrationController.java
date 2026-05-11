package com.finrhythm.api.registration.web;

import com.finrhythm.api.registration.service.EmployeeRegistrationCommand;
import com.finrhythm.api.registration.service.EmployeeRegistrationResult;
import com.finrhythm.api.registration.service.EmployeeRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employee-registrations")
public class EmployeeRegistrationController {
    private final EmployeeRegistrationService employeeRegistrationService;

    public EmployeeRegistrationController(EmployeeRegistrationService employeeRegistrationService) {
        this.employeeRegistrationService = employeeRegistrationService;
    }

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
                                              "cohortId": "33333333-3333-4333-8333-333333333333",
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
                result.cohortId(),
                result.inviteCodeId(),
                result.registeredAt(),
                result.idempotentRetry()
        ));
    }
}
