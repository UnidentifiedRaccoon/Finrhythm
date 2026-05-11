# MVP-02.04 admin cohort/code status view spec freeze

Stage ID: `mvp`
Active slice: `MVP-02-admin-code-status-view-001`
Parent stage unit: `MVP-02.04`
Status: `FROZEN`
Frozen at: 2026-05-09
Freezer role: `stage_spec_freezer`

## Objective

Freeze the next narrow implementation slice for the admin-facing cohort/code status surface.

The smallest verifiable slice in the current repo is backend/admin API only. `apps/admin` currently contains only `apps/admin/AGENTS.md` and no Next.js app baseline, while `apps/api` already has the Spring Boot/Flyway/OpenAPI registration and invite-code model needed to power the view. Building the admin UI and scaffolding the admin app in the same contract would mix an app-bootstrap slice with the cohort/code status contract.

This freeze therefore owns a read-only admin API contract that returns the data needed for a future admin cohort/code status view and activation funnel. It does not implement `apps/admin` UI, screenshots, browser evidence, admin auth/session, HR reporting exports or full MVP-02 closure.

## Source baseline

This freeze reconciles:

- current repo state on 2026-05-09;
- `AGENTS.md`;
- `.agents/skills/stage-launch-proof-loop/SKILL.md`;
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/engineering/definition-of-done.md`;
- `docs/engineering/human-gates.md`;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `docs/stages/MVP.md` only for stage docs;
- `apps/admin/AGENTS.md`;
- `apps/api/AGENTS.md`;
- prior MVP-02 task files:
  - `.agent/stages/mvp/task-files/MVP-02-tenant-domain-001.md`;
  - `.agent/stages/mvp/task-files/MVP-02-invite-issuance-activation-001.md`;
  - `.agent/stages/mvp/task-files/MVP-02-employee-registration-001.md`;
- current `MVP-02-employee-registration-001` fresh verifier PASS in `.agent/stages/mvp/verdict.json` and `.agent/stages/mvp/problems.md`;
- current backend baseline in `apps/api`:
  - Spring Boot 3.3 / Java 21 / Maven Wrapper;
  - PostgreSQL/Flyway migrations `V001` through `V004`;
  - tenant, cohort/wave, invite code and employee registration JPA/domain model;
  - invite issuance/activation service with opaque non-PII `activation_subject_ref`;
  - public employee registration OpenAPI/springdoc source;
  - `packages/api-client` still has no generated client pipeline;
- current `apps/admin` baseline:
  - local operator-surface rules exist;
  - no Next.js app, route, package or screenshotable admin UI exists yet.

## Scope decision

Freeze backend/admin API-only first.

Rationale:

- `MVP-02.04` needs cohort/code status data before a useful admin UI can be built.
- A real admin UI slice would first require introducing the `apps/admin` Next.js app baseline, package scripts and browser evidence. That is a larger app-bootstrap slice and should be frozen separately.
- The current API has enough domain data to prove the admin status/funnel contract without introducing UI risk or real data.

This task can support the future admin view but does not itself close the UI part of `MVP-02.04`.

## In scope

- Read-only backend admin API surface for one tenant/cohort.
- A single status/funnel endpoint, unless implementation proves a second small list endpoint is materially simpler:
  - preferred path: `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`.
- Response data required for the future admin view:
  - tenant and cohort identifiers;
  - cohort key, name, kind, status and target size;
  - status counts for invite codes;
  - funnel counts: target size, issued codes, activated codes, registered employees, revoked/expired/unissued-style operational counts when available;
  - paginated code rows with `inviteCodeId`, status, issued/expiry/activation timestamps and registration presence/timestamp;
  - no raw invite-code value.
- Optional query parameters if implemented as one endpoint:
  - `status`;
  - `page`;
  - `size` with a bounded maximum suitable for Wave 1 pagination.
- Service/repository read model or projection for aggregation and pagination.
- OpenAPI/springdoc source for the admin endpoint and response schema.
- Tests proving Wave 1 scale with 500 synthetic invite records and mixed activation/registration states.
- Generated-client handoff note:
  - regenerate only if a generator exists or is introduced by the builder;
  - otherwise record an explicit no-op because `packages/api-client` has no generation pipeline yet.
- Stage evidence plan and future raw refs for commands, OpenAPI inspection, privacy scans, and fresh verification.

## Out of scope

- `apps/admin` Next.js app scaffold, pages, components, browser screenshots or UI implementation.
- Admin operator copy; a later UI slice must use Russian copy and screenshot/browser evidence.
- Admin actions to create tenants/cohorts, issue/generate invite batches, revoke codes or mutate statuses.
- Employee-facing UI, onboarding, privacy screen, consent version logging or legal document approval.
- Full auth/session, passwords, SSO, SCIM, role/permission model or admin audit logs.
- HR/sponsor dashboard, exports, reporting thresholds, diagnostic insights, learning analytics or pilot outcome report.
- Raw invite-code display, lookup hashes, activation subject refs, full employee name/email/phone in the status response.
- Diagnostics answers, weak zones, exact financial data, points, rewards, merch, support and feedback.
- Real customer brand in employee-facing surfaces or real employee/customer/personal/financial data in code, tests, fixtures, logs or evidence.
- Final human approval for customer-specific reporting, privacy/legal wording, real data processing or production admin access.

## Frozen API shape

Preferred endpoint:

- `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`

Request:

- `tenantId`: required UUID path parameter;
- `cohortId`: required UUID path parameter;
- `status`: optional invite-code status filter using the backend enum values;
- `page`: optional non-negative page number;
- `size`: optional page size with a bounded maximum.

Success response:

- `tenantId`;
- `cohortId`;
- `cohortKey`;
- `cohortName`;
- `cohortKind`;
- `cohortStatus`;
- `targetSize`;
- `summary`:
  - `issuedCount`;
  - `activatedCount`;
  - `registeredCount`;
  - `revokedCount`;
  - `expiredCount`;
  - `totalCodeCount`;
  - `remainingCapacity`;
- `statusCounts`: list of `{ status, count }`;
- `codes`: page object with rows:
  - `inviteCodeId`;
  - `status`;
  - `issuedAt`;
  - `expiresAt`;
  - `activatedAt`;
  - `registeredAt`;
  - `registered`.

Error behavior:

- tenant/cohort not found returns a structured 404 without leaking unrelated tenant/cohort existence;
- tenant/cohort mismatch returns the same safe not-found style response;
- invalid query parameters return structured 400;
- responses never echo raw invite codes, lookup hashes, activation subject refs, fullName, email, phone, diagnostic answers or financial data.

## Acceptance criteria

1. Backend baseline remains Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
2. The slice is backend/admin API-only; `apps/admin` UI remains untouched except for reading `apps/admin/AGENTS.md`.
3. Endpoint returns cohort metadata, invite-code status counts, activation/registration funnel counts and paginated per-code operational rows for one tenant/cohort.
4. Wave 1 scale is proven with 500 synthetic invite codes and mixed `ISSUED` / `ACTIVATED` / registered states.
5. Status filtering and pagination are deterministic and bounded; unbounded 500-row payloads are not the only way to inspect a Wave 1 cohort.
6. Privacy guardrails hold: response and logs do not include raw invite codes, lookup hashes, activation subject refs, employee fullName/email/phone, diagnostic answers, weak zones or financial data.
7. No real employee/customer data, real customer brand or production invite values are used in tests, fixtures, logs or raw evidence.
8. Controllers remain thin; aggregation and privacy filtering live in service/read-model code or repository projections.
9. DB changes are avoided unless necessary; any DB change must be append-only after `V004` and limited to safe read indexes or view-supporting constraints.
10. OpenAPI/springdoc source represents the admin endpoint, query parameters, response schema, safe errors and privacy-safe examples.
11. Generated-client status is handled honestly: regenerate if a generator exists, or record explicit no-op if `packages/api-client` still has no generator/artifacts.
12. Evidence maps every criterion to raw refs for git status, Java/Maven/root commands, API tests, OpenAPI inspection, generated-client/no-op note, privacy/PII/raw-code scans, harness validation and fresh verifier verdict.
13. Human gates remain open: legal/privacy wording, real employee/customer data processing, customer-specific HR/reporting boundaries, admin auth/role policy and production use of real admin data are not marked DONE.

## Verification plan

Builder must run and record raw outputs:

- `git status --short`;
- `java -version`;
- `cd apps/api && ./mvnw -v`;
- `cd apps/api && ./mvnw -q test`;
- `cd apps/api && ./mvnw -q verify`;
- `make verify`;
- `make test-unit`;
- `make build`;
- API/read-model tests for 500-code Wave 1 cohort, mixed status counts, activated/registered funnel counts, status filter, pagination, not-found/mismatch and validation errors;
- migration inspection proving no DB migration or only append-only post-`V004` index migration if needed;
- OpenAPI/springdoc endpoint/schema inspection for the admin status endpoint;
- generated-client regeneration output or explicit no-op note;
- privacy scan proving no raw invite code, lookup hash, activation subject ref, employee contact fields, diagnostic/financial data, real customer brand or real data in response examples/tests/evidence;
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`;
- fresh `stage_verifier` scoped only to `MVP-02-admin-code-status-view-001`.

