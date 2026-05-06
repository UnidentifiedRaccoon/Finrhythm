# Sprint contract: MVP-05-content-spec-ingestion-001

Status: `PASS`  
Owner: `stage_builder` implementation/evidence with fresh `stage_verifier` required  
Created: 2026-05-06  
Stage: `mvp`  
Parent stage units: `MVP-05`, source input for `MVP-06`, `MVP-07`, `MVP-09`

## Objective

Ingest the prepared Content MVP draft into the correct canonical product-doc location and wire it into the MVP harness as a doc-only source slice.

The slice must not approve content. It only proves that the draft is placed, referenced and tracked correctly, with human gates preserved.

## Required first action

Before edits, record:

1. `git status --short`
2. `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`

If the harness baseline is broken, record the blocker before changing stage state.

## Files and modules in scope

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
- `.agent/stages/mvp/verdict.json` and `.agent/stages/mvp/problems.md` for fresh verifier output only.

## In scope

- Move the draft from repo root into `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`.
- Add canonical frontmatter and note that the document is `draft_with_human_gates`.
- Import or add the missing local source markdown files referenced by the draft.
- Add canonical references so future MVP-05/06/07/09 agents read methodology and content spec before implementation.
- Record a doc-only sprint in stage artifacts, with a narrow evidence bundle.
- Keep `MVP-05.01` through `MVP-05.05` unclosed.

## Out of scope

- Runtime application code, tests for runtime behavior, migrations, OpenAPI, generated clients, UI screenshots or CMS implementation.
- Financial/legal/tax/HR/privacy/reward approval.
- Editing substantive lesson/question/challenge copy except metadata/frontmatter/source-location notes.
- Any real employee/customer/personal/financial data.
- Changing the next implementation recommendation away from `MVP-02.03` after this ingestion is verified.

## Exact acceptance criteria

1. Root `finrhythm_stage3_content_mvp_draft.md` is absent.
2. `content-mvp-spec-v0.1.md` exists under the product-doc path and carries `draft_with_human_gates` metadata.
3. `learning-methodology-v0.2.md` and `CONTENT_BRIEF.md` exist at their local referenced paths.
4. Canonical docs point to the content/methodology docs and explicitly preserve human gates.
5. Stage artifacts record `MVP-05-content-spec-ingestion-001` as a doc-only ingestion slice.
6. `feature_list.json` marks only ingestion/proof criteria as passed; content approval criteria remain not passed.
7. `status.json` records this slice as active/verified without closing MVP-05 units and restores next recommended `MVP-02.03` after verification.
8. Evidence includes raw refs for git status, root draft absence/path checks, reference scan, harness validation and `make verify`.
9. No code/schema/API/UI/generated-client files are changed.
10. Fresh `stage_verifier` returns PASS for this slice only.

## Build and test plan

- `git status --short`
- `test ! -f finrhythm_stage3_content_mvp_draft.md`
- `test -f docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
- reference scan for new canonical paths and `draft_with_human_gates`
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- `make verify`

## Evidence requirements

- Store command outputs in `.agent/stages/mvp/raw/`.
- Record exact docs added/updated.
- Record explicit no-code/API/UI/schema note.
- Record human gates as unresolved.
- Run one fresh verifier after builder evidence.

## Docs targets

Canonical docs are updated because this slice changes product-content source placement and future stage inputs. No Mermaid diagram is required.

## Human gates

No human gate is closed. Use `DONE_WITH_HUMAN_PENDING` only for the document ingestion readiness, not for the content itself.
