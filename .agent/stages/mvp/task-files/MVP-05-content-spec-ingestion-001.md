# Task: MVP-05-content-spec-ingestion-001

Status: `PASS`  
Stage: `mvp`  
Parent stage units: `MVP-05`, source input for `MVP-06`, `MVP-07`, `MVP-09`  
Created: 2026-05-06

## Goal

Place the prepared Content MVP draft into canonical product documentation and wire it into the MVP harness as a tracked source for future content/CMS/diagnostics/challenge work.

## Scope

- Canonical product-doc placement:
  - `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`
  - `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
  - `content/getcourse-finstrategy/CONTENT_BRIEF.md`
- Canonical reference updates:
  - `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
  - `docs/stages/MVP.md`
  - `docs/architecture/source-of-truth.md`
- Harness artifacts:
  - `.agent/stages/mvp/*`

## Acceptance Criteria

1. Root draft file is removed.
2. Content spec has `draft_with_human_gates` metadata and MVP-05/06/07/09 alignment.
3. Methodology and raw content brief dependencies exist locally.
4. Canonical docs refer to the new sources and preserve human gates.
5. Harness artifacts record this as doc-only ingestion.
6. `MVP-05.01` through `MVP-05.05` remain open.
7. No production code, schema, API, generated client or UI changes are included.
8. Harness validator and `make verify` pass.
9. Fresh verifier PASS is recorded for this task only.

## Human Gates

The following remain unresolved:

- final financial correctness of lessons, diagnostics, quizzes and explanations;
- legal/tax review for tax-deduction wording and official-source links;
- HR/privacy wording for diagnostic, self-assessment and reports;
- reward economy, stock, points prices and fulfillment operations;
- support-answer policy for tax, investment, credit and personal-finance questions;
- final `production_ready` publish approval.

## Notes

This task does not implement CMS, diagnostics engine, lesson renderer, challenge runtime or any user-visible flow. It only normalizes the content specification as a durable source for later slices.
