# Sprint contract: MVP-07-n1-readonly-status-refresh-001

Stage: `mvp`
Parent unit: scoped continuation across `MVP-06.04` N1 learning delivery and `MVP-07.04` safe route-progress continuation
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Proof status: `PASS`
Functional passes: `true`
Created: 2026-05-14
Owner role: `stage_builder`
Publish after pass: `true`

## Purpose

After `MVP-07-n1-readonly-resume-continuation-001`, mounted `/profile/session` can reopen an already-started N1 continuation from backend-owned reads only: `GET /api/v1/learning/me/route-progress` plus `GET /api/v1/learning/me/lessons/N1`, with no repeat `POST /start`.

The next tiny product slice lets the employee re-check N1 status from inside the already-rendered N1 continuation screen. The refresh must read the current backend-owned route-progress and N1 lesson detail again, update the visible progress timestamp/detail if the server still returns `RESUME_N1`, and keep the existing lesson visible if the refresh fails. It must not create progress, submit diagnostics, complete learning, persist answers or expand routing.

This was chosen over a broader learning/diagnostic slice because the current code already has the exact read endpoints, generated helpers and mounted N1 continuation surface; the missing user value is a safe "check current status" action on that surface itself. That is smaller and more verifiable than adding new lesson states, completion, quiz/practice, scoring or route assignment.

This is not full `MVP-06`, not full `MVP-07`, not final route assignment, not lesson completion, not theory completion, not quiz/practice submission, not analytics/events, not points/rewards and not a human-gate closure.

## Baseline And Source Refs

- Latest fresh verifier `PASS`: `MVP-07-n1-readonly-resume-continuation-001`.
- Immutable PASS proof refs:
  - `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-n1-readonly-resume-continuation-001.json`
  - `.agent/stages/mvp/problems/MVP-07-n1-readonly-resume-continuation-001.md`
- Latest aliases `evidence.json`, `evidence.md`, `verdict.json` and `problems.md` remain on the previous PASS until this new sprint has builder evidence and a fresh verifier verdict.
- Backend baseline remains mandatory for validation: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Repo state confirmed by spec freeze:
  - `apps/web/components/diagnostic-api-flow-screen.ts` renders `N1BackendLessonContinuationScreen` only after safe N1 progress and lesson detail are loaded.
  - Existing web code already uses generated `fetchLearningMeRouteProgress`, `fetchLearningMeLessonDetail` and `startLearningMeLesson`.
  - Existing browser smoke proves read-only reopen with no `POST /api/v1/learning/me/lessons/N1/start`.
  - No N1 continuation refresh control is currently rendered inside the N1 screen itself.

Do not read `.agent/stages/**/raw/**` unless a current evidence/problem/audit question names an exact raw ref.

## Required Inputs For Builder

Use read-gating from `READ_MATRIX.md` and read only current sources needed for implementation:

