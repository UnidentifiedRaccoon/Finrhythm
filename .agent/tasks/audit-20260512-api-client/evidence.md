# Evidence: audit-20260512-api-client

Статус: `PASS`
Проверено: `2026-05-12T10:03:44+0300`

## Что изменено

- `packages/api-client` перестал быть пустым workspace package:
  - добавлен OpenAPI snapshot для текущих employee registration and admin code-status DTO;
  - добавлен deterministic generator `scripts/generate-contracts.mjs`;
  - добавлен focused drift check `scripts/check-openapi-drift.mjs`;
  - добавлены generated TS contract/client artifacts in `src/generated` and compiled runtime output in `dist`;
  - добавлены regeneration notes in `README.md`.
- `apps/admin` code-status больше не держит собственные DTO definitions:
  - `apps/admin/lib/code-status-types.ts` re-export/imports contract types and status list from `@finrhythm/api-client`;
  - live admin status fetch uses generated `fetchAdminCodeStatus`;
  - добавлен label для backend enum value `ARCHIVED`, который раньше был потерян в ручном type union.
- `apps/admin/package.json` and `pnpm-lock.yaml` добавляют workspace dependency on `@finrhythm/api-client`.

## Проверки

| Command | Result |
| --- | --- |
| `pnpm --filter @finrhythm/api-client build` | PASS |
| `pnpm --filter @finrhythm/api-client check:generated` | PASS |
| `pnpm --filter @finrhythm/api-client check:openapi-drift` | PASS |
| `pnpm --filter @finrhythm/api-client typecheck` | PASS |
| `pnpm --filter @finrhythm/admin test` | PASS, 4 tests |
| `pnpm --filter @finrhythm/admin typecheck` | PASS |
| `git diff --check -- packages/api-client apps/admin/package.json apps/admin/lib/code-status-types.ts apps/admin/lib/code-status-client.ts apps/admin/components/status-labels.ts apps/admin/tests/status-boundary.test.mjs pnpm-lock.yaml .agent/tasks/audit-20260512-api-client` | PASS |
| `if rg -n "[ \\t]+$" packages/api-client .agent/tasks/audit-20260512-api-client apps/admin/package.json apps/admin/lib/code-status-types.ts apps/admin/lib/code-status-client.ts apps/admin/components/status-labels.ts apps/admin/tests/status-boundary.test.mjs pnpm-lock.yaml; then exit 1; fi` | PASS |

## Doc-sync

- Canonical architecture already states backend OpenAPI -> generated `packages/api-client` flow in `docs/architecture/source-of-truth.md`.
- Added narrow generated-client notes in `packages/api-client/README.md`.
- No product/stage scope changes.

## Ограничения

- Browser/screenshot evidence was not collected because this slice changes the source of contract types and a non-fixture enum label, not the current fixture-rendered admin workflow. Existing admin boundary test and TypeScript exhaustiveness cover the status contract path.
- Worktree has unrelated concurrent changes under `.agent/stages/**`, `apps/api` auth/security, `apps/web`, `packages/ui` and `packages/config`; this task did not revert or include them.

## Human gates

- No legal, financial content, reward economy, pricing, real employee data or production deployment human gate was touched.
