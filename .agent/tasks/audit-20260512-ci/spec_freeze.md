# Audit 2026-05-12 CI — spec freeze

Статус: frozen

## Scope

- Add basic GitHub Actions CI because `.github/workflows` is absent.
- Workflow must use repo root wrappers and be compatible with Java 21 and pnpm.
- Required CI coverage: `make install`, `make verify`, `make build`, backend `apps/api ./mvnw verify`.
- Optional docs: narrow README note only if needed for developer workflow.
- Evidence path: `.agent/tasks/audit-20260512-ci/*`.

## Out of scope

- No changes to `Makefile`, package scripts or Maven configuration.
- No stage alias changes.
- No child agents.
- No reads from `.agent/stages/**/raw/**`.

## Acceptance mapping

- CI workflow exists under `.github/workflows/*`.
- Workflow runs on PRs and `main` pushes, with manual dispatch for recovery.
- CI installs pnpm workspace dependencies from lockfile through `make install`.
- CI sets Java 21 and runs both root wrapper quality gates and backend Maven verify.
- Local checks validate YAML syntax as far as available and record limitations.
