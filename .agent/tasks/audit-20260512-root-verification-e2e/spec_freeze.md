# Audit 2026-05-12 root verification/e2e — spec freeze

Статус: DONE_WITH_OUT_OF_SCOPE_BLOCKERS

## Scope

- `Makefile`
- `package.json`
- `tests/e2e/*`
- `README.md`
- `docs/architecture/init-and-dev-contract.md`
- `.agent/tasks/audit-20260512-root-verification-e2e/*`

## Issues

1. Root `make verify` and `make test-unit` must execute backend `cd apps/api && ./mvnw -q verify`, not only `test`, so Maven Failsafe/Testcontainers checks are part of the root gate.
2. Root `make test-e2e` must execute real available browser smoke checks for `apps/web` and `apps/admin`, not the old no-op placeholder.

## Acceptance criteria

- `make verify` includes `cd apps/api && ./mvnw -q verify`.
- `make test-unit` includes `cd apps/api && ./mvnw -q verify`.
- `make test-e2e` delegates to a root wrapper that runs the available `@finrhythm/web` and `@finrhythm/admin` browser smoke scripts.
- Root `package.json` `test:e2e` uses the same non-placeholder wrapper as `make test-e2e`.
- README and `docs/architecture/init-and-dev-contract.md` describe Maven verify and real browser smoke behavior.
- Evidence records dry-run output and feasible focused checks, including honest browser/Playwright/dev-server limitations if any.

## Explicit exclusions

- No `make init` or `make install` behavior changes.
- No API client/shared package edits.
- No stage aliases, stage raw evidence reads, child agents or stage harness execution.
