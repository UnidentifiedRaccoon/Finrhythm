# Sprint contract: MVP-06-learning-n2-fixture-001

Stage: `mvp`
Parent unit: `MVP-06.03`
Status: `FROZEN`
Created: 2026-05-12
Owner role: stage_spec_freezer

## Purpose

Freeze the smallest next implementation slice after `MVP-04-design-system-tokenization-001`: add one additional synthetic `N2` savings-challenge lesson fixture to the existing `apps/web` fixture-backed lesson renderer and link it from `/learning`.

This is a planning artifact only. It does not implement production code, change canonical docs, rewrite latest evidence/verdict/problems aliases, or close full `MVP-04`, full `MVP-06`, the MVP stage or any human gate.

## Inputs

- `AGENTS.md`
- `apps/web/AGENTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`
- `docs/stages/MVP.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/verdict.json`
- `.agent/stages/mvp/problems.md`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/backlog.md`
- `.agent/stages/mvp/feature_list.json`
- current `apps/web` fixture renderer files and tests.

Raw evidence remains read-gated: read `.agent/stages/mvp/raw/**` only by exact ref if a concrete verification question requires it.

## In Scope

- Extend the existing typed `apps/web` fixture-backed lesson set with one synthetic `N2` lesson fixture for `N2_SAVINGS_CHALLENGE_START`.
- Reuse the existing lesson renderer route pattern so `N2` has a direct route, expected as `/learning/lessons/N2` unless the current renderer contract requires the canonical lesson id alias as an additional accepted route.
- Link `/learning` to the `N2` direct route with a visible CTA from the N2 row/card while preserving the existing N1 route.
- Keep all content synthetic-only and editorial-draft/human-review-required.
- Render the N2 lesson structure from the content baseline: situation, why it matters, rule, office/store examples, display-only mini-test, non-persistent practice and reward guardrail block.
- Include office and store/shift examples for different salary/schedule rhythms.
- Keep the mini-test display-only: no scored quiz submission, no pass/fail persistence and no completion claim.
- Keep practice non-persistent and category/fact-only: choose savings rhythm, goal category and first check-in concept without saving personal finance data.
- Use `color-amber` only for reward/points emphasis and `color-warning-soft` / warning-soft reward surfaces for the reward guardrail styling, following the design-system baseline.
- Add focused tests for fixture shape, N2 route resolution, `/learning` link/CTA, display-only mini-test, non-persistent practice, reward color guardrails and forbidden-data/brand/old-term scans.
- Capture strict UI/browser smoke and mobile screenshot evidence if implementation follows this freeze.

## Out Of Scope

- CMS/admin publishing, admin content CRUD, content states, publish validation or production-ready content approval.
- Progress persistence across lessons, tests, practice tasks or challenge check-ins.
- Scored quiz submission, quiz pass/fail recording or quiz analytics submission.
- Practice submission, saved practice answers, saved challenge start, reminders or weekly check-in persistence.
- Points accrual, points ledger, wallet, reward catalog, merch, raffle, random reward or fulfillment behavior.
- Diagnostics completion, scoring, routing, route explanations or personalized route generation.
- Onboarding, privacy screen, legal consent, consent logging or legal approval.
- Backend/API/schema/OpenAPI/generated-client changes.
- `packages/ui` changes or shared component extraction.
- Admin UI, HR dashboard, reports, analytics hooks or event tracking.
- Real employee, customer, personal, diagnostic or financial data.
- Customer brand in employee-facing UI.
- Old cohort/wave domain terminology in active employee-facing code (`cohort`, `cohortId`, `cohorts`).
- Closing `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, `MVP-09`, the MVP stage or any human gate.

## Acceptance Checklist

- `apps/web` contains one additional synthetic `N2` lesson fixture aligned to `N2_SAVINGS_CHALLENGE_START` / `N2_SAVINGS_6W_PILOT_MAIN`.
- `N2` has a direct route through the existing fixture-backed lesson renderer, expected as `/learning/lessons/N2`.
- `/learning` contains a visible link or CTA to open the `N2` lesson while preserving the existing N1 entry.
- N2 fixture content is synthetic-only, Russian, neutral, calm and anti-shame.
- Office and store/shift examples render for the N2 savings-challenge scenario.
- Mini-test is display-only and does not claim scored submission, persistence, pass/fail completion or points.
- Practice is non-persistent and does not submit or save challenge start, reminders, weekly check-ins or personal finance details.
- Practice avoids exact personal sums, exact income/debt/balance, photos, documents and bank screenshots; allowed data is category/fact-only.
- Reward section uses amber/warning-soft guardrails and does not imply money, salary, guaranteed merch, guaranteed savings result, random reward or cash equivalence.
- Employee UI contains no customer brand.
- Active changed web files do not restore old cohort terms (`cohort`, `cohortId`, `cohorts`).
- No CMS/admin publishing, progress persistence, scored quiz submission, practice submission, points/wallet, diagnostics/routing, onboarding/consent, backend/API/schema/OpenAPI/generated-client or `packages/ui` implementation is introduced.
- Full `MVP-04`, full `MVP-06`, the MVP stage and all human gates remain open.

## Required Validation For Builder

- `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json`
- `git diff --check -- <changed files>`
- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Strict UI smoke/browser smoke for `/learning` and the N2 direct route, with mobile screenshots, if implementation follows.
- Guardrail scans for synthetic-only content, no customer brand, no old cohort terms, no exact personal sums/photos/docs/bank screenshots and no unsafe reward/cash-equivalence claims.
- Record a Java blocker if unqualified `java` is unavailable; do not claim Java-backed root verification when `java -version` cannot locate a runtime.
- Run `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`; while this task is active and latest aliases still point to `MVP-04-design-system-tokenization-001`, an active/latest mismatch is acceptable only if reported honestly.

## Evidence Handoff Required

The builder must record:

- changed files and explicit non-goals;
- N2 affected IDs: `N2_SAVINGS_CHALLENGE_START`, `N2_SAVINGS_6W_PILOT_MAIN`, `C3`, `C8`, `C2`;
- source mapping to learning methodology and content spec sections;
- web command outputs;
- browser smoke and mobile screenshot refs;
- fixture, route and link/CTA test output;
- display-only quiz and non-persistent practice proof;
- amber/warning-soft reward guardrail proof;
- synthetic-only, no-brand, no-old-term and sensitive-data scans;
- docs-sync decision;
- JSON validation and `git diff --check`;
- Java runtime blocker or proof;
- fresh verifier verdict/problems refs after implementation.

## Human Gates That Remain Open

- Legal/privacy wording and consent copy.
- Real employee/customer data processing.
- Customer-specific HR/reporting boundaries.
- Final financial correctness of lessons, diagnostics, quizzes and explanations.
- Legal/tax review for tax wording.
- HR/privacy wording review for diagnostics, self-assessment and reports.
- Reward economy, stock, prices and fulfillment.
- Support answer policy for sensitive topics.
- `production_ready` content approval.
- Admin auth/role/audit policy for production use.

## Freezer Handoff

This freezer changed only planning artifacts and did not implement production code. Latest verified sprint remains `MVP-04-design-system-tokenization-001`; latest evidence/verdict/problems aliases remain untouched.
