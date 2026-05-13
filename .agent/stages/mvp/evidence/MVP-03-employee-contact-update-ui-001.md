# Evidence: MVP-03-employee-contact-update-ui-001

Stage: `mvp`
Parent unit: `MVP-03.04`
Status: `SCOPED_PASS`
Updated: 2026-05-13

## Scope Built

- Added employee-facing route `/profile/contact`.
- Added mobile-first profile/contact UI in `apps/web/components/profile-contact-screen.ts`.
- Enabled only the existing Profile nav item as a link to `/profile/contact`; Challenges and Rewards remain disabled.
- Added `@finrhythm/api-client` as an `apps/web` workspace dependency and used generated helpers/types:
  - `fetchEmployeeMeProfileSummary`;
  - `fetchEmployeeMeContactUpdate`;
  - `EmployeeContactUpdateRequest`;
  - `EmployeeContactUpdateResponse`;
  - `ApiErrorResponse`.
- Token handoff is local/browser-smoke only: the screen accepts `profileSessionToken` from the query string, keeps it in component memory, and immediately scrubs it from the URL with `history.replaceState`.
- Current profile summary loads with bearer token. `fullName` is read-only. Only `email` and `phone` are editable.
- Submit payload is built only from changed `email`/`phone`; `fullName` is never sent.
- Russian UI states cover no-token/start limitation, loading, ready form, saving, updated success, normalized no-op success, safe `400` validation copy, safe `401` expired/invalid session and generic API/network failure.
- Privacy copy states that this screen updates contact details only and does not share personal diagnostic answers, weak zones, exact sums or reflection details as personal HR reports by default.

## Changed Files Owned By This Builder

- `apps/web/app/profile/contact/page.tsx`
- `apps/web/components/profile-contact-screen.ts`
- `apps/web/lib/profile-contact-state.ts`
- `apps/web/components/learning-shell.ts`
- `apps/web/app/globals.css`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs`
- `apps/web/package.json`
- `pnpm-lock.yaml`
- `.agent/stages/mvp/evidence/MVP-03-employee-contact-update-ui-001.md`
- `.agent/stages/mvp/evidence/MVP-03-employee-contact-update-ui-001.json`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/feature_list.json`

Pre-existing dirty backend/API/docs/stage files from earlier work were not edited for this UI slice.

## Browser Evidence

Full browser smoke ran against the already-running local Next dev server at `http://127.0.0.1:3404` with Playwright route mocks and Google Chrome executable.

Key screenshot refs:

- Start/no-token limitation: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-mobile-profile-contact-start.png`
- Loaded form: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-mobile-profile-contact-loaded.png`
- Updated success: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-mobile-profile-contact-updated.png`
- Normalized no-op success: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-mobile-profile-contact-noop.png`
- Safe `400` validation: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-mobile-profile-contact-validation-400.png`
- Safe `401` expired/invalid session: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-mobile-profile-contact-invalid-401.png`
- Screenshot index: `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/MVP-03-employee-contact-update-ui-001-browser-smoke.json`

The smoke asserts that `profileSessionToken` is removed from the visible URL, is not visible in body text, API mocks receive it only as bearer auth, and the screenshot index has no token query key/value.

## Acceptance Mapping

| Criterion | Builder status | Evidence |
|---|---|---|
| Mobile-first profile/contact route exists and is reachable. | `BUILDER_CHECK_PASS` | `/profile/contact`, `learning-shell.ts`, browser screenshots |
| Uses verified profile-session boundary only. | `BUILDER_CHECK_PASS` | generated-client usage check, access-shortcut guardrail scan |
| Local/browser token prerequisite is explicit and measurable. | `BUILDER_CHECK_PASS_WITH_LIMITATION` | start-state screenshot, browser smoke token assertions |
| Token is kept in memory only and not persisted. | `BUILDER_CHECK_PASS` | unsafe storage scan, raw token/invite scan, smoke assertions |
| Profile summary loads with bearer token and shows read-only `fullName`. | `BUILDER_CHECK_PASS` | browser loaded-form scenario and unit/static tests |
| Only `email`/`phone` are editable/submitted; `fullName` is never sent. | `BUILDER_CHECK_PASS` | `buildChangedContactRequest` tests and PATCH mock payload assertions |
| Updated and normalized no-op success states are distinct. | `BUILDER_CHECK_PASS` | browser updated/no-op scenarios and screenshots |
| Safe `400` validation copy avoids raw sensitive echo. | `BUILDER_CHECK_PASS` | unit validation test and 400 screenshot |
| Safe `401` expired/invalid session copy uses existing profile-session flow only. | `BUILDER_CHECK_PASS` | 401 screenshot and access-shortcut scan |
| Privacy boundary copy is preserved. | `BUILDER_CHECK_PASS` | static render test and screenshots |
| No real employee/customer data or customer brand. | `BUILDER_CHECK_PASS` | synthetic `.example.test` mock data and brand/claim scan |
| Generated API client usage is proven. | `BUILDER_CHECK_PASS` | `generated-client-usage-check.txt` |
| Backend/API/schema/OpenAPI/generated-client artifacts unchanged by this builder. | `BUILDER_CHECK_PASS_UNCHANGED` | owned changed-file list and git status scope review |
| Docs sync is `NOOP_EXPECTED`. | `BUILDER_CHECK_PASS_NOOP` | existing access docs already own the profile-session/contact-update boundary |
| Relevant web/root checks ran. | `BUILDER_CHECK_PASS` | command table below |
| Fresh verifier PASS before final scoped PASS. | `PENDING_FRESH_VERIFIER` | verifier must run after this builder; no verifier artifacts written |

