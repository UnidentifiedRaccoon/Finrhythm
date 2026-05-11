# Evidence: MVP-04-design-system-tokenization-001

Status: `PASS`
Updated: 2026-05-12
Stage: `mvp`
Parent unit: `MVP-04.04`

## Implemented

- Added a minimal code token layer in `apps/web/app/globals.css` using the canonical design-system token names from `design-system-v0.1.md`.
- Kept `packages/ui` untouched because it currently has no package scaffold or local shared component pattern.
- Replaced the old active local CSS variable layer (`--bg`, `--ink`, `--green`, `--blue`, `--line`, `--surface`) with design-system color, typography, spacing, radius, shadow and control tokens.
- Aligned the learning shell with a privacy card, route progress/stepper, tokenized cards, chips, primary CTA and bottom navigation.
- Aligned the lesson renderer with a lesson progress panel, tokenized lesson blocks, privacy/sensitive practice panel, reward panel and policy card.
- Added a focused test assertion that guards the token baseline and verifies the old local palette does not return.
- Used Browser/IAB for rendered review; fixed a bottom-nav nested span selector issue found during screenshot inspection.
- Captured refreshed mobile screenshots for `/learning`, `/learning/lessons/N1`, loading, empty and error states.

## Acceptance Mapping

| AC | Builder status | Evidence |
|---|---|---|
| Token layer | BUILDER_PASS | `apps/web/app/globals.css`, token mapping raw ref |
| App surfaces aligned | BUILDER_PASS | `apps/web/components/learning-shell.ts`, `apps/web/components/lesson-renderer.ts`, screenshots |
| Behavior preserved | BUILDER_PASS | web typecheck/test/build and browser smoke |
| Guardrails preserved | BUILDER_PASS | customer-brand, forbidden-copy, no-real-data and no-cohort scans |
| Browser evidence | BUILDER_PASS | Browser/IAB raw ref and Playwright screenshots |
| Full MVP/human gates | OPEN | this evidence does not close full `MVP-04`, `MVP-06`, MVP or human gates |
| Fresh verifier | PASS | `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`, `.agent/stages/mvp/problems/MVP-04-design-system-tokenization-001.md` |

## Raw Evidence

- Token mapping: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-token-mapping-20260512.md`
- Git status: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-git-status-20260512.txt`
- Web file list: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-web-file-list-20260512.txt`
- Web typecheck: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-web-typecheck-20260512.txt`
- Web test: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-web-test-20260512.txt`
- Web build: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-web-build-20260512.txt`
- Browser/IAB review: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-browser-iab-20260512.json`
- Browser smoke: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-browser-smoke-20260512.txt`
- Screenshots: `.agent/stages/mvp/raw/mvp-04-design-system-tokenization-001-screenshots-20260512/`
- Design doc reference scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-design-doc-ref-scan-20260512.txt`
- Design board reference scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-design-board-ref-scan-20260512.txt`
- Token hard-coded scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-token-hardcoded-scan-20260512.txt`
- Customer-brand scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-customer-brand-scan-20260512.txt`
- Forbidden-copy scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-forbidden-copy-scan-20260512.txt`
- No-real-data scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-no-real-data-scan-20260512.txt`
- No-cohort scan: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-no-cohort-scan-20260512.txt`
- Java runtime check: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-java-version-20260512.txt`
- Bootstrap validation: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-validate-bootstrap-20260512.txt`
- Docs build: `.agent/stages/mvp/raw/stage-builder-mvp-04-design-system-tokenization-001-build-docs-20260512.txt`

## Screenshots

- `.agent/stages/mvp/raw/mvp-04-design-system-tokenization-001-screenshots-20260512/mvp-04-design-system-tokenization-001-mobile-ready.png`
- `.agent/stages/mvp/raw/mvp-04-design-system-tokenization-001-screenshots-20260512/mvp-04-design-system-tokenization-001-mobile-lesson-n1.png`
- `.agent/stages/mvp/raw/mvp-04-design-system-tokenization-001-screenshots-20260512/mvp-04-design-system-tokenization-001-mobile-empty.png`
- `.agent/stages/mvp/raw/mvp-04-design-system-tokenization-001-screenshots-20260512/mvp-04-design-system-tokenization-001-mobile-error.png`
- `.agent/stages/mvp/raw/mvp-04-design-system-tokenization-001-screenshots-20260512/mvp-04-design-system-tokenization-001-mobile-loading.png`
- `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/stage-verifier-mvp-04-design-system-tokenization-001-final-mobile-ready.png`
- `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/stage-verifier-mvp-04-design-system-tokenization-001-final-mobile-lesson-n1.png`
- `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/stage-verifier-mvp-04-design-system-tokenization-001-final-mobile-empty.png`
- `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/stage-verifier-mvp-04-design-system-tokenization-001-final-mobile-error.png`
- `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/stage-verifier-mvp-04-design-system-tokenization-001-final-mobile-loading.png`

## Validation Summary

- `pnpm --filter @finrhythm/web typecheck`: PASS
- `pnpm --filter @finrhythm/web test`: PASS
- `pnpm --filter @finrhythm/web build`: PASS
- Browser/IAB route and interaction review: PASS
- `pnpm --filter @finrhythm/web smoke:browser` on `http://127.0.0.1:3401`: PASS
- `./scripts/validate-bootstrap.sh`: PASS
- `pnpm -s run build:docs`: PASS
- `java -version`: BLOCKED in the current shell; unqualified Java runtime cannot be located, so `make verify` is not claimed for this slice.
- Fresh verifier final PASS: `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`

## Docs Sync

No canonical product/stage docs were changed. The implementation follows the existing draft design-system baseline and records discoverability through this task/evidence file. Brand naming, accessibility contrast, legal/privacy wording and real-device design QA remain human-gated.

## Limits

This sprint does not close `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, the MVP stage or any human gate. It does not implement CMS/admin, production content publishing, diagnostics/routing, progress persistence, scored quiz submission, practice submission, points, wallet or backend/API/schema changes.
