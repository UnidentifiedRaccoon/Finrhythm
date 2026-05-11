package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.CohortKind;
import com.finrhythm.api.tenant.domain.CohortStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@Schema(name = "AdminCodeStatusResponse")
public record AdminCodeStatusResponse(
        @Schema(example = "22222222-2222-4222-8222-222222222222")
        UUID tenantId,

        @Schema(example = "33333333-3333-4333-8333-333333333333")
        UUID cohortId,

        @Schema(example = "wave-1")
        String cohortKey,

        @Schema(example = "Wave 1")
        String cohortName,

        @Schema(example = "WAVE_1")
        CohortKind cohortKind,

        @Schema(example = "PLANNED")
        CohortStatus cohortStatus,

        @Schema(example = "500")
        int targetSize,

        AdminCodeStatusSummary summary,

        List<AdminCodeStatusCount> statusCounts,

        AdminCodeStatusPage codes
) {
}
