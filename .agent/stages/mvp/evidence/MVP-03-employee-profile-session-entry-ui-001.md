# Evidence: MVP-03-employee-profile-session-entry-ui-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `SCOPED_PASS`
Updated: 2026-05-13

## Scope Built

- Added employee-facing route `/profile/session`.
- Added mobile-first profile-session entry UI in `apps/web/components/profile-session-entry-screen.ts`.
- Employee enters invite code, full name, email and phone; the POST uses generated `@finrhythm/api-client` helper/types:
  - `fetchEmployeeProfileSession`;
  - `EmployeeProfileSessionRequest`;
  - `EmployeeProfileSessionResponse`.
- Refactored `ProfileContactScreen` so a parent can pass an in-memory `initialProfileSessionToken`; profile summary and contact update still use generated `fetchEmployeeMeProfileSummary`, `fetchEmployeeMeContactUpdate`, `EmployeeContactUpdateRequest` and `EmployeeContactUpdateResponse`.
- Returned raw `profileSessionToken` stays only in mounted React component state. It is not routed through URL, query, hash, storage, cookies, fixtures, logs, screenshots or tracked evidence.
- After session creation, the same mounted client flow loads profile summary and renders the contact update form. `fullName` is read-only; only `email` and `phone` are editable/submitted.
- Existing `/profile/contact` remains as a local/browser-smoke fallback only (`allowQueryToken`), and its no-token state points users to `/profile/session`.
- Russian states cover start form, creating/loading, session ready, profile summary/contact form, updated success, normalized no-op, safe `400`, safe `401` and generic API/network failure.
- Privacy copy remains visible: this flow verifies profile/contact access only; personal diagnostic answers, weak zones, exact sums and reflection details are not personal HR reports by default.

## Changed Files Owned By This Builder

- `apps/web/app/profile/session/page.tsx`
- `apps/web/app/profile/contact/page.tsx`
- `apps/web/components/profile-session-entry-screen.ts`
- `apps/web/components/profile-contact-screen.ts`
- `apps/web/lib/profile-session-state.ts`
- `apps/web/components/learning-shell.ts`
- `apps/web/app/globals.css`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs`
- `.agent/stages/mvp/evidence/MVP-03-employee-profile-session-entry-ui-001.md`
- `.agent/stages/mvp/evidence/MVP-03-employee-profile-session-entry-ui-001.json`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/feature_list.json`

Pre-existing dirty backend/API/docs/stage files from earlier verified slices were not reverted or intentionally edited for this UI slice.

## Browser Evidence

Browser smoke ran against production-like `next start` at `http://127.0.0.1:3415` with Playwright route mocks and system Chrome. Full outputs and screenshots are under `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/`.

Key screenshot refs:

