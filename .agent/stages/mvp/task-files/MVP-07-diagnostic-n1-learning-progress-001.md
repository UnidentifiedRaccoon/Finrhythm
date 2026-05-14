# Task: MVP-07-diagnostic-n1-learning-progress-001

Stage: `mvp`
Contract: `.agent/stages/mvp/sprint_contract.md`
Status: `SCOPED_PASS`
Functional passes: `true`
Publish after pass: `true`

## Summary

Implementation slice after fresh PASS `MVP-07-diagnostic-web-api-integration-001`; builder evidence and fresh verifier PASS are recorded.

Purpose: after diagnostic submit returns `recommendedFirstLessonId="N1"`, add minimal backend-owned N1 lesson start/resume progress under employee profile-session bearer auth and wire the web continuation to it through generated `@finrhythm/api-client`, keeping the profile-session token only in mounted component memory.

This is a scoped prerequisite across the safe diagnostic handoff and N1 learning delivery. It is not full `MVP-06`, not full `MVP-07`, not full MVP, and not a human-gate closure.

## Required First Touch

The builder's first meaningful production/test edit must be in `apps/api`, preferably:

- `apps/api/src/main/resources/db/migration/V012__employee_lesson_progress.sql`;
- `apps/api/src/main/java/com/finrhythm/api/learning/**`;
- focused learning integration tests under `apps/api/src/test/java/com/finrhythm/api/learning/**` or an equivalent focused IT.

Do not start implementation by editing `.agent`, docs, `apps/web`, OpenAPI snapshot, generated client or evidence.

## In Scope

- Append-only Flyway migration for employee lesson progress.
- Backend learning service/repository/controller under existing employee profile-session bearer auth.
- Idempotent N1-only start/resume endpoint and optional read endpoint.
- Server-side scope resolution from the authenticated profile session.
- OpenAPI snapshot and generated `packages/api-client` sync after backend source changes.
- Web continuation after diagnostic submit using generated learning helper(s).
- Profile-session token stays only in mounted React component memory.
- N1 rendering/continuation reuses existing synthetic N1 fixture/renderer as display content.
- Focused backend/web/api-client tests, browser evidence, guardrail scans, root wrappers and fresh verifier.

## Out Of Scope

- Completion, theory-completed state, quiz submission/scoring, practice submission, points, rewards, wallet, challenges, store or merch.
- Final diagnostic scoring/routing, full `Q1-Q27`, `Q28`, final `R1-R6`, weak zones, HR reports or analytics/events.
- CMS/admin publishing, content states, production content approval or methodologist workflow closure.
- `N2+` backend progress.
- Exact sensitive data, photos, documents, bank screenshots, advice or real employee/customer data.
- Login/password setup, `User`, `OrgMembership`, subscriptions/seats/entitlements, SSO/SCIM, B2C billing, `pro_user` or `premium` shortcuts.
- Full `MVP-06`, full `MVP-07`, full MVP or human-gate closure.

## Acceptance Summary

- First touch proof points to `apps/api` production/test files.
- Migration is append-only and expected as `V012__employee_lesson_progress.sql` if the repository has not advanced.
- New learning endpoints require `employeeProfileSessionBearerAuth`.
- Request bodies do not accept employee/scope identifiers.
- Only `N1` is accepted.
- Start/resume is idempotent and isolated per employee registration.
- Expired/revoked/missing/malformed/unknown profile-session tokens fail safely without persistence.
- OpenAPI and generated client are synchronized.
- Web calls generated learning helper(s), not hand-written fetch/DTOs.
- Token is not persisted or transferred through URL/storage/cookies/IndexedDB/cache/logs.
- Browser evidence covers diagnostic submit -> N1 progress start/resume -> N1 continuation.
- Full MVP/human-gated items remain open.

## Doc Targets

- Required canonical doc target: `docs/architecture/access-and-subscriptions.md` with a compact Mermaid learning progress handoff/state diagram unless existing docs already cover the exact boundary.
- Product docs are `NOOP_EXPECTED` if current N1/progress/privacy/design semantics are followed.
- Stage evidence must include the diagnostic-to-N1 progress Mermaid flow.

## Latest Verified Baseline

- Previous verified PASS was `MVP-07-diagnostic-web-api-integration-001`.
- Latest verified PASS is now `MVP-07-diagnostic-n1-learning-progress-001`.
- Latest evidence/verdict/problems aliases point to this task after parent PASS sync.
