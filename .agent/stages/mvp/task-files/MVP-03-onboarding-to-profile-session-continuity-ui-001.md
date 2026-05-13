# Task file: MVP-03-onboarding-to-profile-session-continuity-ui-001

Stage: `mvp`
Parent units: `MVP-03.02`, `MVP-03.04`
Status: `FROZEN`
Owner role: stage_spec_freezer
Created: 2026-05-13

## Objective

Add the smallest runnable `apps/web` continuity path from `/onboarding/privacy` into the existing `/profile/session` entry flow, so an employee can continue from the privacy boundary to profile-session entry without manually typing a URL.

## Current Baseline Preserved

- `MVP-03-employee-profile-session-entry-ui-001` has scoped fresh verifier `PASS`.
- `/onboarding/privacy` exists and explains the privacy boundary.
- `/profile/session` exists and creates profile sessions through generated `@finrhythm/api-client` helpers/types.
- The raw `profileSessionToken` must stay memory-only in the existing profile-session flow.
- Full `MVP-03`, MVP stage and human gates remain open.

## Scope

- First touch `apps/web` production/test behavior, not stage cleanup.
- Add a clear visible action on `/onboarding/privacy` to `/profile/session` or equivalent profile-session entry route.
- Keep the action mobile-first, Russian and neutral employee-facing.
- Preserve the visible privacy boundary.
- Add/update focused render tests for the link/route target.
- Add/update browser smoke so it starts on `/onboarding/privacy`, follows the action and verifies `/profile/session`.
- Verify the existing `/profile/session` generated-client boundary remains intact.

## Non-goals

- No auth platform, login/password, persistent auth, account recovery, SSO/SCIM.
- No `User`, `OrgMembership`, organization codes, subscriptions, seats, HR reporting or support tickets.
- No diagnostics, points, CMS, rewards, merch or admin flows.
- No backend/API/schema/Flyway/OpenAPI/generated-client changes.
- No profile-session token in URL, storage, cookies, fixtures, screenshots, logs or evidence.
- No raw invite echo, real employee/customer data, customer brand or forbidden financial claims.
- No full `MVP-03`, MVP stage or human-gate closure.

## Acceptance

- `/onboarding/privacy` visibly links or navigates to `/profile/session`.
- Browser/mobile smoke proves `/onboarding/privacy -> /profile/session` without manual URL entry.
- `/profile/session` remains the existing profile-session entry, not a login/account shortcut.
- Generated `@finrhythm/api-client` usage for profile-session creation remains in the `/profile/session` flow.
- No token is stored, routed or leaked through URL/storage/cookies/fixtures/screenshots/logs/evidence.
- Russian privacy copy remains visible and does not claim legal/privacy approval.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway, OpenAPI/springdoc.
- `passes=false` remains until builder evidence and fresh verifier PASS exist.

## Required Validation

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Browser/mobile smoke screenshots for `/onboarding/privacy -> /profile/session`.
- Guardrail scans for token storage/leakage, token URL/routing, raw invite echo, real data, customer brand and forbidden claims.
- Generated-client boundary check for `/profile/session`.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`
- `make verify`, `make test-unit`, `make build` if feasible; otherwise record exact limitation.
- Fresh `stage_verifier` before any PASS claim.

## Freeze Note

Frozen only. No production code or tests were edited by this freezer, and no implementation/evidence/PASS is claimed for this contract.
