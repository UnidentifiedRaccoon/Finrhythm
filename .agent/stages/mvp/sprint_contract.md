# Sprint contract: MVP-07-diagnostic-entry-preview-ui-001

Stage: `mvp`
Parent unit: scoped prerequisite for `MVP-07.01` + `MVP-07.03`
Status: `VERIFIED_PASS`
Proof status: `FRESH_VERIFIER_PASS`
Functional passes: `true`
Created: 2026-05-13
Owner role: `stage_builder`

## Purpose

Implement the smallest mobile-first employee diagnostic entry/preview UI in `apps/web` after latest verified `MVP-04-employee-app-ia-nav-001` PASS.

The slice must make diagnostics reachable and understandable from the existing Home/Learning shell, show privacy expectations first, collect a tiny non-persistent preview answer set, and present a safe draft route card without claiming final scoring, final route assignment or personal financial advice.

This is product UI implementation, not a backend/API/schema/OpenAPI/generated-client slice, not a production scoring/routing engine, not a full `MVP-07.01` or `MVP-07.03` closure, and not a human-gate closure.

## Baseline And Source Refs

- Previous verified sprint: `MVP-04-employee-app-ia-nav-001` = `PASS`.
- Latest verified sprint after parent sync: `MVP-07-diagnostic-entry-preview-ui-001` = scoped `PASS`.
- Full `MVP-04`, `MVP-05`, `MVP-06`, `MVP-07`, the MVP stage and human gates remain open.
- Current verified employee path must be preserved:
  `/start -> /onboarding/privacy -> /profile/session -> legal acknowledgement -> generated legal acceptance POST -> contact update screen`.
- Current `apps/web` routes include `/`, `/learning`, `/learning/lessons/[lessonId]`, `/challenges`, `/rewards`, `/support`, `/start`, `/onboarding/privacy`, `/profile/session` and `/profile/contact`.
- Existing lesson routes `/learning/lessons/N1`, `/learning/lessons/N2` and `/learning/lessons/N3` must continue to render.
- Backend baseline remains explicit and unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

Do not read `.agent/stages/**/raw/**` unless a current evidence/problem/audit question names an exact raw ref.

## Required Inputs

Use read-gating from `READ_MATRIX.md` and read only the current sources needed for build:

- `AGENTS.md`;
- `apps/web/AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md` relevant `MVP-05` and `MVP-07` sections;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` diagnostic sections for `Q0`, `SA1-SA3`, `Q1-Q3`, optional `Q4` or `Q7`, and scoring/routing boundaries;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` diagnostic, privacy and choice-card sections;
- current `apps/web` routes/components/tests affected by diagnostic reachability and navigation;
- `.agent/stages/mvp/status.json`;
- this `sprint_contract.md`;
- `.agent/stages/mvp/evidence.json` as current proof index;
- `.agent/stages/mvp/backlog.md`, `.agent/stages/mvp/progress.md`, `.agent/stages/mvp/feature_list.json`.

## Builder First Touch

The first meaningful build step after this freeze must change `apps/web` production/test code, not `.agent`, docs, evidence, verdict or harness files.

Expected first-touch targets:

- `apps/web/app/diagnostics/page.tsx`;
- `apps/web/components/*diagnostic*` or a narrow existing employee shell integration;
- `apps/web/app/page.tsx`, `apps/web/components/employee-home-screen.ts`, `apps/web/components/learning-shell.ts` or equivalent route entry points if reachability needs links;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- `apps/web/app/globals.css` only if existing design-system token classes are insufficient.

Evidence/status/progress artifacts come only after code, focused tests and browser proof exist.

## In Scope

- Add `/diagnostics` route as an employee-facing mobile-first diagnostic preview/entry flow.
- Make `/diagnostics` reachable from Home and preferably also from Learning or Profile if the current shell makes that smaller and coherent.
- Use Russian neutral, anti-shame copy aligned with the existing design-system tone.
- Show Q0 privacy/expectation screen before any self-assessment or routing-preview questions.
- Include `SA1`, `SA2` and `SA3` as pre self-assessment, explicitly non-scoring and not route-determining.
- Include a small synthetic routing-question preview using methodology IDs such as `Q1`, `Q2`, `Q3`, optionally `Q4` or `Q7`.
- Keep question choices as local UI state in memory only for the mounted flow.
- Show visible local progress for the preview flow without implying production diagnostic completion.
- Show a preview route card with safe copy such as `предварительный маршрут` or `черновой preview`.
- Link the preview card to `N1` or `/learning` as a learning handoff, without claiming final `R1-R6` route assignment.
- Preserve existing `EmployeeAppShell` navigation behavior and existing placeholder routes unless the smallest implementation requires a scoped diagnostic entry link.
- Preserve existing `/start -> /onboarding/privacy -> /profile/session` and direct `/profile/contact` safe missing-session behavior.

## Out Of Scope

- Full diagnostic engine, production test lifecycle or completion state.
- Full `Q1-Q27`, `Q28`, `C1-C10` scoring, `R1-R6` route assignment, level assignment or route-rule correctness.
- Backend persistence, browser storage, resume/retry, saved answers, network calls, event tracking or analytics.
- Backend/API/schema/Flyway/OpenAPI/generated-client source changes.
- Manual edits to generated contract artifacts.
- Aggregated HR reports, personal HR reports, admin/CMS/operator surfaces or diagnostic bank management.
- CMS/admin publishing, content states, production content approval or methodologist approve-flow implementation.
- Lesson progress/completion, scored quiz submission, practice submission, points ledger, rewards, store, wallet, redemption or challenge operations.
- Exact personal income, debt, balance, account, photo, document, bank screenshot or required exact-sum request.
- Personal financial, investment, tax, credit, debt or legal advice.
- Customer brand in employee-facing UI.
- Real employee/customer/personal/financial data.
- Full `MVP-07.01`, full `MVP-07.03`, full `MVP-07`, full MVP stage or human-gate closure.

