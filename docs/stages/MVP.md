---
stage_id: MVP
product_name: Финансовая грамотность — B2B-first employee financial wellbeing MVP
document_type: stage-source-of-truth
owner_role: parent-stage-agent
default_model: gpt-5.5
default_reasoning_effort: xhigh
task_execution_mode: stage-launch-proof-loop
product_foundation: docs/product/b2b-mvp/lemanapro/product-foundation-v1.md
product_methodology: docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md
last_updated: 2026-05-05
language: ru
---

# MVP — stage source of truth

Этот файл задаёт исполняемый scope MVP для stage-агента. Канонический продуктовый baseline: `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`; канонический baseline методологии обучения, диагностики and route rules: `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`.

Stage artifacts, progress, evidence, verdicts and audits must live in `.agent/stages/mvp/`. Этот файл не является журналом прогресса.

## Как агент должен использовать этот файл

- До spec freeze читать `AGENTS.md`, `docs/architecture/source-of-truth.md`, `docs/architecture/documentation-workflow.md`, этот файл, `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` and `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` for learning/content/diagnostic/support/reporting slices.
- Исполнять MVP как B2B-first corporate pilot, not as B2C/public-launch product.
- Не расширять scope за пределы `In scope`; disputed product intent возвращать в product foundation/stage docs before implementation.
- Любую крупную задачу нормализовать в execution unit with `TASK_ID`.
- Каждую execution unit выполнять через proof loop: `spec -> build -> evidence -> fresh verify -> fix -> fresh verify`.
- Параллелить только независимые задачи без shared files, schemas, API contracts, docs or configs.
- Все user-visible, privacy-sensitive, reward and B2B-reporting changes подтверждать evidence, tests and human-gate status.

## Цель этапа

Довести продукт до pilot-ready MVP для Волны 1 корпоративного B2B-пилота, где сотрудник может:

1. получить индивидуальный пригласительный код;
2. зарегистрироваться по коду, имени, email и телефону;
3. увидеть спокойный онбординг и экран приватности;
4. пройти входную диагностику;
5. получить персональный маршрут;
6. пройти первый 7-шаговый трек, мини-тесты и практические задания;
7. получать and spend `points`;
8. участвовать в daily challenge and накопительном челлендже;
9. купить мерч or internal бонус в магазине;
10. обратиться в поддержку and оставить feedback.

Для HR/wellbeing sponsor MVP должен дать агрегированные отчёты, достаточные для решения о масштабировании пилота.

## Product baseline

- MVP is B2B-first mobile web for Russia.
- Первый корпоративный контур: Лемана ПРО as internal/customer context; customer brand is not used in employee-facing UI.
- MVP supports one pilot tenant and launch waves; architecture must not block later multi-tenant scaling.
- Волна 0: 30-50 users for UX/content/reward/report validation.
- Волна 1: 500 employees, 6 active weeks; later expansion can reach 5000 after pilot decision.
- Target users: employees 23-30, office and store staff.
- Commercial model: corporate access by contract outside the app; no in-app subscription or payment in MVP.
- Access model: individual invite code; corporate SSO is out of MVP.
- Data collected in MVP: name, email, phone, invite code, learning events, diagnostics, points, merch orders, support/feedback.
- Product tone: calm mentor / financial trainer, no shame, no promises of fast income, no employer surveillance framing.
- Learning methodology v0.2 fixes the MVP route: diagnostics -> personalized route -> 7 short `Новичок` lessons -> mini-test -> practice -> points -> challenge/streak return.

## Architecture baseline

If repo state does not explicitly override it, use:

