# Contributing

Руководство по веткам, коммитам и Pull Request для этого репозитория.

## 1. Базовые принципы

- `main` всегда должен оставаться рабочим и mergeable.
- Любые изменения идут через Pull Request.
- Один PR = одна логическая задача.
- Один PR не должен смешивать feature, refactor, formatting, deps update и unrelated docs changes.
- Stage не считается завершённым без evidence и verifier pass.
- Если PR меняет product behavior, architecture/workflow contract или API expectations, canonical docs нужно обновить в том же PR.

## 2. Source of truth перед работой

Перед началом изменений сверяйся в таком порядке:

1. текущее состояние репозитория;
2. `docs/architecture/source-of-truth.md`;
3. stage-doc для текущего этапа;
4. `AGENTS.md` и ближайший локальный `AGENTS.md`;
5. `docs/engineering/definition-of-done.md`;
6. `docs/engineering/human-gates.md`.

## 3. Типы работ

Используй единый `<type>` в ветке, коммите и PR.

| Тип | Когда использовать |
| --- | --- |
| `feat` | новая функциональность |
| `fix` | исправление бага |
| `docs` | документация |
| `refactor` | переработка кода без изменения поведения |
| `perf` | оптимизация производительности |
| `test` | добавление или правка тестов |
| `style` | форматирование и линтерные правки без изменения логики |
| `build` | сборка, tooling, генерация, зависимости |
| `ci` | CI/CD и automation |
| `chore` | прочая техрутина |

## 4. Ветки

Формат:

```text
<type>/<short-kebab-case>
```

Опционально:
```text
<type>/<ticket>-<short-kebab-case>
```

Примеры:
- `feat/mvp-diagnostic-flow`
- `fix/api-points-ledger-race`
- `docs/update-source-of-truth`

Правила:
- название ветки описывает одну задачу;
- избегай общих веток вроде `feat/update`;
- если нашлась независимая вторая задача, выноси её в отдельную ветку и PR.

## 5. Коммиты

Формат conventional commits:

```text
<type>(scope): <summary>
```

Примеры:
- `feat(api): добавить CRUD для уроков`
- `fix(web): исправить потерю стрика после завершения урока`
- `docs: обновить source of truth`

Правила:
- `type` и `scope` — на conventional-английском;
- summary — на русском;
- summary должен быть коротким и конкретным;
- не смешивай в одном коммите независимые изменения;
- если изменение нетривиальное, добавляй body на русском.

## 6. Pull Request

### Заголовок
Тот же формат, что и у коммита:

```text
<type>(scope): <summary>
```

Примеры:
- `feat(web): добавить экран персонального маршрута`
- `fix(api): исправить двойное списание points`

### Что должно быть в PR

Рекомендуемая структура описания:

```md
## Цель
- какая проблема решается
- почему это нужно сейчас

## Что сделано
- ключевые изменения

## Как проверить
- команды
- сценарии
- ожидаемый результат

## Риски и примечания
- ограничения
- что осталось вне PR
- нужен ли human gate

## Скриншоты
- для UI-изменений
```

Описание PR — на русском.

## 7. Минимальная проверка перед PR

Для code changes ожидается минимум:
- `make verify`
- релевантный `make test-unit`
- релевантный `make build`

Для user-facing flows:
- browser smoke или `make test-e2e`
- screenshot evidence

Для backend/schema/API:
- миграции;
- notes по контракту;
- regeneration связанных generated artifacts.

Если часть проверок не выполнилась из-за ограничений среды, это нужно явно написать в PR.

## 8. Merge

- Перед merge нужен review.
- Обсуждения по замечаниям нужно закрывать по существу.
- Предпочтительный режим merge — `Squash & merge`.
- После merge ветку удалять.

## 9. Короткий workflow

```bash
git checkout main
git pull
git checkout -b <type>/<short-kebab-case>

# работа

git add .
git commit -m "<type>(scope): <summary>"
git push -u origin HEAD
gh pr create
```
