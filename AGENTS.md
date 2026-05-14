# AGENTS.md

Постоянные инструкции для Codex и других coding agents в продуктовом репозитории FinLit.

<!-- BEGIN FINLIT STAGE HARNESS -->
Используй repo-local FinLit stage harness для исполнения `docs/stages/MVP.md`, `docs/stages/v1.md` и `docs/stages/v2.md`.

Core rules:
- durable stage artifacts: `.agent/stages/<stage_id>/`;
- one top-level `stage_orchestrator` per stage run;
- classify every slice before choosing workflow: Tier C low-risk, Tier B integration, Tier A regulated/high-risk;
- bounded leaf subagents only when useful; no recursive child orchestration;
- `stage_spec_freezer` is required for Tier A and optional for Tier B/C when scope is already clear;
- one integration `stage_builder` or current-session builder owns implementation + evidence for a slice;
- every Tier A/stage-close verify pass uses a fresh `stage_verifier`; Tier B uses fresh verifier or explicit compact verifier summary; Tier C may use focused tests plus compact final proof;
- verifier must not edit production code;
- fixer changes only concrete verifier-reported proof gaps;
- no feature, execution unit, sprint contract, or stage is DONE without proportionate evidence;
- canonical docs update only when the slice changes public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow, or reusable operating contract;
- substantial Tier A work closes only after doc-sync, evidence update, and fresh verification; Tier B/C use compact proof unless risk escalates;
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
- `.codex/agents` держит shallow tree: max depth 1, child agents are leaf roles; default max concurrent agent threads is 2.
- Для risky commands, network, destructive ops, migrations against non-local DB, secrets, and deployment actions agent must ask approval.

## 3. Обязательная маршрутизация workflow

- Для исполнения stage-файлов использовать `$stage-launch-proof-loop`.
- Перед выбором workflow классифицировать slice:
  - Tier C — code-first low-risk: small UI/copy/test/refactor/component behavior without API/schema/security/privacy/legal/financial/content-publish/reward/admin-sensitive/access-control impact. Workflow: code first, focused tests, compact proof in final report or `.agent/tasks`, no default subagents, no default canonical doc update.
  - Tier B — integration: Web/API/client or endpoint work without regulated boundary changes. Workflow: compact sprint/proof/verdict, focused integration checks, fresh verifier or explicit compact independent verification.
  - Tier A — regulated/high-risk: schema, auth/session/access, diagnostics scoring, HR/privacy/reporting, legal/financial wording, content/CMS publish approval, points/rewards/redemption, real data, destructive admin or production operations. Workflow: full proof loop `spec freeze -> build -> evidence -> fresh verify -> minimal fix -> fresh verify`.
- Для stage-level work and Tier A tasks использовать integrated proof loop. Tier B/C escalate to full loop immediately if touched files or findings cross Tier A boundaries.
- Все stage/task artifacts хранить только внутри репозитория.
- Нельзя self-certify Tier A/stage-close кодовую задачу без fresh verification. Tier B/C must still have focused test evidence and an honest limitation note.
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

## 3.2 Post-PASS publish and continuation handoff

Для stage/task execution, где активный prompt, sprint contract или `publish_manifest.json` явно включает `publish_after_pass=true`, агент после свежего verifier `PASS` обязан выполнить финальную publish-and-handoff фазу через repo-local skill `$push-main`.

Preconditions:
- latest fresh verifier verdict is `PASS`;
- evidence/proof summary, docs when required, `status.json`/current state and publish inputs are актуальны;
- human-gated items не объявлены полностью закрытыми без человека;
- worktree diff содержит только файлы текущего slice или точный blocker recorded;
- `git diff --check` проходит для publish scope, excluding raw evidence pathspecs when needed.

Delegation:
- stage harness owns PASS preconditions, evidence/doc/status consistency and continuation prompt;
- `$push-main` owns publish mechanics: branch, commit, PR to `main`, merge when allowed, local switch to `main`, `git pull --ff-only`;
- `publish_manifest.json` may provide compact PR/validation/proof refs for `$push-main`; for Tier C/B publish-only flows the PR body can carry the same compact proof instead of tracking a manifest file;
- if `$push-main` reports push, PR, merge, branch protection, checks or permission blocker, stage harness records/reports that blocker and does not bypass protection rules.

`$push-main` must not publish unrelated changes, rerun the stage harness, create subagents, or blanket-read raw evidence.

Final chat handoff:
- последний ответ после publish flow содержит copyable continuation prompt только если stage prompt or publish request explicitly asked for continuation handoff;
- prompt должен instruct `stage_orchestrator` and bounded leaf subagents to continue product development from updated `main`;
- prompt must preserve the proof loop: `spec freeze -> build -> evidence -> fresh verify -> minimal fix -> fresh verify`;
- prompt must ask for significant product progress on the next highest-impact verified slice, not analysis-only work;
- prompt must tell the next agent to repeat this post-PASS publish flow and print the next continuation prompt.

## 4. Рабочий стиль по умолчанию

- Маленькие, верифицируемые slices.
- First meaningful diff for product slices should be in `apps/**`, `packages/**` or tests before `.agent/**`/docs proof churn. Use `node scripts/check-code-first-slice.mjs` for Tier B/C guardrails when the slice changes product code.
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
- `make proof-lite` — lightweight harness/bootstrap and diff hygiene checks;
- `make verify-web` — focused employee web type/test/build checks;
- `make verify-api` — backend Maven verify + API client contract checks;
- `make verify-full` — full harness/bootstrap, web/admin and backend checks;
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
- update the narrowest canonical doc that owns the changed decision only when the slice changes public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow, or reusable operating contract;
- stage artifacts are proof/handoff, not canonical docs replacement;
- add or refresh Mermaid diagrams for non-trivial flows, state machines and cross-module interactions;
- material documentation drift is a verifier proof gap; pure implementation details and already-covered behavior belong in PR body/proof notes, not canonical docs;
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
- docs are synchronized if public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract changed;
- Tier A/stage-close latest fresh verifier verdict is PASS or honest non-pass status is recorded; Tier B/C use compact proof and focused verification unless risk escalates.

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
