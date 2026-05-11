# MVP backlog

Stage ID: `mvp`
Updated: 2026-05-11

## MVP-01. Product/stage foundation and repo baseline

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-01.01 | agent | PROVEN_BY_PRIOR_TASK | Зафиксировать product foundation location and source-of-truth order. | `.agent/tasks/product-foundation-b2b-mvp-doc-sync/evidence.md` |
| MVP-01.02 | agent | PROVEN_BY_PRIOR_TASK | Обновить stage docs, harness prompts and doc-sync rules for B2B-first MVP. | `.agent/tasks/product-foundation-b2b-mvp-doc-sync/evidence.md` |
| MVP-01.03 | agent | PASS | Зафиксировать repo layout and root commands for reproducible stage execution. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json` |
| MVP-01.04 | agent | PASS | Validate local bootstrap/self-check commands and record limitations. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json` |

## Next stages

MVP-01-bootstrap-001 has fresh verifier `PASS`. `MVP-02-tenant-domain-001` has fresh verifier `PASS` and closes only `MVP-02.01`.

`MVP-02-invite-issuance-activation-001` has fresh verifier `PASS` and closes only `MVP-02.02`.

`MVP-05-content-spec-ingestion-001` is a doc-only interruption to place the prepared Content MVP draft into canonical docs and harness artifacts. It does not close `MVP-05.01` through `MVP-05.05`.

`MVP-02-employee-registration-001` has fresh verifier `PASS` and closes only `MVP-02.03`.

`MVP-02-admin-code-status-view-001` has fresh verifier `PASS` for the backend/admin API-only slice. It does not implement `apps/admin` UI and does not close full `MVP-02.04` or full `MVP-02`.

`MVP-02-admin-ui-status-view-001` has fresh verifier `PASS` for the minimal `apps/admin` Next.js scaffold and read-only code-status view.

`MVP-02-04-closure-audit-001` has fresh verifier `PASS` and records the explicit `MVP-02.04` closure decision: `DONE_WITH_HUMAN_PENDING` for the technical admin cohort/code status view scope, with human gates, full `MVP-02` and the MVP stage still open.

`MVP-02-remove-cohort-domain-001` has fresh verifier `PASS`: active code/API/admin UI/docs now use the tenant/pilot-launch/access-pool model. It does not close full `MVP-02`, and keeps all human gates open.

`MVP-02-closure-audit-001` has fresh verifier `PASS` and records full `MVP-02` as `DONE_WITH_HUMAN_PENDING`. The MVP stage remains open and all human gates remain non-DONE.

