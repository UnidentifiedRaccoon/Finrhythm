# Sprint contract: MVP-03-consent-version-logging-001

Stage: `mvp`
Parent unit: `MVP-03.03`
Status: `FROZEN`
Created: 2026-05-12
Owner role: stage_spec_freezer

## Purpose

Freeze the smallest backend/API-first slice that records draft legal/consent document version acceptance after the scoped `MVP-03-onboarding-privacy-screen-001` PASS.

This is a planning artifact only. It does not implement production code, rewrite evidence/verdict/problems aliases, claim Java-backed verification, approve legal wording, close full `MVP-03`, close the MVP stage, or close any human gate.

## Latest PASS State To Preserve

- Latest verified sprint remains `MVP-03-onboarding-privacy-screen-001` with scoped fresh verifier `PASS`.
- `MVP-03-onboarding-privacy-screen-001` proved only the draft employee-facing `/onboarding/privacy` screen and `/learning` handoff; it explicitly did not implement consent acceptance, consent version logging, backend/API/schema/OpenAPI/generated-client changes, diagnostics or routing.
- Full `MVP-03`, `MVP-04`, `MVP-06`, `MVP-07`, the MVP stage and all human gates remain open.
- Human gates remain open for legal/privacy wording, consent copy, real employee/customer data processing and customer-specific HR/reporting boundaries.
- Existing/user worktree changes are preserved. Do not revert unrelated dirty files or prior immutable evidence/verdict artifacts.

## Current Code Shape Confirmed By Freezer

- Backend baseline is `apps/api`: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Existing public registration API is `POST /api/v1/employee-registrations`.
- Registration response shape currently exposes `employeeRegistrationId`, `tenantId`, `pilotLaunchId`, `accessPoolId`, `inviteCodeId`, `registeredAt` and `idempotentRetry`.
- `employee_registrations` is the current employee identity anchor for this MVP slice; there is no `users` / `org_memberships` implementation yet.
- `SecurityConfig` is stateless, protects `/api/v1/admin/**` with admin bearer auth and permits other requests. There is no employee auth/session surface yet.
- At freeze time, `packages/api-client` was treated as no-op unless a generator existed. During build/fix, the current repo state includes a narrow generated contract package; this slice must therefore keep the legal acceptance OpenAPI snapshot, generator/drift checks and generated artifacts in sync rather than claiming no-op.
- Existing web privacy route is `apps/web/app/onboarding/privacy/page.tsx` rendering `OnboardingPrivacyScreen`.
- Current `/onboarding/privacy` copy explicitly says the screen is not consent acceptance, does not record consent versions and does not log consent.

## Source Refs

