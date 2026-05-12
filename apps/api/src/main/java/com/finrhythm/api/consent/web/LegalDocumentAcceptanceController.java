package com.finrhythm.api.consent.web;

import com.finrhythm.api.common.web.ApiErrorResponse;
import com.finrhythm.api.consent.service.LegalAcceptanceResult;
import com.finrhythm.api.consent.service.LegalAcceptanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Tag(
        name = "Legal document acceptances",
        description = "Records draft legal document version acceptance for an existing employee registration."
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances")
public class LegalDocumentAcceptanceController {
    private final LegalAcceptanceService legalAcceptanceService;

    @Operation(
            summary = "Record current draft legal document version acceptance",
            description = """
                    Appends acceptance rows for the current draft privacy policy, personal data consent,
                    terms of use and financial disclaimer versions. Same-version retries are idempotent.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Current draft document version set recorded for the first time.",
                    content = @Content(
                            schema = @Schema(implementation = LegalDocumentAcceptanceResponse.class),
                            examples = @ExampleObject(
                                    name = "created",
                                    value = """
                                            {
                                              "employeeRegistrationId": "11111111-1111-4111-8111-111111111111",
                                              "tenantId": "22222222-2222-4222-8222-222222222222",
                                              "pilotLaunchId": "33333333-3333-4333-8333-333333333333",
                                              "accessPoolId": "55555555-5555-4555-8555-555555555555",
                                              "acceptedDocuments": [
                                                {
                                                  "documentType": "PRIVACY_POLICY",
                                                  "documentVersion": "draft-2026-05-12",
                                                  "acceptedAt": "2026-05-12T06:00:00Z",
                                                  "source": "onboarding_privacy"
                                                }
                                              ],
                                              "createdCount": 4,
                                              "idempotentRetry": false
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Idempotent retry for the same employee registration and same current draft versions.",
                    content = @Content(schema = @Schema(implementation = LegalDocumentAcceptanceResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Unsupported document type/version or incomplete current draft set.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "unsupportedVersion",
                                            value = """
                                                    {
                                                      "code": "UNSUPPORTED_DOCUMENT_VERSION",
                                                      "message": "Document version is not supported.",
                                                      "fieldErrors": [
                                                        {
                                                          "field": "documents[0].documentVersion",
                                                          "code": "UNSUPPORTED_DOCUMENT_VERSION",
                                                          "message": "Document version is not supported for current draft acceptance."
                                                        }
                                                      ]
                                                    }
                                                    """
                                    ),
                                    @ExampleObject(
                                            name = "missingRequiredDocument",
                                            value = """
                                                    {
                                                      "code": "MISSING_REQUIRED_DOCUMENT",
                                                      "message": "Current draft legal document set is incomplete.",
                                                      "fieldErrors": [
                                                        {
                                                          "field": "documents",
                                                          "code": "MISSING_REQUIRED_DOCUMENT",
                                                          "message": "Required document is missing: FINANCIAL_DISCLAIMER."
                                                        }
                                                      ]
                                                    }
                                                    """
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Employee registration is unknown.",
                    content = @Content(
                            schema = @Schema(implementation = ApiErrorResponse.class),
                            examples = @ExampleObject(
                                    name = "unknownRegistration",
                                    value = """
                                            {
                                              "code": "EMPLOYEE_REGISTRATION_NOT_FOUND",
                                              "message": "Employee registration was not found.",
                                              "fieldErrors": []
                                            }
                                            """
                            )
                    )
            )
    })
    @PostMapping
    public ResponseEntity<LegalDocumentAcceptanceResponse> accept(
            @PathVariable UUID employeeRegistrationId,
            @RequestBody LegalDocumentAcceptanceRequest request
    ) {
        LegalAcceptanceResult result = legalAcceptanceService.accept(employeeRegistrationId, request.toCommand());
        HttpStatus status = result.idempotentRetry() ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(toResponse(result));
    }

    private static LegalDocumentAcceptanceResponse toResponse(LegalAcceptanceResult result) {
        return new LegalDocumentAcceptanceResponse(
                result.employeeRegistrationId(),
                result.tenantId(),
                result.pilotLaunchId(),
                result.accessPoolId(),
                result.acceptedDocuments().stream()
                        .map(document -> new AcceptedLegalDocumentResponse(
                                document.documentType(),
                                document.documentVersion(),
                                document.acceptedAt(),
                                document.source()
                        ))
                        .toList(),
                result.createdCount(),
                result.idempotentRetry()
        );
    }
}
