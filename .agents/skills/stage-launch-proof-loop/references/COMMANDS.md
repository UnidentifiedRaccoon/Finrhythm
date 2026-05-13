# COMMANDS.md

## `init-stage <stage_id> <stage_file>`

Create `.agent/stages/<stage_id>/` with templates, copy/pointer to source, normalized backlog and initial status. No production code changes.

## `run-stage <stage_id> <stage_file>`

Initialize if needed, freeze or refresh scope, pick one ready sprint contract, build, collect evidence, fresh verify, update stage memory.

## `resume-stage <stage_id>`

Re-sync from existing artifacts, repo state and recent evidence. Continue the next safe step.

## `status-stage <stage_id>`

Report active work, completed units, blockers, human gates, last verdict and next ready unit.

## `verify-stage <stage_id>`

Run a fresh verifier pass against the current sprint contract and evidence.

## `audit-stage <stage_id>`

Write `.agent/stages/<stage_id>/audits/stage-audit.md` comparing actual repo state and evidence to stage exit gates.

## `close-stage <stage_id>`

Close only if exit gates are proven or explicitly human-pending/blocked. Never close with hidden proof gaps.

## Recommended parent prompt

```text
Spawn subagents. Use $stage-launch-proof-loop to run stage from this repository.

Stage file: docs/stages/MVP.md
Stage ID: mvp

Use model gpt-5.5 with xhigh reasoning. Keep approval_policy on-request.
Work one sprint contract at a time. Require doc-sync, evidence and fresh verification.
When the active sprint reaches fresh verifier PASS, set/update publish_manifest.json with publish_after_pass=true and merge_after_pr=true if publishing is in scope, then invoke repo-local $push-main for branch/commit/PR/merge/local-main update. Print the next copyable continuation prompt in the final chat response.
```

## Continuation prompt template

After post-PASS publish flow, print this prompt in the final chat response with placeholders filled from the actual run:

```text
Продолжи разработку FinPulse/FinLit с обновленной локальной ветки `main`.

Контекст:
- предыдущий slice опубликован через PR: <PR_URL_OR_BLOCKER>
- merge status: <MERGED_OR_BLOCKED>
- локальный `main` обновлен до HEAD: <MAIN_HEAD_OR_BLOCKER>
- stage/task context: <STAGE_OR_TASK_ID>
- последние evidence/verifier artifacts: <EVIDENCE_AND_VERDICT_PATHS>

Запусти repo-local `$stage-launch-proof-loop`.

Цель следующего запуска: добиться значительного продуктового прогресса по уже разработанному функционалу. Выбери следующий самый ценный проверяемый vertical slice из актуального stage/task scope и доведи его до состояния с доказательствами, а не ограничивайся анализом.

Обязательный workflow:
1. Подними один top-level `stage_orchestrator` на `gpt-5.5` + `xhigh`.
2. Используй только bounded leaf subagents: `stage_spec_freezer`, `stage_builder`, `stage_verifier`, `stage_fixer` and relevant domain workers when needed.
3. Сначала заморозь конкретный sprint/task contract.
4. Реализуй один substantial slice end-to-end.
5. Обнови evidence, docs and canonical notes, если behavior, API, UI, setup or workflow changed.
6. Проведи fresh verification новым `stage_verifier`.
7. Исправь только concrete verifier-reported proof gaps.
8. Проведи повторную fresh verification when fixes were needed.
9. Не объявляй DONE без evidence and PASS verifier.
10. Если есть human-gate, зафиксируй статус честно: `DONE_WITH_HUMAN_PENDING`, `WAITING_HUMAN` или `BLOCKED`.

После PASS выполни post-PASS publish через repo-local `$push-main`:
- передай publish scope только verified slice;
- используй `publish_manifest.json` for PR summary, validation and proof refs;
- вызови `$push-main` для отдельной ветки, commit, PR в `main`, merge when allowed and local `main` update;
- если `$push-main` сообщает blocker по checks/protection/permissions/conflicts, зафиксируй blocker and stop after the last successful publish step;
- в финальном ответе снова выдай следующий copyable continuation prompt.
```
