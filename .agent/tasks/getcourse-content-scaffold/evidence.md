# GetCourse content export prompt and lesson scaffold evidence

Статус: DONE_WITH_HUMAN_PENDING

## Scope

- Создана папка `content/getcourse-path-to-money/`.
- Добавлен prompt для следующего безопасного этапа выгрузки: `content/getcourse-path-to-money/EXPORT_PROMPT.md`.
- Добавлены 8 markdown-карточек уроков по ссылкам из `course-export/lesson-links.json`.
- Карточки содержат pre-export описание по metadata страницы потока и структуру для последующего фактического контента.

## Safety

- Фактическое содержимое страниц уроков не скачивалось.
- Видео, DRM, attachments and protected assets не скачивались.
- Cookies, passwords, tokens and storage state в content-файлы не добавлялись.
- Все финансовые темы помечены `humanReview: required`.

## Files

- `content/getcourse-path-to-money/README.md`
- `content/getcourse-path-to-money/EXPORT_PROMPT.md`
- `content/getcourse-path-to-money/01-what-is-path-to-money.md`
- `content/getcourse-path-to-money/02-financial-freedom-fund.md`
- `content/getcourse-path-to-money/03-challenge.md`
- `content/getcourse-path-to-money/04-decluttering-home.md`
- `content/getcourse-path-to-money/05-financial-goals.md`
- `content/getcourse-path-to-money/06-tax-deductions.md`
- `content/getcourse-path-to-money/07-money-psychology.md`
- `content/getcourse-path-to-money/08-useful-financial-habits.md`

## Verification

- `rg -n "password|cookie|token|secret|bearer|authorization" content/getcourse-path-to-money .agent/tasks/getcourse-content-scaffold -S` — only safety wording, no secret values.
- `make verify` — PASS.

## Human gates

- Финансовая точность будущей выгрузки требует human review.
- Сейчас фактический учебный текст не переносился, поэтому карточки нельзя считать финальным контентом уроков.

