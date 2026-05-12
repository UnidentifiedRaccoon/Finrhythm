# Evidence: MVP-03-employee-profile-session-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `SCOPED_PASS`
Updated: 2026-05-12

## Scope Built

- Added backend/API-only employee profile sessions after raw invite code plus normalized `fullName`/`email`/`phone` proof.
- Added append-only Flyway `V009__employee_profile_session.sql` with `employee_profile_sessions`, storing `token_hash`, expiry and revocation metadata only.
- Added `POST /api/v1/employee-registrations/profile-sessions`; success returns opaque high-entropy non-JWT `profileSessionToken` once and persists only SHA-256 token hash.
- Added `GET /api/v1/employee-registrations/me/profile-summary`; it requires `Authorization: Bearer <profile-session-token>` and returns only the existing support-safe profile summary fields.
- New successful session creation revokes previous active profile sessions for the same employee registration.
- Read-only `me/profile-summary` does not consume the session; expired, revoked, unknown, missing and malformed tokens fail with safe `401`.
- Updated OpenAPI snapshot, generated `packages/api-client` contracts/dist and generator/drift checks.
- Updated `docs/architecture/access-and-subscriptions.md` with the MVP employee profile-session boundary and Mermaid flow.

## Out Of Scope Preserved

- No contact update or contact mutation.
- No employee UI or `apps/web` mutation.
- No login/password setup, account recovery, SSO/SCIM or full auth framework.
- No `User`, `OrgMembership`, subscriptions, seats, entitlements, `pro_user` or `premium`.
- No support ticket workflow, HR reporting, diagnostics, points, CMS, rewards, merch, real data, full `MVP-03`, MVP stage or human-gate closure.

## Commands

| Command | CWD | Status | Raw ref |
|---|---|---:|---|
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="$JAVA_HOME/bin:$PATH" java -version` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-java-version-20260512.txt` |
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="$JAVA_HOME/bin:$PATH" ./mvnw -q -Dtest=EmployeeRegistrationControllerIT test` | `apps/api` | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-api-registration-it-20260512.txt` |
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="$JAVA_HOME/bin:$PATH" ./mvnw -q verify` | `apps/api` | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-api-mvn-verify-20260512.txt` |
| `pnpm --filter @finrhythm/api-client build` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-api-client-build-20260512.txt` |
| `pnpm --filter @finrhythm/api-client check:generated` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-api-client-check-generated-20260512.txt` |
| `pnpm --filter @finrhythm/api-client check:openapi-drift` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-api-client-check-openapi-drift-20260512.txt` |
| `pnpm --filter @finrhythm/api-client typecheck` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-api-client-typecheck-20260512.txt` |
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="$JAVA_HOME/bin:$PATH" make verify` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-make-verify-20260512.txt` |
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="$JAVA_HOME/bin:$PATH" make test-unit` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-make-test-unit-20260512.txt` |
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="$JAVA_HOME/bin:$PATH" make build` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-make-build-20260512.txt` |
| storage guardrail scan | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-storage-guardrail-scan-20260512.txt` |
| shortcut guardrail scan | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-shortcut-guardrail-scan-20260512.txt` |
| real-data / echo guardrail scan | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-real-data-guardrail-scan-20260512.txt` |
| JSON validation | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-json-validation-20260512.txt` |
| `git diff --check -- . ':(exclude).agent/stages/mvp/raw/**'` | repo root | 0 | `.agent/stages/mvp/raw/orchestrator-mvp-03-employee-profile-session-001-git-diff-check-20260512.txt` |

## Acceptance Mapping

- Session creation requires invite+contact proof: covered by `EmployeeRegistrationService#createProfileSession` and `EmployeeRegistrationControllerIT`.
- Opaque token returned once and hash-only persistence: covered by `EmployeeProfileSessionTokenService`, `V009`, storage scan and tests.
- Expiry/revocation policy: covered by `newProfileSessionRevokesPreviousSessionForSameRegistration` and `meProfileSummaryRejectsMissingMalformedUnknownExpiredAndRevokedSessionTokensSafely`.
- Read-only authenticated `me/profile-summary`: covered by `createsProfileSessionAndReadsMeSummaryWithoutPersistingRawToken`.
- Safe errors/no sensitive echo: covered by mismatch, validation and token rejection tests plus guardrail scans.
- OpenAPI/generated client: covered by api-client build/generated/drift/typecheck.
- Docs sync: `docs/architecture/access-and-subscriptions.md` updated.

## Fresh Verifier

Fresh verifier verdict: `PASS`

- Verdict: `.agent/stages/mvp/verdicts/MVP-03-employee-profile-session-001.json`
- Problems summary: `.agent/stages/mvp/problems/MVP-03-employee-profile-session-001.md`
- Raw verification logs: `.agent/stages/mvp/raw/verifier-MVP-03-employee-profile-session-001-20260512/`

Full `MVP-03`, contact update, MVP stage and all human gates remain open.
