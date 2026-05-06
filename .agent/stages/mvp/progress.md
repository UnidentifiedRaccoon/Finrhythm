# MVP progress

Updated: 2026-05-06

## Current session: MVP-05-content-spec-ingestion-001

- Merged current `origin/main` into the PR branch after GitHub reported the PR as conflicting.
- Preserved the already verified `MVP-05-learning-methodology-doc-sync-001` baseline from `main`.
- Placed the prepared Content MVP draft at `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` with `status: draft_with_human_gates`.
- Added/kept local source dependencies: `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` and `content/getcourse-finstrategy/CONTENT_BRIEF.md`.
- Updated canonical references and stage artifacts so future MVP-05/06/07/09 agents read the content spec without treating it as production approval.
- Kept `MVP-05.01` through `MVP-05.05` open; final financial correctness, legal/tax wording, HR/privacy wording, reward economy and `production_ready` approval remain human-gated.
- No runtime code, DB schema, API/OpenAPI/generated client, UI or fixture behavior changed.
- Final `make verify` and Harness verification pass in the current shell with Java 21 available.
- Fresh verifier PASS is recorded for `MVP-05-content-spec-ingestion-001` only.
- The next implementation recommendation remains freezing `MVP-02.03` employee registration.

## Current session: MVP-05-learning-methodology-doc-sync-001

