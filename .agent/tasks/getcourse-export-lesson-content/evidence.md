# GetCourse lesson content export evidence

Статус: DONE_WITH_HUMAN_PENDING

## Scope

- Добавлен безопасный exporter `scripts/getcourse-export-lesson-content.js`.
- Добавлен package script `pnpm getcourse:export-content`.
- Exporter читает `course-export/lesson-links.json` и обновляет markdown-файлы в `content/getcourse-path-to-money/`.
- Навигация ограничена уроками `https://fgrm.ncfg.ru/teach/control/lesson/view/...`.
- Off-domain, media and download-like requests block-listed at Playwright route layer.
- Видео не скачивались; в markdown сохранены только provider/embed metadata from DOM.
- Debug для недоступного урока сохранён только в ignored path `course-export/debug/lesson-content/`.

## Export result

- `01-what-is-path-to-money.md` — exported.
- `02-financial-freedom-fund.md` — exported.
- `03-challenge.md` — blocked: страница вернула `Возникла ошибка #404` / `Тренинг не найден`.
- `04-decluttering-home.md` — exported.
- `05-financial-goals.md` — exported.
- `06-tax-deductions.md` — exported.
- `07-money-psychology.md` — exported.
- `08-useful-financial-habits.md` — exported.

`exportedAt` для последнего запуска: `2026-05-04T12:29:31.935Z`.

## Safety

- `.local/getcourse/storage-state.json` проверен как ignored через `git check-ignore`.
- `course-export/debug/lesson-content/03-333694072.html` и `.png` проверены как ignored.
- Скан lesson markdown + debug lesson-content на служебные comment-config/user-answer/token/cookie/password patterns — PASS, совпадений нет.
- Пользовательские ответы и комментарии учеников исключены из markdown.
- Query parameters in visible URLs are stripped before writing markdown.

## Verification

- `node --check scripts/getcourse-export-lesson-content.js` — PASS.
- `pnpm getcourse:export-content -- --help` — PASS.
- `pnpm getcourse:export-content -- --headless` — PASS with saved Playwright storageState.
- `make verify` — PASS.
- `git check-ignore -v .local/getcourse/storage-state.json course-export/debug/lesson-content/03-333694072.html course-export/debug/lesson-content/03-333694072.png` — PASS.

## Doc sync

- `README.md` updated with the content export command, login/session behavior and debug path.
- `content/getcourse-path-to-money/README.md` updated from scaffold status to export status.

## Human gates

- `humanReview: "required"` remains in every lesson markdown.
- Финальная финансовая корректность, налоговые утверждения, психологические утверждения and reward wording require human review.
- Урок `03-challenge.md` requires owner/admin action in GetCourse or a corrected URL before factual content can be exported.
