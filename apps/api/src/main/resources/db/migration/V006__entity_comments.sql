comment on table tenants is
    'Tenant account that scopes pilot launches, access pools and invite-code lifecycle data.';
comment on column tenants.id is 'Tenant primary identifier.';
comment on column tenants.slug is 'Stable lower-case tenant slug used for administration and lookup.';
comment on column tenants.display_name is 'Human-readable tenant name.';
comment on column tenants.status is 'Tenant lifecycle status.';
comment on column tenants.created_at is 'UTC timestamp when the tenant row was created.';
comment on column tenants.updated_at is 'UTC timestamp when the tenant row was last updated.';

comment on table pilot_launches is
    'Planned pilot rollout for a tenant, used to group related access pools and capacity goals.';
comment on column pilot_launches.id is 'Pilot launch primary identifier.';
comment on column pilot_launches.tenant_id is 'Tenant that owns the pilot launch.';
comment on column pilot_launches.launch_key is 'Stable lower-case key unique within the tenant.';
comment on column pilot_launches.name is 'Human-readable pilot launch name.';
comment on column pilot_launches.status is 'Pilot launch lifecycle status.';
comment on column pilot_launches.target_size is 'Target number of participants for the pilot launch.';
comment on column pilot_launches.starts_at is 'Optional UTC timestamp when the pilot launch starts.';
comment on column pilot_launches.ends_at is 'Optional UTC timestamp when the pilot launch ends.';
comment on column pilot_launches.created_at is 'UTC timestamp when the pilot launch row was created.';
comment on column pilot_launches.updated_at is 'UTC timestamp when the pilot launch row was last updated.';

comment on table access_pools is
    'Capacity-limited access pool within a pilot launch where invite codes are issued and tracked.';
comment on column access_pools.id is 'Access pool primary identifier.';
comment on column access_pools.tenant_id is 'Tenant that owns the access pool.';
comment on column access_pools.pilot_launch_id is 'Pilot launch that contains the access pool.';
comment on column access_pools.pool_key is 'Stable lower-case key unique within the tenant.';
comment on column access_pools.name is 'Human-readable access pool name.';
comment on column access_pools.status is 'Access pool lifecycle status.';
comment on column access_pools.capacity is 'Maximum number of invite codes in the access pool.';
comment on column access_pools.starts_at is 'Optional UTC timestamp when the access pool opens.';
comment on column access_pools.ends_at is 'Optional UTC timestamp when the access pool closes.';
comment on column access_pools.created_at is 'UTC timestamp when the access pool row was created.';
comment on column access_pools.updated_at is 'UTC timestamp when the access pool row was last updated.';

comment on table invite_codes is
    'Persisted invite-code lifecycle state. Raw invite codes are never stored.';
comment on column invite_codes.id is 'Invite-code row primary identifier.';
comment on column invite_codes.tenant_id is 'Tenant that owns the invite-code row.';
comment on column invite_codes.access_pool_id is 'Access pool that contains the invite-code row.';
comment on column invite_codes.lookup_hash is 'SHA-256 lookup hash derived from the submitted invite code.';
comment on column invite_codes.status is 'Invite-code lifecycle status.';
comment on column invite_codes.issued_at is 'UTC timestamp when the invite code was issued.';
comment on column invite_codes.expires_at is 'Optional UTC timestamp when the invite code expires.';
comment on column invite_codes.activated_at is 'UTC timestamp when the invite code was activated.';
comment on column invite_codes.activation_subject_ref is
    'SHA-256 subject reference bound at activation. Does not contain employee PII.';
comment on column invite_codes.created_at is 'UTC timestamp when the invite-code row was created.';
comment on column invite_codes.updated_at is 'UTC timestamp when the invite-code row was last updated.';

comment on table employee_registrations is
    'Employee registration created after a successful invite-code activation.';
comment on column employee_registrations.id is 'Employee registration primary identifier.';
comment on column employee_registrations.tenant_id is 'Tenant scope copied from the accepted invite code.';
comment on column employee_registrations.pilot_launch_id is 'Pilot launch scope copied from the accepted invite code.';
comment on column employee_registrations.access_pool_id is 'Access pool scope copied from the accepted invite code.';
comment on column employee_registrations.invite_code_id is 'Invite-code row used for this registration.';
comment on column employee_registrations.activation_subject_ref is
    'SHA-256 subject reference generated for idempotent activation and registration retries.';
comment on column employee_registrations.full_name is 'Normalized employee full name.';
comment on column employee_registrations.email is 'Normalized employee email address.';
comment on column employee_registrations.phone is 'Normalized employee phone number.';
comment on column employee_registrations.registered_at is 'UTC timestamp when registration first succeeded.';
comment on column employee_registrations.created_at is 'UTC timestamp when the registration row was created.';
comment on column employee_registrations.updated_at is 'UTC timestamp when the registration row was last updated.';
