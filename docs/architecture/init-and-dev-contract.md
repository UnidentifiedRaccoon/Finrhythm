# Init and dev contract

Этот документ фиксирует, как должен работать локальный bootstrap.

## Цель

`make init` должен приводить локальную среду в reproducible state без double seed and manual guesswork.

## Ожидаемый flow

### `make install`

- installs JS dependencies;
- prepares Java/Maven toolchain when API workspace is present;
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

## Current implementation

The bootstrap, MVP-02 backend/admin and MVP-04 web shell slices provide these root wrappers:

| Target | Current behavior |
|--------|------------------|
| `make install` | Runs `pnpm install --frozen-lockfile` for the root workspace. |
| `make dev` | Starts local PostgreSQL from `infra/local/compose.yaml`; does not apply migrations or seed. |
| `make init` | Starts PostgreSQL, applies `V001__dev_bootstrap_runs.sql`, reads `scripts/init/version.json` and records the bootstrap run in `dev_bootstrap_runs`. |
| `make verify` | Runs harness self-check, `scripts/verify-bootstrap.mjs`, `apps/web` typecheck/test, `apps/admin` typecheck/test and `apps/api` backend unit tests. |
| `make test-unit` | Runs current non-browser bootstrap verification, focused `apps/web` tests, focused `apps/admin` tests and `apps/api` backend unit tests. |
| `make test-e2e` | Records that browser e2e has no runnable target in MVP-01. |
| `make build` | Runs production-readiness checks, builds `apps/web`, builds `apps/admin` and packages `apps/api` after explicit test commands. |

`make init` and `make dev` require a running Docker daemon. If Docker is unavailable, they fail fast with an explicit message and do not mutate local data.

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
- Maven Wrapper under `apps/api` or equivalent root delegation when API implementation starts;
- bootstrap manifest;
- bootstrap status table;
- reproducible demo seed;
- docs for local launch.

MVP-01 bootstraps only synthetic fixture metadata and the idempotency table. MVP-02 now uses the tenant/pilot-launch/access-pool/invite schema after the append-only migration path; domain seed import remains out of scope until a later explicit seed/import slice.
