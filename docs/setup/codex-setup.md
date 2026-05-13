# Codex setup

Пошаговая настройка Codex для этого репозитория.

## 1. Что должно лежать в репозитории

- root `AGENTS.md`;
- `.codex/config.toml`;
- `.codex/agents/*.toml`;
- `.agents/skills/stage-launch-proof-loop/`;
- `.agents/skills/push-main/`;
- `.agent/stages/` and `.agent/tasks/`;
- `docs/stages/MVP.md`, `docs/stages/v1.md`, `docs/stages/v2.md`.

## 2. Trusted project

Project-scoped `.codex/config.toml`, `.codex/agents` and repo-local skills load only for trusted project.

## 3. Recommended profiles

For MVP/stage execution:

```bash
codex --profile mvp-autonomy
```

For audit without production writes:

```bash
codex --profile readonly-audit
```

Expected runtime settings:

- `model = "gpt-5.5"`;
- `model_reasoning_effort = "xhigh"`;
- `approval_policy = "on-request"`;
- shallow subagents with max depth 1.
- project config does not pin `service_tier`; unsupported fixed tiers must not block subagent startup.

## 4. Self-check

Run from repo root:

```bash
./scripts/validate-bootstrap.sh
```

Or directly:

```bash
python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --bootstrap-only
```

## 5. Запуск этапа

For MVP: `prompts/run-mvp.prompt.md`  
For v1: `prompts/run-v1.prompt.md`  
For v2: `prompts/run-v2.prompt.md`

The prompt invokes `$stage-launch-proof-loop`; no external task-loop skill is required.
Current run prompts also request post-PASS publish: after a fresh verifier `PASS`, the agent updates `publish_manifest.json`, invokes repo-local `$push-main` for branch/commit/PR/merge/local-main update, and prints the next copyable continuation prompt.

## 6. Что проверять после настройки

- Codex sees root `AGENTS.md`;
- sees project-scoped subagents;
- sees repo-local skill;
- can read `docs/stages/*.md`;
- can write `.agent/` and working directories;
- root commands are documented;
- backend baseline is Spring Boot + Java + Maven + PostgreSQL.

## 7. Root commands and local bootstrap

Root wrappers:

```bash
make install
make verify
make test-unit
make test-e2e
make build
```

После первого MVP-02 backend slice `make verify` and `make test-unit` also run backend unit checks through `apps/api/mvnw`. После минимального `apps/admin` UI slice `make verify` runs admin typecheck/test, `make test-unit` runs focused admin tests, and `make build` builds the admin app before packaging `apps/api` with tests skipped after the explicit verification steps. После минимального MVP-04 web learning shell slice root wrappers also include `apps/web`: `make verify` runs web typecheck/test, `make test-unit` runs focused web tests, and `make build` builds the web app before admin/backend build steps.

Employee web local commands:

```bash
pnpm --filter @finrhythm/web dev -- --port 3400
pnpm --filter @finrhythm/web typecheck
pnpm --filter @finrhythm/web test
pnpm --filter @finrhythm/web build
```

The first `/learning` route is a direct demo learning entry backed by synthetic fixtures only. It does not complete onboarding/privacy/consent, diagnostics/routing, progress persistence, points or production content approval.

Admin UI local commands:

Команды ниже намеренно используют текущий technical package/env namespace. Имя репозитория — `FinPulse`; `@finrhythm/*` and `FINRHYTHM_*` остаются code identifiers до отдельной namespace migration.

```bash
pnpm --filter @finrhythm/admin dev -- --port 3300
pnpm --filter @finrhythm/admin typecheck
pnpm --filter @finrhythm/admin test
pnpm --filter @finrhythm/admin build
```

The default admin route uses synthetic fixture data. Optional live read-only mode is deploy/env-controlled, not query-controlled: set `FINRHYTHM_ADMIN_CODE_STATUS_SOURCE=live` together with `FINRHYTHM_ADMIN_API_BASE_URL`, `FINRHYTHM_ADMIN_API_TOKEN`, `FINRHYTHM_ADMIN_SYNTHETIC_TENANT_ID`, `FINRHYTHM_ADMIN_SYNTHETIC_PILOT_LAUNCH_ID` and `FINRHYTHM_ADMIN_SYNTHETIC_ACCESS_POOL_ID`. Backend admin code-status calls require `Authorization: Bearer <FINRHYTHM_ADMIN_API_TOKEN>` and the API maps that token to the `admin.code-status.read` permission for the current MVP boundary.

Local init/dev require Docker daemon:

```bash
make dev
make init
```

`make dev` starts local PostgreSQL only. `make init` starts PostgreSQL if needed, applies `apps/api/src/main/resources/db/migration/V001__dev_bootstrap_runs.sql`, reads `scripts/init/version.json` and records the bootstrap version in `dev_bootstrap_runs`. If Docker is not running, these targets fail fast with an explicit message and must not reset local state.

Backend schema/integration verification for Flyway/JPA constraints is run from `apps/api`:

```bash
./mvnw -q verify
```

It uses PostgreSQL/Testcontainers and therefore requires Docker.

## 8. Java 21 local toolchain

Root `make` commands auto-detect Homebrew OpenJDK 21 at:

- `/opt/homebrew/opt/openjdk@21`;
- `/usr/local/opt/openjdk@21`.

If found and `JAVA_HOME` is not already set, the Makefile exports `JAVA_HOME` and prepends `JAVA_HOME/bin` to `PATH` for `make verify`, `make test-unit` and `make build`. This avoids the macOS `/usr/bin/java` stub that reports "Unable to locate a Java Runtime".

If Java is installed elsewhere, set `JAVA_HOME` before running root wrappers:

```bash
JAVA_HOME=/path/to/jdk-21 make verify
```
