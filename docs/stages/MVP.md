---
stage_id: MVP
product_name: Финансовая грамотность — web-first edtech platform
document_type: stage-source-of-truth
owner_role: parent-stage-agent
default_model: gpt-5.5
default_reasoning_effort: xhigh
task_execution_mode: stage-launch-proof-loop
last_updated: 2026-03-26
language: ru
---

# MVP — stage source of truth

Этот файл — неизменяемый источник истины для stage-агента.  
Он не является журналом прогресса. Журнал прогресса, решения, риски и task-files должны вестись отдельно в `.agent/stages/mvp/`.

## Как агент должен использовать этот файл

- Читать этот файл как главный scope-документ MVP.
- Не расширять scope за пределы `In scope`.
- Любую крупную задачу сначала нормализовать в execution unit с собственным `TASK_ID`.
- Каждую execution unit выполнять через task-level proof loop: `spec -> build -> evidence -> fresh verify -> fix -> fresh verify`.
- Любой unit, который не помещается в один proof loop, сначала дробить на дочерние task-files.
- Параллелить только задачи, которые не пишут в одни и те же директории и не зависят друг от друга.
- Все user-visible и бизнес-критичные изменения подтверждать тестами, скриншотами и/или e2e-проверками.

## Цель этапа

Довести продукт до закрытой beta-версии, где пользователь может:
1. зарегистрироваться;
2. пройти входной диагностический тест;
3. получить персональный маршрут;
4. изучить урок;
5. пройти тест/упражнение;
6. получить баллы;
7. пройти daily challenge и простой marathon;
8. потратить баллы в простом магазине;
9. настроить профиль;
10. обратиться в поддержку и запросить индивидуальный план.

## Базовые архитектурные допущения

Если в репозитории ещё нет утверждённой архитектуры, использовать как baseline:

- monorepo: `pnpm` + `turborepo` для JS/TS workspaces, `Maven Wrapper` для `apps/api`;
- `apps/web` — адаптивное user-facing web-приложение на Next.js (mobile-first, PWA-ready);
- `apps/admin` — отдельная Next.js admin/CMS surface для редакторов, операторов и поддержки;
- `apps/api` — Java Spring API + jobs + admin/backend endpoints;
- `packages/ui` — shared UI-kit;
- `packages/config` — shared frontend/tooling configs;
- `packages/api-client` — generated TypeScript client из backend OpenAPI;
- `content/` — только fixture/import/export слой и preview artifacts; production source of truth для контента — CMS/PostgreSQL;
- `docs/` — ADR, product docs, legal drafts, stage docs;
- PostgreSQL как основное хранилище;
- CMS подключена к PostgreSQL и хранит уроки, квизы, challenge и marathon;
- object storage для медиа;
- event tracking + product analytics;
- отдельный points ledger, не связанный напрямую с реальными деньгами;
- production infra ориентирована на Yandex Cloud: Managed PostgreSQL, Serverless Containers, Object Storage и при необходимости Redis.

## Продуктовые допущения

- Разделы продукта: `Обучение / Магазин / Профиль`.
- Уровни прогрессии: `Новичок / Знаток / Продвинутый / Эксперт`.
- В MVP полностью наполняется `Новичок`, частично — `Знаток`, остальные уровни существуют в модели данных и интерфейсе, но не требуют полного контентного покрытия.
- Лор должен усиливать ощущение движения вперёд, но не делать продукт инфантильным.
- Тон коммуникации: спокойный, практичный, без шейминга, без токсичной “успешности”, без обещаний “разбогатеть быстро”.
- UI может брендировать баллы, но в коде базовая сущность должна называться нейтрально: `points`.

## Лор baseline

Использовать такой baseline, если пользователь не утвердил другой:

- Narrative frame: путь от финансового хаоса к контролю и устойчивости.
- Mentor system:
  - `Навигатор` — вводит в маршрут и объясняет систему;
  - `Практик` — отвечает за повседневные деньги, бюджет, платежи;
  - `Аналитик` — помогает разбирать риски, долги, условия продуктов;
  - `Стратег` — связан с целями, накоплениями и долгосрочными решениями.