- `docs/stages/MVP.md`: `MVP-03.03` requires consent version logging; MVP-03 acceptance requires recorded/auditable consent versions and human-gated legal wording status.
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`: legal minimum includes privacy policy, personal data consent, terms, financial disclaimer and version logging.
- `docs/architecture/access-and-subscriptions.md`: current MVP may use `tenant`, `pilotLaunch`, `accessPool`, invite codes and registration without full org/subscription model; do not add `user.organization_id` or `pro_user` shortcuts.
- `docs/architecture/organization-access-subscription-model.md`: future identity model separates `User`, `Organization` and `OrgMembership`; invitation/code acceptance must not become unsafe password setup.
- `docs/engineering/human-gates.md`: legal/privacy/consent wording and real employee/customer data processing remain human-gated.
- `docs/architecture/documentation-workflow.md`: API/schema changes require OpenAPI/generated-client notes and a docs-sync decision.

## Affected IDs

- `MVP-03.03`
- `MVP-03-consent-version-logging-001`

## In Scope

- Add append-only backend persistence for an employee legal-document acceptance log.
- Use an append-only Flyway migration after current `V006`; expected next migration is `V007__legal_document_acceptance_log.sql` unless the builder finds a newer migration already present.
- Anchor each acceptance to existing `employee_registrations.id` and copy required tenant/pilot/access scope into the log if needed for audit queries.
- Record only draft document metadata needed for auditability:
  - document type;
  - document version;
  - acceptance timestamp;
  - employee registration id;
  - tenant/pilot launch/access pool scope;
  - minimal technical source such as `onboarding_privacy`;
  - optional request correlation/idempotency metadata if implemented without secrets or PII.
- Define the current draft allowlist in backend service/source code, not as final legal approval:
  - `PRIVACY_POLICY`;
  - `PERSONAL_DATA_CONSENT`;
  - `TERMS_OF_USE`;
  - `FINANCIAL_DISCLAIMER`.
- Expose a thin Spring controller/API surface to record acceptance of the current draft document/version set for an employee registration.
- Keep business rules in service/domain code, not in the controller.
- Support idempotent same-version retry: a retry for the same `employeeRegistrationId + documentType + documentVersion` must not create duplicate rows and should return an explicit idempotent result.
- Reject unknown document types, unsupported document versions, missing required current documents and unknown employee registrations with structured safe errors.
- Reflect the public API contract in OpenAPI/springdoc annotations and tests.
- Record generated-client status explicitly: update generated artifacts when a generator exists; otherwise record a no-op. For the current repo state, `packages/api-client` exists and must cover the legal acceptance contract.
- Add JUnit/Testcontainers coverage for Flyway migration, acceptance creation, same-version idempotency, unsupported document/version rejection and safe errors.
- Add a lightweight `apps/web` handoff from `/onboarding/privacy` only if current code can do it safely:
  - If a trustworthy `employeeRegistrationId` is available from an existing registration flow in the same user path, the builder may wire a minimal call surface and tests.
  - If no trustworthy identity/session bridge exists, the builder must keep the UI non-mutating/representational, avoid fake local identity, and record the backend integration gap honestly.
- Add focused web tests only for the touched handoff surface and no-consent-logging regressions.

## Out Of Scope

- Final legal approval for privacy, terms, consent, cookie or financial disclaimer wording.
- Production legal text approval or legal document content management.
- Cookie consent, unless a cookie/tracking surface already exists and is explicitly refrozen.
- Auth/session overhaul, login, password setup, user account model, `OrgMembership`, SSO/SCIM or organization subscription/seat work.
- Diagnostics questions, scoring, routing, route explanations, route persistence or diagnostic submission.
- Profile/contact update beyond using the existing `employeeRegistrationId` anchor.
- HR reporting, HR dashboard, analytics events, admin audit policy beyond the narrow append-only acceptance log.
- Real employee/customer/personal/financial data beyond existing synthetic registration test fixtures.
- Admin UI/CMS, content publishing, progress persistence, scored quiz submission, practice submission, points/wallet, rewards or merch.
- Generated TypeScript client implementation unless a real generator/artifact path exists.
- Closing full `MVP-03`, `MVP-04`, `MVP-06`, `MVP-07`, the MVP stage or any human gate.

## Acceptance Checklist

- Append-only Flyway migration creates the legal/consent document acceptance log without modifying prior migrations.
- Persistence stores one auditable row per accepted employee/document/version or an equally auditable append-only equivalent.
- The log is anchored to `employee_registrations.id` and preserves tenant/pilot launch/access pool context or proves it is recoverable without ambiguity.
- Backend allowlist includes the four draft document types: privacy policy, personal data consent, terms of use and financial disclaimer.
- API/service records acceptance for the current draft versions.
- Same-version retry is idempotent and does not create duplicate acceptance rows.
- Unknown document type, unsupported version, missing required document and unknown employee registration inputs are rejected with structured safe errors.
- API responses and errors do not echo raw invite codes, activation subject refs, full contact PII or legal text bodies.
- Controller remains thin; validation and idempotency rules live in service/domain layers.
- OpenAPI/springdoc source and runtime `/v3/api-docs` coverage include the new acceptance contract.
- Generated client decision is recorded: regenerate when a generator exists; otherwise record explicit no-op for `packages/api-client`. For this build, the generated-client artifacts and checks must include the legal acceptance endpoint.
- Web `/onboarding/privacy` either has a safe minimal acceptance handoff backed by a trustworthy registration identity or remains non-mutating with an explicit blocker/gap.
- Web UI does not imply final legal approval, completed diagnostics/routing or production-ready legal text.
- Tests use only synthetic/demo registration data and no real employee/customer data.
- Human gates remain open for legal/privacy wording and real-data processing.
- Full `MVP-03` and MVP stage remain open.
- Fresh verifier PASS is required before any implementation criterion is marked passing.

## Affected Files And Ownership

Expected backend/API files:

- `apps/api/src/main/resources/db/migration/V007__legal_document_acceptance_log.sql` or next append-only migration if `V007` is already taken.
- New `apps/api/src/main/java/com/finrhythm/api/consent/**` package or similarly narrow legal/consent package.
- Existing registration repository/service may be read or lightly extended only to resolve `EmployeeRegistration` by id.
- `apps/api/src/test/java/com/finrhythm/api/consent/**` or focused integration tests.
- OpenAPI annotations in the new controller/source.

Expected web files only if safe handoff is implemented or represented:

- `apps/web/components/onboarding-privacy-screen.ts`
- `apps/web/app/onboarding/privacy/page.tsx`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs` only if rendered behavior changes.

Expected generated-client files:

- `packages/api-client/**` when a generator exists and is run.
- Do not hand-write generated artifacts; record no-op evidence only if no generator/artifact path exists in the current repo state.

Stage artifacts owned by builder/verifier after implementation:

- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/evidence/MVP-03-consent-version-logging-001.md`
- `.agent/stages/mvp/evidence/MVP-03-consent-version-logging-001.json`
- `.agent/stages/mvp/verdicts/MVP-03-consent-version-logging-001.json`
- `.agent/stages/mvp/problems/MVP-03-consent-version-logging-001.md`

## Proof Plan For Builder

- JSON validation:
  - `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json .agent/stages/mvp/evidence.json .agent/stages/mvp/verdict.json`
- Backend:
  - `cd apps/api && ./mvnw -q test`
  - `cd apps/api && ./mvnw -q verify`
  - focused JUnit/Testcontainers tests for migration, API, OpenAPI and idempotency.
- Root wrappers when Java runtime is proven:
  - `make verify`
  - `make test-unit`
  - `make build`
- Web, only if `apps/web` changes:
  - `pnpm --filter @finrhythm/web typecheck`
  - `pnpm --filter @finrhythm/web test`
  - `pnpm --filter @finrhythm/web build`
  - browser/mobile smoke screenshots if user-visible behavior changes.
- Guardrail scans:
  - no raw invite code persistence or response echo;
  - no activation subject ref response echo;
  - no real employee/customer data in tests/fixtures/evidence;
  - no customer brand in employee-facing UI;
  - no final legal approval claim;
  - no diagnostics/routing completion claim;
  - no `user.organization_id`, `pro_user` or subscription/role shortcut.
- Harness:
  - `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
  - any active/latest alias mismatch while this sprint is only frozen must be reported honestly, not hidden by rewriting evidence/verdict aliases.

## Java Runtime Blocker / Proof Rule

Unqualified `java -version` has previously failed in this shell while Homebrew JDK 21 was available with explicit environment setup. The builder must record one of:

- explicit Java 21 proof with the exact `JAVA_HOME`/`PATH` used before Maven/root Java-backed verification; or
- a blocker stating Java is unavailable and therefore Java-backed checks were not run or claimed.

Do not claim `make verify`, Maven or backend PASS without Java runtime proof.

## Docs-Sync Targets Before Build

Default expected docs/API targets for this slice:

- Spring/OpenAPI source in `apps/api` is the API contract target.
- Generated-client target is `packages/api-client`; expected decision is regeneration/check evidence because the current repo state now contains a narrow generator/artifact surface.
- Stage evidence must record migration/API/OpenAPI/generated-client notes and human-gate status.
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` already states that legal versions are logged; no canonical product doc change is expected unless implementation changes that product decision.
- `docs/architecture/access-and-subscriptions.md` and `docs/architecture/organization-access-subscription-model.md` are guardrail docs only for this slice; do not change them unless the builder introduces user/org membership or access-model decisions.
- `docs/architecture/source-of-truth.md`, setup docs and stage docs should remain unchanged unless implementation discovers concrete drift.

Diagram expectation:

- Builder evidence must include a compact Mermaid flow/sequence for `privacy screen or registration handoff -> consent acceptance API -> append-only log -> idempotent retry/rejection`.
- Put the diagram in stage evidence unless a canonical doc is changed; if a canonical flow doc is updated, keep the diagram there and reference it from evidence.

## Evidence Handoff Required

The builder must record:

- changed files and explicit non-goals;
- current API shape used as identity anchor;
- DB migration notes and append-only/idempotency rationale;
- OpenAPI/runtime `/v3/api-docs` evidence;
- generated-client regeneration or no-op evidence;
- backend test commands and outputs;
- web commands/screenshots only if web behavior changes;
- guardrail scan evidence;
- docs-sync decision and Mermaid diagram reference;
- Java runtime proof or blocker;
- updated latest evidence aliases and immutable evidence refs;
- fresh verifier verdict/problems refs after implementation.

## Human Gates That Remain Open

- Legal/privacy wording and consent copy.
- Real employee/customer data processing.
- Customer-specific HR/reporting boundaries.
- HR/privacy wording review for diagnostics, self-assessment and reports.
- Final financial correctness of lessons, diagnostics, quizzes and explanations.
- Legal/tax review for tax wording.
- Reward economy, stock, prices and fulfillment.
- Support answer policy for sensitive topics.
- `production_ready` content approval.
- Admin auth/role/audit policy for production use.

## Freezer Handoff

This freezer changed only stage artifacts. It did not implement production code, schema, API, OpenAPI, generated clients or web behavior. Latest verified sprint remains `MVP-03-onboarding-privacy-screen-001` with scoped `PASS`.

The next owner should build exactly `MVP-03-consent-version-logging-001` or refreeze before implementation.
