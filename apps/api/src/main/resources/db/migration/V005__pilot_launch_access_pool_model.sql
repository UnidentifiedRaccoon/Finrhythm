create table pilot_launches (
    id uuid primary key,
    tenant_id uuid not null,
    launch_key varchar(64) not null,
    name varchar(160) not null,
    status varchar(32) not null,
    target_size integer not null,
    starts_at timestamptz,
    ends_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_pilot_launches_tenant foreign key (tenant_id) references tenants (id),
    constraint uq_pilot_launches_id_tenant unique (id, tenant_id),
    constraint pilot_launches_key_format check (
        launch_key = lower(launch_key)
        and launch_key ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
    ),
    constraint pilot_launches_name_non_empty check (btrim(name) <> ''),
    constraint pilot_launches_status_check check (status in ('PLANNED', 'ACTIVE', 'CLOSED', 'ARCHIVED')),
    constraint pilot_launches_target_size_check check (target_size between 1 and 5000),
    constraint pilot_launches_dates_check check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create unique index ux_pilot_launches_tenant_key on pilot_launches (tenant_id, launch_key);
create index ix_pilot_launches_tenant_status on pilot_launches (tenant_id, status);

create table access_pools (
    id uuid primary key,
    tenant_id uuid not null,
    pilot_launch_id uuid not null,
    pool_key varchar(64) not null,
    name varchar(160) not null,
    status varchar(32) not null,
    capacity integer not null,
    starts_at timestamptz,
    ends_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint fk_access_pools_tenant foreign key (tenant_id) references tenants (id),
    constraint fk_access_pools_pilot_launch_tenant
        foreign key (pilot_launch_id, tenant_id)
        references pilot_launches (id, tenant_id),
    constraint uq_access_pools_id_tenant unique (id, tenant_id),
    constraint access_pools_key_format check (
        pool_key = lower(pool_key)
        and pool_key ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'
    ),
    constraint access_pools_name_non_empty check (btrim(name) <> ''),
    constraint access_pools_status_check check (status in ('PLANNED', 'ACTIVE', 'CLOSED', 'ARCHIVED')),
    constraint access_pools_capacity_check check (capacity between 1 and 5000),
    constraint access_pools_dates_check check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create unique index ux_access_pools_tenant_key on access_pools (tenant_id, pool_key);
create index ix_access_pools_tenant_launch_status on access_pools (tenant_id, pilot_launch_id, status);

insert into pilot_launches (
    id,
    tenant_id,
    launch_key,
    name,
    status,
    target_size,
    starts_at,
    ends_at,
    created_at,
    updated_at
)
select id,
       tenant_id,
       regexp_replace(cohort_key, 'wave', 'launch', 'gi') as launch_key,
       regexp_replace(regexp_replace(name, 'Wave', 'Pilot launch', 'g'), 'Волна', 'Запуск пилота', 'g') as name,
       status,
       target_size,
       starts_at,
       ends_at,
       created_at,
       updated_at
from cohorts;

insert into access_pools (
    id,
    tenant_id,
    pilot_launch_id,
    pool_key,
    name,
    status,
    capacity,
    starts_at,
    ends_at,
    created_at,
    updated_at
)
select id,
       tenant_id,
       id,
       regexp_replace(cohort_key, 'wave', 'access-pool', 'gi') as pool_key,
       regexp_replace(regexp_replace(name, 'Wave', 'Access pool', 'g'), 'Волна', 'Пул доступа', 'g') as name,
       status,
       target_size,
       starts_at,
       ends_at,
       created_at,
       updated_at
from cohorts;

alter table invite_codes
    add column access_pool_id uuid;

update invite_codes
set access_pool_id = cohort_id;

alter table invite_codes
    alter column access_pool_id set not null;

alter table invite_codes
    add constraint uq_invite_codes_id_tenant_access_pool unique (id, tenant_id, access_pool_id);

alter table invite_codes
    add constraint fk_invite_codes_access_pool_tenant
        foreign key (access_pool_id, tenant_id)
        references access_pools (id, tenant_id);

create index ix_invite_codes_tenant_access_pool_status
    on invite_codes (tenant_id, access_pool_id, status);

alter table employee_registrations
    add column pilot_launch_id uuid,
    add column access_pool_id uuid;

update employee_registrations registration
set pilot_launch_id = access_pool.pilot_launch_id,
    access_pool_id = access_pool.id
from access_pools access_pool
where registration.tenant_id = access_pool.tenant_id
  and registration.cohort_id = access_pool.id;

alter table employee_registrations
    alter column pilot_launch_id set not null,
    alter column access_pool_id set not null;

alter table employee_registrations
    drop constraint fk_employee_registrations_invite_code_scope,
    drop constraint fk_employee_registrations_cohort_tenant;

drop index ix_employee_registrations_tenant_cohort;

alter table employee_registrations
    add constraint fk_employee_registrations_pilot_launch_tenant
        foreign key (pilot_launch_id, tenant_id)
        references pilot_launches (id, tenant_id),
    add constraint fk_employee_registrations_access_pool_tenant
        foreign key (access_pool_id, tenant_id)
        references access_pools (id, tenant_id),
    add constraint fk_employee_registrations_invite_code_scope
        foreign key (invite_code_id, tenant_id, access_pool_id)
        references invite_codes (id, tenant_id, access_pool_id);

create index ix_employee_registrations_tenant_access_pool
    on employee_registrations (tenant_id, access_pool_id);

alter table employee_registrations
    drop column cohort_id;

alter table invite_codes
    drop constraint fk_invite_codes_cohort_tenant,
    drop constraint uq_invite_codes_id_tenant_cohort;

drop index ix_invite_codes_tenant_cohort_status;

alter table invite_codes
    drop column cohort_id;

drop table cohorts;
