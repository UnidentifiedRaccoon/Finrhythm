# MVP backlog

Stage ID: `mvp`
Updated: 2026-05-12

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

`MVP-04-mobile-learning-shell-001` has fresh verifier raw proof and parent-synced `PASS`. It proved the minimal mobile-first `apps/web` learning shell with direct `/learning` demo entry, `Новичок` N1-N7 synthetic metadata and one `N1` preview. It does not close onboarding/privacy/consent, diagnostics/routing, `MVP-04`, `MVP-06`, `MVP-07`, the MVP stage or any human gate.

`design-system-v0.1.md` is now available as a draft product-design style baseline for future MVP-04/MVP-06 UI work. It is an input artifact for UI implementation, design tokens, component QA, screen generation and visual consistency checks, not a completion claim for full `MVP-04` or any human gate.

`MVP-04-design-system-tokenization-001` has fresh verifier `PASS` for applying the draft design-system tokens to the existing `apps/web` employee learning shell and lesson renderer. Parent orchestrator accepted the scoped PASS for narrow `MVP-04.04` acceptance and synchronized root latest aliases on 2026-05-12. It does not close full `MVP-04`, full `MVP-06`, the MVP stage or any human gate.

`MVP-06-learning-renderer-fixture-001` has fresh verifier `PASS` for the fixture renderer only and remains immutable/discoverable. Full `MVP-06` remains open.

`MVP-06-learning-n2-fixture-001` has scoped fresh verifier `PASS` after the active sprint contract freeze. It adds one more synthetic N2 savings-challenge fixture, `/learning/lessons/N2` route coverage and a `/learning` link/CTA in the existing fixture renderer. Latest verified evidence remains `MVP-04-design-system-tokenization-001`; a separate parent alias-sync decision is still required before latest aliases can move.

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

## MVP-04. UX/UI foundation and neutral brand

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-04-mobile-learning-shell-001 | agent | PASS | Build the smallest mobile-first `apps/web` learning shell: direct dev/demo learning entry, `Новичок` track entry and one synthetic lesson preview with Russian neutral copy. | `.agent/stages/mvp/evidence/MVP-04-mobile-learning-shell-001.md`; `.agent/stages/mvp/evidence/MVP-04-mobile-learning-shell-001.json`; `.agent/stages/mvp/verdicts/MVP-04-mobile-learning-shell-001.json`; `.agent/stages/mvp/raw/mvp-04-mobile-learning-shell-001-screenshots-20260511/` |
| MVP-04-design-system-tokenization-001 | agent | PASS | Tokenize the current `apps/web` learning shell and lesson renderer against draft Calm Progress Fintech design-system tokens. | `.agent/stages/mvp/evidence/MVP-04-design-system-tokenization-001.md`; `.agent/stages/mvp/evidence/MVP-04-design-system-tokenization-001.json`; `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`; `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/` |
| MVP-04.04 | agent | PASS | Design tokens, current app shell/nav and common states are accepted for the scoped MVP-04 implementation surface after `MVP-04-mobile-learning-shell-001` and `MVP-04-design-system-tokenization-001`. | `.agent/stages/mvp/evidence/MVP-04-design-system-tokenization-001.md`; `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`; `.agent/stages/mvp/status.json` |
| MVP-04 | agent+human | OPEN | Full UX/UI foundation and neutral brand remain open; this slice only starts the employee learning surface. | Future builder evidence and human-gated brand/voice decisions required. Use `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` and `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png` as draft design inputs. |

### Frozen mobile learning shell slice

`MVP-04-mobile-learning-shell-001` is intentionally scoped to `apps/web` shell/app-surface readiness:

- create a minimal production-ready mobile-first employee shell for learning;
- allow direct dev/demo entry to learning while onboarding/privacy/consent and diagnostics/routing remain deferred;
- show a `Новичок` track entry and one lesson preview from synthetic fixtures only;
- use Russian, calm, neutral, anti-shame copy with no customer brand in employee UI;
- use `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` for tokens, component patterns and visual consistency when extending the UI;
- avoid real employee/customer/personal/financial data and avoid income, fast-gain or guaranteed-result promises;
- do not restore `cohort`, `cohortId` or `cohorts`;
- require component/unit tests plus browser/mobile screenshot evidence;
- do not close `MVP-03`, `MVP-04`, `MVP-06`, `MVP-07`, the MVP stage or human gates.

