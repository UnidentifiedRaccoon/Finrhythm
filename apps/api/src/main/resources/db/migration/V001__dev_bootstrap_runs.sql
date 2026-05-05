create table if not exists dev_bootstrap_runs (
    bootstrap_key text not null,
    version text not null,
    checksum text,
    applied_at timestamptz not null default now(),
    primary key (bootstrap_key, version)
);
