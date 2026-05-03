# Init and dev contract

Этот документ фиксирует, как должен работать локальный bootstrap.

## Цель

`make init` должен приводить локальную среду в reproducible state без double seed and manual guesswork.

## Ожидаемый flow

### `make install`

- installs JS dependencies;
- prepares Java/Maven toolchain;
- prepares local env templates if needed.

### `make init`

- starts local infrastructure if needed;
- applies PostgreSQL migrations;
- checks whether current bootstrap version was already applied;
- skips seed if current version is already applied;
- otherwise runs seed/import bootstrap and records execution version.

### `make dev`

- starts local dev services;
- must not silently reinitialize database.

## Versioned bootstrap

Recommended baseline:

- manifest: `scripts/init/version.json`;
- bootstrap key: `local_init`;
- status table: `dev_bootstrap_runs`.

```json
{
  "bootstrapKey": "local_init",
  "version": "2026-05-03.1",
  "checksum": "update-when-seed-contract-changes"
}
```

```sql
create table if not exists dev_bootstrap_runs (
  bootstrap_key text not null,
  version text not null,
  checksum text null,
  applied_at timestamptz not null default now(),
  primary key (bootstrap_key, version)
);
```

## Rules

- Repeated `make init` must not duplicate demo entities.
- Seed-contract changes require new bootstrap version.
- Demo users, lessons and rewards must be synthetic.
- `--force` is explicit override only.
- If migrations fail, bootstrap must not be recorded successful.

## Agent must not

- silently reset local DB without direct instruction;
- replace versioned bootstrap with unreproducible shell commands;
- seed real personal or financial data;
- create competing init methods.

## MVP-01 expected output

- root wrappers for `install/init/dev/verify/test-unit/test-e2e/build`;
- Maven Wrapper under `apps/api` or equivalent root delegation;
- bootstrap manifest;
- bootstrap status table;
- reproducible demo seed;
- docs for local launch.
