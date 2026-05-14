# Source of truth

Этот документ фиксирует исходные архитектурные решения и порядок инженерных источников истины.

## 1. Порядок source of truth

1. фактическое состояние репозитория;
2. этот файл;
3. `docs/architecture/documentation-workflow.md`;
4. product-intent baseline: `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
5. MVP learning methodology and diagnostics baseline: `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`;
6. MVP product-design style baseline for UI/design/token/component/screen work: `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`;
7. access/organization model, when the task touches users, organizations, roles, invitations, codes, seats, subscriptions or access: `docs/architecture/access-and-subscriptions.md` and `docs/architecture/organization-access-subscription-model.md`;
8. target stage source-of-truth: only the active `docs/stages/MVP.md`, `docs/stages/v1.md` or `docs/stages/v2.md`;
9. repo-wide `AGENTS.md`;
10. локальные `AGENTS.md`;
11. stage/task artifacts inside `.agent/`;
12. PR description and temporary notes only as explanation, not canon.

Если меняется архитектурное решение, отразить его здесь and in relevant stage docs if the stage baseline changed.

## 1.1 Read-gating for agent execution

Canonical source order does not mean blanket-reading every canonical file on every task.

- Before reading broad source sets, classify the slice as Tier C low-risk, Tier B integration or Tier A regulated/high-risk.
- Tier C reads the nearest code/tests and exact contract context; Tier B reads affected integration contracts; Tier A reads the full mandatory source set for the risky surface.
- Stage execution reads the target stage doc only by default.
- `v1.md` and `v2.md` are not default reads for an MVP slice unless the task is migration, roadmap/audit, cross-stage compatibility or the user explicitly asks.
- Existing stage work resumes from `.agent/stages/<stage_id>/status.json`, then the active sprint/task file, then `evidence.json` as an index.
- Raw evidence under `.agent/stages/**/raw/**` is read only by exact ref from current evidence, verifier problems or an explicit audit question.
- Product/content/methodology docs are loaded when stage metadata or task type requires them, especially content/CMS/learning/diagnostic/reporting slices.

The detailed routing matrix lives in `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`.

## 2. Монорепа baseline

- one Git repository;
- `apps/web` — Next.js + React user-facing app;
- `apps/admin` — Next.js admin/CMS;
- `apps/api` — Spring Boot + Java backend;
- shared frontend packages in `packages/*`;
- backend is a separate Maven workspace inside monorepo;
- CMS works over PostgreSQL;
- production infra is oriented to Yandex Cloud.

## 3. Technology baseline

### Frontend

- Next.js;
- React;
- TypeScript;
- `pnpm` for JS workspaces;
- `turborepo` for JS/TS orchestration;
- shared UI in `packages/ui`.

### Backend

- Java 21;
- Spring Boot;
- Maven Wrapper;
- PostgreSQL;
- Flyway migrations;
- OpenAPI/springdoc as contract between backend and frontend/admin;
- JUnit + Testcontainers for critical integration paths.

### Infra

- locally: `docker compose` for dependencies;
- production: Yandex Cloud with Managed PostgreSQL, Serverless Containers, Object Storage and optional Redis.
- production deployment readiness and the future `infra/yc` IaC contract are governed by `docs/architecture/production-readiness-contract.md` until a dedicated infra slice freezes implementation details.

## 4. Frontend ↔ backend contract

Backend API contract is canonical for integration types.

Recommended flow:

1. backend changes contract source;
2. OpenAPI is updated/generated in `apps/api`;
3. generated client updates in `packages/api-client`;
4. `apps/web` and `apps/admin` consume generated artifacts.

Do not maintain two equal sources of truth for contract types.

## 5. Content baseline

- Production source of truth for lessons, quizzes, challenge and marathon is CMS/PostgreSQL.
- `content/` is for demo fixtures, import/export bundles, local development and preview/test data.
- MVP learning/content decisions are normalized in subordinate canonical product docs under `docs/product/b2b-mvp/lemanapro/`: `learning-methodology-v0.2.md` for methodology/diagnostics assumptions and `content-mvp-spec-v0.1.md` for the content factory draft. These docs do not replace CMS/PostgreSQL as runtime source of truth and do not close human gates for final financial/legal/privacy/reward approval.

## 6. B2B MVP product baseline

- Current MVP baseline — B2B-first mobile web для корпоративного пилота, а не B2C-first продукт с будущей корпоративной опцией.
- Canonical product intent lives in `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`; binary originals в `references/` являются supporting artifacts.
- Canonical MVP learning methodology, diagnostics, routing, lesson template and content approve-flow live in `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`; implementation slices must not replace it with stage artifacts.
- Canonical MVP product-design style baseline for UI implementation, design tokens, component QA and screen generation lives in `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`; the companion style board lives in `docs/product/b2b-mvp/lemanapro/references/design-system-style-board-v0.1.png` and does not replace the markdown baseline.
- MVP вводит single corporate pilot contour: `tenant`, `pilotLaunch`, `accessPool`, invite codes, HR/sponsor reporting, privacy aggregation, points wallet and merch operations.
- Employee-facing UI использует нейтральный бренд продукта; первый customer context может называться во внутренних docs, operations and tenant configuration, but not in default employee UI.
- In-app subscription, B2C billing, enterprise SSO/SCIM and self-service multi-tenant platform are out of MVP, если stage doc явно не вводит узкий approved slice.

## 6.1 Access, organizations and subscriptions baseline

Canonical access/subscription architecture lives in `docs/architecture/access-and-subscriptions.md`.
Detailed entity/lifecycle model for `Organization`, `OrgMembership`, invitations, organization codes, subscriptions and seats lives in `docs/architecture/organization-access-subscription-model.md`.

- `users` не должен получать единственный `organization_id`; организация пользователя моделируется через `org_membership`.
- MVP may enforce one active employee membership by business rule, but schema/domain choices must not block later multi-organization membership.
- Roles/permissions are for administrative and operational authorization; subscriptions, seats and pro access are not roles.
- Product access is resolved from canonical source records (`user_subscriptions`, `org_subscriptions`, `org_subscription_seats`) or an optional `entitlement_grant` projection built from those records.
- Invitation acceptance creates `OrgMembership` only after identity verification/authentication; invitation links must not become password setup links for someone else.
- Organization codes are separate revocable entities, not plain fields on `Organization`.
- B2B seats/pro-seats are scoped to organization/membership and must not leak across another organization of the same user.
- B2C Pro is a personal subscription source and does not expand corporate learning access or leak into HR/admin reporting without explicit approved support/legal scope.

## 7. Points baseline

- `points` is a separate domain entity.
- `points` are not money.
- начисление и списание проходят через auditable ledger.
- before any rewards/deployment slice enables accrual, spending, refunds, wallet history or reward reports, the append-only/idempotent ledger prerequisites in `docs/architecture/production-readiness-contract.md` must be frozen and implemented in that slice.
- redemption, raffle mechanics and billing-adjacent decisions are high-risk.

## 8. Decisions still to finalize

- exact Node, pnpm and JDK versions;
- exact e2e runner;
- logging/observability stack;
- exact IaC format/state backend for Yandex Cloud; readiness outline lives in `docs/architecture/production-readiness-contract.md`;
- exact shared package structure beyond `ui/config/api-client`.
