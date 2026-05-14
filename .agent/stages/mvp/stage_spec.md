# MVP-07 N1 read-only resume continuation stage spec

Stage: `mvp`
Active slice: `MVP-07-n1-readonly-resume-continuation-001`
Parent scope: scoped continuation across `MVP-06.04` N1 progress visibility and `MVP-07.04` safe resume/retry
Role: `stage_spec_freezer`
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Functional passes: `true`
Date: 2026-05-14

## Latest Verified Baseline

Latest fresh verifier `PASS`: `MVP-07-n1-lesson-detail-continuation-001`.

That slice proved:

- backend-owned read-only `GET /api/v1/learning/me/lessons/{lessonId}` for N1 draft lesson detail;
- submitted diagnostic N1 handoff and existing `N1 STARTED` progress are required before detail is returned;
- mounted `/profile/session` diagnostic -> route-progress -> N1 start/resume -> backend lesson detail continuation;
- generated `@finrhythm/api-client` use for route-progress, N1 start/resume and lesson detail;
- profile-session token kept only in mounted component memory;
- backend baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

Full `MVP-06`, full `MVP-07`, the MVP stage and all human gates remain open.

## Frozen Goal

Build the next smallest product slice: make the existing backend-owned N1 continuation truly resumable from server state without adding a schema, endpoint or new backend contract.

When the mounted `/profile/session` flow reloads after diagnostic state is already `SUBMITTED` and `GET /api/v1/learning/me/route-progress` returns `N1 STARTED` / `RESUME_N1`, the web flow must fetch existing `GET /api/v1/learning/me/lessons/N1` through generated `fetchLearningMeLessonDetail` and render the backend-owned N1 continuation without calling `POST /api/v1/learning/me/lessons/N1/start` again.

This is a web-first/product integration slice. It improves safe resume/retry and learning delivery by using already persisted N1 progress and read-only lesson detail. It is not final scoring, final route assignment, `R1-R6`, HR reporting, analytics/events, points, rewards, completion, financial advice or customer branding.

## Scope Boundary

In scope:

- mounted `/profile/session` resume path after profile-session creation and legal acceptance;
- existing diagnostic draft read confirms `SUBMITTED`;
- existing route-progress read confirms safe N1 handoff and `n1.status=STARTED` / `nextAction=RESUME_N1`;
- web fetches existing N1 lesson detail via generated `fetchLearningMeLessonDetail`;
- web renders the existing backend-owned N1 continuation from that detail without calling `startLearningMeLesson` on the reopen/resume path;
- browser/API smoke or test proves the resume render uses only read endpoints: `GET /api/v1/learning/me/route-progress` and `GET /api/v1/learning/me/lessons/N1`, with no `POST /api/v1/learning/me/lessons/N1/start`;
- profile-session token remains only in mounted component memory;
- Russian, neutral, privacy-first resume copy.

Out of scope:

- schema migrations, new endpoints, new backend DTOs, new OpenAPI operations or new generated helpers;
- final diagnostic scoring, final route assignment, `R1-R6`, weak zones and final level;
- HR reports, analytics/events or customer brand;
- learning completion, theory completion, `completed`, `mastered`, `needs_reinforcement`, unlocking `N2+`;
- quiz/practice submission, answer keys, score, points, rewards, wallet, challenge, store or merch;
- exact income, debt, balance, account numbers, photos, documents, bank screenshots, exact-sum requirements or personal finance reports;
- personal financial, investment, tax, credit, debt or legal advice;
- `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, SSO/SCIM or billing;
- full `MVP-06`, full `MVP-07`, MVP stage or human-gate closure.

## Builder Constraints

- First meaningful builder touch may and should be in `apps/web` production/test files.
- No backend production contract change is expected.
- Backend baseline remains mandatory for regression validation: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Existing start/resume behavior for first N1 open must be preserved.
- The resume path must be explicitly separated from first-start path so that `RESUME_N1` state does not trigger `POST /start`.
- `passes=false` remains mandatory until builder evidence and a fresh verifier `PASS`.

## Doc Targets And Diagram Expectations

- Canonical doc target: likely `NOOP` for product docs.
- `docs/architecture/access-and-subscriptions.md` section 7.4 is a conditional target: update narrowly only if existing wording does not clearly state that web may resume N1 by reading route-progress and lesson detail without re-posting start/resume.
- API/generated-client docs target: `NOOP_EXPECTED`; update `packages/api-client/README.md` only if helper coverage documentation must be clarified without changing generated surface.
- Diagram expectation: `NOOP_EXPECTED` if section 7.4 already covers route-progress -> lesson detail read; otherwise add a compact note/diagram edge for read-only resume detail path.

## Human Gates

Remain open:

- final N1 financial correctness and wording review;
- final Q0/SA/Q diagnostic wording review;
- scoring correctness and route-rule correctness;
- HR/privacy wording and reporting-boundary approval;
- legal/privacy and real employee/customer data processing approval;
- production content approval and methodologist publish approval;
- points/reward economy and real fulfillment decisions;
- admin/support production access policy for sensitive diagnostic/learning data;
- design/accessibility QA on real mobile screens.

## Evidence Rule

Scoped functional `PASS` for `MVP-07-n1-readonly-resume-continuation-001` is now recorded after builder evidence, browser/API resume-path proof, backend/web regression checks, doc-sync evidence and a fresh verifier `PASS`.

Proof refs:

- `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.md`
- `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.json`
- `.agent/stages/mvp/verdicts/MVP-07-n1-readonly-resume-continuation-001.json`
- `.agent/stages/mvp/problems/MVP-07-n1-readonly-resume-continuation-001.md`

Full `MVP-06`, full `MVP-07`, the MVP stage and human gates remain open.
