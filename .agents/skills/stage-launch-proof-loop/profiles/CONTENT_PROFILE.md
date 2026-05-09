# CONTENT_PROFILE.md

## When To Load

Load this profile only for content, CMS, lesson adaptation, import/export, diagnostics, route rules, lesson templates, content approve-flow, support handoff, learning reports or wording-review slices.

Do not load this profile for tenant/invite/backend infrastructure, generic admin infrastructure or harness-only slices unless the verifier problem explicitly touches content evidence.

## Canonical Inputs

- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`;
- `content/getcourse-finstrategy/README.md`;
- `content/getcourse-finstrategy/CONTENT_BRIEF.md`;
- `content/getcourse-finstrategy/content-baseline.manifest.json`;
- `.agent/tasks/content-main-course-cleanup/evidence.md` when provenance or inventory evidence is needed.

The active raw content baseline is `Курс «ФинCтратегия»` under `content/getcourse-finstrategy/`. The removed `Путь к деньгам` export is historical only and must not be used as active source material.

## Evidence Requirements

For content/CMS/adaptation slices, evidence must include:

- active methodology path when the slice touches lessons, diagnostics, routing, CMS review statuses, support handoff or learning reports;
- affected methodology IDs: `C1-C10`, `N1-N7`, optional `Z1/Z4/Z9`, `Q0`, `Q1-Q27`, `Q28`, `SA1-SA3`, `R1-R6`;
- sensitive learning-data policy proof: exact sums, photos, documents, bank screenshots and personal finance reports are not required unless a later human-approved scope explicitly changes this;
- active source paths, especially `content/getcourse-finstrategy/`, `CONTENT_BRIEF.md`, `content-baseline.manifest.json` and `course-export/stream-546010026/`;
- content inventory counts from `content-baseline.manifest.json`;
- blocked lesson list and owner/admin follow-up status;
- `humanReview` status and wording review status;
- financial/tax/credit/investment/pension review gates;
- brand-normalization notes for customer-specific raw labels;
- explicit statement that removed exploratory exports are not active sources.

## Policy

- Preserve raw-source provenance.
- Do not publish `humanReview: "required"` content as approved.
- Keep raw financial, tax, credit, investment and pension wording human-gated until reviewed.
- Do not reintroduce removed exploratory exports such as `content/getcourse-path-to-money/`.
