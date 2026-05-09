# Evidence: HARNESS-OPT-002

Updated: 2026-05-09
Status: `PASS`

## Scope

Harness-only follow-up slice. No production app code, API/schema/UI/generated-client behavior, content approval or human-gate status is changed.

## What changed

- Added `.agents/skills/stage-launch-proof-loop/harness.manifest.json`.
- Added `content/getcourse-finstrategy/content-baseline.manifest.json`.
- Added `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`.
- Updated `verify_harness.py` to read required file lists, valid verdict statuses, pass states, legacy scan patterns and content baseline facts from manifests.
- Updated `scripts/validate-bootstrap.sh` to read bootstrap required files from the harness manifest.
- Routed generic content/methodology instructions through `CONTENT_PROFILE.md`.
- Added verifier semantics for passed stages: `SPRINT_PASSED` stages must keep `active_sprint_contract_id=null` and `active_ids=[]`.
- Updated current `mvp` and `harness-optimization` status artifacts to follow that status model where applicable.

## Command evidence

| Check | Status | Raw output |
|---|---|---|
| Python compile | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-py-compile-20260509.txt` |
| Passed-stage active-id negative fixture | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-negative-passed-active-id-20260509.txt` |
| `verify_harness.py --stage-id mvp` | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-verify-stage-mvp-20260509.json` |
| `verify_harness.py --stage-id harness-optimization` | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-verify-stage-harness-optimization-20260509.json` |
| `verify_harness.py --bootstrap-only` | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-verify-bootstrap-only-20260509.json` |
| `./scripts/validate-bootstrap.sh` | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-validate-bootstrap-20260509.txt` |
| `node scripts/verify-bootstrap.mjs --quiet` | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-node-verify-bootstrap-quiet-20260509.txt` |
| `git diff --check` | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-git-diff-check-20260509.txt` |
| `java -version` | BLOCKED_ENV | `.agent/stages/harness-optimization/raw/harness-opt-002-java-version-20260509.txt` |

## Acceptance mapping

| Criterion | Status | Evidence |
|---|---|---|
| 1. Harness verifier reads harness facts from manifest | PASS | `harness.manifest.json`, `verify_harness.py` |
| 2. Content baseline facts read from manifest | PASS | `content-baseline.manifest.json`, `verify_harness.py` |
| 3. Bootstrap validation reads manifest | PASS | `scripts/validate-bootstrap.sh` |
| 4. Content profile routing | PASS | `profiles/CONTENT_PROFILE.md`, `SKILL.md`, `PROTOCOL.md`, `ARTIFACTS.md`, `READ_MATRIX.md` |
| 5. Passed-stage active-id negative check | PASS | `.agent/stages/harness-optimization/raw/harness-opt-002-negative-passed-active-id-20260509.txt` |
| 6. Current passed status semantics | PASS | `mvp/status.json`, `harness-optimization/status.json` after final PASS |
| 7. Harness checks | PASS_WITH_ENV_LIMITATION | command evidence table |
| 8. Fresh verifier | PASS | `.agent/stages/harness-optimization/verdicts/HARNESS-OPT-002.json`, `.agent/stages/harness-optimization/problems/HARNESS-OPT-002.md` |

## Human gates

No human-gated item was closed or changed.
