# Task file: MVP-03-consent-version-logging-001

Stage: `mvp`
Parent unit: `MVP-03.03`
Status: `FROZEN`
Owner role: stage_spec_freezer
Created: 2026-05-12

## Objective

Implement one narrow technical foundation for draft consent/legal document version logging after the verified `/onboarding/privacy` screen.

The slice is backend/API-first. A web handoff from `/onboarding/privacy` is allowed only if current code can provide a trustworthy employee registration identity without inventing auth/session behavior.

## Current State Preserved

- Latest verified sprint remains `MVP-03-onboarding-privacy-screen-001` with scoped fresh verifier `PASS`.
- Current privacy screen is static and explicitly says it does not accept consent, record consent versions or log consent.
- Current registration API returns `employeeRegistrationId`, `tenantId`, `pilotLaunchId`, `accessPoolId`, `inviteCodeId`, `registeredAt` and `idempotentRetry`.
- There is no employee auth/session implementation; only `/api/v1/admin/**` has admin bearer protection.
- At freeze time, `packages/api-client` was treated as no-op unless a generator existed. During build/fix, the current repo state includes a narrow generated contract package, so this slice must keep legal acceptance OpenAPI snapshot, generator/drift checks and generated artifacts in sync.
- Full `MVP-03`, MVP stage and all human gates remain open.

## In Scope

- Append-only Flyway migration for legal/consent document acceptance log.
- Backend service/domain rules for current draft document/version allowlist:
  - `PRIVACY_POLICY`;
  - `PERSONAL_DATA_CONSENT`;
  - `TERMS_OF_USE`;
  - `FINANCIAL_DISCLAIMER`.
- API endpoint/controller surface to record acceptance for an existing `employeeRegistrationId`.
- Idempotent same-version retry without duplicate acceptance rows.
- Structured rejection for unknown document type, unsupported version, missing required document and unknown registration.
- OpenAPI/springdoc source and runtime `/v3/api-docs` test coverage.
- JUnit/Testcontainers coverage for migration, persistence, API, idempotency and rejection paths.
- Generated-client regeneration only if a generator exists; otherwise explicit no-op evidence.
- Minimal `/onboarding/privacy` handoff/test surface only if safe with existing identity flow; otherwise non-mutating UI and explicit blocker/gap.

## Out Of Scope

- Final legal approval or production legal text approval.
- Cookie consent.
- Auth/session overhaul, login, password setup, `User`, `OrgMembership`, SSO/SCIM, subscription or seat model.
- Diagnostics/routing, profile/contact update, HR reporting, admin audit policy beyond the narrow append-only log.
- Real employee/customer/personal/financial data beyond synthetic registration fixtures.
- CMS/admin publishing, progress persistence, scored submissions, practice submission, points/wallet, rewards or merch.
- Hand-written generated client artifacts.
- Closing full `MVP-03`, MVP stage or human gates.

## Acceptance

- Migration is append-only and creates the acceptance log without editing prior migrations.
- Acceptance rows are anchored to `employee_registrations.id` and preserve or unambiguously recover tenant/pilot/access-pool scope.
- Current draft legal document types and versions are allowlisted in backend code/tests.
- First acceptance creates auditable log rows; same-version retry is idempotent.
- Unsupported document/version and unknown employee registration inputs fail safely.
- API responses do not echo raw invite codes, activation subject refs, full contact PII or legal text bodies.
- Controller remains thin.
- OpenAPI includes the new contract.
- Generated-client decision is recorded honestly.
- Web does not perform unsafe acceptance without a trustworthy registration/session bridge.
- Human gates for legal wording and real-data processing stay open.
- Fresh verifier PASS is required before implementation is marked passing.

## Required Validation

- `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json .agent/stages/mvp/evidence.json .agent/stages/mvp/verdict.json`
- `git diff --check -- <changed files>`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`, `make test-unit`, `make build` when Java runtime proof exists.
- If `apps/web` changes: `pnpm --filter @finrhythm/web typecheck`, `test`, `build`, plus browser/mobile screenshot evidence for changed user-visible behavior.
- Guardrail scans for raw invite code, activation subject ref, real data, customer brand, final legal approval claim, diagnostics/routing completion claim and `user.organization_id`/`pro_user` shortcuts.
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- Java 21 runtime proof or explicit blocker before any Maven/root Java-backed PASS claim.

## Docs And Diagram Handoff

- API source target: Spring/OpenAPI annotations in `apps/api`.
- Generated-client target: `packages/api-client`; regenerate/check legal acceptance artifacts when the generator exists, otherwise record no-op.
- Canonical product/access docs should remain unchanged unless builder finds concrete drift.
- Builder evidence must include a compact Mermaid flow for acceptance API, append-only log, idempotent retry and rejection paths.

## Handoff Notes

Do not edit or read `.agent/stages/**/raw/**` during freeze. Builder/verifier may create new raw evidence later, but tracked evidence must summarize commands, outcomes, docs-sync and human gates.
