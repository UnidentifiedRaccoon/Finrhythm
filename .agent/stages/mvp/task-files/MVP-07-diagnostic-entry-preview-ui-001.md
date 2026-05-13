# Task file: MVP-07-diagnostic-entry-preview-ui-001

Stage: `mvp`
Sprint contract: `MVP-07-diagnostic-entry-preview-ui-001`
Parent unit: scoped prerequisite for `MVP-07.01` + `MVP-07.03`
Status: `VERIFIED_PASS`
Functional passes: `true`
Created: 2026-05-13

## Builder Mission

Build one narrow `apps/web` UI-only diagnostic entry/preview slice:

- `/diagnostics` route reachable from the existing Home/Learning shell;
- Q0 privacy/expectation screen before questions;
- pre self-assessment `SA1-SA3`, explicitly non-scoring;
- several synthetic methodology question cards, expected `Q1-Q3` and optionally `Q4` or `Q7`;
- local in-memory answers/progress only;
- safe draft route card using wording like `предварительный маршрут` or `черновой preview`;
- link to `N1` or `/learning` without claiming scoring completion or final route assignment.

## Required First Touch

The first meaningful builder touch must be production/test code under `apps/web`, not stage artifacts or docs.

Expected first-touch targets include:

- `apps/web/app/diagnostics/page.tsx`;
- diagnostic component files under `apps/web/components/`;
- route-entry links in existing Home/Learning/Profile shell files;
- focused updates to `apps/web/tests/learning-shell.test.mjs` and `apps/web/tests/browser-smoke.mjs`.

## Acceptance Guardrails

- Q0 precedes `SA1-SA3` and all routing-preview questions.
- `SA1-SA3` are non-scoring and not route-determining.
- No full `Q1-Q27`, no `Q28`, no final scoring engine and no final `R1-R6` route assignment.
- No exact income/debt/balance/account, photo, document or bank screenshot request.
- No personal financial, investment, tax, credit, debt or legal advice.
- No HR personal report and no claim that HR sees individual diagnostic answers.
- No persistence/storage/network/backend/API/schema/OpenAPI/generated-client changes.
- Existing `/start -> /onboarding/privacy -> /profile/session` and `/learning/lessons/N1|N2|N3` behavior is preserved.
- Russian copy remains calm, neutral and anti-shame.
- Backend baseline is unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Validation Required From Builder

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- web browser smoke with screenshots for Home, `/diagnostics` stages, learning handoff and preserved profile path
- guardrail scans for privacy/order, non-scoring SA, no persistence/network/backend/API scope, no full diagnostic/scoring/route claim and no forbidden sensitive-data/advice wording
- `jq empty` for changed JSON artifacts
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`
- root `make verify`, `make test-unit`, `make build` if feasible
- fresh `stage_verifier` before any PASS claim

## Documentation And Evidence

- Canonical docs target is `NOOP_EXPECTED` if implementation follows current methodology/design/product baselines and remains preview-only.
- Stage evidence must include a compact Mermaid diagnostic preview flow.
- Record screenshots, command raw refs, guardrail raw refs, docs-sync decision, backend baseline unchanged note, preserved human gates and explicit out-of-scope confirmation.

## Out Of Scope

Full diagnostic engine, production Q-bank completion, `Q28`, `R1-R6`, scoring correctness, backend persistence, resume/retry, event tracking, HR reports, CMS/admin, lesson progress/completion, quiz/practice submissions, points/rewards, final financial/legal/HR wording approval, full `MVP-07.01`, full `MVP-07.03`, full `MVP-07`, full MVP stage and human-gate closure.
