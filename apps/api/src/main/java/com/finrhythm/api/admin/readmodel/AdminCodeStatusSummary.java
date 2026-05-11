package com.finrhythm.api.admin.readmodel;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminCodeStatusSummary")
public record AdminCodeStatusSummary(
        @Schema(example = "500")
        long issuedCount,

        @Schema(example = "120")
        long activatedCount,

        @Schema(example = "60")
        long registeredCount,

        @Schema(example = "20")
        long revokedCount,

        @Schema(example = "10")
        long expiredCount,

        @Schema(example = "500")
        long totalCodeCount,

        @Schema(example = "0")
        long remainingCapacity
) {
}