- Challenges — “задания дня”.
- Marathons — “серии заданий”.
- Store — “витрина наград”, без жёсткой привязки к азартной терминологии.
- Нельзя хардкодить лор в доменной модели так, чтобы нельзя было сменить копирайт позже.

## In scope

- Полный core loop обучения.
- Полный уровень `Новичок`.
- Частичный уровень `Знаток`.
- Входной диагностический тест.
- Персональный маршрут по темам.
- Базовая геймификация: streak, XP/points, achievements-lite.
- Daily challenge.
- Простой multi-day marathon.
- Кошелёк баллов.
- Простой магазин внутренних наград/перков.
- Профиль, настройки, support, запрос индивидуального плана.
- Admin/CMS для уроков, тестов, challenge, marathon, rewards.
- Analytics, legal drafts, QA, closed beta readiness.

## Out of scope

- Полноценный social graph и знакомства между пользователями.
- Командные марафоны.
- Полноценные лиги/сезоны.
- Partner marketplace.
- Сложные юридически нагруженные розыгрыши.
- AI tutor.
- Автоматически генерируемые индивидуальные планы.
- Полное B2B / multi-tenant.
- Полная локализация и multi-region.
- Сложная enterprise security/compliance программа.

## Human gates

Следующие точки не могут считаться полностью закрытыми только кодинг-агентом:

- Финальное экспертное подтверждение корректности финансового контента.
- Юридическое ревью disclaimer-текстов, terms/privacy и reward-модели.
- Выбор реальных наград, партнёров и правил выдачи.
- Набор beta-пользователей и фактическая операционная поддержка beta.
- Финальное бренд-утверждение визуального языка и lore.

## Exit gates

MVP считается завершённым только если одновременно выполнено всё ниже:

- Работает путь `signup/login -> diagnostic -> personal route -> lesson -> quiz -> reward`.
- Есть минимум один полноценный контентный трек `Новичок`.
- Есть минимум 12 daily challenge и 1 marathon на 7 дней.
- Работает начисление и списание баллов.
- Работает простой магазин минимум с 2 типами внутренних наград.
- Работают профиль, настройки уведомлений, support form и request for individual plan.
- Работает admin CRUD для lesson / quiz / challenge / marathon / reward.
- Есть event tracking и дашборды по activation/retention/core learning loop.
- Есть legal drafts и явные human-gate placeholders для ревью.
- Пройдены smoke/e2e для критических пользовательских сценариев.
- Stage audit по MVP не содержит блокирующих FAIL/UNKNOWN.

## Правила дробления задач

Execution unit должна быть разбита ещё сильнее, если выполняется хотя бы одно условие:

- unit затрагивает более трёх bounded context одновременно;
- unit меняет и backend, и frontend, и admin, и analytics в одном diff;
- unit невозможно верифицировать локально;
- unit не имеет наблюдаемого пользовательского результата;
- unit не помещается в один proof loop без размытия acceptance criteria.

## Стандарт верификации

Для кодовых unit по умолчанию собирать:
- changed files;
- миграции и seed notes;
- команды `lint`, `typecheck`, `test`, `build`;
- e2e/smoke для user-visible flows;
- screenshots для ключевых экранов;
- обновление docs при изменении поведения.

Для контентных unit по умолчанию собирать:
- content diff;
- список lesson/question/challenge IDs;
- preview screenshots;
- checklist fact-check/review status;
- список unresolved wording/legal issues.

## Порядок исполнения workstream-ов

Нормальный порядок: `MVP-01 -> MVP-02 -> MVP-03 -> MVP-04 -> MVP-05 -> MVP-06 -> MVP-07 -> MVP-08 -> MVP-09 -> MVP-10 -> MVP-11 -> MVP-12`.

Допустимое безопасное распараллеливание:
- `MVP-03` и `MVP-04` можно частично вести параллельно после готовности `MVP-01` и `MVP-02`;
- контентный pipeline из `MVP-04` можно вести параллельно с `MVP-05` и `MVP-06`;
- `MVP-11` может стартовать частично до финала остальных workstream-ов, но stage close нельзя делать до его завершения.

---

## MVP-01. Platform foundation and developer workflow

**Goal:** создать технический фундамент, на котором дальнейшие агентные итерации будут воспроизводимыми, проверяемыми и безопасными.

