# Task: MVP-04-design-system-tokenization-001

Stage: `mvp`
Parent unit: `MVP-04.04`
Status: `PASS`
Created: 2026-05-12
Builder updated: 2026-05-12
Owner role: stage_builder

## Purpose

Implement the smallest code tokenization slice for the draft FinRhythm / Calm Progress Fintech design-system baseline in the existing `apps/web` learning harness.

This task aligns the already existing employee learning shell and fixture-backed lesson renderer to design-system tokens and component patterns. It does not close full `MVP-04`, any human gate, or the separate active `MVP-06-learning-renderer-fixture-001` verifier flow.

## Inputs

- `AGENTS.md`
- `apps/web/AGENTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `docs/stages/MVP.md`
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`
- `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
- current `apps/web` learning shell and lesson renderer files

## In Scope

- Map the code-relevant design-system color, typography, spacing, radius, shadow and control tokens into `apps/web/app/globals.css`.
- Keep `packages/ui` unscaffolded because no shared UI package pattern exists yet.
- Align the employee learning shell, lesson renderer, loading/empty/error states, cards, chips, buttons, progress, bottom nav and privacy/sensitive panels to the token layer.
- Preserve existing routes, fixture contracts and non-persistent demo behavior.
- Add focused test coverage that guards the token baseline and old local palette removal.
- Capture browser/mobile screenshots and guardrail scan evidence.

## Out Of Scope

- Final brand naming approval.
- Accessibility contrast audit as a closed human gate.
- Legal/privacy wording approval.
- Design QA on real mobile devices as a closed human gate.
- Full `packages/ui` component library.
- Backend/API/schema/OpenAPI/generated-client changes.
- Admin UI redesign.
- Onboarding, diagnostics, progress persistence, points ledger, wallet or CMS publishing.
- Closing full `MVP-04`, `MVP-06`, the MVP stage or any human gate.

## Acceptance Checklist

- Canonical design-system CSS custom properties exist in `apps/web/app/globals.css`.
- Legacy local CSS variables such as `--bg`, `--ink`, `--green`, `--blue`, `--line` and `--surface` are not used as the active token layer.
- Primary CTA uses `#1677F2`; cyan/teal/mint/success/reward/neutral tokens are mapped.
- Amber is reserved for reward/points emphasis.
- Learning shell and lesson renderer use tokenized cards, chips, progress, button and privacy/sensitive states.
- Employee UI remains neutral and contains no customer brand.
- No public ranking, casino/random reward mechanics, exact personal sums, bank screenshots, photos or document requirements are introduced.
- Existing behavior and fixture contracts remain intact.
- Focused web typecheck/test/build, browser smoke, screenshots and guardrail scans are recorded.
- Java-backed `make verify` is not claimed when unqualified Java runtime is unavailable.
- Fresh verifier PASS is recorded for this task only.

## Fresh Verifier Result

Fresh verifier returned `PASS` for `MVP-04-design-system-tokenization-001` only after one minimal fixer pass.

Scoped artifacts:

- `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`
- `.agent/stages/mvp/problems/MVP-04-design-system-tokenization-001.md`
- `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/`

Parent orchestrator accepted the scoped `MVP-04.04` `PASS` on 2026-05-12 and synchronized root latest aliases to `MVP-04-design-system-tokenization-001`. Immutable `MVP-06-learning-renderer-fixture-001` artifacts are preserved. Full `MVP-04`, full `MVP-06`, the MVP stage and human gates remain open.

## Human Gates That Remain Open

- Brand naming approval.
- Accessibility contrast audit.
- Final legal/privacy wording review.
- Design QA on real mobile screens.
- Reward economy/fulfillment approval.
- Customer-specific HR/reporting boundaries.