Expected future raw refs should be stored under `.agent/stages/mvp/raw/` with the `stage-builder-mvp-02-admin-code-status-view-001-*` and `stage-verifier-mvp-02-admin-code-status-view-001-*` prefixes or an equally specific immutable naming pattern.

## Docs targets

- API contract source in `apps/api` through Spring/springdoc annotations/configuration.
- Generated-client notes in the slice evidence/task handoff; generated artifacts may only be updated from source.
- Stage artifacts:
  - `.agent/stages/mvp/stage_spec.md`;
  - `.agent/stages/mvp/sprint_contract.md`;
  - `.agent/stages/mvp/task-files/MVP-02-admin-code-status-view-001.md`;
  - `.agent/stages/mvp/backlog.md`;
  - `.agent/stages/mvp/feature_list.json`;
  - `.agent/stages/mvp/progress.md`;
  - `.agent/stages/mvp/status.json`;
  - `.agent/stages/mvp/decisions.md`;
  - `.agent/stages/mvp/risks.md`;
  - future `.agent/stages/mvp/evidence.*`;
  - future `.agent/stages/mvp/verdict.*`;
  - future `.agent/stages/mvp/problems.*`.
- No canonical product/stage doc change is expected unless builder discovers a contradiction or expands accepted behavior.
- `apps/admin` documentation or setup docs are not targets in this backend-only slice.

## Diagram expectations

Builder must add a small Mermaid sequence or flow diagram in the task/evidence handoff for:

`Admin status request -> controller -> admin read service -> cohort/invite/registration read model -> privacy-safe aggregation -> OpenAPI response`.

No browser/UI diagram is required because this freeze intentionally excludes `apps/admin` UI. If builder adds UI anyway, that is scope drift and requires re-freeze before implementation.

## Human gates

No human gate is closed by this freeze.

The following remain `WAITING_HUMAN` or out of scope:

- legal/privacy wording and consent copy;
- real employee/customer data processing;
- customer-specific HR/reporting boundaries;
- admin auth/role/audit policy for production;
- any request to expose personal employee contact fields, financial answers or diagnostic weak zones in sponsor/admin reports.
