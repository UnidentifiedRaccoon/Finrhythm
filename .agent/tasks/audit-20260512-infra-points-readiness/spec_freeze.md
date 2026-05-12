# Spec freeze: audit-20260512-infra-points-readiness

Дата: 2026-05-12

## Issue

P2 Infra/points readiness: production infra is placeholder-only and points ledger is absent. The requested fix is a narrow readiness outline/canonical doc or TODO contract, not implementation of ledger, deploy or wider MVP scope.

## Frozen scope

In scope:

- add a canonical readiness contract for production IaC/env outline and points ledger prerequisites;
- add an infra placeholder pointer if it helps prevent accidental production work from an empty `infra/yc`;
- record task evidence under `.agent/tasks/audit-20260512-infra-points-readiness/`;
- run docs/link/rg guardrails as far as available.

Out of scope:

- code, schema, Flyway migrations, OpenAPI, UI and generated clients;
- actual Yandex Cloud resource creation or deploy commands;
- reward economy approval, real merch operations or production readiness claim;
- changes to `docs/stages/**`;
- reading `.agent/**/raw/**`;
- child/subagent orchestration.

## Acceptance criteria

- Canonical docs explicitly say production deployment remains gated until IaC/env/secrets/backup/migration/smoke evidence exists.
- Docs explicitly say points/rewards remain gated until append-only auditable idempotent ledger prerequisites are implemented by a future slice.
- The change does not expand MVP scope or mark a stage/task as product-complete.
- Evidence records changed files, commands and self-verification result.
