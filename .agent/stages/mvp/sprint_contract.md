# Sprint contract: MVP-02-admin-code-status-view-001

Status: `BUILT_AWAITING_VERIFIER`
Created: 2026-05-09
Stage: `mvp`
Parent stage unit: `MVP-02.04`
Execution mode: backend/admin API implementation slice after this freeze

## Objective

Implement the read-only backend/admin API data contract for the future admin cohort/code status view and activation funnel.

This contract starts from the proven MVP-02 tenant/cohort/invite model, invite issuance/activation core and employee registration API. It is intentionally backend/API-only because `apps/admin` has no Next.js app baseline yet. It must not implement admin UI, admin app scaffold, screenshots, admin auth/session, HR reports or full MVP-02 closure.

## Files in scope for future builder

Production files allowed only within this contract:

- `apps/api/src/main/java/com/finrhythm/api/admin/**` or nearest local package for admin read controller, DTOs and service/read-model code.
- `apps/api/src/main/java/com/finrhythm/api/tenant/persistence/**` for repository read queries/projections if needed.
- `apps/api/src/main/java/com/finrhythm/api/registration/persistence/**` for registration-count/read projections if needed.
- `apps/api/src/main/resources/db/migration/V005__*.sql` or next append-only Flyway migration after `V004`, only if a read index is necessary.
- `apps/api/src/test/java/com/finrhythm/api/admin/**` or nearest local package for API/read-model tests.
- `apps/api/src/test/resources/**` only for test configuration/fixtures.
- `packages/api-client/**` only if generated from OpenAPI source; otherwise record a no-op and leave it untouched.

Stage artifacts:

- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/sprint_contract.md`
- `.agent/stages/mvp/task-files/MVP-02-admin-code-status-view-001.md`
- `.agent/stages/mvp/backlog.md`
- `.agent/stages/mvp/feature_list.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/decisions.md`
- `.agent/stages/mvp/risks.md`
- future `.agent/stages/mvp/evidence.*`
- future `.agent/stages/mvp/raw/**`
- future `.agent/stages/mvp/verdict.*`
- future `.agent/stages/mvp/problems.*`

## Out of scope

- `apps/admin` Next.js app scaffold, routes, components, browser smoke or screenshots.
- Admin operator copy; a later UI slice must use Russian copy and screenshot/browser evidence.
- Admin mutation actions: create tenant/cohort, issue/generate invite batches, revoke codes, edit cohorts or bulk actions.
- Employee web UI, onboarding, privacy screen, consent version logging or legal document approval.
- Full auth/session, passwords, SSO, SCIM, admin role/permission model or admin audit logs.
- HR/sponsor dashboard, exports, anonymity-threshold reporting, diagnostics, learning, points, rewards, merch, support and feedback.
- Raw invite-code display, lookup hashes, activation subject refs, employee fullName/email/phone, diagnostic answers, weak zones or exact financial data in the admin status response.
- Real customer brand, real employee/customer data or real personal/financial data in code, tests, fixtures, logs or raw evidence.
- Final legal/privacy approval for processing real employee data or production admin access.

## Frozen API contract

Preferred endpoint:

- `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`

Path/query parameters:

- `tenantId` required UUID;
- `cohortId` required UUID;
- `status` optional invite-code status filter;
- `page` optional non-negative integer;
- `size` optional bounded integer with a maximum suitable for Wave 1 pagination.

Success response:

- `tenantId`;
- `cohortId`;
- `cohortKey`;
- `cohortName`;
- `cohortKind`;
- `cohortStatus`;
- `targetSize`;
- `summary.issuedCount`;
- `summary.activatedCount`;
- `summary.registeredCount`;
- `summary.revokedCount`;
- `summary.expiredCount`;
- `summary.totalCodeCount`;
- `summary.remainingCapacity`;
- `statusCounts[]` with `{ status, count }`;
- `codes.page`, `codes.size`, `codes.totalItems`, `codes.totalPages`;
- `codes.items[]` with:
  - `inviteCodeId`;
  - `status`;
  - `issuedAt`;
  - `expiresAt`;
  - `activatedAt`;
  - `registeredAt`;
  - `registered`.

Errors:

- invalid UUID/filter/page/size returns structured 400;
- missing tenant/cohort or tenant/cohort mismatch returns structured safe 404;
- errors do not reveal unrelated tenant/cohort existence;
- errors and examples do not echo raw invite codes, lookup hashes, activation subject refs or employee contact fields.

## Acceptance criteria

1. Backend baseline remains Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
2. Slice is backend/admin API-only; no `apps/admin` UI/scaffold files are changed.
3. A read-only admin endpoint returns cohort metadata, invite-code status counts, activation/registration funnel counts and paginated per-code operational rows for one tenant/cohort.
4. Wave 1 scale is tested with 500 synthetic invite codes and mixed activation/registration states.
5. Status filter and pagination are tested, deterministic and bounded.
6. The response never includes raw invite codes, lookup hashes, activation subject refs, employee `fullName`, `email`, `phone`, diagnostic answers, weak zones or exact financial data.
7. Tests/fixtures/evidence use synthetic data only and no real customer brand.
8. Controller stays thin; aggregation, pagination and privacy filtering live in service/read-model or repository projection code.
9. DB changes are avoided unless necessary; any DB change is append-only after `V004` and limited to read support.
10. OpenAPI/springdoc source exposes endpoint parameters, schemas, safe errors and privacy-safe examples.
11. Generated-client status is handled honestly: regenerate if a generator exists, or record explicit no-op because no generator/artifacts exist yet.
12. Evidence maps every criterion to raw refs for git status, Java/Maven/root commands, API tests, migration/no-migration inspection, OpenAPI inspection, generated-client/no-op note, privacy/PII/raw-code scans, harness validation and fresh verifier verdict.
13. Legal/privacy wording, consent text, real employee/customer data processing, customer-specific reporting, admin auth/role/audit policy and production use of real admin data remain open human gates and are not marked DONE.

## Verification evidence required later

Record raw outputs for:

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- API/read-model tests for 500-code Wave 1, mixed status counts, activation/registration funnel, filtering, pagination and safe errors
- migration/no-migration inspection
- OpenAPI/springdoc endpoint/schema inspection
- generated-client regeneration output or explicit no-op note
- privacy/raw invite-code/PII/customer-brand guardrail scan
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- fresh `stage_verifier` verdict scoped only to `MVP-02-admin-code-status-view-001`

## Docs targets

- OpenAPI/springdoc source is the canonical API contract for this slice.
- Generated-client notes must be recorded in evidence; generated artifacts may only be updated from source.
- No canonical product/stage doc change is expected unless builder discovers a contradiction or expands the accepted behavior.
- `apps/admin` setup/docs are not expected to change in this backend-only slice.
- Evidence must include a concise Mermaid flow/sequence diagram for admin request, read aggregation, privacy filtering and response/error handling.

## Human gates

No human gate is closed by this contract.

Legal/privacy wording, consent copy, real employee/customer data processing, customer-specific reporting, admin auth/role/audit policy and production use of real admin data remain `WAITING_HUMAN`.

## Current state

Builder implementation and evidence are recorded for the backend/admin API-only slice:

- immutable evidence: `.agent/stages/mvp/evidence/MVP-02-admin-code-status-view-001.md`;
- raw command refs: `.agent/stages/mvp/raw/stage-builder-mvp-02-admin-code-status-view-001-*.txt`;
- implementation is under `apps/api`; `apps/admin` UI/scaffold remains untouched;
- no `V005` migration was added;
- generated-client status is an explicit no-op because no generator/artifacts exist.

Fresh `stage_verifier` is still required. This does not close `MVP-02.04`, full `MVP-02` or any human gate.
