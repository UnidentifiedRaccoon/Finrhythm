create table employee_lesson_progress (
    id uuid primary key,
    employee_registration_id uuid not null,
    tenant_id uuid not null,
    pilot_launch_id uuid not null,
    access_pool_id uuid not null,
    lesson_id varchar(16) not null,
    status varchar(16) not null,
    started_at timestamptz not null,
    last_opened_at timestamptz not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_employee_lesson_progress_registration_scope
        foreign key (employee_registration_id, tenant_id, pilot_launch_id, access_pool_id)
        references employee_registrations (id, tenant_id, pilot_launch_id, access_pool_id),
    constraint fk_employee_lesson_progress_tenant
        foreign key (tenant_id)
        references tenants (id),
    constraint fk_employee_lesson_progress_pilot_launch_tenant
        foreign key (pilot_launch_id, tenant_id)
        references pilot_launches (id, tenant_id),
    constraint fk_employee_lesson_progress_access_pool_tenant
        foreign key (access_pool_id, tenant_id)
        references access_pools (id, tenant_id),
    constraint employee_lesson_progress_lesson_check check (lesson_id = 'N1'),
    constraint employee_lesson_progress_status_check check (status in ('STARTED')),
    constraint employee_lesson_progress_time_check check (
        last_opened_at >= started_at
        and updated_at >= created_at
    )
);

create unique index ux_employee_lesson_progress_registration_lesson
    on employee_lesson_progress (employee_registration_id, lesson_id);

create index ix_employee_lesson_progress_scope_lesson_status
    on employee_lesson_progress (tenant_id, pilot_launch_id, access_pool_id, lesson_id, status);

comment on table employee_lesson_progress is
    'Minimal MVP N1 lesson progress per employee registration; scope is resolved from profile-session authentication.';
comment on column employee_lesson_progress.employee_registration_id is
    'Authenticated employee registration owner. Client request bodies cannot set this scope.';
comment on column employee_lesson_progress.lesson_id is
    'N1-only lesson id for this diagnostic handoff foundation slice; N2+ remain out of scope.';
comment on column employee_lesson_progress.status is
    'Minimal start/resume status only. Completion, quiz, practice and rewards are out of scope.';
comment on column employee_lesson_progress.started_at is
    'First successful N1 start timestamp.';
comment on column employee_lesson_progress.last_opened_at is
    'Most recent idempotent N1 start/resume timestamp.';