## MVP-02. Corporate tenant and invite access

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-02.01 | agent | PASS | Model tenant, legacy cohorts/waves and invite codes under the previous contract. Superseded by `MVP-02-remove-cohort-domain-001`. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/task-files/MVP-02-tenant-domain-001.md` |
| MVP-02.02 | agent | PASS | Implement invite code issuance, activation and one-user binding. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/task-files/MVP-02-invite-issuance-activation-001.md` |
| MVP-02.03 | agent | PASS | Implement employee registration by name/email/phone/code. | `.agent/stages/mvp/task-files/MVP-02-employee-registration-001.md`, `.agent/stages/mvp/verdicts/MVP-02-employee-registration-001.json` |
| MVP-02.04 | agent+human | DONE_WITH_HUMAN_PENDING | Implement admin view for legacy cohort/code statuses and activation funnel under the previous contract. Superseded by `MVP-02-remove-cohort-domain-001`. | `.agent/stages/mvp/verdicts/MVP-02-admin-code-status-view-001.json`; `.agent/stages/mvp/verdicts/MVP-02-admin-ui-status-view-001.json`; `.agent/stages/mvp/verdicts/MVP-02-04-closure-audit-001.json`; human-gated production policy/statuses remain open and full `MVP-02` is not closed. |
| MVP-02-remove-cohort-domain-001 | agent | PASS | Remove `cohort`/`wave` from the MVP domain and replace the old model with one tenant pilot launch / access pool contract. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/evidence/MVP-02-remove-cohort-domain-001.json`, `.agent/stages/mvp/verdicts/MVP-02-remove-cohort-domain-001.json`, `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-api-focused-tests-20260511.txt`, `.agent/stages/mvp/raw/orchestrator-mvp-02-remove-cohort-domain-001-browser-smoke-20260511.txt`. |
| MVP-02-closure-audit-001 | agent | PASS | Closure/audit-only decision for full `MVP-02` after the verified access-model refactor; full `MVP-02` is `DONE_WITH_HUMAN_PENDING`, human gates and MVP stage remain open. | `.agent/stages/mvp/evidence/MVP-02-closure-audit-001.md`; `.agent/stages/mvp/evidence/MVP-02-closure-audit-001.json`; `.agent/stages/mvp/verdicts/MVP-02-closure-audit-001.json`; `.agent/stages/mvp/status.json`. |

### Completed first slice

`MVP-02-tenant-domain-001` is intentionally narrower than the full `MVP-02.01` through `MVP-02.04` sequence:

- bootstrap only the minimal backend runtime needed for domain/schema proof;
- model tenant, cohort/wave and invite code persistence;
- prove constraints and domain invariants after Java/Maven is available;
- do not implement registration, activation endpoint, admin UI or 500-code generation.

### Completed second slice

`MVP-02-invite-issuance-activation-001` was intentionally scoped to backend service/domain issuance and activation core:

- issue invite-code batches for existing tenant/cohort records, including Wave 1 size proof;
- activate an issued code once and bind it to an opaque non-PII subject identifier;
- prove idempotent same-subject retry and rejection for different-subject duplicate activation;
- preserve no-raw-code persistence guardrails;
- do not implement employee registration/contact fields, REST/OpenAPI/controller surface, admin UI or HR reporting.

### Completed third slice

`MVP-02-employee-registration-001` was intentionally scoped to backend/API employee registration:

- expose one public registration endpoint for name, email, phone and invite code;
- add minimal employee-registration persistence through an append-only Flyway migration after `V003`;
- use the existing invite activation core for one-time activation and idempotent same-registration retry;
- add OpenAPI/springdoc source and generated-client notes or an explicit no-op if no generator exists;
- prove tests, migration inspection, API contract evidence and PII/raw-code guardrails before PASS;
- do not implement admin UI, employee UI, HR reporting, diagnostics, points, consent/legal docs, SSO, real data or full auth/session.

### Completed fourth backend/API slice

`MVP-02-admin-code-status-view-001` is intentionally scoped to the backend/admin API data contract for a future admin status view:

- expose a read-only admin endpoint for one tenant/cohort code-status and activation/registration funnel data;
- return cohort metadata, status counts, Wave 1-scale pagination and privacy-safe per-code operational rows;
- prove 500 synthetic invite-code rows and mixed issued/activated/registered states through backend tests;
- preserve OpenAPI/generated-client notes and no-real-data/PII/raw-code guardrails;
- do not implement `apps/admin` UI/scaffold, admin mutations, auth/session, HR reporting, exports, diagnostics, points, rewards, support, real data or full MVP-02 closure.
- fresh `stage_verifier` returned `PASS` for this backend/API slice only; `apps/admin` UI/status view remains a separate future slice.

### Completed fifth admin UI slice

`MVP-02-admin-ui-status-view-001` is intentionally scoped to the minimal `apps/admin` UI proof for the already verified backend status DTO:

- scaffold only the smallest Next.js admin app needed to render one read-only operator route;
- use the proven backend DTO for `GET /api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`;
- allow a typed local DTO/fetch boundary and synthetic fixture because `packages/api-client` has no generator/artifacts;
- require Russian operator copy, loading/error/empty/success states, browser smoke and desktop/mobile screenshots;
- root/admin package verification, PII/raw-code scan, generated-client no-op, desktop/mobile screenshots and browser smoke are recorded in builder evidence;
- fresh verifier initially found two proof gaps: raw `PLANNED` rendered in operator UI and trailing whitespace breaking `git diff --check`;
- one fixer pass added Russian cohort status labels, refreshed checks/evidence and proved current rendered production HTML contains `500 · Запланирована` with no `PLANNED` token;
- fresh post-fix verifier returned `PASS` for this sprint only;
- do not change backend/API/schema, implement generated client, add admin auth/roles/audit policy, expose PII/raw invite codes, add mutations or close full `MVP-02.04` / `MVP-02` before evidence.

### Completed closure/audit decision

`MVP-02-04-closure-audit-001` is intentionally scoped to a status decision for `MVP-02.04` after the verified backend/API and admin UI/status view slices:

- reconciled the two prior PASS verdicts against `MVP-02.04`;
- found no remaining non-human proof gap for the `MVP-02.04` technical scope;
- recorded `MVP-02.04` as `DONE_WITH_HUMAN_PENDING`;
- keep full `MVP-02`, the MVP stage and all human gates open;
- did not edit production code, schemas, API contracts, generated clients, prior raw evidence or canonical docs in this closure/audit slice;
- fresh verifier returned `PASS` for this closure/audit decision only.

### Verified cohort-domain removal refactor

`MVP-02-remove-cohort-domain-001` is intentionally scoped to the refactor after the product decision that MVP has no first-class `cohort` domain:

- target product model is one corporate pilot `tenant` with one pilot launch / access pool of invite codes;
- append-only `V005` creates `pilot_launches` and `access_pools`, backfills prior dev rows, moves invite/registration runtime references, then drops the old active table/columns;
- active Java domain/API/admin UI code uses `PilotLaunch` / `AccessPool`, `pilotLaunchId` / `accessPoolId`, and `/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status`;
- admin UI copy says `Статус кодов пула доступа`, `ID запуска`, `Пул доступа` and has refreshed browser screenshots;
- existing proven behavior is preserved by tests: 500-code pilot access pool, one-time activation, employee registration by name/email/phone/code and privacy-safe admin code-status/funnel view;
- generated client remains explicit no-op because `packages/api-client` has no generator/artifacts;
- full `MVP-02`, the MVP stage and all human gates remain open until a separate closure contract and fresh verification.
- one fixer pass corrected the verifier-reported setup-doc drift in `AGENTS.md`, `README.md` and `docs/setup/codex-setup.md`;
- fresh post-fixer verifier returned `PASS` for this sprint only.

### Full MVP-02 closure audit decision

`MVP-02-closure-audit-001` is intentionally scoped to a status decision for full `MVP-02` after the verified access-model refactor:

- reconciled `MVP-02.01`, `MVP-02.02`, `MVP-02.03`, `MVP-02.04` and the latest verified refactor against full `MVP-02` acceptance criteria;
- found no concrete non-human proof gap after `MVP-02-remove-cohort-domain-001` PASS;
- recorded full `MVP-02` as `DONE_WITH_HUMAN_PENDING`, not unconditional `DONE`;
- kept the MVP stage and all human gates open;
- do not edit production code, schemas, API contracts, generated clients, UI, canonical docs, raw evidence or prior immutable proof refs;
- fresh verifier returned `PASS` for this closure/audit task only.

## MVP-05. Pedagogy, diagnostics and content factory

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-05-content-spec-ingestion-001 | agent | PASS | Place Content MVP draft into canonical docs and harness as a draft-with-human-gates source. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/task-files/MVP-05-content-spec-ingestion-001.md` |
| MVP-05.01 | agent+human | PENDING | Freeze competency matrix for 7 steps. | Depends on human review and future MVP-05 sprint contract. |
| MVP-05.02 | agent+human | PENDING | Define diagnostic taxonomy, scoring dimensions and route rules. | Depends on human review and future MVP-05 sprint contract. |
| MVP-05.03 | agent | PENDING | Create lesson, quiz, explanation and practice-task templates. | Can use content spec as draft input after ingestion verification. |
| MVP-05.04 | agent+human | PENDING | Build question bank and content QA checklist. | Content approval remains human-gated. |
| MVP-05.05 | agent+human | PENDING | Define methodologist approve-flow and review statuses. | Review statuses are drafted; final process remains human-gated. |
