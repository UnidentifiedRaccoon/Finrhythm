# Audit: stage proof durability

Task: `audit-20260512-stage-proof-durability`
Issue: `P1 Stage proof durability`
Status: `PASS_STAGED_FOR_PUBLISH`
Updated: 2026-05-12
Scope: lightweight proof artifacts only; no production code; no raw transcript reads.

## Plan

1. Confirm the git/status durability gap for MVP stage proof refs.
2. Check latest tracked stage indexes and immutable proof/task refs without reading `.agent/stages/**/raw/**`.
3. Add a task-level audit note that publish/resume can use to include the required lightweight refs.
4. Validate JSON and run harness verification if available.

## Findings

- Latest MVP aliases are modified and already tracked by Git:
  - `.agent/stages/mvp/status.json`
  - `.agent/stages/mvp/evidence.json`
  - `.agent/stages/mvp/evidence.md`
  - `.agent/stages/mvp/verdict.json`
  - `.agent/stages/mvp/problems.md`
- Latest aliases point to scoped `PASS` for `MVP-03-onboarding-privacy-screen-001`.
- Immutable lightweight refs exist for the latest `MVP-03-onboarding-privacy-screen-001` proof bundle, but they were untracked at audit start.
- Immutable lightweight refs also exist for the preceding `MVP-06-learning-n3-fixture-001` proof bundle, but they were untracked at audit start.
- No `.agent/stages/**/raw/**` files were read or changed for this audit.
- Production code was not changed by this audit.
- Concurrent unrelated worktree changes were observed and left untouched.

## Publish-Critical Lightweight Refs

These refs are the minimal lightweight proof/task/audit refs that must be included with the publish commit/PR so resumed stage context is not reduced to mutable latest aliases:

- `.agent/stages/mvp/evidence/MVP-03-onboarding-privacy-screen-001.json`
- `.agent/stages/mvp/evidence/MVP-03-onboarding-privacy-screen-001.md`
- `.agent/stages/mvp/verdicts/MVP-03-onboarding-privacy-screen-001.json`
- `.agent/stages/mvp/problems/MVP-03-onboarding-privacy-screen-001.md`
- `.agent/stages/mvp/task-files/MVP-03-onboarding-privacy-screen-001.md`
- `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.json`
- `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.md`
- `.agent/stages/mvp/verdicts/MVP-06-learning-n3-fixture-001.json`
- `.agent/stages/mvp/problems/MVP-06-learning-n3-fixture-001.md`
- `.agent/stages/mvp/task-files/MVP-06-learning-n3-fixture-001.md`
- `.agent/tasks/audit-20260512-stage-proof-durability/evidence.json`
- `.agent/tasks/audit-20260512-stage-proof-durability/evidence.md`

## Git Index Action

The audit stages only the publish-critical refs above plus the current MVP latest proof aliases:

- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/verdict.json`
- `.agent/stages/mvp/problems.md`

No production code, raw transcript, latest alias rewrite, or unrelated worktree change is staged by this audit.

## Checks

- `git status --short --branch`: PASS, captured current dirty worktree and untracked proof refs before staging.
- `git diff --name-status`: PASS, captured tracked modified files before staging.
- `jq empty` over latest stage indexes, immutable proof refs, immutable verdict refs and this audit JSON: PASS.
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`: PASS at `2026-05-12T06:42:31.473421+00:00`.
- `git diff --cached --check`: PASS after removing audit-note trailing whitespace.

## Blockers

- No blocker inside this audit scope after the exact proof refs are staged. The publish step still must commit/PR the staged refs.
