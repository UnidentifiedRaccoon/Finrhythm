# MVP-07 diagnostic draft API spec freeze

Stage: `mvp`
Active slice: `MVP-07-diagnostic-draft-api-001`
Parent stage unit: scoped prerequisite for `MVP-07.01` and `MVP-07.04`
Role: `stage_spec_freezer`
Status: `PASS`
Date: 2026-05-13

## Freeze Goal

Freeze the next smallest product implementation slice after local latest fresh verifier `PASS` for `MVP-07-diagnostic-entry-preview-ui-001`: a backend-owned diagnostic draft/submission API foundation for the already previewed IDs `Q0`, `SA1-SA3` and `Q1-Q3`.

This is not a scoring/routing engine. It exists to make the diagnostic preview durable enough for a later UI integration and safe resume handoff while preserving all scoring, full routing, HR reporting and human-gated content decisions.

## Current Baseline

- Latest verified sprint remains `MVP-07-diagnostic-entry-preview-ui-001` = `PASS`.
- Active sprint `MVP-07-diagnostic-draft-api-001` now has builder evidence, a minimal fixer for the first verifier-reported submit-response gap and fresh post-fix verifier `PASS`.
- `MVP-07.01`, `MVP-07.04`, full `MVP-07`, full MVP and all human gates remain open.
- Existing employee profile-session bearer boundary is the only allowed employee authentication input for this slice.
- Current employee path and UI preview must not be changed by this freeze: `/start -> /onboarding/privacy -> /profile/session -> legal acknowledgement -> generated legal acceptance POST -> contact update screen`, plus `/diagnostics` preview and `/learning/lessons/N1|N2|N3`.
- Backend baseline is explicit and unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, append-only Flyway and OpenAPI/springdoc.

## Frozen Slice

`MVP-07-diagnostic-draft-api-001` is a backend/API/schema contract slice in `apps/api` plus generated client sync in `packages/api-client` only after backend source changes exist.

The future builder must implement the smallest authenticated diagnostic attempt foundation:

- use the existing employee profile-session bearer token to resolve the current `employee_registration`;
- add append-only Flyway migration `V011__diagnostic_draft_attempt.sql` or the next available `V011` successor if the repository has advanced;
- persist one current MVP diagnostic attempt per employee registration for this slice;
- support draft persistence for exactly `Q0`, `SA1`, `SA2`, `SA3`, `Q1`, `Q2` and `Q3`;
- keep Q0/privacy metadata, self-assessment answers and routing answers in separate persistence structures or separately constrained fields, not one mixed free-form answer blob;
- support submitted state without final scoring;
- return only safe draft handoff fields on submit, including `routePreview=true` and `recommendedFirstLessonId="N1"`;
- expose the API through Spring controllers/OpenAPI annotations with thin controllers and service/domain-owned rules;
- update OpenAPI snapshot and generated API client artifacts/notes from backend source;
- prove behavior with focused backend integration tests and command evidence before any PASS claim.

Preferred API surface for builder implementation:

- `GET /api/v1/diagnostics/me/draft`;
- `PUT /api/v1/diagnostics/me/draft`;
- `POST /api/v1/diagnostics/me/submit`.

All endpoints require `employeeProfileSessionBearerAuth`. A different path is allowed only if the builder records the reason and keeps the same behavior, auth, OpenAPI and generated-client guarantees.

## Out Of Scope

- Full production diagnostic engine or 7-12 minute diagnostic.
- Full `Q1-Q27`, `Q28`, competency matrix scoring, final level assignment, strong/weak-zone correctness or final `R1-R6` route assignment.
- Any field named or behaving as final `routeId`, `level`, `overallScore`, competency score or weak-zone report.
- HR reporting, aggregated insights, personal HR report surfaces, analytics/events or event taxonomy.
- UI integration in `apps/web`, admin/CMS/operator UI, diagnostic bank management or content publish states.
- Learning progress/completion, scored quiz submission, practice submission, points, rewards, wallet, merch or challenge operations.
- Exact income, debt, balance, account numbers, photos, documents, bank screenshots, free-form personal finance reports or required exact sums.
- Personal financial, investment, tax, credit, debt or legal advice.
- Customer brand in employee-facing UI, real employee/customer/personal/financial data or production legal/privacy wording approval.
- Login/password setup, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, SSO/SCIM or B2C billing.
- Full `MVP-07.01`, full `MVP-07.04`, full `MVP-07`, full MVP stage or human-gate closure.

## Doc Targets And Diagram Expectations

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md`, because profile-session bearer scope expands from profile/contact to diagnostic draft/submission. Add or refresh a small Mermaid flow/state diagram for the profile-session-authenticated diagnostic attempt lifecycle.
- Expected product doc decision: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` and `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` if the builder follows existing diagnostic IDs, privacy boundaries and safe storage rules.
- Update `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` only if the builder changes diagnostic IDs, Q0/SA semantics, storage sensitivity rules or route-handoff assumptions.
- Update `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` only if the builder changes product privacy/reporting or employee learning-loop decisions.
- Update `packages/api-client/README.md` or generator notes only if the generated-client flow changes beyond the existing documented regeneration process.
- Stage evidence must include an implementation/data-flow Mermaid diagram or cite the canonical Mermaid diagram added in the docs.
- Mermaid expectation: `REQUIRED_FOR_CANONICAL_DOCS_AND_EVIDENCE`.

## Human Gates

Remain open and must not be marked `DONE` by this slice:

- final Q0/SA/Q wording review;
- scoring correctness and route-rule correctness;
- final financial correctness of diagnostic questions and explanations;
- HR/privacy wording and reporting-boundary approval;
- legal/privacy boundaries and real employee/customer data processing approval;
- admin/support production access policy for sensitive diagnostic data;
- design/accessibility QA on real mobile screens for later UI integration.

## Evidence Rule

This freeze originally recorded scope only. `MVP-07-diagnostic-draft-api-001` now has fresh post-fix verifier `PASS`; full `MVP-07.01`, full `MVP-07.04`, full `MVP-07`, full MVP and human gates remain open.
