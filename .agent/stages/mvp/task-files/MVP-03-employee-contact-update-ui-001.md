# Task file: MVP-03-employee-contact-update-ui-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `FROZEN`
Owner role: stage_builder
Created: 2026-05-13

## Objective

Implement a minimal employee-facing mobile-first profile/contact screen in `apps/web` that uses the verified profile-session API to read the current profile summary and update only `email` and `phone`.

## Scope

- Add a route for profile/contact, preferred `/profile/contact` unless the current `apps/web` routing pattern makes `/profile` safer.
- Make the screen reachable from the employee-facing navigation only as needed.
- Use generated API client helpers/types where available:
  - `fetchEmployeeProfileSession`;
  - `fetchEmployeeMeProfileSummary`;
  - `fetchEmployeeMeContactUpdate`;
  - `EmployeeContactUpdateRequest`;
  - `EmployeeContactUpdateResponse`;
  - `ApiErrorResponse`.
- Since `apps/web` currently has no established session-token handoff, add the smallest measurable prerequisite in this same UI slice:
  - use the existing profile-session API flow or a local/browser smoke harness;
  - keep the profile-session token in memory only;
  - do not store the token in local/session storage, cookies, fixtures, screenshots or evidence;
  - if a local query/test harness is used, scrub the URL immediately and record the limitation.
- Load current profile summary with the profile-session bearer token.
- Show `fullName` as read-only if the API returns it.
- Edit and submit only `email` and `phone`.
- Handle success, normalized no-op, validation errors, expired/invalid session and generic failure with safe Russian UI copy.
- Preserve the privacy boundary and use only synthetic/local test data.

## Non-goals

- No `fullName` update.
- No login, password setup, account recovery, SSO/SCIM or persistent auth.
- No `User`, `OrgMembership`, subscriptions, seats, entitlements, `pro_user`, `premium` or paywall.
- No backend/API/schema/Flyway/OpenAPI/generated-client source change unless a compile-time contract drift is discovered and recorded.
- No support ticket workflow, HR reporting, diagnostics, points, CMS, rewards, merch, legal approval, real data processing, full `MVP-03` closure or MVP stage closure.
- No customer brand in employee-facing UI.

## Acceptance

- Mobile-first profile/contact UI exists and is reachable.
- The UI uses only the verified profile-session boundary; no broader auth/account/access model is introduced.
- Token prerequisite is explicit and measurable; if it is local/test-harness-only, evidence records that limitation.
- Token is kept in memory only and never persisted or leaked into tracked artifacts.
- `fullName` is read-only when shown.
- Only `email` and `phone` can be edited/submitted.
- Changed update and normalized no-op render distinct success states.
- `400` validation and `401` expired/invalid session states render safe Russian copy without raw sensitive echo.
- Generated API client usage is proven or limitation is explicit.
- UI screenshots/browser evidence cover start/handoff, loaded form, updated success, no-op if feasible, validation error and expired/invalid session.
- Relevant web/root checks, guardrail scans, JSON validation and `git diff --check -- . ':(exclude).agent/stages/**/raw/**'` are recorded.
- Canonical docs remain `NOOP_EXPECTED` unless the implementation changes access workflow beyond the documented profile-session boundary.
- Fresh stage verifier PASS is required before any passing claim.