- monorepo with `apps/web`, `apps/admin`, `apps/api`, `packages/ui`, `packages/config`, `packages/api-client`;
- `apps/web`: Next.js + React employee-facing mobile-first web app;
- `apps/admin`: Next.js admin/CMS for product/admin/support/merch/HR-facing operations;
- `apps/api`: Spring Boot + Java 21 + Maven Wrapper + PostgreSQL + Flyway + OpenAPI/springdoc;
- CMS/PostgreSQL is production source of truth for lessons, quizzes, challenges and rewards;
- `content/` is fixture/import/export/preview only;
- points ledger is separate, auditable and idempotent;
- event tracking covers activation, diagnostics, learning, points, store, support and reports;
- production infra remains Yandex Cloud oriented unless later docs change it.

## Domain contracts

Use these product/domain concepts consistently during implementation:

- `tenant`: one corporate pilot contour in MVP; self-service multi-tenant enterprise platform is later scope.
- `cohort/wave`: launch group linked to invite codes and reporting.
- `invite code`: individual code activated once and linked to one user and cohort.
- `diagnostic`: answers and scoring used for routing; HR sees only aggregated insights by default.
- `learning path`: rule-based route after diagnostics.
- `points`: non-monetary reward unit; no cash equivalent.
- `wallet ledger`: auditable points accrual/spend/correction history.
- `reward catalog`: merch and internal bonuses.
- `merch order`: `new -> approved -> issued / cancelled`; cancellation refunds points.
- `HR report`: sponsor-facing aggregated analytics with anonymity threshold.
- `pilot outcome report`: final report for Wave 1 scale/no-scale decision.

## Learning methodology baseline

For MVP learning/content/diagnostic implementation, use `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` as the narrow source of truth:

- competency matrix: `C1–C10`; MVP target for `Новичок` is competency level 2, not expert mastery;
- core mandatory track: `N1–N7`; optional MVP mini-lessons: `Z1`, `Z4`, `Z9`; `Z2` is stretch only;
- diagnostic structure: `Q0` privacy-card, `Q1–Q27` scoring/personalization, `Q28` route preference screen, and `SA1–SA3` pre/post self-assessment;
- scoring/routing: Knowledge 40%, Behavior evidence 40%, Confidence/readiness 20%, route profiles `R1–R6`;
- lesson completion: theory viewed, mini-test passed at 70%+, practical action selected/submitted; failed tests add reinforcement instead of hard shame/block;
- sensitive learning data: no required exact income/debt/bank balances, photos, documents, bank screenshots or personal finance reports for MVP completion;
- HR/sponsor reporting: diagnostics, weak zones, quiz results and self-assessment are aggregate-only by default with anonymity threshold;
- content approve-flow: `raw_imported -> method_adapted -> editorial_review -> financial_review -> legal_review -> hr_wording_review -> pilot_ready -> production_ready`.

## Privacy and reporting model

- HR dashboard defaults to aggregated analytics, not personal financial answers.
- Diagnostics, weak zones and quiz results are HR-visible only in aggregate.
- Pre/post self-assessment (`SA1–SA3`) is HR-visible only as aggregated group dynamics and never gates rewards or personal comparison.
- Detailed cohort slices require anonymity threshold of at least 20 users.
- MVP practice tasks store ranges/categories/checklists/check-ins by default; exact sums, documents, photos and bank screenshots are not required for completion or reporting.
- Personal data is allowed for access, communications, merch fulfillment and support.
- Merch reports may be personal because fulfillment requires it.
- Product/admin access to sensitive data must be role-scoped, logged and justified.
- Any customer request for more personal reporting is a product/legal human gate before implementation.

## In scope