- Start form: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-start.png`
- Creating/loading: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-loading.png`
- Session ready/profile form: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-loaded.png`
- Contact updated success: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-updated.png`
- Normalized no-op: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-noop.png`
- Safe contact `400`: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-contact-validation-400.png`
- Safe invalid proof `400`: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-invalid-proof-400.png`
- Safe expired/invalid session `401`: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-invalid-401.png`
- Generic API failure: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-mobile-profile-session-generic-failure.png`
- Screenshot index: `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/MVP-03-employee-profile-session-entry-ui-001-browser-smoke.json`

The smoke asserts bearer-only token usage for summary/contact requests, no token in request URLs, no token in visible text, no token query in the browser URL, no raw invite proof retained in error-state HTML/text, and email/phone-only PATCH payloads.

## Acceptance Mapping

| Criterion | Builder status | Evidence |
|---|---|---|
| `/profile/session` exists and is reachable from profile nav. | `BUILDER_CHECK_PASS` | route file, `learning-shell.ts`, browser screenshots |
| Invite code, full name, email and phone call profile-session POST through generated client. | `BUILDER_CHECK_PASS` | `profile-session-entry-screen.ts`, `profile-session-state.ts`, generated-client usage scan |
| Returned token is memory-only and never passed through URL/storage/tracked artifacts. | `BUILDER_CHECK_PASS` | token handoff implementation, browser assertions, storage/raw scans |
| Profile summary loads after session creation before contact edit. | `BUILDER_CHECK_PASS` | browser loaded scenario, `fetchEmployeeMeProfileSummary` usage |
| Contact update edits/submits only email/phone; `fullName` read-only. | `BUILDER_CHECK_PASS` | unit tests, PATCH mock assertions, fullName guardrail scan |
| Updated/no-op/400/401/generic states are safe Russian copy. | `BUILDER_CHECK_PASS` | browser scenarios and screenshots |
| Old `/profile/contact` query-token limitation is reduced from production path. | `BUILDER_CHECK_PASS_WITH_LOCAL_FALLBACK` | `/profile/session` production entry, `/profile/contact` `allowQueryToken` fallback only |
| Privacy boundary and no customer brand/real data/claims. | `BUILDER_CHECK_PASS` | UI copy, browser smoke, guardrail scans |
| Backend/API/schema/OpenAPI/generated-client source unchanged by this builder. | `BUILDER_CHECK_PASS_UNCHANGED` | changed-file scope, root checks |
| Canonical docs sync. | `NOOP_EXPECTED` | existing access doc already documents the boundary |
| Fresh verifier PASS. | `PASS` | `.agent/stages/mvp/verdicts/MVP-03-employee-profile-session-entry-ui-001.json`, `.agent/stages/mvp/problems/MVP-03-employee-profile-session-entry-ui-001.md` |

## Commands

Full outputs are under `.agent/stages/mvp/raw/builder-MVP-03-employee-profile-session-entry-ui-001-20260513/`.

| Command | Status | Raw ref |
|---|---|---|
| `pnpm --filter @finrhythm/web typecheck` | `PASS` | `web-typecheck.txt` |
| `pnpm --filter @finrhythm/web test` | `PASS` | `web-test.txt` |
| `pnpm --filter @finrhythm/web build` | `PASS` | `web-build.txt` |
| `CHROMIUM_EXECUTABLE_PATH=... WEB_SMOKE_BASE_URL=http://127.0.0.1:3415 ... pnpm --filter @finrhythm/web smoke:browser` | `PASS` | `web-browser-smoke.txt` |
| generated client usage scan | `PASS` | `generated-client-usage-check.txt` |
| unsafe storage/cookie/IndexedDB scan | `PASS_NO_MATCHES` | `unsafe-token-storage-scan.txt` |
| raw token/query/invite echo scan | `PASS_NO_MATCHES` | `raw-token-invite-echo-scan.txt` |
| browser smoke JSON token/invite check | `PASS` | `browser-smoke-token-json-check.txt` |
| customer brand / real data / forbidden claims scan | `PASS_NO_MATCHES` | `customer-brand-real-data-forbidden-claims-scan.txt` |
| access shortcut scope scan | `PASS_NO_MATCHES` | `access-shortcut-scope-guardrail-scan.txt` |
| fullName mutation scan | `PASS_NO_MATCHES` | `fullname-mutation-guardrail-scan.txt` |
| `make verify` | `PASS` | `make-verify.txt` |
| `make test-unit` | `PASS` | `make-test-unit.txt` |
| `make build` | `PASS` | `make-build.txt` |

## Parent Recheck After Builder Capacity Interruption

The stage_builder process wrote the implementation and compact evidence, but its agent session later errored on model capacity before returning a final handoff. The parent/orchestrator therefore reran the required checks without changing the production implementation.

Additional raw refs are under `.agent/stages/mvp/raw/orchestrator-MVP-03-employee-profile-session-entry-ui-001-20260513/`.

