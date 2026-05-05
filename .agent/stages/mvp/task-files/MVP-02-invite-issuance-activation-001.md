# Task: MVP-02-invite-issuance-activation-001

Status: `PASS`  
Stage: `mvp`  
Parent execution unit: `MVP-02.02`  
Role to run next: freeze next task for `MVP-02.03`

## Objective

Implement backend/domain invite code issuance, activation and one-user binding for existing tenant/cohort records, without employee registration, UI, public API or HR reporting.

## Inputs

- `AGENTS.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/stages/MVP.md`
- `apps/api/AGENTS.md`
- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/sprint_contract.md`
- current `apps/api` tenant/cohort/invite model from `MVP-02-tenant-domain-001`

## Owned repo areas

- `apps/api/src/main/java/com/finrhythm/api/tenant/domain/**`
- `apps/api/src/main/java/com/finrhythm/api/tenant/persistence/**`
- `apps/api/src/main/java/com/finrhythm/api/tenant/service/**` or nearest local equivalent
- `apps/api/src/main/resources/db/migration/V003__*.sql`
- `apps/api/src/test/java/com/finrhythm/api/tenant/**`
- stage evidence artifacts under `.agent/stages/mvp/`

## Non-goals

- No employee registration by name/email/phone/code.
- No public REST/OpenAPI/controller surface.
- No admin UI or employee UI.
- No auth/session/SSO/SCIM.
- No HR reports or event analytics.
- No raw invite-code persistence.
- No real customer/employee/personal/financial data.
- No points, money, billing, rewards or merch.

## Acceptance criteria

Use the exact criteria in `.agent/stages/mvp/sprint_contract.md`.

## Verification plan

Run and record:

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- migration and guardrail scans

## Evidence handoff

Builder implementation, evidence and fresh verifier PASS are recorded. This task and `MVP-02.02` are complete; `MVP-02.03`, `MVP-02.04` and full MVP-02 remain open.
