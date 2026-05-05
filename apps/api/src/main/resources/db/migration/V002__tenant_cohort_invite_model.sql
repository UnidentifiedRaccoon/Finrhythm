create table tenants (
    id uuid primary key,
    slug varchar(64) not null,
    display_name varchar(160) not null,
    status varchar(32) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint tenants_slug_format check (
        slug = lower(slug)
        and slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
    ),
    constraint tenants_display_name_non_empty check (btrim(display_name) <> ''),
    constraint tenants_status_check check (status in ('ACTIVE', 'PAUSED', 'ARCHIVED'))
);

create unique index ux_tenants_slug on tenants (slug);

create table cohorts (
    id uuid primary key,
    tenant_id uuid not null,
    cohort_key varchar(64) not null,
    name varchar(160) not null,
    kind varchar(32) not null,
    status varchar(32) not null,
    target_size integer not null,
    starts_at timestamptz,
    ends_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_cohorts_tenant foreign key (tenant_id) references tenants (id),
    constraint uq_cohorts_id_tenant unique (id, tenant_id),
    constraint cohorts_key_format check (
        cohort_key = lower(cohort_key)
        and cohort_key ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
    ),
    constraint cohorts_name_non_empty check (btrim(name) <> ''),
    constraint cohorts_kind_check check (kind in ('WAVE_0', 'WAVE_1', 'CUSTOM')),
    constraint cohorts_status_check check (status in ('PLANNED', 'ACTIVE', 'CLOSED', 'ARCHIVED')),
    constraint cohorts_target_size_check check (target_size between 1 and 5000),
    constraint cohorts_dates_check check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create unique index ux_cohorts_tenant_key on cohorts (tenant_id, cohort_key);
create index ix_cohorts_tenant_status on cohorts (tenant_id, status);

create table invite_codes (
    id uuid primary key,
    tenant_id uuid not null,
    cohort_id uuid not null,
    lookup_hash varchar(64) not null,
    status varchar(32) not null,
    issued_at timestamptz,
    expires_at timestamptz,
    activated_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_invite_codes_tenant foreign key (tenant_id) references tenants (id),
    constraint fk_invite_codes_cohort_tenant foreign key (cohort_id, tenant_id) references cohorts (id, tenant_id),
    constraint invite_codes_lookup_hash_format check (lookup_hash ~ '^[a-f0-9]{64}$'),
    constraint invite_codes_status_check check (
        status in ('CREATED', 'ISSUED', 'RESERVED', 'ACTIVATED', 'REVOKED', 'EXPIRED')
    ),
    constraint invite_codes_lifecycle_check check (
        (
            status = 'CREATED'
            and issued_at is null
            and activated_at is null
        )
        or (
            status in ('ISSUED', 'RESERVED', 'REVOKED', 'EXPIRED')
            and issued_at is not null
            and activated_at is null
        )
        or (
            status = 'ACTIVATED'
            and issued_at is not null
            and activated_at is not null
        )
    ),
    constraint invite_codes_expires_after_issue_check check (
        expires_at is null or issued_at is null or expires_at > issued_at
    ),
    constraint invite_codes_activated_after_issue_check check (
        activated_at is null or activated_at >= issued_at
    )
);

create unique index ux_invite_codes_lookup_hash on invite_codes (lookup_hash);
create index ix_invite_codes_tenant_cohort_status on invite_codes (tenant_id, cohort_id, status);
