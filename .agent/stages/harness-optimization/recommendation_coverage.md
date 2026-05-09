# Recommendation coverage: harness-optimization

Status: `PASS`
Updated: 2026-05-09

This file preserves the user-provided harness optimization recommendations and records what `HARNESS-OPT-001` and `HARNESS-OPT-002` closed.

## Coverage matrix

| Recommendation | Status | Evidence / decision |
|---|---|---|
| P0 artifact consistency: latest `status.json`, `evidence.json`, `verdict.json`, `problems.md` must agree on one sprint contract. | DONE | `verify_harness.py` has a latest artifact consistency check; negative proof is `.agent/stages/harness-optimization/raw/fresh-final-negative-artifact-consistency-20260508.txt`; positive checks are `.agent/stages/harness-optimization/raw/fresh-final-verify-harness-stage-mvp-20260508.json` and `.agent/stages/harness-optimization/raw/fresh-final-verify-harness-stage-harness-optimization-20260508.json`. |
| P0 mutable evidence refs for latest content ingestion proof. | DONE_FOR_CURRENT_LATEST | Current MVP content-ingestion evidence now points to `.agent/stages/mvp/verdicts/MVP-05-content-spec-ingestion-001.json` and `.agent/stages/mvp/problems/MVP-05-content-spec-ingestion-001.md`. |
| P0 immutable per-sprint artifact layout. | DONE_FOR_CURRENT_LATEST | Added `evidence/`, `verdicts/` and `problems/` refs for current MVP content ingestion and this harness slice. Historical methodology verdict/problems are archived. Full legacy migration is follow-up. |
| P0 source loading/read-gating in `AGENTS.md` and source-of-truth. | DONE | `AGENTS.md`, `docs/architecture/source-of-truth.md` and `READ_MATRIX.md` define target-stage-only reads and raw read-by-ref. |
| P0 raw evidence policy: do not blanket-read raw, read exact refs only. | DONE | `READ_MATRIX.md` and `PROTOCOL.md` document raw read-by-ref. Raw retention remains unchanged. |
| P0 proof-loop duplication reduction. | PARTIAL_FOLLOW_UP | HARNESS-OPT-001 added routing/read-gating but did not slim root `AGENTS.md` into only non-negotiables. This is a separate docs cleanup because it affects repo-wide operating policy. |
| P1 product-specific content in generic skill should move to profiles. | DONE | `profiles/CONTENT_PROFILE.md` owns content/methodology IDs and content evidence rules; `SKILL.md`, `PROTOCOL.md`, `ARTIFACTS.md` and `READ_MATRIX.md` route to it. |
| P1 stage artifact overlap and immutable proof roles. | PARTIAL | Artifact role is documented in `ARTIFACTS.md` and current latest refs are immutable. Full migration of old criteria that still reference mutable latest aliases is deferred. |
| P1 root `AGENTS.md` should become router + global non-negotiables. | FOLLOW_UP | Only read-gating and approval typo were fixed. Full slimming is a separate high-blast-radius docs slice. |
| P1 no default v1/v2 reads for MVP. | DONE | `source-of-truth.md` and `READ_MATRIX.md` explicitly forbid default v1/v2 reads for MVP except migration, roadmap/audit, cross-stage compatibility or explicit user request. |
| P1/P2 hardcoded verifier counts should move to manifest. | DONE | `harness.manifest.json` owns harness file/status/scan config; `content-baseline.manifest.json` owns content counts/paths; `verify_harness.py` and `validate-bootstrap.sh` consume manifests. |
| P2 model/approval policy typo. | DONE | `AGENTS.md` now says not to change project/profile away from `approval_policy = "on-request"` without direct user command. |
| Current sprint ambiguity: closed sprint in `sprint_contract.md` while next work lives in `status.json.next_recommended_ids`. | PARTIAL_DONE | Verifier now rejects `SPRINT_PASSED` stages with non-null `active_sprint_contract_id` or non-empty `active_ids`; current passed statuses are updated. Full contract archive semantics remain future work. |
| Token policy conflict: “Do not optimize for token savings”. | DONE | `SKILL.md` now says not to optimize by dropping proof and to optimize via read-gating. |
| Verifier semantic checks beyond shape. | DONE_FOR_CURRENT_SCOPE | Latest artifact consistency, evidence verdict refs and passed-stage active-id semantics are checked. |
| Raw retention/index policy. | PARTIAL_FOLLOW_UP | Raw read-by-ref is documented. A `raw/INDEX.json` manifest is not yet implemented. |

## Follow-up slices

Recommended next slices, in priority order:

1. `HARNESS-OPT-003`: migrate legacy mutable MVP proof refs where historical immutable verifier artifacts are available, and explicitly mark unrecoverable legacy refs.
2. `HARNESS-OPT-004`: slim root `AGENTS.md` to router/non-negotiables and move stack details to local AGENTS/docs.
3. `HARNESS-OPT-005`: define raw evidence index format and generation rules.
