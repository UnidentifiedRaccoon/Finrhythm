# Task file: MVP-03-employee-profile-session-entry-ui-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `FROZEN`
Owner role: stage_builder
Created: 2026-05-13

## Objective

Add a minimal `apps/web` employee profile-session entry flow that creates a verified profile session from invite code + full name + email + phone, then connects the returned token to the existing profile/contact update UI without putting the token in URL or persistent browser storage.

## Current Baseline

- `POST /api/v1/employee-registrations/profile-sessions` is verified and returns `profileSessionToken` once.
- Backend stores only SHA-256 profile-session token hash, applies short TTL and revokes previous active sessions for the same registration.
- `GET /api/v1/employee-registrations/me/profile-summary` and `PATCH /api/v1/employee-registrations/me/contact` are verified and require valid bearer profile-session token.
- Existing `/profile/contact` UI is verified only for local/browser-smoke query param token handoff; it scrubs the URL and keeps the token in component memory.
- No production `apps/web` profile-session entry/handoff exists yet.

## Scope

- Add a minimal entry route, preferred `/profile/session`; `/profile/start` is acceptable if it fits the local app router better.
- Employee enters only invite code, full name, email and phone.
- Use generated `@finrhythm/api-client` helper/types:
  - `fetchEmployeeProfileSession`;
  - `EmployeeProfileSessionRequest`;
  - `EmployeeProfileSessionResponse`;
  - `fetchEmployeeMeProfileSummary` and existing contact update helpers/types where needed.
- Keep `profileSessionToken` in component memory only.
- Do not store the token in URL, `localStorage`, `sessionStorage`, cookies, IndexedDB, fixtures, screenshots, logs or evidence.
- After session creation, either:
  - pass the memory token into a refactored existing contact update UI; or
  - keep session entry + profile summary + contact update in one mounted client flow if cross-route memory-only handoff is not safe.
- If the one-screen path is used, record the limitation precisely in evidence.
- Load current profile summary before contact editing.
- Show `fullName` read-only.
- Edit and submit only `email` and `phone`.
- Render safe Russian copy for start, loading, success/transition, validation/invalid proof, expired/invalid session, generic failure and privacy boundary.
- Use synthetic/local test data only.

## Non-goals

- No `fullName` update.
- No login, password setup, account recovery, persistent auth, SSO/SCIM or generic account settings.
- No `User`, `users.organization_id`, `OrgMembership`, organization invitation acceptance, organization codes, subscriptions, seats, entitlements, `pro_user`, `premium`, paywall or billing.
- No backend/API/schema/Flyway/OpenAPI/generated-client source changes unless a compile/import drift is discovered and recorded as a blocker.
- No support tickets, HR reporting, diagnostics, points, CMS, rewards, merch, legal approval, real data processing, full `MVP-03` closure or MVP stage closure.
- No customer brand in employee-facing UI.

## Acceptance

- Entry route exists and is reachable.
- `POST /api/v1/employee-registrations/profile-sessions` is called through generated client helper/types.
- Returned token is memory-only and never appears in URL/storage/tracked artifacts.
- No token is passed to `/profile/contact` through query, path or hash.
- Profile summary loads through bearer profile-session token after session creation.
- Contact update UI edits/submits only email/phone; fullName is read-only and not sent.
- Updated/no-op/400/401/generic failure states use safe Russian copy without raw invite/contact/token echo.
- Privacy boundary copy remains visible and does not claim legal/privacy or real-data approval.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway, OpenAPI/springdoc.
- Canonical docs are `NOOP_EXPECTED` unless a new durable access/session handoff pattern is introduced.
- Browser/mobile screenshots and guardrail scans cover the session-entry-to-contact flow.
- Relevant web/root checks, JSON validation and diff check are recorded.
- Fresh `stage_verifier` PASS is required before any passing claim.

## Human Gates

- Legal/privacy wording and consent copy: `WAITING_HUMAN`.
- Real employee/customer data processing: `WAITING_HUMAN`.
- Customer-specific HR/reporting boundaries: `WAITING_HUMAN`.
- Financial correctness: `WAITING_HUMAN`.
- Reward/fulfillment: `WAITING_HUMAN`.

## Freeze Note

Frozen only. No production code was edited by this freezer, and `passes=false` remains required until builder evidence and fresh verification exist.
