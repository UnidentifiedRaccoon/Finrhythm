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
- self-check script `.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py`;
- root wrapper commands in `Makefile`;
- local PostgreSQL compose contract in `infra/local/compose.yaml`;
- versioned bootstrap manifest `scripts/init/version.json`;
- synthetic demo fixture `content/fixtures/demo-bootstrap.json`.

## Root-команды

Из корня репозитория доступны стабильные wrapper-команды:

```bash
make install
make init
make dev
make verify
make test-unit
make test-e2e
make build
```

## Безопасная выгрузка ссылок GetCourse

Первый этап выгрузки курса собирает только ссылки на уроки со страницы потока GetCourse.
Скрипт не открывает уроки, не скачивает материалы, не трогает DRM и ограничивает сбор доменом `fgrm.ncfg.ru`.

Запуск из корня репозитория:

```bash
pnpm getcourse:collect-links
```

Если GetCourse попросит авторизацию, откроется headful-браузер Playwright. Войдите вручную; cookies, пароли и токены не выводятся. Состояние сессии сохраняется в `.local/getcourse/storage-state.json`, этот путь игнорируется git.

Результаты:

- `course-export/lesson-links.json` — структурированный список уроков;
- `course-export/lesson-links.txt` — человекочитаемый список;
- `course-export/debug/stream-page.html`, `stream-page.png`, `link-candidates.json` — debug-артефакты для ручной проверки, игнорируются git.

Повторный запуск с уже сохранённой сессией можно сделать без окна браузера:

```bash
pnpm getcourse:collect-links -- --headless
```

## Безопасная выгрузка контента GetCourse

Следующий этап читает только видимый DOM-текст страниц уроков из `course-export/lesson-links.json` и обновляет markdown-файлы в `content/getcourse-path-to-money/`. Скрипт открывает только страницы уроков на `fgrm.ncfg.ru`, блокирует off-domain/media/download-like запросы, не скачивает видео, архивы, файлы и защищённые assets.

Запуск после ручного логина и сохранения `.local/getcourse/storage-state.json`:

```bash
pnpm getcourse:export-content -- --headless
```

Если сохранённой сессии нет или она истекла, запустите без `--headless`, войдите вручную в открывшемся Playwright-браузере, затем повторите headless-запуск. Debug для нестандартных/недоступных страниц сохраняется только в `course-export/debug/lesson-content/`, этот путь игнорируется git.

Текущий baseline после первого MVP-02 backend slice:

- `make install` запускает `pnpm install --frozen-lockfile`;
- `make verify` выполняет harness/bootstrap self-checks и backend unit checks через `apps/api/mvnw`;
- `make test-unit` выполняет bootstrap verification и backend unit checks без browser layer;
- `make build` выполняет production-readiness checks и собирает `apps/api` без повторного запуска тестов;
- `make test-e2e` пока фиксирует отсутствие browser target для MVP-01;
- `make init` and `make dev` требуют запущенный Docker daemon and local PostgreSQL compose.

Полная backend schema verification для tenant/cohort/invite модели запускается отдельно:

```bash
cd apps/api
./mvnw -q verify
```

Этот backend verify использует PostgreSQL/Testcontainers для Flyway/JPA constraint checks.

`make init` применяет migration `dev_bootstrap_runs` and records `scripts/init/version.json` in PostgreSQL. Повторный запуск не должен дублировать bootstrap version; explicit override uses `FORCE=1 make init`.

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
- Service tier: не закреплён в project config, чтобы рантайм мог выбрать supported default tier.
- Backend build tool: Maven Wrapper.
- Backend stack: Spring Boot, Java 21, PostgreSQL, Flyway, OpenAPI/springdoc.
- Stage execution: self-contained `$stage-launch-proof-loop`, no external task-loop prerequisite.

## Ключевой принцип

Stage-файлы определяют **что строить**. `AGENTS.md`, `.codex/config.toml`, skills and subagents define **как это строить and prove**.
