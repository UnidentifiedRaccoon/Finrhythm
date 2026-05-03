# ARTIFACTS.md

## Stage directory

Each stage uses:

```text
.agent/stages/<stage_id>/
```

## Required files

### `source.md`

Pointer or copy of the stage source file and last sync notes.

### `stage_spec.md`

Frozen stage/slice scope. Include objective, in-scope, out-of-scope, source docs, acceptance criteria, repo areas, risks, verification plan and doc targets.

### `backlog.md`

Normalized execution units with stable IDs, dependencies, mode, goal, acceptance criteria, evidence expectations, repo areas and status.

### `feature_list.json`

Machine-friendly criteria list. Suggested shape:

```json
[
  {
    "id": "mvp-01-api-baseline",
    "category": "backend",
    "description": "Spring Boot Maven API baseline builds and exposes health/OpenAPI contract.",
    "steps": ["Run Maven verify", "Inspect OpenAPI endpoint", "Check PostgreSQL migration path"],
    "passes": false,
    "evidence_refs": []
  }
]
```

Rules:
- JSON array, not free-form markdown;
- do not delete criteria to make progress look better;
- set `passes=true` only after proof;
- every passed item needs evidence refs.

### `sprint_contract.md`

One implementation slice only. Include objective, exact acceptance criteria, ownership, files/modules in scope, docs targets, build/test plan, proof requirements and non-goals.

### `progress.md`

Append or update stage journal: completed work, active work, blockers, human gates, next recommended slice and verification summary.

### `decisions.md`

Stage-level decisions, why, alternatives and impact.

### `risks.md`

Technical, product, legal/content and operational risks with mitigation/status.

### `status.json`

Machine-readable stage summary: state, active/completed/waiting/blocked/next IDs, last updated, exit gate summary.

### `evidence.md`

Human-readable proof bundle: commands, tests, screenshots/logs, docs updated, known limitations and criteria mapping.

### `evidence.json`

Machine-readable proof index. Suggested keys: `stage_id`, `sprint_contract_id`, `commands`, `tests`, `artifacts`, `screenshots`, `documentation_updates`, `diagram_refs`, `human_gates`, `updated_at`.

### `verdict.json`

Verifier-owned:

```json
{
  "status": "PENDING",
  "summary": "",
  "failed_criteria": [],
  "proof_gaps": [],
  "last_verified_at": null
}
```

Valid statuses: `PENDING`, `FAIL`, `PASS`, `INSUFFICIENT_EVIDENCE`.

### `problems.md`

Verifier-owned when verdict is not pass. Include failed criterion, why not proven, reproduction, expected vs actual, suspected ownership and smallest safe fix direction.

### `raw/`

Raw outputs only: `maven-verify.txt`, `unit-tests.txt`, `smoke.txt`, `playwright.txt`, `curl-openapi.txt`, screenshots, logs.

## Ownership rules

- parent orchestrator owns phase transitions;
- spec freezer owns spec/backlog/feature/sprint contract;
- builder owns implementation and evidence;
- verifier owns verdict/problems;
- fixer owns concrete proof-gap patches;
- canonical docs stay outside stage directory and must be updated at owning paths.
