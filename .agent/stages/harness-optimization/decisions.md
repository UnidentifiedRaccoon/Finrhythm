# Decisions: harness-optimization

## 2026-05-08 — latest proof aliases require sprint identity consistency

Decision: `verify_harness.py --stage-id <id>` must fail when latest stage artifacts disagree on `sprint_contract_id`.

Reason: the previous harness could return PASS while `status.json`/`evidence.json` described one sprint and `verdict.json`/`problems.md` described another.

Impact: latest proof aliases are resume pointers; historical criteria should use immutable per-contract refs when available.

## 2026-05-08 — read-gating, not proof removal

Decision: harness optimization uses target-stage-only reading, `evidence.json` as an index and raw read-by-ref rules.

Reason: reducing context must not remove evidence, fresh verification, doc-sync or human-gate tracking.
