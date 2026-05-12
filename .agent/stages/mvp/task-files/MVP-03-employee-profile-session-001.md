# Task file: MVP-03-employee-profile-session-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `FROZEN`
Owner role: stage_builder
Created: 2026-05-12

## Objective

Implement a backend/API-only employee profile session that can be created only after raw invite code plus normalized contact proof, then use that session for read-only authenticated `me/profile-summary`.

## Scope

- Add `POST /api/v1/employee-registrations/profile-sessions` or an equivalently explicit route.
- Require raw invite code plus `fullName`, `email`, `phone` and reuse existing registration contact normalization/match rules.
- Return an opaque high-entropy profile-session token only once; store only a server-side token hash.
- Persist sessions with short expiry/revocation metadata unless a safer concrete alternative is recorded; if persisted, add append-only Flyway migration.
- Add `GET /api/v1/employee-registrations/me/profile-summary` authenticated by the profile-session bearer token.
- Return only the support-safe profile-summary fields already allowed by the previous PASS slice.
- Update OpenAPI and generated `packages/api-client` artifacts/checks.
- Update `docs/architecture/access-and-subscriptions.md` with the MVP employee profile-session boundary and a small Mermaid flow unless a precise no-doc-change reason is proven.
- Add backend integration/Testcontainers coverage and guardrail scans.

## Non-goals

- No contact update or contact mutation.
- No employee UI or `apps/web` mutation.
- No login, password setup, account recovery, SSO/SCIM or full auth framework.
- No `User`, `OrgMembership`, subscriptions, seats, entitlements, `pro_user` or `premium`.
- No support ticket workflow, support UI, HR reporting, diagnostics, points, CMS, rewards, merch or real data.
- No full `MVP-03`, MVP stage or human-gate closure.

## Acceptance

- Session creation requires raw invite code plus matching normalized fullName/email/phone.
- Token is opaque, high-entropy, non-JWT, returned only once and stored only as a server-side hash.
- Expiry/revocation/consumption policy is explicit and tested: short TTL, previous active session revocation on new creation, read-only `me/profile-summary` does not consume the session, expired/revoked sessions fail.
- Authenticated `me/profile-summary` works only with a valid unexpired profile-session bearer token.
- Safe `400`/`401`/`404` errors do not echo raw token, raw invite code, contact values, lookup hash, activation subject ref or stored PII.
- No contact update, UUID-only lookup, account/session shortcut, `User`/`OrgMembership`, subscription/seat/pro_user/premium shortcut or real data is introduced.
- OpenAPI/generated client, Flyway migration evidence if applicable, canonical docs sync and fresh verifier PASS are required before any passing claim.
