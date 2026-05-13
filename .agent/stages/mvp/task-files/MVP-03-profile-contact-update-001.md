# Task file: MVP-03-profile-contact-update-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `FROZEN`
Owner role: stage_builder
Created: 2026-05-12

## Objective

Implement backend/API-only employee contact update for the current registration, authenticated only by the already verified profile-session bearer token.

## Scope

- Add `PATCH /api/v1/employee-registrations/me/contact` or an equivalently explicit backend route.
- Require `Authorization: Bearer <profile-session-token>`; token must be valid, unexpired and unrevoked.
- Update only normalized `email` and `phone`; omitted fields stay unchanged.
- Keep `fullName` mutation out of scope.
- Validate and normalize request fields using existing registration contact rules where possible.
- Treat normalized duplicate/no-op as successful `changed=false`/`outcome=noop`, without consuming the profile session.
- In one transaction, update changed contact fields and append one audit row for each successful accepted attempt.
- Add append-only Flyway migration for contact update audit storage and any required metadata.
- Audit row must store registration scope, changed fields, old/new contact hashes or privacy-safe fingerprints, timestamp, actor type `employee_profile_session`, safe session id/hash reference and optional sanitized reason.
- Update OpenAPI/springdoc source, OpenAPI snapshot and generated `packages/api-client` artifacts/checks.
- Update `docs/architecture/access-and-subscriptions.md` profile-session section with contact update boundary and Mermaid flow/state diagram.
- Add focused backend tests and guardrail scans.

## Non-goals

- No `fullName` update.
- No employee UI or `apps/web` mutation.
- No login, password setup, account recovery, SSO/SCIM or full auth framework.
- No `User`, `OrgMembership`, subscriptions, seats, entitlements, `pro_user` or `premium`.
- No support tickets, support UI, HR reporting, diagnostics, points, CMS, rewards, merch or real data.
- No raw token, raw invite code, lookup hash, activation subject ref, diagnostics, points, HR/reporting data, legal text bodies or raw audit contact values.
- No full `MVP-03`, MVP stage or human-gate closure.

## Acceptance

- Update authenticates only with a valid unexpired unrevoked profile-session bearer token.
- Missing/malformed/unknown/expired/revoked token returns safe `401` and does not persist request contact PII.
- Only `email` and `phone` can change; `fullName` and registration scope fields cannot.
- Validation, normalization, omitted-field and empty-payload behavior are tested.
- Successful changed update creates exactly one append-only audit row and updates registration contact in the same transaction.
- Successful normalized no-op creates exactly one audit row with `outcome=noop`, returns success and does not consume the profile session.
- Audit rows use actor type `employee_profile_session` and safe session id/hash references; raw token, raw invite code, raw contact values, lookup hash and activation subject ref are not stored or echoed.
- OpenAPI/generated client, Flyway/Testcontainers proof if applicable, canonical docs sync and fresh verifier PASS are required before any passing claim.
