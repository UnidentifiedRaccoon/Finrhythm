# Task: MVP-03-profile-session-legal-acceptance-ui-001

Stage: `mvp`
Sprint contract: `MVP-03-profile-session-legal-acceptance-ui-001`
Status: `FROZEN`
Proof status: `VERIFIED_PASS`
Functional passes: `true`
Owner role: `stage_builder`
Created: 2026-05-13

## Slice

Insert a draft legal document acknowledgement/acceptance step into the existing `apps/web` `/profile/session` flow.

The runnable flow must be:

`/start -> /onboarding/privacy -> /profile/session -> create temporary profile session -> legal acknowledgement -> POST legal acceptance -> existing contact update screen`

This is a functional web UI slice. It is not docs-only, evidence-only, harness cleanup, closure audit, backend/API/schema/OpenAPI or generated-client source work.

## Baseline

- Latest verified sprint: `MVP-03-employee-start-route-ui-001` = `PASS`.
- `/start -> /onboarding/privacy -> /profile/session` is already verified.
- `/profile/session` currently uses generated `fetchEmployeeProfileSession`, keeps `profileSessionToken` only in component memory and then opens `ProfileContactScreen`.
- `/profile/contact` direct open remains safe and does not accept a token through URL/query/hash/path.
- Generated `@finrhythm/api-client` already exports `fetchLegalDocumentAcceptance`, `LEGAL_DOCUMENT_TYPES`, `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION` and legal acceptance request/response types.
- Legal wording and real personal-data processing remain human-gated.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Builder First Touch

The first meaningful build step after this freeze must change production/test code, not `.agent`, docs, evidence or harness files.

Expected first-touch targets:

- `apps/web/components/profile-session-entry-screen.ts`;
- optional focused helper/component files under `apps/web/components` or `apps/web/lib`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- `apps/web/app/globals.css` only if existing styles are insufficient.

Evidence/status/progress artifacts come only after code/test/browser proof exists.

## Implementation Requirements

- Keep the existing profile-session form and generated `fetchEmployeeProfileSession` call.
- After successful session creation, show a legal acknowledgement/acceptance step before rendering `ProfileContactScreen`.
- Use `employeeRegistrationId` from the profile-session response for the legal acceptance POST.
- Keep `profileSessionToken` only in mounted component memory and pass it to `ProfileContactScreen` only after legal acceptance succeeds.
- Use generated `fetchLegalDocumentAcceptance`, `LEGAL_DOCUMENT_TYPES` and `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`.
- POST every current legal document type with the current draft version and a stable non-sensitive `source`, for example `web_profile_session`.
- Use Russian, neutral, mobile-first copy.
- Make draft/human-gated legal wording explicit; do not claim final legal approval.
- Preserve direct `/profile/contact` safe missing-session behavior.
- Add focused render/source tests and browser smoke mocks for success, ordering and safe failure states.

## Out Of Scope

- Full `MVP-03` or MVP closure.
- Backend/API/schema/Flyway/OpenAPI/generated-client source changes.
- Manual edits to generated contract artifacts.
- New legal backend/document CMS/document publishing work.
- Final legal/privacy/terms/consent/financial-disclaimer approval claim.
- New auth/login/password, persistent session cookies, account model, organization membership, organization codes, subscriptions, seats, entitlements, paywall or billing.
- Diagnostics, HR reporting, points, CMS, rewards, merch, support tickets or admin flows.
- Passing profile-session tokens through URL/query/hash/path, storage, cookies, IndexedDB, fixtures, screenshots, logs or evidence.
- Storing legal acceptance state, invite code, profile-session token or secrets in browser storage/cookies/IndexedDB.
- Raw invite-code echo.
- Displaying raw employeeRegistrationId in UI/screenshots/evidence beyond synthetic API path proof.
- Real employee/customer/personal/financial data.
- Customer brand in employee-facing UI.
- Financial promises, guaranteed results, quick income, risk-free claims or guaranteed debt-relief claims.
- Required exact sums, photos, documents, bank screenshots or personal finance reports.

## Acceptance Criteria

- `/profile/session` still creates the temporary profile session through generated `fetchEmployeeProfileSession`.
- Legal acknowledgement appears after profile-session proof and before contact update.
- Contact profile summary is not requested before legal acceptance succeeds.
- Legal acceptance uses `fetchLegalDocumentAcceptance` from generated `@finrhythm/api-client`.
- The request uses `employeeRegistrationId` from session response and sends all `LEGAL_DOCUMENT_TYPES` with `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`.
- `profileSessionToken` is not sent to legal acceptance and is never stored or placed in URL/query/hash/path.
- Contact update screen opens only after successful legal acceptance.
- Legal failure/retry states are safe and do not echo invite code, token, employeeRegistrationId, name, email or phone.
- UI copy is Russian, neutral, no customer brand, no final legal approval claim.
- Direct `/profile/contact` safe missing-session state remains intact.
- No real data, raw invite echo, unsafe token storage/leakage or forbidden financial claims appear in source/tests/screenshots/logs/evidence.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Functional `passes=false` remains until evidence and fresh verifier PASS exist.

## Required Checks

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Browser/mobile smoke and screenshots for `/start -> /onboarding/privacy -> /profile/session -> legal acknowledgement -> contact update`.
- Browser/API mock assertions for profile-session POST, legal acceptance POST, and contact-summary request ordering.
- Guardrail scans for token storage/leakage, token URL/query/hash/path routing, token handoff to `/profile/contact`, token leakage to legal acceptance, raw invite echo, raw employeeRegistrationId UI/evidence echo, real data, customer brand, forbidden claims and final legal approval claims.
- Generated-client boundary checks for profile-session and legal acceptance helpers/types.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`
- Root checks if feasible: `make verify`, `make test-unit`, `make build`.
- Fresh `stage_verifier` after builder evidence.

## Evidence Required From Builder

- changed production/test files;
- route proof and screenshots for start/privacy/profile-session/legal/contact states;
- browser/API mock proof for request ordering and safe payload boundaries;
- legal acceptance payload proof using all current generated document types and draft version;
- generated-client usage proof for `fetchLegalDocumentAcceptance`;
- guardrail scan raw refs;
- command raw refs;
- docs-sync and Mermaid diagram decision;
- backend baseline unchanged note;
- human gates preserved;
- immutable evidence/verdict/problems refs for `MVP-03-profile-session-legal-acceptance-ui-001`.

## Doc Targets And Diagram Expectations

- Canonical docs: `NOOP_EXPECTED` if the builder only consumes the existing legal acceptance contract and implements the already-scoped MVP-03 consent/legal acceptance step.
- Update `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` only if product/legal-document-set behavior changes.
- Update `docs/architecture/access-and-subscriptions.md` only if access/session boundary changes.
- Backend/OpenAPI/generated-client docs update only if backend/API changes become unavoidable.
- Mermaid: `EXPECTED_IN_EVIDENCE`; add a small sequence/state diagram for profile-session proof, legal acceptance POST and contact-screen opening.

## Human Gates

- Legal/privacy wording and consent copy: `WAITING_HUMAN`.
- `MVP-03.01` legal drafts: `DONE_WITH_HUMAN_PENDING`, not agent-only DONE.
- Real employee/customer data processing: `WAITING_HUMAN`.
- Customer-specific HR/reporting boundaries: `WAITING_HUMAN`.
- Final financial correctness of lessons/diagnostics/quizzes/explanations: `WAITING_HUMAN`.
- Reward economy and real fulfillment: `WAITING_HUMAN`.
