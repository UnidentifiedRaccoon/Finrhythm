# MVP-06 fixture lesson renderer spec freeze

Stage ID: `mvp`
Active slice: `MVP-06-learning-renderer-fixture-001`
Parent stage unit: `MVP-06.03`
Status: `PASS`
Frozen at: 2026-05-11
Builder updated: 2026-05-11
Verifier updated: 2026-05-11
Parent accepted: 2026-05-11
Freezer role: `stage_spec_freezer`

## Objective

Freeze the smallest honest next sprint contract after `MVP-04-mobile-learning-shell-001` PASS.

The next slice should turn the verified mobile learning shell into a fixture-backed lesson rendering surface for one synthetic `N1` lesson. It must stay mobile-first, synthetic-only and narrow. It does not implement CMS/admin publishing, progress persistence, quiz submission, practice submission, points, diagnostics, onboarding, consent or production content approval.

## Source Baseline

Read set used for this freeze:

- `AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`;
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`;
- `docs/stages/MVP.md`;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`;
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`;
- `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png`;
- `.agent/stages/mvp/status.json`;
- `.agent/stages/mvp/backlog.md`;
- `.agent/stages/mvp/progress.md`;
- `.agent/stages/mvp/evidence.json`;
- `.agent/stages/mvp/problems.md`;
- `.agent/stages/mvp/verdict.json`;
- current target stage artifacts needed to avoid overwriting: `.agent/stages/mvp/stage_spec.md`, `.agent/stages/mvp/sprint_contract.md`, `.agent/stages/mvp/feature_list.json`;
- `apps/web/AGENTS.md`;
- relevant `apps/web` files: `package.json`, `app/page.tsx`, `app/learning/page.tsx`, `components/learning-shell.ts`, `lib/learning-types.ts`, `lib/learning-fixtures.ts`, `lib/learning-state.ts`, `tests/learning-shell.test.mjs`, `tests/browser-smoke.mjs`, `app/globals.css`.

No raw evidence files were read for this freeze. No production code was changed.

## Current Verified State To Preserve

- Latest verified sprint is `MVP-04-mobile-learning-shell-001` with fresh verifier `PASS`.
- `apps/web` has a minimal mobile-first learning shell, direct `/` and `/learning` demo entry, Russian neutral copy, loading/empty/error/ready states, `Новичок` N1-N7 synthetic fixture metadata and one `N1` lesson preview.
- Full `MVP-04` is still open.
- `MVP-06` is still open; no production lesson renderer, CMS publishing, progress persistence, quizzes, practice submission, points or wallet are proven.
- `MVP-03` onboarding/privacy/consent and `MVP-07` diagnostics/routing remain deferred and not complete.
- Full `MVP-02` remains `DONE_WITH_HUMAN_PENDING`, not unconditional `DONE`.
- MVP stage remains open.
- Human gates remain open/non-DONE.
- `cohort`, `cohortId` and `cohorts` must not be restored as active MVP domain, API, UI or fixture concepts.

## Decision Rule Application

The preferred rule applies:

`MVP-06-learning-renderer-fixture-001`

Reason: the current `apps/web` shell is sufficient for the next learning slice. The content/methodology docs already define enough draft lesson structure for a synthetic renderer:

- lesson fields and review flags are defined in `content-mvp-spec-v0.1.md`;
- the mobile lesson structure is defined as situation, why, rule, example, mini-test, practice and reward;
- `N1_RESERVE_START` has a draft outline, examples, quiz intents, practice task and sensitive-data policy.

No separate `MVP-06-content-fixture-contract-001` is needed before a fixture-backed renderer. CMS/PostgreSQL schema and production publish validation remain future `MVP-06` scope.

## Scope Decision

Freeze one small `apps/web` implementation sprint for a fixture-backed lesson renderer:

- add a typed synthetic lesson fixture shape aligned to the content spec draft;
- render one full synthetic `N1` lesson surface from fixture data;
- keep the existing direct learning demo entry;
- add a direct demo lesson route or equivalent direct entry for the synthetic `N1` renderer;
- show the required lesson sections without saving completion;
- keep copy Russian, neutral, calm and anti-shame.

This is a learning delivery slice under `MVP-06.03`. It may prepare a renderer contract for future CMS-backed content, but it does not implement CMS/admin, publish validation, diagnostics routing, progress tracking, quizzes as scored submissions, practice submission or points.

## In Scope For The Future Build Sprint

- `apps/web` mobile-first lesson renderer for one synthetic fixture-backed `N1` lesson.
- A direct dev/demo path to the lesson renderer from the existing learning shell.
- A typed local fixture contract covering:
  - lesson identity and title;
  - level and competency metadata;
  - educational disclaimer type;
  - estimated time;
  - mobile blocks: situation, why, rule, example, mini-test, practice and reward;
  - office and store/shift example variants;
  - quiz prompts/options/feedback as display-only or local preview UI;
  - practice prompt with no-photo/no-doc/no-exact-sum guardrails;
  - reward copy without monetary equivalence;
  - human-review flags/status notes.
- Russian neutral UI copy with no customer brand.
- Use the draft design-system baseline for tokens, component patterns, screen states and visual consistency checks.
- Component/unit tests for renderer state, fixture shape, block ordering, guardrails and direct lesson entry.
- Browser/mobile evidence for the lesson renderer on a representative smartphone viewport.
- Guardrail scans for synthetic-only data, no customer brand, no forbidden claims and no active old access terms in changed web source.
- Docs-sync decision recorded in future evidence; canonical docs should remain unchanged unless implementation discovers a concrete contradiction.

## Out Of Scope

- Onboarding, legal/privacy screen, consent version logging or legal text approval.
- Diagnostics engine, diagnostic completion, scoring, route assignment, route explanation or `MVP-07` closure.
- CMS/admin CRUD, content state workflow, publish validation, production lesson source of truth or production-ready content approval.
- Backend/API/schema/OpenAPI/generated-client changes.
- Progress persistence, lesson completion state, scored quiz submission, practice submission, points, wallet, challenge, store, support or HR reports.
- Real employee, customer, personal, diagnostic or financial data.
- Customer brand in employee-facing UI.
- Financial advice, income/gain promises, guaranteed results, guaranteed debt relief or risk-free claims.
- `cohort`, `cohortId` or `cohorts` active-domain restoration.
- Closing `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, the MVP stage or any human gate.

