# Task: MVP-06-learning-n2-fixture-001

Stage: `mvp`
Parent unit: `MVP-06.03`
Status: `PASS_PENDING_PARENT_ALIAS_SYNC`
Created: 2026-05-12
Owner role: stage_spec_freezer

Builder update: 2026-05-12. Implementation evidence exists for the synthetic N2 fixture, `/learning/lessons/N2`, `/learning` CTA, focused web checks and browser/mobile screenshots.

Verifier update: 2026-05-12. Fresh scoped verifier returned `PASS` for this task only and wrote `.agent/stages/mvp/verdicts/MVP-06-learning-n2-fixture-001.json` plus `.agent/stages/mvp/problems/MVP-06-learning-n2-fixture-001.md`. Parent latest-alias sync remains pending as a separate decision.

## Purpose

Add one additional synthetic `N2` savings-challenge lesson fixture to the existing `apps/web` fixture-backed lesson renderer and link it from `/learning`.

This task follows the verified `MVP-04-design-system-tokenization-001` baseline and the existing `MVP-06-learning-renderer-fixture-001` renderer proof. It is intentionally limited to a second synthetic fixture and route/link coverage; it is not a CMS, progress, challenge, points or production-content implementation.

## Inputs

- `AGENTS.md`
- `apps/web/AGENTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`
- `docs/stages/MVP.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, especially N2
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`, especially N2 and 6-week challenge fields
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`
- current `.agent/stages/mvp/status.json`, `.agent/stages/mvp/evidence.json`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md`, `.agent/stages/mvp/progress.md`, `.agent/stages/mvp/backlog.md`, `.agent/stages/mvp/feature_list.json`
- current `apps/web` fixture renderer files and tests.

## Scope

Implement only:

- one synthetic `N2` fixture for `N2_SAVINGS_CHALLENGE_START`;
- direct renderer access to N2, expected as `/learning/lessons/N2`;
- a `/learning` link or CTA to open N2 while keeping N1 available;
- fixture-rendered N2 blocks: situation, why, rule, example, mini-test, practice and reward;
- office and store/shift examples for different work rhythms;
- display-only mini-test preview;
- non-persistent practice for choosing savings rhythm, goal category and first check-in concept;
- reward guardrail block styled with amber/warning-soft tokens;
- focused tests and browser/mobile smoke evidence.

## Explicit Non-Goals

- CMS/admin publishing, admin content CRUD, content states, publish validation or production-ready approval.
- Progress persistence.
- Scored quiz submission.
- Practice submission.
- Points/wallet, points ledger, reward catalog, merch, raffle, random reward or fulfillment behavior.
- Diagnostics/routing.
- Onboarding/consent.
- Backend/API/schema/OpenAPI/generated-client changes.
- `packages/ui` changes.
- Admin UI, HR dashboard, reports, analytics hooks or event tracking.
- Real employee/customer/personal/diagnostic/financial data.
- Customer brand in employee-facing UI.
- Old cohort/wave terms in active employee-facing code.
- Closing full `MVP-04`, full `MVP-06`, `MVP-07`, `MVP-09`, the MVP stage or human gates.

## Acceptance Checklist

- `N2` fixture exists and is synthetic-only.
- Direct N2 route works through the existing lesson renderer.
- `/learning` exposes a visible N2 link/CTA.
- N2 content uses office and store examples.
- Mini-test is display-only and non-submitting.
- Practice is non-persistent and category/fact-only.
- No exact personal sums, photos, documents or bank screenshots are required or requested.
- Reward copy and styling use amber/warning-soft guardrails and avoid money/cash-equivalence/guaranteed-result claims.
- No customer brand appears in employee UI.
- No active old cohort terms are restored.
- No production CMS/admin/progress/quiz/practice/points/diagnostics/onboarding/backend/generated-client/`packages/ui` implementation is added.
- Full `MVP-04`, full `MVP-06`, the MVP stage and human gates remain open.

## Required Validation

- `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json`
- `git diff --check -- <changed files>`
- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- strict UI smoke/browser smoke for `/learning` and `/learning/lessons/N2` if implementation follows;
- guardrail scans for synthetic-only content, no customer brand, no old cohort terms, no exact personal sums/photos/docs/bank screenshots and no unsafe reward/cash-equivalence claims;
- Java blocker recorded if unqualified `java` is unavailable;
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`, with any expected active/latest alias mismatch reported honestly.

## Evidence Handoff

Builder evidence must map every acceptance item to proof and include:

- affected IDs: `N2_SAVINGS_CHALLENGE_START`, `N2_SAVINGS_6W_PILOT_MAIN`, `C3`, `C8`, `C2`;
- source mapping to methodology/content/design-system docs;
- changed files;
- web command outputs;
- browser/mobile screenshots;
- tests for fixture shape, direct route and `/learning` CTA;
- display-only mini-test and non-persistent practice proof;
- amber/warning-soft reward guardrail proof;
- synthetic-only, customer-brand, sensitive-data and old-term scans;
- docs-sync decision;
- JSON, whitespace and harness validation;
- Java runtime blocker/proof;
- fresh verifier verdict/problems refs.

## Human Gates That Remain Open

- Legal/privacy wording and consent copy.
- Real employee/customer data processing.
- Customer-specific HR/reporting boundaries.
- Final financial correctness of lessons, diagnostics, quizzes and explanations.
- HR/privacy wording review for diagnostics, self-assessment and reports.
- Reward economy, stock, prices and fulfillment.
- `production_ready` content approval.
- Admin auth/role/audit policy for production use.
