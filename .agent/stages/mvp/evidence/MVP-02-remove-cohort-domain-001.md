# Evidence: MVP-02-remove-cohort-domain-001

Status: `PASS`
Updated: 2026-05-11

Latest evidence alias for the verified current refactor implementation. Immutable refs:

- `.agent/stages/mvp/evidence/MVP-02-remove-cohort-domain-001.md`
- `.agent/stages/mvp/evidence/MVP-02-remove-cohort-domain-001.json`

This evidence covers only the frozen refactor contract `MVP-02-remove-cohort-domain-001`. It does not close full `MVP-02`, the MVP stage or any human gate.

## Fixer Update: DOC-SYNC-001

Fresh verifier reported one blocking docs-sync gap: current `AGENTS.md`, `README.md` and `docs/setup/codex-setup.md` still exposed old access-model wording or the old admin live-mode env var. The fixer changed only those setup/canonical doc lines:

- `AGENTS.md` now describes the MVP contour as `tenant` + pilot launch + access pool of invite codes.
- `README.md` now documents `FINRHYTHM_ADMIN_SYNTHETIC_PILOT_LAUNCH_ID` and `FINRHYTHM_ADMIN_SYNTHETIC_ACCESS_POOL_ID` for admin live mode.
- `README.md` now names backend schema verification for the tenant/pilot-launch/access-pool/invite model.
- `docs/setup/codex-setup.md` now documents the same pilot-launch/access-pool admin live-mode env vars.

No production code, broader docs, feature list or human-gate state was changed by this fixer. A new fresh verifier then returned `PASS`.

## Fresh Verifier PASS

Fresh post-fixer verifier recorded `PASS` for `MVP-02-remove-cohort-domain-001` only:

- active production/admin/test code has no current old-domain term hits;
- no hidden old admin path remains;
- canonical/setup docs scan is clean after the fixer;
- V005 is append-only and uses old names only for backfill/drop transition;
- root `make verify`, `make test-unit`, `make build` and `git diff --check` pass;
- full `MVP-02`, the MVP stage and all human gates remain open.

## Implementation Summary

- Replaced the active MVP access model with `tenant` + `pilotLaunch` + `accessPool`.
- Added append-only Flyway migration `V005__pilot_launch_access_pool_model.sql`.
- Removed active Java `Cohort`, `CohortKind`, `CohortStatus` and `CohortRepository` classes.
- Added `PilotLaunch`, `PilotLaunchStatus`, `AccessPool`, `AccessPoolStatus` and repositories.
- Updated invite issuance/activation, employee registration, admin status read model, API path, OpenAPI annotations and tests to use `pilotLaunchId` and `accessPoolId`.
- Updated `apps/admin` DTO/client/fixture/copy/tests/browser smoke to the access-pool status model with Russian operator copy.
- Updated canonical docs that own current/future domain wording: MVP stage, v1 stage, product foundation, learning methodology, content spec, source-of-truth, access docs, repo layout, init/dev contract and engineering guardrails.

## Runtime Contract

| Surface | Builder result |
|---|---|
| DB final schema | `pilot_launches` and `access_pools`; `invite_codes.access_pool_id`; `employee_registrations.pilot_launch_id` and `employee_registrations.access_pool_id`; final schema drops legacy table/columns after backfill. |
| Backend domain | Active code uses `PilotLaunch` and `AccessPool` entities/repositories; removed active legacy domain classes. |
| Registration API | Response returns `tenantId`, `pilotLaunchId`, `accessPoolId`, `registrationId`, `registeredAt`. |
| Admin status API | `GET /api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status`. |
| Admin UI | Russian operator view says `Статус кодов пула доступа`, `ID запуска`, `Пул доступа`; fixture and live env vars use pilot-launch/access-pool names. |
| Generated client | Explicit no-op: `packages/api-client` still contains only `.gitkeep`; no generator/artifacts exist. |

## Privacy And Guardrails

- Admin status responses still do not expose raw invite-code values, lookup hashes, activation subject refs or employee full name/email/phone.
- Employee contact fields remain request/registration persistence scope only and are not surfaced in admin status rows.
- Browser smoke checks rendered HTML for forbidden raw-code/PII/customer-brand tokens.
- No real employee/customer data was added to fixtures, tests or evidence.
- Admin auth/role/audit policy, production real-data use, customer-specific reporting boundaries, legal/privacy/consent approval, financial correctness, rewards and fulfillment remain human-gated.

## Remaining Term Classification

The focused term scan is intentionally classified rather than forced to zero because the contract ID and immutable history contain the removed term by design.

