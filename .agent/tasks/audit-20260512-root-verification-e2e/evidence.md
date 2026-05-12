# Audit 2026-05-12 root verification/e2e — evidence

Статус: DONE_WITH_OUT_OF_SCOPE_BLOCKERS

## Изменения

- `Makefile`: `make verify` and `make test-unit` теперь запускают `cd apps/api && ./mvnw -q verify`; `make test-e2e` запускает `node tests/e2e/browser-smoke.mjs`.
- `package.json`: root `test:e2e` использует тот же non-placeholder wrapper.
- `tests/e2e/browser-smoke.mjs`: новый root wrapper поднимает/переиспользует web/admin targets and delegates to existing `@finrhythm/web` and `@finrhythm/admin` `smoke:browser` scripts.
- `tests/e2e/smoke-placeholder.mjs`: удален как no-op placeholder.
- `README.md`, `docs/architecture/init-and-dev-contract.md`: синхронизированы narrow notes по Maven `verify` and root browser smoke behavior.

## Checks

| Command | Result | Notes |
| --- | --- | --- |
| `make -n verify test-unit test-e2e build` | PASS | Dry-run shows `verify`/`test-unit` use `cd apps/api && ./mvnw -q verify`; `test-e2e` uses `node tests/e2e/browser-smoke.mjs`. |
| `node --check tests/e2e/browser-smoke.mjs` | PASS | Wrapper syntax is valid. |
| `node -e '<root wrapper contract check>'` | PASS | Makefile contains Maven `verify`, no `./mvnw -q test`, and root `test:e2e` points to `tests/e2e/browser-smoke.mjs`. |
| `./scripts/validate-bootstrap.sh` | PASS | Harness/bootstrap self-check passed. |
| `node scripts/verify-bootstrap.mjs` | PASS | Root bootstrap verification passed. |
| `pnpm --filter @finrhythm/web typecheck` | PASS | Web TypeScript check passed. |
| `pnpm --filter @finrhythm/web test` | PASS | 15 Node tests passed. |
| `pnpm --filter @finrhythm/admin typecheck` | PASS | Admin TypeScript check passed. |
| `pnpm --filter @finrhythm/admin test` | PASS | 4 Node tests passed. |
| `make test-unit` | FAIL outside wrapper scope | Root command reached `cd apps/api && ./mvnw -q verify`; Maven Failsafe failed in `AdminCodeStatusControllerIT` with PostgreSQL `GROUP BY` error on effective invite status counts. API code fix is outside this task write scope. |
| `E2E_OUTPUT_DIR=.agent/tasks/audit-20260512-root-verification-e2e/raw/browser-smoke make test-e2e` | FAIL local concurrency blocker | Another `apps/web` Next dev server was already running from a separate session on port `3404`; Next refused a second dev server for the same app directory. No foreign process was killed. |
| `E2E_OUTPUT_DIR=... WEB_SMOKE_BASE_URL=http://127.0.0.1:3404 make test-e2e` | FAIL local browser dependency | Reused existing web server, then failed because Playwright-managed Chromium was not installed. No browser download was performed. |
| `E2E_OUTPUT_DIR=... WEB_SMOKE_BASE_URL=http://127.0.0.1:3404 CHROMIUM_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" make test-e2e` | PASS | Fresh root e2e wrapper pass: web browser smoke passed with 8 screenshots; admin browser smoke passed with 5 screenshots; root browser smoke passed. |
| `git diff --check -- Makefile package.json README.md docs/architecture/init-and-dev-contract.md tests/e2e .agent/tasks/audit-20260512-root-verification-e2e/spec_freeze.md` | PASS | No whitespace errors in tracked diff paths. |
| `git diff --no-index --check /dev/null <new-file>` for new wrapper/spec files | PASS | No whitespace errors in untracked new files. |

## Blockers and limitations

- Full root backend verification is now active and currently non-pass because `AdminCodeStatusControllerIT` exposes an existing/out-of-scope PostgreSQL query issue: `column "ic1_0.status" must appear in the GROUP BY clause or be used in an aggregate function`.
- Default local `make test-e2e` could not start `apps/web` because another Next dev server for the same app directory was already running. The passing e2e verification reused that server via `WEB_SMOKE_BASE_URL=http://127.0.0.1:3404`.
- Playwright-managed Chromium is not installed locally. Passing e2e verification used the existing system Google Chrome via `CHROMIUM_EXECUTABLE_PATH`.
- A direct `cd apps/api && ./mvnw -q verify` outside Makefile first hit macOS Java runtime discovery friction; the root Makefile path exported Homebrew Java 21 and reached Failsafe/Testcontainers as intended.
- No `.agent/stages/**/raw/**` or `.agent/tasks/**/raw/**` paths were read. Browser screenshots/JSON were written under the ignored task raw path by the smoke scripts during e2e execution.
