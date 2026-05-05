# Task file: MVP-02-tenant-domain-001

## Goal

Implement only the first MVP-02 backend/domain bootstrap slice: minimal API runtime plus tenant, cohort/wave and invite code model.

## Status

`PASS`

Earlier blocker on 2026-05-04 during the required Java/Maven precheck: Java could not locate a runtime and `apps/api/mvnw` was absent. No production backend implementation was started in that earlier pass.

Builder update on 2026-05-04: Java 21.0.11 is available, Maven Wrapper was added under `apps/api`, and the tenant/cohort/invite model was implemented with append-only `V002`. Required root/backend commands passed and raw outputs are recorded.

Fresh verifier update on 2026-05-04: verifier returned `PASS` for this task only. This closes `MVP-02.01` / `MVP-02-tenant-domain-001`; it does not close invite issuance/activation, employee registration or admin cohort UI.

## Scope

See `.agent/stages/mvp/sprint_contract.md`.

## Builder first instruction

Before production edits, run:

1. `java -version`
2. `cd apps/api && ./mvnw -v` if `./mvnw` exists, otherwise record that Maven Wrapper is absent.

If Java remains unavailable and no approved Java 21 toolchain exists, stop and mark this task `BLOCKED`. Do not claim Spring/Maven proof from inspection.

## Non-goals

- No employee registration.
- No invite activation endpoint or one-user binding.
- No admin UI or activation funnel.
- No 500-code generation.
- No real customer, employee, personal or financial data.
- No employee-facing customer brand.
- No points, money, billing, rewards, diagnostics, learning or support implementation.

## Evidence expected

- Raw Java/Maven/Docker/PostgreSQL command outputs.
- Migration notes for append-only Flyway changes after `V001`.
- Tests or DB checks proving tenant/cohort/invite constraints.
- Documentation sync note.
- Fresh `stage_verifier` verdict scoped to this contract.
