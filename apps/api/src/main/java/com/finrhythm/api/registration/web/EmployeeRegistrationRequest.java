package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "EmployeeRegistrationRequest", description = "Submitted employee registration details and invite code.")
public record EmployeeRegistrationRequest(
        @Schema(description = "Employee full name. Normalized before persistence.", example = "Sample Learner")
        @NotBlank
        @Size(max = 160)
        String fullName,

        @Schema(description = "Employee email address. Normalized to lowercase before persistence.", example = "learner@example.test")
        @NotBlank
        @Email
        @Size(max = 254)
        String email,

        @Schema(description = "Employee phone number in international format.", example = "+70000000001")
        @NotBlank
        @Size(max = 32)
        String phone,

        @Schema(description = "Human-entered one-time invite code. The API never echoes or stores this raw value.", example = "XXXX-XXXX-XXXX-XXXX")
        @NotBlank
        @Size(max = 64)
        String inviteCode
) {
}
