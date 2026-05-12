# Evidence: P1 Runtime content boundary

Дата: 2026-05-12

## Что изменено

- `apps/web/lib/learning-fixtures.ts` сокращен до typed adapter/consumer: импортирует `content/fixtures/learning/novice-demo-lessons.v0.1.json`, экспортирует renderer-ready fixtures and runtime lookup.
- `content/fixtures/learning/novice-demo-lessons.v0.1.json` стал импортируемым demo/content fixture source для N1/N2/N3 с boundary metadata, provenance, review status и human-gate notes.
- `apps/web/lib/learning-types.ts` получил canonical draft review status union без `production_ready`.
- `apps/web/tests/learning-shell.test.mjs` получил guardrail, что lesson payload живет в `content/`, web не является content source of truth, статусы не `production_ready`, sourceHumanReview остается `required`.

## Boundary Proof

- Production content source of truth: `CMS/PostgreSQL`.
- Demo fixture role: `demo_importable_content_fixture`.
- Web runtime role: `renderer_adapter_consumer`.
- `uiCodeOwnsLessonPayload`: `false`.
- `publishableFromFixture`: `false`.
- `productionReady`: `false`.
- Source review status: `method_adapted`.
- Lesson review statuses: `method_adapted`.
- Wording review status: `DONE_WITH_HUMAN_PENDING`.

## Provenance

- Active source root: `content/getcourse-finstrategy/`.
- Source brief: `content/getcourse-finstrategy/CONTENT_BRIEF.md`.
- Source manifest: `content/getcourse-finstrategy/content-baseline.manifest.json`.
- Methodology: `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`.
- Inventory: 73 lesson URLs, 73 markdown lessons, 70 exported, 3 blocked, 73 humanReview required, 30 downloaded assets.
- N3 source: `content/getcourse-finstrategy/12-lesson-235010153.md`; raw homework asked for photos and sale amount, demo fixture forbids photos, address, exact sale amount, buyer chat, payment screenshots and bank screenshots.
- Removed exploratory exports are not active sources: `content/getcourse-path-to-money`, `course-export/lesson-links.json`, `course-export/lesson-links.txt`.

## Verification

- PASS: `pnpm --filter @finrhythm/web test`.
- PASS: `pnpm --filter @finrhythm/web typecheck`.
- PASS: `pnpm --filter @finrhythm/web build`.
- PASS: content fixture status probe returned `sourceReviewStatus: method_adapted`, `productionReady: false`, lesson statuses `[method_adapted]`, source of truth `CMS/PostgreSQL`, web role `renderer_adapter_consumer`, routes `N1,N2,N3`.
- PASS: `git diff --check -- ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`.

## Human Gate

Статус: `DONE_WITH_HUMAN_PENDING`.

Финальная финансовая корректность lesson/quiz wording, legal-sensitive copy и reward wording не утверждены агентом. Перед публикацией в CMS/production нужен human sign-off.
