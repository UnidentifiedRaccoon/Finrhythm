# Sprint contract: MVP-07-diagnostic-n1-learning-progress-001

Stage: `mvp`
Parent unit: scoped prerequisite across `MVP-07` safe diagnostic handoff and `MVP-06.04` / N1 learning delivery
Status: `SCOPED_PASS`
Proof status: `FRESH_VERIFIER_PASS`
Functional passes: `true`
Created: 2026-05-14
Owner role: `stage_builder`
Publish after pass: `true`

## Purpose

After the verified diagnostic submit flow returns `recommendedFirstLessonId="N1"`, add the smallest backend-owned lesson start/resume progress foundation for synthetic N1 and wire the web continuation to that backend through generated `@finrhythm/api-client` helpers.

This is a narrow handoff slice. It makes the N1 continuation durable enough to prove that a profile-session authenticated employee can start or resume N1 after diagnostics, while keeping the profile-session token only in mounted component memory.

It is not full `MVP-06`, not full `MVP-07`, not a scoring/routing engine, not lesson completion, not quiz/practice submission, not points/rewards and not a human-gate closure.

## Baseline And Source Refs

- Previous fresh verifier `PASS` before this contract: `MVP-07-diagnostic-web-api-integration-001`.
- Current immutable PASS proof refs:
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-n1-learning-progress-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-n1-learning-progress-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-diagnostic-n1-learning-progress-001.json`
  - `.agent/stages/mvp/problems/MVP-07-diagnostic-n1-learning-progress-001.md`
- Previous immutable proof refs:
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-web-api-integration-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-web-api-integration-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-diagnostic-web-api-integration-001.json`
  - `.agent/stages/mvp/problems/MVP-07-diagnostic-web-api-integration-001.md`
- Latest aliases `evidence.json`, `verdict.json` and `problems.md` now point to `MVP-07-diagnostic-n1-learning-progress-001` after parent PASS sync.
- Backend baseline is mandatory: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Known repo baseline before builder:
  - no `apps/api/src/main/java/com/finrhythm/api/learning/**` package exists yet;
  - latest migration is `V011__diagnostic_draft_attempt.sql`;
  - existing web flow has `DiagnosticApiFlowScreen` in mounted `/profile/session` after legal acceptance;
  - existing diagnostic submit handoff renders safe N1;
  - existing web N1 lesson renderer/fixture is synthetic and display-only.

Do not read `.agent/stages/**/raw/**` unless a current evidence/problem/audit question names an exact raw ref.

## Required Inputs For Builder

Use read-gating from `READ_MATRIX.md` and read only current sources needed for the implementation:

- `AGENTS.md`;
- `apps/api/AGENTS.md`;
- `apps/web/AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md` relevant `MVP-06` and `MVP-07` sections;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` learning loop and privacy/reporting snippets;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` N1, lesson status, diagnostic handoff, sensitive-data and analytics snippets;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` route result, lesson, progress and privacy patterns;
- `docs/architecture/access-and-subscriptions.md` current profile-session and diagnostic draft boundaries;
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`;
- current diagnostic/profile-session code under `apps/web`;
- current synthetic N1 renderer/fixture files under `apps/web`;
- current diagnostic/profile-session backend code under `apps/api`;
- current generated api-client contract surface.

## Builder First Touch

The first meaningful builder touch must be in `apps/api` production or test files, not `.agent`, docs, `apps/web`, generated client, OpenAPI snapshot or evidence.

Preferred first-touch targets:

- `apps/api/src/main/resources/db/migration/V012__employee_lesson_progress.sql`;
- new `apps/api/src/main/java/com/finrhythm/api/learning/**`;
- focused backend integration test under `apps/api/src/test/java/com/finrhythm/api/learning/**` or an equivalent focused IT.

Stage artifacts, docs, generated client and web integration come only after backend production/test work exists.

## In Scope

- Add append-only Flyway migration for employee lesson progress for N1 only.
- Add backend `learning` service/repository/controller surface under existing employee profile-session bearer auth.
- Resolve `employee_registration_id`, `tenant_id`, `pilot_launch_id` and `access_pool_id` server-side from the authenticated profile session; do not accept those values from request bodies.
- Implement idempotent N1 start/resume progress. Preferred API surface:
  - `POST /api/v1/learning/me/lessons/{lessonId}/start` for idempotent start/resume;
  - optional `GET /api/v1/learning/me/lessons/{lessonId}/progress` if it makes resume clearer.
