# MVP-07 N1 route/progress summary stage spec

Stage: `mvp`
Active slice: `MVP-07-n1-route-progress-summary-001`
Parent scope: scoped prerequisite across `MVP-07.04` safe resume/retry and `MVP-06.04` N1 progress visibility
Role: `stage_spec_freezer`
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Functional passes: `true`
Date: 2026-05-14

## Latest Verified Baseline

Previous latest fresh verifier `PASS`: `MVP-07-diagnostic-n1-learning-progress-001`.

Current scoped fresh verifier `PASS`: `MVP-07-n1-route-progress-summary-001`.

That slice proved:

- backend-owned `N1` start/resume progress under employee profile-session bearer auth;
- append-only Flyway `V012__employee_lesson_progress.sql`;
- `POST /api/v1/learning/me/lessons/{lessonId}/start`;
- OpenAPI/generated `@finrhythm/api-client` sync;
- mounted `/profile/session` diagnostic handoff to synthetic `N1`;
- profile-session token kept only in mounted component memory.

Full `MVP-06`, full `MVP-07`, the MVP stage and all human gates remain open.

## Frozen Goal

Build the next smallest product slice: a read-only backend-owned route/progress summary for the same mounted profile-session flow.

The summary should let a profile-session authenticated employee see whether the diagnostic handoff is ready and whether `N1` is `NOT_STARTED` or `STARTED`, without starting progress as a side effect and without introducing final scoring, final route assignment, completion, points, rewards, HR reporting or analytics/events.

Preferred API shape: `GET /api/v1/learning/me/route-progress`.

## Scope Boundary

In scope:

- read-only backend API under `employeeProfileSessionBearerAuth`;
- server-side resolution of `employee_registration_id`, `tenant_id`, `pilot_launch_id` and `access_pool_id`;
- safe aggregation from existing diagnostic attempt and `employee_lesson_progress` state;
- generated OpenAPI/api-client helper for the web;
- compact web route/progress panel in the mounted `/profile/session` diagnostic/N1 flow;
- browser evidence proving no profile-session token appears in URL/storage/cookies/logs.

Out of scope:

- final diagnostic scoring, final route profile, `R1-R6`, weak zones and final level;
- full `Q1-Q27`, `Q28`, HR reports, analytics/events;
- learning completion, theory completion, quiz/practice submission, points, rewards, wallet, challenges, store or merch;
- `N2+` backend progress;
- CMS/admin publishing, production content approval or methodologist workflow closure;
- exact sensitive personal finance data, real employee/customer data, personal advice;
- `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.

## Builder Constraints

- First meaningful builder touch must be `apps/api` production or test files.
- Backend baseline is mandatory: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- No migration is expected unless the builder proves an existing-table read model cannot satisfy the contract; any migration must be append-only and likely `V013`.
- Controllers stay thin; read composition belongs in service/repository layers.
- The read endpoint must not mutate or create progress.
- The response must not expose raw tokens, token hashes, invite codes, lookup hashes, employee/scope IDs, diagnostic answers, scoring details, route IDs, HR insight fields, request/response body echoes or exact sensitive values.

## Doc Targets And Diagram Expectations

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md`, section 7.4, because the profile-session learning boundary expands from start/resume mutation to a read-only route/progress summary.
- Product docs target: `NOOP_EXPECTED` if existing N1, privacy, sensitive-data, route-preview and mobile design assumptions are followed.
- API/generated-client notes target: update `packages/api-client/README.md` or equivalent only if the generator surface changes or the repo pattern requires it.
- Stage evidence Mermaid expectation: compact flow from profile-session diagnostic submitted state to route-progress summary, optional N1 start/resume and refreshed summary.

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

Scoped functional `PASS` exists for `MVP-07-n1-route-progress-summary-001` after builder evidence, a Russian-copy fixer, and a fresh verifier rerun.

Latest evidence/verdict/problems aliases now point to `MVP-07-n1-route-progress-summary-001`. This does not close full `MVP-06`, full `MVP-07`, the MVP stage or any human gate.
