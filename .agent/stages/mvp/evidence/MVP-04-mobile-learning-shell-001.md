# Evidence: MVP-04-mobile-learning-shell-001

Status: `PASS`
Updated: 2026-05-11
Parent unit: `MVP-04.04`
Verification status: `PASS`

This evidence covers the minimal mobile-first employee learning shell in `apps/web`. It intentionally starts the educational surface with a direct demo route and synthetic fixtures only. It does not close onboarding/privacy/consent, diagnostics/routing, `MVP-04`, `MVP-06`, `MVP-07`, the MVP stage or any human gate.

## Implemented Scope

- Added a minimal Next.js + React `apps/web` scaffold.
- Added `/` and `/learning` routes that render the learning entry directly for development/demo use.
- Rendered a neutral employee-facing shell with Russian copy, bottom navigation, ready/loading/empty/error states and mobile-first responsive CSS.
- Rendered the `Новичок` N1-N7 track entry and one `N1` lesson preview from synthetic fixture metadata.
- Added focused Node/React unit tests and a Playwright browser smoke script with representative mobile screenshots.
- Wired root wrappers so `make verify`, `make test-unit` and `make build` include available `apps/web` checks.
- Updated narrow setup/layout docs for the new web app and root wrapper behavior.

## Out Of Scope Preserved

- No onboarding, privacy screen, legal consent or consent logging was implemented.
- No diagnostics completion, scoring, route assignment or route explanation was implemented.
- No CMS/admin content CRUD, production lesson renderer, quiz engine, practice submission, progress persistence, points or wallet was implemented.
- No backend/API/schema/OpenAPI/generated-client behavior changed.
- No real employee/customer/personal/financial data was added.
- No customer brand appears in employee-facing UI.
- No `cohort`, `cohortId` or `cohorts` active web source term was restored.

## Acceptance Mapping

| Acceptance criterion | Status | Evidence |
|---|---:|---|
| `apps/web` has a runnable mobile-first shell for the learning entry. | BUILDER_PASS | `apps/web/package.json`; `apps/web/app/page.tsx`; `apps/web/app/learning/page.tsx`; `apps/web/components/learning-shell.ts`; web typecheck/build raw refs. |
| Direct dev/demo route reaches learning without onboarding, consent, diagnostics or routing. | BUILDER_PASS | `/learning` browser smoke and Browser/IAB proof; no auth/consent/diagnostic dependency in `apps/web/lib/learning-state.ts`. |
| Learning entry presents `Новичок` track and one lesson preview from synthetic fixtures only. | BUILDER_PASS | `apps/web/lib/learning-fixtures.ts`; unit tests; mobile ready screenshot. |
| Russian neutral, anti-shame copy. | BUILDER_PASS | UI source and screenshots; forbidden-copy scan passes. |
| No customer brand in employee UI. | BUILDER_PASS | customer-brand scan passes; screenshots show neutral `Финпульс` product brand. |
| No real employee/customer/personal/financial data in fixtures/tests/screenshots/evidence. | BUILDER_PASS | no-real-data scan passes; synthetic fixture source only. |
| No income/gain/guaranteed-result promise in UI copy. | BUILDER_PASS | forbidden-copy scan passes. |
| Active changed web source does not restore old access terms. | BUILDER_PASS | no-cohort scan passes. |
| Component/unit tests cover shell, track, preview and states. | BUILDER_PASS | `stage-builder-mvp-04-mobile-learning-shell-001-web-test-20260511.txt`. |
| Browser/mobile evidence is captured and referenced. | BUILDER_PASS | Playwright smoke captured four mobile screenshots; Browser/IAB smoke passed with clean console. |
| Changed JSON artifacts validate. | BUILDER_PASS | JSON validation raw ref. |
| `git diff --check` passes. | BUILDER_PASS | `git-diff-check` raw ref. |
| Fresh verifier verdict is scoped only to this sprint. | PASS | `.agent/stages/mvp/verdicts/MVP-04-mobile-learning-shell-001.json`; `.agent/stages/mvp/problems/MVP-04-mobile-learning-shell-001.md`; verifier raw refs. |

## Screenshots

