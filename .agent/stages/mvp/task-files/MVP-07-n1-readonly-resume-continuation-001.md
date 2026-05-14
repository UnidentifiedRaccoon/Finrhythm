# Task file: MVP-07-n1-readonly-resume-continuation-001

Stage: `mvp`
Sprint contract: `.agent/stages/mvp/sprint_contract.md`
Status: `FROZEN_AWAITING_BUILDER`
Functional passes: `false`
Publish after pass: `true`

## Task

Implement one web-first read-only N1 resume continuation slice for the mounted profile-session diagnostic/N1 flow.

When `/profile/session` reloads after diagnostic is already `SUBMITTED` and `GET /api/v1/learning/me/route-progress` returns `N1 STARTED` / `RESUME_N1`, the mounted flow must fetch existing `GET /api/v1/learning/me/lessons/N1` through generated `fetchLearningMeLessonDetail` and render backend-owned N1 continuation without calling `POST /api/v1/learning/me/lessons/N1/start` again.

## Required First Touch

First meaningful builder touch may and should be in `apps/web` production/test files, for example:

- `apps/web/components/diagnostic-api-flow-screen.ts`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- a new focused `apps/web` test file if that matches existing patterns.

Do not touch `.agent`, docs, backend, generated client or OpenAPI before web production/test work exists.

## Required Scope

- Use existing generated `fetchLearningMeRouteProgress`.
- Use existing generated `fetchLearningMeLessonDetail`.
- Preserve existing first-start behavior where `START_N1` may call generated `startLearningMeLesson`.
- On `RESUME_N1`, render backend-owned N1 detail through read endpoints only.
- Prove `RESUME_N1` path does not call generated `startLearningMeLesson` or `POST /api/v1/learning/me/lessons/N1/start`.
- Keep profile-session token only in mounted component memory.
- Use Russian privacy-first copy for resume state.

## Out Of Scope

No schema migration, new endpoint, new OpenAPI operation, new generated helper, final scoring, final route assignment, `R1-R6`, full `Q1-Q27`, `Q28`, HR reports, analytics/events, learning completion, theory completion, quiz/practice submission, points, rewards, `N2+`, CMS/admin publishing, exact sensitive data, advice, customer brand, real data, `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.

Do not close full `MVP-06`, full `MVP-07`, the MVP stage or any human gate.

## Validation

Required evidence includes focused web test for read-only resume and no start mutation, web typecheck/test/build, backend learning regression checks, api-client generated/openapi drift/typecheck/build checks, browser/API smoke with screenshots or structured network proof, root `make verify`, `make test-unit`, `make build`, JSON validation, diff check and guardrail scans.

Browser/API smoke must cover profile-session creation, legal acceptance, already-submitted diagnostic state, route/progress `RESUME_N1`, backend lesson detail fetch and rendered N1 continuation with no `POST /start` on the reopen path and no token in URL/storage/cookies/logs.

## Docs

Product docs are `NOOP_EXPECTED` unless implementation changes N1 lesson semantics, methodology/review statuses, sensitive-data rules, route-handoff assumptions, UI copy rules or design behavior.

`docs/architecture/access-and-subscriptions.md` section 7.4 is a conditional target: update narrowly only if it is not already clear that web can resume N1 by reading route-progress and lesson detail without re-posting start.

`packages/api-client/README.md` is `NOOP_EXPECTED` unless helper coverage wording needs a narrow clarification.

## Human Gates

All existing human gates remain open, including final N1 financial correctness, diagnostic wording, route-rule correctness, HR/privacy wording, legal/privacy approval, real employee/customer data processing, production content approval, reward economy, production support/admin policy and design/accessibility QA.

## Current Limitation

This task is frozen only. Implementation, evidence and fresh verifier PASS do not exist yet; `passes=false` remains mandatory.
