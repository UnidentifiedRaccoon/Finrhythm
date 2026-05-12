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

## Canonical product baselines

- product foundation: `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- learning methodology: `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`;
- content/CMS spec draft: `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`;
- product-design style baseline: `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`;
- design companion artifact: `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png`.

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

## CI

Базовый GitHub Actions workflow `.github/workflows/ci.yml` запускается для Pull Request, push в `main` and manual `workflow_dispatch`.
CI использует pnpm `10.27.0`, Node.js `24`, Temurin Java `21` and выполняет `make install`, `make verify`, `make build`. Root `make verify` уже включает backend Maven `verify` через `cd apps/api && ./mvnw -q verify`.

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

Текущий baseline после первого MVP-02 backend slice, минимального admin UI slice and минимального MVP-04 web learning shell slice:

- `make install` сначала запускает `scripts/check-toolchain.sh` для Node.js/Corepack/`pnpm@10.27.0`/Java 21/API Maven Wrapper readiness, затем выполняет `pnpm install --frozen-lockfile`;
- `make verify` выполняет harness/bootstrap self-checks, `apps/web` typecheck/test, `apps/admin` typecheck/test и backend Maven `verify` через `apps/api/mvnw`, включая Failsafe/Testcontainers checks;
- `make test-unit` выполняет bootstrap verification, focused `apps/web` tests, focused `apps/admin` tests и backend Maven `verify` без browser layer;
- `make build` выполняет production-readiness checks, собирает `apps/web`, `apps/admin` and `apps/api` без повторного запуска backend tests;
- `make test-e2e` запускает root wrapper `tests/e2e/browser-smoke.mjs`, поднимает локальные `apps/web`/`apps/admin` dev-серверы и выполняет доступные browser smoke scripts;
- `make init` and `make dev` требуют запущенный Docker daemon and local PostgreSQL compose.

По умолчанию root e2e использует `http://127.0.0.1:3400` для `apps/web`, `http://127.0.0.1:3300` для `apps/admin` and writes local browser artifacts under `.local/e2e/browser-smoke`. Для уже запущенных серверов используйте `E2E_REUSE_SERVERS=1 make test-e2e`; для внешних targets задайте `WEB_SMOKE_BASE_URL` и/или `ADMIN_SMOKE_BASE_URL`.

Минимальная employee-facing web-поверхность запускается отдельно:

```bash
pnpm --filter @finrhythm/web dev -- --port 3400
pnpm --filter @finrhythm/web typecheck
pnpm --filter @finrhythm/web test
pnpm --filter @finrhythm/web build
```

Первый web route `/learning` использует только synthetic fixtures для direct demo learning entry, `Новичок` N1-N7 track and one lesson preview. Этот route не закрывает onboarding/privacy/consent, diagnostics/routing, progress persistence, points or production content approval.

Минимальная admin-поверхность запускается отдельно:

```bash
pnpm --filter @finrhythm/admin dev -- --port 3300
pnpm --filter @finrhythm/admin typecheck
pnpm --filter @finrhythm/admin test
pnpm --filter @finrhythm/admin build
```

Первый admin route использует локальный typed fixture boundary for the verified backend code-status DTO. Live mode is read-only and requires synthetic `FINRHYTHM_ADMIN_API_BASE_URL`, `FINRHYTHM_ADMIN_SYNTHETIC_TENANT_ID`, `FINRHYTHM_ADMIN_SYNTHETIC_PILOT_LAUNCH_ID` and `FINRHYTHM_ADMIN_SYNTHETIC_ACCESS_POOL_ID`.

Полная backend schema verification для tenant/pilot-launch/access-pool/invite модели входит в `make verify` and `make test-unit`; отдельно ее можно запустить так:

```bash
cd apps/api
./mvnw -q verify
```

Этот backend verify использует PostgreSQL/Testcontainers для Flyway/JPA constraint checks.

`make init` применяет migration `dev_bootstrap_runs` and records `scripts/init/version.json` in PostgreSQL. Повторный запуск не должен дублировать bootstrap version; explicit override uses `FORCE=1 make init`.

`scripts/check-toolchain.sh` — только fail-fast readiness check: он не включает Corepack глобально, не устанавливает Java и не запускает Maven downloads. Для локального запуска используйте Node.js 24 как в CI, pinned `pnpm@10.27.0` через Corepack, Java 21 и исполняемый `apps/api/mvnw`.

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
