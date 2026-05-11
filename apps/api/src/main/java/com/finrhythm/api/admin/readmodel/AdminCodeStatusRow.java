package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(name = "AdminCodeStatusRow")
public record AdminCodeStatusRow(
        @Schema(example = "44444444-4444-4444-8444-444444444444")
        UUID inviteCodeId,

        @Schema(example = "ACTIVATED")
        InviteCodeStatus status,

        @Schema(example = "2026-05-09T09:00:00Z", nullable = true)
        Instant issuedAt,

        @Schema(example = "2026-06-09T09:00:00Z", nullable = true)
        Instant expiresAt,

        @Schema(example = "2026-05-09T10:00:00Z", nullable = true)
        Instant activatedAt,

        @Schema(example = "2026-05-09T10:01:00Z", nullable = true)
        Instant registeredAt,

        @Schema(example = "true")
        boolean registered
) {
}
