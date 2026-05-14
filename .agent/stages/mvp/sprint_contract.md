# Sprint contract: MVP-06-07-n1-readonly-block-stepper-001

Stage: `mvp`
Parent unit: scoped continuation across `MVP-06.03` lesson renderer / `MVP-06.04` read-only learning progress UX and `MVP-07.04` safe mounted continuation
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Proof status: `PASS`
Functional passes: `true`
Created: 2026-05-14
Owner role: `stage_builder`
Publish after pass: `true`

## Purpose

After `MVP-07-n1-readonly-status-refresh-001`, the already-mounted `/profile/session` N1 continuation can reopen and refresh current N1 status by reading backend-owned `GET route-progress` and `GET lesson detail`, without repeating `POST /start`. The next tiny product slice should improve learning delivery inside that same mounted N1 continuation by letting the employee read the already-fetched N1 lesson blocks one step at a time.

The builder must add an in-memory, read-only N1 block reader/stepper over existing `lessonDetail.blocks` that are already loaded by the current N1 continuation. The stepper changes only mounted UI state. It must not persist progress, submit answers, complete theory, complete learning, call analytics, add points, call rewards, mutate backend state, change API contracts or store the profile-session token anywhere outside mounted component memory.

This was chosen because the current code already has backend-owned N1 progress, lesson-detail reads and `lessonDetail.blocks`; the missing user value is a safer mobile reading affordance. This is smaller and more verifiable than completion, quiz/practice, scoring, route assignment, progress persistence or CMS/admin work.

This is not full `MVP-06`, not full `MVP-07`, not final route assignment, not lesson completion, not theory completion, not quiz/practice submission, not analytics/events, not points/rewards and not a human-gate closure.

## Baseline And Source Refs

- Latest fresh verifier `PASS`: `MVP-07-n1-readonly-status-refresh-001`.
- Immutable PASS proof refs that must remain the latest evidence/verdict aliases until this new sprint has builder evidence and a fresh verifier:
  - `.agent/stages/mvp/evidence/MVP-07-n1-readonly-status-refresh-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-n1-readonly-status-refresh-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-n1-readonly-status-refresh-001.json`
  - `.agent/stages/mvp/problems/MVP-07-n1-readonly-status-refresh-001.md`
- Latest aliases `evidence.json`, `evidence.md`, `verdict.json` and `problems.md` remain on `MVP-07-n1-readonly-status-refresh-001` during this freeze.
- Backend baseline remains mandatory for validation and unchanged unless the builder stops and re-freezes: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Repo state confirmed by spec freeze:
  - `apps/web/components/diagnostic-api-flow-screen.ts` renders `N1BackendLessonContinuationScreen` after N1 progress and lesson detail are loaded.
  - Current generated `LearningLessonDetailResponse` includes `blocks: LearningLessonBlockResponse[]`.
  - Current web code renders `lessonDetail.blocks` display-only and already has a read-only N1 status refresh action.
  - No backend/API/schema/OpenAPI/generated-client change is expected.

Do not read `.agent/stages/**/raw/**` unless a current evidence/problem/audit question names an exact raw ref.

## Required Inputs For Builder

Use read-gating from `READ_MATRIX.md` and read only current sources needed for implementation:

