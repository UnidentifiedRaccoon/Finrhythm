# Task file: MVP-06-07-n1-readonly-block-stepper-001

Stage: `mvp`
Sprint contract: `.agent/stages/mvp/sprint_contract.md`
Status: `FROZEN_AWAITING_BUILDER`
Functional passes: `false`
Publish after pass: `true`

## Task

Implement one web-first, in-memory N1 block reader/stepper inside the already-opened mounted `/profile/session` N1 continuation screen.

The current continuation already has backend-owned `GET route-progress` + `GET lesson detail` and receives `lessonDetail.blocks`. The new UI should let the employee move through those fetched display-only blocks one step at a time. Stepper next/previous changes only mounted UI state and must not persist progress, call `POST /start`, submit diagnostics, complete theory/learning, submit quiz/practice, emit analytics/events, add points, call rewards or store the profile-session token.

## Required First Touch

First meaningful builder touch may and should be in `apps/web` production/test files, for example:

- `apps/web/components/diagnostic-api-flow-screen.ts`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- a new focused `apps/web` test file if that matches existing patterns.

Do not touch `.agent`, canonical docs, backend, generated client or OpenAPI before web production/test work exists.

## Required Scope

- Render an in-memory block stepper from existing `lessonDetail.blocks`.
- Show current block position, type, title, body and any existing display-only CTA label.
- Provide previous/next controls that update only mounted UI state.
- Keep stepper index safe when status refresh replaces `lessonDetail`.
- Preserve first-start, read-only reopen and existing status refresh paths.
- Prove stepper clicks create no backend mutation or storage write.
- Keep profile-session token only in mounted component memory.
- Use Russian, privacy-first, mobile-first copy.

## Out Of Scope

No schema migration, new endpoint, new DTO, new OpenAPI operation, new generated helper, final scoring, final route assignment, `R1-R6`, full `Q1-Q27`, `Q28`, HR reports, analytics/events, learning completion, theory completion, quiz/practice submission, points, rewards, `N2+`, CMS/admin publishing, exact sensitive data, advice, customer brand, real data, `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.

Do not close full `MVP-06`, full `MVP-07`, the MVP stage or any human gate.

## Validation

Required evidence includes focused web tests for block stepping and no mutation usage, web typecheck/test/build, browser/API smoke with screenshots or structured network proof, api-client unchanged-boundary checks, backend focused regression only if needed, root `make verify`, `make test-unit`, `make build`, JSON validation, diff check and guardrail scans.

Browser/API smoke must cover already-rendered N1 continuation, stepper next/previous UI change, no new start/submit/completion/analytics/points/rewards calls, no token in URL/storage/cookies/IndexedDB/service-worker surfaces, and preserved first-start/read-only reopen/status-refresh paths.

## Docs

Canonical docs target is `NOOP_EXPECTED` unless implementation changes product behavior, methodology, access/session boundaries, backend/API contract, generated-client coverage, sensitive-data rules or design-system semantics. If such a change is required, stop and report for re-freeze instead of expanding scope.

Stage evidence should include a compact UI-state diagram for fetched blocks -> in-memory index -> previous/next render -> no network/storage/mutation.

## Human Gates

All existing human gates remain open, including final N1 financial correctness, diagnostic wording, route-rule correctness, HR/privacy wording, legal/privacy approval, real employee/customer data processing, production content approval, reward economy, production support/admin policy and design/accessibility QA.

## Current Limitation

This task is frozen only. Implementation, evidence and fresh verifier PASS do not exist yet; `passes=false` remains mandatory. Latest evidence/verdict/problems aliases remain on `MVP-07-n1-readonly-status-refresh-001`.
