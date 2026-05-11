# MVP progress

Updated: 2026-05-12

## Current session: MVP-04-design-system-tokenization-001 parent alias sync

- Parent orchestrator accepted the scoped fresh verifier `PASS` for `MVP-04-design-system-tokenization-001` as sufficient for the narrow `MVP-04.04` design-token/app-shell/common-state acceptance surface.
- Root latest aliases were synchronized from `MVP-06-learning-renderer-fixture-001` to `MVP-04-design-system-tokenization-001`: `.agent/stages/mvp/evidence.json`, `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md`, `.agent/stages/mvp/status.json`, `.agent/stages/mvp/progress.md`, `.agent/stages/mvp/backlog.md`, `.agent/stages/mvp/feature_list.json` and `.agent/stages/mvp/sprint_contract.md`.
- Immutable `MVP-06-learning-renderer-fixture-001` artifacts were preserved under `.agent/stages/mvp/evidence/`, `.agent/stages/mvp/verdicts/`, `.agent/stages/mvp/problems/` and `.agent/stages/mvp/raw/`.
- Full `MVP-04`, full `MVP-06`, the MVP stage and all human gates remain open.
- `java -version` remains unavailable in the current shell, so `make verify` is not run or claimed for this parent sync.

## Current session: MVP-04-design-system-tokenization-001 builder evidence

- Implemented a narrow design-system tokenization slice for the existing `apps/web` learning shell and fixture-backed lesson renderer.
- Mapped the draft Calm Progress Fintech design baseline from `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` into `apps/web/app/globals.css` using canonical CSS custom property names for colors, typography, spacing, radius, shadows and controls.
- Left `packages/ui` untouched because it currently has no scaffold or established shared component pattern.
- Reworked the employee UI styling around primary `#1677F2`, cyan/teal/mint privacy/progress surfaces, neutral text/borders, tokenized chips/cards/buttons, route progress and sensitive/privacy panels.
- Added focused test coverage asserting the design-system tokens are present and the old local variables (`--bg`, `--ink`, `--green`, `--blue`, `--line`, `--surface`) do not return as the active layer.
- Used Browser/IAB for rendered review; fixed a bottom-nav selector bug found in screenshot inspection, then reran mobile browser smoke with screenshots for `/learning`, `/learning/lessons/N1`, loading, empty and error states.
- Builder checks passed: web typecheck/test/build, browser smoke, Browser/IAB route and interaction review, customer-brand scan, forbidden-copy scan, no-real-data scan, no-cohort scan, `./scripts/validate-bootstrap.sh` and `pnpm -s run build:docs`.
- `java -version` fails in the current shell because no unqualified Java runtime is on PATH, so `make verify` was not run or claimed for this frontend slice.
- Immutable task/evidence refs were added for `MVP-04-design-system-tokenization-001`; root latest aliases were later synchronized by parent orchestrator after accepting the scoped fresh verifier `PASS`.
- Full `MVP-04`, full `MVP-06`, the MVP stage and all human gates remain open.

## Current session: MVP-06-learning-renderer-fixture-001 builder evidence

