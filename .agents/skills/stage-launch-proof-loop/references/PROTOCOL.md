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
4. read stage-linked `docs/product/**` product foundation markdown if present;
5. read the target stage file;
6. read `.agent/stages/<stage_id>/progress.md` and `feature_list.json` if present;
7. inspect current repo state;
8. run smoke checks if available.

Do not start coding until current repo state and scope are understood.
For the current FinLit MVP, product-intent baseline is `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`; it must be reconciled before spec freeze.

For any content, CMS, lesson adaptation, import/export or wording-review slice, also read:

- `content/getcourse-finstrategy/README.md`;
- `content/getcourse-finstrategy/CONTENT_BRIEF.md`;
- `.agent/tasks/content-main-course-cleanup/evidence.md` when present.

The active raw content baseline is `Курс «ФинCтратегия»` under `content/getcourse-finstrategy/`. The removed `Путь к деньгам` export is historical only and must not be used as source material.

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

For `content/`, CMS and lesson adaptation work:

- source provenance must point to `content/getcourse-finstrategy/` and `course-export/stream-546010026/`;
- `content/getcourse-finstrategy/CONTENT_BRIEF.md` is the quick map of theory sections;
- blocked lessons, human-review status and customer-specific labels must be represented in scope and evidence;
- raw financial, tax, credit, investment and pension wording remains human-gated until reviewed;
- do not reintroduce removed exploratory exports such as `content/getcourse-path-to-money/`.

## Completion policy

A slice is complete only if:

1. acceptance criteria are proven;
2. latest `verdict.json` is PASS or status is honestly blocked/human-pending;
3. evidence bundle is current;
4. canonical docs are synchronized;
5. human gates are explicitly represented;
6. repo is mergeable or exact blocker is recorded.

## Scope guardrails

Do not expand beyond stage source. For FinLit, especially avoid:

- promises of financial gain;
- unreviewed legal or financial advice wording;
- treating points as money;
- real partner/reward operations without human approval;
- employee-facing publication of raw customer-specific labels;
- speculative AI tutor work before relevant stage scope.
