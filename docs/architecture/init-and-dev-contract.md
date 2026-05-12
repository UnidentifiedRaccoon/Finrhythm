# Init and dev contract

Этот документ фиксирует, как должен работать локальный bootstrap.

## Цель

`make init` должен приводить локальную среду в reproducible state без double seed and manual guesswork.

## Ожидаемый flow

### `make install`

- проверяет локальную готовность Node.js, Corepack, pinned `pnpm`, Java 21 и API Maven Wrapper перед установкой зависимостей;
- устанавливает JS-зависимости через `pnpm install --frozen-lockfile`;
- падает рано с подсказками по исправлению вместо изменения глобального toolchain state;
- подготавливает local env templates, если они появятся в отдельном slice.

### `make init`

- starts local infrastructure if needed;
- applies PostgreSQL migrations through backend Flyway tooling before any bootstrap record is written;
- checks whether current bootstrap version was already applied;
- skips domain seed import when current version is already applied;
- records execution version after successful migrations;
- leaves domain seed import out of scope until a real seed/importer exists.

### `make dev`

- starts local dev services;
- must not silently reinitialize database.

## Current implementation

The bootstrap, MVP-02 backend/admin and MVP-04 web shell slices provide these root wrappers:

| Target | Current behavior |
|--------|------------------|
| `make install` | Запускает `scripts/check-toolchain.sh` для проверки Node.js/Corepack/`pnpm@10.27.0`/Java 21/API Maven Wrapper readiness, затем выполняет `pnpm install --frozen-lockfile` для root workspace. |
| `make dev` | Starts local PostgreSQL from `infra/local/compose.yaml`; does not apply migrations or seed. |
| `make init` | Starts local PostgreSQL, applies all backend Flyway migrations from `apps/api/src/main/resources/db/migration` through the API Maven wrapper/Flyway plugin, reads `scripts/init/version.json` and records the bootstrap run in `dev_bootstrap_runs` only after migrations succeed. |
| `make verify` | Runs harness self-check, `scripts/verify-bootstrap.mjs`, `apps/web` typecheck/test, `apps/admin` typecheck/test and `apps/api` Maven `verify`, including Failsafe/Testcontainers checks. |
| `make test-unit` | Runs current non-browser bootstrap verification, focused `apps/web` tests, focused `apps/admin` tests and `apps/api` Maven `verify`, including Failsafe/Testcontainers checks. |
| `make test-e2e` | Starts the local `apps/web` and `apps/admin` dev servers and runs their available browser smoke checks through `tests/e2e/browser-smoke.mjs`. |
| `make build` | Runs production-readiness checks, builds `apps/web`, builds `apps/admin` and packages `apps/api` after explicit test commands. |

`make init` and `make dev` require a running Docker daemon. If Docker is unavailable, they fail fast with an explicit message and do not mutate local data. `make init` is intentionally local-only: it refuses custom/non-compose `FINRHYTHM_DATABASE_URL` or database credentials so an agent cannot accidentally run local bootstrap migrations against a non-local database.

Install readiness check намеренно non-destructive: он не выполняет `corepack enable`, не устанавливает Java и не запускает Maven Wrapper. Он только проверяет, что pinned package manager, Java 21 и wrapper files доступны до того, как они понадобятся `verify`/`init`. Локальный Node.js желательно держать на Node.js 24 как в CI; минимальный runtime gate — Node.js 20.9+, потому что текущий Next.js workspace требует эту версию или выше.

`make test-e2e` uses local ports `3400` for `apps/web` and `3300` for `apps/admin` by default. Existing servers can be reused with `E2E_REUSE_SERVERS=1`, or explicit `WEB_SMOKE_BASE_URL` / `ADMIN_SMOKE_BASE_URL` values can point the wrapper at already running targets. Browser smoke artifacts are written under `.local/e2e/browser-smoke` unless `E2E_OUTPUT_DIR`, `WEB_SMOKE_OUTPUT_DIR` or `ADMIN_SMOKE_OUTPUT_DIR` overrides are provided.

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
- `content/fixtures/demo-bootstrap.json` uses the active `tenant/pilotLaunch/accessPool/invite` shape; legacy `cohort`/`wave` keys or fixture values are guarded by `scripts/verify-bootstrap.mjs`.
- Domain seed import is currently out of scope: `make init` records the versioned local bootstrap after migrations, but does not insert tenant, pilot launch, access pool, invite, lesson or reward rows until an explicit seed/import slice adds a real importer.
- `FORCE=1 make init` or `./scripts/init-local.sh --force` is an explicit override only; default init remains idempotent.
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
- versioned demo fixture/seed contract;
- docs for local launch.

MVP-01 bootstraps only synthetic fixture metadata and the idempotency table. MVP-02 now uses the tenant/pilot-launch/access-pool/invite schema after the append-only migration path; the demo bootstrap fixture mirrors that active terminology even though domain seed import remains out of scope until a later explicit seed/import slice. The local init contract is therefore app-schema-ready after Flyway migration, not domain-data-ready.
