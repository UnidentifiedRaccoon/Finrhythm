# Evidence: MVP-03-onboarding-to-profile-session-continuity-ui-001

Stage: `mvp`
Parent units: `MVP-03.02`, `MVP-03.04`
Status: `SCOPED_PASS`
Updated: 2026-05-13

## Fixer Update

Status: `FIXED_AND_FRESH_VERIFIED_PASS`

Concrete verifier gap addressed:

- `TOKEN_URL_HANDOFF_PROFILE_CONTACT`: removed production query-token intake from `/profile/contact`.

Production/test changes made by the fixer:

- `apps/web/app/profile/contact/page.tsx` now renders `ProfileContactScreen` without query-token enablement.
- `apps/web/components/profile-contact-screen.ts` no longer accepts the query-token opt-in prop, no longer reads profile-session tokens from URL/search params, and opens a profile session only from `initialProfileSessionToken` passed in component memory.
- `apps/web/components/profile-session-entry-screen.ts` keeps the in-memory handoff to `ProfileContactScreen` through `initialProfileSessionToken`.
- `apps/web/lib/profile-contact-state.ts` no longer exports the profile-session query-param constant.
- `apps/web/tests/learning-shell.test.mjs` and `apps/web/tests/browser-smoke.mjs` now assert source/smoke behavior without query-token support markers.

Fixer raw directory:

- `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/`

Key fixer screenshot refs:

- Privacy screen before action: `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-fixer-mobile-onboarding-privacy.png`
- After activating privacy primary action, profile-session entry rendered: `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-fixer-mobile-onboarding-privacy-to-profile-session.png`
- Direct `/profile/contact` missing-session state: `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-fixer-mobile-profile-contact-start.png`
- Direct `/profile/session` entry state: `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-fixer-mobile-profile-session-start.png`
- Screenshot index: `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-fixer-browser-smoke.json`

Fixer commands:

| Command | Status | Raw ref |
|---|---|---|
| `pnpm --filter @finrhythm/web typecheck` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/web-typecheck.txt` |
| `pnpm --filter @finrhythm/web test` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/web-test.txt` |
| `pnpm --filter @finrhythm/web build` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/web-build.txt` |
| `CHROMIUM_EXECUTABLE_PATH=... WEB_SMOKE_BASE_URL=http://127.0.0.1:3417 ... pnpm --filter @finrhythm/web smoke:browser` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/web-browser-smoke.txt` |
| query-token intake/routing source scan | `PASS_NO_MATCHES` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/query-token-intake-source-scan.txt` |
| token storage/cookie/IndexedDB source scan | `PASS_NO_MATCHES` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/token-storage-cookie-indexeddb-scan.txt` |
| raw invite/token echo scan | `PASS_NO_MATCHES` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/raw-invite-token-echo-scan.txt` |
| customer brand / real data / forbidden claims scan | `PASS_NO_MATCHES` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/customer-brand-real-data-forbidden-claims-scan.txt` |
| `make verify` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/make-verify.txt` |
| `make test-unit` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/make-test-unit.txt` |
| `make build` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/make-build.txt` |
| `jq empty` for changed JSON artifacts | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/json-validation.txt` |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'` | `PASS` | `.agent/stages/mvp/raw/fixer-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/git-diff-check-excluding-raw.txt` |

Docs/API/schema sync:

- Canonical docs: `NOOP_EXPECTED`; this fix removes an unsafe route fallback and does not change product/access/API/schema/setup contract.
- Backend/API/schema/Flyway/OpenAPI/generated client: unchanged by this fixer.
- Fresh verifier: `PASS`.

Fresh verifier refs:

- `.agent/stages/mvp/verdicts/MVP-03-onboarding-to-profile-session-continuity-ui-001.json`
- `.agent/stages/mvp/problems/MVP-03-onboarding-to-profile-session-continuity-ui-001.md`
- `.agent/stages/mvp/raw/verifier2-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/`

Fresh verifier summary:

- `/onboarding/privacy` has a visible primary action to `/profile/session`.
- Browser smoke proves click navigation without manual URL entry.
- `/profile/session` remains the generated-client profile-session entry flow and keeps `profileSessionToken` only in mounted component memory.
- Direct `/profile/contact` shows the safe missing-session state.
- URL/query/hash/path token-shaped inputs to `/profile/contact` do not call profile-summary API or unlock contact editing.

## Scope Built

- Updated `/onboarding/privacy` so the primary visible next action opens `/profile/session`.
- Kept `/learning` as a secondary demo-learning link only.
- Preserved the visible Russian privacy boundary: HR/employer aggregate visibility, personal diagnostic answers, weak zones, exact sums and reflection details are not personal HR reports by default.
- Updated focused render tests for the privacy screen route target and secondary demo link.
- Updated the existing browser smoke so it starts on `/onboarding/privacy`, activates the primary profile action, lands on `/profile/session`, and verifies the existing profile-session entry state.
- Preserved the existing `/profile/session` generated-client flow using `@finrhythm/api-client`; this slice did not change backend/API/schema/Flyway/OpenAPI/generated client artifacts.

## Changed Files Owned By This Builder

- `apps/web/components/onboarding-privacy-screen.ts`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs`
- `.agent/stages/mvp/evidence/MVP-03-onboarding-to-profile-session-continuity-ui-001.md`
- `.agent/stages/mvp/evidence/MVP-03-onboarding-to-profile-session-continuity-ui-001.json`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/status.json`

