# SUBAGENTS.md

## Global expectations

All custom agents in this workflow use:

- `model = "gpt-5.5"`;
- `model_reasoning_effort = "xhigh"`.

Keep the tree shallow. Parent orchestrates. Child agents are leaf roles.

## `stage_orchestrator`

Purpose: parent controller for one stage run.

Must maintain `.agent/stages/<stage_id>/`, choose next slice, enforce proof loop, and never self-certify.

## `task_explorer`

Purpose: read-only exploration.

Good tasks:
- map current API contract generation;
- find migration ownership;
- inspect points ledger path;
- find UI entry points;
- identify verification commands.

Must return findings with exact paths and proof checks.

## `stage_spec_freezer`

Purpose: freeze next slice into testable contract.

Owns `stage_spec.md`, `backlog.md`, `feature_list.json`, `sprint_contract.md`, task files.

Must preserve scope, non-goals, human gates and doc targets.

## `stage_builder`

Purpose: integration owner for implementation.

Owns implementation coherence and `evidence.*`. Must sync docs and record real commands/tests.

## Domain workers

- `api_worker`: Spring Boot, Java, Maven, PostgreSQL, Flyway, OpenAPI, backend integrity.
- `web_worker`: user-facing Next.js/mobile-first UI and screenshots.
- `admin_worker`: admin/CMS/operator flows and auditability.
- `content_worker`: content/CMS structures and human-gated wording.

Workers do not own final evidence or verdict.

## `stage_verifier`

Purpose: fresh proof check.

Owns `verdict.json` and `problems.md`. May write only verification artifacts. Treats docs drift and missing evidence as proof gaps.

## `stage_fixer`

Purpose: minimal safe fixes for concrete verifier-reported gaps.

Must not introduce new scope or mark work done.
