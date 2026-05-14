# Sprint contract: MVP-07-n1-route-progress-summary-001

Stage: `mvp`
Parent unit: scoped prerequisite across `MVP-07.04` safe resume/retry and `MVP-06.04` N1 progress visibility
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Proof status: `PASS`
Functional passes: `true`
Created: 2026-05-14
Owner role: `stage_builder`
Publish after pass: `true`

## Purpose

After the verified `MVP-07-diagnostic-n1-learning-progress-001` slice, the product has diagnostic submit -> backend-owned `N1` start/resume progress -> mounted web `N1` continuation.

The next high-impact slice is a read-only backend-owned route/progress summary for the same mounted profile-session flow. It should answer: "is diagnostic handoff ready, and can this employee start or resume `N1`?" without mutating progress, without final scoring/routing and without moving the profile-session token out of component memory.

This is not full `MVP-06`, not full `MVP-07`, not final route assignment, not lesson completion, not analytics, not points/rewards and not a human-gate closure.

## Baseline And Source Refs

- Latest fresh verifier `PASS`: `MVP-07-diagnostic-n1-learning-progress-001`.
- Current immutable PASS proof refs:
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-n1-learning-progress-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-n1-learning-progress-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-diagnostic-n1-learning-progress-001.json`
  - `.agent/stages/mvp/problems/MVP-07-diagnostic-n1-learning-progress-001.md`
- Latest aliases `evidence.json`, `verdict.json` and `problems.md` now point to `MVP-07-n1-route-progress-summary-001` after builder/fixer evidence and a fresh verifier rerun `PASS`.
- Backend baseline is mandatory: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Repo state confirmed by spec freeze:
  - existing learning backend exposes `POST /api/v1/learning/me/lessons/{lessonId}/start`;
  - existing generated client exposes `startLearningMeLesson`;
  - no read-only route/progress summary endpoint or generated helper exists yet;
  - `apps/web/components/diagnostic-api-flow-screen.ts` keeps `profileSessionToken` in mounted state/props and starts `N1` through the generated helper;
  - `apps/web` renders synthetic `N1` display content only after backend start/resume succeeds.

Do not read `.agent/stages/**/raw/**` unless a current evidence/problem/audit question names an exact raw ref.

## Required Inputs For Builder

Use read-gating from `READ_MATRIX.md` and read only current sources needed for implementation:

- `AGENTS.md`;
- `apps/api/AGENTS.md`;
- `apps/web/AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md` relevant `MVP-06` and `MVP-07` sections;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` learning loop and privacy/reporting snippets;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` N1, status, diagnostic handoff, sensitive-data and reporting snippets;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` progress, route result, lesson and privacy patterns;
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`;
- current diagnostic/profile-session/learning code under `apps/api`;
- current mounted profile-session diagnostic/N1 code under `apps/web`;
- current generated api-client contract surface.

## Builder First Touch

The first meaningful builder touch must be in `apps/api` production or test files, not `.agent`, docs, `apps/web`, generated client, OpenAPI snapshot or evidence.

Preferred first-touch targets:

- `apps/api/src/main/java/com/finrhythm/api/learning/service/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/persistence/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/web/**`;
- focused backend integration test under `apps/api/src/test/java/com/finrhythm/api/learning/**`.

No migration is expected. If the builder proves a migration is required, it must be append-only and use the next available Flyway version, likely `V013`.

## In Scope

- Add a read-only backend route/progress summary endpoint under existing employee profile-session bearer auth. Preferred shape:
  - `GET /api/v1/learning/me/route-progress`.
- The endpoint must accept no request body and must resolve registration/scope server-side from the authenticated profile session.
- Compose only existing safe state:
  - diagnostic state: `NOT_STARTED`, `DRAFT` or `SUBMITTED`;
  - `routePreview=true` and `recommendedFirstLessonId=N1` only when the current diagnostic attempt is safely submitted;
  - `N1` progress status: `NOT_STARTED` or `STARTED`;
  - `startedAt` and `lastOpenedAt` only when an `N1` progress row exists;
  - safe next action such as `COMPLETE_DIAGNOSTIC`, `START_N1` or `RESUME_N1`.
- The read endpoint must not create, update or delete diagnostic attempts or lesson progress.
- Cross-registration isolation must hold: one employee sees only their own diagnostic/progress summary.
- Missing, malformed, unknown, expired and revoked profile-session tokens must return safe `401` without persistence.
- Update OpenAPI from backend source and regenerate/synchronize `packages/api-client`.
- Add a generated client helper for the route/progress summary; web must consume that helper, not hand-written URLs/fetches/DTOs.
- Wire the mounted `/profile/session` diagnostic/N1 flow to render a compact route/progress panel:
  - after a submitted diagnostic handoff is detected;
  - before starting `N1`, showing that `N1` has not started yet;
  - after successful start/resume, showing the backend-owned `STARTED` summary.
- Keep `N1` display content synthetic and draft/human-review-required.
- Preserve existing `/start`, `/onboarding/privacy`, `/profile/session`, legal acceptance, profile contact update, diagnostic draft GET/PUT/POST, diagnostic submit and `POST /learning/me/lessons/N1/start` behavior unless directly scoped.
- Keep standalone `/diagnostics` preview-only.
- Profile-session token must remain only in mounted component memory: no URL path/query/hash, `localStorage`, `sessionStorage`, cookies, `document.cookie`, `cookieStore`, IndexedDB, service-worker caches, console logs, request/response echoes or tracked screenshots.

## Out Of Scope

- Full `MVP-06`, full `MVP-07`, full MVP stage or human-gate closure.
- Learning completion, theory-completed state, quiz submission/scoring, practice submission, `completed`, `mastered`, `needs_reinforcement` or unlocking `N2+`.
- Points, rewards, wallet, ledger, anti-farm rewards, challenge progress, store, merch or fulfillment.
- Final diagnostic scoring/routing, full `Q1-Q27`, `Q28`, final `R1-R6`, weak zones, final level, route explanation correctness, HR diagnostic insights, HR reports or analytics/events.
- Production CMS/admin lesson publishing, content states, publish validation, lesson CRUD, production content approval or methodologist workflow closure.
- `N2+` backend progress, optional `Z1/Z4/Z9`, support handoff or question forms.
- Exact income, debt, balance, account numbers, photos, documents, bank screenshots, exact-sum requirements or free-form personal finance reports.
- Personal financial, investment, tax, credit, debt or legal advice.
- Customer brand in employee-facing UI, real employee/customer/personal/financial data or production legal/privacy wording approval.
- Login/password setup, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, SSO/SCIM, B2C billing, `pro_user` or `premium` shortcuts.

## Acceptance Checklist

- First meaningful builder touch is in `apps/api` production/test files.
- Backend controller remains thin; route/progress composition lives in service/repository code.
- New endpoint requires `employeeProfileSessionBearerAuth`.
- Endpoint is read-only and persists nothing in all success and failure states.
- Request body is absent; request does not accept employee registration, tenant, pilot launch, access pool, user, organization, subscription, seat or entitlement identifiers.
- Response includes only safe summary fields and no internal scope IDs, attempt IDs, progress IDs, raw tokens, token hashes, raw invite codes, lookup hashes, diagnostic answers, score, final level, `R1-R6`, weak zones, HR insight fields, request body echo, response body echo or exact sensitive values.
- `NOT_STARTED` is response-level only unless a migration explicitly and safely introduces it; the existing `employee_lesson_progress` table must not be polluted by read-only checks.
- Diagnostic `DRAFT` and `SUBMITTED` states are distinguished without exposing answers.
- `N1` status is `NOT_STARTED` when no progress row exists and `STARTED` after the prior start/resume endpoint succeeds.
- Cross-registration isolation is covered by backend tests.
- Missing, malformed, unknown, expired and revoked profile-session tokens return safe `401` without diagnostic or learning persistence.
- OpenAPI snapshot reflects the new read endpoint, auth and response DTOs.
- `packages/api-client` generated contracts/helpers are synchronized from OpenAPI/source.
- Web route/progress panel uses generated helper(s); no hand-written learning route-progress endpoint URLs/fetches/DTOs are introduced.
- Web panel copy is Russian, neutral, privacy-first and mobile-first.
- Browser evidence covers profile-session creation, legal acceptance, diagnostic submitted handoff, route/progress summary before `N1` start, `N1` start/resume and route/progress summary after start.
- Browser/source evidence confirms no token appears in URL before, during or after route-progress summary and N1 continuation.
- Existing safe diagnostic handoff still exposes only `routePreview=true`, `recommendedFirstLessonId=N1`, state and timestamps.
- No final scoring, final route assignment, `R1-R6`, HR reporting, analytics/events, points, rewards, lesson completion, quiz/practice submission, exact sensitive data, advice, customer brand or real data is introduced.
- Scoped functional pass is allowed only after builder evidence and fresh verifier `PASS`.

## Required Validation

The builder must run and record command evidence with exit status and raw refs:

- focused backend learning route/progress test, for example `cd apps/api && ./mvnw -q -Dtest=*RouteProgress* test` or exact available substitute;
- `cd apps/api && ./mvnw -q verify`;
- OpenAPI generation/check command used by this repo;
- `pnpm --filter @finrhythm/api-client build`;
- `pnpm --filter @finrhythm/api-client check:generated`;
- `pnpm --filter @finrhythm/api-client check:openapi-drift`;
- `pnpm --filter @finrhythm/api-client typecheck`;
- `pnpm --filter @finrhythm/web typecheck`;
- `pnpm --filter @finrhythm/web test`;
- `pnpm --filter @finrhythm/web build`;
- browser smoke covering route/progress summary before and after `N1` start/resume, with screenshots;
- `make verify`;
- `make test-unit`;
- `make build`;
- `jq empty` for changed JSON artifacts;
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`;
- guardrail scans for first touch, read-only endpoint behavior, no token storage/URL leakage, no hand-written route-progress fetch/DTOs, no response scope/answer/scoring leaks, N1-only scope, no completion/quiz/practice/points/rewards, no scoring/R1-R6/HR reports/analytics, no exact sensitive data/advice and no real data.

## Evidence Handoff Required

The builder must record:

- changed production/test files, with first-touch proof;
- endpoint request/response/auth summary;
- explicit read-only/no-persistence proof for success and failure states;
- service/repository isolation behavior;
- OpenAPI and generated-client sync notes;
- generated route/progress helper(s) used by web;
- exact diagnostic-to-route-progress-to-N1 flow;
- proof that the profile-session token stays in mounted component memory only;
- browser screenshots and smoke raw refs;
- command raw refs and outcomes;
- guardrail scan raw refs;
- docs updated and diagram refs;
- backend baseline note: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- explicit out-of-scope confirmation for completion, quiz, practice, points, rewards, scoring, `R1-R6`, HR reports, analytics/events, exact sensitive data, advice and full MVP closure;
- immutable evidence/verdict/problems refs for `MVP-07-n1-route-progress-summary-001` after builder and fresh verifier phases.

## Doc Targets And Diagram Expectations

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md`, because the profile-session learning boundary expands from `N1` start/resume mutation to a read-only route/progress summary. Refresh section 7.4 with the GET summary endpoint and a compact Mermaid flow/state diagram.
- Product docs target: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` and `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` if existing N1, progress, privacy, route-preview and mobile patterns are followed.
- Update product docs only if the builder changes N1 lesson semantics, methodology statuses, sensitive-data rules, route-handoff assumptions, UI copy rules or design-system behavior.
- API/generated-client docs target: update generated-client notes only if the repo has a relevant generated-client README/notes path or generator behavior changes.
- Stage evidence diagram expectation: required compact Mermaid flow from submitted diagnostic to route-progress summary, optional `N1` start/resume and refreshed summary.

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

## Current Limitation

`MVP-07-n1-route-progress-summary-001` is frozen only. It has no builder evidence, no fresh verifier verdict and no functional PASS.

Latest verified sprint remains `MVP-07-diagnostic-n1-learning-progress-001`. This new slice must keep `passes=false` until implementation evidence and fresh verification exist.
