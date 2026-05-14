# MVP backlog

Stage ID: `mvp`
Updated: 2026-05-14

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

`MVP-06-learning-n2-fixture-001` has scoped fresh verifier `PASS` and parent-synced latest aliases after the active sprint contract freeze. It adds one more synthetic N2 savings-challenge fixture, `/learning/lessons/N2` route coverage and a `/learning` link/CTA in the existing fixture renderer. Full `MVP-06`, the MVP stage and human gates remain open.

`MVP-06-learning-n3-fixture-001` has scoped fresh verifier `PASS` and parent-synced latest status. It is renderer/fixture-only: one synthetic N3 decluttering/safe-sale fixture, route `/learning/lessons/N3`, existing full lesson-id alias, visible `/learning` CTA and smoke evidence while preserving N1/N2. Full `MVP-06`, the MVP stage and human gates remain open.

`MVP-03-onboarding-privacy-screen-001` has scoped fresh verifier `PASS` and parent-synced latest aliases for parent unit `MVP-03.02`. It adds the smallest employee-facing `/onboarding/privacy` route explaining HR/employer visibility before future diagnostics, and explicitly does not implement consent version logging.

`MVP-03-consent-version-logging-001` now has scoped fresh verifier `PASS` for parent unit `MVP-03.03`. It adds backend/API/Flyway/OpenAPI/generated-client consent version logging, while final legal approval, auth/session and full `MVP-03` remain open.

`MVP-03-admin-sensitive-access-audit-001` now has scoped fresh verifier `PASS` for parent unit `MVP-03.05`. It is backend-only: append-only audit logging for the existing protected admin code-status access path and default-denied admin attempts. It does not implement `MVP-03.04`, admin RBAC/users/sessions, admin UI audit views, real-data production policy or full `MVP-03`.

`MVP-03-profile-contact-summary-001` now has scoped fresh verifier `PASS` for parent unit `MVP-03.04`. It is backend/API-only and read-only: support-ready profile/contact summary lookup for an existing registration by raw invite code plus matching normalized contact fields. It explicitly does not implement contact update, employee auth/session, profile UI, support tickets, HR reporting, real-data processing or full `MVP-03`.

`MVP-03-employee-profile-session-001` now has scoped fresh verifier `PASS` for parent unit `MVP-03.04`. It is the backend/API prerequisite for later safe contact update: create a short-lived profile session only after the existing invite+contact proof and allow read-only authenticated `me/profile-summary`. It explicitly does not implement contact update, employee UI, support tickets, HR reporting, real-data processing or full `MVP-03`.

`MVP-03-profile-contact-update-001` now has scoped fresh verifier `PASS` for parent unit `MVP-03.04`. It adds backend/API-only `PATCH /api/v1/employee-registrations/me/contact`, profile-session scoped email/phone update, V010 append-only privacy-safe audit storage and docs/OpenAPI/generated-client sync. It explicitly does not implement `fullName` update, employee UI, support tickets, HR reporting, real-data processing or full `MVP-03`.

`MVP-03-closure-audit-001` is frozen as an artifact-only closure/status audit for full `MVP-03`. It must reconcile existing immutable MVP-03 PASS refs and current human gates, then either record full `MVP-03` as `DONE_WITH_HUMAN_PENDING` if no concrete non-human proof gap remains, or keep full `MVP-03` `OPEN` and name the next smallest gap-fix contract. It must not close human gates, close the MVP stage, add product code or move evidence/verdict aliases before evidence and fresh verification.

`MVP-03-legal-drafts-001` has fresh verifier `PASS` for the four tracked draft legal artifacts, keeps legal approval `WAITING_HUMAN`, and does not close full `MVP-03`, the MVP stage or any human gate.

`MVP-03-employee-contact-update-ui-001` now has scoped fresh verifier `PASS` for parent unit `MVP-03.04`: a minimal mobile-first `apps/web` profile/contact screen using the already verified profile-session contact update API. It is local/browser-smoke token-handoff only because no production web profile-session handoff exists yet.

`MVP-03-employee-profile-session-entry-ui-001` is frozen as the next functional `MVP-03.04` slice. It must add the production employee-facing `apps/web` entry flow that creates a profile session from invite code + full name + email + phone and connects the returned token to contact update in component memory only. It is not implemented and has no PASS evidence yet.

`MVP-07-diagnostic-entry-preview-ui-001` is frozen as the next functional `apps/web` UI-only prerequisite for `MVP-07.01` and `MVP-07.03`. It must add a `/diagnostics` preview flow with Q0 privacy, non-scoring `SA1-SA3`, several synthetic methodology question cards and a safe draft route preview. It must not implement full diagnostic scoring/routing, persistence, backend/API/schema/generated-client changes or close full `MVP-07`.


`MVP-07-diagnostic-n1-learning-progress-001` has scoped fresh verifier `PASS`. It adds backend-owned N1 start/resume progress after safe diagnostic handoff, generated api-client sync and mounted web N1 continuation. It does not close full MVP-06, MVP-07, MVP or any human gate.

`MVP-07-n1-route-progress-summary-001` has scoped fresh verifier `PASS`. It adds a read-only profile-session authenticated N1 route/progress summary, generated api-client helper and mounted web panel before/after N1 start/resume, with token kept only in component memory. It does not create progress from reads, implement final scoring/routing, completion, points, rewards, HR reports, analytics/events or close human gates.

`MVP-07-n1-lesson-detail-continuation-001` has scoped fresh verifier `PASS`. It adds a read-only backend-owned N1 lesson detail/continuation endpoint and generated-client mounted web integration after route-progress and N1 start/resume. It keeps the token memory-only and does not implement completion, quiz/practice submission, points, rewards, final scoring/routing, HR reports, analytics/events, `N2+`, customer brand, exact sensitive data, advice, full MVP-06/MVP-07/MVP or any human-gate closure.

`MVP-07-n1-readonly-resume-continuation-001` is frozen as the next functional slice after `MVP-07-n1-lesson-detail-continuation-001` PASS. It must make the mounted `/profile/session` reopen path render backend-owned N1 continuation from existing `GET route-progress` + `GET lesson detail` when route-progress already says `N1 STARTED` / `RESUME_N1`, without calling `POST /learning/me/lessons/N1/start` again. It must keep the token memory-only and must not implement schema/API changes, completion, theory completion, quiz/practice submission, points, rewards, final scoring/routing, HR reports, analytics/events, `N2+`, customer brand, exact sensitive data, advice, full MVP-06/MVP-07/MVP or any human-gate closure.

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