**Dependencies:** none  
**Parallelism:** none until repo skeleton is stable

### Execution units
- MVP-01.01 [agent] Зафиксировать целевую repo-структуру и stack baseline
- MVP-01.02 [agent] Поднять monorepo, workspace tooling и shared configs
- MVP-01.03 [agent] Поднять базовый web shell и backend service
- MVP-01.04 [agent] Настроить database schema bootstrap, migrations и seed strategy
- MVP-01.05 [agent] Настроить env templates, secret conventions и local docker/dev orchestration
- MVP-01.06 [agent] Настроить CI для lint / typecheck / test / build
- MVP-01.07 [agent] Создать AGENTS.md, ADR template, issue/PR templates, changelog conventions

### Acceptance criteria
- Чистый clone репозитория поднимается локально по documented steps.
- Команды качества запускаются из корня monorepo.
- Есть единый способ seed/init локальной среды.
- Repo guidance достаточно полон, чтобы новый agent мог начать работу без ручного расспроса.

### Evidence required
- Команды локального запуска.
- Вывод CI.
- Скриншоты стартовых экранов web/api health.
- Ссылки на созданные docs.

---

## MVP-02. Domain model, API contract and seed data

**Goal:** закрепить доменную модель продукта и исключить хаотичное расползание сущностей в кодовой базе.

**Dependencies:** MVP-01  
**Parallelism:** low

### Execution units
- MVP-02.01 [agent] Описать core domain entities и связи между ними
- MVP-02.02 [agent] Построить ERD и migration roadmap
- MVP-02.03 [agent] Зафиксировать API contract style, error envelope и auth boundaries
- MVP-02.04 [agent] Зафиксировать event taxonomy и audit log schema
- MVP-02.05 [agent] Подготовить demo users, seed content и faker-based demo data
- MVP-02.06 [agent] Подготовить ADR по points ledger и reward redemption boundaries

### Acceptance criteria
- Все ключевые сущности покрыты migration-friendly schema.
- Понятно, где хранится domain truth для progress, attempts, wallet и rewards.
- API errors и auth flows единообразны.
- Есть seed-данные, достаточные для UI и e2e.

### Evidence required
- ERD.
- Миграции.
- Seed report.
- API examples / OpenAPI or contract docs.

---

## MVP-03. UX/UI foundation, brand and lore system

**Goal:** собрать целостный визуальный и narrative baseline для mobile/desktop web-продукта.

**Dependencies:** MVP-01, MVP-02  
**Parallelism:** medium after foundation

### Execution units
- MVP-03.01 [agent+human] Зафиксировать brand core, voice principles и anti-shame copy rules
- MVP-03.02 [agent+human] Зафиксировать lore baseline, mentor system и naming rules
- MVP-03.03 [agent] Построить IA и navigation map для Education / Store / Profile
- MVP-03.04 [agent] Спроектировать mobile-first wireframes для core screens
- MVP-03.05 [agent] Спроектировать desktop adaptations и responsive rules
- MVP-03.06 [agent] Реализовать design tokens, typography scale, spacing system и базовые компоненты
- MVP-03.07 [agent] Реализовать app shell, layout states, nav components, empty/loading/error states
- MVP-03.08 [agent] Определить content blocks для text/video/callout/table/checklist/quiz intro

### Acceptance criteria
- Есть единая навигация и дизайн-система, пригодная для дальнейшей сборки экранов.
- Mobile и desktop не расходятся по IA.
- Лор усиливает мотивацию, но не мешает восприятию финансового контента.
- Все core screens можно собрать из системных компонентов без ad hoc UI.

### Evidence required
- Figma-equivalent exports or markdown specs.
- Screenshots of shell and components.
- Copy principles doc.
- Lore baseline doc.

---

## MVP-04. Pedagogy and content factory

**Goal:** создать контентный конвейер, который позволит агентам и редакторам стабильно производить lessons, quizzes, challenges и marathons.

**Dependencies:** MVP-02, MVP-03  
**Parallelism:** medium

