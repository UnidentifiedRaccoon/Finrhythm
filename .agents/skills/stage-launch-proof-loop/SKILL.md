---
name: stage-launch-proof-loop
description: Repo-local FinLit workflow skill for executing docs/stages/MVP.md, v1.md and v2.md with durable stage artifacts, bounded gpt-5.5/xhigh subagents, evidence, documentation sync and mandatory fresh verification.
license: Apache-2.0
compatibility: Codex-compatible coding agents with project-scoped subagents.
metadata:
  author: OpenAI
  version: "2.0.0-finlit"
---

# Stage Launch Proof Loop

Use this skill when FinLit work is a stage or a non-trivial stage execution unit, not a tiny one-file edit.

This skill is self-contained: it includes stage-level orchestration and task-level proof loop rules. It does not require any external task-loop skill.

## When to use

Use when the user asks to:

- execute `docs/stages/MVP.md`;
- execute `docs/stages/v1.md`;
- execute `docs/stages/v2.md`;
- decompose a stage into execution units;
- continue or audit `.agent/stages/<stage_id>/`;
- close a stage slice with evidence and fresh verification.

## Required model and approval policy

For parent and custom subagents:

- `model = "gpt-5.5"`;
- `model_reasoning_effort = "xhigh"`;
- `approval_policy = "on-request"` in Codex config/profiles.

Do not optimize for token savings. Optimize for correctness, durable handoff, and proof.

## Supported commands

Treat these phrases as skill commands:

- `init-stage <stage_id> <stage_file>`;
- `run-stage <stage_id> <stage_file>`;
- `resume-stage <stage_id>`;
- `status-stage <stage_id>`;
- `verify-stage <stage_id>`;
- `audit-stage <stage_id>`;
- `close-stage <stage_id>`.

If no command is supplied, infer next step from repo state:

1. if stage folder is missing, initialize it;
2. if spec/backlog is stale, freeze/update scope;
3. if a sprint contract is ready but not implemented, build one slice;
4. if evidence exists but verdict is stale/non-pass, run fresh verification or minimal fix;
5. if exit gates and human gates are resolved, audit/close.

## Stage artifact contract

Each stage lives under:

```text
.agent/stages/<stage_id>/
  source.md
  stage_spec.md
  backlog.md
  feature_list.json
  sprint_contract.md
  progress.md
  decisions.md
  risks.md
  status.json
  evidence.md
  evidence.json
  verdict.json
  problems.md
  raw/
  task-files/
  audits/
```

These files are the source of truth for cross-session handoff. Session-local todo UI is not authoritative.

## Top-level workflow

### 1. Re-sync at the start

Before changes:

1. read `AGENTS.md`;
2. read `docs/architecture/source-of-truth.md`;
3. read `docs/architecture/documentation-workflow.md`;
4. read stage-linked `docs/product/**` product foundation markdown if present;
5. read relevant `docs/stages/*.md`;
6. read existing `.agent/stages/<stage_id>/progress.md`, `feature_list.json`, `sprint_contract.md` if present;
7. inspect recent git state/history when available;
8. run smoke/baseline checks if app/tooling exists.

If smoke fails, record blocker or fix baseline before new implementation.

For content, CMS, lesson adaptation, import/export or wording-review slices, also read:

- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
- `content/getcourse-finstrategy/README.md`;
- `content/getcourse-finstrategy/CONTENT_BRIEF.md`;
- `.agent/tasks/content-main-course-cleanup/evidence.md` if present.

The active raw content baseline is `Курс «ФинCтратегия»` under `content/getcourse-finstrategy/`. The removed `Путь к деньгам` export is not an active source.

### 2. Freeze scope before implementation

If stage spec, backlog or sprint contract is missing/stale/ambiguous:

- optionally use up to 3 read-only explorers;
- use exactly 1 spec freezer;
- update `stage_spec.md`, `backlog.md`, `feature_list.json`, `sprint_contract.md`, task files as needed.

Spec freezer reduces ambiguity. It must not expand stage scope.

For FinLit MVP, `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` is the current product-intent baseline. Spec freezer must reconcile it with `docs/stages/MVP.md` before selecting or writing a sprint contract. Binary files under product `references/` are supporting artifacts only until normalized into markdown.

For content slices, freeze scope against the `content/getcourse-finstrategy/` inventory and explicitly list blocked lessons, human-review gates and brand-normalization assumptions.

### 3. Build one sprint contract at a time

After scope is frozen:

- use exactly 1 builder as integration owner;
- optionally use domain workers only when ownership is explicit and disjoint;
- builder owns evidence bundle;
- builder updates canonical docs if behavior, architecture, workflow or API contract changed.

Backend slices must respect Spring Boot + Java + Maven + PostgreSQL baseline.

Content slices must preserve raw-source provenance, must not publish `humanReview: "required"` content as approved, and must record any customer-specific labels that require normalization before employee-facing use.

### 4. Evidence is mandatory

After implementation:

- gather commands run;
- store relevant raw outputs under `raw/`;
- record screenshots for UI/user-visible behavior;
- update `evidence.md` and `evidence.json`;
- map acceptance criteria to evidence;
- list docs updated and human gates.

Never mark a criterion as passing based on code inspection alone.

### 5. Documentation sync is mandatory

Before verification:

- update canonical docs that own changed decisions;
- add/refresh Mermaid diagrams for non-trivial flows/states/interactions;
- keep stage artifacts as proof and handoff, not canonical docs replacement.

Material documentation drift is a proof gap.

### 6. Fresh verification is mandatory

For each verification pass:

- use exactly 1 fresh verifier;
- verifier may write only verification artifacts;
- verifier writes `verdict.json` and `problems.md` if not PASS;
- verifier treats missing evidence, stale docs, API/schema drift and unresolved human gates as proof gaps.

Fresh means a new verifier session, not a resumed implementation context.

### 7. Fix minimally, then verify again

If verifier fails:

- use exactly 1 fixer;
- patch only concrete proof gaps;
- refresh evidence;
- run a new fresh verifier.

Repeat until PASS, WAITING_HUMAN, BLOCKED or honest partial state.

### 8. Close cleanly

At the end of each session:

- update `progress.md`, `decisions.md`, `risks.md`, `status.json`;
- update only truly proven `passes=true` entries in `feature_list.json`;
- leave docs consistent;
- leave repo in a clean mergeable state or record exact blocker.

## Hard rules

- Do not declare stage done early.
- Do not mark features passing without proof.
- Do not let child agents recursively orchestrate.
- Do not let workers own final evidence or verdict.
- Do not let verifier edit production code.
- Do not treat stage artifacts as replacement for canonical docs.
- Do not leave material documentation drift unresolved.
- Do not use real personal/financial data in seeds/tests.
- Do not treat removed or exploratory content exports as active source material.

## References

- `references/PROTOCOL.md`
- `references/ARTIFACTS.md`
- `references/SUBAGENTS.md`
- `references/COMMANDS.md`
- `references/DELEGATION.md`
- `scripts/verify_harness.py`
