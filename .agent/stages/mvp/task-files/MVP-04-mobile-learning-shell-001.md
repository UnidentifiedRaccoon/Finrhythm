# Task: MVP-04-mobile-learning-shell-001

Stage: `mvp`
Parent unit: `MVP-04.04`
Status: `PASS`
Created: 2026-05-11
Builder updated: 2026-05-11
Verifier updated: 2026-05-11
Parent accepted: 2026-05-11
Owner role: stage_builder

## Purpose

Implement the first minimal employee-facing `apps/web` mobile learning shell: a direct learning entry, a `Новичок` track entry and one synthetic lesson preview.

This task starts the educational surface without waiting for deferred onboarding/privacy/consent or diagnostics/routing decisions. It must not claim those flows are complete.

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
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/backlog.md`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/problems.md`
- `.agent/stages/mvp/verdict.json`
- `.agent/stages/mvp/sprint_contract.md`

Read raw evidence only by exact ref if a concrete verification question requires it.

## In Scope

- Create or complete the minimal `apps/web` mobile-first app shell needed for learning.
- Add a direct dev/demo route into learning.
- Render a neutral employee-facing shell with Russian copy.
- Render a `Новичок` track entry using synthetic fixture metadata for `N1-N7`.
- Render one lesson preview from a synthetic fixture.
- Include loading, empty, error and ready states.
- Add component/unit tests for the shell, track entry, preview and states.
- Capture browser/mobile evidence for the learning entry and preview.
- Record guardrail evidence for synthetic-only data, no customer brand, no active cohort terminology and no forbidden financial/shame claims.

## Out Of Scope

- Onboarding, privacy screen, legal consent, consent logging or legal approval.
- Diagnostics completion, scoring, routing or route explanation.
- CMS/admin content CRUD, publish validation or production-ready content approval.
- Full production lesson renderer.
- Progress persistence, quiz submission, practice submission, points or wallet.
- Backend/API/schema/OpenAPI/generated-client changes.
- Real employee, customer, personal, diagnostic or financial data.
- Customer brand in employee UI.
- `cohort`, `cohortId` or `cohorts` restoration.
- Closing `MVP-03`, `MVP-04`, `MVP-06`, `MVP-07`, full MVP or human gates.

## Acceptance Checklist

- `apps/web` learning shell is mobile-first and runnable.
- Direct dev/demo entry reaches learning without onboarding, consent, diagnostics or routing.
- `Новичок` track entry and one lesson preview render from synthetic fixtures.
- Copy is Russian, neutral, calm and anti-shame.
- Employee UI contains no customer brand.
- Fixtures/tests/screenshots/evidence use no real employee/customer/personal/financial data.
- UI copy makes no income, fast-gain, guaranteed-result or risk-free promise.
- Changed active web code/fixtures do not restore `cohort`, `cohortId` or `cohorts`.
- Component/unit tests pass for the introduced surface and states.
- Browser smoke and mobile screenshot evidence are recorded.
- JSON artifacts validate.
- `git diff --check` passes.
- Fresh verifier is scoped only to `MVP-04-mobile-learning-shell-001`.

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
- active cohort-terminology scan for changed web files;
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
