package com.finrhythm.api.registration.web;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;

@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(
        name = "EmployeeContactUpdateRequest",
        description = "Optional employee contact fields for a profile-session scoped update. At least one field must be present."
)
public record EmployeeContactUpdateRequest(
        @Schema(description = "New employee email address. Omit to keep the current value.", example = "learner.new@example.test")
        String email,

        @Schema(description = "New employee phone number. Omit to keep the current value.", example = "+70000000002")
        String phone
) {
}