### Execution units
- MVP-04.01 [agent+human] Зафиксировать competency matrix и topic tree по 4 уровням
- MVP-04.02 [agent+human] Зафиксировать learning outcomes и mastery rules
- MVP-04.03 [agent] Создать lesson template для text-first и video-first уроков
- MVP-04.04 [agent] Создать quiz template и explanation template
- MVP-04.05 [agent+human] Собрать полный curriculum уровня Новичок
- MVP-04.06 [agent+human] Собрать teaser/partial curriculum уровня Знаток
- MVP-04.07 [agent+human] Создать банк вопросов и объяснений для MVP-тем
- MVP-04.08 [agent+human] Создать банк daily challenge
- MVP-04.09 [agent+human] Создать skeleton marathon на 7 дней
- MVP-04.10 [agent] Подготовить content import format и content QA checklist
- MVP-04.11 [agent+human] Подготовить fact-check и expert review workflow

### Acceptance criteria
- Достаточно материалов для прохождения полноценного MVP-трека.
- Контент можно хранить, импортировать и версионировать без ручного хаоса.
- У lessons, quizzes и challenges есть единообразные templates.
- На контент есть review gates и понятные unresolved labels.

### Evidence required
- Curriculum map.
- Lesson/question/challenge IDs.
- Preview artifacts.
- Review checklist and status markers.

---

## MVP-05. Authentication, roles, profile base

**Goal:** реализовать управляемую и безопасную пользовательскую основу.

**Dependencies:** MVP-01, MVP-02, MVP-03  
**Parallelism:** medium

### Execution units
- MVP-05.01 [agent] Реализовать регистрацию, login, logout, password reset baseline
- MVP-05.02 [agent] Реализовать role model и permission checks
- MVP-05.03 [agent] Реализовать profile schema, profile edit и avatar/preferences
- MVP-05.04 [agent] Реализовать notification settings и privacy toggles
- MVP-05.05 [agent] Реализовать session/device management baseline
- MVP-05.06 [agent] Реализовать subscription placeholder/current plan screen
- MVP-05.07 [agent] Реализовать account deletion request и data export placeholder flows

### Acceptance criteria
- Пользователь может безопасно войти, выйти и отредактировать профиль.
- Есть различение user/admin/support roles.
- Профиль и настройки устойчивы к повторным входам и разным устройствам.
- Billing может быть расширен без переделки account model.

### Evidence required
- Auth flow tests.
- Screenshots of profile/settings.
- Permission tests.
- Audit entries for sensitive actions.

---

## MVP-06. Learning content delivery and admin CMS

**Goal:** дать команде инструмент собирать и публиковать обучение без правок кода на каждый урок.

**Dependencies:** MVP-02, MVP-03, MVP-04, MVP-05  
**Parallelism:** low-medium

### Execution units
- MVP-06.01 [agent] Реализовать admin CRUD для levels/modules/topics/lessons
- MVP-06.02 [agent] Реализовать admin CRUD для question banks
- MVP-06.03 [agent] Реализовать admin CRUD для challenge/marathon definitions
- MVP-06.04 [agent] Реализовать lesson renderer для text/video/content blocks
- MVP-06.05 [agent] Реализовать content states draft/review/published/archived
- MVP-06.06 [agent] Реализовать content versioning baseline
- MVP-06.07 [agent] Реализовать learning map и level/module unlock logic
- MVP-06.08 [agent] Реализовать lesson analytics hooks и publish validation

### Acceptance criteria
- Админ может создать и опубликовать lesson без ручного редактирования runtime-кода.
- Уроки рендерятся одинаково на mobile и desktop.
- Публикация контента проверяет обязательные поля и связность.
- Unlock logic не позволяет пользователю обойти progression rules.

### Evidence required
- Admin screenshots.
- Published lesson preview.
- Permission and publish validation tests.
- Content versioning examples.

---

## MVP-07. Diagnostic test and personalized route

**Goal:** реализовать персональный стартовый сценарий вместо линейного forced onboarding.

**Dependencies:** MVP-04, MVP-05, MVP-06  
**Parallelism:** low

### Execution units
- MVP-07.01 [agent+human] Зафиксировать diagnostic taxonomy и scoring dimensions
- MVP-07.02 [agent] Реализовать diagnostic test engine
- MVP-07.03 [agent] Реализовать scoring rules и skill graph v1
- MVP-07.04 [agent] Реализовать personalized route generator и UI выдачи маршрута
- MVP-07.05 [agent] Реализовать manual support request на индивидуальный план
- MVP-07.06 [agent] Реализовать admin override tools для маршрута и recommended topics

