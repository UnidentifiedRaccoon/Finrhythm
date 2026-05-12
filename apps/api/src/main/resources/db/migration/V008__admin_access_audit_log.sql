create table admin_access_audit_log (
    id uuid primary key,
    occurred_at timestamptz not null,
    http_method varchar(16) not null,
    route varchar(256) not null,
    action varchar(128) not null,
    permission varchar(128),
    tenant_id uuid,
    pilot_launch_id uuid,
    access_pool_id uuid,
    status_code integer not null,
    outcome varchar(64) not null,
    principal_type varchar(64) not null,
    principal_ref varchar(128),
    created_at timestamptz not null,
    constraint admin_access_audit_log_http_method_check check (
        http_method ~ '^[A-Z]{1,16}$'
    ),
    constraint admin_access_audit_log_route_safe_check check (
        route like '/api/v1/admin%'
        and route not like '%?%'
        and btrim(route) = route
    ),
    constraint admin_access_audit_log_action_format_check check (
        action ~ '^[a-z0-9][a-z0-9._-]{0,127}$'
    ),
    constraint admin_access_audit_log_permission_format_check check (
        permission is null
        or permission ~ '^[a-z0-9][a-z0-9.-]{0,127}$'
    ),
    constraint admin_access_audit_log_status_code_check check (status_code between 100 and 599),
    constraint admin_access_audit_log_outcome_check check (
        outcome in (
            'SUCCESS',
            'AUTHENTICATION_REQUIRED',
            'PERMISSION_DENIED',
            'NOT_FOUND',
            'VALIDATION_FAILED',
            'ERROR'
        )
    ),
    constraint admin_access_audit_log_principal_type_check check (
        principal_type in ('ADMIN_API_TOKEN', 'ANONYMOUS')
    ),
    constraint admin_access_audit_log_principal_ref_safe_check check (
        principal_ref is null
        or principal_ref ~ '^[a-z0-9][a-z0-9._:-]{0,127}$'
    )
);

create index ix_admin_access_audit_log_occurred_at
    on admin_access_audit_log (occurred_at);

create index ix_admin_access_audit_log_scope_action
    on admin_access_audit_log (tenant_id, pilot_launch_id, access_pool_id, action, occurred_at);

create index ix_admin_access_audit_log_outcome
    on admin_access_audit_log (outcome, status_code, occurred_at);

comment on table admin_access_audit_log is
    'Append-only audit log for current MVP admin API access attempts; stores safe request metadata only.';
comment on column admin_access_audit_log.occurred_at is
    'UTC timestamp when the admin access attempt was recorded.';
comment on column admin_access_audit_log.http_method is
    'HTTP method only, without request body or query string.';
comment on column admin_access_audit_log.route is
    'Known route template or coarse normalized admin path without query string or raw path identifiers.';
comment on column admin_access_audit_log.action is
    'Stable technical admin action key for the attempted operation.';
comment on column admin_access_audit_log.permission is
    'Required technical permission when the route maps to one; null for default-denied admin paths.';
comment on column admin_access_audit_log.tenant_id is
    'Tenant UUID parsed from a known admin route when safely available.';
comment on column admin_access_audit_log.pilot_launch_id is
    'Pilot launch UUID parsed from a known admin route when safely available.';
comment on column admin_access_audit_log.access_pool_id is
    'Access pool UUID parsed from a known admin route when safely available.';
comment on column admin_access_audit_log.status_code is
    'HTTP status code returned for the access attempt.';
comment on column admin_access_audit_log.outcome is
    'Coarse safe outcome derived from the response status.';
comment on column admin_access_audit_log.principal_type is
    'Safe principal type, for example ADMIN_API_TOKEN or ANONYMOUS.';
comment on column admin_access_audit_log.principal_ref is
    'Non-secret principal reference; never a bearer token or submitted credential.';
