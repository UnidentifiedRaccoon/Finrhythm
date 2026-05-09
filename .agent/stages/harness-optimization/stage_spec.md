# Stage spec: harness-optimization

Status: `PASS`
Latest slice: `HARNESS-OPT-002`

## Objective

Improve harness correctness and context selection by adding semantic artifact consistency checks and read-gating documentation.

## In scope

- Harness verifier consistency check.
- Read-gating matrix and doc sync.
- Manifest-driven harness verifier configuration.
- Content profile routing.
- Passed-stage status semantics.
- Current MVP latest proof alias reconciliation.
- Immutable per-contract proof refs for the current MVP content ingestion verdict/problems and archived methodology verdict/problems.

## Out of scope

- Product stage scope changes.
- Production application code.
- API/schema/UI/generated-client changes.
- Content approval or human-gate closure.
- Full manifest refactor for hardcoded content counts.
- Full legacy migration of all mutable historical proof refs.

## Acceptance criteria

1. Stale latest sprint proof mismatch is detected.
2. Current MVP latest proof state is consistent.
3. Evidence verdict refs point to immutable current proof files.
4. Read-gating is documented.
5. Templates carry sprint identity.
6. No production/API/schema/UI/generated-client changes are present.
7. Fresh verifier returns PASS.
8. Harness verifier reads mutable harness facts from manifests.

## Verification plan

See `evidence.md` and `verdict.json`.
