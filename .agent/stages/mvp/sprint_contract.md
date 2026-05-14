# Sprint contract: MVP-07-n1-lesson-detail-continuation-001

Stage: `mvp`
Parent unit: scoped prerequisite across `MVP-06.03` lesson renderer, `MVP-06.04` N1 progress visibility and `MVP-07.04` safe resume/continuation
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Proof status: `PASS`
Functional passes: `true`
Created: 2026-05-14
Owner role: `stage_builder`
Publish after pass: `true`

## Purpose

After the verified `MVP-07-n1-route-progress-summary-001` slice, the mounted `/profile/session` flow can submit the safe diagnostic handoff, read a backend-owned route/progress summary, start/resume `N1` and render the N1 continuation. The remaining product gap is that the mounted continuation still renders N1 lesson content from the web synthetic fixture instead of a backend-owned read model.

The next small high-impact slice is a read-only, profile-session authenticated N1 lesson detail/continuation endpoint and generated-client web integration. It should let the mounted flow open backend-owned N1 lesson details, draft review status and provenance after the existing N1 start/resume proof, while keeping the profile-session token in mounted component memory only.

This is not full `MVP-06`, not full `MVP-07`, not final route assignment, not lesson completion, not quiz/practice submission, not analytics, not points/rewards and not a human-gate closure.

## Baseline And Source Refs

- Latest fresh verifier `PASS`: `MVP-07-n1-route-progress-summary-001`.
- Current immutable PASS proof refs:
  - `.agent/stages/mvp/evidence/MVP-07-n1-route-progress-summary-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-n1-route-progress-summary-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-n1-route-progress-summary-001.json`
  - `.agent/stages/mvp/problems/MVP-07-n1-route-progress-summary-001.md`
