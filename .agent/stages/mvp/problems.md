# Problems: MVP-04-design-system-tokenization-001

Status: `PASS`
Updated: 2026-05-12

## Blocking Problems

None for the scoped `MVP-04-design-system-tokenization-001` verifier pass.

## Fixed During Verifier Loop

- Added the missing doc-declared design-system tokens in `apps/web/app/globals.css`: card active/completed icon aliases, font-family alias, typography weights/body aliases and motion easing tokens.
- Normalized the builder browser-smoke JSON artifact with a final newline.
- Adjusted the reward block surface to `--color-warning-soft` so the reward area no longer mixes blue into the amber reward emphasis.
- Added `apps/web/public/favicon.ico` so production browser QA no longer reports `/favicon.ico` 404.

## Fixed During Orchestrator Follow-up

- Read-only UI smoke found that `/learning/lessons/N1` still had blue-tinted reward block border and reward block-type badge styling.
- Updated `apps/web/app/globals.css` so `.reward-block` and `.reward-block .block-type` use amber/warning-soft tokens only.
- Added focused assertions in `apps/web/tests/learning-shell.test.mjs`.
- Reran web typecheck/test/build, strict UI smoke and screenshot smoke; all passed. Raw ref: `.agent/stages/mvp/raw/orchestrator-mvp-04-design-system-tokenization-001-ui-smoke-fixer-20260512.txt`.

## Remaining Non-Blocking Limits

- `java -version` cannot locate an unqualified Java runtime in this shell, so `make verify` was not run and is not claimed for this frontend slice.
- Brand naming approval, accessibility contrast audit, final legal/privacy wording review and real mobile design QA remain human-gated.
- This pass does not close full `MVP-04`, full `MVP-06`, the MVP stage or any human gate.
