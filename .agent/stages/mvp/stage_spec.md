# MVP-03 employee contact update UI spec freeze

Stage: `mvp`
Active slice: `MVP-03-employee-contact-update-ui-001`
Parent stage unit: `MVP-03.04`
Role: `stage_spec_freezer`
Status: `FROZEN`
Date: 2026-05-13

## Freeze Goal

Freeze the next narrow product functionality slice after verified `MVP-03-legal-drafts-001` PASS: an employee-facing, mobile-first profile/contact screen in `apps/web` that uses the already verified profile-session contact update API.

This is not harness-only work and does not implement production code. Builder evidence and a fresh stage verifier are still required before any PASS claim.

## Current Baseline

- Latest verified scoped slice: `MVP-03-legal-drafts-001` PASS.
- Full `MVP-03` remains open; legal/privacy wording, real data processing and customer-specific reporting gates remain `WAITING_HUMAN`.
- Backend/API contact update contract is already verified by `MVP-03-profile-contact-update-001` PASS.
- Generated API client currently exposes:
  - `fetchEmployeeProfileSession`;
  - `fetchEmployeeMeProfileSummary`;
  - `fetchEmployeeMeContactUpdate`;
  - `EmployeeContactUpdateRequest`;
  - `EmployeeContactUpdateResponse`.
- `apps/web` currently has no profile/contact route and no established profile-session token handoff. The UI slice must therefore include the smallest measurable session bridge in the same screen, using only the existing profile-session flow and local/test harness evidence.

## Frozen Slice

`MVP-03-employee-contact-update-ui-001` is a minimal `apps/web` slice for `/profile/contact` or an equivalently explicit profile contact route.

The screen must:

- be mobile-first and match `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`;
- use neutral employee-facing branding without customer brand;
- obtain a profile-session token only through the existing profile-session API flow or a clearly marked local/browser test harness limitation;
- keep any profile-session token in memory only for the active page/session;
- load the current support-safe profile summary through the profile-session token;
- display `fullName` as read-only when returned by the API;
- edit only `email` and `phone`;
- submit updates through the verified profile-session contact update API;
- handle success, normalized no-op, `400` validation errors and `401` expired/invalid session safely with Russian UI copy;
- preserve the privacy boundary and avoid real employee/customer data.

## Out Of Scope

- `fullName` update.
- Login, password setup, account recovery, SSO/SCIM or full auth framework.
- `User`, `OrgMembership`, organization membership acceptance, subscriptions, seats, entitlements, `pro_user` or `premium`.
- Backend/API/schema/Flyway/OpenAPI/generated-client changes unless a compile-time contract import fix is strictly necessary and recorded as a limitation.
- Support tickets, support UI beyond contact basics, HR reporting, diagnostics, points, CMS, rewards, merch, legal approval, real data processing, full `MVP-03` closure or MVP stage closure.

## Backend Baseline

Backend baseline is explicitly preserved: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc. This UI slice consumes the existing generated API client contract and must not change backend behavior unless a builder-discovered proof gap is recorded separately.

## Doc Targets And Diagram Expectations

- Canonical docs target: `NOOP_EXPECTED` unless the builder changes behavior/access workflow beyond the already documented `docs/architecture/access-and-subscriptions.md` profile-session/contact-update boundary.
- Stage artifact targets after build:
  - `.agent/stages/mvp/evidence/MVP-03-employee-contact-update-ui-001.{md,json}`;
  - `.agent/stages/mvp/verdicts/MVP-03-employee-contact-update-ui-001.json`;
  - `.agent/stages/mvp/problems/MVP-03-employee-contact-update-ui-001.md`;
  - latest aliases only after builder evidence/fresh verifier as required by the proof loop.
- Mermaid expectation: `NONE_EXPECTED` for the minimal UI wiring. If the builder introduces a new token handoff or access workflow beyond the documented boundary, update the narrow canonical doc and add/refresh a small Mermaid flow there.

## Human Gates

Remain open:

- legal/privacy wording and consent copy: `WAITING_HUMAN`;
- real employee/customer data processing: `WAITING_HUMAN`;
- customer-specific HR/reporting boundaries: `WAITING_HUMAN`;
- final financial correctness of lessons/diagnostics/quizzes: `WAITING_HUMAN`;
- reward economy, real rewards and fulfillment: `WAITING_HUMAN`.

## Evidence Rule

This freeze records scope only. Leave functional `passes=false` until builder evidence and a fresh `stage_verifier` verdict exist.