### Acceptance criteria
- Пользователь после диагностики получает прозрачный и объяснимый маршрут.
- Scoring воспроизводим и тестируем.
- Support может вручную скорректировать путь.
- Диагностика не ломает основной линейный сценарий, если её пропустить/прервать.

### Evidence required
- Diagnostic sample sets and scoring output.
- UI screenshots.
- Admin override screenshots.
- Tests for route generation edge cases.

---

## MVP-08. Quiz engine, progress, XP and remediation

**Goal:** закрыть основной learning loop после урока.

**Dependencies:** MVP-06, MVP-07  
**Parallelism:** low

### Execution units
- MVP-08.01 [agent] Реализовать quiz engine для single-choice и multi-choice вопросов
- MVP-08.02 [agent] Реализовать answer evaluation и explanation screen
- MVP-08.03 [agent] Реализовать attempt tracking, pass/fail states и retry rules
- MVP-08.04 [agent] Реализовать progress model по lesson/module/level
- MVP-08.05 [agent] Реализовать XP/points/streak baseline
- MVP-08.06 [agent] Реализовать achievement-lite и completion celebrations
- MVP-08.07 [agent] Реализовать remediation queue для слабых тем
- MVP-08.08 [agent] Реализовать progress widgets и history in profile/education

### Acceptance criteria
- После урока пользователь проходит тест и получает понятный результат.
- Прогресс устойчиво хранится и корректно отображается.
- Баллы и streak начисляются идемпотентно.
- При провале формируется понятный путь повторения.

### Evidence required
- Unit/integration tests for scoring and idempotency.
- Screenshots of quiz results and progress widgets.
- Seeded scenarios for pass/fail/retry/remediation.

---

## MVP-09. Challenges, marathons and motivational loop

**Goal:** добавить ежедневную и многодневную активность поверх core learning loop.

**Dependencies:** MVP-04, MVP-08  
**Parallelism:** medium

### Execution units
- MVP-09.01 [agent] Реализовать daily challenge engine
- MVP-09.02 [agent] Реализовать enrollment и participation flow для marathon
- MVP-09.03 [agent] Реализовать day-by-day marathon progression
- MVP-09.04 [agent] Реализовать daily goals и missed-day logic
- MVP-09.05 [agent] Реализовать reminder scheduling baseline
- MVP-09.06 [agent] Реализовать lightweight leaderboard
- MVP-09.07 [agent] Реализовать anti-cheat basics и duplicate attempt guards

### Acceptance criteria
- Пользователь может пройти challenge за один день и marathon за несколько дней.
- Награды начисляются корректно и не дублируются.
- Пропуск дня обрабатывается по понятным правилам.
- Leaderboard не ломает приватность и не требует сложного social graph.

### Evidence required
- Scenario tests for challenge/marathon.
- Reminder job logs.
- Leaderboard screenshots.
- Anti-cheat/idempotency tests.

---

## MVP-10. Points wallet and simple internal store

**Goal:** дать пользователю наблюдаемую ценность от геймификации без сложной marketplace-операционки.

**Dependencies:** MVP-08, MVP-09  
**Parallelism:** low

### Execution units
- MVP-10.01 [agent] Реализовать points ledger и transaction model
- MVP-10.02 [agent] Реализовать accrual/spend rules и idempotency
- MVP-10.03 [agent] Реализовать wallet UI и transaction history
- MVP-10.04 [agent] Реализовать reward catalog model и admin CRUD
- MVP-10.05 [agent] Реализовать simple redeem flow для внутренних наград
- MVP-10.06 [agent] Реализовать order/fulfillment statuses и manual ops flow
- MVP-10.07 [agent+human] Подготовить legal boundary notes для non-cash reward model

### Acceptance criteria
- Баллы начисляются и списываются через отдельный ledger.
- Пользователь видит историю операций.
- Redeem flow не допускает double-spend.
- Админ видит pending / fulfilled / cancelled rewards.
- Reward model не заявлена как денежный эквивалент.

### Evidence required
- Ledger tests.
- Wallet and store screenshots.
- Idempotency proofs.
- Admin fulfillment screenshots.
- Legal note draft.

