# Task: MVP-02-admin-ui-status-view-001

Status: `BUILT_AWAITING_VERIFIER`
Stage: `mvp`
Parent execution unit: `MVP-02.04`
Role to run next: `stage_builder`

## Objective

Build the minimal `apps/admin` Next.js scaffold and read-only cohort/code status view needed to make the verified backend admin API screenshotable and testable.

This task closes only the UI proof gap for `MVP-02.04` after implementation and fresh verification. It must not close full `MVP-02.04`, full `MVP-02` or MVP by itself.

## Inputs

- `AGENTS.md`
- `.agents/skills/stage-launch-proof-loop/SKILL.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `docs/engineering/definition-of-done.md`
- `docs/engineering/human-gates.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/architecture/access-and-subscriptions.md`
- `docs/architecture/organization-access-subscription-model.md`
- `docs/stages/MVP.md`
- `apps/admin/AGENTS.md`
- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/sprint_contract.md`
- backend DTO source:
  - `apps/api/src/main/java/com/finrhythm/api/admin/web/AdminCodeStatusController.java`
  - `apps/api/src/main/java/com/finrhythm/api/admin/readmodel/*`
  - `apps/api/src/main/java/com/finrhythm/api/admin/service/AdminCodeStatusService.java`

## Owned repo areas for implementation

- `apps/admin/package.json`
- `apps/admin/next.config.mjs`
- `apps/admin/tsconfig.json`
- `apps/admin/app/layout.tsx`
- `apps/admin/app/page.tsx`
- `apps/admin/app/globals.css`
- narrow `apps/admin/app/loading.tsx`, `apps/admin/app/error.tsx`, `apps/admin/components/**`, `apps/admin/lib/**`, `apps/admin/tests/**` if needed
- root `package.json`, `pnpm-lock.yaml`, `Makefile` only if needed for honest install/build/typecheck/root wrapper integration
- narrow setup/runtime docs only if wrapper/app setup changes require doc-sync
- stage evidence, raw, verdict and problem artifacts for this task

## Non-goals

- No backend/API/schema changes.
- No generated API client implementation or manual generated artifacts.
- No admin auth/session/roles/audit production policy.
- No real employee/customer data.
- No customer-specific reporting or HR dashboard.
- No admin mutations: generate, revoke, create, edit, bulk action or export.
- No employee-facing app, diagnostics, learning, content/CMS, rewards, merch, support or feedback.
- No full `MVP-02.04`, full `MVP-02` or MVP closure before fresh verification.

## Acceptance criteria

Use the exact criteria in `.agent/stages/mvp/sprint_contract.md`.

Critical constraints:

- Keep backend baseline explicit: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway, OpenAPI/springdoc.
- Match the proven backend DTO locally; do not invent a conflicting contract.
- Use Russian operator copy.
- Provide success, loading, error and empty states.
- Use synthetic fixtures for screenshots unless a live local API smoke uses synthetic tenant/cohort data.
- Never render raw invite codes, lookup hashes, activation subject refs, employee contact fields, diagnostics or financial data.
- Treat generated-client work as no-op/out of scope because `packages/api-client` has no generator.
- Preserve legal/privacy, real-data, customer-reporting and admin-auth human gates.

## Verification plan

Run and record:

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `make verify`
- `make test-unit`
- `make build`
- install proof after JS dependency/lockfile updates
- admin package typecheck/build/test commands
- browser smoke for desktop and mobile admin route
- screenshot refs for desktop and mobile
- DTO/fixture/client boundary check
- PII/raw-code/customer-brand scan
- generated-client no-op note
- docs target decision and doc-sync proof if needed
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`

Then run a fresh `stage_verifier` scoped to `MVP-02-admin-ui-status-view-001`.

## Evidence handoff

Builder evidence artifacts are recorded and map the acceptance criteria to raw refs. UI screenshot evidence is present.

Immutable evidence:

- `.agent/stages/mvp/evidence/MVP-02-admin-ui-status-view-001.md`
- `.agent/stages/mvp/evidence/MVP-02-admin-ui-status-view-001.json`
- task-specific raw command outputs under `.agent/stages/mvp/raw/`
- screenshot refs under `.agent/stages/mvp/raw/mvp-02-admin-ui-status-view-001-screenshots-final/`
- final fresh verifier verdict is still pending under `.agent/stages/mvp/verdicts/MVP-02-admin-ui-status-view-001.json`

## Docs targets

Record one of:

- setup/runtime docs updated because root wrappers/package scripts/admin app setup changed; or
- no canonical docs changed because implementation stayed inside already documented repo layout and wrapper behavior.

Evidence must include the generated-client no-op and a Mermaid diagram for the admin route, local client/fixture boundary, backend DTO or fixture source, privacy-safe rendering and UI states.

## Human gates

Legal/privacy wording, consent text, real employee/customer data, customer-specific reporting boundaries, admin auth/role/audit policy and production admin access remain `WAITING_HUMAN`. This task may prepare a privacy-safe operator view, but it cannot approve real-world processing or production admin access.