- Mobile web MVP and WebView-ready responsive constraints.
- Neutral employee-facing product brand.
- Single corporate pilot tenant and Wave 0/Wave 1 cohort model.
- Invite code issuance, activation and registration by name/email/phone.
- Onboarding, trust/privacy screen and consent/legal document acceptance.
- Entry diagnostics, rule-based scoring and personalized route.
- First 7-step `Новичок` track from learning methodology v0.2, with optional `Знаток` mini-lessons `Z1`, `Z4`, `Z9`.
- Lesson template: situation/theory/example/mini-test/practical step/reward.
- Daily challenge and 6-week startup savings challenge for Wave 1.
- Points accrual rules v1, wallet and transaction history.
- Store with mug, tote bag, scarf and internal bonuses; methodology v0.2 working stock hypothesis is 80 mugs, 40 tote bags and 20 scarves until human ops approval.
- Merch order lifecycle and operator/admin fulfillment surface.
- Admin/CMS for content, diagnostics, challenges, rewards, orders and support.
- Methodologist approve-flow for educational content.
- HR dashboard and reports: executive, funnel, cohort, learning, diagnostic insights, engagement, rewards, support, pilot outcome.
- Support/feedback forms and admin handling.
- Event taxonomy for core loop and reports.
- Legal drafts: privacy, terms, consent, financial disclaimer, cookie/consent if used.
- Pilot communication kit placeholders: email/post/QR/FAQ drafts.
- QA, smoke/e2e and Wave 0/Wave 1 readiness package.

## Out of scope

- In-app subscription, B2C billing and payment system.
- Public B2C launch funnel.
- Enterprise SSO, SCIM and full enterprise security/compliance program.
- Self-service multi-tenant admin, tenant marketplace and white-label UI.
- Customer brand in employee-facing UI.
- AI tutor or AI-generated advice.
- Social graph, friends, clans, public personal leaderboards.
- Partner marketplace for financial products.
- Personal investment, tax or legal recommendations.
- Raffles or legally heavy prize mechanics.
- Large video library and full 4-level curriculum.
- Real partner/reward fulfillment commitments without human approval.

## Human gates

Следующие точки cannot be fully closed by agent alone:

- Legal review for privacy, terms, consent, cookie and financial disclaimer wording.
- Final financial correctness of lessons, diagnostics, quizzes and explanations.
- Reward economy, merch prices, real item availability and fulfillment operations.
- B2B contract/commercial boundaries and customer-specific reporting.
- Use of real customer brand, real employees or real operational data.
- Final approval of pilot communication kit and public/customer-facing claims.

Human-gated work may be `WAITING_HUMAN` or `DONE_WITH_HUMAN_PENDING`, but not fully `DONE` until approval is recorded.

## Exit gates

MVP is complete only when all are true:

- Admin can create one pilot tenant, Wave 0/Wave 1 cohorts and generate at least 500 individual invite codes.
- Employee can register with invite code, name, email and phone.
- Mobile web core path works on representative smartphones.
- Employee sees onboarding, privacy screen, legal consent and neutral brand.
- Diagnostics runs, assigns route and records events.
- First 7-step track is available and methodologist-approved.
- Every lesson includes theory, example, mini-test, practical action and reward.
- Entry diagnostics implement `Q0/Q1–Q27/Q28`, `SA1–SA3`, `C1–C10` scoring and `R1–R6` routing without shaming labels.
- Points rules v1 are implemented through auditable ledger with idempotency protections.
- Wallet and points history work for employee and admin/support views.
- Store supports mug, tote bag, scarf and internal bonuses with explicit stock/operations human-gate status.
- Merch orders are visible to operator/admin and have statuses.
- Daily challenge and savings challenge are available.
- HR dashboard shows standard aggregated reports with privacy threshold.
- Support and feedback flows work.
- Core-loop event taxonomy is tracked.
- Pilot outcome report template exists.
- Relevant tests/smoke/e2e and screenshots are recorded in evidence.
- Stage audit has no blocking FAIL/UNKNOWN outside explicit human gates.

## Standard verification

For code/API/schema units:

- changed files and migration notes;
- OpenAPI/generated client notes if contract changed;
- root or package commands: `make verify`, relevant `make test-unit`, relevant `make build`, or exact available substitutes;
- unit/integration tests for invite code activation, diagnostics scoring, points ledger, redemption, reporting privacy and merch lifecycle;
- screenshot/browser evidence for employee/admin/HR-visible screens;
- docs/evidence updates and fresh verifier verdict.

