# Task: MVP-06-learning-renderer-fixture-001

Stage: `mvp`
Parent unit: `MVP-06.03`
Status: `PASS`
Created: 2026-05-11
Builder updated: 2026-05-11
Verifier updated: 2026-05-11
Parent accepted: 2026-05-11
Owner role: stage_builder

## Purpose

Implement a tiny fixture-backed mobile lesson renderer for one synthetic `N1` lesson in `apps/web`.

The task builds on the verified `MVP-04-mobile-learning-shell-001` shell. It should prove that the employee-facing learning surface can render the lesson template from structured fixture data without implementing CMS, production content publishing, diagnostics routing, progress persistence, quiz submission, practice submission or points.

## Inputs

- `AGENTS.md`
- `apps/web/AGENTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`
- `docs/stages/MVP.md`
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`
- `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/backlog.md`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/problems.md`
- `.agent/stages/mvp/verdict.json`
- `.agent/stages/mvp/sprint_contract.md`
- relevant current `apps/web` shell files and tests.

Read raw evidence only by exact ref if a concrete verification question requires it.

## In Scope

- Add one synthetic `N1` lesson fixture with a typed renderer contract.
- Render a mobile-first lesson surface from that fixture.
- Keep or extend the existing direct learning demo entry so the lesson renderer is reachable.
- Render situation, why, rule, example, mini-test, practice and reward sections.
- Include office and store/shift example variants.
- Keep mini-test behavior local/display-only and non-persistent.
- Keep practice non-persistent and free of exact personal sums, photos, documents and bank screenshots.
- Use Russian neutral copy and explicit education/sensitive-data boundaries.
- Use the draft design-system baseline for tokens, component states, layout rhythm and visual consistency checks.
- Add component/unit tests for renderer structure, fixture shape, block order, direct entry and guardrails.
- Capture browser/mobile evidence for the lesson renderer.
- Record scans for synthetic-only data, no customer brand, no forbidden claims and no active old access terms.

## Out Of Scope

- Onboarding, privacy screen, legal consent, consent logging or legal approval.
- Diagnostics completion, scoring, routing or route explanation.
- CMS/admin content CRUD, content states, publish validation or production-ready content approval.
- Full production lesson delivery, persisted progress, scored quiz submission, practice submission, points or wallet.
- Backend/API/schema/OpenAPI/generated-client changes.
- Real employee, customer, personal, diagnostic or financial data.
- Customer brand in employee UI.
- `cohort`, `cohortId` or `cohorts` restoration.
- Closing `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, full MVP or human gates.

## Acceptance Checklist

- `apps/web` synthetic `N1` lesson renderer is mobile-first and runnable.
- Existing `/learning` demo entry still works and reaches the renderer.
- Fixture contract covers situation, why, rule, example, mini-test, practice and reward sections.
- Office and store/shift examples render.
- Mini-test does not claim persistent scored submission or completion.
- Practice requires no exact personal income, debt, balance, bank data, photo, document or screenshot.
- Reward copy does not imply money, salary, guaranteed merch or guaranteed outcome.
- Copy is Russian, neutral, calm and anti-shame.
- Employee UI contains no customer brand.
- Fixtures/tests/screenshots/evidence use no real employee/customer/personal/financial data.
- No onboarding/consent/diagnostics/routing completion is claimed.
- Changed active web code/fixtures do not restore `cohort`, `cohortId` or `cohorts`.
- Component/unit tests pass for the renderer, fixture shape, block order, direct entry and guardrails.
- Browser smoke and mobile screenshot evidence are recorded.
- JSON artifacts validate.
- `git diff --check` passes.
- Fresh verifier is scoped only to `MVP-06-learning-renderer-fixture-001`.

## Evidence Handoff Required

The builder must record:

- changed-files scope;
- web/root command outputs;
- component/unit test output;
- browser smoke output;
- mobile screenshots;
- synthetic fixture scan;
- customer-brand scan;
- forbidden-copy scan;
- active old-access-terminology scan for changed web files;
- docs-sync decision;
- JSON validation;
- `git diff --check`;
- harness validation when possible;
- fresh verifier verdict/problems refs.

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

## Builder Handoff

Implementation is complete and builder evidence is recorded under `.agent/stages/mvp/evidence/MVP-06-learning-renderer-fixture-001.*` plus raw refs with prefix `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-renderer-fixture-001-*`.

Fresh verifier returned `PASS` for `MVP-06-learning-renderer-fixture-001` only. Full `MVP-06`, `MVP-03`, full `MVP-04`, `MVP-07`, the MVP stage and all human gates remain open.
