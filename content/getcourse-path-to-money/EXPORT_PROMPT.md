# Prompt: безопасная выгрузка контента уроков GetCourse

Ты coding agent в репозитории `/Users/yura-posledov/cursor/Finrhythm`.

Задача: выполнить следующий безопасный этап выгрузки курса GetCourse: прочитать страницы 8 уроков из списка ниже и заполнить markdown-файлы в `content/getcourse-path-to-money/` фактическим содержимым уроков. Не скачивать видео, DRM-защищённые материалы, приватные cookies, токены, пароли или API-ключи.

Контекст:

- Пользователь является владельцем/админом курса.
- Список ссылок уже собран в `course-export/lesson-links.json`.
- Сессия Playwright может быть сохранена в `.local/getcourse/storage-state.json`; этот путь должен оставаться в `.gitignore`.
- Если нужна авторизация, открыть браузер Playwright в headful-режиме и дать пользователю войти вручную.
- Не выводить и не сохранять секреты.
- Работать только с доменом `fgrm.ncfg.ru`.

Уроки:

1. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694066` — Что такое раздел “Путь к деньгам”
2. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694143` — Фонд финансовой свободы
3. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694072` — Челлендж
4. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694147` — Расхламление дома
5. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694142` — Финансовые цели
6. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694139` — Налоговые вычеты
7. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694145` — Психология денег
8. `https://fgrm.ncfg.ru/teach/control/lesson/view/id/333694150` — Полезные финансовые привычки

Что нужно сделать:

1. Осмотреть текущий collector `scripts/getcourse-collect-lesson-links.js` и переиспользовать его безопасные части: доменное ограничение, ручной логин, storageState, debug-артефакты.
2. Создать отдельный скрипт, например `scripts/getcourse-export-lesson-content.js`.
3. Скрипт должен открывать страницы уроков по одной, в исходном порядке.
4. Для каждого урока собрать только видимый контент страницы:
   - заголовок урока;
   - основной текст;
   - структуру блоков и подзаголовков;
   - задания, вопросы, домашнюю работу, если они видны как текст;
   - ссылки на вложения и внешние ресурсы, если они видны;
   - сведения о видео только как metadata: наличие, видимый заголовок, provider, duration, poster или embed URL, если это явно видно на странице;
   - не скачивать сами видео, архивы, файлы и защищённые assets.
5. Для каждого урока обновить соответствующий markdown-файл в `content/getcourse-path-to-money/`.
6. Сохранять исходный URL, дату выгрузки, статус доступа, список найденных блоков и предупреждения.
7. Если структура страницы нестандартная, сохранить debug HTML/screenshot в `course-export/debug/lesson-content/`, но не сохранять секреты.
8. Если урок недоступен или требует дополнительного действия пользователя, не обходить защиту; записать honest status в markdown.
9. Не менять смысл учебного контента. Если текст выглядит как финансовая рекомендация, пометить `humanReview: required`.

Формат каждого markdown-файла:

```markdown
---
index: 1
title: "..."
sourceUrl: "https://fgrm.ncfg.ru/..."
exportStatus: "exported | blocked | needs_login | partial"
exportedAt: "ISO-8601"
humanReview: "required"
---

# Название урока

## Краткое описание

Фактическое краткое описание по видимому содержимому урока.

## Структура урока

1. ...
2. ...

## Основной контент

Текстовые блоки урока в порядке страницы.

## Задания и вопросы

Видимые задания, вопросы, формы, домашняя работа.

## Материалы и ссылки

Только ссылки и видимые названия материалов. Не скачивать файлы.

## Видео и embeds

Только metadata. Не скачивать видео.

## Финансовые утверждения для проверки

Список фрагментов, которые должен проверить человек.

## Технические заметки выгрузки

- accessStatus:
- warnings:
- sourceTextSelectors:
```

Команды проверки:

- `node --check scripts/getcourse-export-lesson-content.js`
- `pnpm getcourse:export-content -- --headless` после ручного логина
- `make verify`

Ожидаемый результат:

- 8 markdown-файлов заполнены фактическим текстовым содержимым уроков.
- Нет скачанных видео/DRM/assets.
- Нет секретов в git status или в файлах.
- Debug-артефакты находятся только в ignored paths.

