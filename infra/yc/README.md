# Yandex Cloud infra placeholder

Статус: placeholder
Обновлено: 2026-05-12

`infra/yc` is reserved for future reviewed IaC for the Yandex Cloud target infrastructure. No production resources, state files, secrets or deployment commands are defined here yet.

Before adding IaC or running production deployment work, use `docs/architecture/production-readiness-contract.md` as the readiness contract for environment matrix, secrets, Managed PostgreSQL, migrations, Serverless Containers, Object Storage, optional Redis, observability and data safety.

Do not add real secret values, customer data, invite codes, production dumps or local state files to this directory.
