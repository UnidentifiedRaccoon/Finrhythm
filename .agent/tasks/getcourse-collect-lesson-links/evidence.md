# GetCourse lesson link collection evidence

Статус: DONE

## Scope

- Добавлен read-only collector `scripts/getcourse-collect-lesson-links.js`.
- Collector открывает только страницу потока `https://fgrm.ncfg.ru/teach/control/stream/view/id/909466707`.
- Сбор ограничен доменом `fgrm.ncfg.ru` и URL-паттерном `/teach/control/lesson/view`.
- Содержимое уроков, видео, материалы и DRM не открывались и не скачивались.
- Playwright session state сохраняется в `.local/getcourse/storage-state.json`, путь игнорируется git.

## Outputs

- `course-export/lesson-links.json`
- `course-export/lesson-links.txt`
- `course-export/debug/stream-page.html`
- `course-export/debug/stream-page.png`
- `course-export/debug/link-candidates.json`

Debug-артефакты игнорируются git.

## Collection result

- Найдено уроков: 8.
- Дубли: 0.
- Подозрительные same-domain кандидаты вне `lesson/view`: 3.
- Подозрительные кандидаты: `Тренинги`, `Программа ФинЗдоровье`, `Школа финансовой грамотности`; это ссылки на stream/index или другие stream/view страницы, поэтому они не включены в список уроков.

## Verification

- `node --check scripts/getcourse-collect-lesson-links.js` — PASS.
- `pnpm getcourse:collect-links -- --help` — PASS.
- `pnpm getcourse:collect-links` — PASS after manual browser login.
- `GETCOURSE_DEBUG=0 pnpm getcourse:collect-links -- --headless` — PASS with saved storageState.
- `make verify` — PASS.
- `make test-unit` — PASS.
- `make test-e2e` — SKIPPED_NO_BROWSER_TARGET, штатный placeholder текущего baseline.
- `make build` — PASS.

## Doc sync

- `README.md` updated with GetCourse command, auth/session behavior, outputs and debug paths.
- `.gitignore` updated for debug/session-adjacent generated artifacts.
- Harness legacy scan updated to ignore vendored dependencies and raw generated proof logs.
