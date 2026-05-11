alter table invite_codes
    add constraint uq_invite_codes_id_tenant_cohort unique (id, tenant_id, cohort_id);

create table employee_registrations (
    id uuid primary key,
    tenant_id uuid not null,
    cohort_id uuid not null,
    invite_code_id uuid not null,
    activation_subject_ref varchar(64) not null,
    full_name varchar(160) not null,
    email varchar(254) not null,
    phone varchar(16) not null,
    registered_at timestamptz not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_employee_registrations_tenant foreign key (tenant_id) references tenants (id),
    constraint fk_employee_registrations_cohort_tenant foreign key (cohort_id, tenant_id) references cohorts (id, tenant_id),
    constraint fk_employee_registrations_invite_code_scope
        foreign key (invite_code_id, tenant_id, cohort_id)
        references invite_codes (id, tenant_id, cohort_id),
    constraint employee_registrations_activation_subject_ref_format check (
        activation_subject_ref ~ '^[a-f0-9]{64}$'
    ),
    constraint employee_registrations_full_name_non_empty check (btrim(full_name) <> ''),
    constraint employee_registrations_email_normalized check (
        email = lower(email)
        and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    ),
    constraint employee_registrations_phone_normalized check (
        phone ~ '^[+][1-9][0-9]{7,14}$'
    )
);

create unique index ux_employee_registrations_invite_code
    on employee_registrations (invite_code_id);

create unique index ux_employee_registrations_activation_subject_ref
    on employee_registrations (activation_subject_ref);

create index ix_employee_registrations_tenant_cohort
    on employee_registrations (tenant_id, cohort_id);
