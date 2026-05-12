# Evidence: audit-20260512-shared-ui-config

Дата: 2026-05-12

## Changed files

- `packages/config/package.json`
- `packages/config/tsconfig/base.json`
- `packages/config/tsconfig/next.json`
- `packages/config/tsconfig/react-library.json`
- `packages/ui/package.json`
- `packages/ui/tsconfig.json`
- `packages/ui/src/index.ts`
- `packages/ui/src/surface.ts`
- `packages/ui/src/tokens.ts`
- `packages/ui/src/tokens.css`
- `apps/web/tsconfig.json`
- `apps/admin/tsconfig.json`
- `pnpm-lock.yaml`

## Implementation notes

- `@finrhythm/config` adds shared TS presets for base strict rules, Next apps and React library packages.
- `apps/web` and `apps/admin` now extend `../../packages/config/tsconfig/next.json`.
- `apps/web` keeps local `allowImportingTsExtensions` because current source imports local `.ts` files with explicit extensions.
- `@finrhythm/ui` exports canonical MVP token values from the design-system markdown and a small `Surface` primitive/classname helper.
- `@finrhythm/ui/tokens.css` is available for future stylesheet adoption, but no app CSS was imported in this slice to avoid a design-system refactor.

## Verification

| Command | Result |
|---|---|
| `pnpm install --lockfile-only` | PASS |
| `pnpm install --offline` | PASS; lockfile already up to date; package links refreshed |
| `pnpm --filter @finrhythm/web typecheck` | PASS |
| `pnpm --filter @finrhythm/admin typecheck` | PASS |
| `pnpm --filter @finrhythm/ui typecheck` | PASS |
| `pnpm --filter @finrhythm/web test` | PASS, 15 tests |
| `pnpm --filter @finrhythm/admin test` | PASS, 4 tests |
| `pnpm --filter @finrhythm/web build` | PASS |
| `pnpm --filter @finrhythm/admin build` | PASS |

## Limitations

- Root lint/format/turbo orchestration remains outside this issue write scope.
- No user-visible app UI was changed, so screenshot evidence was not required.
