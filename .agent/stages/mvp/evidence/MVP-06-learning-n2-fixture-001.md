# Evidence: MVP-06-learning-n2-fixture-001

Status: `PASS_PENDING_PARENT_ALIAS_SYNC`
Updated: 2026-05-12
Stage: `mvp`
Parent unit: `MVP-06.03`

## Implemented

- Added a second synthetic fixture-backed lesson: `N2_SAVINGS_CHALLENGE_START`.
- Kept the existing fixture renderer route pattern and made `/learning/lessons/N2` resolve through `getSyntheticLessonFixture`.
- Added a visible `/learning` CTA from the `N2` row while preserving the existing `N1` entry.
- Rendered N2 with the required block order: situation, why, rule, example, mini-test, practice and reward.
- Included office and store/shift examples for different work rhythms.
- Kept the mini-test display-only and the practice non-persistent/category-only.
- Preserved reward guardrails: amber/warning-soft surfaces, no cash-equivalence, no guaranteed savings result and no random reward mechanics.

## Source Mapping

- Methodology: `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, `N2. Челлендж накоплений`.
- Content spec: `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`, `N2_SAVINGS_CHALLENGE_START` and `N2_SAVINGS_6W_PILOT_MAIN`.
- Design baseline: `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`.

Affected IDs:

- `N2`
- `N2_SAVINGS_CHALLENGE_START`
- `N2_SAVINGS_6W_PILOT_MAIN`
- `C3`
- `C8`
- `C2`

## Changed Files

- `apps/web/lib/learning-fixtures.ts`
- `apps/web/components/learning-shell.ts`
- `apps/web/components/lesson-renderer.ts`
- `apps/web/app/globals.css`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs`

## Acceptance Mapping

| AC | Builder status | Evidence |
|---|---|---|
| N2 synthetic fixture | BUILDER_PASS | `apps/web/lib/learning-fixtures.ts` |
| Direct N2 route | BUILDER_PASS | `getSyntheticLessonFixture`, unit tests, Browser/IAB smoke |
| `/learning` CTA to N2 | BUILDER_PASS | `apps/web/components/learning-shell.ts`, unit tests, Browser/IAB smoke |
| Office/store examples | BUILDER_PASS | N2 fixture, renderer tests |
| Display-only mini-test | BUILDER_PASS | N2 `quizItems.displayOnly`, renderer tests |
| Non-persistent practice | BUILDER_PASS | N2 `practiceTask`, renderer tests |
| Reward guardrails | BUILDER_PASS | CSS/tests, strict UI smoke reward style proof |
| Guardrails preserved | BUILDER_PASS | customer-brand, old-term, sensitive-data and reward scans |
| Browser/mobile evidence | BUILDER_PASS | Browser/IAB smoke and Chrome screenshot smoke |
| Full MVP/human gates | OPEN | no full `MVP-06`, MVP stage or human-gate closure |
| Fresh verifier | PASS | `.agent/stages/mvp/verdicts/MVP-06-learning-n2-fixture-001.json`, `.agent/stages/mvp/problems/MVP-06-learning-n2-fixture-001.md` |

## Validation Summary

- `pnpm --filter @finrhythm/web typecheck`: PASS
- `pnpm --filter @finrhythm/web test`: PASS
- `pnpm --filter @finrhythm/web build`: PASS
- Browser/IAB route and console smoke on `http://127.0.0.1:3212`: PASS
- `pnpm --filter @finrhythm/web smoke:browser` on `http://127.0.0.1:3212`: PASS, 6 screenshots
- Strict N2 reward UI smoke on `http://127.0.0.1:3212`: PASS
- JSON validation for stage status/feature list: PASS
- `git diff --check`: PASS
- Fresh scoped verifier: PASS
- `java -version`: BLOCKED in the current shell; unqualified Java runtime cannot be located, so `make verify` is not claimed for this slice.

## Raw Evidence

- Builder summary: `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n2-fixture-001-summary-20260512.txt`
- Screenshots: `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/`
- Verifier verdict: `.agent/stages/mvp/verdicts/MVP-06-learning-n2-fixture-001.json`
- Verifier problems: `.agent/stages/mvp/problems/MVP-06-learning-n2-fixture-001.md`

## Screenshots

- `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/mvp-06-learning-n2-fixture-001-mobile-ready.png`
- `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/mvp-06-learning-n2-fixture-001-mobile-lesson-n1.png`
- `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/mvp-06-learning-n2-fixture-001-mobile-lesson-n2.png`
- `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/mvp-06-learning-n2-fixture-001-mobile-empty.png`
- `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/mvp-06-learning-n2-fixture-001-mobile-error.png`
- `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/mvp-06-learning-n2-fixture-001-mobile-loading.png`

## Docs Sync

No canonical product/stage docs were changed. This slice implements the already frozen N2 draft as a synthetic renderer fixture only. The content remains `editorial_draft` and human-review-required.

## Limits

This sprint does not implement CMS/admin publishing, content states, publish validation, progress persistence, scored quiz submission, practice submission, challenge start persistence, reminders, points, wallet, diagnostics/routing, onboarding/consent, backend/API/schema/OpenAPI/generated-client changes or `packages/ui`.

It does not close full `MVP-04`, full `MVP-06`, `MVP-07`, `MVP-09`, the MVP stage or any human gate. Root latest aliases remain on `MVP-04-design-system-tokenization-001` until a separate parent alias-sync decision.
