package com.finrhythm.api.admin.readmodel;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminCodeStatusSummary", description = "Aggregated invite-code and registration funnel counters.")
public record AdminCodeStatusSummary(
        @Schema(description = "Number of invite codes that have been issued.", example = "500")
        long issuedCount,

        @Schema(description = "Number of invite codes activated by an employee subject.", example = "120")
        long activatedCount,

        @Schema(description = "Number of completed employee registrations.", example = "60")
        long registeredCount,

        @Schema(description = "Number of revoked invite codes.", example = "20")
        long revokedCount,

        @Schema(description = "Number of expired invite codes.", example = "10")
        long expiredCount,

        @Schema(description = "Total invite-code rows in the access pool.", example = "500")
        long totalCodeCount,

        @Schema(description = "Remaining capacity before the access-pool limit is reached.", example = "0")
        long remainingCapacity
) {
}
