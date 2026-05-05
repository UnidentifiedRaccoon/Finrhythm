# MVP decisions

Updated: 2026-05-04

## D-2026-05-04-001: Freeze only MVP-01 bootstrap

Decision: this run implements only `MVP-01-bootstrap-001`.  
Why: the user explicitly prohibited MVP-02+ before MVP-01 has evidence and fresh verification.  
Impact: tenant, invite, UI, admin, reporting and points-ledger product code remain out of scope.

## D-2026-05-04-002: Keep neutral synthetic bootstrap fixture

Decision: demo fixture uses `demo-corporate-pilot` and neutral `FinRhythm` employee brand.  
Why: employee-facing UI and fixtures must not expose the first customer brand by default.  
Impact: fixture can validate bootstrap guardrails without real customer data.

## D-2026-05-04-003: Do not model points as money

Decision: reward fixture uses `pointsPrice`, not `price`, `money`, currency or monetary balance fields.  
Why: stage/product docs define `points` as non-monetary.  
Impact: later reward implementation must keep an auditable points ledger separate from monetary concepts.

## D-2026-05-04-004: Remove unsupported fixed service tier

Decision: `.codex/config.toml` no longer pins `service_tier = "flex"`.  
Why: custom stage subagents failed before execution with `Unsupported service_tier: flex`.  
Impact: project still pins `gpt-5.5`, `xhigh` and `approval_policy = "on-request"`, while allowing the runtime to choose a supported service tier.

## D-2026-05-04-005: Freeze first MVP-02 slice around backend/domain model only

Decision: the first MVP-02 contract is `MVP-02-tenant-domain-001`, scoped to minimal API bootstrap plus tenant, cohort/wave and invite code persistence/domain model.  
Why: MVP-02 must start with a narrow, testable model before activation, registration and admin UI; current repo lacks a runnable Spring/Maven API baseline.  
Impact: later slices own invite issuance/activation, employee registration, admin cohort screens and 500-code generation.

## D-2026-05-04-006: Treat Java/Maven proof as the first builder gate

Decision: the next builder must run `java -version` and Maven Wrapper checks before claiming API implementation progress.  
Why: current host still reports no Java Runtime, and Spring/Maven proof cannot be assumed.  
Impact: if Java remains unavailable and no approved Java 21 toolchain exists, `MVP-02-tenant-domain-001` should become `BLOCKED` rather than partially self-certified.

## D-2026-05-04-007: Stop MVP-02 before production edits until Java/Maven blocker is resolved

Decision: `MVP-02-tenant-domain-001` remains `BLOCKED` after a fresh verifier confirmed missing Java runtime and absent `apps/api/mvnw`.  
Why: the sprint contract requires Java/Maven proof before backend implementation claims, and the blocker cannot be fixed safely without an approved Java 21 toolchain path.  
Impact: no tenant/cohort/invite schema or API baseline is implemented yet; the next run must provide Java 21 and Maven Wrapper proof before continuing this same contract.

## D-2026-05-04-008: Scope legacy-token scan to managed source

Decision: bootstrap `legacy-token-scan` ignores `.agent`, dependency directories and generated output directories.  
Why: fresh verification found the scan could fail on local dependency assets or proof artifacts that quote command failures, which made current evidence stale even though managed source policy still held.  
Impact: `make verify` now checks repo-managed source/config/docs without treating raw evidence or third-party dependency text as policy violations.

## D-2026-05-04-009: Add Maven Wrapper after Java 21 proof

Decision: add `apps/api/mvnw`, `mvnw.cmd` and `.mvn/wrapper/*` as part of `MVP-02-tenant-domain-001`.  
Why: the sprint contract explicitly allowed adding the Maven Wrapper path once Java became available, and backend proof must not depend on host Maven.  
Impact: API verification now runs through `cd apps/api && ./mvnw ...`; root `make verify`, `make test-unit` and `make build` delegate to the wrapper for backend checks.

## D-2026-05-04-010: Keep MVP-02.01 model-only with no API surface

Decision: implement tenant, cohort/wave and invite-code persistence/domain model without controllers or OpenAPI changes.  
Why: this contract prepares the model for later issuance, activation, registration and admin slices, but those flows are explicit non-goals.  
Impact: no generated client updates are needed in this slice; later API slices must update OpenAPI source and generated-client notes.

## D-2026-05-04-011: Close only MVP-02.01 after fresh verifier PASS

Decision: mark `MVP-02.01` / `MVP-02-tenant-domain-001` complete after fresh `stage_verifier` returned `PASS`.  
Why: Java 21, Maven Wrapper, Spring Boot baseline, append-only `V002`, domain/schema tests, docs sync and scope guardrails are all proven for the current contract.  
Impact: `MVP-02.02`, `MVP-02.03`, `MVP-02.04` and overall MVP-02 remain open; the next sprint should freeze invite issuance/activation scope separately.

## D-2026-05-04-012: Freeze MVP-02.02 as service-level issuance/activation core

Decision: the next sprint contract is `MVP-02-invite-issuance-activation-001`, scoped to backend/domain invite issuance, activation and one-user binding for existing tenant/cohort records.  
Why: `MVP-02.02` should build on the proven tenant/cohort/invite model without widening into employee registration, admin UI, auth/session or HR reports.  
Impact: the next builder may add append-only schema/service/test changes for issuance and activation, but must not add public REST/OpenAPI/controller, employee contact fields, admin UI or generated client work without re-freezing scope.

## D-2026-05-04-013: Use opaque non-PII subject binding before registration

Decision: one-user binding for `MVP-02.02` is represented as an opaque non-PII activation subject reference, not name/email/phone.  
Why: registration by name/email/phone/code is explicitly `MVP-02.03`; binding must prevent code reuse without introducing personal data early.  
Impact: `MVP-02.03` can later attach registration/profile details to this activation subject through a separately frozen contract.

## D-2026-05-04-014: Keep MVP-02.02 internal service-only

Decision: implement invite issuance and activation as internal backend service/domain behavior only, without REST controllers, OpenAPI, generated client, employee registration or admin UI.  
Why: the frozen sprint contract prepares core behavior for later slices while explicitly excluding public activation endpoints, registration by contact fields and admin tracking surfaces.  
Impact: fresh verification can assess issuance/activation invariants independently; any API/UI surface must be introduced by a later frozen contract.

## D-2026-05-04-015: Close only MVP-02.02 after fresh verifier PASS

Decision: mark `MVP-02.02` / `MVP-02-invite-issuance-activation-001` complete after fresh verifier checks returned `PASS`.  
Why: issuance, activation, opaque binding, raw-code persistence guardrails, migration order and root/backend commands are proven for this contract.  
Impact: `MVP-02.03`, `MVP-02.04` and full MVP-02 remain open; the next run should freeze employee registration separately.
