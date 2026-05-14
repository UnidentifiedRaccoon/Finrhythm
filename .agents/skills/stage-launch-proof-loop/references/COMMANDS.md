# COMMANDS.md

## `init-stage <stage_id> <stage_file>`

Create `.agent/stages/<stage_id>/` with templates, copy/pointer to source, normalized backlog and initial status. No production code changes.

## `run-stage <stage_id> <stage_file>`

Initialize if needed, classify Tier A/B/C, freeze or refresh scope only when risk/ambiguity requires it, pick one ready slice, build, collect proportionate evidence, verify by tier, update stage memory when handoff needs it.

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
Use $stage-launch-proof-loop to run stage from this repository. Spawn only the subagents needed by the slice risk.

Stage file: docs/stages/MVP.md
Stage ID: mvp

Use model gpt-5.5 with xhigh reasoning. Keep approval_policy on-request.
Classify Tier A/B/C first. Work one slice at a time. Use full proof and fresh verifier for Tier A/stage-close; use compact proof for Tier B/C unless risk escalates.
Do not set publish_after_pass=true or merge_after_pr=true unless the user/stage prompt explicitly asks to publish. If publishing is in scope, invoke repo-local $push-main for branch/commit/PR/merge/local-main update and print a continuation prompt only when requested.
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
2. Сначала классифицируй Tier A/B/C.
3. Используй только bounded leaf subagents when needed: `stage_builder`, `stage_verifier`, `stage_fixer`; `stage_spec_freezer` and domain workers are opt-in for ambiguous/high-risk slices.
4. Заморозь sprint/task contract only when tier/risk requires it.
5. Реализуй один substantial slice end-to-end, code-first for Tier C.
6. Обнови compact/full evidence by tier and canonical docs only for public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract changes.
7. Проведи fresh verification новым `stage_verifier` for Tier A/stage-close; use compact independent verification/focused tests for Tier B/C unless risk escalates.
8. Исправь только concrete verifier-reported proof gaps.
9. Проведи повторную fresh verification when Tier A fixes were needed.
10. Не объявляй DONE без proportionate evidence and required verifier/proof.
11. Если есть human-gate, зафиксируй статус честно: `DONE_WITH_HUMAN_PENDING`, `WAITING_HUMAN` или `BLOCKED`.

Если explicit publish requested после PASS, выполни post-PASS publish через repo-local `$push-main`:
- передай publish scope только verified slice;
- используй `publish_manifest.json` or PR body for PR summary, validation and proof refs;
- вызови `$push-main` для отдельной ветки, commit, PR в `main`, merge when allowed and local `main` update;
- если `$push-main` сообщает blocker по checks/protection/permissions/conflicts, зафиксируй blocker and stop after the last successful publish step;
- в финальном ответе снова выдай следующий copyable continuation prompt.
```
