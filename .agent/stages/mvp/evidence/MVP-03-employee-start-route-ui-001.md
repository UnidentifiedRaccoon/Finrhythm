# Evidence: MVP-03-employee-start-route-ui-001

Stage: `mvp`
Parent units: `MVP-03.02`, `MVP-03.04`
Status: `SCOPED_PASS`
Updated: 2026-05-13
Owner role: `stage_builder`

## Scope Built

- Added employee-facing `/start` in `apps/web`.
- Added a mobile-first Russian start screen with neutral product brand only.
- Primary action goes to `/onboarding/privacy`.
- The screen explains the safe order: privacy boundary first, temporary profile session second, contact data only after that session.
- The screen states that the session secret is not passed through the address bar.
- Secondary `/profile/session` link is visually secondary and worded as continuation after the privacy screen.
- `/start` has no inputs, no API calls, no backend/session creation and no direct `/profile/contact` link.
- Preserved existing `/onboarding/privacy -> /profile/session`, generated-client `/profile/session` boundary, and direct `/profile/contact` safe missing-session behavior.

## Changed Files Owned By This Builder

- `apps/web/app/start/page.tsx`
- `apps/web/components/employee-start-screen.ts`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs`
- `.agent/stages/mvp/evidence/MVP-03-employee-start-route-ui-001.md`
- `.agent/stages/mvp/evidence/MVP-03-employee-start-route-ui-001.json`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/status.json`

Pre-existing dirty backend/API/generated-client/docs/stage files from prior slices were not reverted or intentionally edited for this start-route slice.

## Browser Evidence

Browser smoke ran against production-like `next start` at `http://127.0.0.1:3400` after `pnpm --filter @finrhythm/web build`. Playwright bundled Chromium was unavailable locally, so the same existing smoke script ran with installed Google Chrome via `CHROMIUM_EXECUTABLE_PATH`.

Raw directory:

- `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/`

Key screenshot refs:

- `/start`: `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/mvp-03-employee-start-route-ui-001-mobile-start.png`
- `/start -> /onboarding/privacy`: `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/mvp-03-employee-start-route-ui-001-mobile-start-to-onboarding-privacy.png`
- `/start -> /onboarding/privacy -> /profile/session`: `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/mvp-03-employee-start-route-ui-001-mobile-start-to-profile-session.png`
- Existing direct `/profile/contact` safe state: `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/mvp-03-employee-start-route-ui-001-mobile-profile-contact-start.png`
- Existing direct `/profile/session` entry state: `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/mvp-03-employee-start-route-ui-001-mobile-profile-session-start.png`
- Screenshot index: `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/mvp-03-employee-start-route-ui-001-browser-smoke.json`

## Acceptance Mapping

| Criterion | Builder status | Evidence |
|---|---|---|
| `/start` exists and renders successfully. | `BUILDER_CHECK_PASS` | route/component files, web build route list, browser screenshot |
| `/start` is Russian, mobile-first, neutral and has no customer brand. | `BUILDER_CHECK_PASS` | render test, browser screenshot, brand/claims scan |
| Primary action points to `/onboarding/privacy`. | `BUILDER_CHECK_PASS` | render/source test, browser smoke click from `/start` |
| `/start` does not make `/profile/session` primary and does not link to `/profile/contact`. | `BUILDER_CHECK_PASS` | render/source test, start guardrail scan, browser locator assertions |
| Safe order is visible: privacy first, temporary profile session, then contact data. | `BUILDER_CHECK_PASS` | render test and `/start` screenshot |
| Contact details are after temporary profile session; session secret is not moved through address bar. | `BUILDER_CHECK_PASS` | render test, component copy, URL/handoff scan |
| `/start` collects no invite code, name, email, phone, financial data or documents. | `BUILDER_CHECK_PASS` | render/source test, no-input scan, browser locator assertions |
| `/start` does not call APIs and does not create a profile session. | `BUILDER_CHECK_PASS` | source scan and route/component implementation |
| Browser/mobile smoke proves `/start -> /onboarding/privacy -> /profile/session`. | `BUILDER_CHECK_PASS` | `pnpm-web-browser-smoke.log`, screenshots listed above |
| Existing `/onboarding/privacy -> /profile/session` remains intact. | `BUILDER_CHECK_PASS` | existing smoke scenario and screenshot |
| Existing `/profile/session` generated-client entry flow remains intact. | `BUILDER_CHECK_PASS` | generated-client boundary check, render/source tests |
| Existing direct `/profile/contact` missing-session behavior remains safe. | `BUILDER_CHECK_PASS` | render test and direct `/profile/contact` smoke screenshot |
| No session secret appears in URL/storage/cookies/IndexedDB/tracked fixtures/screenshots/logs/evidence. | `BUILDER_CHECK_PASS` | storage, URL/handoff, raw log/json and tracked artifact scans |
| No raw invite echo, real data, customer brand or forbidden financial claims. | `BUILDER_CHECK_PASS` | brand/claims/invite scan, smoke HTML guardrails |
| Backend/API/schema/Flyway/OpenAPI/generated-client source unchanged by this builder. | `BUILDER_CHECK_PASS_UNCHANGED` | changed-file scope, generated-client boundary check, root wrappers |
| Canonical docs sync. | `NOOP_EXPECTED` | narrow route only; no product/access/API/schema/setup decision changed |
| Fresh verifier. | `PASS` | `.agent/stages/mvp/verdicts/MVP-03-employee-start-route-ui-001.json`, `.agent/stages/mvp/problems/MVP-03-employee-start-route-ui-001.md` |

