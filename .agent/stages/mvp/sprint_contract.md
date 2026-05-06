# Sprint contract: MVP-05-content-spec-ingestion-001

Status: `PASS`  
Created: 2026-05-06  
Stage: `mvp`  
Parent stage units: `MVP-05`, source input for `MVP-06`, `MVP-07`, `MVP-09`  
Execution mode: docs-only Harness slice

## Objective

Ingest the prepared Content MVP draft into the correct canonical product-doc location and wire it into the MVP harness as a doc-only source slice.

The slice does not approve content. It only proves that the draft is placed, referenced and tracked correctly, with human gates preserved.

## Files in scope

- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
- `content/getcourse-finstrategy/CONTENT_BRIEF.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/stages/MVP.md`
- `docs/architecture/source-of-truth.md`
- `.agent/stages/mvp/source.md`
- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/backlog.md`
- `.agent/stages/mvp/feature_list.json`
- `.agent/stages/mvp/sprint_contract.md`
- `.agent/stages/mvp/task-files/MVP-05-content-spec-ingestion-001.md`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/decisions.md`
- `.agent/stages/mvp/risks.md`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/raw/**`
- `.agent/stages/mvp/verdict.json`
- `.agent/stages/mvp/problems.md`

## Out of scope

- Runtime application code, tests for runtime behavior, migrations, OpenAPI, generated clients, UI screenshots or CMS implementation.
- Financial/legal/tax/HR/privacy/reward approval.
- Editing substantive lesson/question/challenge copy except metadata/frontmatter/source-location notes.
- Any real employee/customer/personal/financial data.
- Changing the next implementation recommendation away from `MVP-02.03` after this ingestion is verified.

## Acceptance criteria

1. Root `finrhythm_stage3_content_mvp_draft.md` is absent.
2. `content-mvp-spec-v0.1.md` exists under the product-doc path and carries `draft_with_human_gates` metadata.
3. `learning-methodology-v0.2.md` and `CONTENT_BRIEF.md` exist at their local referenced paths.
4. Canonical docs point to the content/methodology docs and explicitly preserve human gates.
5. Stage artifacts record `MVP-05-content-spec-ingestion-001` as a doc-only ingestion slice.
6. `feature_list.json` marks only ingestion/proof criteria as passed; content approval criteria remain not passed.
7. `status.json` records this slice as verified without closing MVP-05 units and restores next recommended `MVP-02.03` after verification.
8. Evidence includes raw refs for git status, root draft absence/path checks, reference scan, harness validation and `make verify`.
9. No code/schema/API/UI/generated-client files are changed.
10. Fresh `stage_verifier` returns PASS for this slice only.

## Verification evidence

- `git status --short`
- root draft absence and product-doc path checks
- canonical reference scan
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- `make verify`
- fresh verifier raw outputs and `verdict.json`

## Human gates

No human gate is closed. Use this sprint PASS only as placement/proof for the content spec draft, not as production content approval.
