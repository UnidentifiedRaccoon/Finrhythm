package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminCodeStatusCount")
public record AdminCodeStatusCount(
        @Schema(example = "ISSUED")
        InviteCodeStatus status,

        @Schema(example = "350")
        long count
) {
}
