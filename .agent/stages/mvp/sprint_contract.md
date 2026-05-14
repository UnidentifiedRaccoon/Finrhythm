# Sprint contract: MVP-07-diagnostic-web-api-integration-001

Stage: `mvp`
Parent unit: scoped prerequisite for `MVP-07.01`, `MVP-07.03` and `MVP-07.04`
Status: `PASS`
Proof status: `FRESH_VERIFIER_PASS`
Functional passes: `true`
Created: 2026-05-14
Owner role: `stage_builder`
Publish after pass: `false`

## Purpose

Implement the smallest employee-facing `apps/web` integration of the already fresh-verified backend diagnostic draft API.

The slice must mount an API-backed diagnostic step inside the existing `/profile/session` component flow after profile-session creation and draft legal acceptance, while the profile-session token remains only in mounted React component memory. The user-facing flow may keep the standalone `/diagnostics` preview route as a non-authenticated preview, but the verified integration path for this sprint is:

`/start -> /onboarding/privacy -> /profile/session -> profile-session API -> legal acceptance API -> diagnostic draft API GET/PUT/POST -> safe N1 routePreview handoff`

This is a narrow frontend integration slice. It is not a backend/API/schema slice, not full production diagnostics, not final scoring/routing, not analytics/events, not points/learning completion, not HR reporting and not a human-gate closure.

## Baseline And Source Refs

