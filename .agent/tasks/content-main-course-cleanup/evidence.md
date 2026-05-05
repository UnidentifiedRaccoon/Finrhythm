# Content main course cleanup evidence

Статус: DONE_WITH_HUMAN_PENDING

## Scope

- Активный контентный baseline сужен до основного курса `Курс «ФинCтратегия»` из программы ФинЗдоровье.
- Удалена короткая 8-урочная выгрузка `Путь к деньгам` из `content/`, root `course-export/lesson-links.*` и старые task artifacts по этой выгрузке.
- README и GetCourse helper scripts теперь по умолчанию указывают на `stream id 546010026`, `course-export/stream-546010026/` и `content/getcourse-finstrategy/`.
- GetCourse helper scripts загружают Playwright лениво, поэтому `--help` работает до `make install`/`pnpm install`.
- README перестроен вокруг короткой секции `Контентный baseline` с активными путями, инвентарем и human gates.
- Stage harness docs обновлены: content re-sync rule, content policy and content evidence expectations now point to the active FinStrategy baseline.
- `verify_harness.py --bootstrap-only` получил deterministic check `content-baseline` для локального инвентаря основного курса and absence of inactive export paths.
- Product foundation обновлен: раздел 10 теперь называет `content/getcourse-finstrategy/` активным source baseline и фиксирует, что `Путь к деньгам` неактивен.
- Добавлена краткая справка `content/getcourse-finstrategy/CONTENT_BRIEF.md` со всеми разделами теории основного курса.

## Content inventory

- `course-export/stream-546010026/all-lesson-links.json`: 73 lesson URLs.
- `content/getcourse-finstrategy/`: 73 lesson markdown files.
- Statuses: 70 `exported`, 3 `blocked`.
- Remaining blocked lessons:
  - `07-lesson-306105699.md` — `Как достигать финансовых целей`.
  - `16-lesson-235010156.md` — `03.01 Как работают все привычки`.
  - `58-lesson-235010192.md` — `09.04 План достижения финансовой независимости`.
- Human review: 73/73 lessons have `humanReview: "required"`.
- Downloaded visible attachments: 30 PDF/DOCX/XLSX assets under `content/getcourse-finstrategy/downloads/`.
- Content brief covers 10 main theory modules plus the bonus `Финансовое воспитание` block.

## Content review notes

- Raw export основного курса все еще содержит customer-specific метки `Леруа` в 20 markdown-файлах, в основном в названиях тестов и заданий. Это допустимо для raw source, но должно быть нормализовано перед employee-facing публикацией.
- Finance/legal risk scan matched 29 markdown files with investment, credit, tax, pension, return or guarantee wording. Эти уроки требуют методологической и юридически чувствительной human review перед использованием в MVP.
- PII/session scan found no email, account notice or cookie-banner text in active content/export artifacts. Existing `cookies-notification` selector names in markdown metadata are technical selector traces, not user-visible cookie text.

## Verification

- Count check for `all-lesson-links.json`, lesson markdown statuses and downloaded assets — PASS.
- Search for removed course references in active docs/scripts/content/export/task artifacts — PASS; only the product-foundation decision note and this cleanup evidence remain.
- Search for removed course references in stage raw logs — historical references remain in durable `.agent/stages/mvp/raw/*`; not active content.
- PII/account/cookie-banner text scan — PASS.
- `node --check scripts/getcourse-collect-lesson-links.js && node --check scripts/getcourse-export-lesson-content.js` — PASS.
- `corepack pnpm getcourse:collect-links -- --help` — PASS.
- `corepack pnpm getcourse:export-content -- --help` — PASS.
- `.agent/tasks/content-main-course-cleanup/evidence.json` JSON parse — PASS.
- `CONTENT_BRIEF.md` section/count check — PASS.
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --bootstrap-only` — PASS, includes `content-baseline`.
- `./scripts/validate-bootstrap.sh` — PASS, includes `content-baseline`.
- `python3 -m py_compile .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py` — PASS.
- `node scripts/verify-bootstrap.mjs` — PASS.
- `git diff --check` — PASS.
- `make verify` — PARTIAL/BLOCKED: `validate-bootstrap.sh` PASS and `node scripts/verify-bootstrap.mjs` PASS; backend Maven step printed `Unable to locate a Java Runtime` and the controlled run was terminated after 45 seconds to avoid a stuck Maven wrapper.

## Human gates

- Финальная финансовая, налоговая, кредитная, инвестиционная и пенсионная корректность контента уроков остается human-gated.
- Удаление customer-specific бренда из employee-facing контента остается human-gated/adaptation work.
- Три blocked-урока требуют действия владельца/admin-доступа или исправленного доступа перед адаптацией.
