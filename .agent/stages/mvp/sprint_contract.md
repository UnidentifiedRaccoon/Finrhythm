# Sprint contract: MVP-05-learning-methodology-doc-sync-001

Status: `PASS_WITH_ENV_LIMITATION`  
Created: 2026-05-05  
Stage: `mvp`  
Parent stage area: `MVP-05` documentation baseline only  
Execution mode: docs-only Harness slice

## Objective

Normalize the user-provided learning methodology file into canonical product docs and synchronize source-of-truth, stage and Harness documentation so future implementation slices use the methodology v0.2 baseline.

## Files in scope

- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/architecture/source-of-truth.md`
- `docs/stages/MVP.md`
- `docs/stages/v1.md`
- `docs/stages/v2.md`
- `.agents/skills/stage-launch-proof-loop/SKILL.md`
- `.agents/skills/stage-launch-proof-loop/references/PROTOCOL.md`
- `.agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md`
- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/sprint_contract.md`
- `.agent/stages/mvp/task-files/MVP-05-learning-methodology-doc-sync-001.md`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/feature_list.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/decisions.md`
- `.agent/stages/mvp/risks.md`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/raw/**`

## Out of scope

- Runtime code, DB schema, migrations, API/OpenAPI, generated client, UI or screenshots.
- Closing `MVP-05`, `MVP-06`, `MVP-07`, `MVP-09`, `MVP-10`, `MVP-11`, `MVP-12` or full MVP.
- Final human approval for financial correctness, legal/tax wording, HR wording, reward operations or support answer policy.

## Acceptance criteria

1. The root file `learning_methodology_mvp_stage2_v02.md` is removed.
2. The methodology doc exists at `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`.
3. The methodology doc has normalized frontmatter and `status: accepted_with_human_gates`.
4. The stray leading `ё` before the heading is gone.
5. Methodology source references point to actual repo paths.
6. `docs/architecture/source-of-truth.md` lists the methodology baseline after product foundation.
7. Product foundation links the methodology baseline and no longer carries stale `4–6 weeks`, `52-week challenge` or pre/post P1 wording.
8. `docs/stages/MVP.md` records `product_methodology`, read-before-freeze rules and v0.2 decisions for learning, diagnostics, support, reports, challenges and store.
9. `docs/stages/v1.md` and `docs/stages/v2.md` inherit methodology v0.2 instead of reopening it by default.
10. Harness docs instruct agents to read the methodology baseline and record lesson/question/route IDs, review statuses, sensitive-data policy and human gates.
11. Stage artifacts identify the slice as docs-only and preserve current MVP-02 proofs.
12. Verification commands/scans are recorded, including any Java/runtime blocker.
13. Fresh verifier verdict is recorded before this sprint is considered closed.

## Verification plan

- `git status --short`
- path uniqueness check:
  - `find . -name '*learning*methodolog*' -o -name '*learning_methodology_mvp_stage2_v02*'`
- link/path scans with `rg`
- contradiction scan for stale language:
  - `learning_methodology_mvp_stage2_v02`
  - `4–6 weeks` / `4-6 weeks`
  - `52-week` / `52-недель`
  - `Опрос до/после пилота по уверенности и финансовому стрессу`
  - missing expected tokens `SA1`, `Q28`, `Z1`, `production_ready`
- `.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- `make verify`

## Evidence expectations

- Raw outputs under `.agent/stages/mvp/raw/`.
- `evidence.md` and `evidence.json` map all criteria.
- `feature_list.json` adds only docs-sync criteria; it must not mark downstream MVP learning or reporting features as implemented.
- Human gates are listed as pending, not closed.
