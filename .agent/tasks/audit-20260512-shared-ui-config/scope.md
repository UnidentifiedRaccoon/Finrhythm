# audit-20260512-shared-ui-config

Статус: DONE
Дата: 2026-05-12

## Issue

P1 Shared UI/config: `packages/ui` и `packages/config` были пустыми, web/admin держали дублирующиеся TypeScript правила локально, что создавало риск drift.

## Frozen scope

- Добавить минимальный `packages/config` baseline с shared TypeScript presets.
- Добавить минимальный `packages/ui` baseline с токенами и маленьким UI primitive/export.
- Подключить `apps/web` и `apps/admin` к shared Next TS preset только если typecheck/test/build не ломаются.
- Не вводить большой дизайн-системный рефактор.
- Не трогать Makefile/init/e2e/API client/stage aliases.
- Не читать raw evidence и не запускать дочерних агентов.

## Acceptance criteria

- `packages/config` больше не пустой и содержит reusable TS presets.
- `packages/ui` больше не пустой и содержит typed token export plus small shared primitive.
- Web/admin используют общий TS preset без потери app-specific include/exclude и web-only TS import behavior.
- Lockfile обновлен только из-за нового workspace package graph.
- Релевантные package/web/admin проверки записаны в evidence.

## Doc-sync decision

Canonical docs already define `packages/ui` and shared frontend packages as repo baseline in `docs/architecture/source-of-truth.md`. This slice only materializes the minimal baseline and does not change user behavior, API contract, setup commands, product scope or stage scope. Canonical docs were not edited; this task artifact records the proof and limitation.
