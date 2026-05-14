# DELEGATION.md

## Delegate

- read-only exploration of real code paths;
- narrow implementation slices with explicit file/module ownership;
- backend/API slices to `api_worker` when Spring/Maven/PostgreSQL specifics matter;
- web/admin/content slices to respective workers;
- independent fresh verification.

For Tier C, do not delegate by default. For Tier B, delegate only the one or two bounded tasks that materially reduce risk. For Tier A/stage-close, use the full proof roles as needed.

## Do not delegate

- final stage verdict without audit;
- recursive orchestration;
- competing writes to schema/API contracts/configs;
- multiple parallel migrations;
- overlapping auth/session/points/store changes.

## Good pattern

Tier C good pattern: implement code first, run focused tests, record compact proof, run `check-code-first-slice` when product code changed.

Tier A good pattern:

1. `task_explorer` maps paths and risks when needed.
2. `stage_spec_freezer` writes testable contract.
3. `stage_builder` implements one slice and writes evidence.
4. `stage_verifier` fresh-checks evidence and repo state.
5. `stage_fixer` patches concrete proof gaps if needed.
6. A new fresh verifier checks again.
7. `stage_orchestrator` updates stage memory.
8. If post-PASS publish is explicitly requested, `stage_orchestrator` invokes `$push-main` for branch/commit/PR/merge/local-main update and prints the next continuation prompt when requested.

## Bad pattern

- parent writes a huge diff without decomposition;
- same context builds and declares PASS;
- workers edit shared contracts independently;
- verifier changes production code;
- docs drift is left for later.