- Re-synced Harness/product/stage sources for a docs-only learning methodology slice.
- Moved the user-provided root file `learning_methodology_mvp_stage2_v02.md` to `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`.
- Normalized the methodology doc with frontmatter, removed the stray leading `ё`, fixed repo path references and recorded `status: accepted_with_human_gates`.
- Updated canonical docs so methodology v0.2 is now the MVP learning/diagnostic baseline:
  - `docs/architecture/source-of-truth.md`;
  - `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
  - `docs/stages/MVP.md`;
  - `docs/stages/v1.md`;
  - `docs/stages/v2.md`;
  - `.agents/skills/stage-launch-proof-loop/SKILL.md`;
  - `.agents/skills/stage-launch-proof-loop/references/PROTOCOL.md`;
  - `.agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md`.
- Synchronized stage artifacts for `MVP-05-learning-methodology-doc-sync-001` without marking `MVP-05`, `MVP-06`, `MVP-07`, `MVP-09`, `MVP-10`, `MVP-11`, `MVP-12` or full MVP complete.
- Baseline `make verify` in the current shell failed at `cd apps/api && ./mvnw -q test` because Java runtime could not be located; bootstrap checks passed before that failure. This is recorded as an environment blocker for Java-backed verification, not a docs contradiction.
- Fresh `stage_verifier` returned `PASS` for `MVP-05-learning-methodology-doc-sync-001`, rerunning lightweight scans and Harness verification; Java-backed `make verify` remains documented as non-blocking for this docs-only slice.
- Human gates remain pending for final financial correctness, legal/tax review, HR wording, reward operations and support answer policy.

## Current session: resume-stage mvp

- Re-synced required sources for `resume-stage mvp`: `AGENTS.md`, architecture source-of-truth, documentation workflow, B2B product foundation, `docs/stages/MVP.md` and existing `.agent/stages/mvp/*` artifacts.
- Confirmed the latest fresh verifier PASS is scoped only to `MVP-02-tenant-domain-001` / `MVP-02.01`; it does not cover `MVP-02.02`, `MVP-02.03`, `MVP-02.04` or all MVP-02.
- Inspected current repo/baseline and recorded raw outputs:
  - `git status --short`: dirty from prior stage work and stage artifacts;
  - `git diff --stat`: recorded;
  - `java -version`: PASS, Temurin 21.0.11;
  - `cd apps/api && ./mvnw -v`: PASS, Maven 3.9.9 with Java 21.0.11;
  - `make verify`: PASS.
- Ran exactly one spec-freeze pass for the next slice and updated only stage artifacts.
- Frozen next sprint contract: `MVP-02-invite-issuance-activation-001` for parent unit `MVP-02.02`.
- Scope is backend/domain service-level invite issuance, activation and one-user binding for existing tenant/cohort records.
- Validated updated JSON artifacts and harness: `verify_harness.py --stage-id mvp` PASS; final `make verify` after freeze artifact sync PASS.
- Restored after interruption and stopped the partially running orchestrator/builder to avoid concurrent writers.
- Completed the builder implementation for `MVP-02-invite-issuance-activation-001`:
  - added opaque `ActivationSubjectRef`;
  - extended invite lifecycle validation with `activation_subject_ref`;
  - added internal `InviteCodeAccessService` and generator/result/exception types;
  - added append-only `V003__invite_issuance_activation_binding.sql`;
  - added unit and PostgreSQL/Testcontainers tests for 500-code issuance, no raw-code persistence, activation, same-subject idempotency, invalid/expired/revoked/unissued paths, different-subject rejection and concurrent double-activation prevention.
- Resolved two interrupted-builder compile issues:
  - `InviteCode` lifecycle helpers now accept non-`Instant` fields;
  - the concurrency test no longer shadows the record accessor with a static method named `activated`.
- Required builder checks now pass:
  - `cd apps/api && ./mvnw -q test`;
  - `cd apps/api && ./mvnw -q verify`;
  - `make verify`;
  - `make test-unit`;
  - `make build`.
- Recorded migration inspection, guardrail scan and changed-file raw outputs.
- No public API/controller/OpenAPI/generated client, employee/admin UI, HR report, registration/contact fields, points, money, billing, rewards or merch were added.
- No canonical docs were changed because setup/runtime/API/workflow/product decisions did not change; stage artifacts carry the proof handoff.
- Fresh verifier raw outputs and handoffs found no blocking gaps; durable `verdict.json`/`problems.md` now record `PASS` for `MVP-02-invite-issuance-activation-001` only.
- Marked only `MVP-02.02` / `MVP-02-invite-issuance-activation-001` complete. `MVP-02.03`, `MVP-02.04` and full MVP-02 remain open.
- Next honest step: freeze the next small sprint contract for `MVP-02.03` employee registration. Do not start `MVP-02.04` or full MVP-02 closure without a separate frozen contract and evidence.

## Previous session: MVP-02-tenant-domain-001

- Ran the required `MVP-02-tenant-domain-001` first checks before production edits: `java -version` passed with Temurin 21.0.11; `apps/api/mvnw` was recorded absent.
- Added the minimal Maven Wrapper path under `apps/api` and verified `cd apps/api && ./mvnw -v` with Maven 3.9.9 and Java 21.0.11.
- Implemented only the MVP-02.01 backend/domain model slice: minimal Spring Boot application, append-only `V002__tenant_cohort_invite_model.sql`, tenant/cohort/invite JPA/domain model and repositories for persistence tests.
- Added focused tests:
  - unit/domain checks for Wave 0/Wave 1 sizing, hash validation, same-tenant ownership and activation lifecycle validation;
  - PostgreSQL/Testcontainers checks for Flyway migration, unique invite lookup hash, DB-level tenant/cohort ownership, invalid activated state rejection and absence of raw invite-code columns.
- Updated root `make verify`, `make test-unit` and `make build` to include the new backend unit/package path.
- Synced canonical setup/runtime docs because root command and API baseline behavior changed: `README.md`, `docs/setup/codex-setup.md`, `docs/architecture/init-and-dev-contract.md`, `docs/architecture/repo-layout.md`.
- Started Docker Desktop for Testcontainers proof after recording the daemon was initially unavailable.
- Required checks passed: `make verify`, `make test-unit`, `make build`, `cd apps/api && ./mvnw -q test`, `cd apps/api && ./mvnw -q verify`, `find apps/api -type f`, and config scan for `approval_policy = "on-request"` with no `service_tier`.
- Did not edit `.codex/config.toml`.
- Did not add registration, invite activation endpoint, admin UI, HR reporting, 500-code generation, points, money/billing, rewards, diagnostics, learning, support or employee-facing UI.
- Ran a fresh `stage_verifier` for `MVP-02-tenant-domain-001`. It returned `PASS` after independently rerunning Java/Maven/root/backend checks, migration inspection, scope guardrail scans, docs/OpenAPI sync checks and raw evidence checks.
- Marked only `MVP-02.01` / `MVP-02-tenant-domain-001` complete. `MVP-02.02`, `MVP-02.03`, `MVP-02.04` and all MVP-02 remain open.

## Verification summary

Passing:

- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- `.codex/config.toml` scan for `approval_policy = "on-request"` and no `service_tier`
- fresh `stage_verifier` verdict `PASS` for `MVP-02-tenant-domain-001`
- fresh `stage_verifier` verdict `PASS` for `MVP-02-invite-issuance-activation-001`

## Previous summaries

- `MVP-01-bootstrap-001` remains previously verified with fresh verifier `PASS`.
- Earlier `MVP-02-tenant-domain-001` attempts were blocked by missing Java runtime and absent Maven Wrapper; those raw outputs remain as historical evidence, superseded by this session's Java/Maven proof.
