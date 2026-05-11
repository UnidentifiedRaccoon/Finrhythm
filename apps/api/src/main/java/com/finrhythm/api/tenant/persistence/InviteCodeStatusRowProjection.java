package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.InviteCodeStatus;

import java.time.Instant;
import java.util.UUID;

public interface InviteCodeStatusRowProjection {
    UUID getInviteCodeId();

    InviteCodeStatus getStatus();

    Instant getIssuedAt();

    Instant getExpiresAt();

    Instant getActivatedAt();

    Instant getRegisteredAt();
}