For content/product units:

- affected lesson/question/challenge/report IDs;
- source/reference mapping to product foundation;
- preview/admin screenshots where applicable;
- methodologist/fact-check/legal status;
- unresolved human gates.

## Execution order

Normal order: `MVP-01 -> MVP-02 -> MVP-03 -> MVP-04 -> MVP-05 -> MVP-06 -> MVP-07 -> MVP-08 -> MVP-09 -> MVP-10 -> MVP-11 -> MVP-12`.

Allowed parallelism:

- content methodology in `MVP-04` may run alongside UX/admin foundations after `MVP-01` and `MVP-02`;
- HR reports and analytics specs may be drafted alongside domain model but not implemented before event taxonomy is frozen;
- store/admin fulfillment work may run parallel to learning UI only if API/contracts do not overlap;
- stage close waits for docs, evidence, human gates and fresh verification.

---

## MVP-01. Product/stage foundation and repo baseline

**Goal:** синхронизировать repo, product foundation and harness so all later agents execute the B2B-first MVP.

**Dependencies:** none
**Parallelism:** none

### Execution units

- MVP-01.01 [agent] Зафиксировать product foundation location and source-of-truth order.
- MVP-01.02 [agent] Обновить stage docs, harness prompts and doc-sync rules for B2B-first MVP.
- MVP-01.03 [agent] Зафиксировать repo layout and root commands for reproducible stage execution.
- MVP-01.04 [agent] Validate local bootstrap/self-check commands and record limitations.

### Acceptance criteria

- New agent reads product foundation before MVP spec freeze.
- No canonical doc still treats B2B as exclusively v2 or MVP out-of-scope.
- Product docs, stage docs and harness docs agree on B2B-first pilot baseline.

### Evidence required

- Changed canonical docs list.
- Harness self-check output.
- Contradiction search output.

---

## MVP-02. Corporate tenant, cohorts and invite access

**Goal:** создать controlled access path for Wave 0/Wave 1 without corporate SSO.

**Dependencies:** MVP-01
**Parallelism:** low

### Execution units

- MVP-02.01 [agent] Model tenant, cohorts/waves and invite codes.
- MVP-02.02 [agent] Implement invite code issuance, activation and one-user binding.
- MVP-02.03 [agent] Implement employee registration by name/email/phone/code.
- MVP-02.04 [agent] Implement admin view for cohorts, code statuses and activation funnel.

### Acceptance criteria

- Admin can generate and track 500 Wave 1 codes.
- Code activation is one-time and linked to user/cohort.
- Registration does not require corporate SSO.
- Duplicate/expired/invalid code paths are tested and understandable.

### Evidence required

- Migration/model notes.
- API/OpenAPI examples.
- Invite activation tests.
- Admin screenshots.

---

## MVP-03. Trust, legal consent and profile base

**Goal:** дать пользователю безопасный старт и объяснить privacy boundary before diagnostics.

**Dependencies:** MVP-02
**Parallelism:** medium

### Execution units

- MVP-03.01 [agent+human] Draft privacy, terms, consent and financial disclaimer documents.
- MVP-03.02 [agent] Implement onboarding and privacy screen.
- MVP-03.03 [agent] Implement consent version logging.
- MVP-03.04 [agent] Implement profile, contact update and support-ready identity basics.
- MVP-03.05 [agent] Implement admin audit logs for sensitive access.

### Acceptance criteria

- Employee understands what employer sees and does not see.
- Privacy-card appears before diagnostics and explains that personal diagnostic answers, weak zones, exact sums and reflection details are not personal HR reports.
- Consent versions are recorded and auditable.
- Legal wording has human-gate status.
- Sensitive admin access is logged.

### Evidence required

- Legal drafts.
- Onboarding/privacy screenshots.
- Consent/audit tests.
- Human-gate record.

---

## MVP-04. UX/UI foundation and neutral brand

