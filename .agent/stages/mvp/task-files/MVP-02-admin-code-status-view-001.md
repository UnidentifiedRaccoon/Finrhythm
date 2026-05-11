# Task: MVP-02-admin-code-status-view-001

Status: `BUILT_AWAITING_VERIFIER`
Stage: `mvp`
Parent execution unit: `MVP-02.04`
Role to run next: `stage_verifier`

## Objective

Implement the backend/admin API data contract for the future admin cohort/code status view and activation funnel.

This is a backend/API-only slice. `apps/admin` UI remains out of scope because the repository currently has no Next.js admin app baseline beyond `apps/admin/AGENTS.md`.

## Inputs

- `AGENTS.md`
- `.agents/skills/stage-launch-proof-loop/SKILL.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `docs/engineering/definition-of-done.md`
- `docs/engineering/human-gates.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/stages/MVP.md`
- `apps/admin/AGENTS.md`
- `apps/api/AGENTS.md`
- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/sprint_contract.md`
- `.agent/stages/mvp/task-files/MVP-02-tenant-domain-001.md`
- `.agent/stages/mvp/task-files/MVP-02-invite-issuance-activation-001.md`
- `.agent/stages/mvp/task-files/MVP-02-employee-registration-001.md`
- current `apps/api` tenant/cohort/invite/registration model and repositories

## Owned repo areas for implementation

- `apps/api/src/main/java/com/finrhythm/api/admin/**` or nearest local equivalent.
- `apps/api/src/main/java/com/finrhythm/api/tenant/persistence/**` only for read queries/projections.
- `apps/api/src/main/java/com/finrhythm/api/registration/persistence/**` only for read queries/projections.
- `apps/api/src/main/resources/db/migration/V005__*.sql` or next append-only Flyway migration after `V004`, only if a read-supporting index is necessary.
- `apps/api/src/test/java/com/finrhythm/api/admin/**` or nearest local equivalent.
- `apps/api/src/test/resources/**` only for test data/configuration.
- `packages/api-client/**` only if generated from OpenAPI source; otherwise record a no-op and leave it untouched.
- `.agent/stages/mvp/evidence.*`, `.agent/stages/mvp/raw/**`, `.agent/stages/mvp/verdict.*`, `.agent/stages/mvp/problems.*` and current stage handoff artifacts.

## Non-goals

- No `apps/admin` Next.js scaffold, route, component, browser smoke or screenshot.
- No admin operator copy in this backend-only slice; a later UI slice must use Russian copy and screenshot/browser evidence.
- No admin mutations for tenant/cohort/code generation/revocation/bulk actions.
- No employee-facing UI.
- No onboarding/privacy/consent screen or legal copy approval.
- No auth/session, SSO, SCIM, role/permission model or admin audit logs.
- No HR dashboard/report/export or anonymity-threshold reporting.
- No diagnostic answers, weak zones, exact financial data, learning, points, rewards, merch, support or feedback.
- No raw invite-code display, lookup hash, activation subject ref or employee contact fields in the status response.
- No real customer/employee/personal/financial data.
- No customer brand in employee-facing examples.

## Acceptance criteria

Use the exact criteria in `.agent/stages/mvp/sprint_contract.md`.

Important implementation constraints:

- Keep backend baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway, OpenAPI/springdoc.
- Keep controller thin.
- Keep aggregation and privacy filtering in service/read-model or repository projections.
- Prefer no DB migration; if needed, use append-only migration after `V004`.
- Represent public/admin contract through springdoc/OpenAPI source.
- Do not manually invent generated client artifacts.
- Never expose raw invite codes, lookup hashes, activation subject refs or employee contact fields in this status response.
- Preserve legal/privacy, real-data, customer-reporting and admin-auth human gates.

## Verification plan

Run and record:

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- API/read-model tests for 500-code Wave 1 scale, mixed status counts, activation/registration funnel counts, status filtering, pagination, safe not-found/mismatch and validation errors
- migration/no-migration inspection
- OpenAPI/springdoc endpoint/schema inspection
- generated-client regeneration output or explicit no-op note
- privacy/raw invite-code/PII/customer-brand guardrail scan
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`

Then run a fresh `stage_verifier` scoped to `MVP-02-admin-code-status-view-001`.

## Evidence handoff required

Builder updated evidence artifacts and mapped every acceptance criterion to raw refs. Because this is backend-only, UI screenshot evidence is `NOT_APPLICABLE`.

Fresh `stage_verifier` is still required; no `verdict.json` or `verdicts/MVP-02-admin-code-status-view-001.json` has been written by the builder.

## Human gates

Legal/privacy wording, consent text, use of real employee/customer data, customer-specific reporting boundaries, admin auth/role/audit policy and production admin access remain `WAITING_HUMAN`. This task may prepare privacy-safe operational status data, but it cannot approve real-world processing or production admin access.
