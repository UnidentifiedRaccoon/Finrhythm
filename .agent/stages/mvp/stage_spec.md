# MVP learning methodology doc-sync spec freeze

Stage ID: `mvp`  
Sprint: `MVP-05-learning-methodology-doc-sync-001`  
Parent stage area: `MVP-05` documentation baseline only  
Status: `PASS_WITH_ENV_LIMITATION`  
Frozen at: 2026-05-05  
Owner: parent orchestrator acting as docs-only integration owner

## Objective

Move `learning_methodology_mvp_stage2_v02.md` into canonical product documentation, normalize it as the MVP learning-methodology baseline and synchronize stage/Harness docs so future learning, diagnostic, CMS, support and reporting slices read the correct source.

This slice does not implement runtime behavior and does not complete `MVP-05`, `MVP-06`, `MVP-07`, `MVP-09`, `MVP-10`, `MVP-11`, `MVP-12` or full MVP.

## Source baseline

- `AGENTS.md`
- `.agents/skills/stage-launch-proof-loop/SKILL.md`
- `.agents/skills/stage-launch-proof-loop/references/PROTOCOL.md`
- `.agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/stages/MVP.md`
- `docs/stages/v1.md`
- `docs/stages/v2.md`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/feature_list.json`
- `.agent/stages/mvp/status.json`
- root `learning_methodology_mvp_stage2_v02.md` as user-provided input

## In scope

- Move the methodology file to `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`.
- Remove the root duplicate.
- Remove the stray leading `ё`, add frontmatter and fix repo path references in the methodology source list.
- Add the methodology doc to source-of-truth order after product foundation.
- Update product foundation to link the methodology baseline and replace stale `4–6 weeks`, `52-week challenge` and pre/post P1 wording.
- Update `docs/stages/MVP.md` to carry concrete methodology decisions into executable stage scope:
  - `C1–C10`, `N1–N7`, optional `Z1/Z4/Z9`, `Z2` stretch;
  - `Q0`, `Q1–Q27`, `Q28`, `SA1–SA3`, `R1–R6`;
  - 70% quiz threshold, reinforcement, fast-pass/remedial behavior;
  - 6-week Wave 1 pacing;
  - no-photo/no-doc/no-exact-sum defaults;
  - lesson-linked support and aggregate-only HR reporting;
  - merch stock hypothesis: 80 mugs, 40 tote bags, 20 scarves.
- Update `docs/stages/v1.md` and `docs/stages/v2.md` so later stages inherit, refine from evidence and preserve privacy/no-advice guardrails.
- Update Harness docs so future content/CMS/diagnostic/support/reporting slices read the methodology doc and record IDs, review statuses, sensitive-data policy and human gates.
- Update MVP stage artifacts and evidence for this docs-only slice.

## Out of scope

- Runtime code, API/controllers, OpenAPI/generated client, DB schema, migrations or UI.
- Implementing diagnostics, lessons, CMS, support, points, reports, challenges, store or notifications.
- Marking any MVP methodology/learning/diagnostic/reporting execution unit complete.
- Final approval of financial correctness, legal/tax wording, HR wording, reward economy, stock/prices, real fulfillment or support answer policy.

## Acceptance criteria

1. Methodology file exists only at `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`.
2. Methodology frontmatter records `status: accepted_with_human_gates`.
3. The stray leading `ё` is removed.
4. Methodology source list uses real repo paths.
5. Source-of-truth order includes the methodology doc after product foundation.
6. Product foundation links the methodology baseline and no longer frames methodology as a future unstarted step.
7. Product foundation no longer contains stale `4–6 weeks`, `52-week challenge` or pre/post-as-P1 wording.
8. MVP stage doc references `product_methodology` and requires reading it for relevant spec-freeze slices.
9. MVP stage doc carries concrete v0.2 methodology decisions without marking downstream units complete.
10. v1/v2 stage docs inherit the methodology baseline and preserve privacy/no-advice guardrails.
11. Harness docs require methodology-aware evidence for content/CMS/diagnostic/support/reporting slices.
12. Stage artifacts record this as docs-only and keep existing MVP-02 PASS proofs intact.
13. Link/path and contradiction scans are recorded.
14. Harness verification is recorded.
15. `make verify` is run or current Java/runtime blocker is honestly recorded.
16. Fresh verifier reviews this slice after evidence update.

## Verification plan

- `git status --short`
- path uniqueness check for `learning-methodology-v0.2.md`
- link/path scan for product foundation, stage docs and Harness docs
- contradiction scan for stale root filename, `4–6 weeks`, `52-week`, future-methodology wording, missing `SA1`, `Q28`, `Z1`, `production_ready`
- `.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- `make verify`
- fresh `stage_verifier`

## Human gates

This slice records but does not close human gates for:

- final financial correctness of lessons, diagnostics, quizzes and explanations;
- legal/tax review for tax deduction wording and official links;
- HR wording review for communications, self-assessment and privacy explanations;
- reward economy, stock, prices and real fulfillment operations;
- support answer policy for sensitive financial, tax, investment and credit questions.
