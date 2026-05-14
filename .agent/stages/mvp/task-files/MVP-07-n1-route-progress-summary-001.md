# Task file: MVP-07-n1-route-progress-summary-001

Stage: `mvp`
Sprint contract: `.agent/stages/mvp/sprint_contract.md`
Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Functional passes: `true`
Publish after pass: `true`

## Task

Implement one backend-first, read-only route/progress summary for the mounted profile-session diagnostic/N1 flow.

Preferred endpoint: `GET /api/v1/learning/me/route-progress`.

The endpoint must summarize only safe state for the authenticated employee:

- diagnostic state: `NOT_STARTED`, `DRAFT` or `SUBMITTED`;
- `routePreview=true` and `recommendedFirstLessonId=N1` only after submitted diagnostic handoff;
- `N1` progress status: `NOT_STARTED` or `STARTED`;
- `startedAt` and `lastOpenedAt` only when progress exists;
- safe next action: `COMPLETE_DIAGNOSTIC`, `START_N1` or `RESUME_N1`.

## Required First Touch

First meaningful builder touch must be in `apps/api` production/test files, for example:

- `apps/api/src/main/java/com/finrhythm/api/learning/**`;
- `apps/api/src/test/java/com/finrhythm/api/learning/**`.

Do not touch `.agent`, docs, `apps/web`, generated client or OpenAPI before backend production/test work exists.

## Required Scope

- Use existing employee profile-session bearer auth.
- Resolve employee registration and pilot scope server-side.
- Accept no request body and no client-supplied employee/scope identifiers.
- Do not mutate or create diagnostic/progress records.
- Update OpenAPI and generated `@finrhythm/api-client`.
- Wire the mounted `/profile/session` web flow through the generated helper.
- Render a compact Russian route/progress panel before and after `N1` start/resume.
- Keep profile-session token only in mounted component memory.

## Out Of Scope

No final scoring, final route assignment, `R1-R6`, full `Q1-Q27`, `Q28`, HR reports, analytics/events, lesson completion, quiz/practice submission, points, rewards, `N2+`, CMS/admin publishing, exact sensitive data, advice, customer brand, real data, `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.

## Validation

Required evidence includes focused backend route/progress tests, `apps/api ./mvnw verify`, OpenAPI/generated-client sync checks, api-client build/typecheck, web typecheck/test/build, browser smoke with screenshots, root `make verify`, `make test-unit`, `make build`, JSON validation, diff check and guardrail scans.

## Docs

Required canonical doc target: `docs/architecture/access-and-subscriptions.md` section 7.4 with a compact Mermaid update for the read-only route/progress summary.

Product docs are `NOOP_EXPECTED` unless implementation changes methodology, N1 semantics, route-handoff assumptions, sensitive-data policy, UI copy rules or design behavior.

## Human Gates

All existing human gates remain open, including final financial correctness, diagnostic wording, route-rule correctness, HR/privacy wording, legal/privacy approval, real employee/customer data processing, production content approval, reward economy, production support/admin policy and design/accessibility QA.

## Result

Scoped fresh verifier rerun returned `PASS` after the Russian-copy fixer. Evidence/verdict/problems aliases now point to `MVP-07-n1-route-progress-summary-001`. Full MVP-06, full MVP-07, MVP stage and all human gates remain open.
