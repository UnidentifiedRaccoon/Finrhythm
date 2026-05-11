package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminCodeStatusCount", description = "Count for one invite-code lifecycle status.")
public record AdminCodeStatusCount(
        @Schema(description = "Invite-code lifecycle status.", example = "ISSUED")
        InviteCodeStatus status,

        @Schema(description = "Number of codes with this status.", example = "350")
        long count
) {
}