**Goal:** создать mobile-first product shell that fits office and store employees.

**Dependencies:** MVP-01, MVP-02
**Parallelism:** medium

### Execution units

- MVP-04.01 [agent+human] Fix neutral brand, voice principles and anti-shame copy rules.
- MVP-04.02 [agent] Build IA for Learning / Challenges / Store / Profile / Support.
- MVP-04.03 [agent] Design mobile-first wireframes for onboarding, diagnostic, lesson, wallet, store and support.
- MVP-04.04 [agent] Implement design tokens, app shell, nav and common states.
- MVP-04.05 [agent] Prepare QR/short-link entry patterns for store employees.

### Acceptance criteria

- Employee UI does not show customer brand by default.
- Mobile-first flows are usable on representative smartphones.
- Diagnostic, lesson and practice UX supports no-photo/no-doc/no-exact-sum completion and has office/store example variants.
- HR-facing and mass-communication wording uses "опора", "уверенность", "спокойствие" and avoids stigmatizing debt/stress/control framing.
- Common UI states support future feature work without ad hoc layout.

### Evidence required

- Screenshots or markdown UI specs.
- Copy principles.
- Browser/mobile smoke evidence.

---

## MVP-05. Pedagogy, diagnostics and content factory

**Goal:** превратить 7-step program into methodologically controlled microlearning.

**Dependencies:** MVP-01, MVP-04
**Parallelism:** medium
**Content sources:** `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`, `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`

The content spec is a draft with explicit human gates. It can guide CMS/templates/diagnostics implementation, but does not by itself mark financial content, legal/tax wording, HR/privacy copy, reward rules or `production_ready` publish approval as done.

### Execution units

- MVP-05.01 [agent+human] Freeze competency matrix `C1–C10` and `N1–N7` outcomes from learning methodology v0.2.
- MVP-05.02 [agent+human] Define diagnostic taxonomy, scoring dimensions and route rules using `Q0`, `Q1–Q27`, `Q28`, `SA1–SA3` and `R1–R6`.
- MVP-05.03 [agent] Create lesson, quiz, explanation and practice-task templates with no-photo/no-doc/no-exact-sum defaults.
- MVP-05.04 [agent+human] Build question bank and content QA checklist for `N1–N7`, optional `Z1/Z4/Z9` and `Z2` stretch.
- MVP-05.05 [agent+human] Define methodologist approve-flow and review statuses through `production_ready`.

### Acceptance criteria

- Diagnostic can route users without shaming labels.
- Lessons have consistent structure and practical action.
- Diagnostic uses `C1–C10` score components: Knowledge 40%, Behavior evidence 40%, Confidence/readiness 20%.
- Pre/post self-assessment is separate from scoring and uses `SA1–SA3`.
- Content has explicit review states and unresolved labels.
- Optional `Знаток` lessons do not block mandatory 7-step completion and remain human-gated before publication.

### Evidence required

- Competency matrix.
- Diagnostic samples and scoring output for `Q0/Q1–Q27/Q28`, `SA1–SA3` and `R1–R6`.
- Lesson/question/route IDs.
- Review checklist and status markers through `production_ready`.

---

## MVP-06. Learning delivery and CMS/admin

**Goal:** publish and render the first 7-step track without runtime code edits per lesson.

**Dependencies:** MVP-04, MVP-05
**Parallelism:** low-medium

### Execution units

- MVP-06.01 [agent] Implement admin CRUD for lessons, quizzes, diagnostics, challenges and reward definitions.
- MVP-06.02 [agent] Implement content states draft/review/published/archived.
- MVP-06.03 [agent] Implement lesson renderer for mobile web.
- MVP-06.04 [agent] Implement progress tracking across lessons, tests and practice tasks.
- MVP-06.05 [agent] Implement publish validation and content analytics hooks.

### Acceptance criteria