- `AGENTS.md`;
- `apps/web/AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md` relevant `MVP-06` and `MVP-07` sections;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` learning loop and privacy/reporting snippets;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` N1, lesson template, status and sensitive-data snippets;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` lesson, mobile progress, typography and CTA patterns;
- current mounted profile-session diagnostic/N1 code under `apps/web`;
- current generated api-client lesson-detail contract surface.

Content raw/source files are not required because this slice does not change content, provenance, methodology, wording approval or review semantics.

## Builder First Touch

The first meaningful builder touch may and should be in `apps/web` production or test files, not `.agent`, canonical docs, backend, Flyway, OpenAPI, generated-client artifacts or evidence.

Preferred first-touch targets:

- `apps/web/components/diagnostic-api-flow-screen.ts`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- a new focused `apps/web` test file if that matches existing patterns.

No backend migration, endpoint, DTO, OpenAPI operation or generated-client helper is expected. If the builder proves a backend contract change is required, stop and report for re-freeze instead of expanding scope.

## In Scope

- Add one in-memory, read-only N1 block reader/stepper inside the already-opened mounted `/profile/session` N1 continuation.
- Use only existing `lessonDetail.blocks` already fetched by the current `GET route-progress` + `GET lesson detail` continuation flow.
- Show one current block at a time with a calm progress indicator such as `1 из N`, block type, title, body and any existing display-only CTA label.
- Provide previous/next controls that update mounted React/component state only.
- Clamp or reset the current block index safely when a status refresh replaces `lessonDetail` with a different block list.
- If `lessonDetail.blocks` is empty or unsupported, keep the existing safe N1 continuation visible with a neutral Russian notice; do not create a hidden completion state.
- Preserve existing first-open paths:
  - `START_N1` may still call `startLearningMeLesson`, refresh route-progress and read lesson detail.
  - already-started reopen may still render from `GET route-progress` + `GET lesson detail` with no `POST /start`.
  - the existing N1 status refresh may still read `GET route-progress` + `GET lesson detail` when the employee explicitly checks status.
- Stepper next/previous clicks must not call `fetchLearningMeRouteProgress`, `fetchLearningMeLessonDetail`, `startLearningMeLesson`, diagnostic draft/submit helpers, completion endpoints, analytics endpoints, points/rewards endpoints or any other network request.
- Keep profile-session token only in mounted component memory: no URL path/query/hash, `localStorage`, `sessionStorage`, cookies, IndexedDB, service-worker cache, logs, request echo or screenshot text.
- User-visible copy must be Russian, neutral, privacy-first and mobile-first.

## Out Of Scope

- Backend schema migration, new endpoint, new backend DTO, new generated helper or new OpenAPI operation.
- Full `MVP-06`, full `MVP-07`, full MVP stage or human-gate closure.
- Learning completion, theory completion, `completed`, `mastered`, `needs_reinforcement`, completion progress percent, unlocking `N2+` or next-lesson eligibility.
- Quiz submission/scoring, practice submission, answer keys, attempt history or mini-test result storage.
- Points, rewards, wallet, ledger, anti-farm rewards, challenge progress, store, merch or fulfillment.
- Final diagnostic scoring/routing, full `Q1-Q27`, `Q28`, final `R1-R6`, weak zones, final level, route explanation correctness, HR diagnostic insights, HR reports or analytics/events.
- Production CMS/admin lesson publishing, content state workflow, publish validation, lesson CRUD, production content approval or methodologist workflow closure.
- Exact income, debt, balance, account numbers, photos, documents, bank screenshots, exact-sum requirements or free-form personal finance reports.
- Personal financial, investment, tax, credit, debt or legal advice.
- Customer brand in employee-facing UI, real employee/customer/personal/financial data or production legal/privacy wording approval.
- Login/password setup, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, SSO/SCIM, B2C billing, `pro_user` or `premium` shortcuts.

## Acceptance Checklist

- First meaningful builder touch is in `apps/web` production/test files.
- No backend production code, Flyway migration, OpenAPI operation or generated-client source changes are introduced. If a contract change is required, the builder stops and asks for re-freeze.
- The stepper renders from existing `lessonDetail.blocks`; it does not fetch or synthesize lesson content from UI constants.
- Stepper state is in mounted component memory only and is not encoded in URL, hash, storage, cookies or IndexedDB.
- Previous/next changes visibly update the current N1 block and progress indicator.
- Stepper clicks produce no `POST /api/v1/learning/me/lessons/N1/start`, diagnostic submit, completion, analytics, points or rewards calls.
- Existing `START_N1` first-start behavior remains working.
- Existing read-only reopen behavior remains working.
- Existing N1 status refresh behavior remains working and safely adjusts the selected block if the refreshed detail changes.
- User-visible copy is Russian, neutral, privacy-first and mobile-first.
- Browser/source evidence confirms no token appears in URL before, during or after stepper interaction and no token is stored in `localStorage`, `sessionStorage`, cookies, IndexedDB or service-worker caches.
- No final scoring, final route assignment, `R1-R6`, HR reporting, analytics/events, points, rewards, lesson completion, theory completion, quiz/practice submission, exact sensitive data, advice, customer brand or real data is introduced.
- Scoped functional pass is allowed only after builder evidence and fresh verifier `PASS`; until then `passes=false`.

## Required Validation

The builder must run and record command evidence with exit status and raw refs:

- focused web test for N1 block stepper state, block count/index behavior, refresh clamping/reset and no start/submit/completion mutation usage;
- `pnpm --filter @finrhythm/web typecheck`;
- `pnpm --filter @finrhythm/web test`;
- `pnpm --filter @finrhythm/web build`;
- browser/API smoke proving already-rendered mounted N1 continuation can move next/previous between fetched blocks without new `POST /start`, diagnostic submit, completion, analytics/events, points/rewards calls and without token URL/storage leakage;
- browser/API smoke or focused regression proving initial read-only reopen still uses `GET route-progress` + `GET lesson detail` and no `POST /start`;
- browser/API smoke or focused regression proving first `START_N1` path still works;
- backend focused regression only if implementation touches backend/API/schema/OpenAPI/generated-client boundaries or the verifier identifies a concrete backend risk; otherwise record an explicit unchanged-boundary note for Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- `pnpm --filter @finrhythm/api-client check:generated`;
- `pnpm --filter @finrhythm/api-client check:openapi-drift`;
- `pnpm --filter @finrhythm/api-client typecheck`;
- `pnpm --filter @finrhythm/api-client build`;
- `make verify`;
- `make test-unit`;
- `make build`;
- `jq empty` for changed JSON artifacts;
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`;
- guardrail scans for first touch, no backend contract/schema changes, no generated-client edits, no token storage/URL leakage, no stepper network mutation, no `N2+` scope, no completion/theory/quiz/practice/points/rewards, no scoring/R1-R6/HR reports/analytics, no exact sensitive data/advice and no real data.

