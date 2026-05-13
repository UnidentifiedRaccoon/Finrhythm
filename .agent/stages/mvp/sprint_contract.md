# Sprint contract: MVP-03-profile-session-legal-acceptance-ui-001

Stage: `mvp`
Parent units: `MVP-03.03`, `MVP-03.04`
Related human-gated unit: `MVP-03.01`
Status: `FROZEN`
Proof status: `VERIFIED_PASS`
Functional passes: `true`
Created: 2026-05-13
Owner role: `stage_builder`

## Purpose

Add the smallest runnable employee-facing legal acknowledgement and acceptance step inside the existing `apps/web` profile-session flow.

The implemented route must keep the already verified path:

`/start -> /onboarding/privacy -> /profile/session`

Then, after `/profile/session` successfully creates the temporary profile session, the UI must show a draft legal document acknowledgement/acceptance step. The step must use `employeeRegistrationId` from the profile-session response, POST the current draft legal document versions through the existing generated `@finrhythm/api-client` `fetchLegalDocumentAcceptance` helper, and only after a successful legal acceptance open the existing contact update screen.

This is a functional web UI slice. It is not a docs-only, evidence-only, harness-cleanup, closure-audit, backend, schema, OpenAPI or generated-client source slice.

## Baseline And Source Refs

- Latest verified sprint: `MVP-03-employee-start-route-ui-001` = `PASS`.
- Verified current route path: `/start -> /onboarding/privacy -> /profile/session`.
- Current `apps/web` behavior: `/profile/session` creates a temporary profile session with generated `fetchEmployeeProfileSession`, keeps `profileSessionToken` only in mounted React component memory, and then opens `ProfileContactScreen`.
- Existing `/profile/contact` safe state: direct route open does not accept `profileSessionToken` from URL/query/hash/path and links back to `/profile/session`.
- Existing generated client contract already exports:
  - `fetchLegalDocumentAcceptance`;
  - `LEGAL_DOCUMENT_TYPES`;
  - `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`;
  - `LegalDocumentAcceptanceRequest`;
  - `LegalDocumentAcceptanceResponse`.
- `docs/stages/MVP.md`: MVP-03 requires trust/privacy, consent version logging and profile/contact basics; legal wording remains human-gated.
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`: MVP is B2B-first mobile web; employee UI is neutral; customer brand is not used; privacy separates operational data from sensitive learning/financial data.
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`: mobile-first, calm first, one screen/one thought, visible privacy copy, privacy-card patterns, neutral employee UI.
- `apps/web/AGENTS.md`: profile/settings flows are critical and require focused tests plus browser smoke/screenshots.
- Backend baseline remains explicit and unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

Do not read `.agent/stages/**/raw/**` for this slice unless a later verifier problem names an exact raw ref.

## Affected IDs

- `MVP-03.03`
- `MVP-03.04`
- `MVP-03-profile-session-legal-acceptance-ui-001`
- `MVP-03.01` remains `DONE_WITH_HUMAN_PENDING` / human-gated for legal wording.
- Full `MVP-03` remains open.
- MVP stage remains open.

## Builder First Touch Requirement

After this freeze, the first meaningful build step must edit production or test code, not `.agent`, docs, evidence or harness files.

Expected first-touch targets:

- production web flow: `apps/web/components/profile-session-entry-screen.ts`;
- optional focused helper/component files under `apps/web/components` or `apps/web/lib`;
- focused web tests: `apps/web/tests/learning-shell.test.mjs`;
- browser smoke: `apps/web/tests/browser-smoke.mjs`;
- `apps/web/app/globals.css` only if existing profile/privacy styles cannot support the acknowledgement step.

Stage/evidence/status artifacts may be updated only after production/test changes and local proof exist.

## In Scope

- Keep `/start -> /onboarding/privacy -> /profile/session` as the entry route.
- Keep the existing `/profile/session` form and `fetchEmployeeProfileSession` proof flow.
- After a successful profile-session response, do not immediately render `ProfileContactScreen`.
- Add a draft legal document acknowledgement/acceptance step before contact update.
- Use only response data already returned by the temporary profile-session proof:
  - `profileSessionToken` stays only in component memory;
  - `employeeRegistrationId` is used only for the legal acceptance POST path and in-memory flow state;
  - non-secret session metadata may be used for state handoff without visible raw IDs.
- Use generated `@finrhythm/api-client` exports for legal acceptance:
  - `fetchLegalDocumentAcceptance`;
  - `LEGAL_DOCUMENT_TYPES`;
  - `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`;
  - generated request/response types where types are needed.
