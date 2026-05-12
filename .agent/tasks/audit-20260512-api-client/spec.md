# Audit 2026-05-12: P0 API contract

## Scope freeze

Статус: `IN_PROGRESS`

Задача: убрать пустой `packages/api-client`, завести минимальный generated/derived TypeScript contract из OpenAPI для текущих публичных/admin DTO и перевести безопасное использование admin code-status на этот пакет.

## In scope

- `packages/api-client/**`: OpenAPI snapshot, deterministic generator, generated TS contract/client, package scripts, regeneration notes.
- Узкие изменения `apps/admin`: импорты/types/client для code-status, если они безопасно переходят на `@finrhythm/api-client`.
- `apps/admin/package.json` и lockfile только для workspace dependency.
- `.agent/tasks/audit-20260512-api-client/*`: evidence and verifier notes.

## Out of scope

- `Makefile`, init/dev wrappers, e2e, shared UI packages.
- Backend auth/security fixes already present in the worktree.
- Stage aliases, `.agent/stages/**/raw/**`, child agents.
- Полный future-proof API generator for all future endpoints.

## Acceptance criteria

- `packages/api-client` is no longer empty and exposes generated/derived TS contract artifacts.
- Generated artifacts are reproducible from a checked-in OpenAPI snapshot.
- Focused drift check covers current backend OpenAPI/admin status contract enough to catch changed DTO fields/enums.
- `apps/admin` code-status types/client use `@finrhythm/api-client` where safe.
- Verification evidence records admin checks, package checks and scoped whitespace check.

## Doc-sync target

- Canonical architecture already states backend OpenAPI -> `packages/api-client` flow in `docs/architecture/source-of-truth.md`.
- This slice adds generated-client notes in `packages/api-client/README.md`; no product/stage baseline changes are intended.