| Command / check | Status | Raw ref |
|---|---|---|
| `pnpm --filter @finrhythm/web typecheck` | `PASS` | `web-typecheck.txt` |
| `pnpm --filter @finrhythm/web test` | `PASS` | `web-test.txt` |
| `pnpm --filter @finrhythm/web build` | `PASS` | `web-build.txt` |
| `WEB_SMOKE_BASE_URL=http://127.0.0.1:3416 ... pnpm --filter @finrhythm/web smoke:browser` | `PASS` | `web-browser-smoke.txt` |
| Browser smoke screenshot index | `PASS` | `orchestrator-MVP-03-employee-profile-session-entry-ui-001-browser-smoke.json` |
| production `/profile/session` token URL/storage strict scan | `PASS_NO_MATCHES` | `production-session-token-url-storage-strict-scan.txt` |
| production customer brand / real data / forbidden claims scan | `PASS_NO_MATCHES` | `production-brand-real-data-forbidden-claims-scan.txt` |
| production `fullName` mutation scan | `PASS_NO_MATCHES` | `production-fullname-mutation-scan.txt` |
| browser smoke token/invite JSON check | `PASS_NO_MATCHES` | `browser-smoke-token-json-check.txt` |
| generated client usage check | `PASS` | `generated-client-usage-check.txt` |
| `jq empty` for changed JSON artifacts | `PASS` | `json-validation.txt` |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**'` | `PASS` | `git-diff-check-excluding-raw.txt` |
| `make verify` with explicit Homebrew JDK 21 | `PASS` | `make-verify.txt` |
| `make test-unit` with explicit Homebrew JDK 21 | `PASS` | `make-test-unit.txt` |
| `make build` with explicit Homebrew JDK 21 | `PASS` | `make-build.txt` |
| In-app Browser DOM QA for `/profile/session` on `127.0.0.1:3404` | `PASS_DOM_NO_SCREENSHOT` | Browser DOM showed start form/privacy copy and zero console warnings/errors; Browser screenshot capture timed out, so screenshot evidence remains the Playwright smoke set. |

## Docs Sync And Diagram

- Canonical docs: `NOOP_EXPECTED`.
- Reason: this builder added a web UI over the already documented `docs/architecture/access-and-subscriptions.md` section 7.2 profile-session/contact-update boundary. It did not introduce a new durable access/session workflow, backend contract, schema, setup flow or product decision.
- Mermaid: `NONE_EXPECTED`.

## Backend/API Baseline

Backend baseline remains Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc. This builder changed no backend behavior, Flyway migration, OpenAPI source or generated api-client artifact.

## Human Gates

| Gate | Status |
|---|---|
| Legal/privacy wording and consent copy | `WAITING_HUMAN` |
| Real employee/customer data processing | `WAITING_HUMAN` |
| Customer-specific HR/reporting boundaries | `WAITING_HUMAN` |
| Final financial correctness of lessons, diagnostics, quizzes and explanations | `WAITING_HUMAN` |
| Reward economy, stock, prices and fulfillment | `WAITING_HUMAN` |

Full `MVP-03` and the MVP stage remain open.

## Known Limitations

- The production-safe entry keeps session entry, profile summary and contact update in one mounted client flow because there is no cross-route memory-only handoff boundary. Reload/navigation drops the token and requires a new profile session.
- `/profile/contact` still supports query-token handoff only as local/browser-smoke fallback and points ordinary users to `/profile/session`.
- No login, password setup, account recovery, persistent auth, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, support tickets, HR reporting, diagnostics, points, rewards, CMS, backend/API changes or real-data processing is implemented.
- Fresh `stage_verifier` has not run for this sprint yet; builder evidence is complete, but no scoped PASS verdict is claimed.

## Fresh Verifier

- Status: `PASS`
- Verifier scope: `MVP-03-employee-profile-session-entry-ui-001`
- Immutable verdict: `.agent/stages/mvp/verdicts/MVP-03-employee-profile-session-entry-ui-001.json`
- Problems ref: `.agent/stages/mvp/problems/MVP-03-employee-profile-session-entry-ui-001.md`
- Latest aliases synchronized by parent after PASS: `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md`, `.agent/stages/mvp/status.json`.
- Full `MVP-03`, MVP stage and human gates remain open.
