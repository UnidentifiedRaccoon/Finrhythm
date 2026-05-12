# PROTOCOL.md

## Purpose

This protocol combines:

- stage source-of-truth execution;
- durable handoff artifacts;
- one-slice-at-a-time delivery;
- explicit proof before completion;
- a single integration owner;
- fresh verifier on every verification pass;
- mandatory documentation sync.

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

After spec freeze: exactly 1 builder as integration owner. Domain workers may be used only when ownership is explicit and non-overlapping.

Verification: exactly 1 fresh verifier per pass.

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
2. latest `verdict.json` is PASS or status is honestly blocked/human-pending;
3. evidence bundle is current;
4. canonical docs are synchronized;
5. human gates are explicitly represented;
6. repo is mergeable or exact blocker is recorded.

Before publishing, check the proof diff for churn. If a slice adds many raw logs or duplicate screenshots, replace them with compact tracked summaries and leave full raw files ignored locally unless an auditor explicitly asked for those exact artifacts.

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
