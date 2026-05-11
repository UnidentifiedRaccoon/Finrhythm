package com.finrhythm.api.tenant.persistence;

import com.finrhythm.api.tenant.domain.InviteCodeStatus;

public interface InviteCodeStatusCountProjection {
    InviteCodeStatus getStatus();

    long getCount();
}
