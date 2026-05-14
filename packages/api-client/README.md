# @finrhythm/api-client

Минимальный generated/derived TypeScript contract для текущего backend OpenAPI.

## Source of truth

- Backend contract source: Spring/OpenAPI annotations in `apps/api`.
- Checked-in OpenAPI snapshot: `packages/api-client/openapi/finrhythm-api.openapi.json`.
- Generated TypeScript contract/client: `packages/api-client/src/generated/contracts.ts`.
- Runtime package output for workspace consumers: `packages/api-client/dist/**`.

Этот пакет намеренно покрывает только текущие публичные/admin DTO, admin code-status, legal document acceptance, profile-session diagnostic and N1 learning progress helpers. Он не является универсальным генератором всего будущего API.

Для текущего draft legal acceptance контракт экспортирует `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION`; drift check сверяет его с backend `LegalAcceptanceService.CURRENT_DRAFT_VERSION`.

## Regeneration

```bash
pnpm --filter @finrhythm/api-client generate
pnpm --filter @finrhythm/api-client build
```

После изменения backend API contract нужно обновить OpenAPI snapshot из Spring/OpenAPI source, затем запустить regeneration и drift checks:

```bash
pnpm --filter @finrhythm/api-client check:generated
pnpm --filter @finrhythm/api-client check:openapi-drift
pnpm --filter @finrhythm/api-client typecheck
```

`check:openapi-drift` сверяет snapshot с текущими backend Java enum/record полями для покрытых DTO. Если добавляется новый endpoint или DTO вне текущего admin/public status slice, сначала расширь snapshot and generator checks узким инкрементом.
