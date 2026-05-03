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
```
