# Problems: MVP-07-diagnostic-draft-api-001

Verdict: `FAIL`

Fresh verifier found one blocking proof/acceptance gap for this scoped sprint.

## Blocking gap

### Submit response is not handoff-only

The sprint contract requires `POST /api/v1/diagnostics/me/submit` to return only the safe handoff boundary: `routePreview=true`, `recommendedFirstLessonId=N1`, submitted state and timestamps, with no final score/level/weak zones/R1-R6/HR/points/learning completion fields.

Canonical docs now say the same in `docs/architecture/access-and-subscriptions.md:258`: submit response may expose only `routePreview=true`, `recommendedFirstLessonId=N1`, state and timestamps.

Current implementation uses the shared full attempt response for submit:

- `apps/api/src/main/java/com/finrhythm/api/diagnostic/web/DiagnosticAttemptController.java:121` returns `toResponse(diagnosticAttemptService.submit(...))`;
- `DiagnosticAttemptController.java:130-156` adds `employeeRegistrationId`, `tenantId`, `pilotLaunchId`, `accessPoolId`, `allowedAnswerIds`, `q0`, `selfAssessment` and `routingAnswers`;
- `packages/api-client/openapi/finrhythm-api.openapi.json` maps submit `200` to `DiagnosticAttemptResponse`;
- raw verifier proof `.agent/stages/mvp/raw/verifier-MVP-07-diagnostic-draft-api-001-20260513-fresh/openapi-diagnostic-surface.txt` shows that response schema includes the full draft/attempt fields.

Existing tests prove absence of final scoring/HR/points-like fields, but they do not prove the stricter submit handoff-only boundary.

## Minimal required fix

Use one of these paths, then refresh OpenAPI/generated client evidence and run a new fresh verifier:

- implement a dedicated submit response DTO/schema/client contract limited to state, `routePreview`, `recommendedFirstLessonId` and timestamps, and add focused tests proving submit does not echo Q0/SA/routing answers or scope IDs; or
- if full attempt echo on submit is intentional, revise the frozen contract/canonical docs/evidence to state that explicitly, then regenerate/check OpenAPI and client artifacts.

## Passed verifier checks

- Focused backend `DiagnosticAttemptControllerIT` passed with Java 21 and Flyway v011.
- `apps/api ./mvnw verify` passed.
- `pnpm --filter @finrhythm/api-client check:generated` passed.
- `pnpm --filter @finrhythm/api-client check:openapi-drift` passed.
- `pnpm --filter @finrhythm/api-client typecheck` passed.
- `jq empty` for stage JSON and OpenAPI JSON passed.
- `git diff --check` excluding raw artifacts passed.
- Browser evidence is not required because this sprint is backend/API-only.

## Still open

Full `MVP-07.01`, full `MVP-07.04`, full `MVP-07`, the MVP stage and all diagnostic/legal/privacy/HR/financial/design human gates remain open.
