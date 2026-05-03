# AGENTS.md — apps/web

Локальные инструкции для пользовательского web-приложения.

## Что находится здесь

`apps/web` — это user-facing surface:
- онбординг;
- диагностический тест;
- обучение;
- challenge / marathon;
- магазин;
- профиль;
- поддержка.

## Локальные правила

- Всегда мыслить mobile-first.
- Desktop — не отдельный продукт, а адаптация того же сценария.
- Не переносить admin/CMS логику сюда.
- Не дублировать API contract types вручную; использовать `packages/api-client`.
- Не хранить источники истины контента в UI-коде; UI только рендерит данные и UI-state.
- User-visible copy и empty states — на русском.
- Любое изменение критичного пользовательского сценария требует screenshot evidence.
- Accessibility и понятность важнее декоративной сложности.
- Не добавлять сложную клиентскую state-машину без явной необходимости; предпочитать простые, трассируемые flows.

## Что считать критичным

- signup/login
- diagnostic flow
- lesson completion
- quiz submission
- reward/points feedback
- store redemption
- support request
- profile/settings changes

Для этих сценариев нужны browser smoke или e2e.