- POST every current draft legal document type from `LEGAL_DOCUMENT_TYPES` with `documentVersion: LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`.
- Include a stable non-sensitive `source`, for example `web_profile_session`.
- Show Russian, neutral, mobile-first acknowledgement copy that makes the draft/human-gated status visible.
- State that legal/privacy wording is a draft pending human/legal review; do not claim final legal approval.
- Only after successful legal acceptance render the existing `ProfileContactScreen` with `initialProfileSessionToken`.
- Preserve existing profile/contact update behavior, validation and safe missing-session direct route state.
- Add focused tests for:
  - legal step renders after successful profile-session proof;
  - contact screen is not opened before legal acceptance success;
  - generated legal acceptance client helper/types are used;
  - current draft document types/version are posted;
  - legal acceptance failure does not echo invite code, token, employeeRegistrationId or contact fields.
- Add browser smoke with mocked API calls proving the route:

`/start -> /onboarding/privacy -> /profile/session -> create temporary profile session -> legal acknowledgement -> POST legal acceptance -> existing contact update screen`

- Use only synthetic/local/browser-smoke data.

## Out Of Scope

- Closure audit for full `MVP-03` or the MVP stage.
- Docs/artifacts-only progress.
- Backend/API/schema/Flyway/OpenAPI/generated-client source changes.
- Manual edits to generated contract artifacts.
- New legal document backend behavior, legal document CMS, document download UI or real document publishing workflow.
- Final legal/privacy/terms/consent/financial-disclaimer approval claim.
- New auth platform, login/password, password setup, account recovery, persistent auth, SSO/SCIM or session cookies.
- `User`, `users.organization_id`, `OrgMembership`, invitations beyond existing proof, organization codes, subscriptions, seats, entitlement resolver, `pro_user`, `premium`, paywall or billing.
- Diagnostics/scoring/routing, HR reporting, points, CMS, rewards, merch, support tickets or admin flows.
- Passing `profileSessionToken` through URL/query/hash/path, `localStorage`, `sessionStorage`, cookies, IndexedDB, fixtures, screenshots, logs or evidence.
- Storing legal acceptance state, profile-session token, invite code or secrets in browser storage/cookies/IndexedDB.
- Displaying raw invite code, raw profile-session token or raw employeeRegistrationId in UI, screenshots or evidence.
- Raw invite-code echo in errors, screenshots, logs or evidence.
- Real employee/customer/personal/financial data in source, tests, fixtures, screenshots, logs or evidence.
- Customer brand in employee-facing UI.
- Financial promises, guaranteed results, quick income, risk-free claims or guaranteed debt-relief claims.
- Required exact sums, photos, documents, bank screenshots or personal finance reports.

## Acceptance Checklist

- `/profile/session` still creates the temporary profile session through generated `fetchEmployeeProfileSession`.
- After successful profile-session proof, `/profile/session` shows a legal acknowledgement/acceptance step before any contact update screen is opened.
- Browser/API mock proof shows no `/api/v1/employee-registrations/me/profile-summary` request before legal acceptance succeeds.
- The legal step is Russian, mobile-first, neutral, privacy-aware and contains no customer brand.
- The legal step clearly says the legal wording/documents are draft and human/legal review remains pending.
- The legal step does not claim final legal approval, production legal readiness or real personal-data processing approval.
- The legal step uses `LEGAL_DOCUMENT_TYPES` and `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION` from `@finrhythm/api-client`.
- The legal step POSTs through generated `fetchLegalDocumentAcceptance`, not ad hoc `fetch` URL construction.
- The POST uses `employeeRegistrationId` from the profile-session response and sends all current draft document versions.
- `profileSessionToken` remains only in mounted React component memory and is never sent to the legal acceptance endpoint.
- The existing contact update screen opens only after successful legal acceptance.
- Direct `/profile/contact` still shows the safe missing-session state.
- Legal acceptance loading, retry and failure states are understandable and safe.
- Errors do not echo invite code, raw profile-session token, raw employeeRegistrationId, name, email or phone.
- No secrets/tokens appear in URL/query/hash/path, storage, cookies, IndexedDB, fixtures, screenshots, logs or evidence.
- No raw invite-code echo appears in UI errors, screenshots, logs or evidence.
- No real employee/customer/personal/financial data appears in source, tests, fixtures, screenshots, logs or evidence.
- Existing `/start` and `/onboarding/privacy` behavior remains intact.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Canonical docs are updated only if the builder changes product/access/API/setup behavior beyond this already scoped legal acceptance step. Otherwise evidence records `NOOP_EXPECTED`.
- Mermaid diagram expectation is decided before build and recorded in evidence.
- Functional `passes=false` remains until builder evidence and a fresh `stage_verifier` PASS exist.

## Required Validation

The builder must run and record:

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Browser/mobile smoke and screenshots for:
  - `/start`;
  - `/onboarding/privacy` after primary navigation;
  - `/profile/session` form;
  - legal acknowledgement step after successful profile-session proof;
  - legal acceptance loading/success path;
  - existing contact update screen after legal acceptance success;
  - direct `/profile/contact` safe missing-session state.