| Remaining match class | Status | Notes |
|---|---:|---|
| Active production Java/API/admin UI code | PASS | Current `apps/api/src/main/java`, `apps/api/src/test/java` and `apps/admin` use `pilotLaunch` / `accessPool` for the MVP access/status contract. |
| Canonical/setup docs | PASS_AFTER_FIXER | Current setup/canonical docs, including `AGENTS.md`, `README.md` and `docs/setup/codex-setup.md`, are synchronized to pilot launch / access pool wording. |
| Historical migrations | ALLOWED_HISTORY | `V002` and `V004` are immutable migration history. |
| Transition migration | ALLOWED_TEMPORARY_DETAIL | `V005` references old table/column names only to backfill and then drop them; runtime exposure is none. |
| Prior stage/task/verdict/evidence/raw artifacts | ALLOWED_HISTORY | Earlier sprint evidence records the pre-refactor contracts and remains immutable history. |
| Current contract/task/stage spec | ALLOWED_CONTRACT_TEXT | The contract name and removal task text mention the removed term because this is the explicit cleanup contract. |

## Raw Refs

- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-api-focused-tests-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-api-mvn-verify-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-make-verify-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-make-test-unit-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-make-build-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-admin-typecheck-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-admin-test-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-admin-build-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-browser-smoke-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-screenshot-refs-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-generated-client-noop-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-openapi-contract-inspection-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-migration-inspection-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-guardrail-scan-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-term-scan-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-json-validation-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-git-diff-check-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-verify-harness-20260511.json`
- `.agent/stages/mvp/raw/stage-fixer-mvp-02-remove-cohort-domain-001-doc-sync-scan-20260511.txt`
- `.agent/stages/mvp/raw/stage-fixer-mvp-02-remove-cohort-domain-001-json-validation-20260511.txt`
- `.agent/stages/mvp/raw/stage-fixer-mvp-02-remove-cohort-domain-001-git-diff-check-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-verify-harness-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-verify-harness-post-verdict-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-make-verify-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-make-test-unit-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-make-build-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-term-scan-active-code-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-term-scan-canonical-docs-20260511.txt`
- `.agent/stages/mvp/raw/stage-verifier-mvp-02-remove-cohort-domain-001-post-fixer-route-openapi-client-scan-clean-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-verify-harness-final-20260511.json`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-json-validation-final-20260511.txt`
- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-git-diff-check-final-20260511.txt`

Screenshot files are under:

- `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-screenshots-20260511/`

## Checks

| Check | Status | Raw ref |
|---|---:|---|
| Focused backend tests | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-api-focused-tests-20260511.txt` |
| `cd apps/api && ./mvnw -q verify` | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-api-mvn-verify-20260511.txt` |
| `make verify` with Homebrew JDK 21 | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-make-verify-20260511.txt` |
| `make test-unit` with Homebrew JDK 21 | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-make-test-unit-20260511.txt` |
| `make build` with Homebrew JDK 21 | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-make-build-20260511.txt` |
| Admin typecheck/test/build | PASS | admin raw refs above |
| Browser smoke / screenshots | PASS | browser smoke raw ref and screenshot refs above |
| Generated client | PASS_NOOP | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-generated-client-noop-20260511.txt` |
| OpenAPI/source inspection | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-openapi-contract-inspection-20260511.txt` |
| Migration/final-schema inspection | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-migration-inspection-20260511.txt` |
| PII/raw-code guardrail scan | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-guardrail-scan-20260511.txt` |
| Focused term scan with classification | PASS_WITH_ALLOWED_HISTORY | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-term-scan-20260511.txt` |
| JSON validation for changed machine artifacts | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-json-validation-20260511.txt` |
| `git diff --check` | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-git-diff-check-20260511.txt` |
| Fixer canonical/setup docs term scan | PASS_NO_CURRENT_DOC_HITS | `.agent/stages/mvp/raw/stage-fixer-mvp-02-remove-cohort-domain-001-doc-sync-scan-20260511.txt` |
| Fixer JSON validation for touched machine aliases | PASS | `.agent/stages/mvp/raw/stage-fixer-mvp-02-remove-cohort-domain-001-json-validation-20260511.txt` |
| Fixer `git diff --check` | PASS | `.agent/stages/mvp/raw/stage-fixer-mvp-02-remove-cohort-domain-001-git-diff-check-20260511.txt` |
| Fresh verifier | PASS | `.agent/stages/mvp/verdicts/MVP-02-remove-cohort-domain-001.json` |
| `verify_harness.py --stage-id mvp` | PASS_AFTER_PARENT_ALIAS_SYNC | `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-verify-harness-final-20260511.json` |

## Acceptance Status

1. Active API/backend/admin old terminology removed: `PASS`.
2. Final Flyway schema migrates away from old table/columns: `PASS`.
3. Invite issuance/activation behavior preserved for 500-code access pool: `PASS`.
4. Employee registration returns replacement identifiers: `PASS`.
5. Admin code-status/funnel view uses replacement path/DTO/Russian copy: `PASS`.
6. OpenAPI/generated-client notes synchronized: `PASS_NOOP`.
7. Canonical docs and stage artifacts synchronized: `PASS_AFTER_FIXER`.
8. Remaining term matches classified: `PASS_AFTER_FIXER_WITH_ALLOWED_HISTORY`.
9. Human gates remain open: `PASS`.
10. Full `MVP-02` remains open: `PASS`.

## Handoff

Fresh verifier PASS is accepted for `MVP-02-remove-cohort-domain-001`. Do not mark full `MVP-02`, the MVP stage or any human gate complete from this refactor sprint.