## Acceptance Checklist

- `/diagnostics` route renders a Russian mobile-first diagnostic preview/entry flow.
- The flow is reachable from Home and preferably from Learning or Profile when local shell structure makes that natural.
- Q0 privacy/expectation screen appears before `SA1-SA3` and before any routing-preview question.
- Q0 clearly states that personal diagnostic answers, weak zones, exact sums and reflection details are not personal HR reports by default.
- `SA1`, `SA2` and `SA3` are present and explicitly framed as non-scoring self-assessment.
- The routing-preview portion includes only several synthetic methodology question cards, expected `Q1-Q3` and optionally `Q4` or `Q7`.
- No full `Q1-Q27`, no `Q28`, no production completion state and no production scoring/routing engine is implemented.
- Answers and progress are stored only in component memory for the mounted preview flow.
- No localStorage, sessionStorage, cookies, IndexedDB, URL/query/hash answer handoff, backend call or network submission is introduced for diagnostic answers.
- The preview result uses safe wording like `предварительный маршрут` or `черновой preview` and does not claim final scoring completion, final level or final `R1-R6` assignment.
- The preview may link to `N1` or `/learning`, but must not claim the user completed diagnostics or earned progress/points.
- The UI requests no exact income, debt, balance, account, photo, document or bank screenshot.
- The UI gives no personal financial, investment, tax, credit, debt or legal advice.
- The UI creates no HR personal report and no claim that HR sees individual diagnostic answers.
- Existing `/start -> /onboarding/privacy -> /profile/session` path still works.
- Existing `/learning` and `/learning/lessons/N1|N2|N3` routes still render.
- Existing `/profile/session` legal acknowledgement/acceptance ordering and `/profile/contact` safe missing-session state remain intact.
- Russian copy is calm, neutral, anti-shame and has no customer brand.
- No real data, raw invite code, profile-session token, customer brand, forbidden financial claim or money/cash-equivalence wording appears in source/tests/screenshots/logs/evidence.
- No backend/API/schema/OpenAPI/generated-client files are changed.
- Canonical docs-sync decision and Mermaid evidence decision are recorded.
- Backend baseline is explicitly preserved: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Functional `passes=false` remains until builder evidence and fresh verifier PASS exist.

## Required Validation

The builder must run and record:

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- `pnpm --filter @finrhythm/web smoke:browser` or the existing `apps/web` browser smoke command with explicit `WEB_SMOKE_*` refs.
- Browser/mobile smoke and screenshots for Home, `/diagnostics` Q0, `SA1-SA3`, question preview, draft route preview, `/learning`, `/learning/lessons/N1`, `/learning/lessons/N2`, `/learning/lessons/N3`, and `/start -> /onboarding/privacy -> /profile/session`.
- Guardrail scans for Q0-before-questions, `SA1-SA3` non-scoring, no full `Q1-Q27`, no `Q28`, no `R1-R6` final assignment, no exact sums/photos/docs/bank screenshots, no personal advice, no HR personal report, no persistence/storage/network/backend/API/generated-client changes, no token/url/storage leakage, no raw invite echo, no real data, no customer brand, no money/cash-equivalence wording and no forbidden financial claims.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`.
- Root checks if feasible: `make verify`, `make test-unit`, `make build`.
- Fresh `stage_verifier` after builder evidence before any PASS claim.

## Evidence Handoff Required

The builder must record:

- changed production/test files;
- browser-smoke raw refs and screenshots;
- command raw refs;
- guardrail scan raw refs;
- diagnostic preview flow map;
- docs-sync decision and exact canonical doc targets if changed;
- Mermaid diagnostic preview flow in evidence;
- backend baseline unchanged note;
- human gates preserved;
- explicit out-of-scope confirmation for full diagnostic engine, `Q1-Q27`, `Q28`, `R1-R6`, scoring correctness, backend/API/schema/OpenAPI/generated-client, persistence/storage/network, HR reports, points/rewards and full `MVP-07` closure;
- immutable evidence/verdict/problems refs for `MVP-07-diagnostic-entry-preview-ui-001`.

## Doc Targets And Diagram Expectations

- Canonical docs target: `NOOP_EXPECTED` if the implementation follows existing MVP stage, methodology and design-system baselines and implements only a preview UI.
- Update `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` only if the builder changes diagnostic/privacy/choice-card component expectations.
- Update `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` only if the builder changes diagnostic IDs, wording semantics, scoring/routing assumptions or self-assessment rules.
- Update `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` only if the builder changes product privacy/reporting or employee learning-loop decisions.
- Stage evidence must include a small Mermaid diagnostic preview flow.
- Mermaid expectation: `EXPECTED_IN_EVIDENCE`.

## Human Gates That Remain Open

- Final Q/SA wording review.
- Scoring correctness and route-rule correctness.
- Final financial correctness of diagnostic questions and explanations.
- HR/privacy wording and reporting-boundary approval.
- Legal/privacy boundaries and real employee/customer data processing approval.
- Design/accessibility QA on real mobile screens.

## Freeze Limitation

This contract now has builder evidence and a fresh `stage_verifier` `PASS` for the scoped preview UI sprint only. It creates no `MVP-07.01` / `MVP-07.03` closure decision; full `MVP-07`, the MVP stage and human gates remain open.
