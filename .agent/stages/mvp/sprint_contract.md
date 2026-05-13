# Sprint contract: MVP-03-employee-start-route-ui-001

Stage: `mvp`
Parent units: `MVP-03.02`, `MVP-03.04`
Status: `FROZEN`
Proof status: `NOT_IMPLEMENTED`
Functional passes: `false`
Created: 2026-05-13
Owner role: stage_builder

## Purpose

Add the smallest runnable employee-facing start route at `/start` in `apps/web`.

The route must give an employee a neutral, mobile-first first screen that starts the already verified path:

`/start -> /onboarding/privacy -> /profile/session -> /profile/contact`

This is a product UI slice, not a closure audit and not docs/artifacts-only. It must not introduce auth, subscription, organization, HR/reporting, diagnostics, points, CMS, support/admin or backend/API scope.

## Baseline And Source Refs

- Latest verified scoped slice: `MVP-03-onboarding-to-profile-session-continuity-ui-001` = `PASS`.
- Verified current behavior:
  - `/onboarding/privacy` leads the employee to `/profile/session`;
  - `/profile/session` creates a profile session through generated `@finrhythm/api-client`;
  - returned `profileSessionToken` remains only in mounted React component memory;
  - `/profile/contact` does not accept `profileSessionToken` from URL/query/hash/path;
  - direct `/profile/contact` shows a safe missing-session state with a link to `/profile/session`.
- `docs/stages/MVP.md`: `MVP-03` requires safe start, privacy boundary before diagnostics and profile/contact basics.
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`: MVP is B2B-first mobile web, employee UI is neutral, customer brand is not used, privacy boundary separates operational data from sensitive learning/financial data.
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`: mobile-first, calm first, one screen/one thought, visible privacy copy, primary CTA, neutral employee-facing UI.
- `apps/web/AGENTS.md`: user-visible critical profile/settings flows require browser smoke or e2e evidence and screenshots.
- Backend baseline remains explicit and unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

Do not read `.agent/stages/**/raw/**` for this slice unless a later verifier problem names an exact raw ref.

## Affected IDs

- `MVP-03.02`
- `MVP-03.04`
- `MVP-03-employee-start-route-ui-001`
- `MVP-03` remains open
- MVP stage remains open

## Builder First Touch Requirement

The builder must first touch production/test code, not harness cleanup:

- production route/screen files for `/start` in `apps/web`;
- focused web tests and browser smoke coverage for `/start -> /onboarding/privacy -> /profile/session`.

Stage/evidence/status artifacts may be updated only after code/tests/browser proof exists.

## In Scope

- Add a first employee start route at `/start`.
- Render a calm, mobile-first, Russian, neutral employee-facing start screen using the current `apps/web` UI/style patterns.
- Make the primary visible action from `/start` go to `/onboarding/privacy`.
- Show a short safe order of steps:
  1. read the privacy boundary;
  2. open a temporary profile session;
  3. enter or update contact data only after that temporary profile session.
- Explain that contact data is entered after a temporary profile session and that the session secret is not moved through the address bar.
- Preserve the existing verified path after the primary action: `/onboarding/privacy -> /profile/session`.
- A secondary link to `/profile/session` is allowed only if it is visually secondary and worded as continuation after the privacy screen, for example "Уже прочитали про приватность: продолжить вход в профиль".
- Update focused render/unit tests for the new start route/screen.
- Update browser smoke to prove `/start -> /onboarding/privacy -> /profile/session` on a mobile viewport and capture screenshots.
- Use synthetic/local/browser-smoke data only.

## Out Of Scope

- Closure audit for full `MVP-03` or the MVP stage.
- Docs/artifacts-only completion.
- Root route redirect or replacing `/learning` as the app home, unless a later contract explicitly asks for that.
- New auth platform, login/password, password setup, account recovery, persistent auth, SSO/SCIM or session cookies.
- `User`, `users.organization_id`, `OrgMembership`, invitations beyond existing verified invite-code proof, organization codes, subscriptions, seats, entitlement resolver, `pro_user`, `premium`, paywall or billing.
- Backend/API/schema/Flyway/OpenAPI/generated-client source changes.
- Creating a profile session on `/start`.
- Accepting invite code, contact data, raw profile-session token or any secret on `/start`.
- Passing `profileSessionToken` through URL/query/hash/path, `localStorage`, `sessionStorage`, cookies, IndexedDB, fixtures, screenshots, logs or evidence.
- Direct `/start -> /profile/contact` handoff or any token handoff to `/profile/contact`.
- Raw invite-code echo in UI errors, screenshots, logs or evidence.
- HR reporting, diagnostics/scoring/routing, points, CMS, rewards, merch, support tickets or admin flows.
- Final legal/privacy wording approval, real employee/customer data processing approval or customer-specific HR/reporting approval.
- Customer brand in employee-facing UI.
- Financial promises, guaranteed results, quick-income, risk-free or guaranteed debt-relief claims.
- Required exact sums, photos, documents or bank screenshots.

