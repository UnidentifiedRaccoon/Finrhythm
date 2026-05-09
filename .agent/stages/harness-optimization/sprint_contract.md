# Sprint contract: HARNESS-OPT-002

Status: `PASS`
Created: 2026-05-09
Stage: `harness-optimization`
Execution mode: harness-only, no production implementation

## Objective

Close the concrete remaining harness optimization gaps found by the read-only audit:

- move verifier-owned file lists, verdict statuses, legacy scan patterns and content inventory facts into manifests;
- route content/methodology details through a dedicated content profile;
- add passed-stage status semantics so closed stages do not keep active sprint ids;
- preserve the original recommendation coverage and immutable proof refs.

## In scope

- Add `.agents/skills/stage-launch-proof-loop/harness.manifest.json`.
- Add `content/getcourse-finstrategy/content-baseline.manifest.json`.
- Add `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`.
- Update `verify_harness.py` to read required files, stage layout, verdict statuses, pass states, legacy scan patterns and content baseline facts from manifests.
- Update `scripts/validate-bootstrap.sh` to read required bootstrap files from the harness manifest.
- Update skill/reference docs to route content details through the profile.
- Set passed stage status semantics: `SPRINT_PASSED` stages keep `active_sprint_contract_id=null` and `active_ids=[]`; verifier rejects stale active ids.
- Update this stage's proof artifacts and coverage matrix.

## Out of scope

- Root `AGENTS.md` slimming to only router/non-negotiables.
- Full migration of legacy MVP-02 feature refs that still point at mutable latest aliases.
- Raw evidence index generation.
- Production application code, API/schema/UI/generated-client changes, content approval or human-gate closure.

## Acceptance criteria

1. Harness verifier reads required file lists, stage layout, valid verdict statuses, pass states, legacy scan config and content baseline path from `harness.manifest.json`.
2. Content baseline counts and inactive paths are read from `content-baseline.manifest.json`, not hardcoded in Python.
3. Bootstrap validation reads its required file list from `harness.manifest.json`.
4. Content/methodology details are moved into `profiles/CONTENT_PROFILE.md`; generic skill/protocol/artifact docs route to that profile.
5. `verify_harness.py` rejects a passed stage with a non-null `active_sprint_contract_id`.
6. Current `mvp` and `harness-optimization` stage statuses use `active_sprint_contract_id=null` when `SPRINT_PASSED`.
7. `verify_harness.py --stage-id mvp`, `--stage-id harness-optimization`, `--bootstrap-only`, Python compile, bootstrap validation and `git diff --check` pass.
8. Fresh verifier returns PASS.

## Evidence plan

- Python compile for `verify_harness.py`.
- Negative fixture for passed stage with non-null active sprint id.
- `verify_harness.py --stage-id mvp`.
- `verify_harness.py --stage-id harness-optimization`.
- `verify_harness.py --bootstrap-only`.
- `./scripts/validate-bootstrap.sh`.
- `node scripts/verify-bootstrap.mjs --quiet`.
- `git diff --check`.
- `java -version`; `make verify` only if Java exists.

## Human gates

No human gate is closed by this slice.