- Restrict `lessonId` to `N1` for this contract. `N2+`, full lesson catalogs and CMS-backed lesson lookup remain out of scope.
- Persist only minimal progress fields needed to prove start/resume, for example lesson id, status `NOT_STARTED|STARTED`, timestamps and registration/scope references.
- Repeated start/resume for the same profile-session registration and `N1` must be safe and non-duplicating.
- A different employee registration must not see or mutate another registration's N1 progress.
- Keep raw profile-session token, raw invite code, token hash, lookup hash, contact proof, diagnostic answers, exact sums, free-form personal finance reports and request/response bodies out of lesson-progress storage and logs.
- Update OpenAPI from backend source and regenerate/synchronize `packages/api-client` so web uses generated learning helper(s), not hand-written fetch calls or duplicate DTOs.
- Wire the web continuation after diagnostic submit to call the generated learning helper(s) with the profile-session token kept only in mounted component memory.
- Prefer rendering or continuing N1 inside the same mounted profile-session component tree after successful backend start/resume. If the builder uses `/learning/lessons/N1`, it must prove the token is not transferred through URL/storage/cookies and that progress start/resume happened before navigation while the token was still in memory.
- Reuse the existing synthetic N1 `LessonRendererScreen`/fixture as display content; backend owns progress state, not lesson content.
- Keep standalone `/diagnostics` as preview-only unless a narrower safe replacement is proven.
- Preserve existing `/start`, `/onboarding/privacy`, `/profile/session`, legal acceptance, profile contact, diagnostic draft GET/PUT/POST and `/learning/lessons/N1|N2|N3` behavior unless directly scoped.

## Out Of Scope

- Full `MVP-06`, full `MVP-07`, full MVP stage or human-gate closure.
- Learning completion, theory-completed state, quiz submission/scoring, practice submission, `completed`, `mastered` or `needs_reinforcement` state.
- Points, rewards, wallet, ledger, anti-farm rewards, challenge progress, merch or store behavior.
- Final diagnostic scoring/routing, full `Q1-Q27`, `Q28`, final `R1-R6`, weak zones, final level, HR diagnostic insights, HR reports or analytics/events.
- Production CMS/admin lesson publishing, content states, publish validation, lesson CRUD, production content approval or methodologist workflow closure.
- `N2+` backend progress, route ordering beyond safe N1 handoff, optional `Z1/Z4/Z9`, support handoff or question forms.
- Exact income, debt, balance, account numbers, photos, documents, bank screenshots, exact-sum requirements or free-form personal finance reports.
- Personal financial, investment, tax, credit, debt or legal advice.
- Customer brand in employee-facing UI, real employee/customer/personal/financial data or production legal/privacy wording approval.
- Login/password setup, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, SSO/SCIM, B2C billing, `pro_user` or `premium` shortcuts.

## Acceptance Checklist

- First meaningful builder touch is in `apps/api` production/test files.
- Migration is append-only and uses the next available version, expected `V012__employee_lesson_progress.sql` if the repository has not advanced.
- Backend code lives in a focused learning package/service/repository/controller shape; controllers stay thin.
- All new learning endpoints require `employeeProfileSessionBearerAuth`.
- Request bodies do not accept employee registration, tenant, pilot launch, access pool, user, organization, subscription, seat or entitlement identifiers.
- Only `N1` is allowed; unsupported lesson ids return a safe client error and do not persist progress.
- Start/resume is idempotent for the same authenticated registration and N1.
- Cross-registration isolation is covered by tests.
- Expired, revoked, missing, malformed and unknown profile-session tokens return safe `401` without lesson progress persistence.
- No raw profile-session token, raw invite code, token hash, lookup hash, contact proof, diagnostic answers, exact sensitive values, request bodies or response bodies are persisted.
- OpenAPI snapshot reflects the new learning endpoint(s), auth and response DTOs.
- `packages/api-client` generated contracts/helpers are synchronized from OpenAPI/source.
- Web continuation uses generated `@finrhythm/api-client` learning helper(s); no hand-written learning endpoint URLs/fetches/DTOs are introduced.
- Profile-session token remains only in mounted component memory and is not written to URL path/query/hash, `localStorage`, `sessionStorage`, cookies, `document.cookie`, `cookieStore`, IndexedDB, service-worker caches or logs.
- Diagnostic submit still renders only safe N1 handoff fields and does not gain score, level, weak-zone, HR report, points or completion claims.
- N1 rendering/continuation stays Russian, neutral, privacy-first, mobile-first and aligned with design-system v0.1.
- Existing synthetic N1 content remains draft/synthetic and does not claim financial/legal approval or production content approval.
- Browser/mobile evidence covers profile-session creation, legal acceptance, diagnostic GET/PUT/POST, N1 progress start/resume API call and N1 continuation.
- Browser/source evidence confirms no token appears in URL before, during or after the N1 progress continuation.
- Scoped functional pass is allowed only for this contract after builder evidence and fresh verifier PASS.

