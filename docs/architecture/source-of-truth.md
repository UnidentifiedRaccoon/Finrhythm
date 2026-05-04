# Source of truth

Этот документ фиксирует исходные архитектурные решения и порядок инженерных источников истины.

## 1. Порядок source of truth

1. фактическое состояние репозитория;
2. этот файл;
3. `docs/architecture/documentation-workflow.md`;
4. product-intent baseline: `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
5. stage source-of-truth: `docs/stages/MVP.md`, `docs/stages/v1.md`, `docs/stages/v2.md`;
6. repo-wide `AGENTS.md`;
7. локальные `AGENTS.md`;
8. stage/task artifacts inside `.agent/`;
9. PR description and temporary notes only as explanation, not canon.

Если меняется архитектурное решение, отразить его здесь and in relevant stage docs if the stage baseline changed.

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

## 6. B2B MVP product baseline

- Current MVP baseline — B2B-first mobile web для корпоративного пилота, а не B2C-first продукт с будущей корпоративной опцией.
- Canonical product intent lives in `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`; binary originals в `references/` являются supporting artifacts.
- MVP вводит single corporate pilot contour: `tenant`, `cohort/wave`, invite codes, HR/sponsor reporting, privacy aggregation, points wallet and merch operations.
- Employee-facing UI использует нейтральный бренд продукта; первый customer context может называться во внутренних docs, operations and tenant configuration, but not in default employee UI.
- In-app subscription, B2C billing, enterprise SSO/SCIM and self-service multi-tenant platform are out of MVP, если stage doc явно не вводит узкий approved slice.

## 7. Points baseline

- `points` is a separate domain entity.
- `points` are not money.
- начисление и списание проходят через auditable ledger.
- redemption, raffle mechanics and billing-adjacent decisions are high-risk.

## 8. Decisions still to finalize

- exact Node, pnpm and JDK versions;
- exact e2e runner;
- logging/observability stack;
- IaC format for Yandex Cloud;
- exact shared package structure beyond `ui/config/api-client`.
