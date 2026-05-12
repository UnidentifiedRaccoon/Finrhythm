# Audit 2026-05-12 CI — verification

Статус: PASS for CI scope; repo wrapper failure is out of scope.

## Commands

| Command | Result | Notes |
| --- | --- | --- |
| `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/ci.yml"); puts "yaml-ok"'` | PASS | YAML parses locally. |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'` | PASS | No whitespace errors. |
| `git diff --no-index --check /dev/null <new-file>` for each new file | PASS | No whitespace errors in new untracked workflow/evidence files. |
| `make -n install verify build` | PASS | Root wrappers resolve to existing commands. |
| `node -e '<workflow contract check>'` | PASS | Workflow contains `make install`, `make verify`, `make build`, `./mvnw -q verify`, pnpm `10.27.0`, Java `21`. |
| `make install` | PASS | `pnpm install --frozen-lockfile`; lockfile up to date. pnpm warns that `sharp@0.34.5` build scripts are ignored. |
| `make verify` | FAIL out of scope | Stops in `node scripts/verify-bootstrap.mjs`: `fixture-privacy-threshold` expects HR reporting threshold at least 20. This is existing fixture/bootstrap state outside allowed CI write scope. |
| `make build` | FAIL out of scope | Stops in the same `fixture-privacy-threshold` bootstrap check before build steps. |
| `JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH ./mvnw -q verify` from `apps/api` | PASS | Backend Maven verify passed with Java 21 and Testcontainers/PostgreSQL. |

## Limitations

- `actionlint` is not installed in this local environment; GitHub Actions semantic linting was not available.
- Direct local `./mvnw -q verify` without `JAVA_HOME` is blocked by macOS Java runtime discovery. CI uses `actions/setup-java@v4`, so the workflow sets Java before the backend verify step.
- No `.agent/stages/**/raw/**` or `.agent/tasks/**/raw/**` paths were read.