- Ready mobile screen: `.agent/stages/mvp/raw/mvp-04-mobile-learning-shell-001-screenshots-20260511/mvp-04-mobile-learning-shell-001-mobile-ready.png`
- Empty state: `.agent/stages/mvp/raw/mvp-04-mobile-learning-shell-001-screenshots-20260511/mvp-04-mobile-learning-shell-001-mobile-empty.png`
- Error state: `.agent/stages/mvp/raw/mvp-04-mobile-learning-shell-001-screenshots-20260511/mvp-04-mobile-learning-shell-001-mobile-error.png`
- Loading state: `.agent/stages/mvp/raw/mvp-04-mobile-learning-shell-001-screenshots-20260511/mvp-04-mobile-learning-shell-001-mobile-loading.png`

## Docs Sync

Updated canonical docs because setup/root wrapper behavior and the `apps/web` baseline changed:

- `README.md`
- `docs/setup/codex-setup.md`
- `docs/architecture/repo-layout.md`
- `docs/architecture/init-and-dev-contract.md`

No stage source-of-truth scope changed; this remains a narrow MVP-04 bridge slice.

## Human Gates Still Open

| Gate | Status |
|---|---:|
| Legal/privacy wording and consent copy | WAITING_HUMAN |
| Real employee/customer data processing | WAITING_HUMAN |
| Customer-specific HR/reporting boundaries | WAITING_HUMAN |
| Final financial correctness of lessons, diagnostics, quizzes and explanations | WAITING_HUMAN |
| Legal/tax review for tax wording | WAITING_HUMAN |
| HR/privacy wording review for diagnostics, self-assessment and reports | WAITING_HUMAN |
| Reward economy, stock, prices and fulfillment | WAITING_HUMAN |
| Support answer policy for sensitive topics | WAITING_HUMAN |
| `production_ready` content approval | WAITING_HUMAN |
| Admin auth/role/audit policy for production use | WAITING_HUMAN |

## Raw Refs

- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-file-list-before-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-file-list-after-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-typecheck-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-test-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-build-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-start-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-browser-smoke-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-browser-iab-20260511.json`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-customer-brand-scan-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-forbidden-copy-scan-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-no-real-data-scan-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-no-cohort-scan-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-make-verify-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-make-test-unit-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-make-build-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-json-validation-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-git-diff-check-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-changed-files-scope-20260511.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-verify-harness-20260511.json`

## Commands Summary

| Check | Status | Raw ref |
|---|---:|---|
| `pnpm --filter @finrhythm/web typecheck` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-typecheck-20260511.txt` |
| `pnpm --filter @finrhythm/web test` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-test-20260511.txt` |
| `pnpm --filter @finrhythm/web build` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-web-build-20260511.txt` |
| `pnpm --filter @finrhythm/web smoke:browser` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-browser-smoke-20260511.txt` |
| Browser/IAB smoke | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-browser-iab-20260511.json` |
| customer-brand scan | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-customer-brand-scan-20260511.txt` |
| forbidden-copy scan | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-forbidden-copy-scan-20260511.txt` |
| no-real-data scan | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-no-real-data-scan-20260511.txt` |
| no-cohort scan | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-no-cohort-scan-20260511.txt` |
| `make verify` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-make-verify-20260511.txt` |
| `make test-unit` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-make-test-unit-20260511.txt` |
| `make build` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-make-build-20260511.txt` |
| JSON validation | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-json-validation-20260511.txt` |
| `git diff --check` | PASS | `.agent/stages/mvp/raw/stage-builder-mvp-04-mobile-learning-shell-001-git-diff-check-20260511.txt` |
| harness validation | PASS | `.agent/stages/mvp/raw/orchestrator-mvp-04-mobile-learning-shell-001-verify-harness-final-20260511.json` |

## Fresh Verifier

Fresh verifier raw proof is complete and the durable verdict is `PASS` for `MVP-04-mobile-learning-shell-001` only. The verifier proof covers web/root commands, browser/mobile screenshots, Russian UI copy, no customer brand, no real data, forbidden-copy guardrails, deferred onboarding/diagnostics scope and no active cohort regression.

Durable refs:

- `.agent/stages/mvp/verdicts/MVP-04-mobile-learning-shell-001.json`
- `.agent/stages/mvp/problems/MVP-04-mobile-learning-shell-001.md`

Note: a misplaced duplicate generated evidence directory under `apps/admin/.agent` triggered the initial no-cohort app/package scan risk. The root `.agent/stages/mvp/raw` evidence already existed, the nested app-local artifacts were removed, and the follow-up verifier raw scan passed.