## Required Validation

The builder must run and record command evidence with exit status and raw refs:

- focused backend learning integration test, for example `cd apps/api && ./mvnw -q -Dtest=*Learning* test` or exact available substitute;
- `cd apps/api && ./mvnw -q verify`;
- OpenAPI generation/check command used by this repo;
- `pnpm --filter @finrhythm/api-client build`;
- `pnpm --filter @finrhythm/api-client check:generated`;
- `pnpm --filter @finrhythm/api-client check:openapi-drift`;
- `pnpm --filter @finrhythm/api-client typecheck`;
- `pnpm --filter @finrhythm/web typecheck`;
- `pnpm --filter @finrhythm/web test`;
- `pnpm --filter @finrhythm/web build`;
- browser smoke covering diagnostic N1 start/resume continuation, with screenshots;
- `make verify`;
- `make test-unit`;
- `make build`;
- `jq empty` for changed JSON artifacts;
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`;
- guardrail scans for first touch, no token storage/URL leakage, no hand-written learning fetch/DTOs, N1-only scope, no completion/quiz/practice/points/rewards, no scoring/R1-R6/HR reports/analytics, no exact sensitive data/advice and no real data.

## Evidence Handoff Required

The builder must record:

- changed production/test files, with first-touch proof;
- migration summary and table/index/constraint shape;
- learning endpoint request/response/auth summary;
- service/repository idempotency and isolation behavior;
- OpenAPI and generated-client sync notes;
- generated learning helper(s) used by web;
- exact diagnostic-to-N1 progress continuation flow;
- proof that the profile-session token stays in mounted component memory only;
- browser screenshots and smoke raw refs;
- command raw refs and outcomes;
- guardrail scan raw refs;
- docs updated and diagram refs;
- backend baseline note: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- explicit out-of-scope confirmation for completion, quiz, practice, points, rewards, scoring, `R1-R6`, HR reports, analytics/events, exact sensitive data, advice and full MVP closure;
- immutable evidence/verdict/problems refs for `MVP-07-diagnostic-n1-learning-progress-001` after builder and fresh verifier phases.

## Doc Targets And Diagram Expectations

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md`, because the profile-session bearer boundary expands from profile/contact/diagnostics to N1 learning progress. Add or refresh a compact Mermaid learning progress handoff/state diagram unless the builder proves existing docs already cover this exact boundary.
- Product docs target: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` and `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` if existing N1, progress, privacy and mobile patterns are followed.
- Update product docs only if the builder changes N1 lesson semantics, methodology statuses, sensitive-data rules, route-handoff assumptions, UI copy rules or design-system behavior.
- API/generated-client docs target: update generated-client notes only if the repo has a relevant generated-client README/notes path or generator behavior changes.
- Stage evidence diagram expectation: required compact Mermaid flow from diagnostic submit to N1 progress start/resume and N1 continuation.
- Canonical Mermaid expectation: required in `docs/architecture/access-and-subscriptions.md` unless existing canonical docs already cover this exact learning-progress profile-session boundary.

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

`MVP-07-diagnostic-n1-learning-progress-001` has scoped fresh verifier `PASS`.

This does not close full `MVP-06`, full `MVP-07`, the MVP stage or any human gate. Post-PASS publish is required because `publish_after_pass=true`.