- Admin/methodologist can create, review and publish lessons.
- First 7 steps render correctly on mobile.
- Lesson CMS fields cover level, competencies, source materials, review flags, disclaimer type, practice task type, quiz items, reward rule, analytics tags and office/store examples.
- Publish validation blocks lessons without required review statuses or human-gated financial/tax/HR wording status.
- Progress is saved and observable.
- Publish validation blocks incomplete content.

### Evidence required

- Admin screenshots.
- Published lesson previews.
- Content state tests.
- Analytics event examples.

---

## MVP-07. Diagnostics and personalized route

**Goal:** дать сотруднику понятный стартовый маршрут after diagnostics.

**Dependencies:** MVP-05, MVP-06
**Parallelism:** low

### Execution units

- MVP-07.01 [agent] Implement diagnostic test engine.
- MVP-07.02 [agent] Implement rule-based scoring and level/route assignment.
- MVP-07.03 [agent] Implement route explanation UI.
- MVP-07.04 [agent] Implement safe resume/retry behavior.
- MVP-07.05 [agent] Implement aggregated diagnostic insight reporting.

### Acceptance criteria

- Diagnostic takes 7-12 minutes in target content.
- Route is reproducible and explainable across `R1–R6`.
- Diagnostic stores `Q1–Q27` scoring separately from `Q28` preference and `SA1–SA3` self-assessment.
- Interrupted diagnostic does not corrupt progress.
- HR receives only aggregated diagnostic insights by default.

### Evidence required

- Scoring tests.
- Route screenshots.
- Privacy/reporting tests.
- Event tracking examples.

---

## MVP-08. Quiz, points wallet and progress loop

**Goal:** close lesson -> quiz -> practice -> points loop.

**Dependencies:** MVP-06, MVP-07
**Parallelism:** low

### Execution units

- MVP-08.01 [agent] Implement quiz engine and explanations.
- MVP-08.02 [agent] Implement attempt tracking and retry rules.
- MVP-08.03 [agent] Implement points ledger and accrual rules v1.
- MVP-08.04 [agent] Implement wallet UI and transaction history.
- MVP-08.05 [agent] Implement anti-farm/idempotency protections.

### Acceptance criteria

- Lesson completion, quiz pass and practice task grant points once according to rules.
- Mini-test pass threshold is 70%; 50–69% may continue with `needs_reinforcement` and no test points; below 50% offers retry/reinforcement without shaming copy.
- Practice completion stores ranges/categories/checklists/reflection categories/check-ins rather than required exact personal sums.
- Wallet history is understandable to employee and auditable for admin.
- Replays/retries do not duplicate rewards.
- Points are never represented as money.

### Evidence required

- Ledger tests.
- Quiz/progress screenshots.
- Idempotency proofs.
- Points economy human-gate note.

---

## MVP-09. Challenges and retention loop

**Goal:** добавить daily challenge and 6-week startup savings challenge for return behavior.

**Dependencies:** MVP-05, MVP-08
**Parallelism:** medium

### Execution units

- MVP-09.01 [agent] Implement daily challenge definitions and participation.
- MVP-09.02 [agent] Implement 6-week startup savings challenge flow and weekly check-ins.
- MVP-09.03 [agent] Implement streak rules with soft missed-day behavior.
- MVP-09.04 [agent] Implement challenge rewards and anti-duplicate guards.
- MVP-09.05 [agent] Implement engagement analytics events.

### Acceptance criteria

- User can complete daily challenge and savings challenge actions.
- Challenge pacing respects Wave 1: no more than 2 mandatory lessons per week; week 6 is catch-up, post-assessment, store and feedback.
- Rewards are idempotent and limited.
- Missed days invite return without punitive copy.
- Engagement is visible in reports.

### Evidence required

- Challenge scenario tests.
- Screenshots.
- Event examples.
- Streak/idempotency tests.

---

## MVP-10. Store, merch and fulfillment operations

