# Task file: MVP-07-n1-lesson-detail-continuation-001

Stage: `mvp`
Sprint contract: `.agent/stages/mvp/sprint_contract.md`
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Functional passes: `true`
Publish after pass: `true`

## Task

Implement one backend-first, read-only N1 lesson detail/continuation slice for the mounted profile-session diagnostic/N1 flow.

Preferred endpoint: `GET /api/v1/learning/me/lessons/{lessonId}`.

The endpoint must return backend-owned N1 draft lesson detail only after:

- the authenticated profile session has a submitted diagnostic N1 handoff; and
- the existing N1 progress row is `STARTED` through the verified start/resume endpoint.

## Required First Touch

First meaningful builder touch must be in `apps/api` production/test files, for example:

- `apps/api/src/test/java/com/finrhythm/api/learning/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/service/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/web/**`;
- `apps/api/src/main/java/com/finrhythm/api/learning/domain/**`.

Do not touch `.agent`, docs, `apps/web`, generated client or OpenAPI before backend production/test work exists.

## Required Scope

- Use existing employee profile-session bearer auth.
- Resolve employee registration and pilot scope server-side.
- Accept no request body and no client-supplied scope identifiers.
- Support `N1` only.
- Return draft review status, `humanReviewRequired=true`, `productionReady=false`, provenance, safe lesson blocks and sensitive-data policy.
- Do not expose quiz answer keys, scoring, practice submit payloads, completion state, points/rewards, final route fields, HR fields, tokens, internal scope IDs or exact sensitive values.
- Do not mutate diagnostic attempts, lesson progress or content.
- Update OpenAPI and generated `@finrhythm/api-client`.
- Wire the mounted `/profile/session` web flow through generated lesson detail helper(s).
- Render backend-owned N1 detail after route-progress and N1 start/resume.
- Stop using `syntheticN1LessonFixture` as the mounted continuation payload.
- Keep profile-session token only in mounted component memory.

## Out Of Scope

No final scoring, final route assignment, `R1-R6`, full `Q1-Q27`, `Q28`, HR reports, analytics/events, lesson completion, quiz/practice submission, points, rewards, `N2+`, CMS/admin publishing, exact sensitive data, advice, customer brand, real data, `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.

## Validation

Required evidence includes focused backend lesson detail tests, `apps/api ./mvnw verify`, OpenAPI/generated-client sync checks, api-client build/typecheck, web typecheck/test/build, browser smoke with screenshots, root `make verify`, `make test-unit`, `make build`, JSON validation, diff check and guardrail scans.

Browser smoke must cover profile-session creation, legal acceptance, diagnostic submitted handoff, route/progress summary, N1 start/resume, backend lesson detail fetch and rendered N1 continuation with no token in URL/storage/cookies/logs.

## Docs

Required canonical doc target: `docs/architecture/access-and-subscriptions.md` section 7.4 with a compact Mermaid update for the read-only N1 lesson detail continuation boundary.

Product docs are `NOOP_EXPECTED` unless implementation changes N1 lesson semantics, methodology/review statuses, sensitive-data rules, route-handoff assumptions, UI copy rules or design behavior.

## Human Gates

All existing human gates remain open, including final N1 financial correctness, diagnostic wording, route-rule correctness, HR/privacy wording, legal/privacy approval, real employee/customer data processing, production content approval, reward economy, production support/admin policy and design/accessibility QA.

## Current Limitation

Implementation, builder evidence and fresh verifier PASS now exist. Full MVP-06, full MVP-07, MVP stage and human gates remain open.
