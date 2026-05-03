# DELEGATION.md

## Delegate

- read-only exploration of real code paths;
- narrow implementation slices with explicit file/module ownership;
- backend/API slices to `api_worker` when Spring/Maven/PostgreSQL specifics matter;
- web/admin/content slices to respective workers;
- independent fresh verification.

## Do not delegate

- final stage verdict without audit;
- recursive orchestration;
- competing writes to schema/API contracts/configs;
- multiple parallel migrations;
- overlapping auth/session/points/store changes.

## Good pattern

1. `task_explorer` maps paths and risks.
2. `stage_spec_freezer` writes testable contract.
3. `stage_builder` implements one slice and writes evidence.
4. `stage_verifier` fresh-checks evidence and repo state.
5. `stage_fixer` patches concrete proof gaps if needed.
6. A new fresh verifier checks again.
7. `stage_orchestrator` updates stage memory.

## Bad pattern

- parent writes a huge diff without decomposition;
- same context builds and declares PASS;
- workers edit shared contracts independently;
- verifier changes production code;
- docs drift is left for later.
