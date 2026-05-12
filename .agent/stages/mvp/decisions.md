# MVP decisions

Updated: 2026-05-12

## D-2026-05-12-003: Build MVP-03 privacy screen as route-only employee UI

Decision: `MVP-03-onboarding-privacy-screen-001` implements only `/onboarding/privacy` in `apps/web` plus a `/learning` navigation link to the privacy explanation.
Why: the smallest honest MVP-03.02 slice can explain the employer/HR visibility boundary before diagnostics without introducing diagnostics, consent logging, backend APIs or legal approval claims.
Impact: full `MVP-03` remains open. Consent version logging, final legal review, diagnostics/routing, backend/API/schema/generated-client, HR reporting and all human gates remain deferred.

## D-2026-05-11-001: Replace MVP cohort domain with pilot launch/access pool

Decision: `MVP-02-remove-cohort-domain-001` uses `tenant` + `pilotLaunch` + `accessPool` as the active MVP access model and removes `cohort/wave` from runtime domain/API/admin UI terminology.
Why: product decision changed the MVP from tenant/cohort waves to one corporate pilot tenant with one launch/access pool of invite codes.
Impact: V005 is append-only and may reference old table/column names only as a backfill/drop migration bridge; active Java/API/admin UI/docs use replacement terminology. Full `MVP-02`, MVP stage and human gates remain open pending fresh verification and any separate closure audit.

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

## D-2026-05-05-001: Promote learning methodology v0.2 to canonical product methodology

Decision: move `learning_methodology_mvp_stage2_v02.md` to `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` and treat it as the canonical MVP learning, diagnostics, routing, lesson template and content approve-flow baseline.
Why: the file defines product/methodology decisions, not raw content and not stage-local evidence. Canonical product docs under `docs/product/**` are the narrowest source of truth for this scope.
Impact: future learning/content/diagnostic/support/reporting slices must read this file before spec freeze and record affected lesson/question/route IDs and human gates.

## D-2026-05-05-002: Keep methodology doc-sync separate from feature completion

Decision: this docs-only slice updates executable scope but does not mark `MVP-05`, `MVP-06`, `MVP-07`, `MVP-09`, `MVP-10`, `MVP-11`, `MVP-12` or full MVP complete.
Why: no runtime diagnostics, lessons, CMS, points, reporting, support, store or UI implementation exists in this slice, and financial/legal/HR/reward gates remain human-pending.
Impact: downstream implementation still requires frozen sprint contracts, evidence and fresh verification.

## D-2026-05-06-001: Ingest Content MVP spec as draft-with-human-gates

Decision: place the prepared Content MVP draft at `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` and wire it into product/stage/harness sources as `MVP-05-content-spec-ingestion-001`.
Why: future MVP-05/06/07/09 work needs a durable canonical draft source, but the content contains human-gated financial, legal/tax, HR/privacy and reward decisions.
Impact: agents can use the spec for future sprint freezes and CMS/template work; no lesson/question/challenge/reward wording is final-approved by this slice.

## D-2026-05-06-002: Preserve MVP-02.03 as next implementation recommendation

Decision: after content-spec ingestion PASS, restore the next implementation recommendation to `MVP-02.03` employee registration.
Why: this slice is a doc-only placement interruption, not a stage-order decision to start MVP-05 implementation ahead of MVP-02 registration.
Impact: `MVP-05-content-spec-ingestion-001` is verified independently, while `MVP-05.01` through `MVP-05.05` remain pending.

## D-2026-05-09-001: Freeze MVP-02.03 as backend/API registration only

Decision: the next sprint contract is `MVP-02-employee-registration-001`, scoped to backend/API employee registration by name, email, phone and invite code.
Why: `MVP-02.01` and `MVP-02.02` already proved the tenant/cohort/invite model and activation core; the next small verifiable slice is the public registration contract that attaches MVP contact fields to that activation path.
Impact: the next builder may add schema, backend service/domain, thin controller, OpenAPI/springdoc source, tests and evidence for this endpoint, but must not add admin UI, employee UI, HR reports, diagnostics, points, consent/legal copy, SSO, rewards, real data or full auth/session.

## D-2026-05-09-002: Treat generated client as note/no-op unless generation exists

