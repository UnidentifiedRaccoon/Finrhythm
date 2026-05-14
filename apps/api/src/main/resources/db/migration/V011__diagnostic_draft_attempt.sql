create table diagnostic_attempts (
    id uuid primary key,
    employee_registration_id uuid not null,
    tenant_id uuid not null,
    pilot_launch_id uuid not null,
    access_pool_id uuid not null,
    state varchar(16) not null,
    route_preview boolean not null default false,
    recommended_first_lesson_id varchar(16),
    submitted_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_diagnostic_attempts_registration
        foreign key (employee_registration_id)
        references employee_registrations (id),
    constraint fk_diagnostic_attempts_tenant
        foreign key (tenant_id)
        references tenants (id),
    constraint fk_diagnostic_attempts_pilot_launch_tenant
        foreign key (pilot_launch_id, tenant_id)
        references pilot_launches (id, tenant_id),
    constraint fk_diagnostic_attempts_access_pool_tenant
        foreign key (access_pool_id, tenant_id)
        references access_pools (id, tenant_id),
    constraint diagnostic_attempts_state_check check (state in ('DRAFT', 'SUBMITTED')),
    constraint diagnostic_attempts_safe_handoff_check check (
        (
            state = 'DRAFT'
            and route_preview = false
            and recommended_first_lesson_id is null
            and submitted_at is null
        )
        or (
            state = 'SUBMITTED'
            and route_preview = true
            and recommended_first_lesson_id = 'N1'
            and submitted_at is not null
        )
    )
);

create unique index ux_diagnostic_attempts_registration
    on diagnostic_attempts (employee_registration_id);

create index ix_diagnostic_attempts_scope_state
    on diagnostic_attempts (tenant_id, pilot_launch_id, access_pool_id, state);

create table diagnostic_attempt_q0_metadata (
    attempt_id uuid primary key,
    question_id varchar(8) not null,
    selected_option_ids jsonb not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_diagnostic_attempt_q0_metadata_attempt
        foreign key (attempt_id)
        references diagnostic_attempts (id)
        on delete cascade,
    constraint diagnostic_attempt_q0_metadata_question_check check (question_id = 'Q0'),
    constraint diagnostic_attempt_q0_metadata_options_array check (
        jsonb_typeof(selected_option_ids) = 'array'
    )
);

create table diagnostic_attempt_self_assessment_answers (
    attempt_id uuid not null,
    question_id varchar(8) not null,
    scale_value integer not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    primary key (attempt_id, question_id),
    constraint fk_diagnostic_attempt_self_assessment_attempt
        foreign key (attempt_id)
        references diagnostic_attempts (id)
        on delete cascade,
    constraint diagnostic_attempt_self_assessment_question_check check (
        question_id in ('SA1', 'SA2', 'SA3')
    ),
    constraint diagnostic_attempt_self_assessment_scale_check check (
        scale_value between 1 and 5
    )
);

create table diagnostic_attempt_routing_answers (
    attempt_id uuid not null,
    question_id varchar(8) not null,
    option_id varchar(8) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    primary key (attempt_id, question_id),
    constraint fk_diagnostic_attempt_routing_answers_attempt
        foreign key (attempt_id)
        references diagnostic_attempts (id)
        on delete cascade,
    constraint diagnostic_attempt_routing_answers_question_check check (
        question_id in ('Q1', 'Q2', 'Q3')
    ),
    constraint diagnostic_attempt_routing_answers_option_check check (
        option_id in ('A', 'B', 'C', 'D', 'E')
    )
);

comment on table diagnostic_attempts is
    'One current MVP diagnostic draft/submission attempt per employee registration; scope is resolved from profile-session authentication.';
comment on column diagnostic_attempts.employee_registration_id is
    'Authenticated employee registration owner. Client request bodies cannot set this scope.';
comment on column diagnostic_attempts.route_preview is
    'Safe handoff marker only; true after submit without final score, level, routeId, weak zones or HR insights.';
comment on column diagnostic_attempts.recommended_first_lesson_id is
    'Safe first lesson handoff for this foundation slice. Only N1 is allowed in V011.';
comment on table diagnostic_attempt_q0_metadata is
    'Q0 privacy/expectation metadata kept separate from self-assessment and routing answers. Service allowlist rejects unknown option IDs.';
comment on table diagnostic_attempt_self_assessment_answers is
    'SA1-SA3 1-5 self-assessment values; non-scoring and stored separately from routing answers.';
comment on table diagnostic_attempt_routing_answers is
    'Q1-Q3 route-preview answers only; final scoring, Q4-Q28 and R1-R6 are out of scope.';
