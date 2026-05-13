# MVP-07 diagnostic entry preview UI spec freeze

Stage: `mvp`
Active slice: `MVP-07-diagnostic-entry-preview-ui-001`
Parent stage unit: scoped prerequisite for `MVP-07.01` and `MVP-07.03`
Role: `stage_spec_freezer`
Status: `VERIFIED_PASS`
Date: 2026-05-13

## Freeze Goal

Freeze the next smallest product implementation slice after latest verified `MVP-04-employee-app-ia-nav-001` PASS: an employee-facing `apps/web` diagnostic entry/preview flow that lets a user understand privacy, answer a few non-persistent preview questions and see a safe draft route card.

This is a UI-only preview prerequisite for future diagnostic engine and route explanation work. It must reduce uncertainty for `MVP-07.01` and `MVP-07.03`, but it must not mark either full unit complete.

## Current Baseline

- Latest verified sprint: `MVP-04-employee-app-ia-nav-001` = `PASS`.
- Full `MVP-04`, `MVP-05`, `MVP-06`, `MVP-07`, the MVP stage and human gates remain open.
- Current verified employee path must be preserved:
  `/start -> /onboarding/privacy -> /profile/session -> legal acknowledgement -> generated legal acceptance POST -> contact update screen`.
- Current `apps/web` routes include `/`, `/learning`, `/learning/lessons/[lessonId]`, `/challenges`, `/rewards`, `/support`, `/start`, `/onboarding/privacy`, `/profile/session` and `/profile/contact`.
- Existing learning fixtures expose `N1`, `N2` and `N3`; production CMS/progress/scoring is still out of scope.
- Backend baseline remains explicit and unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Frozen Slice

`MVP-07-diagnostic-entry-preview-ui-001` is a functional `apps/web` UI slice.

The future builder must implement only the smallest mobile-first diagnostic preview/entry flow reachable from the existing Home/Learning shell:

- `/diagnostics` route;
- Russian mobile-first UI using existing app shell/design tokens where practical;
- Q0 privacy/expectation screen before any questions;
- pre self-assessment `SA1` through `SA3`, explicitly non-scoring;
- a small synthetic routing-question preview using methodology IDs such as `Q1`, `Q2`, `Q3`, optionally `Q4` or `Q7`;
- local in-memory answers and progress only;
- safe draft result card using wording like `предварительный маршрут` or `черновой preview`;
- link to `N1` or `/learning` without claiming diagnostic completion, final scoring or final route assignment.

## Out Of Scope

- Full diagnostic engine or production test flow.
- Full `Q1-Q27`, `Q28`, completion state, retry/resume behavior or production 7-12 minute diagnostic.
- `R1-R6` route assignment, scoring correctness, level assignment, strong/weak-zone correctness or final financial advice.
- Backend persistence, local/session storage, network submission, API, schema, Flyway, OpenAPI or generated-client changes.
- Event tracking, analytics taxonomy, aggregated HR diagnostic reports or personal HR report surfaces.
- CMS/admin, diagnostic bank editor, content publish states or production content approval.
- Lesson progress/completion, quiz/practice submissions, points, rewards, wallet, merch or challenge operations.
- Exact income, debt, balance, account, photo, document, bank screenshot or other sensitive artifact requests.
- Customer brand in employee UI, real employee/customer/personal/financial data or production legal/privacy wording approval.
- Full `MVP-07.01`, full `MVP-07.03`, full `MVP-07`, full MVP stage or human-gate closure.

## Doc Targets And Diagram Expectations

- Canonical docs target: `NOOP_EXPECTED` if the builder follows current MVP stage, methodology and design-system baselines and implements only a preview UI.
- Update `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` only if the builder changes diagnostic/privacy/choice-card component expectations.
- Update `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` only if the builder changes diagnostic IDs, wording semantics, scoring/routing assumptions or self-assessment rules.
- Update `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` only if the builder changes product privacy/reporting or employee learning-loop decisions.
- Stage evidence must include a compact Mermaid flow for the implemented diagnostic preview.
- Mermaid expectation: `EXPECTED_IN_EVIDENCE`.

## Human Gates

Remain open and must not be marked `DONE` by this slice:

- final Q/SA wording review;
- scoring correctness and route-rule correctness;
- final financial correctness of diagnostic questions and explanations;
- HR/privacy wording and reporting-boundary approval;
- legal/privacy boundaries and real employee/customer data processing approval;
- design/accessibility QA on real mobile screens.

## Evidence Rule

This freeze records scope only. Keep functional/status `passes=false` for `MVP-07-diagnostic-entry-preview-ui-001` until builder evidence and a fresh `stage_verifier` PASS exist.
