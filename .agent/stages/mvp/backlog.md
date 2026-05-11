# MVP backlog

Stage ID: `mvp`
Updated: 2026-05-09

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

## MVP-02. Corporate tenant, cohorts and invite access

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-02.01 | agent | PASS | Model tenant, cohorts/waves and invite codes. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/task-files/MVP-02-tenant-domain-001.md` |
| MVP-02.02 | agent | PASS | Implement invite code issuance, activation and one-user binding. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/task-files/MVP-02-invite-issuance-activation-001.md` |
| MVP-02.03 | agent | PASS | Implement employee registration by name/email/phone/code. | `.agent/stages/mvp/task-files/MVP-02-employee-registration-001.md`, `.agent/stages/mvp/verdicts/MVP-02-employee-registration-001.json` |
| MVP-02.04 | agent | BACKEND_API_PASS_UI_PENDING | Implement admin view for cohorts, code statuses and activation funnel. | `.agent/stages/mvp/verdicts/MVP-02-admin-code-status-view-001.json`; UI remains pending. |

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

## MVP-05. Pedagogy, diagnostics and content factory

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-05-content-spec-ingestion-001 | agent | PASS | Place Content MVP draft into canonical docs and harness as a draft-with-human-gates source. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/task-files/MVP-05-content-spec-ingestion-001.md` |
| MVP-05.01 | agent+human | PENDING | Freeze competency matrix for 7 steps. | Depends on human review and future MVP-05 sprint contract. |
| MVP-05.02 | agent+human | PENDING | Define diagnostic taxonomy, scoring dimensions and route rules. | Depends on human review and future MVP-05 sprint contract. |
| MVP-05.03 | agent | PENDING | Create lesson, quiz, explanation and practice-task templates. | Can use content spec as draft input after ingestion verification. |
| MVP-05.04 | agent+human | PENDING | Build question bank and content QA checklist. | Content approval remains human-gated. |
| MVP-05.05 | agent+human | PENDING | Define methodologist approve-flow and review statuses. | Review statuses are drafted; final process remains human-gated. |
