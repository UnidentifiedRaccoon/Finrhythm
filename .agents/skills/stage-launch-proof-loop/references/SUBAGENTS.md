# SUBAGENTS.md

## Global expectations

All custom agents in this workflow use:

- `model = "gpt-5.5"`;
- `model_reasoning_effort = "xhigh"`.

Keep the tree shallow. Parent orchestrates. Child agents are leaf roles.

Default lite profile requires only:

- `stage_orchestrator`;
- `stage_builder`;
- `stage_verifier`;
- `stage_fixer`.

`task_explorer`, `stage_spec_freezer` and domain workers are opt-in. Use them only when the slice risk, ambiguity or file ownership makes the extra context worthwhile.

## `stage_orchestrator`

Purpose: parent controller for one stage run.

Must maintain `.agent/stages/<stage_id>/`, choose next slice, enforce proof loop, and never self-certify.
After fresh verifier `PASS`, invokes `$push-main` and owns continuation handoff only when the prompt, sprint contract or `publish_manifest.json` explicitly requests post-PASS publish.

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

Owns `stage_spec.md`, `backlog.md`, `feature_list.json`, `sprint_contract.md`, task files when Tier A or ambiguous Tier B scope requires formal freeze.

Must preserve scope, non-goals, human gates and doc targets.

## `stage_builder`

Purpose: integration owner for implementation.

Owns implementation coherence and proportionate evidence. Must sync docs only when public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract changed, and must record real commands/tests.
If post-PASS publish is in scope, prepares compact `publish_manifest.json` proof refs and PR summary inputs; it does not merge or verify.

## Domain workers

- `api_worker`: Spring Boot, Java, Maven, PostgreSQL, Flyway, OpenAPI, backend integrity.
- `web_worker`: user-facing Next.js/mobile-first UI and screenshots.
- `admin_worker`: admin/CMS/operator flows and auditability.
- `content_worker`: content/CMS structures and human-gated wording.

Workers do not own final evidence or verdict.

## `stage_verifier`

Purpose: fresh proof check.

Owns `verdict.json` and `problems.md` for Tier A/stage-close verification. May write only verification artifacts. Treats material docs drift and missing required evidence as proof gaps.

## `stage_fixer`

Purpose: minimal safe fixes for concrete verifier-reported gaps.

Must not introduce new scope or mark work done.