- `AGENTS.md`;
- `apps/web/AGENTS.md`;
- `apps/api/AGENTS.md` for backend validation expectations;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md` relevant `MVP-06` and `MVP-07` sections;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` learning loop and privacy/reporting snippets;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` N1, lesson template, status, diagnostic handoff, completion boundary and sensitive-data snippets;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` lesson, progress, privacy and mobile patterns;
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`;
- current mounted profile-session diagnostic/N1 code under `apps/web`;
- current generated api-client helper surface;
- focused backend learning tests only as needed for regression proof.

Content raw/source files are not required because this slice does not change content, provenance, methodology or review semantics.

## Builder First Touch

The first meaningful builder touch may and should be in `apps/web` production or test files, not `.agent`, docs, backend, generated client, OpenAPI snapshot or evidence.

Preferred first-touch targets:

- `apps/web/components/diagnostic-api-flow-screen.ts`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- a new focused `apps/web` test file if that matches existing patterns.

No backend migration, endpoint, DTO, OpenAPI operation or generated-client helper is expected. If the builder proves a backend contract change is required, stop and re-freeze; do not silently expand this contract.

## In Scope

- Add one employee-visible refresh/re-check action inside the mounted N1 continuation screen after N1 is already rendered.
- The refresh action must call generated `fetchLearningMeRouteProgress` first.
- If route-progress still returns the safe N1 resume state:
  - `diagnosticState=SUBMITTED`;
  - `routePreview=true`;
  - `recommendedFirstLessonId=N1`;
  - `n1.status=STARTED`;
  - `nextAction=RESUME_N1`;
  then refresh must derive read-only progress from that response and call generated `fetchLearningMeLessonDetail` for `N1`.
- The refresh must update mounted `routeProgress`, read-only `lessonProgress` and `lessonDetail` from those backend reads.
- The refresh must not call generated `startLearningMeLesson` or `POST /api/v1/learning/me/lessons/N1/start`.
- The existing first-open paths must remain working:
  - `START_N1` may still call `startLearningMeLesson`, then refresh route-progress, then read lesson detail.
  - already-started reopen may still render from `GET route-progress` + `GET lesson detail` with no `POST /start`.
- If refresh returns unsupported state or a non-success response, render a neutral Russian notice and keep the previously loaded N1 detail visible; do not downgrade into completion, restart, scoring or hidden state.
- Add or update focused web tests proving the refresh action uses generated read helpers only and does not invoke start/resume mutation.
- Add browser/API smoke evidence or equivalent browser-backed test proving the click produces `GET route-progress` + `GET lesson detail` and no `POST /start`.
- Keep profile-session token only in mounted component memory: no URL path/query/hash, localStorage, sessionStorage, cookies, IndexedDB, service-worker caches, console logs, request/response echoes or tracked screenshots.
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
- No backend production code, Flyway migration, OpenAPI operation or generated-client source changes are introduced unless the builder stops and re-freezes first.
- Existing generated `fetchLearningMeRouteProgress` is used for the N1-screen refresh.
- Existing generated `fetchLearningMeLessonDetail` is used after the safe `RESUME_N1` refresh summary.
- Existing generated `startLearningMeLesson` is not called by the N1-screen refresh.
- `POST /api/v1/learning/me/lessons/N1/start` is absent from refresh-path browser/API proof.
- Existing `START_N1` first-start behavior remains working.
- Existing read-only reopen behavior remains working.
- Mounted N1 continuation stays visible during and after a failed/unsupported refresh, with a safe non-sensitive notice.
- User-visible copy is Russian, neutral, privacy-first and mobile-first.
- Browser/source evidence confirms no token appears in URL before, during or after refresh and no token is stored in `localStorage`, `sessionStorage`, cookies, IndexedDB or service-worker caches.
- No final scoring, final route assignment, `R1-R6`, HR reporting, analytics/events, points, rewards, lesson completion, theory completion, quiz/practice submission, exact sensitive data, advice, customer brand or real data is introduced.
- Scoped functional pass is allowed only after builder evidence and fresh verifier `PASS`; until then `passes=false`.

## Required Validation

The builder must run and record command evidence with exit status and raw refs:

- focused web test for N1-screen read-only refresh and no start/resume mutation;
- `pnpm --filter @finrhythm/web typecheck`;
- `pnpm --filter @finrhythm/web test`;
- `pnpm --filter @finrhythm/web build`;
- focused backend regression test for existing learning route/progress/detail/start behavior, for example `cd apps/api && ./mvnw -q -Dtest=LearningProgressControllerIT test` or exact available substitute;
- `cd apps/api && ./mvnw -q verify`;
- `pnpm --filter @finrhythm/api-client check:generated`;
- `pnpm --filter @finrhythm/api-client check:openapi-drift`;
- `pnpm --filter @finrhythm/api-client typecheck`;
- `pnpm --filter @finrhythm/api-client build`;
- browser/API smoke proving already-rendered N1 continuation can refresh status through `GET route-progress` + `GET lesson detail` and no `POST /start`, with screenshots or structured browser-network proof;
- browser/API smoke or focused regression proving initial read-only reopen still uses `GET route-progress` + `GET lesson detail` and no `POST /start`;
- browser/API smoke or focused regression proving first `START_N1` path still works;
- `make verify`;
- `make test-unit`;
- `make build`;
- `jq empty` for changed JSON artifacts;
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`;
- guardrail scans for first touch, no backend contract/schema changes, generated helper usage, no hand-written lesson detail fetch/DTOs, no token storage/URL leakage, no start mutation on refresh path, no N2+ scope, no completion/theory/quiz/practice/points/rewards, no scoring/R1-R6/HR reports/analytics, no exact sensitive data/advice and no real data.

