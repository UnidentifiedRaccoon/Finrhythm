# FinLit product Codex bootstrap

Этот пакет — стартовый baseline для реального продуктового репозитория проекта по финансовой грамотности.

## Целевой стек

- monorepo;
- `apps/web` — Next.js + React;
- `apps/admin` — Next.js admin/CMS;
- `apps/api` — Spring Boot + Java + Maven;
- PostgreSQL as primary database;
- Flyway migrations;
- OpenAPI + generated TypeScript client;
- Yandex Cloud as target infrastructure.

## Что внутри

- repo-wide `AGENTS.md` with integrated FinLit stage harness policy;
- project-scoped `.codex/config.toml` for `gpt-5.5`, `xhigh`, `approval_policy = "on-request"`;
- `.codex/agents/*.toml` for stage orchestration, spec freeze, builder, fresh verifier, fixer and domain workers;
- repo-local skill `.agents/skills/stage-launch-proof-loop/`;
- stage source-of-truth files `docs/stages/MVP.md`, `v1.md`, `v2.md`;
- architecture/engineering docs and prompt files;
- local `AGENTS.md` for `apps/web`, `apps/admin`, `apps/api`;
- self-check script `.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py`.

## Как использовать

1. Скопируй содержимое этого пакета в корень продуктового репозитория.
2. Доведи реальную структуру репозитория до согласованного baseline.
3. Открой репозиторий в Codex and mark project as trusted.
4. Запусти self-check:

```bash
./scripts/validate-bootstrap.sh
```

5. Для MVP используй `prompts/run-mvp.prompt.md` or run Codex with `--profile mvp-autonomy`.

## Зафиксированные решения

- Codex model baseline: `gpt-5.5`.
- Reasoning effort: `xhigh`.
- Approval policy: `on-request`.
- Backend build tool: Maven Wrapper.
- Backend stack: Spring Boot, Java 21, PostgreSQL, Flyway, OpenAPI/springdoc.
- Stage execution: self-contained `$stage-launch-proof-loop`, no external task-loop prerequisite.

## Ключевой принцип

Stage-файлы определяют **что строить**. `AGENTS.md`, `.codex/config.toml`, skills and subagents define **как это строить and prove**.
