# Task file: MVP-07-n1-readonly-status-refresh-001

Stage: `mvp`
Sprint contract: `.agent/stages/mvp/sprint_contract.md`
Status: `FROZEN_AWAITING_BUILDER`
Functional passes: `false`
Publish after pass: `true`

## Task

Implement one web-first read-only N1 status refresh slice inside the mounted `/profile/session` N1 continuation screen.

When N1 is already rendered from backend-owned progress/detail, the employee can press one neutral refresh/re-check action. The action must read `GET /api/v1/learning/me/route-progress` and then `GET /api/v1/learning/me/lessons/N1` through generated api-client helpers, update the visible N1 progress/detail if the server still returns safe `RESUME_N1`, and never call `POST /api/v1/learning/me/lessons/N1/start`.

## Required First Touch

First meaningful builder touch may and should be in `apps/web` production/test files, for example:

- `apps/web/components/diagnostic-api-flow-screen.ts`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- a new focused `apps/web` test file if that matches existing patterns.

Do not touch `.agent`, docs, backend, generated client or OpenAPI before web production/test work exists.

## Required Scope

- Add one refresh/re-check action to the already-rendered N1 continuation screen.
- Use existing generated `fetchLearningMeRouteProgress`.
- Use existing generated `fetchLearningMeLessonDetail`.
- On safe `RESUME_N1` + `N1 STARTED`, update mounted `routeProgress`, read-only `lessonProgress` and `lessonDetail`.
- Do not call generated `startLearningMeLesson` or `POST /api/v1/learning/me/lessons/N1/start` from the refresh path.
- Preserve existing `START_N1` first-start behavior.
- Preserve existing read-only reopen behavior.
- On failed/unsupported refresh, show a neutral Russian notice and keep the previous N1 detail visible.
- Keep profile-session token only in mounted component memory.
- Use Russian, privacy-first, mobile-first copy.

## Out Of Scope

No schema migration, new endpoint, new DTO, new OpenAPI operation, new generated helper, final scoring, final route assignment, `R1-R6`, full `Q1-Q27`, `Q28`, HR reports, analytics/events, learning completion, theory completion, quiz/practice submission, points, rewards, `N2+`, CMS/admin publishing, exact sensitive data, advice, customer brand, real data, `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.

Do not close full `MVP-06`, full `MVP-07`, the MVP stage or any human gate.

## Validation

Required evidence includes focused web test for read-only N1 refresh and no start mutation, web typecheck/test/build, backend learning regression checks, api-client generated/openapi drift/typecheck/build checks, browser/API smoke with screenshots or structured network proof, root `make verify`, `make test-unit`, `make build`, JSON validation, diff check and guardrail scans.

Browser/API smoke must cover already-rendered N1 continuation, refresh click, route-progress `RESUME_N1`, backend lesson detail fetch, updated N1 continuation, no `POST /start`, no diagnostic submit and no token in URL/storage/cookies/logs.

## Docs

Product docs are `NOOP_EXPECTED` unless implementation changes N1 lesson semantics, methodology/review statuses, sensitive-data rules, route-handoff assumptions, UI copy rules or design behavior.

`docs/architecture/access-and-subscriptions.md` section 7.4 is a conditional target: update narrowly only if it is not already clear that mounted web can refresh N1 status from the continuation screen by reading route-progress and lesson detail without re-posting start.

`packages/api-client/README.md` is `NOOP_EXPECTED` unless helper coverage wording needs a narrow clarification.

## Human Gates

All existing human gates remain open, including final N1 financial correctness, diagnostic wording, route-rule correctness, HR/privacy wording, legal/privacy approval, real employee/customer data processing, production content approval, reward economy, production support/admin policy and design/accessibility QA.

## Current Limitation

This task is frozen only. Implementation, evidence and fresh verifier PASS do not exist yet; `passes=false` remains mandatory.
