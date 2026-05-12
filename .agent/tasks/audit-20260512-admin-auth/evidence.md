# audit-20260512-admin-auth evidence

Status: PASS
Date: 2026-05-12
Scope: P0 Admin/API auth for admin code-status and admin live-mode source selection.

## What changed

- Added Spring Security to `apps/api` and protected the admin code-status GET path with a stateless bearer token mapped to `admin.code-status.read`; other `/api/v1/admin/**` paths deny by default.
- Added sanitized `401`/`403` admin auth error responses and OpenAPI `adminBearerAuth` security scheme.
- Removed query-controlled admin live mode from `apps/admin`; live mode now requires `FINRHYTHM_ADMIN_CODE_STATUS_SOURCE=live`.
- Added server-side admin token forwarding from `apps/admin` live fetch to backend.
- Updated narrow canonical docs for setup, repo layout and access boundary.

## Verification

| Command | Result |
| --- | --- |
| `cd apps/api && ./mvnw -q -DskipTests compile` | Blocked by missing Java runtime on default PATH |
| `cd apps/api && JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH ./mvnw -q -DskipTests compile` | PASS |
| `cd apps/api && JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH ./mvnw -q -Dtest=AdminCodeStatusControllerIT test` | PASS |
| `cd apps/api && JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH ./mvnw -q verify` | PASS |
| `pnpm --filter @finrhythm/admin typecheck` | PASS |
| `pnpm --filter @finrhythm/admin test` | PASS, 4 tests |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'` | PASS |

## Acceptance mapping

- AC1 admin auth boundary: PASS. Missing/invalid bearer token returns sanitized `ADMIN_AUTHENTICATION_REQUIRED`; valid configured token is required for existing code-status happy paths; unknown admin paths return sanitized `ADMIN_PERMISSION_DENIED`.
- AC2 OpenAPI security: PASS. `/v3/api-docs` includes `adminBearerAuth`, `401` and `403` admin error codes.
- AC3 live source safety: PASS. `apps/admin` no longer reads `params.mode`; live source and token are server-side env only.
- AC4 docs/evidence: PASS. Canonical docs updated and this task proof bundle created under `.agent/tasks/audit-20260512-admin-auth/`.

## Notes

- No Flyway migration was needed.
- No generated API client was edited; `packages/api-client` has no generator/artifacts in this slice.
- Root `make verify` was not run because the audit scope is apps/api/apps/admin and the worktree contains unrelated concurrent apps/web/stage changes.