## Commands

Full outputs are under `.agent/stages/mvp/raw/builder-MVP-03-employee-contact-update-ui-001-20260513/`.

| Command | Status | Raw ref |
|---|---|---|
| `pnpm install --filter @finrhythm/web --offline` | `PASS` | `pnpm-install-web-offline.txt` |
| `pnpm --filter @finrhythm/web typecheck` | `PASS` | `web-typecheck.txt` |
| `pnpm --filter @finrhythm/web test` | `PASS` | `web-test.txt` |
| `pnpm --filter @finrhythm/web build` | `PASS` | `web-build.txt` |
| `WEB_SMOKE_BASE_URL=http://127.0.0.1:3404 ... pnpm --filter @finrhythm/web smoke:browser` | `PASS` | `web-browser-smoke.txt` |
| generated client usage `rg` check | `PASS` | `generated-client-usage-check.txt` |
| unsafe token storage/cookie scan | `PASS_NO_MATCHES` | `unsafe-token-storage-scan.txt` |
| raw token/invite echo scan | `PASS_NO_MATCHES` | `raw-token-invite-echo-scan.txt` |
| browser smoke JSON token check | `PASS` | `browser-smoke-token-json-check.txt` |
| customer brand / forbidden claims scan | `PASS_NO_MATCHES` | `customer-brand-forbidden-claims-scan.txt` |
| access shortcut scan | `PASS_NO_MATCHES` | `access-shortcut-guardrail-scan.txt` |
| `make verify` | `PASS` | `make-verify.txt` |
| `make test-unit` | `PASS` | `make-test-unit.txt` |
| `make build` | `PASS` | `make-build.txt` |
| `jq empty` for changed JSON artifacts | `PASS` | `json-validation.txt` |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**'` | `PASS_AFTER_PARENT_WHITESPACE_FIX` | `git-diff-check-excluding-raw.txt` |
| Harness validation | `EXPECTED_FAIL_PENDING_FRESH_VERIFIER` | `harness-validation.json` |

## Docs Sync And Diagram

- Canonical docs: `NOOP_EXPECTED`.
- Reason: this builder did not change the documented access workflow beyond `docs/architecture/access-and-subscriptions.md` section 7.2. It only adds an `apps/web` UI over the already verified profile-session/contact-update boundary.
- Mermaid: `NONE_EXPECTED`; no new cross-module flow or state machine was introduced.

## Backend/API Baseline

Backend baseline remains Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc. This builder changed no backend behavior, Flyway migration, OpenAPI source, generated api-client artifact or legal draft.

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

- `apps/web` still has no production profile-session handoff. The query-parameter token handoff is local/browser-smoke only and is scrubbed immediately after client mount.
- No login, password setup, account recovery, persistent auth, `User`, `OrgMembership`, subscriptions/seats/entitlements, support ticket flow, HR reporting, diagnostics, points, rewards, CMS or real-data processing is implemented.
- Fresh verifier returned `PASS` for this scoped UI slice, but full `MVP-03` and the MVP stage remain open.

## Fresh Verifier

- Verdict: `PASS`
- Verdict ref: `.agent/stages/mvp/verdicts/MVP-03-employee-contact-update-ui-001.json`
- Problems ref: `.agent/stages/mvp/problems/MVP-03-employee-contact-update-ui-001.md`
- Raw verifier refs: `.agent/stages/mvp/raw/verifier-MVP-03-employee-contact-update-ui-001-20260513/`
- Parent sync moved latest evidence/verdict/problems aliases to `MVP-03-employee-contact-update-ui-001`.
