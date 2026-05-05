# MVP stage evidence

Updated: 2026-05-04

## Current sprint: MVP-02-invite-issuance-activation-001

Status: `BUILDER_EVIDENCE_READY_FOR_FRESH_VERIFIER`

The builder implementation for `MVP-02.02` is complete enough for fresh verification. It adds backend/domain invite issuance, activation and opaque one-user binding for existing tenant/cohort records. It does not mark the sprint complete: a fresh `stage_verifier` must still review evidence and write the final verdict.

### Builder command evidence

| Command/artifact | Result | Raw output |
|------------------|--------|------------|
| precheck `git status --short` | INFO: dirty worktree from prior stage work | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-git-status-precheck-20260504.txt` |
| precheck `java -version` | PASS: Temurin 21.0.11 | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-java-version-precheck-20260504.txt` |
| precheck `cd apps/api && ./mvnw -v` | PASS: Maven 3.9.9 with Java 21.0.11 | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-mvnw-version-precheck-20260504.txt` |
| precheck `make verify` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-make-verify-precheck-20260504.txt` |
| first `cd apps/api && ./mvnw -q test` | FAIL_RESOLVED: compile helper mismatch after interrupted partial implementation | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-api-mvn-test-20260504.txt` |
| `cd apps/api && ./mvnw -q test` after compile fix | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-api-mvn-test-after-test-fix-20260504.txt` |
| `cd apps/api && ./mvnw -q verify` | PASS with PostgreSQL/Testcontainers and Flyway `V001` + `V002` + `V003` | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-api-mvn-verify-20260504.txt` |
| `make verify` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-make-verify-20260504.txt` |
| `make test-unit` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-make-test-unit-20260504.txt` |
| `make build` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-make-build-20260504.txt` |
| migration inspection | PASS: append-only `V003` adds activation subject binding and lifecycle constraint update | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-migration-inspection-20260504.txt` |
| guardrail scan | PASS with expected test-only raw-code absence assertions | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-guardrail-scan-20260504.txt` |
| changed file list | RECORDED | `.agent/stages/mvp/raw/stage-builder-mvp-02-invite-issuance-activation-001-changed-files-20260504.txt` |

### Implementation notes

- Added `ActivationSubjectRef` as an opaque SHA-256 hex subject reference for one-user binding without name/email/phone.
- Extended `InviteCode` with `activationSubjectRef` lifecycle validation and activation ownership checks.
- Added `InviteCodeGenerator` for human-enterable random codes and `InviteCodeAccessService` for issuance and activation.
- Added `V003__invite_issuance_activation_binding.sql` as an append-only migration after `V002`.
- Added focused tests:
  - `InviteCodeGeneratorTest` for code format and normalization/hash equivalence;
  - `InviteCodeAccessServiceIT` for 500-code issuance, absence of raw-code persistence, activation, idempotent retry, invalid/expired/revoked/unissued paths, different-subject rejection and concurrent double-activation prevention.

### Acceptance mapping

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 1. Baseline commands recorded before production edits | PASS | Precheck raw outputs above |
| 2. Implementation stays inside owned areas | PASS | Changed-file raw output and `apps/api/tenant/**` paths |
| 3. Flyway migrations append-only after `V002` | PASS | `V003__invite_issuance_activation_binding.sql`; migration inspection |
| 4. Issuance creates requested batch and proves 500 Wave 1 codes | PASS | `InviteCodeAccessServiceIT.issuesFiveHundredWaveOneCodesWithoutRawPersistence` under `./mvnw -q verify` |
| 5. Codes are random, human-enterable, normalized and returned only as one-time output | PASS | `InviteCodeGeneratorTest`; service returns `IssuedInviteCode` raw code only from issuance result |
| 6. Raw/plain invite codes are not persisted | PASS | DB column checks in `InviteCodeAccessServiceIT`; guardrail scan only finds absence assertions |
| 7. Lookup uses unique non-raw hashes | PASS | Existing `lookup_hash` unique constraint plus issuance hash collision checks |
| 8. Activation works for issued, non-expired, non-revoked code | PASS | `InviteCodeAccessServiceIT.activatesIssuedCodeAndBindsOpaqueSubject` |
| 9. Invalid, expired, revoked, unissued and duplicate/different-subject paths tested | PASS | `InviteCodeAccessServiceIT` activation failure tests |
| 10. One-user binding uses opaque non-PII subject identifier | PASS | `ActivationSubjectRef` and V003 format constraint |
| 11. Same-subject activation retry is idempotent | PASS | `InviteCodeAccessServiceIT.sameSubjectActivationRetryIsIdempotent` |
| 12. Different-subject reactivation is rejected | PASS | `InviteCodeAccessServiceIT.differentSubjectReactivationIsRejected` |
| 13. Double activation is blocked | PASS | `InviteCodeAccessServiceIT.concurrentDifferentSubjectActivationAllowsOnlyOneBinding` |
| 14. Persistence-critical behavior verified against PostgreSQL/Testcontainers | PASS | `cd apps/api && ./mvnw -q verify` raw output |
| 15. No registration/contact fields, public API/OpenAPI/client/admin UI/HR report added | PASS | Guardrail scan and changed-file list |
| 16. No real customer, employee, personal or financial data introduced | PASS | Synthetic tenant/cohort labels and opaque hash-like refs only |
| 17. No points, money, billing, subscription, rewards or merch concepts introduced | PASS | Guardrail scan |
| 18. Required commands pass | PASS | Backend/root command raw outputs above |
| 19. Documentation sync explicit and narrow | PASS | No canonical docs changed; no setup/runtime/API/workflow behavior changed |
| 20. Evidence maps every criterion and raw command output | PASS | This section and `evidence.json` |
| 21. Fresh verifier returns PASS before sprint completion | PASS | `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md` and fresh verifier raw outputs |