## Commands

Full outputs are under `.agent/stages/mvp/raw/builder-MVP-03-employee-start-route-ui-001-20260513/`.

| Command | Status | Raw ref |
|---|---|---|
| `pnpm --filter @finrhythm/web typecheck` | `PASS` | `pnpm-web-typecheck.log` |
| `pnpm --filter @finrhythm/web test` | `PASS` | `pnpm-web-test.log` |
| `pnpm --filter @finrhythm/web build` | `PASS` | `pnpm-web-build.log` |
| `CHROMIUM_EXECUTABLE_PATH=... WEB_SMOKE_BASE_URL=http://127.0.0.1:3400 WEB_SMOKE_OUTPUT_DIR=<repo-root raw dir> WEB_SMOKE_SCREENSHOT_PREFIX=mvp-03-employee-start-route-ui-001 pnpm --filter @finrhythm/web smoke:browser` | `PASS` | `pnpm-web-browser-smoke.log` |
| production browser-storage scan | `PASS_NO_MATCHES` | `guardrail-token-storage-scan.log` |
| token URL/query/hash/path and contact-handoff scan | `PASS_NO_MATCHES` | `guardrail-token-url-handoff-scan.log` |
| `/start` no API/input/direct-contact scan | `PASS_NO_MATCHES` | `guardrail-start-no-api-input-scan.log` |
| brand, raw invite, real-data marker and forbidden claims scan | `PASS_NO_MATCHES` | `guardrail-brand-claims-invite-scan.log` |
| raw log/json secret and invite echo scan | `PASS_NO_MATCHES` | `guardrail-raw-log-json-secret-scan.log` |
| generated-client boundary check for `/profile/session` | `PASS` | `generated-client-boundary-check.log` |
| tracked artifact secret-marker scan | `PASS_NO_MATCHES` | `guardrail-tracked-artifact-secret-scan.log` |
| `make verify` | `PASS` | `make-verify.log` |
| `make test-unit` | `PASS` | `make-test-unit.log` |
| `make build` | `PASS` | `make-build.log` |
| `jq empty` for changed JSON artifacts | `PASS` | `jq-changed-json.log` |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'` | `PASS` | `git-diff-check-excluding-raw.log` |

## Docs Sync And Diagram

- Canonical docs: `NOOP_EXPECTED`.
- Reason: this slice adds a narrow `/start` entry screen to an already documented and verified privacy/profile-session path. It does not change product/access behavior, backend contract, schema, setup or workflow.
- Mermaid: `NONE_EXPECTED`.

## Fresh Verification

- Verdict: `PASS`.
- Verdict ref: `.agent/stages/mvp/verdicts/MVP-03-employee-start-route-ui-001.json`.
- Problems ref: `.agent/stages/mvp/problems/MVP-03-employee-start-route-ui-001.md`.
- The verifier reran focused JSON, diff, web test/typecheck, api-client test and guardrail checks, and reviewed builder build/browser/root-wrapper evidence.

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

- Full `MVP-03` remains open.
- Human gates remain `WAITING_HUMAN` for legal/privacy wording, real data processing, HR/reporting boundaries, financial correctness and reward/fulfillment decisions.
- No login/password, `User`, `OrgMembership`, org codes, subscriptions/seats/entitlements, HR reporting, diagnostics, points, CMS, rewards, merch, support tickets, admin flows or real-data processing is implemented by this slice.
- Playwright bundled Chromium cache was unavailable locally; browser smoke passed with installed Google Chrome and no browser download.
