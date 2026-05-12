# MVP-03 employee profile session spec freeze

Stage ID: `mvp`
Active slice: `MVP-03-employee-profile-session-001`
Parent stage unit: `MVP-03.04`
Status: `FROZEN`
Frozen at: 2026-05-12
Freezer role: `stage_spec_freezer`

## Objective

Freeze one narrow backend/API prerequisite for future safe contact update: create a trustworthy short-lived employee profile session only after the existing raw invite code plus normalized full name/email/phone proof succeeds, then allow a read-only authenticated `me/profile-summary` lookup from that session.

This freeze does not implement production code, contact update, employee UI, login/password setup, `User`, `OrgMembership`, subscriptions/seats, support tickets, HR reporting, diagnostics, points, CMS, rewards, real-data use, full `MVP-03`, the MVP stage or any human gate.

## Current Verified State

- Latest verified scoped slice remains `MVP-03-profile-contact-summary-001` with fresh verifier `PASS`.
- Immutable PASS refs for `MVP-03-profile-contact-summary-001` and `MVP-03-admin-sensitive-access-audit-001` must be preserved.
- Existing backend has `POST /api/v1/employee-registrations/profile-summary`, requiring raw invite code plus matching normalized fullName/email/phone, read-only, no UUID-only public lookup, no contact update and no auth/session bridge.
- `apps/web` remains non-mutating for consent/profile/contact flows because there is no trustworthy employeeRegistrationId/session bridge.

## Decision

The safe next implementation slice is an employee-registration-scoped profile session, not contact update. The session is a narrow MVP registration/profile boundary:

- it is created only after the same invite+contact proof already verified by the profile-summary endpoint;
- it is not a product login, not a password setup flow, not a `User` session and not an `OrgMembership`/subscription/seat entitlement;
- it returns an opaque high-entropy raw token only once and stores only a server-side token hash;
- it is short-lived, revocable and valid only for read-only profile-summary lookup.

Contact update remains out of scope until a later slice explicitly freezes update semantics, auditability and identity proof requirements.

## Acceptance Summary

The builder must prove:

- `POST /api/v1/employee-registrations/profile-sessions` creates a short-lived profile session only when raw invite code plus normalized fullName/email/phone match the existing registration.
- The raw profile-session token is opaque, high-entropy, non-JWT and stored only as a server-side hash.
- Expiry and revocation/consumption policy is explicit: recommended 15-minute TTL, previous active profile sessions for the same registration revoked on successful new creation, read-only `me/profile-summary` does not consume the session, expired/revoked sessions fail.
- `GET /api/v1/employee-registrations/me/profile-summary` works only with a valid unexpired profile-session bearer token and returns the same support-safe summary fields as the verified read-only profile-summary contract.
- Invalid input, failed proof, missing/malformed token, expired/revoked token and unknown session fail with safe `400`/`401`/`404` responses without echoing raw token, raw invite code, contact values, lookup hash, activation subject ref or stored PII.
- Backend baseline stays Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- If sessions are persisted, an append-only Flyway migration adds the session table/indexes; schema evidence and Testcontainers/Flyway proof are required.
- OpenAPI and generated `packages/api-client` artifacts are updated from backend source.
- Canonical docs sync targets are declared before build; `docs/architecture/access-and-subscriptions.md` likely needs a new MVP employee profile-session boundary with a small Mermaid flow.
- No contact update, employee UI, login/password setup, `User`, `OrgMembership`, subscription/seat, `pro_user`, `premium`, SSO, support ticket, HR report, diagnostics, points, CMS, rewards, real data or human-gate closure is introduced.
- Fresh stage verifier PASS is required before any new `passes=true` or scoped PASS claim.
