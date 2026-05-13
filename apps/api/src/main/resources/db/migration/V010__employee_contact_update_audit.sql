create table employee_contact_update_audit_log (
    id uuid primary key,
    occurred_at timestamptz not null,
    employee_registration_id uuid not null,
    tenant_id uuid not null,
    pilot_launch_id uuid not null,
    access_pool_id uuid not null,
    changed_fields varchar(32) not null,
    outcome varchar(16) not null,
    old_email_hash varchar(64) not null,
    new_email_hash varchar(64) not null,
    old_phone_hash varchar(64) not null,
    new_phone_hash varchar(64) not null,
    actor_type varchar(64) not null,
    employee_profile_session_id uuid not null,
    created_at timestamptz not null,
    constraint fk_employee_contact_update_audit_registration
        foreign key (employee_registration_id)
        references employee_registrations (id),
    constraint fk_employee_contact_update_audit_profile_session
        foreign key (employee_profile_session_id)
        references employee_profile_sessions (id),
    constraint fk_employee_contact_update_audit_pilot_launch_tenant
        foreign key (pilot_launch_id, tenant_id)
        references pilot_launches (id, tenant_id),
    constraint fk_employee_contact_update_audit_access_pool_tenant
        foreign key (access_pool_id, tenant_id)
        references access_pools (id, tenant_id),
    constraint employee_contact_update_audit_changed_fields_check check (
        changed_fields in ('none', 'email', 'phone', 'email,phone')
    ),
    constraint employee_contact_update_audit_outcome_check check (
        outcome in ('updated', 'noop')
    ),
    constraint employee_contact_update_audit_email_hash_check check (
        old_email_hash ~ '^[a-f0-9]{64}$'
        and new_email_hash ~ '^[a-f0-9]{64}$'
    ),
    constraint employee_contact_update_audit_phone_hash_check check (
        old_phone_hash ~ '^[a-f0-9]{64}$'
        and new_phone_hash ~ '^[a-f0-9]{64}$'
    ),
    constraint employee_contact_update_audit_actor_type_check check (
        actor_type = 'employee_profile_session'
    )
);

create index ix_employee_contact_update_audit_registration_occurred
    on employee_contact_update_audit_log (employee_registration_id, occurred_at);

create index ix_employee_contact_update_audit_scope_occurred
    on employee_contact_update_audit_log (tenant_id, pilot_launch_id, access_pool_id, occurred_at);

create index ix_employee_contact_update_audit_session
    on employee_contact_update_audit_log (employee_profile_session_id, occurred_at);

comment on table employee_contact_update_audit_log is
    'Append-only audit log for profile-session scoped employee contact updates; stores only hashed contact fingerprints.';
comment on column employee_contact_update_audit_log.employee_registration_id is
    'Employee registration whose contact fields were accepted for update or no-op.';
comment on column employee_contact_update_audit_log.changed_fields is
    'Comma-separated safe field set that changed, or none for normalized no-op.';
comment on column employee_contact_update_audit_log.outcome is
    'Accepted attempt outcome: updated or noop.';
comment on column employee_contact_update_audit_log.old_email_hash is
    'SHA-256 fingerprint of the previous normalized email with an audit namespace; never raw email.';
comment on column employee_contact_update_audit_log.new_email_hash is
    'SHA-256 fingerprint of the current normalized email with an audit namespace; never raw email.';
comment on column employee_contact_update_audit_log.old_phone_hash is
    'SHA-256 fingerprint of the previous normalized phone with an audit namespace; never raw phone.';
comment on column employee_contact_update_audit_log.new_phone_hash is
    'SHA-256 fingerprint of the current normalized phone with an audit namespace; never raw phone.';
comment on column employee_contact_update_audit_log.actor_type is
    'Fixed safe actor type for this MVP boundary: employee_profile_session.';
comment on column employee_contact_update_audit_log.employee_profile_session_id is
    'Safe UUID reference to the authenticated profile session; never the raw bearer token or token hash.';