- Latest aliases `evidence.json`, `verdict.json` and `problems.md` remain on the previous PASS until this new sprint has builder evidence and a fresh verifier verdict.
- Backend baseline is mandatory: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Repo state confirmed by spec freeze:
  - existing learning backend exposes `GET /api/v1/learning/me/route-progress` and `POST /api/v1/learning/me/lessons/{lessonId}/start`;
  - existing generated client exposes `fetchLearningMeRouteProgress` and `startLearningMeLesson`;
  - `apps/web/components/diagnostic-api-flow-screen.ts` keeps `profileSessionToken` in mounted state/props and opens N1 after route-progress/start;
  - the mounted N1 continuation currently renders `syntheticN1LessonFixture` from `apps/web` fixture code;
  - no backend-owned N1 lesson detail/content endpoint or generated helper exists yet.

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
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` N1, lesson template, status, diagnostic handoff and sensitive-data snippets;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` lesson, progress, privacy and mobile patterns;
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`;
- `content/getcourse-finstrategy/README.md`, `CONTENT_BRIEF.md`, `content-baseline.manifest.json` and the N1 source `content/getcourse-finstrategy/24-lesson-235010163.md` only if content provenance or review status is touched;
- current diagnostic/profile-session/learning code under `apps/api`;
- current mounted profile-session diagnostic/N1 code under `apps/web`;
- current generated api-client contract surface.

## Builder First Touch

The first meaningful builder touch must be in `apps/api` production or test files, not `.agent`, docs, `apps/web`, generated client, OpenAPI snapshot or evidence.

Preferred first-touch targets:

- `apps/api/src/test/java/com/finrhythm/api/learning/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/service/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/web/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/domain/**`.

No migration is expected for the minimal read-only draft detail provider. If the builder proves persistence is required, it must be append-only and use the next available Flyway version, likely `V013`.

## In Scope

- Add one read-only backend N1 lesson detail/continuation endpoint under existing employee profile-session bearer auth. Preferred shape:
  - `GET /api/v1/learning/me/lessons/{lessonId}`.
- The endpoint must accept no request body and no client-provided employee, tenant, pilot launch, access pool, organization, subscription, seat or entitlement identifiers.
- Resolve registration/scope server-side from the authenticated profile session.
- Restrict supported lesson detail to `N1` only.
- Return N1 detail only after the employee has a safe submitted diagnostic N1 handoff and an existing `N1` `STARTED` progress row from the verified start/resume endpoint. Before that point, return a safe non-success response without lesson content.
- The read endpoint must not create, update or delete diagnostic attempts, lesson progress or lesson content.
- Compose only safe draft lesson detail fields, for example:
  - `lessonId=N1`, route/display title, short title, user promise and estimated time;
  - competency codes `C1`, `C2`, `C8`, `C9`;
  - `disclaimerType=education`;
  - draft review metadata: `reviewStatus`, `humanReviewRequired=true`, `productionReady=false`, wording/financial/legal review status;
  - provenance/source refs for methodology and active GetCourse source paths;
  - display-only lesson blocks needed to read N1 in the mounted continuation;
  - sensitive-data policy notes that exact sums, photos, documents, bank screenshots and financial-service names are not required.
- Response must not expose quiz answer keys, scoring, practice submission payloads, completion rules that persist state, reward rules that imply accrual, points wallet fields, internal scope IDs, raw tokens, token hashes, raw invite codes, diagnostic answers, score, final level, `R1-R6`, weak zones or HR/reporting fields.
- Update OpenAPI from backend source and regenerate/synchronize `packages/api-client`.
- Add a generated client helper for the lesson detail read; web must consume that helper, not hand-written URLs/fetches/DTOs.
- Wire the mounted `/profile/session` diagnostic -> route-progress -> N1 start/resume flow to fetch backend-owned N1 detail after successful start/resume and render it in the same mounted tree.
- The mounted N1 continuation must no longer use `syntheticN1LessonFixture` or web-owned N1 content as its displayed lesson payload. Standalone `/learning` demo fixture routes may remain unchanged unless directly required for shared renderer compatibility.
- Preserve existing `/start`, `/onboarding/privacy`, `/profile/session`, legal acceptance, profile contact update, diagnostic draft GET/PUT/POST, diagnostic submit, `GET /learning/me/route-progress` and `POST /learning/me/lessons/N1/start` behavior unless directly scoped.
- Keep standalone `/diagnostics` preview-only.
- Profile-session token must remain only in mounted component memory: no URL path/query/hash, `localStorage`, `sessionStorage`, cookies, `document.cookie`, `cookieStore`, IndexedDB, service-worker caches, console logs, request/response echoes or tracked screenshots.

## Out Of Scope

- Full `MVP-06`, full `MVP-07`, full MVP stage or human-gate closure.
- Learning completion, theory-completed state, quiz submission/scoring, practice submission, `completed`, `mastered`, `needs_reinforcement` or unlocking `N2+`.
- Points, rewards, wallet, ledger, anti-farm rewards, challenge progress, store, merch or fulfillment.
- Final diagnostic scoring/routing, full `Q1-Q27`, `Q28`, final `R1-R6`, weak zones, final level, route explanation correctness, HR diagnostic insights, HR reports or analytics/events.
- Production CMS/admin lesson publishing, content states workflow, publish validation, lesson CRUD, production content approval or methodologist workflow closure.
- `N2+` backend progress/detail, optional `Z1/Z4/Z9`, support handoff or question forms.
- Exact income, debt, balance, account numbers, photos, documents, bank screenshots, exact-sum requirements or free-form personal finance reports.
- Personal financial, investment, tax, credit, debt or legal advice.
- Customer brand in employee-facing UI, real employee/customer/personal/financial data or production legal/privacy wording approval.
- Login/password setup, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, SSO/SCIM, B2C billing, `pro_user` or `premium` shortcuts.

## Acceptance Checklist

- First meaningful builder touch is in `apps/api` production/test files.
- Backend controller remains thin; lesson detail composition and readiness checks live in service/domain code.
- New endpoint requires `employeeProfileSessionBearerAuth`.
- Endpoint is read-only and persists nothing in success and failure states.
- Request body is absent; request does not accept client-supplied scope identifiers.
- Only `N1` lesson detail is supported.
- Lesson detail is not returned before submitted diagnostic N1 handoff and existing `N1 STARTED` progress are both present.
- Missing, malformed, unknown, expired and revoked profile-session tokens return safe `401` without persistence.
- Cross-registration isolation is covered by backend tests.
- Response includes draft review status and human-gate flags, including `humanReviewRequired=true` and `productionReady=false`.
- Response includes provenance for active methodology and active GetCourse N1 source without using removed exploratory exports.
- Response does not include quiz answer keys, score, final level, `R1-R6`, weak zones, HR fields, diagnostic answers, internal scope IDs, tokens, token hashes, raw invite codes, exact sensitive values, points/wallet fields or reward accrual.
- OpenAPI snapshot reflects the new read endpoint, auth and response DTOs.
- `packages/api-client` generated contracts/helpers are synchronized from OpenAPI/source.
- Web mounted N1 continuation uses generated lesson detail helper(s); no hand-written lesson detail endpoint URLs/fetches/DTOs are introduced.
- Mounted N1 continuation renders backend-owned lesson detail, review/provenance note and privacy/sensitive-data boundary.
- Mounted N1 continuation does not use `syntheticN1LessonFixture` as the displayed payload after start/resume.
- User-visible copy is Russian, neutral, privacy-first and mobile-first.
- Browser evidence covers profile-session creation, legal acceptance, diagnostic submitted handoff, route/progress summary, N1 start/resume, backend lesson detail fetch and rendered N1 continuation.
- Browser/source evidence confirms no token appears in URL before, during or after lesson detail fetch and N1 continuation.
- Existing route/progress summary and N1 start/resume behavior remain passing.
- No final scoring, final route assignment, `R1-R6`, HR reporting, analytics/events, points, rewards, lesson completion, quiz/practice submission, exact sensitive data, advice, customer brand or real data is introduced.
- Scoped functional pass is allowed only after builder evidence and fresh verifier `PASS`.

## Required Validation

The builder must run and record command evidence with exit status and raw refs:

- focused backend lesson detail/readiness/isolation test, for example `cd apps/api && ./mvnw -q -Dtest=*LearningLesson* test` or exact available substitute;
- `cd apps/api && ./mvnw -q verify`;
- OpenAPI generation/check command used by this repo;
- `pnpm --filter @finrhythm/api-client build`;
- `pnpm --filter @finrhythm/api-client check:generated`;
- `pnpm --filter @finrhythm/api-client check:openapi-drift`;
- `pnpm --filter @finrhythm/api-client typecheck`;
- `pnpm --filter @finrhythm/web typecheck`;
- `pnpm --filter @finrhythm/web test`;
- `pnpm --filter @finrhythm/web build`;
- browser smoke covering route/progress summary, N1 start/resume, lesson detail fetch and rendered backend-owned N1 continuation, with screenshots;
- `make verify`;
- `make test-unit`;
- `make build`;
- `jq empty` for changed JSON artifacts;
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`;
- guardrail scans for first touch, read-only endpoint behavior, no token storage/URL leakage, no hand-written lesson detail fetch/DTOs, no web fixture-owned mounted N1 payload, no response scope/answer/scoring leaks, N1-only scope, no completion/quiz/practice/points/rewards, no scoring/R1-R6/HR reports/analytics, no exact sensitive data/advice and no real data.

## Evidence Handoff Required

The builder must record:

- changed production/test files, with first-touch proof;
- endpoint request/response/auth summary;
- explicit read-only/no-persistence proof for success and failure states;
- readiness behavior before and after N1 start/resume;
- service/domain isolation behavior;
- OpenAPI and generated-client sync notes;
- generated lesson detail helper(s) used by web;
- exact diagnostic-to-route-progress-to-N1-start-to-lesson-detail flow;
- proof that the profile-session token stays in mounted component memory only;
- browser screenshots and smoke raw refs;
- command raw refs and outcomes;
- guardrail scan raw refs;
- docs updated and diagram refs;
- backend baseline note: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- content provenance note for active N1 source and human-review status;
- explicit out-of-scope confirmation for completion, quiz, practice, points, rewards, scoring, `R1-R6`, HR reports, analytics/events, exact sensitive data, advice and full MVP closure;
- immutable evidence/verdict/problems refs for `MVP-07-n1-lesson-detail-continuation-001` after builder and fresh verifier phases.

## Doc Targets And Diagram Expectations

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md`, because the profile-session learning boundary expands from N1 route-progress/start to a read-only lesson detail endpoint. Refresh section 7.4 with the GET lesson detail endpoint and a compact Mermaid flow/state diagram.
- API/generated-client docs target: update `packages/api-client/README.md` if generator coverage or documented helper list changes.
- Product docs target: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` and `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` if existing N1 semantics, draft review status, sensitive-data rules and mobile lesson patterns are followed.
- Update product docs only if the builder changes N1 lesson semantics, methodology statuses, sensitive-data rules, route-handoff assumptions, UI copy rules, review workflow or design-system behavior.
- Stage evidence diagram expectation: required compact Mermaid flow from submitted diagnostic to route-progress summary, N1 start/resume, lesson detail read and mounted continuation.

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

`MVP-07-n1-lesson-detail-continuation-001` now has builder implementation evidence and command/browser proof:

- `.agent/stages/mvp/evidence/MVP-07-n1-lesson-detail-continuation-001.md`
- `.agent/stages/mvp/evidence/MVP-07-n1-lesson-detail-continuation-001.json`
- raw refs under `.agent/stages/mvp/raw/builder-MVP-07-n1-lesson-detail-continuation-001-20260514/`
- parent evidence-sync guardrails under `.agent/stages/mvp/raw/orchestrator-MVP-07-n1-lesson-detail-continuation-001-evidence-sync-20260514/`

Fresh verifier PASS is recorded:

- `.agent/stages/mvp/verdicts/MVP-07-n1-lesson-detail-continuation-001.json`
- `.agent/stages/mvp/problems/MVP-07-n1-lesson-detail-continuation-001.md`
- `.agent/stages/mvp/raw/verifier-MVP-07-n1-lesson-detail-continuation-001-20260514-fresh/`

Full MVP-06, full MVP-07, the MVP stage and all human gates remain open. Post-PASS publish is required because `publish_after_pass=true`.
