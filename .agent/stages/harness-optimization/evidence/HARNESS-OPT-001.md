# Evidence: HARNESS-OPT-001

Updated: 2026-05-08
Status: `PASS`

## Scope

Harness-only slice. No production app code, runtime content, API/schema/UI/generated-client files or human-gate statuses were changed.

## What changed

- `verify_harness.py` now checks latest stage artifact consistency across `sprint_contract.md`, `status.json`, `evidence.json`, `verdict.json`, `problems.md` and `evidence.json.verdict.*` refs.
- Current MVP latest verifier aliases now describe `MVP-05-content-spec-ingestion-001`.
- Superseded methodology verifier output is archived under immutable per-contract paths.
- Read-gating is documented in `READ_MATRIX.md`, root `AGENTS.md`, source-of-truth and harness references.
- Verifier templates now include `stage_id` and `sprint_contract_id`.
- The original recommendation list is mapped in `recommendation_coverage.md`.

## Command evidence

| Check | Status | Raw output |
|---|---|---|
| Python compile | PASS | `.agent/stages/harness-optimization/raw/py-compile-verify-harness-20260508.txt` |
| Negative stale-artifact fixture | PASS | `.agent/stages/harness-optimization/raw/negative-artifact-consistency-20260508.txt` |
| `verify_harness.py --stage-id mvp` | PASS | `.agent/stages/harness-optimization/raw/verify-harness-stage-mvp-20260508.json` |
| `verify_harness.py --stage-id harness-optimization` | PASS | `.agent/stages/harness-optimization/raw/verify-harness-stage-harness-optimization-20260508.json` |
| `verify_harness.py --bootstrap-only` | PASS | `.agent/stages/harness-optimization/raw/verify-harness-bootstrap-only-20260508.json` |
| `./scripts/validate-bootstrap.sh` | PASS | `.agent/stages/harness-optimization/raw/validate-bootstrap-20260508.txt` |
| `node scripts/verify-bootstrap.mjs --quiet` | PASS | `.agent/stages/harness-optimization/raw/node-verify-bootstrap-quiet-20260508.txt` |
| `git diff --check` | PASS | `.agent/stages/harness-optimization/raw/git-diff-check-20260508.txt` |
| `java -version` | BLOCKED_ENV | `.agent/stages/harness-optimization/raw/java-version-20260508.txt` |

`make verify` was not run because `java -version` reports that no Java Runtime is available in the current shell. This is a harness-only/docs/artifacts slice; backend Maven coverage is blocked by environment, not by code changes in `apps/api`.

## Acceptance mapping

| Criterion | Status | Evidence |
|---|---|---|
| 1. Stale latest verifier artifact fails | PASS | negative fixture raw output |
| 2. Current MVP latest artifacts agree | PASS | `verify_harness.py --stage-id mvp` raw output |
| 3. Evidence verdict refs are immutable and consistent | PASS | `evidence.json`, immutable verdict/problems files, stage verifier output |
| 4. Superseded methodology files archived | PASS | `.agent/stages/mvp/verdicts/MVP-05-learning-methodology-doc-sync-001.json`, `.agent/stages/mvp/problems/MVP-05-learning-methodology-doc-sync-001.md` |
| 5. Read-gating documented | PASS | `READ_MATRIX.md`, `AGENTS.md`, source-of-truth, skill/protocol |
| 6. Verdict/problems templates include sprint identity | PASS | template diff and Python compile |
| 7. No production/runtime/API/schema/UI/generated-client files changed | PASS | changed-files evidence and diff review |
| 8. Required harness checks pass or limitation recorded | PASS_WITH_ENV_LIMITATION | command evidence table; harness-optimization stage artifact self-check |
| 9. Fresh verifier review | PASS | `.agent/stages/harness-optimization/verdict.json`, `.agent/stages/harness-optimization/problems.md` |

## Immutable proof refs

- `.agent/stages/harness-optimization/evidence/HARNESS-OPT-001.json`
- `.agent/stages/harness-optimization/evidence/HARNESS-OPT-001.md`
- `.agent/stages/harness-optimization/verdicts/HARNESS-OPT-001.json`
- `.agent/stages/harness-optimization/problems/HARNESS-OPT-001.md`

## Human gates

No human-gated item was closed or changed.