Decision: `MVP-02-employee-registration-001` requires OpenAPI/springdoc source and an explicit generated-client handoff, but code generation is a no-op unless a generator or generated artifacts exist or are introduced by the builder.
Why: current repo state has only `packages/api-client/.gitkeep`, so manually inventing generated artifacts would create a second source of truth.
Impact: verifier should accept a documented no-op for generated client in this slice if OpenAPI source is present and no generator exists; if generation is added, generated artifacts must be produced from the backend contract source.

## D-2026-05-09-003: Keep activation subject opaque and separate from contact PII

Decision: registration must not derive `activation_subject_ref` directly from raw email or phone.
Why: the prior MVP-02.02 slice intentionally used an opaque non-PII activation subject before registration; adding contact fields must not weaken that privacy boundary.
Impact: implementation must show how registration links the activated invite to the employee record without storing raw invite codes or using email/phone as the activation subject reference.

## D-2026-05-09-004: Generate registration activation subject refs randomly

Decision: `MVP-02-employee-registration-001` generates a random 64-hex `activation_subject_ref` for first registration and stores it with the employee registration; idempotent retry finds the existing registration by invite lookup hash and reuses that stored opaque ref.
Why: this preserves same-contact retry behavior without deriving the activation subject directly from email or phone.
Impact: registration can compose the existing invite activation core while keeping raw invite codes and PII out of the invite binding field.

## D-2026-05-09-005: Pin Testcontainers for Docker 29 compatibility

Decision: `apps/api/pom.xml` pins Testcontainers to `1.21.4` for the registration slice.
Why: the inherited Testcontainers/docker-java stack attempted Docker API versions rejected by Docker 29, while Testcontainers 1.21.4 works with the current local daemon and preserves the Spring Boot 3.3.6 baseline.
Impact: backend Testcontainers checks run against the current Docker environment without changing production schema/API behavior.

## D-2026-05-09-006: Freeze MVP-02.04 as backend/admin API-only first

Decision: the next sprint contract is `MVP-02-admin-code-status-view-001`, scoped to a read-only backend/admin API data contract for cohort code statuses and activation/registration funnel counts.
Why: `apps/admin` currently has only local instructions and no Next.js app baseline, while `apps/api` already contains the proven tenant/cohort/invite/registration model needed for a small verifiable admin data slice.
Impact: the next builder may add backend admin controller/service/read-model tests and OpenAPI notes, but must not scaffold `apps/admin` UI, add admin mutations, introduce auth/session, expose PII/raw invite codes or mark `MVP-02.04` / full `MVP-02` complete.

## D-2026-05-09-007: Keep admin status response privacy-safe

Decision: the frozen admin code-status API may return cohort metadata, status counts, funnel counts and per-code operational rows, but not raw invite-code values, lookup hashes, activation subject refs or employee contact fields.
Why: the MVP privacy model allows operational tracking while keeping personal financial and contact data minimized; the status/funnel view does not need personal answers or employee contact data.
Impact: future support or fulfillment surfaces that require personal data must be separately frozen with role/audit/privacy evidence and human-gate status.

## D-2026-05-09-008: Implement admin code-status read model without V005 migration

Decision: `MVP-02-admin-code-status-view-001` uses read-only repository projections over existing `V002` tenant/cohort/invite tables and `V004` employee registration data instead of adding a `V005` migration.
Why: the frozen endpoint needs aggregation and pagination only; existing indexes and constraints are sufficient for Wave 1 proof, and a schema change would widen the slice without a concrete read-supporting need.
Impact: verifier should expect no new migration for this slice and should review repository projections, service aggregation and Testcontainers proof instead.

## D-2026-05-09-009: Keep builder status below PASS until fresh verifier runs

Decision: builder evidence for `MVP-02-admin-code-status-view-001` is recorded as `BUILT_AWAITING_VERIFIER`, not `PASS`.
Why: the stage harness requires a fresh `stage_verifier` for completion, and the builder must not write `verdict.json` for its own implementation.
Impact: `MVP-02.04`, full `MVP-02` and current-task verdict aliases remain open until a separate verifier produces a verdict.

## D-2026-05-11-001: Freeze MVP-02.04 admin UI as a separate minimal apps/admin slice