## MVP-03. Trust, legal consent and profile base

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-03.01 | agent+human | DONE_WITH_HUMAN_PENDING | Draft privacy, terms, consent and financial disclaimer documents. | `MVP-03-legal-drafts-001` created the four tracked draft legal artifacts under `docs/legal/mvp/drafts/` and has fresh verifier `PASS`. Human legal approval remains `WAITING_HUMAN`; this does not close full `MVP-03`. |
| MVP-03.02 | agent | SCOPED_PASS | Implement onboarding and privacy screen. | Narrow `/onboarding/privacy` screen has scoped PASS via `MVP-03-onboarding-privacy-screen-001`; full MVP-03 remains open. |
| MVP-03-onboarding-privacy-screen-001 | agent | PASS | Add the smallest employee-facing `apps/web` privacy route, preferred `/onboarding/privacy`, explaining what HR/employer sees and does not see before future diagnostics. | `.agent/stages/mvp/evidence/MVP-03-onboarding-privacy-screen-001.md`; `.agent/stages/mvp/evidence/MVP-03-onboarding-privacy-screen-001.json`; `.agent/stages/mvp/verdicts/MVP-03-onboarding-privacy-screen-001.json`; `.agent/stages/mvp/problems/MVP-03-onboarding-privacy-screen-001.md`. |
| MVP-03.03 | agent | SCOPED_PASS | Implement consent version logging. | Scoped PASS via `MVP-03-consent-version-logging-001`; full MVP-03 remains open. |
| MVP-03-consent-version-logging-001 | agent | PASS | Add append-only draft legal/consent document version acceptance logging for an existing employee registration, with idempotent same-version retry and safe rejection of unsupported inputs. | `.agent/stages/mvp/evidence/MVP-03-consent-version-logging-001.md`; `.agent/stages/mvp/evidence/MVP-03-consent-version-logging-001.json`; `.agent/stages/mvp/verdicts/MVP-03-consent-version-logging-001.json`; `.agent/stages/mvp/problems/MVP-03-consent-version-logging-001.md`. |
| MVP-03.04 | agent | SCOPED_PASS | Implement profile, contact update and support-ready identity basics. | Profile summary, profile-session, backend/API contact update, employee contact UI, profile-session entry UI, onboarding-to-profile-session continuity, start route and profile-session legal acceptance UI have scoped PASS. Production login/password setup, support tickets, HR reporting and real-data processing remain out of scope. |
| MVP-03-profile-contact-summary-001 | agent | PASS | Add backend/API read-only support-ready profile/contact summary lookup requiring invite code plus matching normalized contact. | `.agent/stages/mvp/evidence/MVP-03-profile-contact-summary-001.md`; `.agent/stages/mvp/evidence/MVP-03-profile-contact-summary-001.json`; `.agent/stages/mvp/verdicts/MVP-03-profile-contact-summary-001.json`; `.agent/stages/mvp/problems/MVP-03-profile-contact-summary-001.md`. |
| MVP-03-employee-profile-session-001 | agent | PASS | Add backend/API short-lived employee profile session after invite+contact proof and read-only authenticated `me/profile-summary`. | `.agent/stages/mvp/evidence/MVP-03-employee-profile-session-001.md`; `.agent/stages/mvp/evidence/MVP-03-employee-profile-session-001.json`; `.agent/stages/mvp/verdicts/MVP-03-employee-profile-session-001.json`; `.agent/stages/mvp/problems/MVP-03-employee-profile-session-001.md`. |
| MVP-03-profile-contact-update-001 | agent | PASS | Add backend/API profile-session scoped update for registration `email` and `phone` with append-only privacy-safe audit. | `.agent/stages/mvp/evidence/MVP-03-profile-contact-update-001.md`; `.agent/stages/mvp/evidence/MVP-03-profile-contact-update-001.json`; `.agent/stages/mvp/verdicts/MVP-03-profile-contact-update-001.json`; `.agent/stages/mvp/problems/MVP-03-profile-contact-update-001.md`. |
| MVP-03-employee-contact-update-ui-001 | agent | PASS | Add minimal employee-facing mobile-first `apps/web` profile/contact UI over the verified profile-session contact update API. | `.agent/stages/mvp/evidence/MVP-03-employee-contact-update-ui-001.md`; `.agent/stages/mvp/evidence/MVP-03-employee-contact-update-ui-001.json`; `.agent/stages/mvp/verdicts/MVP-03-employee-contact-update-ui-001.json`; `.agent/stages/mvp/problems/MVP-03-employee-contact-update-ui-001.md`. |
| MVP-03-employee-profile-session-entry-ui-001 | agent | PASS | Add production employee-facing `apps/web` entry flow for creating a profile session and connecting it to contact update without URL or persistent token storage. | `.agent/stages/mvp/evidence/MVP-03-employee-profile-session-entry-ui-001.md`; `.agent/stages/mvp/evidence/MVP-03-employee-profile-session-entry-ui-001.json`; `.agent/stages/mvp/verdicts/MVP-03-employee-profile-session-entry-ui-001.json`; `.agent/stages/mvp/problems/MVP-03-employee-profile-session-entry-ui-001.md`. |
| MVP-03-onboarding-to-profile-session-continuity-ui-001 | agent | PASS | Connect `/onboarding/privacy` to `/profile/session` and remove unsafe `/profile/contact` token URL handoff. | `.agent/stages/mvp/evidence/MVP-03-onboarding-to-profile-session-continuity-ui-001.md`; `.agent/stages/mvp/evidence/MVP-03-onboarding-to-profile-session-continuity-ui-001.json`; `.agent/stages/mvp/verdicts/MVP-03-onboarding-to-profile-session-continuity-ui-001.json`; `.agent/stages/mvp/problems/MVP-03-onboarding-to-profile-session-continuity-ui-001.md`. |
| MVP-03-employee-start-route-ui-001 | agent | PASS | Add neutral employee-facing `/start` route with primary handoff to privacy before profile session. | `.agent/stages/mvp/evidence/MVP-03-employee-start-route-ui-001.md`; `.agent/stages/mvp/evidence/MVP-03-employee-start-route-ui-001.json`; `.agent/stages/mvp/verdicts/MVP-03-employee-start-route-ui-001.json`; `.agent/stages/mvp/problems/MVP-03-employee-start-route-ui-001.md`. |
| MVP-03-profile-session-legal-acceptance-ui-001 | agent | PASS | Add draft legal acknowledgement/acceptance step inside `/profile/session` before contact update. | `.agent/stages/mvp/evidence/MVP-03-profile-session-legal-acceptance-ui-001.md`; `.agent/stages/mvp/evidence/MVP-03-profile-session-legal-acceptance-ui-001.json`; `.agent/stages/mvp/verdicts/MVP-03-profile-session-legal-acceptance-ui-001.json`; `.agent/stages/mvp/problems/MVP-03-profile-session-legal-acceptance-ui-001.md`. |
| MVP-03.05 | agent | SCOPED_PASS | Implement admin audit logs for sensitive access. | Scoped PASS via `MVP-03-admin-sensitive-access-audit-001`; human-gated production policy and full MVP-03 remain open. |
| MVP-03-admin-sensitive-access-audit-001 | agent | PASS | Add backend-only append-only audit logging for the existing protected admin code-status access path and denied admin attempts. | `.agent/stages/mvp/evidence/MVP-03-admin-sensitive-access-audit-001.md`; `.agent/stages/mvp/evidence/MVP-03-admin-sensitive-access-audit-001.json`; `.agent/stages/mvp/verdicts/MVP-03-admin-sensitive-access-audit-001.json`; `.agent/stages/mvp/problems/MVP-03-admin-sensitive-access-audit-001.md`. |
| MVP-03-closure-audit-001 | agent | PASS | Artifact-only closure/status audit for full `MVP-03` against immutable PASS refs and current human gates. | `.agent/stages/mvp/evidence/MVP-03-closure-audit-001.md`; `.agent/stages/mvp/evidence/MVP-03-closure-audit-001.json`; `.agent/stages/mvp/verdicts/MVP-03-closure-audit-001.json`; `.agent/stages/mvp/problems/MVP-03-closure-audit-001.md`. |
| MVP-03-legal-drafts-001 | agent+human | PASS | Create tracked draft legal artifacts for privacy, terms, personal-data consent and financial disclaimer. | `docs/legal/mvp/drafts/privacy-policy-draft.md`; `docs/legal/mvp/drafts/terms-of-use-draft.md`; `docs/legal/mvp/drafts/personal-data-consent-draft.md`; `docs/legal/mvp/drafts/financial-disclaimer-draft.md`; `.agent/stages/mvp/evidence/MVP-03-legal-drafts-001.md`; `.agent/stages/mvp/evidence/MVP-03-legal-drafts-001.json`; `.agent/stages/mvp/verdicts/MVP-03-legal-drafts-001.json`; `.agent/stages/mvp/problems/MVP-03-legal-drafts-001.md`. |
| MVP-03-post-legal-acceptance-closure-audit-001 | agent | PASS | Artifact-only closure/status audit after legal-acceptance UI PASS. | `.agent/stages/mvp/evidence/MVP-03-post-legal-acceptance-closure-audit-001.md`; `.agent/stages/mvp/evidence/MVP-03-post-legal-acceptance-closure-audit-001.json`; `.agent/stages/mvp/verdicts/MVP-03-post-legal-acceptance-closure-audit-001.json`; `.agent/stages/mvp/problems/MVP-03-post-legal-acceptance-closure-audit-001.md`; latest `.agent/stages/mvp/evidence.md`; latest `.agent/stages/mvp/evidence.json`; latest `.agent/stages/mvp/verdict.json`; latest `.agent/stages/mvp/problems.md`. |
| MVP-03 | agent+human | DONE_WITH_HUMAN_PENDING | Full trust/legal consent/profile base has no concrete non-human proof gap after fresh verifier PASS for the post-legal-acceptance closure audit. | `MVP-03-post-legal-acceptance-closure-audit-001` records full `MVP-03` as `DONE_WITH_HUMAN_PENDING` after fresh verifier `PASS`. Legal/privacy/real-data/reporting/admin/support/financial/reward human gates and the MVP stage remain open; unconditional `DONE` is not claimed. |

