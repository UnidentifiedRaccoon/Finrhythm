package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.AccessPoolStatus;
import com.finrhythm.api.tenant.domain.PilotLaunchStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@Schema(name = "AdminCodeStatusResponse")
public record AdminCodeStatusResponse(
        @Schema(example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(example = "33333333-3333-4333-8333-333333333333")
        UUID pilotLaunchId,

        @Schema(example = "pilot-launch-main")
        String pilotLaunchKey,

        @Schema(example = "Main pilot launch")
        String pilotLaunchName,

        @Schema(example = "PLANNED")
        PilotLaunchStatus pilotLaunchStatus,

        @Schema(example = "55555555-5555-4555-8555-555555555555")
        UUID accessPoolId,

        @Schema(example = "access-pool-main")
        String accessPoolKey,

        @Schema(example = "Main access pool")
        String accessPoolName,

        @Schema(example = "PLANNED")
        AccessPoolStatus accessPoolStatus,

        @Schema(example = "500")
        int poolCapacity,

        AdminCodeStatusSummary summary,

        List<AdminCodeStatusCount> statusCounts,

        AdminCodeStatusPage codes
) {
}