## Acceptance Checklist

- `/start` exists in `apps/web` and renders successfully.
- `/start` is mobile-first, Russian, neutral employee-facing UI and contains no customer brand.
- `/start` primary action is a clear visible link/button to `/onboarding/privacy`.
- `/start` does not make `/profile/session` the primary path and does not link directly to `/profile/contact`.
- `/start` explains the safe order: privacy first, then temporary profile session, then contact data.
- `/start` explains that contact details are entered after the temporary profile session.
- `/start` does not collect invite code, name, email, phone, financial data or documents.
- `/start` does not call backend APIs and does not create a profile session.
- Browser/mobile smoke proves `/start -> /onboarding/privacy -> /profile/session` without manual URL entry after opening `/start`.
- `/onboarding/privacy` remains the privacy boundary before profile-session entry.
- `/profile/session` remains the existing generated-client entry flow, not a new auth/login/account shortcut.
- Existing `/profile/contact` missing-session behavior remains safe if directly opened.
- No `profileSessionToken` appears in URL, query, hash, route params, storage, cookies, IndexedDB, tracked fixtures, screenshots, logs or evidence.
- No raw invite-code echo appears in UI errors, screenshots, logs or evidence.
- No real employee/customer/personal/financial data appears in source, tests, screenshots or evidence.
- No login/password/account/organization/subscription/seat/HR/diagnostics/points/CMS/rewards/support behavior is introduced.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Canonical docs are updated only if the builder changes product/access behavior beyond the narrow `/start` route. Otherwise evidence records `NOOP_EXPECTED`.
- Functional `passes=false` remains until builder evidence and a fresh `stage_verifier` PASS exist.

## Required Validation

The builder must run and record:

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Browser/mobile smoke and screenshots for `/start -> /onboarding/privacy -> /profile/session`.
- Guardrail scans for:
  - token storage through `localStorage`, `sessionStorage`, cookies and IndexedDB;
  - token leakage through URL/query/hash/path;
  - token routing or handoff to `/profile/contact`;
  - raw profile-session token leakage;
  - raw invite-code echo;
  - real employee/customer/personal/financial data;
  - customer brand in employee-facing UI;
  - forbidden financial claims.
- Generated-client boundary check proving the existing `/profile/session` flow still consumes generated `@finrhythm/api-client` helpers/types.
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

- exact `apps/web` route/component/test/browser-smoke files changed;
- route path proven by browser smoke: `/start -> /onboarding/privacy -> /profile/session`;
- screenshot refs for `/start`, `/onboarding/privacy` after primary navigation and `/profile/session` after privacy-screen navigation;
- command outcomes with raw refs under `.agent/stages/mvp/raw/`;
- guardrail scan results proving no unsafe token storage, token URL/storage/cookie leakage, token handoff to `/profile/contact`, raw invite echo, real data, customer brand or forbidden claims;
- generated-client boundary proof for `/profile/session`;
- docs-sync decision and diagram decision;
- backend baseline unchanged note;
- human-gate table preserving `WAITING_HUMAN`;
- fresh verifier verdict/problems artifacts for `MVP-03-employee-start-route-ui-001`.

## Doc Targets And Diagram Expectations

- Canonical docs target: `NOOP_EXPECTED` if the builder only adds `/start` as a narrow entry screen to the existing verified path.
- Canonical docs update required only if the builder changes product/access behavior beyond this route. The narrow targets would be:
  - `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` for product flow changes;
  - `docs/architecture/access-and-subscriptions.md` for access/session boundary changes.
- Product/design docs target: `NOOP_EXPECTED`; use existing product foundation and design-system baselines.
- Stage artifact targets after implementation:
  - `.agent/stages/mvp/evidence/MVP-03-employee-start-route-ui-001.{md,json}`;
  - `.agent/stages/mvp/verdicts/MVP-03-employee-start-route-ui-001.json`;
  - `.agent/stages/mvp/problems/MVP-03-employee-start-route-ui-001.md`;
  - compact aliases only after evidence and fresh verification.
- Mermaid expectation: `NONE_EXPECTED` for a simple start route and links. Add a small Mermaid diagram only if the builder introduces a reusable app-level navigation/state boundary.

## Human Gates That Remain Open

- Legal/privacy wording and consent copy: `WAITING_HUMAN`.
- Real employee/customer data processing: `WAITING_HUMAN`.
- Customer-specific HR/reporting boundaries: `WAITING_HUMAN`.
- Final financial correctness of lessons, diagnostics, quizzes and explanations: `WAITING_HUMAN`.
- Reward economy, stock, prices and fulfillment: `WAITING_HUMAN`.

## Freeze Limitation

This contract is frozen but not implemented. This freezer did not edit production code/tests, did not create evidence, did not move evidence/verdict aliases, did not set any feature `passes=true` and did not close full `MVP-03` or the MVP stage.