- Previous verified sprint: `MVP-07-diagnostic-draft-api-001` = fresh post-fix verifier `PASS`.
- Immutable previous proof refs:
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-draft-api-001.md`
  - `.agent/stages/mvp/evidence/MVP-07-diagnostic-draft-api-001.json`
  - `.agent/stages/mvp/verdicts/MVP-07-diagnostic-draft-api-001.json`
  - `.agent/stages/mvp/problems/MVP-07-diagnostic-draft-api-001.md`
- Latest evidence/verdict/problems aliases now point to `MVP-07-diagnostic-web-api-integration-001` after builder evidence and fresh verifier `PASS`.
- Existing `apps/web` diagnostic preview route already has scoped PASS for local component-memory preview only.
- Existing `/profile/session` flow creates an employee profile-session token, stores it in mounted component state, records draft legal acceptance and then opens profile/contact update with the token passed as a prop.
- Existing generated `@finrhythm/api-client` diagnostic surface:
  - `fetchDiagnosticMeDraft(baseUrl, { profileSessionToken }) -> DiagnosticAttemptResponse`
  - `saveDiagnosticMeDraft(baseUrl, { profileSessionToken, body }) -> DiagnosticAttemptResponse`
  - `submitDiagnosticMeDraft(baseUrl, { profileSessionToken }) -> DiagnosticSubmitResponse`
  - `DiagnosticDraftUpdateRequest` supports `q0`, `selfAssessment` and `routingAnswers`.
- Backend API scope is fixed to `Q0`, `SA1`, `SA2`, `SA3`, `Q1`, `Q2` and `Q3`.
- Backend allowed IDs currently include `Q0` options `WHO_SEES_ANSWERS`, `TRAINING_TIME`, `ASSIGNMENTS_REQUIRED`, `POINTS_ACCRUAL`, `READY_TO_START`; `SA1-SA3` values `1..5`; routing option ids `A-D` for `Q1`, `A-E` for `Q2` and `A-D` for `Q3`.
- Backend baseline remains explicit and unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

Do not read `.agent/stages/**/raw/**` unless a current evidence/problem/audit question names an exact raw ref.

## Required Inputs

Use read-gating from `READ_MATRIX.md` and read only the current sources needed for build:

- `AGENTS.md`;
- `apps/web/AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md` relevant `MVP-07` section;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` diagnostic/privacy sections for `Q0`, `SA1-SA3`, `Q1-Q3`, sensitive-data policy and route boundaries;
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` diagnostics/privacy/mobile patterns;
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`;
- current `/profile/session`, profile-contact and diagnostic preview files under `apps/web`;
- current generated diagnostic contract in `packages/api-client/src/generated/contracts.ts` and package export surface;
- immutable previous proof refs for `MVP-07-diagnostic-draft-api-001`;
- `.agent/stages/mvp/status.json`;
- this `sprint_contract.md`;
- `.agent/stages/mvp/evidence.json` as current proof index only.

## Builder First Touch

The first meaningful build step after this freeze must change production/test files under `apps/web`, not `.agent`, docs, backend, generated client, schema or evidence files.

Expected first-touch targets include one or more of:

- `apps/web/components/profile-session-entry-screen.ts`;
- `apps/web/components/diagnostic-preview-screen.ts` or a new `apps/web/components/diagnostic-api-flow-screen.ts`;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`.

Stage artifacts, docs and evidence come only after the frontend integration exists and focused checks are in place.

## In Scope

- Add an API-backed diagnostic flow inside the mounted `/profile/session` component tree after legal acceptance.
- Pass the profile-session token to the diagnostic flow only through React props/state in the mounted component tree.
- Keep the token out of URL path, URL query, URL hash, `localStorage`, `sessionStorage`, cookies, `document.cookie`, `cookieStore`, IndexedDB, service-worker caches and logs.
- Use generated `@finrhythm/api-client` functions for diagnostic GET, PUT and POST. Do not hand-roll diagnostic `fetch` calls or duplicate generated DTO types.
- Call `fetchDiagnosticMeDraft` on entry to resume or initialize the current attempt.
- Persist only `Q0`, `SA1`, `SA2`, `SA3`, `Q1`, `Q2` and `Q3` through `saveDiagnosticMeDraft`.
- Submit only through `submitDiagnosticMeDraft` after required Q0/SA/Q values are present or after a resumed submitted state is detected.
- Map user-visible Russian copy to backend option IDs explicitly and safely.
- Keep Q0 privacy metadata, self-assessment and routing answers as separate request/response sections in UI state.
- Handle `DRAFT` and `SUBMITTED` responses deterministically.
- Render loading, retry/error, draft-resume and submitted/safe-handoff states with Russian copy.
- Render the safe handoff from `DiagnosticSubmitResponse`: `routePreview=true`, `recommendedFirstLessonId="N1"` and state/timestamps only.
- Allow a user-visible action to open `/learning/lessons/N1` after submit.
- If contact update remains reachable after diagnostics, keep it inside the same mounted profile-session component tree and pass the token only through memory props.
- Preserve the standalone `/diagnostics` local preview route as preview-only unless the builder proves replacing it with a safe non-token entry is narrower.
- Preserve existing `/start`, `/onboarding/privacy`, `/profile/session`, legal acceptance, profile contact and `/learning/lessons/N1|N2|N3` behavior unless explicitly touched for this flow.
- Use design-system v0.1 privacy-card, progress, choice-card and calm mobile diagnostics patterns.

## Out Of Scope

- Backend/API/schema/Flyway/OpenAPI/generated-client changes.
- Manual edits to generated `packages/api-client` artifacts.
- Full `Q1-Q27`, `Q28`, `C1-C10` scoring, final `R1-R6` route assignment, final level assignment, strong/weak-zone correctness or route-rule correctness.
- Any UI field that claims final score, final level, final route profile, weak-zone report or employer-facing diagnostic insight.
- HR reports, analytics/events, event taxonomy, launch/access-pool reports, aggregated diagnostic insights or personal HR report surfaces.
- Lesson progress/completion, scored quiz submission, practice submission, points ledger, rewards, wallet, merch, redemption, challenges or learning completion.
- Exact personal income, debt, balance, account numbers, photos, documents, bank screenshots, exact-sum requirements or personal finance reports.
- Personal financial, investment, tax, credit, debt or legal advice.
- Login/password setup, `User`, `OrgMembership`, organization codes, subscriptions/seats, entitlements, SSO/SCIM, B2C billing or access-model refactor.
- Real employee/customer/personal/financial data.
- Closing full `MVP-07.01`, `MVP-07.03`, `MVP-07.04`, full `MVP-07`, full MVP stage or any human gate.

## Acceptance Checklist

- First production/test touch is in `apps/web`, not `.agent`, docs, backend, generated client or schema.
- `ProfileSessionEntryScreen` or an equivalent mounted profile-session component renders the diagnostic API flow after legal acceptance and before any final diagnostic handoff claim.
- The profile-session token is held only in mounted component memory and passed only as a prop/state value.
- Source scans prove no diagnostic/profile-session token is written to URL/query/hash, `localStorage`, `sessionStorage`, cookies, IndexedDB, service-worker caches or logs.
- Diagnostic API calls use only generated `@finrhythm/api-client` helpers: `fetchDiagnosticMeDraft`, `saveDiagnosticMeDraft` and `submitDiagnosticMeDraft`.
- No hand-written diagnostic endpoint URLs, `fetch`, `XMLHttpRequest` or duplicate diagnostic DTO definitions are introduced for diagnostic GET/PUT/POST.
- The flow calls GET/resume before mutation and handles empty current attempt, existing `DRAFT` and existing `SUBMITTED`.
- UI request payloads include only `q0.selectedOptionIds`, `selfAssessment[{id,value}]` and `routingAnswers[{id,optionId}]`.
- UI uses only `Q0`, `SA1`, `SA2`, `SA3`, `Q1`, `Q2` and `Q3`; no `Q4+`, `Q27`, `Q28`, `C1-C10` score payloads or `R1-R6` payloads are sent or rendered as final result.
- Q0/privacy selections, `SA1-SA3` and `Q1-Q3` answers remain separated in component state and request body.
- Save/update persists draft via PUT and surfaces a safe retry/error state without echoing token, raw invite code, employee IDs, scope IDs or personal contact fields.
- Submit returns and renders only safe N1 routePreview handoff fields; it does not render attempt id, employee registration id, tenant id, pilot launch id, access pool id, allowed answer ids, Q0 selections, self-assessment answers or routing answers in the final handoff.
- Existing `ProfileContactScreen` remains safe: direct `/profile/contact` without a memory token is still the missing-session state.
- Existing standalone `/diagnostics` preview remains honest and does not claim saved production diagnostics unless intentionally narrowed to an unauthenticated preview entry.
- User-facing copy is Russian, neutral, privacy-first and avoids shame, employer surveillance framing, guaranteed outcomes or advice claims.
- Browser/mobile evidence covers the full mounted path with mocked/generated API responses: profile session, legal acceptance, diagnostic GET, diagnostic PUT, diagnostic POST and N1 handoff.
- Browser/screenshot evidence confirms no token appears in URL before, during or after diagnostic flow.
- Scoped functional pass is allowed only for this contract after builder evidence and fresh verifier PASS. Full `MVP-07.01`, `MVP-07.03`, `MVP-07.04`, full `MVP-07`, full MVP and human gates remain open.

## Required Validation

The builder must run and record command evidence with exit status and raw refs:

- `pnpm --filter @finrhythm/web typecheck`;
- `pnpm --filter @finrhythm/web test`;
- `pnpm --filter @finrhythm/web build`;
- `WEB_SMOKE_OUTPUT_DIR=... WEB_SMOKE_SCREENSHOT_PREFIX=MVP-07-diagnostic-web-api-integration-001 pnpm --filter @finrhythm/web smoke:browser` or the exact available browser smoke command;
- focused browser assertions for `/start -> /onboarding/privacy -> /profile/session -> legal -> diagnostic GET/PUT/POST -> N1 handoff`;
- `pnpm --filter @finrhythm/api-client check:generated`;
- `pnpm --filter @finrhythm/api-client check:openapi-drift`;
- `pnpm --filter @finrhythm/api-client typecheck`;
- `make verify`;
- `make test-unit`;
- `make build`;
- `jq empty` for changed JSON artifacts;
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`;
- guardrail scans for no token storage/URL leakage, no hand-written diagnostic fetch/DTOs, no backend/schema/generated-client changes, no full `Q1-Q27`, no `Q28`, no final `R1-R6`, no HR reports, no analytics/events, no points/learning completion, no exact sums/photos/docs/bank screenshots, no personal advice, no raw bearer-token/raw-invite leakage and no real data.

## Evidence Handoff Required

The builder must record:

- changed production/test files under `apps/web`;
- exact mounted flow map from profile-session creation through legal acceptance, diagnostic draft save/submit and safe N1 handoff;
- generated API-client helpers used and diagnostic DTO summary;
- proof that token lifetime stays in mounted component memory only;
- request/response mapping for Q0, SA1-SA3 and Q1-Q3;
- loading/resume/save/submit/error state summary;
- browser screenshots and smoke raw refs;
- command raw refs and outcomes;
- guardrail scan raw refs;
- docs-sync decision and diagram refs;
- backend baseline note: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc unchanged;
- explicit out-of-scope confirmation for final scoring, full `Q1-Q27`, `Q28`, final `R1-R6`, HR reports, analytics/events, points, learning completion, exact sensitive data, advice and full `MVP-07` closure;
- immutable evidence/verdict/problems refs for `MVP-07-diagnostic-web-api-integration-001` after builder and fresh verifier phases.

## Doc Targets And Diagram Expectations

- Canonical product docs target: `NOOP_EXPECTED` for `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` and `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` if existing diagnostic IDs, privacy boundaries, mobile patterns and sensitive-data rules are followed.
- Architecture docs target: `NOOP_EXPECTED` for `docs/architecture/access-and-subscriptions.md` because the previous backend/API slice already documented the profile-session diagnostic API boundary; update only if frontend integration changes that boundary.
- API/generated-client docs target: `NOOP_EXPECTED`; no OpenAPI or generated-client behavior should change.
- Stage evidence diagram expectation: required compact Mermaid flow showing profile-session token memory path, legal acceptance, diagnostic GET/PUT/POST and N1 handoff.
- Canonical Mermaid expectation: no new canonical diagram unless behavior/architecture changes beyond existing docs.

## Human Gates That Remain Open

- Final Q0/SA/Q wording review.
- Scoring correctness and route-rule correctness.
- Final financial correctness of diagnostic questions and explanations.
- HR/privacy wording and reporting-boundary approval.
- Legal/privacy boundaries and real employee/customer data processing approval.
- Admin/support production access policy for sensitive diagnostic data.
- Design/accessibility QA on real mobile screens.

## Current Limitation

Builder evidence and a fresh verifier `PASS` now exist for this scoped sprint. The implementation is limited to `apps/web` profile-session diagnostic API integration with generated-client GET/PUT/POST, memory-only profile-session token handling and safe N1 handoff. This does not close full `MVP-07.01`, `MVP-07.03`, `MVP-07.04`, full `MVP-07`, the MVP stage or any human gate.
