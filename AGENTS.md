# AGENTS.md

Постоянные инструкции для Codex и других coding agents в продуктовом репозитории FinLit.

<!-- BEGIN FINLIT STAGE HARNESS -->
Используй repo-local FinLit stage harness для исполнения `docs/stages/MVP.md`, `docs/stages/v1.md` и `docs/stages/v2.md`.

Core rules:
- durable stage artifacts: `.agent/stages/<stage_id>/`;
- one top-level `stage_orchestrator` per stage run;
- bounded leaf subagents only; no recursive child orchestration;
- `stage_spec_freezer` freezes scope before implementation;
- one integration `stage_builder` owns implementation + evidence for a slice;
- every verify pass uses a fresh `stage_verifier`;
- verifier must not edit production code;
- fixer changes only concrete verifier-reported proof gaps;
- no feature, execution unit, sprint contract, or stage is DONE without evidence;
- if implementation or clarified decisions drift from canonical docs, update docs in the same slice;
- substantial work closes only after doc-sync, evidence update, and fresh verification;
- model policy for parent and custom subagents: `gpt-5.5` + `xhigh`.
<!-- END FINLIT STAGE HARNESS -->

## 1. Область действия и приоритет

Порядок источников истины перед началом любых изменений:

1. текущее состояние репозитория и runnable baseline;
2. `docs/architecture/source-of-truth.md`;
3. `docs/architecture/documentation-workflow.md`;
4. product-intent baseline: `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
5. для UI/design/token/component/screen slices: `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`;
6. для account/organization/access/invitation/code/subscription/seat slices: `docs/architecture/access-and-subscriptions.md` and `docs/architecture/organization-access-subscription-model.md`;
7. целевой stage-file only: `docs/stages/MVP.md`, `docs/stages/v1.md` или `docs/stages/v2.md`;
8. `docs/engineering/definition-of-done.md`;
9. `docs/engineering/human-gates.md`;
10. `docs/engineering/contributing.md`;
11. ближайший локальный `AGENTS.md`;
12. `.agent/stages/<stage_id>/status.json`, затем активный `.agent/stages/<stage_id>/sprint_contract.md` или `.agent/stages/<stage_id>/task-files/<TASK_ID>.md`, если работа уже инициализирована.

Если инструкции конфликтуют, приоритет у более близкого файла и более узкого контекста. Stage-файлы определяют scope и exit gates; этот файл определяет operating behavior и engineering guardrails.
Read-gating: не читать все stage docs, product docs или `.agent/stages/**/raw/**` по умолчанию. Для stage work использовать `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`; raw evidence читать только по точной ссылке из текущего `evidence.json`, `problems.md` или audit-вопроса.

## 2. Codex runtime policy

- Project-scoped `.codex/config.toml` должен использовать `approval_policy = "on-request"`.
- Нельзя менять project/profile away from `approval_policy = "on-request"` без прямой команды пользователя.
- Parent session and custom subagents use `model = "gpt-5.5"` and `model_reasoning_effort = "xhigh"`.
- `.codex/agents` держит shallow tree: max depth 1, child agents are leaf roles.
- Для risky commands, network, destructive ops, migrations against non-local DB, secrets, and deployment actions agent must ask approval.

## 3. Обязательная маршрутизация workflow

- Для исполнения stage-файлов использовать `$stage-launch-proof-loop`.
- Для любой нетривиальной задачи, которая меняет код, тесты, конфиги, схемы БД, контент, admin-потоки, аналитику или публичную документацию, использовать integrated proof loop: `spec freeze -> build -> evidence -> fresh verify -> minimal fix -> fresh verify`.
- Все stage/task artifacts хранить только внутри репозитория.
- Нельзя self-certify кодовую задачу без fresh verification.
- Нельзя помечать `agent+human` и `human-gate` задачи как полностью закрытые только агентной работой.

## 3.1 Fast publish mode

Для явных publish-only запросов вроде "закоммить всё", "открой PR", "смёрджи PR" или "прими PR", если пользователь не просит ревью, доработку, stage execution или аудит:

- не запускать `$stage-launch-proof-loop`;
- не читать `.agent/stages/**/raw/**` и `.agent/tasks/**/raw/**` без точной ссылки на нужный артефакт;
- не создавать subagents;
- ограничить repo context командами `git status --short --branch`, `git diff --stat`, `git diff --name-status`, `git diff --check` и PR metadata;
- для `git diff --check` в publish-only режиме исключать raw evidence pathspec: `:(exclude).agent/stages/**/raw/**` and `:(exclude).agent/tasks/**/raw/**`;
- если current worktree уже содержит свежие committed evidence refs с PASS verifier для текущего HEAD, не повторять полный proof loop; достаточно указать имеющиеся команды/evidence в PR;
- если ветка разошлась с remote или `main` уже содержит часть истории, создать чистую publish branch от `origin/main` и перенести только publish commit(s);
- создавать PR и merge через `gh` CLI, если GitHub app возвращает `403 Resource not accessible by integration`;
- при явной команде пользователя merge допускается без ожидания review, если PR mergeable, проверки зелёные или их отсутствие/ограничение явно зафиксировано.

Fast publish mode не ослабляет требования для изменения кода. Он только запрещает повторно исполнять и перечитывать stage harness при операции публикации уже подготовленного diff.

## 4. Рабочий стиль по умолчанию

- Маленькие, верифицируемые slices.
- Один write-unit за раз, если нет явной независимости.
- Safe parallelism: максимум 1–2 параллельных write-unit, только если они не делят файлы, схемы, API contracts, общие docs или общие configs.
- Перед изменениями читать stage-file, sprint/task file и ближайший `AGENTS.md`.
- Не расширять scope stage самовольно.
- При trade-off приоритет: correctness, reproducibility, trust, auditability, user comprehension.

## 5. Карта репозитория

Целевой baseline layout:

- `apps/web` — пользовательское Next.js + React web-приложение, mobile-first UI;
- `apps/admin` — отдельная Next.js admin/CMS для операторов, редакторов и поддержки;
- `apps/api` — Spring Boot + Java + Maven backend API, jobs, integrations, admin backend surface;
- `packages/ui` — shared React UI primitives и дизайн-система;
- `packages/config` — shared TS configs, eslint configs, tooling presets;
- `packages/api-client` — generated TS client and contract types from backend OpenAPI;
- `content/` — dev fixtures, import/export bundles and preview artifacts; production content source of truth is CMS/PostgreSQL;
- `infra/` — local docker compose, cloud notes/IaC;
- `tests/e2e` — end-to-end scenarios;
- `docs/` — stage docs, architecture, engineering policies, legal drafts, product docs;
- `.agent/stages/<stage_id>/` — stage memory, proof bundles, audits;
- `.agent/tasks/<task_id>/` — optional task-level proof bundles outside stage run;
- `.codex/` — project-scoped Codex config and custom agents;
- `.agents/skills/` — repo-local skills.

## 6. Обязательные root-команды

Репозиторий должен предоставлять стабильные wrapper-команды из корня:

- `make install` — JS dependencies and Java/Maven toolchain;
- `make init` — migrations + versioned local bootstrap + demo seed;
- `make dev` — local infrastructure and dev services;
- `make verify` — lint + typecheck + backend quick verification;
- `make test-unit` — unit/integration checks without browser e2e layer;
- `make test-e2e` — e2e/smoke user scenarios;
- `make build` — production-like build.

Для `apps/api` baseline command is Maven Wrapper, for example `cd apps/api && ./mvnw verify`. Root `make` wrappers may delegate to Maven.

## 7. Контракт init/dev

`make init` должен быть versioned and idempotent:

- запускает PostgreSQL migrations;
- применяет dev bootstrap/seed;
- хранит факт выполнения и версию bootstrap в базе;
- при повторном запуске пропускает seed, если актуальная версия уже была применена;
- допускает явный `force`, но не использует его по умолчанию.

Рекомендуемый baseline: table `dev_bootstrap_runs`, key `local_init`, manifest `scripts/init/version.json`, synthetic demo data only.

## 8. Технологические guardrails

### Frontend

- `apps/web` and `apps/admin` — Next.js + React.
- Business logic remains backend-owned.
- Contract types come from `packages/api-client`.
- User-facing copy, labels, help text and empty states are Russian.
- `apps/web` is mobile-first.
- MVP product baseline — B2B-first mobile web для корпоративного пилота; бренд заказчика не должен появляться в employee-facing UI без отдельного human-approved stage decision.
- User-visible changes need screenshot/browser evidence.

### Backend

- `apps/api` — Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway, OpenAPI/springdoc.
- Controllers stay thin; business rules live in service/domain layers.
- DB schema changes use append-only Flyway migrations.
- Public API contract must be reflected in OpenAPI and synchronized with generated client notes.
- Do not manually edit generated contract artifacts without updating source.
- JUnit + Testcontainers are expected for critical auth/session, points ledger, redemption, CMS publishing, diagnostics scoring, and support/admin integration paths.

### Content and CMS

- Production source of truth for lessons, quizzes, challenge and marathon is CMS/PostgreSQL.
- `content/` is for fixture/import/export/local preview only.
- Public wording, lesson meaning, legal-sensitive text and reward rules require explicit evidence and human-gate status.

### Domain economics

- Base reward entity in code is `points`.
- `points` are not money and must not be modeled as a monetary balance.
- Points ledger is separate, auditable, and idempotent.
- Redemption, raffle, partner rewards, billing-adjacent rules are risk-heavy.

### B2B MVP baseline

- Current MVP product-intent baseline is `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`.
- Current MVP product-design style baseline is `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`; use it for UI implementation, design tokens, component QA, screen generation and visual consistency checks, with `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png` as companion artifact only.
- MVP — single corporate pilot contour with `tenant`, pilot launch, access pool of invite codes, HR/sponsor reporting, privacy aggregation and merch operations.
- MVP не является in-app subscription product; коммерческий доступ продаётся по корпоративному договору вне приложения.
- Employee-facing reports for HR по умолчанию агрегируют диагностику/прогресс; персональные финансовые ответы не раскрываются.
- Self-service multi-tenant enterprise platform, SSO/SCIM and customer white-label UI — later-stage work, если stage doc явно не вводит узкий approved slice.

### Access, roles and subscriptions

- Canonical guardrails: `docs/architecture/access-and-subscriptions.md`.
- Detailed model for `Organization`, `OrgMembership`, invitations, organization codes, subscriptions and seats: `docs/architecture/organization-access-subscription-model.md`.
- Do not model a user with a single `user.organization_id`; use `org_membership` when account/organization membership becomes part of a slice.
- Create `OrgMembership` only after invitation/code acceptance and identity verification/authentication; invitation links must not double as unsafe password setup links.
- Organization codes are separate revocable entities with hashed codes, status, limits and expiry, not plain fields on `Organization`.
- Roles are administrative/operational authorization only; do not model `pro_user`, `premium` or subscription state as RBAC roles.
- Product access should resolve from canonical source records (`user_subscriptions`, `org_subscriptions`, `org_subscription_seats`) or an optional entitlement/projection layer built from those records.
- B2B pro-seat access must be scoped to organization or membership; it must not leak across another organization of the same user.
- Personal Pro does not expand corporate Organization context; Organization subscription does not expand personal context.
- Billing, pricing, paywall, refunds, B2B contract quantities and real paid-tier reward rules remain human-gated.

## 9. Documentation workflow

Before closing substantial product, architecture, workflow, API, setup or integration work, read `docs/architecture/documentation-workflow.md`.

Rules:
- update the narrowest canonical doc that owns the changed decision;
- stage artifacts are proof/handoff, not canonical docs replacement;
- add or refresh Mermaid diagrams for non-trivial flows, state machines and cross-module interactions;
- material documentation drift is a verifier proof gap;
- if doc update is deferred, record exact gap and reason in stage artifacts.

## 10. Языковая политика

- Code, identifiers, file names, branch names, technical keys — English.
- Docs, stage docs, AGENTS, PR descriptions, UI copy and operational text — Russian.
- Conventional commit type/scope may be English; summary and PR body should be Russian.

## 11. Definition of done and evidence

Перед закрытием execution unit:

- acceptance criteria are mapped to evidence;
- relevant root commands or Maven/package commands are run and recorded;
- UI changes include screenshots or explicit limitation;
- schema/API changes include migrations, OpenAPI notes, generated client notes;
- content changes include entity IDs and wording review status;
- docs are synchronized if behavior/workflow/contract/operating guide changed;
- latest fresh verifier verdict is PASS or honest non-pass status is recorded.

См. `docs/engineering/definition-of-done.md`.

## 12. Human gates

Agent may prepare drafts and code, but cannot fully approve:

- legal texts: privacy, terms, disclaimers, consent copy;
- final financial correctness of lessons/explanations/quizzes;
- reward economy rules, raffles, partner terms;
- B2B privacy/reporting boundaries, customer-specific analytics and обработка реальных employee data;
- pricing, paywall boundaries, billing policy;
- final public brand/lore/campaign copy;
- real partners, real rewards, real fulfillment operations.

Valid statuses: `DONE`, `DONE_WITH_HUMAN_PENDING`, `WAITING_HUMAN`, `BLOCKED`, `IN_PROGRESS`.

## 13. Что нельзя делать

- Обещать финансовую выгоду, быстрый доход, “безрисковые” результаты или guaranteed debt relief.
- Hardcode lore/marketing copy into the domain model so it cannot be replaced.
- Log secrets, tokens, PII or real financial data.
- Use real personal or financial data in seed/demo/test fixtures.
- Mix unrelated feature/fix/refactor/docs work in one PR.
- Declare a stage complete while human gates are pending.
