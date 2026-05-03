# AGENTS.md — apps/api

Локальные инструкции для backend API на Spring Boot, Java, Maven and PostgreSQL.

## Базовый стек

Если репозиторий ещё не закрепил иное решение, baseline:

- Java 21;
- Spring Boot;
- Maven Wrapper (`./mvnw`);
- Flyway;
- PostgreSQL;
- OpenAPI/springdoc as backend contract source;
- JUnit + Testcontainers for critical integration paths.

## Локальные правила

- Controllers должны оставаться thin.
- Domain/business logic не должна разрастаться в controllers.
- Изменения БД оформлять append-only Flyway migrations.
- Миграции должны быть воспроизводимыми локально and in CI.
- Нельзя silently менять API contract без обновления OpenAPI and notes для frontend/admin.
- Если меняется auth/session/permission logic, это нужно явно выделять in evidence.
- Любые operations with `points` должны быть idempotent, traceable and audit-friendly.
- Для long-running jobs нужна защита от повторного выполнения.
- При работе с CMS/content помнить, что public wording and financial formulations are human-gated.

## Команды

Рекомендуемый backend minimum:

```bash
cd apps/api
./mvnw -q verify
./mvnw -q test
```

Root wrappers may delegate to these commands:

```bash
make verify
make test-unit
make build
```

## Что считать критичным

- auth/session/permissions;
- schema migrations;
- diagnostics scoring;
- progression state;
- points ledger;
- store redemption;
- support ticket flows;
- frontend/admin integration contracts.