## MVP-05. Pedagogy, diagnostics and content factory

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-05-content-spec-ingestion-001 | agent | PASS | Place Content MVP draft into canonical docs and harness as a draft-with-human-gates source. | `.agent/stages/mvp/evidence.md`, `.agent/stages/mvp/task-files/MVP-05-content-spec-ingestion-001.md` |
| MVP-05.01 | agent+human | PENDING | Freeze competency matrix for 7 steps. | Depends on human review and future MVP-05 sprint contract. |
| MVP-05.02 | agent+human | PENDING | Define diagnostic taxonomy, scoring dimensions and route rules. | Depends on human review and future MVP-05 sprint contract. |
| MVP-05.03 | agent | PENDING | Create lesson, quiz, explanation and practice-task templates. | Can use content spec as draft input after ingestion verification. |
| MVP-05.04 | agent+human | PENDING | Build question bank and content QA checklist. | Content approval remains human-gated. |
| MVP-05.05 | agent+human | PENDING | Define methodologist approve-flow and review statuses. | Review statuses are drafted; final process remains human-gated. |

## MVP-06. Learning delivery and CMS/admin

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-06-learning-renderer-fixture-001 | agent | PASS | Build a tiny mobile-first `apps/web` fixture-backed renderer for one synthetic `N1` lesson, reachable from the verified learning shell. | `.agent/stages/mvp/evidence/MVP-06-learning-renderer-fixture-001.md`; `.agent/stages/mvp/evidence/MVP-06-learning-renderer-fixture-001.json`; `.agent/stages/mvp/verdicts/MVP-06-learning-renderer-fixture-001.json`; `.agent/stages/mvp/raw/mvp-06-learning-renderer-fixture-001-screenshots-20260511/` |
| MVP-06-learning-n2-fixture-001 | agent | PASS_PENDING_PARENT_ALIAS_SYNC | Add one additional synthetic `N2` savings-challenge lesson fixture to the existing `apps/web` fixture-backed renderer and link it from `/learning`. | `.agent/stages/mvp/evidence/MVP-06-learning-n2-fixture-001.md`; `.agent/stages/mvp/evidence/MVP-06-learning-n2-fixture-001.json`; `.agent/stages/mvp/verdicts/MVP-06-learning-n2-fixture-001.json`; `.agent/stages/mvp/problems/MVP-06-learning-n2-fixture-001.md`; `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/` |
| MVP-06 | agent | OPEN | Full learning delivery, CMS/admin, content states, publish validation, progress tracking and analytics hooks remain open. | Future builder evidence and human-gated content approvals required. |

### Frozen fixture-backed renderer slice

`MVP-06-learning-renderer-fixture-001` is intentionally scoped to a renderer proof, not a CMS or production-content implementation:

- render one synthetic `N1` lesson from a typed local fixture contract aligned to the content spec draft;
- keep `apps/web` mobile-first and reachable from the existing `/learning` demo entry;
- use `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` as the design/style input for renderer layout, tokens, states and visual QA;
- cover the lesson sections: situation, why, rule, example, mini-test, practice and reward;
- include office and store/shift example variants;
- keep mini-test and practice local/non-persistent, with no scored submission, no progress claim and no points claim;
- use Russian neutral anti-shame copy with no customer brand in employee UI;
- avoid real employee/customer/personal/financial data, exact personal sums, photos, documents and bank screenshots;
- do not restore `cohort`, `cohortId` or `cohorts`;
- require component/unit tests plus browser/mobile screenshot evidence;
- do not close `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, the MVP stage or human gates.
- fresh verifier returned `PASS` for this sprint only. Full `MVP-06`, MVP stage and human gates remain open.

### Verified N2 fixture extension slice

`MVP-06-learning-n2-fixture-001` is intentionally scoped to a second synthetic fixture for the existing renderer:

- add synthetic `N2_SAVINGS_CHALLENGE_START` content for the 6-week savings challenge start;
- provide direct route coverage for `N2`, expected as `/learning/lessons/N2`;
- link `/learning` to the N2 lesson with a visible CTA while preserving N1;
- include office and store/shift examples;
- keep the mini-test display-only and practice non-persistent/category-only;
- require amber/warning-soft reward guardrails and no money/cash-equivalence/guaranteed-result claims;
- avoid exact personal sums, photos, documents and bank screenshots;
- exclude CMS/admin publishing, progress persistence, scored quiz submission, practice submission, points/wallet, diagnostics/routing, onboarding/consent, backend/API/schema/OpenAPI/generated-client and `packages/ui`;
- do not close full `MVP-04`, full `MVP-06`, the MVP stage or human gates.
- fresh scoped verifier returned `PASS` for this sprint only. Parent latest-alias sync remains pending as a separate decision.