**Goal:** let employees spend points and let operators fulfill physical rewards.

**Dependencies:** MVP-08
**Parallelism:** low

### Execution units

- MVP-10.01 [agent+human] Freeze merch and internal bonus catalog for MVP.
- MVP-10.02 [agent] Implement reward catalog and stock/limit controls.
- MVP-10.03 [agent] Implement redeem flow and order creation.
- MVP-10.04 [agent] Implement order statuses `new -> approved -> issued / cancelled`.
- MVP-10.05 [agent] Implement cancellation refund and manual adjustment audit.
- MVP-10.06 [agent] Implement operator export/report.

### Acceptance criteria

- Store includes mug, tote bag, scarf and internal bonuses.
- Working Wave 1 stock hypothesis is recorded as 80 mugs, 40 tote bags and 20 scarves until reward operations human approval.
- Redeem flow prevents double-spend.
- Cancellation returns points.
- Operator can see personal fulfillment data only for orders.

### Evidence required

- Store/admin screenshots.
- Ledger/order lifecycle tests.
- Export sample.
- Reward operation human-gate note.

---

## MVP-11. HR dashboard, analytics and pilot reporting

**Goal:** provide B2B proof of value without exposing sensitive personal answers.

**Dependencies:** MVP-02, MVP-07, MVP-08, MVP-09, MVP-10
**Parallelism:** medium after event taxonomy freeze

### Execution units

- MVP-11.01 [agent+human] Freeze event taxonomy and KPI definitions.
- MVP-11.02 [agent] Implement event tracking for access, onboarding, diagnostics, learning, points, store, retention, support and reports.
- MVP-11.03 [agent] Implement executive dashboard and funnel report.
- MVP-11.04 [agent] Implement cohort, learning, diagnostic, engagement, rewards and support reports.
- MVP-11.05 [agent] Implement anonymity threshold and role access rules.
- MVP-11.06 [agent] Implement pilot outcome report template.

### Acceptance criteria

- HR sees activation, retention, completion, rewards and support signals.
- Sensitive diagnostic/learning data is aggregated by default.
- HR/sponsor reports include aggregate pre/post self-assessment deltas only above anonymity threshold; no personal answers, weak zones, exact financial data or reflection details by default.
- Event taxonomy includes skill-level learning fields from methodology v0.2, including `self_assessment_submitted`.
- Groups below anonymity threshold do not show detailed slices.
- Pilot outcome report supports scale/no-scale decision.

### Evidence required

- Dashboard/report screenshots.
- Privacy threshold tests.
- Event list and sample payloads.
- Pilot outcome template.

---

## MVP-12. Support, QA and Wave readiness

**Goal:** prepare controlled Wave 0/Wave 1 launch package.

**Dependencies:** MVP-01 through MVP-11
**Parallelism:** low

### Execution units

- MVP-12.01 [agent] Implement support form, feedback capture and admin handling.
- MVP-12.02 [agent+human] Prepare HR communication kit drafts: email, post, QR poster, FAQ.
- MVP-12.03 [agent] Prepare scripted smoke/e2e scenarios and demo data.
- MVP-12.04 [agent] Run Wave 0 readiness checklist and record blockers.
- MVP-12.05 [agent+human] Prepare go/no-go checklist and operational runbook.
- MVP-12.06 [agent+human] Close stage audit with evidence and human-gate statuses.

### Acceptance criteria

- Support and feedback are operational.
- Support form can be linked to a lesson/question category and must not promise personal tax, investment, credit or legal consultation.
- Communication kit explains voluntary participation and privacy boundary.
- Wave readiness includes 6-week calendar, HR wording review, email/in-app reminder checks and post-assessment timing.
- Critical employee/admin/HR journeys have smoke/e2e evidence.
- Wave 1 can launch without manual support for every user.

### Evidence required

- Support screenshots.
- Communication drafts.
- Test artifacts.
- Runbook/checklist.
- Stage audit output.