- Ran `stage_spec_freezer` and froze `MVP-06-learning-renderer-fixture-001` for parent unit `MVP-06.03` after `MVP-04-mobile-learning-shell-001` PASS.
- Decision rule selected the preferred fixture-backed renderer path because the current `apps/web` mobile learning shell is sufficient and the content spec draft already defines enough lesson/block/quiz/practice structure for one synthetic N1 renderer.
- Implemented a typed local synthetic lesson fixture contract in `apps/web/lib/learning-types.ts` and `apps/web/lib/learning-fixtures.ts`.
- Added `N1_RESERVE_START` synthetic fixture with required sections: situation, why, rule, office/store examples, display-only mini-test preview, non-persistent practice guardrails, reward copy and review notes.
- Added the mobile lesson renderer and direct route `/learning/lessons/N1`; updated `/learning` to reach it from the existing preview CTA.
- Added tests for fixture shape, block order, direct entry, renderer output and guardrails; web tests now pass 9 assertions across the shell and renderer suites.
- Extended browser smoke to cover `/learning/lessons/N1`; captured five mobile screenshots under `.agent/stages/mvp/raw/mvp-06-learning-renderer-fixture-001-screenshots-20260511/`.
- Builder checks passed: web typecheck/test/build, browser smoke, root `make verify`, `make test-unit`, `make build`, customer-brand scan, forbidden-copy scan, no-real-data scan, no-cohort scan and nested app-local `.agent` scan.
- Removed an accidental generated `apps/web/.agent` screenshot output after the first smoke run and kept final generated evidence under the root `.agent/stages/mvp/raw` tree.
- Canonical docs were not changed because the implementation follows already frozen MVP/content docs and found no behavior, architecture, API, setup or workflow contradiction.
- Fresh verifier returned `PASS` for `MVP-06-learning-renderer-fixture-001` only after rerunning web/root checks, browser/mobile smoke, guardrail scans, JSON validation and `git diff --check`.
- Parent synchronized latest verified aliases to `MVP-06-learning-renderer-fixture-001`.
- `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, MVP stage and all human gates remain open.

## Current session: MVP-04-mobile-learning-shell-001 verifier PASS and parent sync

- Froze and implemented the preferred next bridge slice for mobile learning because `apps/web` had no production-ready employee shell.
- Added a minimal Next.js + React `apps/web` scaffold with `/` and `/learning` direct demo entry routes.
- Rendered a mobile-first Russian learning shell with neutral `Финпульс` product brand, bottom navigation, ready/loading/empty/error states, `Новичок` N1-N7 track entry and one `N1` lesson preview from synthetic fixtures only.
- Kept onboarding/privacy/consent and diagnostics/routing explicitly deferred; no completion claim was made for `MVP-03`, `MVP-07`, `MVP-04`, `MVP-06`, the MVP stage or human gates.
- Added focused web tests for state resolution, shell rendering, synthetic fixture metadata and guardrails.
- Added Playwright browser smoke over a representative mobile viewport with four screenshots, and ran Browser/IAB smoke for URL/title/DOM/console health.
- Updated root wrappers so `make verify`, `make test-unit` and `make build` include available `apps/web` checks.
- Synchronized canonical docs for the new web baseline and root wrapper behavior: `README.md`, `docs/setup/codex-setup.md`, `docs/architecture/repo-layout.md`, `docs/architecture/init-and-dev-contract.md`.
- Checks passed with Homebrew JDK 21 and system Chrome: web typecheck/test/build, browser smoke, Browser/IAB smoke, customer-brand scan, forbidden-copy scan, no-real-data scan, no-cohort scan, `make verify`, `make test-unit`, `make build`.
- Builder evidence is recorded in `.agent/stages/mvp/evidence/MVP-04-mobile-learning-shell-001.*`; fresh verifier raw proof passed and durable verdict/problems refs are recorded for `MVP-04-mobile-learning-shell-001` only.
- Removed misplaced duplicate generated app-local stage artifacts under `apps/admin/.agent` / `apps/web/.agent` after verifier scan risk; canonical root `.agent/stages/mvp/raw` evidence remains.
- Final parent alias sync records `MVP-04-mobile-learning-shell-001` as the latest verified sprint while keeping `MVP-03`, `MVP-07`, full `MVP-04`, full MVP and all human gates open.

## Current session: MVP-02-closure-audit-001 verifier PASS

- Executed the closure/audit-only slice for full `MVP-02` after the verified `MVP-02-remove-cohort-domain-001` PASS.
- Reconciled `docs/stages/MVP.md` `MVP-02` acceptance criteria against current stage status, prior PASS records, immutable verdict/evidence refs and the latest access-model refactor proof.
- Decision: full `MVP-02` is recorded as `DONE_WITH_HUMAN_PENDING` because no concrete non-human proof gap remains for the technical MVP-02 acceptance criteria.
- Acceptance mapping now covers 500-code access-pool issuance/tracking, one-time activation linked to user/access pool, registration by name/email/phone/code without corporate SSO and duplicate/expired/invalid paths.
- Kept the MVP stage open and all human gates non-DONE: legal/privacy/consent, real employee/customer data processing, customer-specific reporting boundaries, admin auth/role/audit policy, disclosure requests and broader financial/reward/fulfillment/HR/content approvals.
- Did not edit production code, tests, schemas, API/OpenAPI/generated clients, UI, package/lock/config files, canonical docs, raw prior evidence or prior immutable evidence/verdict refs.
- Recorded builder evidence under `.agent/stages/mvp/evidence/MVP-02-closure-audit-001.*` and updated latest evidence aliases, `status.json`, `backlog.md`, `progress.md` and `feature_list.json`.
- Fresh verifier returned `PASS` for `MVP-02-closure-audit-001` only.
- Orchestrator accepted the verifier PASS and synchronized `status.json.latest_verified_sprint_contract_id` to `MVP-02-closure-audit-001`.
- Final orchestrator checks after alias sync are recorded under final raw refs. Full `MVP-02` is `DONE_WITH_HUMAN_PENDING`; the MVP stage and all human gates remain open.

## Current session: MVP-02-remove-cohort-domain-001 verifier PASS

- Froze and implemented the minimal honest refactor for the new product decision: MVP no longer treats `cohort`/`wave` as an active domain/API/UI/operator concept.
- Added append-only `V005__pilot_launch_access_pool_model.sql`: creates `pilot_launches` and `access_pools`, backfills previous dev rows, moves `invite_codes` and `employee_registrations` to access-pool/pilot-launch references, then drops old active table/columns.
- Removed active Java `Cohort`, `CohortKind`, `CohortStatus` and `CohortRepository`; active runtime code now uses `PilotLaunch`, `AccessPool`, `pilotLaunchId` and `accessPoolId`.
- Replaced the admin status API with `GET /api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status`; registration responses now return replacement identifiers instead of `cohortId`.
- Updated the admin UI DTO/client/fixture/copy/tests/browser smoke to the access-pool status model with Russian operator copy and five refreshed screenshots.
- Synchronized canonical docs for the changed MVP access model and recorded remaining old-term matches as historical migrations, prior immutable stage artifacts, current cleanup contract text or the V005 transition bridge.
- Checks passed with Homebrew JDK 21 and system Chrome: focused backend tests, `cd apps/api && ./mvnw -q verify`, admin typecheck/test/build, browser smoke, `make verify`, `make test-unit`, `make build`, JSON validation and `git diff --check`.
- Generated-client remains explicit no-op because `packages/api-client` has no generator/artifacts.
- First fresh verifier returned `FAIL` only for setup-doc drift in `AGENTS.md`, `README.md` and `docs/setup/codex-setup.md`.
- Ran exactly one fixer pass for that concrete docs gap; no production code or human-gate state changed.
- Fresh post-fixer verifier returned `PASS` for `MVP-02-remove-cohort-domain-001` only.
- Orchestrator accepted the verifier PASS and synchronized `status.json.latest_verified_sprint_contract_id` to `MVP-02-remove-cohort-domain-001`.
- Final orchestrator checks after alias sync are recorded under final raw refs. Full `MVP-02`, MVP stage and all human gates remain open.

## Current session: MVP-02-04-closure-audit-001 closure decision

- Executed the stage-artifact-only closure/audit slice for `MVP-02.04` after reading the frozen sprint contract and task file.
- Reconciled prior immutable verifier refs:
  - `MVP-02-admin-code-status-view-001` fresh verifier `PASS` for the backend/admin API-only status data contract;
  - `MVP-02-admin-ui-status-view-001` fresh verifier `PASS` for the minimal `apps/admin` read-only status view.
- Found no remaining non-human proof gap for the `MVP-02.04` technical scope: together the verified slices cover cohort/code status backend data, activation/registration funnel counts, Russian read-only operator UI, privacy-safe rendering and screenshot/browser evidence limitations.
- Recorded `MVP-02.04` as `DONE_WITH_HUMAN_PENDING`, not `DONE`.
- Kept full `MVP-02`, the MVP stage and human gates open: legal/privacy wording, consent copy, real employee/customer data processing, customer-specific reporting boundaries and admin auth/role/audit policy for production use.
- Did not change production code, tests, schemas, API contracts, generated clients, package manifests, lockfiles, app config, UI files, canonical docs, verdict/problems aliases or prior raw evidence.
- Canonical docs are a no-op for this slice because behavior, public contracts and operating workflow did not change; stage artifacts carry only the closure/audit handoff.
- Fresh verifier returned `PASS` for `MVP-02-04-closure-audit-001`; blocking proof gaps: none.
- Orchestrator accepted the verifier PASS and synchronized `status.json.latest_verified_sprint_contract_id` to `MVP-02-04-closure-audit-001`.
- Final orchestrator checks after alias sync passed: `verify_harness.py --stage-id mvp`, JSON validation and `git diff --check`.
- Next honest step is a separately frozen `MVP-02` closure audit or the next MVP slice. Do not mark full `MVP-02` complete from the `MVP-02.04` decision alone.

## Current session: MVP-02-admin-ui-status-view-001 post-fix verifier PASS

- Fresh verifier first returned `FAIL` for two concrete proof gaps: the success UI rendered raw backend enum `PLANNED`, and `git diff --check` failed on trailing whitespace in `.agent/stages/mvp/evidence.md`.
- Ran one fixer pass scoped only to those gaps.
- Fixed cohort status rendering with `COHORT_STATUS_LABELS` so the operator UI shows `500 · Запланирована` instead of `500 · PLANNED`.
- Updated browser smoke assertions to expect the Russian label and reject rendered `500 · PLANNED`.
- Removed the trailing whitespace from the active evidence alias.
- Fixer checks passed: admin typecheck, admin test, admin build, rendered HTML label proof, guardrail scan and `git diff --check`.
- Fixer attempted browser smoke with installed system Google Chrome through `CHROMIUM_EXECUTABLE_PATH`, but Chrome aborted before navigation; no browser download was attempted. Existing builder screenshots remain state/layout evidence, and post-fix production HTML proves the corrected label.
- Fresh post-fix verifier returned `PASS` for `MVP-02-admin-ui-status-view-001` only.
- `MVP-02.04`, full `MVP-02`, MVP stage and human gates remain open. Admin auth/role/audit policy, real employee/customer data processing and customer-specific reporting boundaries are not closed.

## Current session: MVP-02-admin-ui-status-view-001 builder evidence

- Implemented the minimal `apps/admin` Next.js scaffold and read-only operator status view for the verified backend code-status DTO.
- Added a typed local DTO/client/fixture boundary, synthetic fixture mode, optional read-only live mode with explicit synthetic tenant/cohort env vars, and Russian operator copy.
- Added success, loading, error and empty states; browser smoke with installed system Google Chrome captured desktop/mobile success plus desktop empty/error/loading screenshots.
- Wired root wrappers to include admin checks: `make verify`, `make test-unit` and `make build` now run relevant admin type/test/build coverage.
- Updated setup/runtime docs for the new admin app and root wrapper behavior: `README.md`, `docs/setup/codex-setup.md`, `docs/architecture/repo-layout.md`; added generated frontend output ignores to `.gitignore`.
- Required checks passed with Homebrew JDK 21: `pnpm install --frozen-lockfile`, admin typecheck/test/build, browser smoke, PII/raw-code/customer-brand scan, `git diff --check`, `make verify`, `make test-unit`, `make build`.
- Generated-client remains an explicit no-op because `packages/api-client` still has no generator or artifacts.
- No backend/API/schema behavior, generated client, admin mutations, HR dashboard, auth/session/roles/audit policy, real data, diagnostics, rewards, merch, content/CMS, support or employee UI was added.
- Implementation checkout anomaly: active Git repo is `/Users/elena/cursor/FinPulse`; `/Users/elena/cursor/FinRhythm` was observed as a stale/empty path with generated `node_modules` during dependency troubleshooting.
- Builder evidence was later checked by fresh verifier. Post-fix verifier PASS is recorded for `MVP-02-admin-ui-status-view-001` only; `MVP-02.04`, full `MVP-02`, MVP stage and human gates remain open.

## Current session: MVP-02-admin-ui-status-view-001 spec freeze

- Re-synced the required read set for a leaf `stage_spec_freezer`: repo `AGENTS.md`, source-of-truth, documentation workflow, read matrix, `docs/stages/MVP.md`, product foundation, access/subscription architecture, DoD, human gates, `apps/admin/AGENTS.md`, current MVP status/evidence/problems/backlog/progress/decisions/risks/feature list and the verified backend admin endpoint/read-model paths.
- Preserved current verified state: `MVP-02-admin-code-status-view-001` remains latest verified sprint, `MVP-02.01` through `MVP-02.03` remain `PASS`, backend/API-only part of `MVP-02.04` remains `PASS`, and full `MVP-02.04` / `MVP-02` / MVP remain open.
- Confirmed current repo constraints for scope: `apps/admin` contains only `apps/admin/AGENTS.md`; root JS workspace has `pnpm@10.27.0` with no Next/React/TypeScript/Turbo dependencies yet; `packages/ui`, `packages/config` and `packages/api-client` are placeholders; `packages/api-client` has no generator/artifacts; root `Makefile` currently verifies backend/bootstrap only.
- Confirmed the proven backend endpoint shape for `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`: optional `status/page/size`, status enum `CREATED|ISSUED|RESERVED|ACTIVATED|REVOKED|EXPIRED`, size max `100`, privacy-safe metadata/summary/statusCounts/code rows and no raw invite codes or employee contact fields.
- Frozen next sprint contract: `MVP-02-admin-ui-status-view-001` for parent unit `MVP-02.04`.
- Scope is the minimal `apps/admin` Next.js scaffold plus read-only operator status view, using a local typed DTO/fetch boundary or synthetic fixture that matches the proven backend DTO.
- Required future builder evidence covers root/admin package commands, browser smoke, desktop/mobile screenshots, loading/error/empty/success states, Russian operator copy, PII/raw-code scan, generated-client no-op, docs target decision, harness validation and fresh verification.
- Explicitly excluded backend/API/schema changes, generated API client implementation, admin auth/session/roles/audit production policy, real data, customer-specific reporting, HR dashboard, admin mutations and full `MVP-02.04` / `MVP-02` closure.
- No production code, tests, package manifests, lockfiles, configs or canonical docs were changed by this freezer.
- No implementation, evidence or fresh verifier PASS is claimed for `MVP-02-admin-ui-status-view-001`; feature entries remain `passes=false` until builder evidence and fresh verifier exist.
- JSON validation passed for edited JSON artifacts. Harness validation currently returns `FAIL` on latest-alias ID mismatch because `sprint_contract.md` and `status.json.active_sprint_contract_id` now point to frozen `MVP-02-admin-ui-status-view-001`, while `evidence.json`, `verdict.json` and `problems.md` correctly remain on latest verified `MVP-02-admin-code-status-view-001`. Evidence/verdict aliases were not rewritten for an unimplemented UI slice.

## Current session: MVP-02-admin-code-status-view-001 fresh verifier

- Fresh `stage_verifier` independently re-ran the required checks for `MVP-02-admin-code-status-view-001` and recorded verifier raw outputs under `.agent/stages/mvp/raw/stage-verifier-mvp-02-admin-code-status-view-001-*`.
- Verdict is `PASS` for the backend/admin API-only data contract: `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`.
- Verified 500-code Wave 1 coverage, mixed status counts, activation/registration funnel counts, status filtering, bounded pagination, safe 400/404 errors, OpenAPI/springdoc source and runtime `/v3/api-docs` assertions.
- Verified no `apps/admin` UI/scaffold changed; screenshot/browser evidence is `NOT_APPLICABLE` for this backend-only slice.
- Verified no `V005` migration was added, `packages/api-client` remains no-op because no generator exists, and privacy scans cover raw invite-code/PII/customer-brand guardrails.
- Recorded a non-blocking verifier environment note: unqualified `java -version` fails in this shell, but Homebrew OpenJDK 21.0.11 is installed and all Maven/root checks passed with explicit `JAVA_HOME`/`PATH`.
- Marked only `MVP-02-admin-code-status-view-001` and the backend API portion of `MVP-02.04` as PASS. `apps/admin` UI/status view, full `MVP-02.04`, full `MVP-02`, admin auth/role/audit policy and real-data/customer-reporting human gates remain open.

## Current session: MVP-02-admin-code-status-view-001 builder and evidence

- Implemented the backend/admin API source slice for `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status` within the frozen backend-only scope.
- Added a thin admin controller, read-model DTOs, structured safe admin errors and springdoc/OpenAPI source annotations.
- Added service-level validation, aggregation, pagination and privacy-safe row mapping; repository additions are read-only projections/queries over existing tenant/invite/registration schema.
- Avoided a DB migration: no `V005` was added, and inspection records that `V002`-`V004` are sufficient for this read endpoint.
- Added `AdminCodeStatusControllerIT` with 500 synthetic Wave 1 invite codes, mixed issued/activated/registered/revoked/expired states, funnel counts, status filtering, bounded pagination, safe mismatch/not-found and validation errors, privacy response assertions and `/v3/api-docs` coverage.
- Required builder checks pass: `cd apps/api && ./mvnw -q test`, `cd apps/api && ./mvnw -q verify`, `make verify`, `make test-unit`, `make build` and `git diff --check`.
- Recorded generated-client no-op: `packages/api-client` still contains only `.gitkeep`, with no generator or generated artifacts to update.
- Recorded privacy/raw-code/PII/customer-brand guardrail scan; synthetic test-only contact fields are used only to prove they are not exposed in the admin response.
- Updated `.agent/stages/mvp/evidence.*` and immutable evidence for `MVP-02-admin-code-status-view-001` with Mermaid flow and acceptance mapping.
- No `apps/admin` UI/scaffold, screenshots, admin mutations, auth/session/role/audit policy, HR reports, diagnostics, points, rewards, merch, support, real data or full `MVP-02` closure is claimed.
- Fresh `stage_verifier` is still required; builder did not write `verdict.json` or `verdicts/MVP-02-admin-code-status-view-001.json`.

## Previous session: MVP-02-admin-code-status-view-001 spec freeze

- Re-synced the required read set for an MVP `stage_spec_freezer`: repo AGENTS, stage harness skill/read matrix, architecture docs, DoD, human gates, product foundation, `docs/stages/MVP.md`, current MVP artifacts, prior MVP-02 task files and local `apps/admin` / `apps/api` AGENTS.
- Confirmed latest fresh verifier `PASS` is scoped to `MVP-02-employee-registration-001`; `MVP-02.04`, full `MVP-02` and human gates remain open.
- Inspected current repo surface for scope only:
  - `apps/api` has Spring Boot 3.3, Java 21, Maven Wrapper, PostgreSQL/Flyway, springdoc/OpenAPI and tenant/cohort/invite/registration model through `V004`;
  - `apps/admin` currently contains only `apps/admin/AGENTS.md`, with no Next.js app baseline or screenshotable UI.
- Frozen next sprint contract: `MVP-02-admin-code-status-view-001` for parent unit `MVP-02.04`.
- Scope decision: backend/admin API-only first, because combining the code-status data contract with admin app scaffolding would be too large for one verifiable slice.
- Required future builder evidence now covers a read-only admin endpoint for cohort/code status, Wave 1-scale 500-code tests, activation/registration funnel counts, pagination/filtering, OpenAPI/springdoc source, generated-client regeneration or explicit no-op, privacy/raw-code/PII scans, raw refs and fresh verification.
- Explicitly excluded `apps/admin` UI/scaffold, screenshots/browser evidence, admin mutations, auth/session/role/audit policy, HR reporting, diagnostics, points, rewards, merch, support, real data and full `MVP-02` closure.
- No production code, schemas, configs, generated client or UI were changed in this freeze.
- No implementation or fresh verification PASS is claimed. New `feature_list.json` entries for `MVP-02.04` remain `passes=false` until builder evidence and fresh verifier PASS exist.

## Current session: MVP-02-employee-registration-001 builder and evidence refresh

- Implemented the backend/API registration source slice for `POST /api/v1/employee-registrations` within the frozen `MVP-02-employee-registration-001` scope.
- Added append-only `V004__employee_registration.sql` after `V003`; prior migrations were not edited.
- Added `employee_registrations` persistence with tenant/cohort/invite links, unique invite registration, normalized contact fields and an opaque `activation_subject_ref`.
- Kept raw invite codes request-only: lookup uses the existing invite hash path and persistence stores invite IDs plus random opaque activation subject refs.
- Added a thin controller, DTOs, structured 400 error responses and springdoc/OpenAPI source annotations.
- Added `EmployeeRegistrationControllerIT` covering success, same-contact idempotent retry, invalid/malformed/not-found, expired, revoked, unissued, duplicate activated code, validation no-echo, rollback/no partial registration and OpenAPI endpoint/schema exposure.
- Installed/used Homebrew OpenJDK 21.0.11 for the current shell and recorded Java/Maven proof.
- Added a Testcontainers 1.21.4 Maven property because Docker 29 rejects the older Docker API versions used by the inherited Spring Boot dependency stack.
- Enabled the Corepack pnpm shim so `make build` can use the repo-pinned `pnpm@10.27.0`.
- Required builder checks now pass: `cd apps/api && ./mvnw -q test`, `cd apps/api && ./mvnw -q verify`, `make verify`, `make test-unit`, `make build` and `git diff --check`.
- Recorded generated-client no-op: `packages/api-client` still contains only `.gitkeep`, with no generator or generated artifacts to update.
- Recorded source migration/OpenAPI/guardrail scans and evidence with Mermaid flow diagram.
- Fresh `stage_verifier` recorded `PASS` for `MVP-02-employee-registration-001` after rerunning Java/Maven/root checks, migration inspection, OpenAPI/source-runtime inspection, generated-client no-op verification, privacy/scope scans and harness checks.
- Marked only `MVP-02.03` / `MVP-02-employee-registration-001` complete. `MVP-02.04`, full MVP-02 and human gates remain open.

## Current session: MVP-02-employee-registration-001 spec freeze

- Re-synced the required read set for an MVP `stage_spec_freezer`: repo AGENTS, stage harness skill/read matrix, architecture docs, DoD, human gates, product foundation, `docs/stages/MVP.md`, current MVP artifacts and relevant `apps/api` backend context.
- Reconciled current stage state: `MVP-02.01` and `MVP-02.02` remain prior PASS slices; `MVP-05-content-spec-ingestion-001` remains the latest verified docs-only slice; `MVP-02.03` was not implemented.
- Inspected the backend baseline for scope only: Spring Boot/Java/Maven Wrapper/PostgreSQL/Flyway exists with tenant/cohort/invite domain and `InviteCodeAccessService`; no REST controller, springdoc/OpenAPI dependency or generated API client currently exists.
- Frozen next sprint contract: `MVP-02-employee-registration-001` for parent unit `MVP-02.03`.
- Scope is backend/API registration by name, email, phone and invite code, built on existing invite activation core.
- Required future builder evidence now covers append-only Flyway migration, thin controller/service split, OpenAPI/springdoc source, generated-client regeneration or explicit no-op, tests, PII/raw invite-code guardrails, raw refs and fresh verification.
- Explicitly excluded admin UI, employee web UI, HR reporting, diagnostics, points, consent/legal docs, SSO, real data, rewards and full auth/session.
- No production code, schemas, configs, generated client or UI were changed in this freeze.
- No implementation or fresh verification PASS is claimed. New `feature_list.json` entries for `MVP-02.03` remain `passes=false` until builder evidence and fresh verifier PASS exist.

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
- fresh `stage_verifier` verdict `PASS` for `MVP-02-employee-registration-001`
- fresh `stage_verifier` verdict `PASS` for `MVP-02-admin-code-status-view-001`

Open:

- `MVP-02-admin-ui-status-view-001` has fresh verifier `PASS`.
- Full `MVP-02.04`, full `MVP-02` and MVP stage are not complete because explicit human-gated production statuses remain open.

## Previous summaries

- `MVP-01-bootstrap-001` remains previously verified with fresh verifier `PASS`.
- Earlier `MVP-02-tenant-domain-001` attempts were blocked by missing Java runtime and absent Maven Wrapper; those raw outputs remain as historical evidence, superseded by this session's Java/Maven proof.