## Evidence Handoff Required

The builder must record:

- changed production/test files, with first-touch proof;
- N1 block stepper behavior summary;
- exact source of blocks: existing `lessonDetail.blocks` from generated lesson-detail response;
- proof that stepper next/previous is mounted UI state only and emits no backend mutation or storage write;
- proof that first-start path still works;
- proof that read-only reopen path still works;
- proof that existing status refresh still works and keeps the stepper in a safe index;
- profile-session token memory-only proof;
- browser screenshots or structured browser-network proof raw refs;
- command raw refs and outcomes;
- backend/API unchanged-boundary note or focused regression proof if needed;
- api-client unchanged-boundary checks;
- guardrail scan raw refs;
- docs updated or explicit docs `NOOP` decision;
- backend baseline note: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- human-gate status and explicit non-closure;
- explicit out-of-scope confirmation for completion, theory completion, quiz, practice, points, rewards, scoring, `R1-R6`, HR reports, analytics/events, exact sensitive data, advice and full MVP closure;
- immutable evidence/verdict/problems refs for `MVP-06-07-n1-readonly-block-stepper-001` after builder and fresh verifier phases.

## Doc Targets And Diagram Expectations

- Product docs target: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` and `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` if existing N1 semantics, draft review status, sensitive-data rules and mobile lesson patterns are followed.
- Architecture doc target: `NOOP_EXPECTED` because this slice does not change access/session/backend/API boundaries. If implementation changes token flow, route-progress/lesson-detail behavior, persistence, or backend-owned state assumptions, stop and re-freeze instead of editing docs inside this contract.
- API/generated-client docs target: `NOOP_EXPECTED`; existing generated lesson-detail helpers and `LearningLessonDetailResponse.blocks` are sufficient.
- Stage evidence diagram expectation: compact stage-evidence-only UI flow showing mounted N1 continuation -> fetched `lessonDetail.blocks` -> in-memory block index -> previous/next render -> no network/storage/mutation. No canonical Mermaid diagram is expected unless a real boundary changes.

## Human Gates That Remain Open

- Final N1 financial correctness and wording review.
- Final Q0/SA/Q diagnostic wording review.
- Scoring correctness and route-rule correctness.
- HR/privacy wording and reporting-boundary approval.
- Legal/privacy boundaries and real employee/customer data processing approval.
- Production content approval and methodologist publish approval.
- Points/reward economy, real fulfillment and any paid-tier/reward rule decisions.
- Admin/support production access policy for sensitive diagnostic/learning data.
- Design/accessibility QA on real mobile screens.

## Fresh Verifier Status

`MVP-06-07-n1-readonly-block-stepper-001` now has builder implementation evidence and fresh verifier `PASS`.

- Builder evidence:
  - `.agent/stages/mvp/evidence/MVP-06-07-n1-readonly-block-stepper-001.md`
  - `.agent/stages/mvp/evidence/MVP-06-07-n1-readonly-block-stepper-001.json`
- Fresh verifier PASS:
  - `.agent/stages/mvp/verdicts/MVP-06-07-n1-readonly-block-stepper-001.json`
  - `.agent/stages/mvp/problems/MVP-06-07-n1-readonly-block-stepper-001.md`
  - `.agent/stages/mvp/raw/verifier-MVP-06-07-n1-readonly-block-stepper-001-20260514-fresh/`
- Parent evidence/verdict/problems aliases now point to this sprint.
- Full MVP-06, full MVP-07, the MVP stage and all human gates remain open.
- Post-PASS publish is required now because `publish_after_pass=true`.

## Post-PASS Publish Manifest Requirements

After builder evidence and fresh verifier `PASS`, update `.agent/stages/mvp/publish_manifest.json` before invoking `$push-main`.

The manifest must include:

- `publish_after_pass: true`;
- sprint id `MVP-06-07-n1-readonly-block-stepper-001`;
- intended branch and commit summary;
- PR title/body in Russian;
- proof refs for evidence, verdict and problems;
- validation commands and browser/API stepper proof refs;
- doc-sync refs or explicit docs `NOOP_EXPECTED` decision;
- explicit human gates still open;
- continuation prompt asking the next `stage_orchestrator` to continue from updated `main`, preserve the proof loop, choose the next highest-impact verified product slice and repeat post-PASS publish.
