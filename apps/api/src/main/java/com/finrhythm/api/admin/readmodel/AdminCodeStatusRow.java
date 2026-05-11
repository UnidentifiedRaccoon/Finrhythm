package com.finrhythm.api.admin.readmodel;

import com.finrhythm.api.tenant.domain.InviteCodeStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(name = "AdminCodeStatusRow", description = "Privacy-safe status row for one invite-code record.")
public record AdminCodeStatusRow(
        @Schema(description = "Invite-code row identifier. Raw invite codes and lookup hashes are never returned.", example = "44444444-4444-4444-8444-444444444444")
        UUID inviteCodeId,

        @Schema(description = "Invite-code lifecycle status.", example = "ACTIVATED")
        InviteCodeStatus status,

        @Schema(description = "Issue timestamp when the code was issued.", example = "2026-05-09T09:00:00Z", nullable = true)
        Instant issuedAt,

        @Schema(description = "Expiry timestamp when configured.", example = "2026-06-09T09:00:00Z", nullable = true)
        Instant expiresAt,

        @Schema(description = "Activation timestamp when the code has been activated.", example = "2026-05-09T10:00:00Z", nullable = true)
        Instant activatedAt,

        @Schema(description = "Registration timestamp when activation completed an employee registration.", example = "2026-05-09T10:01:00Z", nullable = true)
        Instant registeredAt,

        @Schema(description = "True when an employee registration exists for the invite-code row.", example = "true")
        boolean registered
) {
}
