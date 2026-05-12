# Task: MVP-06-learning-n3-fixture-001

Stage: `mvp`
Parent unit: `MVP-06.03`
Status: `FROZEN`
Created: 2026-05-12
Owner role: stage_spec_freezer

## Purpose

Add one synthetic renderable `N3` decluttering and safe-sale lesson fixture for `N3_DECLUTTER_TO_GOAL` to the existing `apps/web` fixture-backed lesson renderer, expose it from `/learning` with a visible CTA and smoke `/learning/lessons/N3`.

This task follows verified `MVP-06-learning-n2-fixture-001` and is intentionally renderer/fixture-only. It does not implement CMS/admin publishing, production content approval, persistence, scoring, challenge saving, points/wallet, diagnostics/routing, onboarding/consent, backend/API/schema/OpenAPI/generated-client, `packages/ui`, analytics or real data.

## Inputs

- `AGENTS.md`
- `apps/web/AGENTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`
- `docs/stages/MVP.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, N3 and Q10/Q11/Q12 sections
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`, `N3_DECLUTTER_TO_GOAL`, `DC_DECLUTTER_ONE` and sensitive-data policy sections
- `content/getcourse-finstrategy/12-lesson-235010153.md`, exact source ref with `humanReview: "required"`
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`
- current `.agent/stages/mvp/status.json`, `.agent/stages/mvp/evidence.json`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md`, `.agent/stages/mvp/progress.md`, `.agent/stages/mvp/backlog.md`, `.agent/stages/mvp/feature_list.json`
- current `apps/web` renderer/test files:
  - `apps/web/lib/learning-fixtures.ts`
  - `apps/web/lib/learning-types.ts`
  - `apps/web/lib/lesson-state.ts`
  - `apps/web/components/learning-shell.ts`
  - `apps/web/components/lesson-renderer.ts`
  - `apps/web/app/learning/page.tsx`
  - `apps/web/app/learning/lessons/[lessonId]/page.tsx`
  - `apps/web/app/globals.css`
  - `apps/web/tests/learning-shell.test.mjs`
  - `apps/web/tests/browser-smoke.mjs`

## Scope

Implement only:

- one synthetic `N3` fixture for `N3_DECLUTTER_TO_GOAL`;
- direct renderer access to N3 at `/learning/lessons/N3`;
- optional full lesson-id alias resolution through the existing resolver if current pattern supports it;
- a `/learning` CTA to open N3 while keeping N1 and N2 available;
- fixture-rendered N3 blocks: situation, why, rule, example, mini-test, practice and reward;
- office and store/shift examples;
- display-only mini-test preview with safe-sale questions aligned to `Q10`, `Q11` and `Q12`;
- non-persistent `checklist + choice` practice for item count/range, safety checklist and destination category;
- reward guardrail block with amber/warning-soft tokens and no unsafe reward claims;
- `editorial_draft` / `humanReviewRequired: true` content status;
- focused tests and browser/mobile smoke evidence.

## Affected IDs

- `N3`
- `N3_DECLUTTER_TO_GOAL`
- `DC_DECLUTTER_ONE`
- `C4`
- `C3`
- `C9`
- `Q10`
- `Q11`
- `Q12`

## Explicit Non-Goals

- CMS/admin publishing, admin content CRUD, content states, publish validation or production-ready approval.
- Progress persistence.
- Scored quiz submission.
- Practice submission.
- Saved listing, saved challenge, saved daily challenge, reminders or check-in persistence.
- Points/wallet, points ledger, reward catalog, merch, raffle, random reward or fulfillment behavior.
- Diagnostics/routing.
- Onboarding/consent.
- Backend/API/schema/OpenAPI/generated-client changes.
- `packages/ui` changes.
- Admin UI, HR dashboard, reports, analytics hooks or event tracking.
- Real employee/customer/personal/diagnostic/financial data.
- Customer brand in employee-facing UI.
- Old cohort/wave terms in active employee-facing code.
- Closing onboarding/consent, diagnostics/routing, progress persistence, scored quiz submission, practice submission, points/wallet, CMS/admin publishing or production content approval.
- Closing full `MVP-04`, full `MVP-06`, `MVP-07`, `MVP-09`, the MVP stage or human gates.

## Acceptance Checklist

- `N3` fixture exists and is synthetic-only.
- Direct N3 route works through the existing lesson renderer.
- Existing resolver supports the full lesson id `N3_DECLUTTER_TO_GOAL` if that alias pattern is already present.
- `/learning` exposes a visible N3 link/CTA while preserving N1 and N2 links/CTAs.
- N3 content uses office and store examples.
- Mini-test is display-only, includes safe-sale questions and does not submit, persist, score, complete or award points.
- Practice is non-persistent `checklist + choice`.
- No photos, address, listing URLs, deal amount, buyer chat, payment screenshot, bank screenshot, exact personal sums, documents or bank-app evidence are required or requested.
- Reward copy and styling use amber/warning-soft guardrails and avoid money/cash-equivalence/guaranteed-result/random-reward claims.
- Fixture review status is `editorial_draft` and `humanReviewRequired: true`.
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
- strict UI/browser smoke for `/learning` and `/learning/lessons/N3`, with mobile screenshots;
- smoke proof that N1 and N2 still open;
- guardrail scans for no photos, address, listing URLs, deal amount, buyer chat, payment screenshot, bank screenshot, exact sums, customer brand, old cohort terms and unsafe reward claims;
- Java blocker/proof recorded honestly; do not claim Java-backed root verification if unqualified `java` is unavailable;
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`, with any expected active/latest alias mismatch reported honestly.

## Evidence Handoff

Builder evidence must map every acceptance item to proof and include:

- affected IDs: `N3`, `N3_DECLUTTER_TO_GOAL`, `DC_DECLUTTER_ONE`, `C4`, `C3`, `C9`, `Q10`, `Q11`, `Q12`;
- source mapping to methodology/content/design-system docs and raw source `humanReview: "required"` status;
- changed files;
- web command outputs;
- browser/mobile screenshots;
- tests for fixture shape, direct route, optional lesson-id alias and `/learning` CTA;
- proof N1/N2 remain available;
- display-only mini-test and non-persistent practice proof;
- amber/warning-soft reward guardrail proof;
- synthetic-only, customer-brand, sensitive-data and old-term scans;
- docs-sync decision;
- JSON, whitespace and harness validation;
- Java runtime blocker/proof without unsupported Java-backed root verification claims;
- updated latest evidence aliases and immutable evidence at `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.*`;
- raw refs/screenshots/commands/docs-sync/human gates;
- fresh verifier verdict/problems refs.

## Human Gates That Remain Open

- Legal/privacy wording and consent copy.
- Real employee/customer data processing.
- Customer-specific HR/reporting boundaries.
- Final financial correctness of lessons, diagnostics, quizzes and explanations.
- Legal/tax review for tax wording.
- HR/privacy wording review for diagnostics, self-assessment and reports.
- Reward economy, stock, prices and fulfillment.
- `production_ready` content approval.
- Admin auth/role/audit policy for production use.
