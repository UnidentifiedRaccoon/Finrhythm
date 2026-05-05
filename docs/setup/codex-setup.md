# Codex setup

Пошаговая настройка Codex для этого репозитория.

## 1. Что должно лежать в репозитории

- root `AGENTS.md`;
- `.codex/config.toml`;
- `.codex/agents/*.toml`;
- `.agents/skills/stage-launch-proof-loop/`;
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

После первого MVP-02 backend slice `make verify` and `make test-unit` also run backend unit checks through `apps/api/mvnw`. `make build` additionally packages `apps/api` with tests skipped after the explicit verification steps.

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
