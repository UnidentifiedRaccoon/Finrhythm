# Task: MVP-03-employee-start-route-ui-001

Stage: `mvp`
Sprint contract: `MVP-03-employee-start-route-ui-001`
Status: `FROZEN`
Proof status: `NOT_IMPLEMENTED`
Functional passes: `false`
Owner role: `stage_builder`
Created: 2026-05-13

## Slice

Add the first employee start route `/start` in `apps/web`, linking the already verified MVP-03 path:

`/start -> /onboarding/privacy -> /profile/session -> /profile/contact`

This is the next smallest runnable product slice. It is not a closure audit and not a docs/artifacts-only task.

## Baseline

- Latest verified scoped slice: `MVP-03-onboarding-to-profile-session-continuity-ui-001` = `PASS`.
- `/onboarding/privacy` already leads to `/profile/session`.
- `/profile/session` creates profile sessions through generated `@finrhythm/api-client` and keeps `profileSessionToken` only in mounted component memory.
- `/profile/contact` does not accept `profileSessionToken` from URL/query/hash/path; direct open shows safe missing-session state and links to `/profile/session`.
- Full `MVP-03` and the MVP stage remain open.
- Human gates remain `WAITING_HUMAN`.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Builder First Touch

First edit must be production/test code:

- expected production target: `apps/web/app/start/page.tsx`;
- optional component target: `apps/web/components/employee-start-screen.ts`;
- expected test targets: `apps/web/tests/learning-shell.test.mjs` and `apps/web/tests/browser-smoke.mjs`;
- `apps/web/app/globals.css` only if existing design-system classes are insufficient.

Do not update evidence/status/progress aliases before implementation and test proof exists.

## Implementation Requirements

- Create `/start` as a calm, mobile-first, Russian, neutral employee-facing start screen.
- Primary action must go to `/onboarding/privacy`.
- The screen must show a short safe order:
  1. privacy boundary first;
  2. temporary profile session next;
  3. contact data only after the temporary profile session.
- The screen must explain that contact data is entered after a temporary profile session and that the session secret is not passed through the address bar.
- A secondary `/profile/session` link is allowed only as a visually secondary continuation after privacy, not as the primary route.
- Do not add inputs, API calls, backend changes or token/session creation on `/start`.
- Preserve `/onboarding/privacy -> /profile/session` and `/profile/contact` safe missing-session behavior.

## Out Of Scope

- Full `MVP-03` or MVP closure.
- New auth/login/password, user account model, organization membership, organization codes, subscriptions, seats, entitlements, paywall or billing.
- Backend/API/schema/Flyway/OpenAPI/generated-client source changes.
- Diagnostics, HR reporting, points, CMS, rewards, merch, support tickets or admin flows.
- Token transfer through URL/query/hash/path, storage, cookies, IndexedDB, fixtures, screenshots, logs or evidence.
- Raw invite-code echo.
- Real employee/customer/personal/financial data.
- Customer brand in employee-facing UI.
- Financial promises, guaranteed results, quick-income, risk-free or guaranteed debt-relief claims.
- Required exact sums, photos, documents or bank screenshots.

## Acceptance Criteria

- `/start` renders successfully in `apps/web`.
- `/start` primary action points to `/onboarding/privacy`.
- `/start` does not make `/profile/session` primary and does not link directly to `/profile/contact`.
- `/start` is Russian, mobile-first, neutral and has no customer brand.
- `/start` explains privacy-first order and contact-after-temporary-session behavior.
- `/start` does not collect invite code, name, email, phone or financial data.
- `/start` does not call APIs and does not create a profile session.
- Browser smoke proves `/start -> /onboarding/privacy -> /profile/session`.
- No profile-session token appears in URL/query/hash/path/storage/cookies/fixtures/screenshots/logs/evidence.
- No raw invite code, real data, customer brand or forbidden financial claim appears in source, tests, screenshots or evidence.
- Existing `/profile/session` generated-client boundary remains intact.
- Existing direct `/profile/contact` safe missing-session state remains intact.
- Functional `passes=false` remains until evidence and fresh verifier PASS exist.

## Required Checks

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Browser/mobile smoke and screenshots for `/start -> /onboarding/privacy -> /profile/session`.
- Guardrail scans for token storage/leakage, token URL/query/hash/path routing, token handoff to `/profile/contact`, raw invite echo, real data, customer brand and forbidden claims.
- Generated-client boundary check for `/profile/session`.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`
- Root checks if feasible: `make verify`, `make test-unit`, `make build`.
- Fresh `stage_verifier` after builder evidence.

## Evidence Required From Builder

- changed production/test files;
- screenshot refs for `/start`, `/onboarding/privacy` and `/profile/session`;
- browser-smoke raw refs;
- command raw refs;
- guardrail scan raw refs;
- generated-client boundary proof;
- docs-sync and diagram decision;
- backend baseline unchanged note;
- human gates preserved as `WAITING_HUMAN`;
- immutable evidence/verdict/problems refs for `MVP-03-employee-start-route-ui-001`.

## Doc Targets And Diagram Expectations

- Canonical docs: `NOOP_EXPECTED` for a narrow `/start` entry screen.
- If builder changes product flow beyond the route, update `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`.
- If builder changes access/session boundary, update `docs/architecture/access-and-subscriptions.md`.
- Mermaid: `NONE_EXPECTED` unless builder introduces a reusable navigation/state boundary.

## Human Gates

- Legal/privacy wording and consent copy: `WAITING_HUMAN`.
- Real employee/customer data processing: `WAITING_HUMAN`.
- Customer-specific HR/reporting boundaries: `WAITING_HUMAN`.
- Final financial correctness of lessons/diagnostics/quizzes/explanations: `WAITING_HUMAN`.
- Reward economy and real fulfillment: `WAITING_HUMAN`.