### Verified MVP-03 employee contact update UI slice

`MVP-03-employee-contact-update-ui-001` is intentionally narrower than full `MVP-03.04`:

- implement only the employee-facing mobile-first `apps/web` profile/contact screen over the already verified profile-session API;
- show/read `fullName` as read-only when available;
- edit only `email` and `phone`;
- handle changed success, normalized no-op, `400` validation and `401` expired/invalid profile-session states with safe Russian UI copy;
- because `apps/web` has no existing token handoff, use only the existing profile-session API flow or a local/browser smoke harness, keep the token in memory and record the limitation;
- browser/screenshot evidence, generated-client usage proof, web/root checks, guardrail scans, JSON validation, diff check and fresh verifier are recorded;
- exclude `fullName` update, login/password setup, `User`, `OrgMembership`, subscriptions/seats/entitlements, support tickets, HR reporting, diagnostics, points, CMS, rewards, legal approval, real data processing, full `MVP-03` closure and MVP stage closure.

Fresh verifier returned `PASS` for this scoped UI slice. Production profile-session handoff remains a known limitation because the current measurable handoff is local/browser-smoke-only.

### Verified MVP-03 employee profile-session entry UI slice

`MVP-03-employee-profile-session-entry-ui-001` is intentionally narrower than full `MVP-03.04`:

- add only the employee-facing profile-session entry route, preferred `/profile/session`;
- collect invite code, full name, email and phone;
- call the existing verified `POST /api/v1/employee-registrations/profile-sessions` through generated `@finrhythm/api-client`;
- keep returned `profileSessionToken` in component memory only, with no URL/query/hash or persistent storage;
- connect the memory token to profile summary/contact update by refactoring the existing UI or keeping entry + contact update in one mounted client flow if cross-route handoff is unsafe;
- preserve read-only `fullName`, editable `email`/`phone` only, updated/no-op/400/401/generic safe Russian states and visible privacy boundary;
- exclude login/password setup, `User`, `OrgMembership`, organization codes, subscriptions/seats/entitlements, support tickets, HR reporting, diagnostics, points, CMS, rewards, backend/API/schema/OpenAPI changes, legal approval, real data processing, full `MVP-03` closure and MVP stage closure.

Fresh verifier returned `PASS` for this scoped UI slice. Full `MVP-03`, the MVP stage and human gates remain open.

### Verified MVP-03 onboarding-to-profile-session continuity UI slice

`MVP-03-onboarding-to-profile-session-continuity-ui-001` is intentionally scoped to route continuity only:

- connect `/onboarding/privacy` to `/profile/session` as the safe next step;
- preserve memory-only profile-session handling in the mounted `/profile/session` flow;
- remove unsafe profile-session token intake from `/profile/contact` URL/query/hash/path;
- keep direct `/profile/contact` in the safe missing-session state;
- exclude legal approval, diagnostics/routing, auth/login, `User`, `OrgMembership`, subscriptions/seats, HR reporting, points, CMS, rewards, support/admin flows, real-data processing, full `MVP-03` closure and MVP stage closure.

Fresh verifier returned `PASS` for this scoped UI slice.

### Verified MVP-03 employee start route UI slice

`MVP-03-employee-start-route-ui-001` is intentionally scoped to the neutral employee-facing start route only:

- add `/start` as a no-input, no-API first screen;
- make `/start -> /onboarding/privacy -> /profile/session` the primary verified path;
- keep `/profile/session` as a secondary continuation and avoid direct `/profile/contact` token handoff;
- explain the privacy-first order and memory-only profile-session boundary;
- exclude auth/login, organization membership/codes, subscriptions/seats, HR reporting, diagnostics, points, CMS, rewards, merch, support/admin flows, real-data processing, final legal approval, full `MVP-03` closure and MVP stage closure.

Fresh verifier returned `PASS` for this scoped UI slice.

### Verified MVP-03 profile-session legal acceptance UI slice

`MVP-03-profile-session-legal-acceptance-ui-001` is intentionally scoped to one legal acknowledgement/acceptance UI step:

- keep `/start -> /onboarding/privacy -> /profile/session` as the verified entry path;
- after `fetchEmployeeProfileSession`, show draft legal acknowledgement copy before opening contact update;
- post every generated `LEGAL_DOCUMENT_TYPES` value with `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION` through generated `fetchLegalDocumentAcceptance`;
- use `employeeRegistrationId` only in mounted component memory for the legal acceptance path parameter;
- keep `profileSessionToken` memory-only and never send it to legal acceptance;
- open `ProfileContactScreen` only after legal acceptance succeeds;
- preserve direct `/profile/contact` safe missing-session behavior;
- exclude final legal approval, real-data processing approval, backend/API/schema/OpenAPI/generated-client source changes, auth/login, `User`, `OrgMembership`, subscriptions/seats, diagnostics, HR reporting, points, CMS, rewards, merch, support/admin flows, full `MVP-03` closure and MVP stage closure.

Fresh verifier returned `PASS` for this scoped UI slice. Legal wording remains draft and human-gated.

### Verified MVP-03 post-legal-acceptance closure audit slice

`MVP-03-post-legal-acceptance-closure-audit-001` is intentionally scoped to status reconciliation only:

- cite immutable PASS refs for all currently proven `MVP-03` scoped subunits, including latest legal-acceptance UI;
- reconcile `MVP-03.01` legal draft artifacts as `DONE_WITH_HUMAN_PENDING`, not human-approved;
- map full `MVP-03` acceptance criteria to evidence or exact proof gaps;
- records full `MVP-03` as `DONE_WITH_HUMAN_PENDING` because no concrete non-human proof gap remains in tracked refs;
- fresh verifier returned `PASS`; latest evidence/verdict/problems aliases now point to this audit;
- preserve backend baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- expected docs-sync target is `NOOP_EXPECTED`; expected Mermaid change is `NONE_EXPECTED`;
- did not edit production code, canonical docs, prior immutable proof refs, human gates or MVP stage completion status.

Builder evidence and fresh verifier artifacts are recorded. Full `MVP-03` is `DONE_WITH_HUMAN_PENDING`, while the MVP stage and all human gates remain open.

### Verified MVP-03 legal drafts slice

`MVP-03-legal-drafts-001` is intentionally scoped to the missing `MVP-03.01` draft artifacts only:

