package com.finrhythm.api.registration.web;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "EmployeeRegistrationRequest")
public record EmployeeRegistrationRequest(
        @Schema(example = "Alex Pilot")
        @NotBlank
        @Size(max = 160)
        String fullName,

        @Schema(example = "alex.pilot@example.test")
        @NotBlank
        @Email
        @Size(max = 254)
        String email,

        @Schema(example = "+70000000001")
        @NotBlank
        @Size(max = 32)
        String phone,

        @Schema(example = "7K2N-8P4Q-5R6S-9T2U")
        @NotBlank
        @Size(max = 64)
        String inviteCode
) {
}
