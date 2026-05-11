# Evidence: access-subscription-model-doc-sync

Status: `DOC_SYNC_VERIFIED`  
Date: 2026-05-11  
Scope: documentation and harness guardrails only; no production code, schema, API, UI or generated client changes.

## Objective

Record the detailed Organization/User/OrgMembership/RBAC/invitation/code/subscription/seat model from `/Users/elena/Downloads/organization_access_subscription_model.md` as canonical repo documentation and make the stage harness route future development slices to it.

## Docs and harness updated

- `docs/architecture/organization-access-subscription-model.md` — added detailed model with FinLit-normalized `OrgMembership`/`org_memberships` naming, safe invitation/password separation, organization codes, `UserSubscription`, `OrgSubscription`, seats, audit log and transactional acceptance rules.
- `docs/architecture/access-and-subscriptions.md` — linked the detailed model and reconciled source records with optional `entitlement_grant` projection.
- `docs/architecture/source-of-truth.md` — added the detailed model to the access/organization source-of-truth baseline.
- `AGENTS.md` — added the model to development guardrails and source ordering for access/account slices.
- `docs/stages/MVP.md`, `docs/stages/v1.md`, `docs/stages/v2.md` — linked stage work to the detailed model where access/subscription/account scope appears.
- `docs/architecture/documentation-workflow.md` and `docs/engineering/contributing.md` — added the model to doc-sync/source-order guidance.
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md` and `references/PROTOCOL.md` — made access/invitation/code/subscription/seat slices read the detailed model and avoid unsafe shortcuts.
- `.agents/skills/stage-launch-proof-loop/harness.manifest.json` and `scripts/verify_harness.py` — added the model to bootstrap-required docs and verified bootstrap-required files in harness checks.

## Checks run

| Command | Result | Raw evidence |
| --- | --- | --- |
| `python3 -m json.tool .agents/skills/stage-launch-proof-loop/harness.manifest.json` | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/harness-manifest-json-check-20260511.json` |
| `python3 -m py_compile .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py` | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/py-compile-verify-harness-20260511.txt` |
| `git diff --check` | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/git-diff-check-20260511.txt` |
| `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --bootstrap-only` | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/verify-harness-bootstrap-only-20260511.json` |
| `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id harness-optimization` | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/verify-harness-stage-harness-optimization-20260511.json` |
| `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp` | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/verify-harness-stage-mvp-20260511.json` |
| stale/legacy reference scan for old entitlement-only wording, raw download filename, `members` table and `member_roles` shortcuts | PASS | `.agent/tasks/access-subscription-model-doc-sync/raw/model-reference-scan-20260511.txt` |

## Criteria mapping

| Criterion | Status | Evidence |
| --- | --- | --- |
| User-authored model is placed next to canonical architecture docs. | PASS | `docs/architecture/organization-access-subscription-model.md`. |
| Existing access/subscription docs point to the new detailed model. | PASS | `docs/architecture/access-and-subscriptions.md`, `docs/architecture/source-of-truth.md`. |
| Development harness routes future slices to the new model. | PASS | `READ_MATRIX.md`, `PROTOCOL.md`, `harness.manifest.json`, `verify_harness.py`. |
| Stage docs and repo-wide agent instructions reference the model where relevant. | PASS | `AGENTS.md`, `docs/stages/MVP.md`, `docs/stages/v1.md`, `docs/stages/v2.md`. |
| Model does not reintroduce `user.organization_id`, subscription-as-role or pre-acceptance membership shortcuts. | PASS | model-reference scan and detailed model sections 2, 6-8, 11-12, 18-24. |

## Human gates and limitations

- No production code, DB schema, API contract, generated client or UI was changed.
- Pricing, paywall, billing provider, refund policy, B2B contract quantities, paid-tier reward/store rules and real employee data/reporting boundaries remain human-gated.
- The document normalizes the source file's `Member` wording to the repo canonical `OrgMembership`/`org_memberships` naming to stay consistent with existing guardrails.
