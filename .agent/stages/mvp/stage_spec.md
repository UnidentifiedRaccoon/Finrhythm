# MVP-05 content spec ingestion spec freeze

Stage ID: `mvp`  
Active slice: `MVP-05-content-spec-ingestion-001`  
Parent stage units: `MVP-05`, source input for `MVP-06`, `MVP-07`, `MVP-09`  
Status: `PASS`  
Frozen at: 2026-05-06  
Freezer role: `stage_spec_freezer`

## Objective

Place the prepared `finrhythm_stage3_content_mvp_draft.md` as a canonical product/content draft and wire it into the MVP stage harness without claiming final content approval.

This slice builds on the already merged `MVP-05-learning-methodology-doc-sync-001` baseline. It records the content spec as a production-preparation input for MVP content factory, CMS/admin, diagnostics/routing and retention/challenge work, while keeping all financial, legal/tax, HR/privacy, reward and final `production_ready` decisions human-gated.

## Source baseline

This freeze reconciles:

- current repo state after merging `origin/main` on 2026-05-06;
- `AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`;
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`;
- `docs/stages/MVP.md`;
- `.agents/skills/stage-launch-proof-loop/SKILL.md`;
- `.agent/stages/mvp/*` artifacts from the prior verified MVP-02 and methodology doc-sync work.

## In scope

- Move the root draft into `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`.
- Add frontmatter that marks the document as `draft_with_human_gates`, version `0.1`, dated `2026-05-06`, and aligned to MVP-05/06/07/09.
- Add local markdown source referenced by the draft: `content/getcourse-finstrategy/CONTENT_BRIEF.md`.
- Update narrow canonical references in product foundation, stage source and architecture source-of-truth.
- Update MVP harness artifacts so future agents know this is an ingested draft source, not approved production content.
- Record explicit human gates and ensure `MVP-05.01` through `MVP-05.05` remain open.
- Verify root draft removal, local path references, harness JSON validity and root `make verify`.

## Out of scope

- Editing lesson/question/challenge substance beyond wrapping the supplied draft as canonical markdown.
- Marking any lesson, diagnostic question, quiz explanation, reward rule, HR/privacy wording or legal/tax copy as final.
- Implementing CMS/admin CRUD, renderer, API contract, DB schema, generated client, web/admin UI or analytics.
- Changing points ledger, reward economy, merch catalog, fulfillment, pricing, billing or real customer operations.
- Using real employee/customer/personal/financial data.
- Closing `MVP-05.01` through `MVP-05.05`, full MVP-05 or later content units.

## Acceptance criteria

1. `finrhythm_stage3_content_mvp_draft.md` no longer exists at repo root.
2. `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` exists with `status: draft_with_human_gates`, version `0.1`, date `2026-05-06`, and MVP-05/06/07/09 alignment.
3. `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` and `content/getcourse-finstrategy/CONTENT_BRIEF.md` exist locally.
4. Product foundation, MVP stage and architecture source-of-truth point to the methodology/content spec without expanding stage scope.
5. `.agent/stages/mvp/source.md`, `sprint_contract.md`, `task-files/MVP-05-content-spec-ingestion-001.md`, `backlog.md`, `feature_list.json`, `progress.md`, `status.json`, `decisions.md`, `risks.md`, `evidence.md` and `evidence.json` record the doc-only ingestion.
6. `feature_list.json` has a passing criterion only for content spec ingestion into docs/harness; content approval/review criteria remain `passes=false`.
7. `MVP-05.01` through `MVP-05.05`, full MVP-05 and all content human gates remain open or human-pending.
8. No runtime code, DB schema, API/OpenAPI/generated-client, UI or fixture behavior changes are introduced.
9. Verification records `git status --short`, root draft absence/local reference checks, harness validator and `make verify`.
10. Fresh `stage_verifier` returns PASS for `MVP-05-content-spec-ingestion-001` only before the sprint is marked verified.

## Verification plan

- `git status --short`
- `test ! -f finrhythm_stage3_content_mvp_draft.md`
- `test -f docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
- `rg -n "content-mvp-spec-v0.1|learning-methodology-v0.2|CONTENT_BRIEF|draft_with_human_gates" docs/product/b2b-mvp/lemanapro docs/stages/MVP.md docs/architecture/source-of-truth.md .agent/stages/mvp`
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- `make verify`
- Fresh `stage_verifier` scoped only to `MVP-05-content-spec-ingestion-001`.

## Docs targets

- Canonical docs: product foundation, MVP stage source and architecture source-of-truth.
- Product docs: content spec and raw content brief markdown source.
- Stage artifacts: current MVP harness files and raw command outputs.
- Mermaid diagrams: not required; this slice changes source placement and proof routing, not a non-trivial runtime flow.

## Human gates

No human gate is closed by this slice. The content spec is ready for production-проработка and future implementation planning, but final financial correctness, legal/tax wording, HR/privacy wording, reward economy, real fulfillment, support-answer policy and `production_ready` publishing remain human-gated.