Pre-existing dirty backend/API/generated-client/docs/stage files from prior slices were not reverted or intentionally edited for this continuity slice.

## Browser Evidence

Browser smoke ran against production-like `next start` at `http://127.0.0.1:3416` with Playwright route mocks and installed Google Chrome via `CHROMIUM_EXECUTABLE_PATH`.

Raw directory:

- `.agent/stages/mvp/raw/builder-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/`

Key screenshot refs:

- Privacy screen before action: `.agent/stages/mvp/raw/builder-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-mobile-onboarding-privacy.png`
- After activating privacy primary action, profile-session entry rendered: `.agent/stages/mvp/raw/builder-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-mobile-onboarding-privacy-to-profile-session.png`
- Direct profile-session entry state preserved: `.agent/stages/mvp/raw/builder-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-mobile-profile-session-start.png`
- Screenshot index: `.agent/stages/mvp/raw/builder-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/MVP-03-onboarding-to-profile-session-continuity-ui-001-browser-smoke.json`

## Acceptance Mapping

| Criterion | Builder status | Evidence |
|---|---|---|
| `/onboarding/privacy` visibly links/navigates to `/profile/session`. | `BUILDER_CHECK_PASS` | privacy component, render test, browser screenshots |
| Browser/mobile smoke proves `/onboarding/privacy -> /profile/session` without manual URL entry. | `BUILDER_CHECK_PASS` | `web-browser-smoke.txt`, after-click screenshot |
| Resulting state is the existing profile-session entry, not auth/login/account shortcut. | `BUILDER_CHECK_PASS` | smoke expected text, direct profile-session screenshot |
| Generated `@finrhythm/api-client` boundary remains in `/profile/session`. | `BUILDER_CHECK_PASS` | `generated-client-boundary-check.txt`, render/source test |
| No session token is stored, routed or leaked through URL/storage/cookies/fixtures/screenshots/logs/evidence. | `BUILDER_CHECK_PASS` | storage scan, redacted route scan, final raw echo scan |
| Continuity path does not pass a token to `/profile/contact`. | `BUILDER_CHECK_PASS` | onboarding route scan and smoke route assertion |
| Russian privacy copy remains visible and does not claim legal approval. | `BUILDER_CHECK_PASS` | render test and privacy screenshot |
| UI is neutral employee-facing with no customer brand, real data or forbidden financial claims. | `BUILDER_CHECK_PASS` | source/raw guardrail scan |
| Backend/API/schema/Flyway/OpenAPI/generated client unchanged by this builder. | `BUILDER_CHECK_PASS_UNCHANGED` | changed-file scope, root wrappers |
| Canonical docs sync. | `NOOP_EXPECTED` | route continuity only; no product/access contract change |
| Fresh stage verifier. | `PASS` | fresh verifier verdict/problems refs |

## Commands

Full outputs are under `.agent/stages/mvp/raw/builder-MVP-03-onboarding-to-profile-session-continuity-ui-001-20260513/`.

| Command | Status | Raw ref |
|---|---|---|
| `pnpm --filter @finrhythm/web typecheck` | `PASS` | `web-typecheck.txt` |
| `pnpm --filter @finrhythm/web test` | `PASS` | `web-test.txt` |
| `pnpm --filter @finrhythm/web build` | `PASS` | `web-build.txt` |
| `CHROMIUM_EXECUTABLE_PATH=... WEB_SMOKE_BASE_URL=http://127.0.0.1:3416 ... pnpm --filter @finrhythm/web smoke:browser` | `PASS` | `web-browser-smoke.txt` |
| unsafe storage/cookie/IndexedDB scan | `PASS_NO_MATCHES` | `unsafe-token-storage-scan.txt` |
| redacted token URL/routing scan | `PASS` | `token-url-routing-scan.txt` |
| final raw token/invite echo scan | `PASS_NO_MATCHES` | `raw-token-invite-echo-scan.txt` |
| tracked evidence marker scan | `PASS_NO_MATCHES` | `tracked-evidence-sensitive-marker-scan.txt` |
| generated client boundary check | `PASS` | `generated-client-boundary-check.txt` |
| customer brand / real data / forbidden claims scan | `PASS_NO_MATCHES` | `customer-brand-real-data-forbidden-claims-scan.txt` |
| `make verify` | `PASS` | `make-verify.txt` |
| `make test-unit` | `PASS` | `make-test-unit.txt` |
| `make build` | `PASS` | `make-build.txt` |
| `jq empty` for changed JSON artifacts | `PASS` | `json-validation.txt` |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'` | `PASS` | `git-diff-check-excluding-raw.txt` |

## Docs Sync And Diagram

- Canonical docs: `NOOP_EXPECTED`.
- Reason: this slice only wires an existing privacy screen to an existing profile-session entry route and does not change product/access behavior, backend contract, schema, setup or workflow.
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

- Full `MVP-03` remains open; this PASS is scoped only to onboarding/privacy -> profile-session continuity and removal of the unsafe `/profile/contact` query-token fallback.
- Human gates remain `WAITING_HUMAN` for legal/privacy wording, real data processing, HR/reporting boundaries, financial correctness and reward/fulfillment decisions.
- No login/password, `User`, `OrgMembership`, org codes, subscriptions/seats/entitlements, HR reporting, diagnostics, points, CMS, rewards, merch, support tickets, admin flows or real-data processing is implemented.
- Playwright's bundled Chromium cache was unavailable locally; builder/fixer/verifier smoke passed with installed Google Chrome and no browser download.