## Evidence Handoff Required

The builder must record:

- changed production/test files, with first-touch proof;
- N1-screen refresh summary;
- explicit proof that refresh uses `GET route-progress` + `GET lesson detail` only and does not call `POST /start`;
- proof that first-start path still works;
- proof that read-only reopen path still works;
- generated helper(s) used by web;
- exact mounted flow: rendered N1 continuation -> refresh click -> route-progress `RESUME_N1` -> lesson-detail read -> updated continuation render;
- failed/unsupported refresh behavior and proof that previous N1 detail remains visible;
- proof that the profile-session token stays in mounted component memory only;
- browser screenshots or structured browser-network proof raw refs;
- command raw refs and outcomes;
- backend/API regression notes;
- guardrail scan raw refs;
- docs updated or explicit docs `NOOP` decision;
- backend baseline note: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- human-gate status and explicit non-closure;
- explicit out-of-scope confirmation for completion, theory completion, quiz, practice, points, rewards, scoring, `R1-R6`, HR reports, analytics/events, exact sensitive data, advice and full MVP closure;
- immutable evidence/verdict/problems refs for `MVP-07-n1-readonly-status-refresh-001` after builder and fresh verifier phases.

## Doc Targets And Diagram Expectations

- Product docs target: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` and `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` if existing N1 semantics, draft review status, sensitive-data rules and mobile lesson patterns are followed.
- Architecture doc target: conditional `docs/architecture/access-and-subscriptions.md` section 7.4 update only if existing text does not clearly cover user-triggered N1 refresh from mounted continuation via read-only route-progress + lesson-detail.
- API/generated-client docs target: `NOOP_EXPECTED`; update `packages/api-client/README.md` only if helper coverage wording needs a narrow clarification.
- Stage evidence diagram expectation: compact flow from rendered N1 continuation to refresh click, `GET route-progress`, `GET lesson detail`, state update, and "no POST /start"; can be stage evidence only unless canonical docs require update.

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

`MVP-07-n1-readonly-status-refresh-001` now has builder implementation evidence and fresh verifier `PASS`.

- Builder evidence:
  - `.agent/stages/mvp/evidence/MVP-07-n1-readonly-status-refresh-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-n1-readonly-status-refresh-001.json`
- Fresh verifier PASS:
  - `.agent/stages/mvp/verdicts/MVP-07-n1-readonly-status-refresh-001.json`
  - `.agent/stages/mvp/problems/MVP-07-n1-readonly-status-refresh-001.md`
  - `.agent/stages/mvp/raw/verifier-MVP-07-n1-readonly-status-refresh-001-20260514-fresh/`
- Parent evidence/verdict/problems aliases now point to this sprint.
- Full MVP-06, full MVP-07, the MVP stage and all human gates remain open.
- Post-PASS publish is required now because `publish_after_pass=true`.

## Post-PASS Publish Manifest Requirements

After builder evidence and fresh verifier `PASS`, update `.agent/stages/mvp/publish_manifest.json` before invoking `$push-main`.

The manifest must include:

- `publish_after_pass: true`;
- sprint id `MVP-07-n1-readonly-status-refresh-001`;
- intended branch and commit summary;
- PR title/body in Russian;
- proof refs for evidence, verdict and problems;
- validation commands and browser/API refresh proof refs;
- doc-sync refs or explicit docs `NOOP` decision;
- explicit human gates still open;
- continuation prompt asking the next `stage_orchestrator` to continue from updated `main`, preserve the proof loop, choose the next highest-impact verified product slice and repeat post-PASS publish.
