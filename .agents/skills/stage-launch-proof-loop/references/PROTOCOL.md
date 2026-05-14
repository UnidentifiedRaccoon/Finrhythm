# PROTOCOL.md

## Purpose

This protocol combines:

- stage source-of-truth execution;
- durable handoff artifacts;
- one-slice-at-a-time delivery;
- explicit proof before completion;
- a single integration owner;
- fresh verifier on every verification pass;
- targeted documentation sync.

## Risk tiers

Classify before workflow selection:

- Tier C: code-first low-risk UI/copy/test/refactor/component behavior with no API/schema/security/privacy/legal/financial/content-publish/reward/admin-sensitive/access-control impact. Use focused tests and compact proof.
- Tier B: integration work across web/API/client or an endpoint without regulated boundary changes. Use compact proof and independent/fresh verification proportional to risk.
- Tier A: schema, auth/session/access, diagnostics scoring, HR/privacy/reporting, legal/financial wording, content/CMS publish, points/rewards/redemption, real data, destructive admin or production operations. Use full proof loop.

Escalate to Tier A as soon as implementation touches a Tier A surface.

## Session start protocol

At the start of every stage session:

1. read `AGENTS.md`;
2. read `docs/architecture/source-of-truth.md`;
3. read `docs/architecture/documentation-workflow.md`;
4. apply `references/READ_MATRIX.md`;
5. read the target stage file only;
6. read `.agent/stages/<stage_id>/status.json`, active `sprint_contract.md` or task file, and `evidence.json` if present;
7. inspect current repo state;
8. run smoke checks if available.

Do not start coding until current repo state and scope are understood.
For the current FinLit MVP, product-intent baseline is `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`; it must be reconciled before spec freeze.
For content, learning, diagnostics, route rules, lesson templates, content approve-flow, support handoff, learning reports and wording-review slices, load `profiles/CONTENT_PROFILE.md`.
For non-content/backend/admin/harness slices, do not load product/content methodology docs unless the target stage metadata, task type or verifier problem requires them.
Raw evidence under `.agent/stages/**/raw/**` is never a default read target. Read raw only by exact reference from current `evidence.json`, current `problems.md` or an explicit audit question.
Raw evidence is also not a default commit target. Keep full transcripts and repeated screenshots in ignored `raw/`; tracked evidence must summarize outcomes and point to exact local raw refs when useful. All proof artifacts must stay under repo-root `.agent/`, never under `apps/*/.agent/`.

## Delegation policy

The top-level stage session is the only orchestrator.

Allowed child roles:

- `task_explorer`;
- `stage_spec_freezer`;
- `stage_builder`;
- domain workers: `api_worker`, `web_worker`, `admin_worker`, `content_worker`;
- `stage_verifier`;
- `stage_fixer`.

Not allowed:

- recursive child orchestration;
- deep delegation trees;
- verifier-led implementation;
- builder-led self-certification.

## Fan-out policy

Before spec freeze: up to 3 read-only explorers for disjoint questions.

After spec freeze: exactly 1 builder as integration owner. Domain workers may be used only when ownership is explicit and non-overlapping. Tier C should usually use no child agents; Tier B should use only the smallest useful subset.

Verification: exactly 1 fresh verifier per Tier A/stage-close pass. Tier B may use a fresh verifier or compact independent verification. Tier C uses focused tests plus compact proof unless risk escalates.

Fix: exactly 1 fixer per failure cycle.

## Backend policy

For `apps/api`:

- Spring Boot + Java + Maven Wrapper + PostgreSQL;
- Flyway append-only migrations;
- OpenAPI/springdoc as contract source;
- JUnit/Testcontainers for critical integration paths;
- no controller-heavy business logic;
- no silent API contract drift.

## Content policy

For `content/`, CMS and lesson adaptation work, load and follow `profiles/CONTENT_PROFILE.md`.

## Completion policy

A slice is complete only if:

1. acceptance criteria are proven;
2. Tier A/stage-close latest `verdict.json` is PASS, or Tier B/C compact proof is present, or status is honestly blocked/human-pending;
3. evidence bundle is current;
4. canonical docs are synchronized when the slice changed public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract;
5. human gates are explicitly represented;
6. repo is mergeable or exact blocker is recorded.

For Tier C/B, `verdict.json` and stage evidence files can be replaced by compact PR/final-report proof when no cross-session stage handoff is needed.

Before publishing, check the proof diff for churn. If a slice adds many raw logs or duplicate screenshots, replace them with compact tracked summaries and leave full raw files ignored locally unless an auditor explicitly asked for those exact artifacts.

## Post-PASS publish and continuation handoff

This phase runs only after a fresh verifier returns `PASS` and the active prompt, sprint contract or `publish_manifest.json` explicitly sets `publish_after_pass=true`. Execute the publish part through repo-local skill `$push-main` instead of duplicating git/GitHub mechanics in the stage harness.

Required preconditions:

1. evidence bundle, immutable proof refs and latest aliases point to the verified sprint contract;
2. canonical docs are synchronized or exact deferred gaps are recorded;
3. `status.json`/current proof and publish inputs are current; `progress.md` and `publish_manifest.json` are required only when the tier/handoff needs them;
4. human gates are represented honestly;
5. worktree scope contains only the completed slice or an exact blocker is recorded;
6. `git diff --check` passes for the publish scope, excluding `.agent/stages/**/raw/**` and `.agent/tasks/**/raw/**` when needed.

Responsibility split:

- stage harness owns PASS readiness, evidence/doc/status consistency and continuation prompt;
- `$push-main` owns publish-only workflow: create branch, commit verified scope, open PR into `main`, wait for checks, merge when allowed, switch local checkout to `main`, pull merged update;
- `$push-main` must not run the stage harness, create subagents, read raw evidence without exact refs, publish unrelated changes or bypass protection rules;
- if `$push-main` reports push, PR creation, merge, permissions, conflicts, checks or branch protection blocker, stop after the last successful step and report/record the blocker.

Final response requirements:

- report PR URL, merge status, local `main` HEAD and skipped/blocked steps;
- print a copyable continuation prompt directly in chat only when publish/stage handoff requested it;
- the prompt must tell the next run to continue from updated `main`, use `stage_orchestrator` with bounded leaf subagents, pick the next highest-impact verified slice, run `spec freeze -> build -> evidence -> fresh verify -> minimal fix -> fresh verify`, update docs/evidence, repeat post-PASS publish when requested and print the next continuation prompt.

## Scope guardrails

Do not expand beyond stage source. For FinLit, especially avoid:

- promises of financial gain;
- unreviewed legal or financial advice wording;
- treating points as money;
- modeling subscriptions, pro-seats or premium access as RBAC roles;
- adding `user.organization_id` instead of an organization membership model when account/organization membership is in scope;
- creating organization membership, roles or seats before invitation/code acceptance and identity verification/authentication;
- using invitation links as password setup links for an unverified login channel;
- storing Organization join codes as plain fields/tokens instead of separate revocable hashed entities;
- letting B2B pro-seat access leak across another organization of the same user;
- letting personal Pro expand corporate Organization context, or Organization subscription expand a user's personal context;
- starting B2C billing, pricing, paywall or paid-tier reward rules without explicit human-approved commercial scope;
- real partner/reward operations without human approval;
- employee-facing publication of raw customer-specific labels;
- speculative AI tutor work before relevant stage scope.