Decision: the next sprint contract is `MVP-02-admin-ui-status-view-001`, scoped to the smallest `apps/admin` Next.js scaffold and read-only code-status view that can be browser-smoked and screenshotted.
Why: the backend/admin API-only slice is already verified, but `apps/admin` has no screenshotable UI; combining this with full admin/CMS, auth, mutations or HR reporting would be too broad.
Impact: the next builder may add minimal admin app/package/config/route/UI files and necessary root wrapper/package/lock updates, but must not change backend/API/schema behavior or claim full `MVP-02.04` / `MVP-02` completion before fresh verification.

## D-2026-05-11-002: Use local typed DTO/fixture boundary until generated client exists

Decision: `MVP-02-admin-ui-status-view-001` may use a narrow local typed DTO/fetch boundary or synthetic fixture in `apps/admin` that matches the proven backend DTO.
Why: `packages/api-client` currently contains no generator or generated artifacts; manually inventing generated client files would create a second source of truth and expand the slice.
Impact: generated-client implementation is out of scope for this contract. Builder evidence must record an explicit generated-client no-op unless a separate freeze introduces generation.

## D-2026-05-11-003: Wire root wrappers honestly if the admin app is introduced

Decision: once `apps/admin` has a buildable Next.js app, root `make verify`, `make test-unit` and `make build` should include relevant admin checks or record exact honest substitutes.
Why: the repo root commands are the durable verification interface, and adding a frontend app without wrapper coverage would make future proof weaker.
Impact: root `package.json`, `pnpm-lock.yaml` and `Makefile` updates are allowed only as needed for install/build/typecheck/test coverage of this admin app slice; setup/runtime docs must be synchronized if workflow changes materially.

## D-2026-05-11-004: Use system Chrome for admin UI browser evidence

Decision: `MVP-02-admin-ui-status-view-001` records browser smoke through installed system Google Chrome via `CHROMIUM_EXECUTABLE_PATH`, not a Playwright-managed Chromium download.
Why: the Playwright browser download was slow in the current network environment, while `/Applications/Google Chrome.app` is already available and works with the repo-pinned Playwright API.
Impact: `apps/admin/tests/browser-smoke.mjs` accepts `CHROMIUM_EXECUTABLE_PATH`; future agents can still use Playwright-managed browsers when available.

## D-2026-05-11-005: Treat FinPulse path as the active checkout for this run

Decision: continue implementation and evidence in `/Users/elena/cursor/FinPulse` after discovering `/Users/elena/cursor/FinRhythm` is a stale/empty path in the current desktop filesystem.
Why: the actual Git checkout, stage artifacts and working diff are under `FinPulse`; continuing in the stale path would lose the stage state.
Impact: evidence records the path anomaly. This does not rename product scope or close the unrelated repo-rename task.

## D-2026-05-12-001: Continue MVP-06 with an N3 renderer-only fixture slice

Decision: freeze and build `MVP-06-learning-n3-fixture-001` as a synthetic `N3_DECLUTTER_TO_GOAL` fixture in the existing `apps/web` renderer, with `/learning/lessons/N3`, the existing full lesson-id alias and a visible `/learning` CTA.
Why: after verified N1/N2 renderer slices, N3 is the next smallest mandatory `Новичок` lesson increment and can be proven without CMS/admin publishing, persistence, scored submissions, points/wallet, diagnostics or onboarding.
Impact: N3 remains synthetic, `editorial_draft` and human-review-required. It does not close full `MVP-06`, production content approval or any human gate.

## D-2026-05-12-002: Accept scoped N3 verifier PASS only for MVP-06.03 fixture surface

Decision: parent orchestrator accepts the fresh scoped verifier `PASS` for `MVP-06-learning-n3-fixture-001` and synchronizes latest status aliases to that task.
Why: independent verifier reran web checks, browser smoke, alias route smoke, guardrail scans and diff checks, and found no blocking scoped problem for the N3 renderer/fixture contract.
Impact: latest verified sprint becomes `MVP-06-learning-n3-fixture-001`. Full `MVP-04`, full `MVP-06`, the MVP stage, onboarding/consent, diagnostics/routing, progress persistence, scored quiz submission, practice submission, points/wallet, CMS/admin publishing, production content approval and all human gates remain open.