- Browser/API mock assertions proving:
  - profile session POST happens first;
  - legal acceptance POST happens after profile-session success;
  - contact profile summary request happens only after legal acceptance success;
  - legal acceptance URL contains only the synthetic `employeeRegistrationId` path parameter, never the profile-session token or invite code.
- Guardrail scans for:
  - token storage through `localStorage`, `sessionStorage`, cookies and IndexedDB;
  - token leakage through URL/query/hash/path;
  - token routing or handoff to `/profile/contact`;
  - token leakage to legal acceptance request;
  - raw profile-session token leakage;
  - raw invite-code echo;
  - raw employeeRegistrationId visible UI/screenshot/evidence echo beyond synthetic API path proof;
  - real employee/customer/personal/financial data;
  - customer brand in employee-facing UI;
  - forbidden financial claims;
  - final legal approval claims.
- Generated-client boundary checks proving:
  - `/profile/session` still consumes generated profile-session helpers/types;
  - legal acceptance uses generated `fetchLegalDocumentAcceptance`, `LEGAL_DOCUMENT_TYPES` and `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`;
  - no manual legal acceptance request type or hardcoded legal acceptance URL is introduced in `apps/web`.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`
- Root wrappers if feasible:
  - `make verify`;
  - `make test-unit`;
  - `make build`.
- If any root wrapper is not feasible, record the precise environment limitation and narrower passing checks.
- Fresh `stage_verifier` after builder evidence before any PASS claim.

## Evidence Handoff Required

The future builder must record:

- exact `apps/web` production/test/browser-smoke files changed;
- route proof for `/start -> /onboarding/privacy -> /profile/session -> legal acknowledgement -> contact update`;
- screenshot refs for all required browser states;
- command outcomes with raw refs under `.agent/stages/mvp/raw/`;
- browser/API mock proof for profile-session, legal acceptance and contact-summary ordering;
- legal acceptance payload proof using all `LEGAL_DOCUMENT_TYPES` with `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`;
- proof that `fetchLegalDocumentAcceptance` is used from generated `@finrhythm/api-client`;
- guardrail scan results proving no unsafe token storage, token URL/storage/cookie leakage, token handoff to `/profile/contact`, token leakage to legal acceptance, raw invite echo, visible raw employeeRegistrationId echo, real data, customer brand, forbidden claims or final legal approval claims;
- docs-sync decision and diagram decision;
- backend baseline unchanged note;
- human-gate table preserving `WAITING_HUMAN` / `DONE_WITH_HUMAN_PENDING`;
- immutable evidence/verdict/problems refs for `MVP-03-profile-session-legal-acceptance-ui-001`;
- fresh verifier verdict before any PASS claim.

## Doc Targets And Diagram Expectations

- Canonical docs target: `NOOP_EXPECTED` if the builder only consumes the existing generated legal acceptance contract and implements the already-scoped MVP-03 consent/legal acceptance step in `apps/web`.
- Canonical docs update is required if the builder changes product/access/API/setup behavior beyond this contract. Narrow targets would be:
  - `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` for product flow or legal-document-set behavior changes;
  - `docs/architecture/access-and-subscriptions.md` for access/session boundary changes;
  - Spring/OpenAPI/generated client source only if backend/API contract changes become unavoidable.
- Product/design docs target: `NOOP_EXPECTED`; use existing product foundation and design-system baselines.
- Stage artifact targets after implementation:
  - `.agent/stages/mvp/evidence/MVP-03-profile-session-legal-acceptance-ui-001.{md,json}`;
  - `.agent/stages/mvp/verdicts/MVP-03-profile-session-legal-acceptance-ui-001.json`;
  - `.agent/stages/mvp/problems/MVP-03-profile-session-legal-acceptance-ui-001.md`;
  - compact aliases only after evidence and fresh verification.
- Mermaid expectation: `EXPECTED_IN_EVIDENCE`. Add a small sequence or state diagram showing profile-session proof, legal acknowledgement/acceptance POST and contact-screen opening. Canonical docs do not need a diagram unless the builder changes behavior beyond this frozen slice.

## Human Gates That Remain Open

- Legal/privacy wording and consent copy: `WAITING_HUMAN`.
- `MVP-03.01` legal drafts: `DONE_WITH_HUMAN_PENDING`, not agent-only DONE.
- Real employee/customer data processing: `WAITING_HUMAN`.
- Customer-specific HR/reporting boundaries: `WAITING_HUMAN`.
- Final financial correctness of lessons, diagnostics, quizzes and explanations: `WAITING_HUMAN`.
- Reward economy, stock, prices and fulfillment: `WAITING_HUMAN`.

## Freeze Limitation

This contract is frozen and now scoped-verified after builder evidence and a fresh verifier PASS. Full `MVP-03`, the MVP stage and human gates remain open.
