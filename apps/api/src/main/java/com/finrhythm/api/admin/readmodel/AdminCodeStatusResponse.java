package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.AccessPoolStatus;
import com.finrhythm.api.tenant.domain.PilotLaunchStatus;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@Schema(name = "AdminCodeStatusResponse", description = "Privacy-safe admin status view for an access pool.")
public record AdminCodeStatusResponse(
        @Schema(description = "Tenant scope for the status view.", example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(description = "Pilot launch scope for the status view.", example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(description = "Stable pilot launch key.", example = "pilot-launch-main")
        String pilotLaunchKey,

        @Schema(description = "Pilot launch display name.", example = "Main pilot launch")
        String pilotLaunchName,

        @Schema(description = "Pilot launch lifecycle status.", example = "PLANNED")
        PilotLaunchStatus pilotLaunchStatus,

        @Schema(description = "Access pool scope for the status view.", example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @Schema(description = "Stable access pool key.", example = "access-pool-main")
        String accessPoolKey,

        @Schema(description = "Access pool display name.", example = "Main access pool")
        String accessPoolName,

        @Schema(description = "Access pool lifecycle status.", example = "PLANNED")
        AccessPoolStatus accessPoolStatus,

        @Schema(description = "Maximum number of invite codes in the access pool.", example = "500")
        int poolCapacity,

        @Schema(description = "Aggregated funnel and capacity counters.")
        AdminCodeStatusSummary summary,

        @ArraySchema(
                schema = @Schema(implementation = AdminCodeStatusCount.class),
                arraySchema = @Schema(description = "Counts for every invite-code lifecycle status.")
        )
        List<AdminCodeStatusCount> statusCounts,

        @Schema(description = "Paginated privacy-safe invite-code rows.")
        AdminCodeStatusPage codes
) {
}