- created `docs/legal/mvp/drafts/privacy-policy-draft.md`, `docs/legal/mvp/drafts/terms-of-use-draft.md`, `docs/legal/mvp/drafts/personal-data-consent-draft.md` and `docs/legal/mvp/drafts/financial-disclaimer-draft.md`;
- included draft status, version/date, MVP scope, owner/reviewer expectation and explicit non-approval warning in each draft;
- scans record no financial/legal guarantees, legal approval claims or personalized investment, tax, credit or legal advice claims;
- keep `legal-privacy-consent-wording-and-real-pii-processing` as `WAITING_HUMAN` and name the exact files for human review;
- treated cookie/consent as deferred/out of scope because no active cookie/tracking implementation scope was found in `apps/` or `packages/`;
- preserve backend baseline unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- expected canonical product/stage doc target is `NOOP`; expected Mermaid change is `NONE`;
- do not edit production code, app/package files, schemas, API/OpenAPI/generated client, UI, raw evidence or prior immutable proof refs;
- do not close full `MVP-03`, the MVP stage or any human gate;
- builder evidence exists at `.agent/stages/mvp/evidence/MVP-03-legal-drafts-001.md` and `.agent/stages/mvp/evidence/MVP-03-legal-drafts-001.json`;
- fresh verifier returned `PASS` and wrote `.agent/stages/mvp/verdicts/MVP-03-legal-drafts-001.json` plus `.agent/stages/mvp/problems/MVP-03-legal-drafts-001.md`;
- `mvp_03_legal_drafts_proven=true`, but legal/human review remains `WAITING_HUMAN`;
- full `MVP-03` still needs a separate closure audit before any `DONE_WITH_HUMAN_PENDING` decision.

### Frozen MVP-03 closure audit slice

`MVP-03-closure-audit-001` is intentionally scoped to status reconciliation only:

- cite immutable PASS refs for `MVP-03-onboarding-privacy-screen-001`, `MVP-03-consent-version-logging-001`, `MVP-03-admin-sensitive-access-audit-001`, `MVP-03-profile-contact-summary-001`, `MVP-03-employee-profile-session-001` and `MVP-03-profile-contact-update-001`;
- account honestly for `MVP-03.01` legal/privacy/terms/consent/disclaimer drafts and human gates;
- map the `MVP-03` acceptance criteria in `docs/stages/MVP.md` to existing evidence or a concrete proof gap;
- preserve backend baseline accounting for cited backend slices: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- expected docs-sync target is `NOOP`; expected Mermaid change is `NONE`;
- choose either `DONE_WITH_HUMAN_PENDING` for full `MVP-03` or keep it `OPEN` with the next gap-fix contract;
- do not edit production code, tests, schemas, API/OpenAPI/generated client, UI, canonical docs, raw evidence or prior immutable proof refs;
- do not close human gates or the MVP stage;
- fresh verifier returned `PASS` for this audit only; full `MVP-03` remains `OPEN`.

### MVP-03 closure audit builder decision

`MVP-03-closure-audit-001` builder evidence is recorded as artifact-only status proof:

- cited immutable PASS refs for `MVP-03-onboarding-privacy-screen-001`, `MVP-03-consent-version-logging-001`, `MVP-03-admin-sensitive-access-audit-001`, `MVP-03-profile-contact-summary-001`, `MVP-03-employee-profile-session-001` and `MVP-03-profile-contact-update-001`;
- mapped `docs/stages/MVP.md` `MVP-03` acceptance criteria to those refs and current human gates;
- found one concrete non-human proof gap: no tracked `MVP-03.01` legal draft artifacts for privacy, terms, consent and financial disclaimer;
- chose full `MVP-03` decision `OPEN`, not `DONE_WITH_HUMAN_PENDING` and not unconditional `DONE`;
- named next smallest gap-fix contract `MVP-03-legal-drafts-001`;
- recorded docs-sync `NOOP`, diagram expectation `NONE`, backend baseline preservation and MVP-stage-open check;
- fresh verifier returned `PASS` for this audit and wrote `.agent/stages/mvp/verdicts/MVP-03-closure-audit-001.json` plus `.agent/stages/mvp/problems/MVP-03-closure-audit-001.md`;
- parent sync moved latest evidence/verdict/problems aliases to `MVP-03-closure-audit-001`.

### Verified onboarding/privacy screen slice

`MVP-03-onboarding-privacy-screen-001` is intentionally scoped to a first employee-facing privacy explanation only:

