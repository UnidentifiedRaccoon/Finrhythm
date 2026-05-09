# READ_MATRIX.md

## Назначение

Этот файл задаёт read-gating для stage harness: proof-loop, evidence, fresh verification и doc-sync не ослабляются, но агент не читает весь raw/history corpus по умолчанию.

## Базовый read set

Всегда перед нетривиальной stage/task работой:

- `AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- ближайший локальный `AGENTS.md`, если работа внутри `apps/**`, `packages/**`, `content/**` или `infra/**`;
- `docs/engineering/definition-of-done.md` перед закрытием slice.

## Stage work

Для stage-команд читать только целевой stage file:

- `stage_id=mvp` -> `docs/stages/MVP.md`;
- `stage_id=v1` -> `docs/stages/v1.md`;
- `stage_id=v2` -> `docs/stages/v2.md`.

Другие stage docs читать только для migration, roadmap/audit, cross-stage compatibility или прямого запроса пользователя.

## Existing stage/task resume

Если `.agent/stages/<stage_id>/` уже существует, читать в таком порядке:

1. `.agent/stages/<stage_id>/status.json`;
2. активный `.agent/stages/<stage_id>/sprint_contract.md` или `.agent/stages/<stage_id>/task-files/<TASK_ID>.md`;
3. `.agent/stages/<stage_id>/evidence.json` как machine index;
4. `.agent/stages/<stage_id>/problems.md`, только если latest verdict is not PASS or current task is a fix/verification pass;
5. `progress.md`, `decisions.md`, `risks.md` only when status/evidence do not answer the resume question.

Do not blanket-read `.agent/stages/**/raw/**`. Raw artifacts are read by exact ref from current evidence, failed verifier problem or explicit audit request.

## Task profiles

- Backend/API/schema slices: read `apps/api/AGENTS.md`, relevant Java/Flyway/OpenAPI paths and current contract evidence. Do not load content methodology unless task touches content/reporting/diagnostics.
- Web employee UI slices: read `apps/web/AGENTS.md`, relevant app routes/components, API client contract notes and screenshot requirements.
- Admin/CMS/operator slices: read `apps/admin/AGENTS.md`, admin surface, CMS/content status model and audit requirements.
- Content/CMS/learning/diagnostic/reporting slices: load `profiles/CONTENT_PROFILE.md`, then read only the profile-listed sources needed for the slice.
- Harness-only slices: read harness skill docs, templates, verifier scripts and affected stage/task artifacts; do not load product/content docs unless the verifier check being changed owns those facts.

## Proof refs

Use immutable per-contract proof refs for historical criteria whenever available:

- `.agent/stages/<stage_id>/evidence/<sprint_contract_id>.json`;
- `.agent/stages/<stage_id>/evidence/<sprint_contract_id>.md`;
- `.agent/stages/<stage_id>/verdicts/<sprint_contract_id>.json`;
- `.agent/stages/<stage_id>/problems/<sprint_contract_id>.md`.

Latest aliases (`evidence.json`, `evidence.md`, `verdict.json`, `problems.md`) are resume pointers for the current/latest sprint, not durable proof refs for older criteria.
