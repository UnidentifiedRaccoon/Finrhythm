create table employee_profile_sessions (
    id uuid primary key,
    employee_registration_id uuid not null,
    token_hash varchar(64) not null,
    expires_at timestamptz not null,
    revoked_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_employee_profile_sessions_registration
        foreign key (employee_registration_id)
        references employee_registrations (id),
    constraint employee_profile_sessions_token_hash_format check (
        token_hash ~ '^[a-f0-9]{64}$'
    ),
    constraint employee_profile_sessions_expiry_check check (expires_at > created_at),
    constraint employee_profile_sessions_revoked_check check (
        revoked_at is null
        or revoked_at >= created_at
    )
);

create unique index ux_employee_profile_sessions_token_hash
    on employee_profile_sessions (token_hash);

create index ix_employee_profile_sessions_registration_active
    on employee_profile_sessions (employee_registration_id, expires_at)
    where revoked_at is null;

create index ix_employee_profile_sessions_expiry
    on employee_profile_sessions (expires_at);

comment on table employee_profile_sessions is
    'Short-lived MVP employee registration profile sessions; stores only token hashes, never raw tokens.';
comment on column employee_profile_sessions.employee_registration_id is
    'Employee registration proven by invite code plus normalized contact before session creation.';
comment on column employee_profile_sessions.token_hash is
    'SHA-256 hash of the opaque profile-session bearer token; raw token is returned once and never persisted.';
comment on column employee_profile_sessions.expires_at is
    'UTC timestamp after which the profile session is no longer usable.';
comment on column employee_profile_sessions.revoked_at is
    'UTC timestamp when this profile session was revoked, for example by creating a newer session.';
