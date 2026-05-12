alter table employee_registrations
    add constraint uq_employee_registrations_id_scope
        unique (id, tenant_id, pilot_launch_id, access_pool_id);

create table legal_document_acceptance_log (
    id uuid primary key,
    employee_registration_id uuid not null,
    tenant_id uuid not null,
    pilot_launch_id uuid not null,
    access_pool_id uuid not null,
    document_type varchar(64) not null,
    document_version varchar(64) not null,
    accepted_at timestamptz not null,
    source varchar(64) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_legal_document_acceptance_log_employee_registration_scope
        foreign key (employee_registration_id, tenant_id, pilot_launch_id, access_pool_id)
        references employee_registrations (id, tenant_id, pilot_launch_id, access_pool_id),
    constraint fk_legal_document_acceptance_log_tenant
        foreign key (tenant_id)
        references tenants (id),
    constraint fk_legal_document_acceptance_log_pilot_launch_tenant
        foreign key (pilot_launch_id, tenant_id)
        references pilot_launches (id, tenant_id),
    constraint fk_legal_document_acceptance_log_access_pool_tenant
        foreign key (access_pool_id, tenant_id)
        references access_pools (id, tenant_id),
    constraint legal_document_acceptance_log_document_type_check check (
        document_type in ('PRIVACY_POLICY', 'PERSONAL_DATA_CONSENT', 'TERMS_OF_USE', 'FINANCIAL_DISCLAIMER')
    ),
    constraint legal_document_acceptance_log_document_version_non_empty check (btrim(document_version) <> ''),
    constraint legal_document_acceptance_log_source_format check (
        source = lower(source)
        and source ~ '^[a-z0-9][a-z0-9_:-]{0,63}$'
    )
);

create unique index ux_legal_document_acceptance_log_employee_document_version
    on legal_document_acceptance_log (employee_registration_id, document_type, document_version);

create index ix_legal_document_acceptance_log_scope_document
    on legal_document_acceptance_log (tenant_id, pilot_launch_id, access_pool_id, document_type, accepted_at);

comment on table legal_document_acceptance_log is
    'Append-only log of draft legal document version acceptance by an employee registration.';
comment on column legal_document_acceptance_log.employee_registration_id is
    'Employee registration that accepted the draft legal document version set.';
comment on column legal_document_acceptance_log.tenant_id is
    'Tenant scope copied from employee_registrations at acceptance time for audit queries.';
comment on column legal_document_acceptance_log.pilot_launch_id is
    'Pilot launch scope copied from employee_registrations at acceptance time for audit queries.';
comment on column legal_document_acceptance_log.access_pool_id is
    'Access pool scope copied from employee_registrations at acceptance time for audit queries.';
comment on column legal_document_acceptance_log.document_type is
    'Draft legal document type accepted by the employee registration.';
comment on column legal_document_acceptance_log.document_version is
    'Draft document version identifier accepted by the employee registration.';
comment on column legal_document_acceptance_log.accepted_at is
    'UTC timestamp when the backend recorded the acceptance.';
comment on column legal_document_acceptance_log.source is
    'Minimal technical source of the acceptance event, without PII or raw invite codes.';
