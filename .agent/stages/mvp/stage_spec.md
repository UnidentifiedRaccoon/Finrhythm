# MVP-07 diagnostic to N1 learning progress stage spec

Stage: `mvp`
Active slice: `MVP-07-diagnostic-n1-learning-progress-001`
Parent scope: scoped prerequisite across `MVP-07` safe diagnostic handoff and `MVP-06.04` / N1 learning delivery
Role: `stage_orchestrator`
Status: `SCOPED_PASS`
Functional passes: `true`
Date: 2026-05-14

## Verified Goal

The slice was frozen after fresh verifier `PASS` for `MVP-07-diagnostic-web-api-integration-001`, then built and fresh-verified as scoped `PASS`.

The new slice starts where the verified diagnostic web/API handoff stops: diagnostic submit can safely return `recommendedFirstLessonId="N1"`. The next implementation should make that continuation durable by adding backend-owned, profile-session authenticated N1 lesson start/resume progress and wiring the web continuation through generated `@finrhythm/api-client`.

This is not full learning delivery, not full diagnostics, not points, not completion and not a human-gate closure.

## Verified Result

- Latest verified sprint is `MVP-07-diagnostic-n1-learning-progress-001` with fresh verifier `PASS`.
- Latest aliases `evidence.json`, `verdict.json` and `problems.md` point to this slice after parent alias sync.
- `apps/api` now has append-only `V012__employee_lesson_progress.sql` and a focused `com.finrhythm.api.learning` package.
- `apps/web` starts/resumes backend N1 progress through generated `@finrhythm/api-client` and then renders synthetic N1 in the same mounted `/profile/session` tree.
- Existing web N1 content remains synthetic fixture/renderer only; lesson completion, quiz/practice submission and production content approval are out of scope.
- Backend baseline remains Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Verified Slice

`MVP-07-diagnostic-n1-learning-progress-001` is a backend-first API/schema slice with generated-client sync and a narrow web continuation.

The verified implementation:

- first touched `apps/api` production/test files before web/generated/docs/evidence work;
- adds append-only storage for N1 employee lesson start/resume progress;
- authenticates with the current employee profile-session bearer token;
- resolves employee registration and pilot scope server-side;
- exposes N1-only idempotent start/resume;
- updates OpenAPI and generated `packages/api-client`;
- wires the diagnostic N1 handoff in `apps/web` through generated learning helper(s);
- keeps the profile-session token only in mounted component memory;
- uses the existing synthetic N1 renderer/fixture only as display content;
- has backend, generated-client, web, browser, root-wrapper and guardrail evidence accepted by fresh verifier.

## Out Of Scope

- Lesson completion, quiz scoring/submission, practice submission, points, rewards, wallet, challenge, store or merch.
- Full diagnostic scoring/routing, full `Q1-Q27`, `Q28`, final `R1-R6`, HR reports or analytics/events.
- CMS/admin lesson publishing, content states, methodologist production approval or full learning catalog.
- `N2+` backend progress.
- Exact sensitive data, real employee/customer data or personal advice.
- `User`, `OrgMembership`, subscriptions/seats/entitlements, SSO/SCIM, B2C billing, `pro_user` or `premium`.
- Full `MVP-06`, full `MVP-07`, full MVP and human-gate closure.

## Doc Targets And Diagram Expectations

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md`.
- Required canonical Mermaid expectation: compact profile-session diagnostic-to-N1 learning progress handoff/state diagram unless the builder proves existing docs already cover the exact boundary.
- Product docs target: `NOOP_EXPECTED` if existing N1 methodology, sensitive-data policy, privacy/reporting boundaries and design-system patterns are followed.
- Stage evidence Mermaid: required.

## Human Gates

Remain open:

- final N1 financial correctness and wording review;
- final diagnostic wording and route-rule correctness;
- HR/privacy reporting-boundary approval;
- legal/privacy and real employee/customer data processing approval;
- production content approval;
- reward economy and real fulfillment decisions;
- admin/support production access policy;
- design/accessibility QA on real mobile screens.

## Evidence Rule

Builder evidence and fresh verifier `PASS` are recorded for `MVP-07-diagnostic-n1-learning-progress-001`.

This is scoped `PASS` only. Full `MVP-06`, full `MVP-07`, the MVP stage and all human gates remain open.
