# Task file: MVP-03-profile-contact-summary-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `FROZEN`
Owner role: stage_orchestrator
Created: 2026-05-12

## Objective

Implement a safe read-only backend/API profile/contact summary lookup for an already registered employee. The endpoint must require raw invite code plus matching normalized contact fields and must not support contact update until a trustworthy employee auth/session bridge exists.

## Scope

- Read-only `apps/api` endpoint for profile/contact summary.
- Reuse existing registration contact normalization and invite-code lookup hash.
- Return support-ready normalized contact/scope summary only on exact contact match.
- Update OpenAPI and generated `packages/api-client` artifacts.
- Add focused backend/API/generated-client proof and guardrail scans.

## Non-goals

- No contact update.
- No employee auth/session/login/password setup.
- No `User`, `OrgMembership`, subscription/seat/pro_user/premium shortcut.
- No `apps/web` profile UI.
- No support ticket workflow, HR reporting, diagnostics, points, CMS, rewards or real data.

## Acceptance

- Successful lookup returns `employeeRegistrationId`, normalized `fullName`, `email`, `phone`, tenant/pilot/access-pool scope, `registeredAt` and `contactVerifiedByRegistrationMatch=true`.
- Unknown invite/registration, contact mismatch and invalid inputs fail safely.
- Failure responses do not echo raw invite code, lookup hash, activation subject ref or existing stored contact data.
- No mutation of `employee_registrations` occurs.
- OpenAPI/generated client are synchronized from source.
- Fresh verifier PASS is required before scoped PASS.
