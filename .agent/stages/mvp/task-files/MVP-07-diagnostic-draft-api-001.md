# Task file: MVP-07-diagnostic-draft-api-001

Stage: `mvp`
Parent unit: scoped prerequisite for `MVP-07.01` + `MVP-07.04`
Status: `PASS`
Owner role: `stage_builder`
Functional passes: `true`
Publish after pass: `false`

## Implementation Slice

Build the backend/API diagnostic draft/submission foundation for the already previewed diagnostic IDs:

- `Q0` privacy metadata;
- `SA1`, `SA2`, `SA3` self-assessment, non-scoring;
- `Q1`, `Q2`, `Q3` routing draft answers.

Every operation must authenticate with the existing employee profile-session bearer token and resolve employee registration scope server-side. The API may return only a safe route handoff, `routePreview=true` and `recommendedFirstLessonId="N1"`, with no final score, level, weak zones or `R1-R6`.

## First Meaningful Touch

Start by changing backend production/test files, for example:

- `apps/api/src/main/resources/db/migration/V011__diagnostic_draft_attempt.sql`;
- `apps/api/src/main/java/com/finrhythm/api/diagnostic/**`;
- `apps/api/src/test/java/com/finrhythm/api/diagnostic/DiagnosticAttemptControllerIT.java`.

Do not write evidence, docs, generated client, stage status or verification artifacts before the backend/schema/API first touch exists.

## Required Behavior

- Add `GET /api/v1/diagnostics/me/draft`, `PUT /api/v1/diagnostics/me/draft` and `POST /api/v1/diagnostics/me/submit`, or record a justified equivalent path.
- Require `employeeProfileSessionBearerAuth` for all endpoints.
- Persist one current attempt per employee registration for this slice.
- Keep Q0/privacy metadata, self-assessment and routing answers separate.
- Support `DRAFT` and `SUBMITTED`.
- Make same-registration resume safe across a new profile-session token.
- Prevent cross-registration access.
- Reject unknown diagnostic IDs, `Q28`, full-bank payloads, final scoring fields, exact sensitive data, free-form personal finance reports and advice-like fields.
- Update Spring/OpenAPI source, OpenAPI snapshot and generated API client artifacts/notes.
- Update `docs/architecture/access-and-subscriptions.md` with the profile-session diagnostic attempt boundary and Mermaid flow/state diagram.

## Required Validation

- Focused backend diagnostic integration tests.
- `cd apps/api && ./mvnw -q verify`.
- API client generate/build/drift/typecheck commands.
- Root `make verify`, `make test-unit`, `make build`.
- Guardrail scans for scope exclusions and sensitive-data policy.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`.
- Fresh `stage_verifier` after builder evidence before any PASS claim.

## Out Of Scope

- UI integration or browser screenshots.
- Full `Q1-Q27`, `Q28`, `C1-C10`, final `R1-R6`, scoring correctness or level assignment.
- HR reports, analytics/events, points, learning completion, CMS/admin, rewards, merch, challenges or support flows.
- Exact sums, photos, documents, bank screenshots, account numbers, personal finance reports or advice.
- Login/password setup, `User`, `OrgMembership`, subscriptions, seats, entitlements, SSO/SCIM or billing.
- Full `MVP-07.01`, full `MVP-07.04`, full `MVP-07`, MVP stage or human-gate closure.

## Evidence Rule

Fresh post-fix `stage_verifier` returned `PASS` for this scoped sprint only. Full `MVP-07.01`, full `MVP-07.04`, full `MVP-07`, the MVP stage and all human gates remain open.