## Acceptance Criteria

1. `apps/web` renders a mobile-first synthetic `N1` lesson through a fixture-backed renderer.
2. Existing `/learning` demo entry remains working and links to or otherwise reaches the synthetic lesson renderer directly.
3. The fixture contract covers the content-spec lesson sections: situation, why, rule, example, mini-test, practice and reward.
4. The rendered lesson includes office and store/shift example variants.
5. The mini-test is clearly preview/local-only and does not claim scored quiz submission or completion.
6. The practice block requires no exact personal income, debt, balance, bank data, photos, documents or screenshots.
7. Reward copy does not imply money, salary, guaranteed merch or guaranteed outcome.
8. UI copy is Russian, neutral, calm and anti-shame.
9. Employee-facing UI contains no customer brand.
10. Fixtures/tests/screenshots/evidence use synthetic data only and no real employee/customer/personal/financial data.
11. No onboarding/consent/diagnostics/routing completion is claimed.
12. `cohort`, `cohortId` and `cohorts` are not restored in active web UI/fixture/API assumptions.
13. Component/unit tests cover the renderer, fixture shape, block ordering, direct entry and guardrails.
14. Browser/mobile evidence is recorded for a representative smartphone viewport.
15. Changed JSON artifacts validate.
16. `git diff --check` is clean.
17. Fresh verifier verdict is scoped only to `MVP-06-learning-renderer-fixture-001`.

## Verification Minimum For The Future Executor

The build sprint must record:

- changed-files scope;
- exact `apps/web` package/root commands used for typecheck, test and build, or honest unavailable-command notes;
- component/unit test output;
- browser smoke output;
- mobile screenshot(s) for the learning entry and lesson renderer;
- synthetic-fixture guardrail scan;
- customer-brand scan;
- forbidden-copy scan for shame, income/gain, guaranteed-result and risk-free language;
- active-source scan for `cohort`, `cohortId` and `cohorts` in changed web code/fixtures;
- docs-sync decision;
- JSON validation for changed machine artifacts;
- `git diff --check`;
- harness validation when possible;
- fresh verifier verdict scoped only to `MVP-06-learning-renderer-fixture-001`.

## Human Gates

No human gate is closed by this freeze or by the future build contract.

Keep these open:

- legal/privacy wording and consent copy;
- real employee/customer data processing;
- customer-specific HR/reporting boundaries;
- final financial correctness of lessons, diagnostics, quizzes and explanations;
- legal/tax review for tax wording;
- HR/privacy wording review for diagnostics, self-assessment and reports;
- reward economy, stock, prices and fulfillment;
- support answer policy for sensitive topics;
- `production_ready` content approval;
- admin auth/role/audit policy for production use.

## Builder Update

`MVP-06-learning-renderer-fixture-001` has fresh verifier `PASS` for a typed synthetic N1 fixture renderer in `apps/web`.
