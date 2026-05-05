# MVP backlog

Stage ID: `mvp`  
Updated: 2026-05-04

## MVP-01. Product/stage foundation and repo baseline

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-01.01 | agent | PROVEN_BY_PRIOR_TASK | Зафиксировать product foundation location and source-of-truth order. | `.agent/tasks/product-foundation-b2b-mvp-doc-sync/evidence.md` |
| MVP-01.02 | agent | PROVEN_BY_PRIOR_TASK | Обновить stage docs, harness prompts and doc-sync rules for B2B-first MVP. | `.agent/tasks/product-foundation-b2b-mvp-doc-sync/evidence.md` |
| MVP-01.03 | agent | PASS | Зафиксировать repo layout and root commands for reproducible stage execution. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json` |
| MVP-01.04 | agent | PASS | Validate local bootstrap/self-check commands and record limitations. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json` |

## Next stages

MVP-01-bootstrap-001 has fresh verifier `PASS`. `MVP-02-tenant-domain-001` has fresh verifier `PASS` and closes only `MVP-02.01`.

`MVP-02-invite-issuance-activation-001` has fresh verifier `PASS` and closes only `MVP-02.02`. The next sprint should freeze `MVP-02.03` employee registration before implementation.

## MVP-02. Corporate tenant, cohorts and invite access

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-02.01 | agent | PASS | Model tenant, cohorts/waves and invite codes. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/task-files/MVP-02-tenant-domain-001.md` |
| MVP-02.02 | agent | PASS | Implement invite code issuance, activation and one-user binding. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/task-files/MVP-02-invite-issuance-activation-001.md` |
| MVP-02.03 | agent | PENDING | Implement employee registration by name/email/phone/code. | Depends on MVP-02.02. |
| MVP-02.04 | agent | PENDING | Implement admin view for cohorts, code statuses and activation funnel. | Depends on MVP-02.02 and API contract decisions. |

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