---

## MVP-11. Support, trust, legal and analytics baseline

**Goal:** закрыть operational readiness и доверительную часть продукта.

**Dependencies:** MVP-05 through MVP-10  
**Parallelism:** medium

### Execution units
- MVP-11.01 [agent] Реализовать support form, ticket schema и admin console
- MVP-11.02 [agent] Реализовать FAQ/help center shell
- MVP-11.03 [agent+human] Подготовить drafts для Privacy Policy, Terms, financial disclaimers
- MVP-11.04 [agent] Реализовать consent/cookies flow и legal page routing
- MVP-11.05 [agent] Реализовать event tracking, funnels и базовые product dashboards
- MVP-11.06 [agent] Реализовать admin audit logs и sensitive action history
- MVP-11.07 [agent] Реализовать baseline для email/in-app notifications
- MVP-11.08 [agent] Реализовать accessibility, rate limit, abuse protection и security hardening baseline

### Acceptance criteria
- Пользователь может обратиться в поддержку, а support — обработать обращение.
- Есть юридические drafts, встроенные legal pages и consent flow.
- Ключевые события core loop попадают в аналитику.
- Есть журнал админских и чувствительных действий.
- Продукт проходит базовый accessibility/security smoke check.

### Evidence required
- Support console screenshots.
- Legal drafts.
- Event list and dashboard screenshots.
- Security/accessibility test artifacts.

---

## MVP-12. QA, beta package and stage close

**Goal:** подготовить продукт к закрытому запуску и сделать stage close воспроизводимым.

**Dependencies:** MVP-01 through MVP-11  
**Parallelism:** low

### Execution units
- MVP-12.01 [agent] Подготовить scripted smoke scenarios и demo accounts
- MVP-12.02 [agent] Поднять unit/integration/e2e coverage для критического пути
- MVP-12.03 [agent] Подготовить observability baseline, alerts и error dashboards
- MVP-12.04 [agent+human] Подготовить beta feedback capture, triage flow и support handbook
- MVP-12.05 [agent+human] Подготовить go/no-go checklist и operational runbook
- MVP-12.06 [agent+human] Провести beta hardening wave и stage audit closeout

### Acceptance criteria
- Критические user journeys покрыты smoke/e2e.
- Ошибки и деградации наблюдаемы.
- Команда может провести controlled beta without improvisation.
- Stage audit фиксирует только допустимые post-MVP follow-ups.

### Evidence required
- Test artifacts.
- Monitoring screenshots.
- Runbooks.
- Beta checklist.
- Stage audit output.

## Canonical MVP topic baseline

### Новичок
- Деньги и личный бюджет
- Доходы, расходы и финансовые привычки
- Банковские карты, счета и переводы
- Безопасность, мошенничество, цифровая гигиена
- Долги и кредиты: базовое понимание рисков
- Цели и накопления
- Финансовая подушка: зачем и как начать

### Знаток (partial in MVP)
- Стоимость кредита и переплата
- Платёжная дисциплина
- Права потребителя финансовых услуг
- Налоги и обязательные платежи: базовый обзор

## Suggested root directories and ownership boundaries

- `apps/web` — end-user app, marketing surface, admin UI shell
- `apps/api` — auth, progress, wallet, rewards, support, analytics ingestion
- `packages/ui` — design system
- `packages/domain` — shared domain models / schemas
- `packages/db` — Prisma or equivalent schema/migrations/seeds
- `content/lessons` — lessons
- `content/questions` — question banks
- `content/challenges` — daily challenge definitions
- `content/marathons` — marathon definitions
- `docs/legal` — legal drafts
- `docs/adr` — architecture decisions
- `.agent/stages/mvp` — stage execution artifacts
- `.agent/tasks/*` — task proof-loop artifacts

## Definition of done at execution-unit level

Любой execution unit можно отметить complete только если:
- frozen scope совпадает с unit title и acceptance criteria;
- код/контент/доки изменены минимально, но достаточно;
- evidence bundle создан;
- свежий verifier дал `PASS`;
- stage progress обновлён;
- если есть human gate, unit переведён в `WAITING_HUMAN` или `DONE_WITH_HUMAN_PENDING`, а не falsely complete.
