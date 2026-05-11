# Human gates

Ниже перечислены зоны, которые агент может подготовить, но не должен объявлять окончательно утверждёнными без человека.

## 1. Всегда human-gated

- юридические тексты: privacy, terms, disclaimer, consent copy;
- финальная финансовая корректность уроков, объяснений и quiz wording;
- reward economy rules и условия розыгрышей;
- pricing, paywall boundaries и billing policy;
- brand/lore/public copy финальной версии;
- реальные партнёры, реальные награды, реальные операционные процессы выдачи.
- B2B privacy/reporting boundaries, customer-specific analytics and handling of real employee data.

## 2. MVP-специфика

На этапе MVP агенту разрешено менять любые участки репозитория без предварительного согласования,
но он обязан явно отчитываться, если изменил:

- публичные формулировки;
- сценарии диагностики, обучения или поддержки;
- auth/session flows;
- schema migrations;
- API contracts;
- points/redemption rules;
- admin flows, влияющие на публикацию или выдачу наград;
- B2B tenant/pilot-launch/access-pool/reporting/privacy flows;
- merch fulfillment, operator exports and pilot outcome reporting.

## 3. B2B/privacy/reward operations

Для B2B-first MVP агент может подготовить docs, schemas, UI and draft logic, but final approval remains human-gated for:

- расширение HR/sponsor reporting beyond aggregated default;
- снижение anonymity threshold or showing smaller launch/access-pool slices;
- customer-specific reporting, exports or operational fields;
- use of real employee/customer data in any environment;
- real merch catalog, points prices, fulfillment rules and operator procedures;
- external customer-facing pilot claims, case studies or communication kit copy.

## 4. Как отражать human gate в артефактах

Используй один из честных статусов:

- `WAITING_HUMAN`
- `DONE_WITH_HUMAN_PENDING`

И обязательно указывай:
- что уже готово;
- что именно должен проверить человек;
- какой файл/экран/правило затронуто;
- какой риск будет, если merge произойдёт без проверки.
