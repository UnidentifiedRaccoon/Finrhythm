# Task file: MVP-03-admin-sensitive-access-audit-001

Stage: `mvp`
Parent unit: `MVP-03.05`
Status: `FROZEN`
Owner role: stage_spec_freezer
Created: 2026-05-12

## Objective

Implement one narrow backend-only audit foundation for the existing protected admin code-status access path.

The slice logs current sensitive admin access attempts; it does not introduce full admin RBAC, persisted admin users, profile/contact basics or any admin audit viewer UI.

## Current State Preserved

- Latest verified sprint remains `MVP-03-consent-version-logging-001` with scoped fresh verifier `PASS`.
- Backend baseline is Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- Existing admin API is protected by a deploy-configured bearer token and permission `admin.code-status.read`.
- Existing allowed admin path is `GET /api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status`.
- Other `/api/v1/admin/**` paths are denied by default.
- Full `MVP-03`, MVP stage and all human gates remain open.

## In Scope

- Append-only Flyway migration for admin access audit log.
- Backend audit service/filter/interceptor/repository as needed.
- Audit logging for successful code-status reads.
- Audit logging for missing-token and invalid-token attempts on covered admin routes.
- Audit logging for default-denied admin paths under the current `/api/v1/admin/**` boundary.
- Safe technical audit fields only: timestamp, method, action, permission, route template or normalized path, safe UUID scope when parsed, status code, outcome and non-secret principal ref.
- Focused backend tests for migration shape, success/401/403 audit rows, preservation of existing admin API behavior and guardrails.
- Docs-sync decision and Mermaid audit-flow evidence.

## Out Of Scope

- `MVP-03.04` profile/contact update or support-ready identity UI.
- Employee-facing `apps/web` changes.
- Admin UI audit viewer, export, search, support console or retention/delete policy.
- Persisted admin users, sessions, full RBAC, `User`, `OrgMembership`, SSO/SCIM, subscriptions or seats.
- New admin mutations, HR reporting, analytics taxonomy, support tickets, content/CMS publishing, diagnostics, rewards or merch.
- Expanding code-status API response fields or exposing employee contact details.
- Final production admin auth/role/audit policy approval.
- Closing full `MVP-03`, MVP stage or human gates.

## Acceptance

- Migration is append-only and creates the admin access audit log without editing prior migrations.
- Covered admin access attempts create one safe audit row each.
- Successful code-status read logs action, permission, UUID scope, status `200`, outcome `SUCCESS` and non-secret admin token principal ref.
- Missing/invalid token attempts log safe unauthenticated outcomes without token material.
- Default-denied admin paths log safe denied outcomes without request/response bodies.
- Existing code-status auth and privacy-safe response behavior remain unchanged.
- Audit rows do not store raw bearer token, raw invite code, activation subject ref, employee contact PII, request body, response body, legal text body or full query string.
- No `User`, `OrgMembership`, subscription, seat, `pro_user`, `premium` or role shortcut is introduced.
- OpenAPI/generated-client no-op is recorded unless a real API contract change is introduced.
- Human gates for production admin policy, real data and customer-specific reporting stay open.
- Fresh verifier PASS is required before implementation is marked passing.

## Required Validation

- `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json .agent/stages/mvp/evidence.json .agent/stages/mvp/verdict.json`
- `git diff --check -- <changed files>`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`, `make test-unit`, `make build` when Java runtime proof exists.
- Guardrail scans for raw tokens, raw invite codes, activation subject refs, employee contact PII, request/response body persistence, real data and access-model shortcuts.
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- Java 21 runtime proof or explicit blocker before any Maven/root Java-backed PASS claim.

## Docs And Diagram Handoff

- Expected canonical doc target if behavior is recorded outside evidence: `docs/architecture/access-and-subscriptions.md`, current MVP admin API boundary.
- Optional repo-layout target if a durable admin audit module/baseline is added: `docs/architecture/repo-layout.md`.
- Expected no change: `docs/stages/MVP.md`, product foundation and `packages/api-client`, unless implementation introduces concrete drift.
- Builder evidence must include a compact Mermaid flow for admin request, bearer/security decision, controller or denial, audit service and append-only audit log.

## Handoff Notes

Do not read `.agent/stages/**/raw/**` by default. Builder/verifier may create new raw evidence later, but tracked evidence must summarize commands, outcomes, docs-sync and human gates.
