---
name: push-main
description: Repo-local fast publish workflow for `/push-main` and stage post-PASS publish: commit the prepared working tree on a separate branch, open a PR into main, wait for checks, merge it, switch local checkout back to main, and pull the merged update.
metadata:
  version: "1.0.0"
---

# Push Main

Use this skill when the user invokes `/push-main`, explicitly asks to publish the current prepared diff, or when `$stage-launch-proof-loop` reaches post-PASS publish with `publish_after_pass=true`.

This is a publish-only workflow for an already prepared diff. Do not run the FinLit stage harness, do not create subagents, and do not read `.agent/stages/**/raw/**` or `.agent/tasks/**/raw/**` unless the user gives an exact artifact path.

## Guardrails

- Treat `/push-main` as explicit approval to push a branch, open a ready PR, and merge it after available required checks pass.
- Never stage unrelated user changes silently. If `git status` or `git diff --name-status` shows a mixed worktree that does not look like one coherent publish scope, stop and ask which paths belong in the PR.
- Do not stage ignored/raw proof transcripts under `.agent/stages/**/raw/**` or `.agent/tasks/**/raw/**`. If they appear as untracked files, stop and ask before including any exact file.
- Do not change code while publishing. Only perform git/GitHub actions unless a pre-publish check exposes a simple metadata or whitespace issue that the user asks to fix.
- If checks fail, stop with the failing check URL and do not merge.
- If checks are absent, record that limitation before merging only when branch protection allows it and the user's command clearly asked to merge.
- Use Russian for commit summaries, PR titles, PR bodies, and final status.

## Workflow

1. Inspect publish scope from repo root:

```bash
git status --short --branch
git diff --stat
git diff --name-status
git diff --check -- ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'
gh --version
gh auth status
gh repo view --json nameWithOwner,defaultBranchRef
```

2. Choose a branch:

- If on `main`, create `codex/<short-scope-slug>` from current `main`.
- If already on a non-main publish branch, usually keep it unless the user asked for a fresh branch.
- Use the repo default branch from GitHub metadata as the PR base, but for this command it should be `main`.

3. Stage and commit:

```bash
# only when currently on main or when a fresh publish branch is needed
git switch -c codex/<short-scope-slug>
git add -A
git diff --cached --check -- ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'
git commit -m "<type(scope): краткое русское описание>"
```

Use `git add -A` only after confirming the whole worktree belongs to the publish scope and contains no raw proof transcripts. If scope is mixed, stage explicit paths instead.

4. Push the branch:

```bash
git push -u origin "$(git branch --show-current)"
```

5. Open a ready PR into `main`:

- Prefer the GitHub connector if available.
- If the connector returns `403 Resource not accessible by integration` or cannot create the PR, use `gh pr create`.
- PR body should include:
  - what changed;
  - validation already run;
  - note that the full proof loop was not rerun because this is publish-only, if relevant.

6. Wait for checks and merge:

```bash
gh pr view <number> --json number,url,state,isDraft,mergeable,mergeStateStatus,headRefOid,statusCheckRollup
gh pr checks <number> --watch --interval 10
gh pr merge <number> --merge --delete-branch --match-head-commit <head-sha>
```

If checks remain queued, keep waiting while they are making progress. If a check fails, stop and report the failed check.

7. Switch local checkout back to `main` and pull:

```bash
git switch main
git pull --ff-only origin main
git status --short --branch
git log -1 --oneline
gh pr view <number> --json number,url,state,mergedAt,mergeCommit,headRefName,baseRefName
```

8. Final response:

Report the commit SHA, branch, PR URL, check result, merge commit, and local `main` sync status. If git actions succeeded, emit the Codex app git directives for branch creation, staging, commit, push, and PR creation.