- add a neutral Russian calm mentor privacy route/screen in `apps/web`, preferably `/onboarding/privacy`;
- explain aggregate-by-default HR/employer reporting before future diagnostics;
- state that personal diagnostic answers, individual weak zones, exact sums and reflection details are not personal HR reports by default;
- state that exact sums, photos, documents and bank screenshots are not required;
- mark wording as draft/legal-human-gated and avoid final legal approval or consent-recording claims;
- optionally link from `/learning` to the privacy route as navigation/handoff only;
- exclude diagnostics/routing, consent version logging, backend/API/schema/OpenAPI/generated-client, progress persistence, scored quiz submission, practice submission, points/wallet, CMS/admin publishing, production content approval, HR dashboard/reporting, real data and customer brand;
- do not close full `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, MVP stage or any human gate.
- builder evidence, web checks, browser screenshots and guardrail scans are recorded;
- fresh scoped verifier returned `PASS`, and parent latest aliases now point to `MVP-03-onboarding-privacy-screen-001`;
- full `MVP-03`, full `MVP-04`, full `MVP-06`, `MVP-07`, MVP stage and all human gates remain open.

### Frozen consent version logging slice

`MVP-03-consent-version-logging-001` is intentionally scoped to a technical backend/API foundation for draft legal document version logging:

- use `apps/api` baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- anchor acceptance logging to the existing `employeeRegistrationId` returned by `POST /api/v1/employee-registrations`;
- append an auditable consent/legal document acceptance log through a new Flyway migration;
- support current draft document types for privacy policy, personal data consent, terms of use and financial disclaimer;
- prove idempotent same-version retry and rejection for unknown/unsupported document/version inputs;
- keep controller thin and business rules in service/domain code;
- update OpenAPI/springdoc source and record generated-client no-op unless a generator exists in `packages/api-client`;
- allow `/onboarding/privacy` web handoff only if the existing flow has a trustworthy registration identity; otherwise keep the UI non-mutating and record the auth/session gap;
- require docs-sync decision, Mermaid flow evidence, Java runtime proof/blocker, backend tests and fresh verifier before PASS;
- exclude final legal approval, auth/session overhaul, diagnostics/routing, HR reporting, real data, generated client hand-writing and full `MVP-03` closure.

Builder evidence is now recorded:

- append-only `V007__legal_document_acceptance_log.sql`;
- new `apps/api/src/main/java/com/finrhythm/api/consent/**` package and `LegalDocumentAcceptanceControllerIT`;
- current draft document set, idempotent retry, safe rejection paths and OpenAPI runtime coverage are covered by backend integration tests;
- `packages/api-client` OpenAPI snapshot, generator/drift checks and generated contract/client helper now cover the legal acceptance endpoint;
- `/onboarding/privacy` was not changed because there is no trustworthy employee auth/session or registration identity bridge;
- backend/root checks passed with explicit Homebrew JDK 21 proof;
- fresh verifier returned `PASS`, and latest verified aliases now point to `MVP-03-consent-version-logging-001`.

### Frozen admin sensitive access audit slice

`MVP-03-admin-sensitive-access-audit-001` is intentionally scoped to the smallest auditable admin access foundation:

- use `apps/api` baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- log covered attempts against the existing protected admin code-status route and default-denied `/api/v1/admin/**` paths;
- store only safe technical audit metadata: timestamp, method, action, permission, normalized route/path, parsed UUID scope, status code, outcome and non-secret principal ref;
- prove no raw bearer token, raw invite code, activation subject ref, employee contact PII, request/response body, full query string or real data is stored;
- preserve existing admin code-status auth behavior and privacy-safe response contract;
- record OpenAPI/generated-client no-op unless a real API contract change is introduced;
- require docs-sync decision, Mermaid audit-flow evidence, Java runtime proof/blocker, backend tests and fresh verifier before PASS;
- exclude `MVP-03.04` profile/contact basics, employee UI, admin audit viewer UI, persisted admin users/sessions/RBAC, `User`, `OrgMembership`, SSO/SCIM, subscriptions/seats, HR reporting, support tickets, real-data operations, production admin policy approval and full `MVP-03` closure.

Builder evidence is now recorded:

- append-only `V008__admin_access_audit_log.sql`;
- new `apps/api/src/main/java/com/finrhythm/api/admin/audit/**` package;
- `AdminBearerTokenAuthenticationFilter` records one safe audit row for covered admin attempts after Spring Security/controller handling;
- focused `AdminCodeStatusControllerIT` coverage proves success, missing/invalid token, known-route validation/not-found and default-denied admin-path audit rows;
- `docs/architecture/access-and-subscriptions.md` documents the audited current bearer-token boundary and diagram;
- backend/root checks passed with explicit Homebrew JDK 21 proof;
- fresh verifier returned `PASS`, and latest verified aliases now point to `MVP-03-admin-sensitive-access-audit-001`.

### Frozen profile/contact summary slice

`MVP-03-profile-contact-summary-001` is intentionally narrower than full `MVP-03.04`:

- expose a read-only backend/API profile/contact summary lookup for an already registered employee;
- require raw invite code plus the same normalized full name, email and phone used at registration;
- return only support-ready identity/scope summary on a contact match;
- reject unknown invite/registration, mismatched contact and invalid input with safe structured errors;
- update OpenAPI and generated `packages/api-client` artifacts from source;
- do not add contact update, UUID-only profile lookup, employee auth/session/login/password setup, `User`, `OrgMembership`, subscriptions/seats, employee profile UI, support tickets, HR reporting, real data or full `MVP-03` closure.

Builder evidence is now recorded:

- new service/web DTOs and thin controller route under `apps/api/src/main/java/com/finrhythm/api/registration/**`;
- focused `EmployeeRegistrationControllerIT` coverage for success, mismatch, unknown invite, validation, no mutation and runtime OpenAPI;
- `packages/api-client` OpenAPI snapshot, generator/drift checks and generated client helper now cover the profile summary endpoint;
- backend/root/api-client checks and guardrail scans passed with explicit Homebrew JDK 21 proof;
- fresh verifier returned `PASS`, and latest verified aliases now point to `MVP-03-profile-contact-summary-001`.

### Frozen employee profile session slice

`MVP-03-employee-profile-session-001` is intentionally narrower than full `MVP-03.04` and does not implement contact update:

- create a short-lived employee profile session only after raw invite code plus normalized full name, email and phone match the existing registration;
- return an opaque high-entropy raw token only once and store only a server-side token hash;
- define explicit lifecycle: short TTL, previous active profile sessions for the same registration revoked on new creation, read-only `me/profile-summary` does not consume the session, expired/revoked sessions fail;
- add read-only authenticated `GET /api/v1/employee-registrations/me/profile-summary` using the profile-session bearer token;
- return safe `400`/`401`/`404` errors without raw token, raw invite code, contact values, lookup hash, activation subject ref or stored PII echoes;
- use the backend baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc;
- update OpenAPI/generated `packages/api-client` artifacts, add Flyway migration if sessions are persisted and sync canonical docs in `docs/architecture/access-and-subscriptions.md` with a small Mermaid flow;
- require backend/Testcontainers evidence, guardrail scans and fresh verifier before any PASS claim;
- exclude contact update, employee UI, login/password setup, `User`, `OrgMembership`, subscriptions/seats, `pro_user`, `premium`, SSO/SCIM, support tickets, HR reporting, diagnostics, points, CMS, rewards, real data and human-gate closure.

Builder evidence is now recorded:

- append-only `V009__employee_profile_session.sql`;
- new `EmployeeProfileSession` domain/repository/token service plus thin controller routes under `apps/api/src/main/java/com/finrhythm/api/registration/**`;
- focused `EmployeeRegistrationControllerIT` coverage for proof-gated creation, hash-only token persistence, previous-session revocation, non-consuming read-only `me/profile-summary`, expired/revoked/missing/malformed/unknown token rejection, safe error echoes and runtime OpenAPI;
- OpenAPI snapshot and generated `packages/api-client` helper now cover profile-session creation and authenticated me/profile-summary;
- `docs/architecture/access-and-subscriptions.md` documents the current MVP employee profile-session boundary and Mermaid flow;
- backend/root/api-client checks passed with explicit Homebrew JDK 21 proof;
- fresh verifier returned `PASS`, and latest verified aliases now point to `MVP-03-employee-profile-session-001`;
- full `MVP-03`, contact update and human gates remain open.

### Frozen profile contact update slice

`MVP-03-profile-contact-update-001` is intentionally narrower than full `MVP-03.04` and depends on the existing profile-session boundary:

- expose `PATCH /api/v1/employee-registrations/me/contact`;
- authenticate only with a valid unexpired unrevoked profile-session bearer token;
- update only normalized `email` and `phone`; omitted fields stay unchanged and `fullName` remains out of scope;
- reject empty or invalid payloads with safe `400`;
- return safe `401` for missing, malformed, unknown, expired and revoked profile-session tokens without contact-update audit rows;
- append one privacy-safe audit row for every accepted changed update or normalized no-op;
- store registration scope, changed fields/outcome, old/new contact hashes, timestamp, actor type `employee_profile_session` and safe `employee_profile_session_id`;
- update OpenAPI/generated `packages/api-client` artifacts and canonical access docs;
- exclude employee UI, support tickets, HR reporting, diagnostics, points, rewards, CMS, real data, `User`, `OrgMembership`, subscriptions/seats, login/password setup, SSO/SCIM and full `MVP-03` closure.

Builder evidence is now recorded:

- append-only `V010__employee_contact_update_audit.sql`;
- new contact update command/result/request/response/audit service plus service/controller integration under `apps/api/src/main/java/com/finrhythm/api/registration/**`;
- focused `EmployeeRegistrationControllerIT` coverage for changed update, no-op, omitted fields, fullName non-mutation, empty/invalid payload, failed-auth token cases, audit rows, no sensitive echo and runtime OpenAPI;
- OpenAPI snapshot and generated `packages/api-client` helper now cover `fetchEmployeeMeContactUpdate`;
- `docs/architecture/access-and-subscriptions.md` documents the contact-update boundary with Mermaid flow/state diagrams;
- backend/root/api-client checks and guardrail scans passed with explicit Homebrew JDK 21 proof;
- fresh verifier returned `PASS`, and latest verified aliases now point to `MVP-03-profile-contact-update-001`;
- full `MVP-03`, the MVP stage and all human gates remain open.

## MVP-04. UX/UI foundation and neutral brand

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-04-mobile-learning-shell-001 | agent | PASS | Build the smallest mobile-first `apps/web` learning shell: direct dev/demo learning entry, `Новичок` track entry and one synthetic lesson preview with Russian neutral copy. | `.agent/stages/mvp/evidence/MVP-04-mobile-learning-shell-001.md`; `.agent/stages/mvp/evidence/MVP-04-mobile-learning-shell-001.json`; `.agent/stages/mvp/verdicts/MVP-04-mobile-learning-shell-001.json`; `.agent/stages/mvp/raw/mvp-04-mobile-learning-shell-001-screenshots-20260511/` |
| MVP-04-design-system-tokenization-001 | agent | PASS | Tokenize the current `apps/web` learning shell and lesson renderer against draft Calm Progress Fintech design-system tokens. | `.agent/stages/mvp/evidence/MVP-04-design-system-tokenization-001.md`; `.agent/stages/mvp/evidence/MVP-04-design-system-tokenization-001.json`; `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`; `.agent/stages/mvp/raw/stage-verifier-mvp-04-design-system-tokenization-001-screenshots-final-20260512/` |
| MVP-04.04 | agent | PASS | Design tokens, current app shell/nav and common states are accepted for the scoped MVP-04 implementation surface after `MVP-04-mobile-learning-shell-001` and `MVP-04-design-system-tokenization-001`. | `.agent/stages/mvp/evidence/MVP-04-design-system-tokenization-001.md`; `.agent/stages/mvp/verdicts/MVP-04-design-system-tokenization-001.json`; `.agent/stages/mvp/status.json` |
| MVP-04-employee-app-ia-nav-001 | agent | PASS | Build the smallest mobile-first employee app IA/navigation shell for Home, Learning, Challenges, Rewards/Store, Profile and secondary Support reachability while preserving the verified `/start -> /onboarding/privacy -> /profile/session` path. | `.agent/stages/mvp/evidence/MVP-04-employee-app-ia-nav-001.md`; `.agent/stages/mvp/evidence/MVP-04-employee-app-ia-nav-001.json`; `.agent/stages/mvp/verdicts/MVP-04-employee-app-ia-nav-001.json`; `.agent/stages/mvp/problems/MVP-04-employee-app-ia-nav-001.md`; `.agent/stages/mvp/raw/verifier-MVP-04-employee-app-ia-nav-001-20260513-fresh/`. |
| MVP-04 | agent+human | OPEN | Full UX/UI foundation and neutral brand remain open; current scoped work covers learning shell/tokenization and a verified IA/navigation slice. | Remaining MVP-04 units and human-gated brand/voice/design/accessibility decisions required. Use `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` and `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png` as draft design inputs. |

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

### Verified employee app IA/navigation slice

`MVP-04-employee-app-ia-nav-001` is intentionally scoped to `MVP-04.02` route reachability and mobile IA:

- implement the smallest reusable employee app shell/bottom navigation needed in `apps/web`;
- cap bottom navigation at five items from the design-system baseline: `Главная`, `Обучение` or `Маршрут`, `Челлендж`, `Награды`, `Профиль`;
- keep Support out of bottom nav and expose it as a visible secondary entry from Home and Profile;
- add only placeholder/hub routes where needed for Challenges, Rewards/Store and Support;
- preserve `/learning`, `/learning/lessons/N1|N2|N3`, `/start`, `/onboarding/privacy`, `/profile/session` legal acceptance ordering and direct `/profile/contact` safe missing-session behavior;
- use calm Russian neutral copy with no customer brand, no money/cash-equivalence wording and no financial promises;
- first meaningful builder touch was `apps/web/components/employee-app-shell.ts`;
- web typecheck/test/build, browser smoke/screenshots, guardrail scans and root checks passed in builder evidence;
- fresh verifier first failed only the visual bottom-nav position; a minimal fix now anchors `.bottom-nav` to the bottom viewport edge and adds browser-smoke layout assertions;
- post-fix web typecheck/test/build, browser smoke with 29 screenshots and independent 390x844 route layout proof passed under `.agent/stages/mvp/raw/fixer-MVP-04-employee-app-ia-nav-001-20260513/`;
- fresh verifier re-run returned `PASS` with production-like browser smoke, route layout proof and root wrapper checks under `.agent/stages/mvp/raw/verifier-MVP-04-employee-app-ia-nav-001-20260513-fresh/`;
- compact Mermaid IA/route map is recorded in stage evidence;
- this is a scoped `MVP-04.02` navigation reachability PASS only and does not close full `MVP-04`;
- exclude challenge participation, store redemption, wallet/points mutation, support ticket submission, diagnostics/routing, CMS/admin, backend/API/schema/OpenAPI/generated-client changes, full `MVP-04`, MVP stage and human-gate closure.

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
| MVP-06-learning-n2-fixture-001 | agent | PASS | Add one additional synthetic `N2` savings-challenge lesson fixture to the existing `apps/web` fixture-backed renderer and link it from `/learning`. | `.agent/stages/mvp/evidence/MVP-06-learning-n2-fixture-001.md`; `.agent/stages/mvp/evidence/MVP-06-learning-n2-fixture-001.json`; `.agent/stages/mvp/verdicts/MVP-06-learning-n2-fixture-001.json`; `.agent/stages/mvp/problems/MVP-06-learning-n2-fixture-001.md`; `.agent/stages/mvp/raw/mvp-06-learning-n2-fixture-001-screenshots-20260512/`; root latest aliases now point to this task. |
| MVP-06-learning-n3-fixture-001 | agent | PASS | Add one synthetic `N3_DECLUTTER_TO_GOAL` lesson fixture to the existing renderer, expose `/learning/lessons/N3` and add a visible `/learning` CTA while preserving N1/N2. | `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.md`; `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.json`; `.agent/stages/mvp/verdicts/MVP-06-learning-n3-fixture-001.json`; `.agent/stages/mvp/problems/MVP-06-learning-n3-fixture-001.md`; `.agent/stages/mvp/raw/mvp-06-learning-n3-fixture-001-screenshots-20260512/`; `.agent/stages/mvp/raw/mvp-06-learning-n3-fixture-001-verifier-screenshots-20260512/`. |
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
- fresh scoped verifier returned `PASS` for this sprint only, and parent latest aliases were synchronized to this task in a separate artifact-only decision.

### Verified N3 fixture extension slice

`MVP-06-learning-n3-fixture-001` is intentionally scoped to one more synthetic fixture for the existing renderer:

- add synthetic `N3_DECLUTTER_TO_GOAL` content for decluttering and safe sale of unused items;
- provide direct route coverage for `N3`, expected as `/learning/lessons/N3`;
- allow the full lesson-id alias only if the current resolver pattern supports it;
- link `/learning` to the N3 lesson with a visible CTA while preserving N1 and N2;
- include office and store/shift examples;
- keep the mini-test display-only with safe-sale questions from `Q10`, `Q11` and `Q12`;
- keep practice non-persistent as checklist+choice: item count/range, safety checklist and destination category;
- reference `DC_DECLUTTER_ONE` only as fixture/contextual copy, not saved daily challenge behavior;
- mark content `editorial_draft` and `humanReviewRequired: true`, with `content/getcourse-finstrategy/12-lesson-235010153.md` remaining `humanReview: "required"`;
- require amber/warning-soft reward guardrails and no money/cash-equivalence/guaranteed-result/random-reward claims;
- avoid photos, address, listing URLs, deal amount, buyer chat, payment screenshot, bank screenshot, exact sums, customer brand and old cohort terms;
- exclude CMS/admin publishing, content states, publish validation, progress persistence, scored quiz submission, practice submission, saved listing/challenge/daily challenge, points/wallet, diagnostics/routing, onboarding/consent, backend/API/schema/OpenAPI/generated-client, `packages/ui`, admin/HR analytics/event tracking, real data and customer brand;
- do not close full `MVP-04`, full `MVP-06`, the MVP stage or human gates.
- builder and verifier checks, browser smoke and screenshots are recorded in `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.*`, `.agent/stages/mvp/verdicts/MVP-06-learning-n3-fixture-001.json` and `.agent/stages/mvp/problems/MVP-06-learning-n3-fixture-001.md`;
- fresh scoped verifier returned `PASS` for this sprint only, and parent latest status was synchronized to this task.

## MVP-07. Diagnostics and personalized route

| ID | Mode | Status | Goal | Evidence |
|----|------|--------|------|----------|
| MVP-07-diagnostic-entry-preview-ui-001 | agent | PASS | Add the smallest `apps/web` diagnostic entry/preview flow with Q0 privacy, non-scoring `SA1-SA3`, a few synthetic routing question cards and a safe draft route preview. | `.agent/stages/mvp/evidence/MVP-07-diagnostic-entry-preview-ui-001.md`; `.agent/stages/mvp/evidence/MVP-07-diagnostic-entry-preview-ui-001.json`; `.agent/stages/mvp/verdicts/MVP-07-diagnostic-entry-preview-ui-001.json`; `.agent/stages/mvp/problems/MVP-07-diagnostic-entry-preview-ui-001.md`; verifier raw refs under `.agent/stages/mvp/raw/verifier-MVP-07-diagnostic-entry-preview-ui-001-20260513-fresh/`. |
| MVP-07-diagnostic-draft-api-001 | agent | PASS | Add backend/API diagnostic draft/submission foundation for `Q0`, `SA1-SA3` and `Q1-Q3`, authenticated by employee profile-session bearer token, with safe N1 routePreview handoff and no final scoring/routing. | `.agent/stages/mvp/task-files/MVP-07-diagnostic-draft-api-001.md`; `.agent/stages/mvp/evidence/MVP-07-diagnostic-draft-api-001.md`; `.agent/stages/mvp/evidence/MVP-07-diagnostic-draft-api-001.json`; first verifier FAIL archived at `.agent/stages/mvp/verdicts/MVP-07-diagnostic-draft-api-001-prefix-fail.json`; fresh post-fix PASS at `.agent/stages/mvp/verdicts/MVP-07-diagnostic-draft-api-001.json` and `.agent/stages/mvp/problems/MVP-07-diagnostic-draft-api-001.md`. |
| MVP-07-diagnostic-web-api-integration-001 | agent | PASS | Integrate the already verified diagnostic draft API into the employee-facing mounted `/profile/session` flow using generated `@finrhythm/api-client`, with the profile-session token only in component memory and Q0/SA1-SA3/Q1-Q3 only. | `.agent/stages/mvp/evidence/MVP-07-diagnostic-web-api-integration-001.md`; `.agent/stages/mvp/evidence/MVP-07-diagnostic-web-api-integration-001.json`; fresh verifier PASS at `.agent/stages/mvp/verdicts/MVP-07-diagnostic-web-api-integration-001.json` and `.agent/stages/mvp/problems/MVP-07-diagnostic-web-api-integration-001.md`. |
| MVP-07-diagnostic-n1-learning-progress-001 | agent | PASS | Add backend-owned N1 lesson start/resume progress after the safe diagnostic N1 handoff and wire the web continuation through generated `@finrhythm/api-client` while keeping the profile-session token only in mounted component memory. | `.agent/stages/mvp/evidence/MVP-07-diagnostic-n1-learning-progress-001.md`; `.agent/stages/mvp/evidence/MVP-07-diagnostic-n1-learning-progress-001.json`; fresh verifier PASS at `.agent/stages/mvp/verdicts/MVP-07-diagnostic-n1-learning-progress-001.json` and `.agent/stages/mvp/problems/MVP-07-diagnostic-n1-learning-progress-001.md`. |
| MVP-07-n1-route-progress-summary-001 | agent | PASS | Add a read-only backend-owned N1 route/progress summary for the mounted profile-session flow, then show the summary in web through generated `@finrhythm/api-client` while keeping the token memory-only. | `.agent/stages/mvp/evidence/MVP-07-n1-route-progress-summary-001.md`; `.agent/stages/mvp/evidence/MVP-07-n1-route-progress-summary-001.json`; fresh verifier PASS at `.agent/stages/mvp/verdicts/MVP-07-n1-route-progress-summary-001.json` and `.agent/stages/mvp/problems/MVP-07-n1-route-progress-summary-001.md`. |
| MVP-07-n1-lesson-detail-continuation-001 | agent | PASS | Add read-only backend-owned N1 lesson detail/continuation after route-progress and N1 start/resume, then render it in the mounted profile-session flow through generated `@finrhythm/api-client` while keeping the token memory-only. | `.agent/stages/mvp/evidence/MVP-07-n1-lesson-detail-continuation-001.md`; `.agent/stages/mvp/evidence/MVP-07-n1-lesson-detail-continuation-001.json`; fresh verifier PASS at `.agent/stages/mvp/verdicts/MVP-07-n1-lesson-detail-continuation-001.json` and `.agent/stages/mvp/problems/MVP-07-n1-lesson-detail-continuation-001.md`. |
| MVP-07-n1-readonly-resume-continuation-001 | agent | PASS | Make the mounted `/profile/session` reopen path render backend-owned N1 continuation from existing read endpoints when route-progress says `N1 STARTED` / `RESUME_N1`, without calling the N1 start/resume mutation again. | `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.md`; `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.json`; fresh verifier PASS at `.agent/stages/mvp/verdicts/MVP-07-n1-readonly-resume-continuation-001.json` and `.agent/stages/mvp/problems/MVP-07-n1-readonly-resume-continuation-001.md`. |
| MVP-07.01 | agent | OPEN | Implement diagnostic test engine. | Preview UI has scoped PASS; draft API has builder evidence as a scoped prerequisite. Full engine remains future work. |
| MVP-07.02 | agent | OPEN | Implement rule-based scoring and level/route assignment. | Out of scope for the preview slice. |
| MVP-07.03 | agent | OPEN | Implement route explanation UI. | This preview slice may show only draft/preview copy; final route explanation remains future work. |
| MVP-07.04 | agent | OPEN | Implement safe resume/retry behavior. | Draft API, N1 start/resume, N1 route/progress summary and N1 lesson detail have scoped PASS; `MVP-07-n1-readonly-resume-continuation-001` is frozen for the next read-only resume prerequisite. Full retry behavior remains future work. |
| MVP-07.05 | agent | OPEN | Implement aggregated diagnostic insight reporting. | Out of scope and human-gated for privacy/reporting boundaries. |
| MVP-07 | agent+human | OPEN | Full diagnostics and personalized route remain open. | Future builder evidence, scoring correctness, privacy/HR/legal wording review and fresh verification required. |

### Verified diagnostic entry preview UI slice

`MVP-07-diagnostic-entry-preview-ui-001` is fresh-verified and intentionally scoped to a preview/entry UI, not a production diagnostic engine:

- add `/diagnostics` reachable from the existing Home/Learning shell;
- show Q0 privacy/expectation before any diagnostic or self-assessment question;
- include `SA1-SA3` as non-scoring pre self-assessment;
- include only a small synthetic preview set such as `Q1-Q3`, optionally `Q4` or `Q7`;
- keep answers/progress in mounted component memory only;
- show a safe draft route card with wording like `предварительный маршрут` or `черновой preview`;
- link to `N1` or `/learning` without claiming scoring completion, final level or final `R1-R6` route assignment;
- require browser screenshots, web checks, guardrail scans and Mermaid preview-flow evidence from the builder;
- exclude full `Q1-Q27`, `Q28`, scoring correctness, route-rule correctness, backend/API/schema/OpenAPI/generated-client, persistence/storage/network, HR reports, CMS/admin, learning progress/completion, points/rewards and full `MVP-07` closure;
- preserve the backend baseline: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.
- builder evidence is recorded in `.agent/stages/mvp/evidence/MVP-07-diagnostic-entry-preview-ui-001.md` and `.agent/stages/mvp/evidence/MVP-07-diagnostic-entry-preview-ui-001.json`;
- fresh verifier returned `PASS` with web checks, browser smoke with 33 screenshots, source/scope guardrails and root wrappers under `.agent/stages/mvp/raw/verifier-MVP-07-diagnostic-entry-preview-ui-001-20260513-fresh/`;
- this is scoped PASS only; full `MVP-07.01`, `MVP-07.03`, `MVP-07`, the MVP stage and all human gates remain open.

### Verified diagnostic draft API slice

`MVP-07-diagnostic-draft-api-001` now has scoped fresh post-fix verifier `PASS` as a backend/API prerequisite for `MVP-07.01` and `MVP-07.04`:

- added backend-owned diagnostic attempt persistence/API for exactly `Q0`, `SA1-SA3` and `Q1-Q3`;
- authenticates only by existing employee profile-session bearer token;
- keeps Q0/privacy metadata, self-assessment and routing answers separate in schema and response sections;
- persists draft and submitted state with safe resume for the same employee registration;
- returns only safe route preview handoff, `routePreview=true` and `recommendedFirstLessonId=N1`;
- uses append-only Flyway, Spring Boot Java 21, Maven Wrapper, PostgreSQL, OpenAPI/springdoc and generated client sync;
- focused backend integration tests, API client checks, root wrappers, guardrail scans and docs-sync are recorded in `.agent/stages/mvp/evidence/MVP-07-diagnostic-draft-api-001.*`;
- required doc target `docs/architecture/access-and-subscriptions.md` now includes the Mermaid profile-session diagnostic attempt flow/state diagrams;
- exclude final scoring, full `Q1-Q27`, `Q28`, final `R1-R6`, HR reports, analytics/events, exact sums/photos/docs/bank screenshots, advice, points, learning completion, UI integration and full `MVP-07` closure;
- `publish_after_pass=false`; no commit or PR is allowed without a separate user command;
- first fresh verifier failed the submit response boundary because submit returned the full attempt response;
- minimal fixer added handoff-only `DiagnosticSubmitResponse`, focused tests proving no answer/scope echo, and refreshed OpenAPI/generated client;
- fresh post-fix verifier returned `PASS` for this scoped sprint only; full `MVP-07.01`, `MVP-07.04`, `MVP-07`, the MVP stage and all human gates remain open.

### Verified diagnostic web/API integration slice

`MVP-07-diagnostic-web-api-integration-001` now has scoped fresh verifier `PASS` as the employee-facing web integration prerequisite for `MVP-07.01`, `MVP-07.03` and `MVP-07.04`:

- first meaningful builder touch was in `apps/web` production/test files, not `.agent`, docs, backend, schema or generated-client files;
- the already verified diagnostic draft API is mounted inside the existing `/profile/session` flow after profile-session creation and legal acceptance;
- profile-session token remains only in mounted React component memory: no URL path/query/hash, `localStorage`, `sessionStorage`, cookies, IndexedDB, service-worker cache or logs;
- generated `@finrhythm/api-client` helpers are used for diagnostic GET/PUT/POST: `fetchDiagnosticMeDraft`, `saveDiagnosticMeDraft` and `submitDiagnosticMeDraft`;
- only `Q0`, `SA1-SA3` and `Q1-Q3` are persisted/submitted, with Q0/privacy metadata, self-assessment and routing answers kept separate;
- submit renders only safe N1 routePreview handoff, without final score, final level, final `R1-R6`, weak zones, HR insight, points or learning completion;
- focused web tests, browser/mobile screenshots, token/storage/URL guardrail scans, generated-client drift checks, root wrappers, docs-sync decision, stage evidence and fresh verifier PASS are recorded;
- `publish_after_pass=false`; no commit/PR/publish action was run. Full `MVP-07.01`, `MVP-07.03`, `MVP-07.04`, full `MVP-07`, MVP stage and human gates remain open.

### Verified diagnostic to N1 learning progress slice

`MVP-07-diagnostic-n1-learning-progress-001` has scoped fresh verifier `PASS`:

- parent scope is a prerequisite across safe diagnostic handoff and `MVP-06.04` / N1 learning delivery, not full `MVP-06`, `MVP-07` or MVP;
- first meaningful builder touch must be in `apps/api` production/test files, preferably `V012__employee_lesson_progress.sql`, `com.finrhythm.api.learning/**` or a focused learning IT;
- add append-only N1 lesson progress storage and idempotent start/resume endpoint(s) under existing employee profile-session bearer auth;
- resolve registration and pilot scope server-side from the token; do not accept employee/scope ids from requests;
- restrict backend progress to synthetic N1 only;
- update OpenAPI and generated `packages/api-client` after backend source changes;
- wire the web continuation after diagnostic submit through generated learning helper(s);
- keep profile-session token only in mounted component memory with no URL/storage/cookie/cache/log transfer;
- require browser evidence for diagnostic submit -> N1 progress start/resume -> N1 continuation;
- require canonical doc sync in `docs/architecture/access-and-subscriptions.md` with compact Mermaid handoff/state diagram unless existing docs already cover this exact boundary;
- `publish_after_pass=true`;
- latest evidence/verdict/problems aliases now point to this slice;
- fresh verifier accepted backend/API, generated-client, web, browser, root-wrapper and guardrail proof;
- `publish_after_pass=true`, so post-PASS publish is required before continuation work.

### Verified N1 route/progress summary slice

`MVP-07-n1-route-progress-summary-001` is intentionally narrower than full route explanation, full diagnostic routing or learning completion:

- add a read-only profile-session authenticated route/progress summary, preferred `GET /api/v1/learning/me/route-progress`;
- summarize only diagnostic state, safe N1 routePreview handoff readiness, `N1` `NOT_STARTED|STARTED` state and safe next action;
- do not create/update diagnostic attempts or lesson progress from the read endpoint;
- update OpenAPI/generated api-client and use generated helper(s) in the mounted `/profile/session` flow;
- show a compact mobile route/progress panel before and after `N1` start/resume;
- keep profile-session token only in mounted component memory;
- exclude completion, quiz/practice submission, points, rewards, final scoring, final `R1-R6`, HR reports, analytics/events, exact sensitive data, advice, full MVP closure and human-gate closure.

Scoped builder/fixer evidence and fresh verifier `PASS` are recorded. Full MVP-06, full MVP-07, MVP stage and all human gates remain open.

### Verified N1 lesson detail continuation slice

`MVP-07-n1-lesson-detail-continuation-001` is intentionally narrower than CMS publishing, full lesson completion or full route explanation:

- add a read-only profile-session authenticated N1 lesson detail endpoint, preferred `GET /api/v1/learning/me/lessons/{lessonId}`;
- return backend-owned N1 draft detail only after submitted diagnostic N1 handoff and existing `N1 STARTED` progress;
- include safe lesson detail, draft review status, `humanReviewRequired=true`, `productionReady=false`, provenance and sensitive-data policy;
- do not expose quiz answer keys, scoring, practice submit payloads, completion state, reward accrual, internal scope IDs, tokens, diagnostic answers, final level, `R1-R6`, HR fields or exact sensitive values;
- update OpenAPI/generated api-client and use generated helper(s) in the mounted `/profile/session` continuation;
- render backend-owned N1 detail after route-progress and N1 start/resume;
- keep profile-session token only in mounted component memory;
- exclude completion, quiz/practice submission, points, rewards, final scoring, final `R1-R6`, HR reports, analytics/events, exact sensitive data, advice, full MVP closure and human-gate closure.

Scoped builder evidence and fresh verifier `PASS` are recorded. Full MVP-06, full MVP-07, MVP stage and all human gates remain open.

### Frozen N1 read-only resume continuation slice

`MVP-07-n1-readonly-resume-continuation-001` is intentionally narrower than schema/API work, lesson completion, theory completion, quiz/practice submission or full route explanation:

- when route-progress already returns submitted N1 handoff plus `N1 STARTED` / `RESUME_N1`, fetch existing N1 lesson detail with generated `fetchLearningMeLessonDetail`;
- render backend-owned N1 continuation from read endpoints on reopen without calling generated `startLearningMeLesson`;
- preserve first-start behavior for `START_N1`;
- prove browser/API or test evidence for `GET route-progress` + `GET lesson detail` and no `POST /learning/me/lessons/N1/start` on the resume path;
- keep profile-session token only in mounted component memory;
- exclude schema migration, new endpoints, new generated helpers, completion, theory completion, quiz/practice submission, points, rewards, final scoring, final `R1-R6`, HR reports, analytics/events, exact sensitive data, advice, full MVP closure and human-gate closure.

Scoped builder evidence and fresh verifier `PASS` are recorded. Full MVP-06, full MVP-07, MVP stage and all human gates remain open.
