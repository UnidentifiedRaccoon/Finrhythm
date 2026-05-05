# Sprint contract: MVP-02-invite-issuance-activation-001

Status: `PASS`  
Owner: `stage_builder` implementation/evidence with fresh `stage_verifier` PASS  
Created: 2026-05-04  
Stage: `mvp`  
Parent stage unit: `MVP-02.02`

## Builder handoff update

Builder implementation and evidence are recorded for this sprint. Required backend/root commands pass, migration and guardrail scans are recorded, evidence maps all criteria, and fresh verifier artifacts record `PASS` for this sprint only. Do not treat this as `MVP-02.03`, `MVP-02.04` or full MVP-02 completion.

## Objective

Implement the next narrow backend/domain slice for MVP-02: invite code issuance, activation and one-user binding core for an existing corporate tenant/cohort.

This contract completes neither full MVP-02 nor employee registration. It prepares the tested issuance/activation service that later `MVP-02.03` registration and `MVP-02.04` admin surfaces can call.

## Required first action

Before production edits, run and record:

1. `git status --short`
2. `java -version`
3. `cd apps/api && ./mvnw -v`
4. `make verify`

If the baseline is broken, stop before implementation, record the blocker in `.agent/stages/mvp/problems.md`/`status.json` and do not start the new slice.

## Files and modules in scope for the builder

- `apps/api/AGENTS.md` for local backend rules.
- `apps/api/src/main/java/com/finrhythm/api/tenant/domain/**` for invite issuance/activation domain behavior.
- `apps/api/src/main/java/com/finrhythm/api/tenant/persistence/**` for repository queries/locking needed by the workflow.
- `apps/api/src/main/java/com/finrhythm/api/tenant/service/**` or nearest local equivalent for service/application logic.
- `apps/api/src/main/resources/db/migration/V003__*.sql` or later append-only MVP-02 migration(s).
- `apps/api/src/test/java/com/finrhythm/api/tenant/**` for focused unit and PostgreSQL/Testcontainers tests.
- `apps/api/pom.xml` only if a test/runtime dependency is narrowly required and documented.
- Root docs only if setup/runtime/API/developer workflow changes; otherwise do not edit canonical docs.
- `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/evidence.json`, `.agent/stages/mvp/raw/**`, `.agent/stages/mvp/progress.md`, `.agent/stages/mvp/status.json`, `.agent/stages/mvp/feature_list.json`, `.agent/stages/mvp/decisions.md`, `.agent/stages/mvp/risks.md` for builder evidence and handoff.

## In scope

- Generate human-enterable invite codes using cryptographically strong randomness.
- Normalize submitted/generated codes for lookup.
- Persist only `lookup_hash` and non-sensitive operational metadata; do not persist raw/plain invite codes.
- Issue a requested batch for an existing tenant/cohort, including a tested Wave 1 count of 500.
- Add append-only schema support for issuance batches, idempotency keys and/or activation binding if needed.
- Activate an issued code exactly once.
- Bind activation to one opaque non-PII subject identifier.
- Make same-subject activation retry idempotent.
- Reject invalid, expired, revoked, unissued and already-claimed-by-another-subject paths.
- Prove double activation is blocked through concurrency or DB-constraint tests.
- Keep all examples synthetic and neutral.
- Record docs-sync reasoning and all command evidence.

## Out of scope

- Employee registration by name, email, phone and code.
- Employee account/profile/contact data model beyond an opaque activation subject reference.
- Public REST controllers, OpenAPI contract, generated TypeScript client, admin UI or employee UI.
- Auth/session, corporate SSO, SCIM or role-based admin permissions.
- HR reports, activation funnel UI or analytics/event pipeline.
- Legal/privacy/consent wording.
- Real production/customer invite code generation.
- Storing raw/plain invite codes in DB, fixtures, logs or stage artifacts.
- Points, wallet, money, billing, subscription, rewards or merch.
- Customer brand in employee-facing UI.
- Any real customer, employee, personal or financial data.

## Exact acceptance criteria

1. Baseline commands are recorded before production edits: `git status --short`, `java -version`, `cd apps/api && ./mvnw -v`, `make verify`.
2. Implementation stays inside the owned areas above.
3. Flyway migrations are append-only after `V002`; earlier migrations are unchanged.
4. Issuance creates a requested batch for an existing tenant/cohort and proves support for 500 Wave 1 codes.
5. Generated codes are random, human-enterable, normalized and returned only as one-time output.
6. Raw/plain invite codes are not persisted in database columns, fixtures, logs or evidence.
7. Lookup uses unique non-raw hashes.
8. Activation by submitted code works for issued, non-expired, non-revoked codes.
9. Invalid, expired, revoked, unissued and duplicate/different-subject activation paths are tested.
10. One-user binding uses an opaque non-PII subject identifier.
11. Same-subject activation retry is idempotent.
12. Different-subject reactivation of an activated code is rejected.
13. Race/concurrency or database constraints prove one code cannot be activated twice.
14. PostgreSQL/Testcontainers or a faithful documented substitute verifies persistence-critical behavior.
15. No employee registration/contact fields, public API/controller/OpenAPI/client, admin UI or HR report is added.
16. No real customer, employee, personal or financial data is introduced.
17. No points, money, billing, subscription, rewards or merch concepts are introduced.
18. Required commands pass: `cd apps/api && ./mvnw -q test`, `cd apps/api && ./mvnw -q verify`, `make verify`, `make test-unit`, `make build`; otherwise exact blockers are recorded.
19. Documentation sync is explicit and narrow.
20. Evidence maps every criterion and raw command output.
21. Fresh `stage_verifier` returns PASS for `MVP-02-invite-issuance-activation-001` before this sprint or `MVP-02.02` is marked complete.

## Build and test plan

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- SQL/Flyway inspection for migration order, activation binding constraints and absence of raw invite-code columns.
- Guardrail scan for out-of-scope controller/API/client/UI/contact/points/money/reward terms.

## Evidence requirements

- Store raw command outputs in `.agent/stages/mvp/raw/`.
- Include changed file list and migration notes.
- Include test names proving issuance, 500-code support, activation, idempotency and double-activation prevention.
- Include raw-persistence guardrail proof.
- Record OpenAPI/generated-client note: expected `not applicable` unless scope is re-frozen.
- Record screenshot note: expected `not applicable` because this slice has no UI.
- Record human-gate note: none closed.
- Run one fresh `stage_verifier` after builder evidence.

## Docs targets

- Stage artifacts: required.
- Canonical docs: update only if setup/runtime/API/workflow behavior changes.
- Mermaid diagrams: not required for this service-level slice unless builder introduces a non-trivial state machine beyond the existing invite lifecycle.

## Human gates

No legal, financial correctness, reward economy, customer-specific reporting, real fulfillment, pricing, public brand or real-data human gate is closed by this contract.

## Handoff

This contract is frozen. Do not start `MVP-02.03` or `MVP-02.04` until this sprint has builder evidence and a fresh verifier verdict.
