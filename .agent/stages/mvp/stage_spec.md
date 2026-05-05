# MVP-02.02 invite issuance/activation spec freeze

Stage ID: `mvp`  
Completed slice: `MVP-02-invite-issuance-activation-001`  
Parent stage unit: `MVP-02.02`  
Status: `PASS`
Frozen at: 2026-05-04  
Freezer role: `stage_spec_freezer`

## Objective

Freeze the next small MVP-02 slice after `MVP-02-tenant-domain-001` PASS: backend invite code issuance, activation and one-user binding core.

This slice turns the existing tenant/cohort/invite persistence model into a tested service-level workflow that can later be called by employee registration and admin surfaces. It intentionally does not implement employee registration by name/email/phone, admin UI, HR reporting, auth/session, points, rewards or customer-branded employee UI.

## Source baseline

This freeze reconciles:

- current repo state and runnable baseline on 2026-05-04;
- `AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `docs/stages/MVP.md`;
- `.agents/skills/stage-launch-proof-loop/SKILL.md`;
- `.agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md`;
- `.agents/skills/stage-launch-proof-loop/references/COMMANDS.md`;
- `.agent/stages/mvp/progress.md`;
- `.agent/stages/mvp/feature_list.json`;
- `.agent/stages/mvp/sprint_contract.md`;
- `.agent/stages/mvp/evidence.md`;
- `.agent/stages/mvp/verdict.json`;
- `.agent/stages/mvp/problems.md`;
- `.agent/stages/mvp/decisions.md`;
- `.agent/stages/mvp/risks.md`;
- `.agent/stages/mvp/status.json`;
- `apps/api/AGENTS.md`;
- current `apps/api` migration/domain/test files.

## Current repo constraints

- `MVP-02-tenant-domain-001` has fresh verifier `PASS` for `MVP-02.01` only.
- `MVP-02.02`, `MVP-02.03`, `MVP-02.04` and full `MVP-02` remain open.
- Current baseline checks recorded by the orchestrator:
  - `java -version`: PASS, Temurin 21.0.11;
  - `cd apps/api && ./mvnw -v`: PASS, Maven 3.9.9 with Java 21.0.11;
  - `make verify`: PASS;
  - `git status --short`: dirty from prior stage work and current stage artifacts.
- `apps/api` currently has no REST controller, no OpenAPI surface and no generated TypeScript client.
- Existing invite persistence from `V002` stores only `lookup_hash`, not raw invite codes.
- Existing invite lifecycle states are `CREATED`, `ISSUED`, `RESERVED`, `ACTIVATED`, `REVOKED`, `EXPIRED`.
- Current `invite_codes` schema does not yet record an activation subject/user binding; this slice may add it through append-only migration.

## In scope

- Add the narrow backend service/domain workflow for invite code issuance and activation.
- Add append-only Flyway migration(s) after `V002` if needed for:
  - issuance batch metadata or issuance audit fields;
  - one-user activation binding using an opaque non-PII subject identifier;
  - idempotency/uniqueness constraints needed to prevent duplicate issuance or double activation.
- Generate human-enterable invite codes with cryptographically strong randomness.
- Persist only a normalized lookup hash and non-sensitive operational metadata. Raw/plain invite codes may be returned only as one-time command/service output and must not be stored in database, fixtures, logs or stage artifacts.
- Support issuing up to a Wave 1 batch of 500 codes for an existing tenant/cohort without implementing admin UI.
- Implement activation lookup by submitted code, with normalization and hash comparison.
- Bind an activated code to exactly one opaque subject/user reference and make same-subject retries idempotent.
- Reject invalid, expired, revoked, unissued or already-activated-by-another-subject codes with understandable domain errors.
- Add unit and PostgreSQL/Testcontainers tests for issuance, activation, idempotency, uniqueness and guardrails.
- Update canonical docs only if setup/runtime/API/workflow behavior changes; otherwise record explicit no-doc-change reasoning in evidence.
- Update stage evidence after builder work and require one fresh verifier pass before marking `MVP-02.02` complete.

## Out of scope

- Completing all of MVP-02.
- Employee registration by name/email/phone/code.
- Storing employee name, email, phone or personal finance data.
- Login/session/auth, corporate SSO, SCIM or password/account lifecycle.
- Public REST/OpenAPI/controller surface for issuance or activation in this slice.
- Admin UI for cohorts, code statuses or activation funnel.
- HR dashboard/reporting, event taxonomy implementation or analytics pipeline.
- Employee-facing web UI, onboarding/privacy UI or customer-branded UI.
- Generating real production/customer invite codes.
- Persisting raw/plain invite codes.
- Points, wallet, money, billing, subscription, rewards or merch.
- Legal/privacy/consent wording.
- Real customer, employee, personal or financial data.

## Acceptance criteria

1. Pre-implementation baseline is recorded: `git status --short`, `java -version`, `cd apps/api && ./mvnw -v`, and `make verify`.
2. Builder changes only the owned backend/domain/test/docs artifact surface for this sprint contract.
3. Flyway changes are append-only after `V002`; `V001` and `V002` are not modified.
4. Issuance can create a requested batch for an existing tenant/cohort, including a Wave 1 batch size of 500 in tests or faithful service proof.
5. Generated codes have enough randomness for invite-code use, are human-enterable, normalized for lookup and never persisted raw.
6. Database persistence stores unique lookup hashes and no raw/plain invite-code column.
7. Activation validates submitted codes by hash and rejects invalid, expired, revoked, unissued or duplicate activation paths.
8. One-user binding is enforced with an opaque non-PII subject identifier; the same subject retry is idempotent and a different subject cannot claim an activated code.
9. Race/concurrency or database-constraint tests prove a code cannot be activated twice.
10. Tests use PostgreSQL/Testcontainers or a faithful documented substitute for persistence-critical paths.
11. No employee registration, contact fields, admin UI, HR reporting, public REST/OpenAPI/controller surface or generated client is implemented.
12. No real customer, employee, personal or financial data appears in code, tests, fixtures, logs or evidence.
13. No points, money, billing, subscription, rewards or merch concepts are added.
14. Relevant commands pass: `cd apps/api && ./mvnw -q test`, `cd apps/api && ./mvnw -q verify`, `make verify`, `make test-unit`, and `make build`, or exact blockers are recorded.
15. Documentation sync is explicit: canonical docs updated only if behavior/setup/API/workflow changes; otherwise evidence states why no canonical doc changed.
16. Builder evidence maps every acceptance criterion and includes raw command output references.
17. A fresh `stage_verifier` reviews only `MVP-02-invite-issuance-activation-001` and returns PASS before `MVP-02.02` or this sprint is marked complete.

## Verification plan

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- SQL/Flyway inspection proving append-only migration order and no raw invite-code persistence.
- Targeted guardrail scan for `raw_code`, `plain_code`, contact data, points, money, billing, rewards, controllers and OpenAPI/client drift.
- Fresh `stage_verifier` scoped only to `MVP-02-invite-issuance-activation-001`.

## Docs targets

- Stage artifacts: always update `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/evidence.json`, raw outputs, `progress.md`, `status.json`, `feature_list.json`, `decisions.md` and `risks.md`.
- Canonical docs: update only if the builder changes setup/runtime expectations, API contract, developer workflow or canonical architecture decisions.
- API/OpenAPI: not expected because this slice excludes public REST/controller surface. If a builder finds a REST/API change unavoidable, stop and re-freeze rather than silently widening scope.

## Human gates

No human gate can be closed by this slice. It does not approve legal wording, customer-specific reporting, reward economy, public brand, real customer data or real fulfillment operations.

## Current outcome

Scope was frozen, implemented and freshly verified for `MVP-02-invite-issuance-activation-001`. Current evidence proves only `MVP-02.02`; `MVP-02.03`, `MVP-02.04` and full MVP-02 remain open.