### Documentation sync

No canonical docs changed in this builder slice. The work adds an internal backend service and append-only schema support without public API surface, setup/runtime changes, developer workflow changes, UI, generated client or canonical product decision changes. Stage artifacts record the implementation and proof.

### API/OpenAPI and screenshots

Not applicable. No public API/controller/OpenAPI/generated-client surface and no user-visible UI changed.

### Human gates

No human-gated item was closed. Legal/privacy wording, financial correctness, reward economy, customer-specific reporting and real operations remain outside this slice.

## Previous sprint: MVP-02-tenant-domain-001

Status: `PASS`

The leaf `stage_builder` implemented only `MVP-02-tenant-domain-001`: minimal `apps/api` Spring Boot/Maven baseline, append-only tenant/cohort/invite migration, JPA/domain model and tests for the required invariants. A fresh `stage_verifier` then reviewed the current repo state and returned `PASS` for this sprint contract only.

This completes `MVP-02.01` / `MVP-02-tenant-domain-001`. It does not complete all MVP-02: invite issuance/activation, employee registration and admin cohort UI remain later slices.

## Commands

| Command | Result | Raw output |
|---------|--------|------------|
| `java -version` | PASS: Temurin 21.0.11 | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-java-version-20260504.txt` |
| `cd apps/api && ./mvnw -v` before wrapper add | RECORDED_ABSENT | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-mvnw-version-20260504.txt` |
| `cd apps/api && ./mvnw -v` after wrapper add | PASS: Maven 3.9.9, Java 21.0.11 | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-mvnw-version-after-wrapper-20260504.txt` |
| Docker availability before Testcontainers | RECORDED then Docker Desktop started | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-docker-info-before-verify-20260504.txt`, `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-docker-info-after-start-20260504.txt` |
| `cd apps/api && ./mvnw -q test` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-api-mvn-test-final-20260504.txt` |
| `cd apps/api && ./mvnw -q verify` | PASS with PostgreSQL/Testcontainers; earlier JPA mapping failure fixed | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-api-mvn-verify-pass-20260504.txt`; diagnostic failed raw: `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-api-mvn-verify-20260504.txt` |
| `make verify` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-make-verify-20260504.txt` |
| `make test-unit` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-make-test-unit-20260504.txt` |
| `make build` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-make-build-20260504.txt` |
| `find apps/api -type f` | RECORDED | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-apps-api-find-20260504.txt` |
| `.codex/config.toml` scan | PASS: `approval_policy = "on-request"` and no `service_tier` | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-codex-config-scan-20260504.txt` |
| `apps/api/src` guardrail scan | PASS: no customer brand, points, money/billing/subscription, price or controller/API surface terms | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-api-guardrail-scan-20260504.txt` |
| Stage artifact JSON parse | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-artifact-json-check-20260504.txt` |
| final `make verify` after artifact sync | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-02-tenant-domain-001-final-make-verify-after-artifacts-20260504.txt` |
| fresh verifier: `java -version` | PASS: Java 21.0.11 | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-java-version-20260504-current.txt` |
| fresh verifier: `cd apps/api && ./mvnw -v` | PASS: Maven 3.9.9 with Java 21.0.11 | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-mvnw-version-20260504-current.txt` |
| fresh verifier: `make verify` | PASS | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-make-verify-20260504-current.txt` |
| fresh verifier: `make test-unit` | PASS | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-make-test-unit-20260504-current.txt` |
| fresh verifier: `make build` | PASS | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-make-build-20260504-current.txt` |
| fresh verifier: `cd apps/api && ./mvnw -q test` | PASS | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-api-mvn-test-20260504-current.txt` |
| fresh verifier: `cd apps/api && ./mvnw -q verify` | PASS with PostgreSQL/Testcontainers and Flyway `V001` + `V002` | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-api-mvn-verify-20260504-current.txt` |
| fresh verifier: config scan | PASS: `approval_policy = "on-request"` and no `service_tier` | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-config-scan-20260504-current.txt` |
| fresh verifier: scope/guardrail scan | PASS: no scope creep beyond current contract | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-scope-guardrail-scan-20260504-current.txt` |
| fresh verifier: migration inspection | PASS: `V001` unchanged; `V002` append-only | `.agent/stages/mvp/raw/stage-verifier-mvp-02-tenant-domain-001-migration-inspection-20260504-current.txt` |
| fresh verifier verdict | PASS | `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md` |
| parent final `make verify` after PASS artifact sync | PASS | `.agent/stages/mvp/raw/final-make-verify-after-mvp-02-pass-20260504.txt` |
| parent final `cd apps/api && ./mvnw -q verify` after PASS artifact sync | PASS | `.agent/stages/mvp/raw/final-api-mvn-verify-after-mvp-02-pass-20260504.txt` |

## Implementation notes

- Maven Wrapper added under `apps/api`: `mvnw`, `mvnw.cmd`, `.mvn/wrapper/maven-wrapper.jar`, `.mvn/wrapper/maven-wrapper.properties`.
- `.gitignore` now excludes `apps/api/target/` generated Maven output.
- Minimal Spring Boot application added at `apps/api/src/main/java/com/finrhythm/api/FinrhythmApiApplication.java`.
- Append-only Flyway migration added: `apps/api/src/main/resources/db/migration/V002__tenant_cohort_invite_model.sql`. `V001__dev_bootstrap_runs.sql` was not modified.
- Domain model added for `Tenant`, `Cohort` and `InviteCode`; repositories added only for persistence tests. No controllers were added.
- Invite records store `lookup_hash` only. The migration constrains it to a unique SHA-256 hex digest and has no raw/plain invite-code column.
- Tenant/cohort ownership is enforced both in domain validation and by the composite database foreign key `(cohort_id, tenant_id) -> cohorts(id, tenant_id)`.
- Invite lifecycle is prepared for later issuance/activation with statuses `CREATED`, `ISSUED`, `RESERVED`, `ACTIVATED`, `REVOKED`, `EXPIRED`; SQL/domain checks reject invalid activation timestamp states.

## Acceptance mapping

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 1. Java 21 and Maven Wrapper verification recorded | PASS | Java and Maven raw outputs above |
| 2. Minimal Spring Boot + Maven baseline can run tests | PASS | `./mvnw -q test`, `make verify`, `make build` |
| 3. Flyway migrations append-only and V001 unchanged | PASS | Added `V002__tenant_cohort_invite_model.sql`; no edit to `V001` |
| 4. Schema models tenants, cohorts/waves and invite records | PASS | `V002`, JPA entities and Testcontainers migration logs |
| 5. Model supports Wave 0 and Wave 1 sizing without code generation | PASS | `TenantDomainTest.supportsWaveZeroAndWaveOneSizingWithoutGeneratingCodes` |
| 6. Invite codes have unique non-raw lookup/hash and lifecycle status | PASS | `lookup_hash` unique index/check and table-column test |
| 7. Constraints/tests prove uniqueness, ownership and activation-state prevention | PASS | `TenantDomainTest` and `TenantPersistenceIT` under `./mvnw -q verify` |
| 8. Tests run against PostgreSQL/Testcontainers or documented faithful path | PASS | `./mvnw -q verify` uses `postgres:16-alpine` Testcontainers |
| 9. No real customer, employee, personal or financial data introduced | PASS | Tests use neutral synthetic labels only; no personal/contact data fixtures added |
| 10. Employee-facing neutral brand remains unchanged | PASS | No employee-facing UI changed |
| 11. No registration, activation endpoint, admin UI, HR reporting or 500-code generation | PASS | No controllers/API/UI/generation code added |
| 12. `points` are not modeled and no money/billing concepts introduced | PASS | No points/money/billing domain changes |
| 13. Required commands pass or blockers recorded | PASS | Command table above |
| 14. Documentation sync explicit | PASS | README, setup, init/dev contract and repo layout updated for API/runtime/root-command behavior |
| 15. Fresh verifier PASS before feature marked passing | PASS | Fresh verifier returned `PASS` for `MVP-02-tenant-domain-001` only |

## Documentation sync

Canonical docs updated because setup/runtime and root-command behavior changed:

- `README.md`
- `docs/setup/codex-setup.md`
- `docs/architecture/init-and-dev-contract.md`
- `docs/architecture/repo-layout.md`

No product/stage scope, API contract or employee/admin workflow changed.

## API/OpenAPI notes

No public API surface was added. No OpenAPI source or generated TypeScript client artifacts changed.

## Screenshots

Not applicable. This slice has no user-visible UI.

## Human gates

No legal, financial correctness, reward economy, real fulfillment, pricing, customer-specific reporting or public brand approval was closed. No human gate is required for this backend schema/model slice.

## Previous sprint summary: MVP-01-bootstrap-001

MVP-01 bootstrap remains verified by prior evidence: root wrappers, local PostgreSQL compose, versioned bootstrap manifest, idempotency migration, synthetic fixture and setup/runtime documentation sync. Prior fresh verifier returned `PASS` for `MVP-01-bootstrap-001`.
