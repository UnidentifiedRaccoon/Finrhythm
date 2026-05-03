# AGENTS.md — apps/admin

Локальные инструкции для admin/CMS surface.

## Что находится здесь

`apps/admin` — операторская и редакторская поверхность:
- CRUD контента;
- управление challenge / marathon;
- управление rewards/store;
- moderation/support инструменты;
- служебные статусы и аудит.

## Локальные правила

- Думать как об operator tool, а не как о marketing UI.
- Основной приоритет: понятность, надёжность, auditability.
- Любые destructive actions делать с явным подтверждением в UI и понятным результатом.
- В admin surface особенно важны:
  - фильтры;
  - bulk actions;
  - statuses;
  - audit-friendly logs;
  - clear empty/error states.
- Не дублировать backend business rules в UI.
- Если CRUD зависит от справочников/enum/status maps, их source of truth должен быть трассируемым.
- User-visible copy для операторов — на русском.
- Изменения operator workflows требуют screenshot evidence и краткое описание сценария проверки.

## Что считать критичным

- публикация / снятие с публикации контента;
- изменение reward rules;
- изменение видимости store items;
- обработка support tickets;
- импорт/экспорт контента;
- массовые изменения сущностей.
