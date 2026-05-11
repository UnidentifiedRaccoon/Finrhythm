# FinPulse / FinLit product Codex bootstrap

Этот пакет — стартовый baseline для реального продуктового репозитория проекта по финансовой грамотности.

## Идентичность репозитория

- GitHub-репозиторий и локальная директория checkout: `FinPulse`.
- Текущий технический package/env namespace остается `finrhythm` / `FINRHYTHM_*` до отдельной кодовой миграции; runnable commands ниже намеренно сохраняют действующие identifiers.

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

## Контентный baseline

Активный source baseline для образовательного контента — основной GetCourse-курс `Курс «ФинCтратегия»` внутри программы ФинЗдоровье (`stream id 546010026`). Короткая 8-урочная выгрузка `Путь к деньгам` удалена из активного baseline и не должна использоваться как источник для content/CMS/adaptation slices.

Ключевые пути:

- raw markdown-уроки: `content/getcourse-finstrategy/`;
- краткая справка по разделам теории: `content/getcourse-finstrategy/CONTENT_BRIEF.md`;
- export-артефакты курса: `course-export/stream-546010026/`;
- объединенный список lesson links: `course-export/stream-546010026/all-lesson-links.json`;
- скачанные видимые вложения: `content/getcourse-finstrategy/downloads/`.

Текущий инвентарь:

- lesson URL: 73;
- markdown-файлы уроков: 73;
- `exported`: 70;
- `blocked`: 3;
- скачанные видимые assets: 30 PDF/DOCX/XLSX файлов.

Human gates:

- 73/73 уроков имеют `humanReview: "required"`;
- финансовая, налоговая, кредитная, инвестиционная и пенсионная корректность требуют human review перед публикацией;
- customer-specific raw labels, включая `Леруа`, должны быть нормализованы перед employee-facing использованием;
- 3 `blocked` lessons требуют owner/admin-доступа или исправленной выгрузки перед адаптацией.

## Безопасные GetCourse helper commands

Команды GetCourse по умолчанию настроены на основной stream `546010026`. Они открывают только `fgrm.ncfg.ru`, не скачивают видео/DRM/архивы и хранят Playwright session state в ignored path `.local/getcourse/`.

```bash
pnpm getcourse:collect-links
pnpm getcourse:collect-links -- --headless
pnpm getcourse:export-content -- --headless
pnpm getcourse:download-assets -- --headless
```

Если GetCourse попросит авторизацию, запустите нужную команду без `--headless`, войдите вручную в открывшемся Playwright-браузере, затем повторите headless-запуск.

Текущий baseline после первого MVP-02 backend slice and минимального admin UI slice:

- `make install` запускает `pnpm install --frozen-lockfile`;
- `make verify` выполняет harness/bootstrap self-checks, `apps/admin` typecheck/test и backend unit checks через `apps/api/mvnw`;
- `make test-unit` выполняет bootstrap verification, focused `apps/admin` tests и backend unit checks без browser layer;
- `make build` выполняет production-readiness checks, собирает `apps/admin` and `apps/api` без повторного запуска backend tests;
- `make test-e2e` пока фиксирует отсутствие browser target для MVP-01;
- `make init` and `make dev` требуют запущенный Docker daemon and local PostgreSQL compose.

Минимальная admin-поверхность запускается отдельно:

```bash
pnpm --filter @finrhythm/admin dev -- --port 3300
pnpm --filter @finrhythm/admin typecheck
pnpm --filter @finrhythm/admin test
pnpm --filter @finrhythm/admin build
```

Первый admin route использует локальный typed fixture boundary for the verified backend code-status DTO. Live mode is read-only and requires synthetic `FINRHYTHM_ADMIN_API_BASE_URL`, `FINRHYTHM_ADMIN_SYNTHETIC_TENANT_ID`, `FINRHYTHM_ADMIN_SYNTHETIC_PILOT_LAUNCH_ID` and `FINRHYTHM_ADMIN_SYNTHETIC_ACCESS_POOL_ID`.

Полная backend schema verification для tenant/pilot-launch/access-pool/invite модели запускается отдельно:

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
- Content source baseline: `Курс «ФинCтратегия»` в `content/getcourse-finstrategy/`, краткая справка — `CONTENT_BRIEF.md`.
- Stage execution: self-contained `$stage-launch-proof-loop`, no external task-loop prerequisite.

## Ключевой принцип

Stage-файлы определяют **что строить**. `AGENTS.md`, `.codex/config.toml`, skills and subagents define **как это строить and prove**.
