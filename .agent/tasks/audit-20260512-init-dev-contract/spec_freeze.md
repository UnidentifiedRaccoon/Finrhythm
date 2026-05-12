# Audit 2026-05-12: P0 Init/dev contract

## Scope Freeze

Статус: `IN_PROGRESS`

Задача: исправить локальный `make init`, который раньше вручную применял только `V001__dev_bootstrap_runs.sql` и мог оставить PostgreSQL с bootstrap record без полной Flyway schema readiness.

## In Scope

- `scripts/init-local.sh`: полный local-only init flow без reset/destructive operations.
- `Makefile`: help text только если меняется поведение `make init`.
- `scripts/verify-bootstrap.mjs`: focused regression checks for init contract.
- `docs/architecture/init-and-dev-contract.md`: canonical doc-sync по local init/dev contract.
- `.agent/tasks/audit-20260512-init-dev-contract/*`: evidence and self-verification artifacts.

## Out Of Scope

- Stage aliases and stage harness execution.
- `.agent/stages/**/raw/**`.
- API read models, generated API client and frontend/admin behavior.
- Domain seed importer and demo domain data insertion.
- Database reset, volume deletion or destructive cleanup.

## Acceptance Criteria

- `make init` starts local compose PostgreSQL and applies all backend Flyway migrations before writing `dev_bootstrap_runs`.
- Bootstrap record remains idempotent for `scripts/init/version.json`.
- Init refuses non-compose/non-local DB targets.
- Domain seed import is explicitly documented as out of scope until a real importer exists.
- Focused checks prove shell syntax, bootstrap verifier, guarded DB refusal, actual local init, Flyway history and idempotent rerun.

## Doc-Sync Target

- Narrow canonical owner: `docs/architecture/init-and-dev-contract.md`.
- No product/stage baseline changes intended.
