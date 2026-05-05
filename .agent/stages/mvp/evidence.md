# MVP stage evidence

Updated: 2026-05-05

## Current sprint: MVP-05-learning-methodology-doc-sync-001

Status: `PASS_WITH_ENV_LIMITATION`

This docs-only slice moves the user-provided learning methodology file into canonical product documentation and synchronizes product, stage and Harness docs. It does not implement runtime code and does not close `MVP-05`, `MVP-06`, `MVP-07`, `MVP-09`, `MVP-10`, `MVP-11`, `MVP-12` or full MVP.

### Changed canonical docs

- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/architecture/source-of-truth.md`
- `docs/stages/MVP.md`
- `docs/stages/v1.md`
- `docs/stages/v2.md`
- `.agents/skills/stage-launch-proof-loop/SKILL.md`
- `.agents/skills/stage-launch-proof-loop/references/PROTOCOL.md`
- `.agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md`

### Command and scan evidence

| Command/artifact | Result | Raw output |
|------------------|--------|------------|
| `git status --short` | INFO: docs/stage artifact changes only | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-git-status-20260505.txt` |
| methodology path uniqueness check excluding `.agent` | PASS: only `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-path-check-20260505.txt` |
| methodology link/path scan | PASS: product, stage and Harness docs reference methodology and key IDs | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-link-scan-20260505.txt` |
| contradiction scan | PASS: no stale root filename, `4–6`, `52-week`, `52-недель`, old pre/post P1 wording or future-methodology wording in canonical docs/Harness | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-contradiction-scan-20260505.txt` |
| expected-token scan | PASS: methodology/status/ID/stock/status markers found | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-expected-token-scan-20260505.txt` |
| Harness self-check | PASS | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-verify-harness-20260505.json` |
| `make verify` | BLOCKED/TIMEOUT: bootstrap checks passed; backend Maven step reported missing Java runtime and the duplicate long-running checks were terminated | `.agent/stages/mvp/raw/mvp-05-learning-methodology-doc-sync-make-verify-20260505.txt` |
| fresh `stage_verifier` | PASS | `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md`, `.agent/stages/mvp/raw/stage-verifier-mvp-05-learning-methodology-doc-sync-001-verify-harness-20260505-fresh.json` |

### Acceptance mapping

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 1. Root file removed | PASS | path uniqueness raw output |
| 2. Methodology doc exists at canonical product path | PASS | path uniqueness raw output |
| 3. Frontmatter and `accepted_with_human_gates` recorded | PASS | methodology doc and expected-token scan |
| 4. Stray leading `ё` removed | PASS | methodology doc heading starts with `# Этап 2...` after frontmatter |
| 5. Methodology source references are real repo paths | PASS | methodology doc source list |
| 6. Source-of-truth order includes methodology baseline | PASS | `docs/architecture/source-of-truth.md` |
| 7. Product foundation links methodology and removes stale wording | PASS | product foundation and contradiction scan |
| 8. MVP stage has `product_methodology` and read-before-freeze rules | PASS | `docs/stages/MVP.md` |
| 9. MVP stage carries v0.2 decisions without closing downstream units | PASS | `docs/stages/MVP.md`, `status.json` |
| 10. v1/v2 inherit baseline and no-advice/privacy guardrails | PASS | `docs/stages/v1.md`, `docs/stages/v2.md` |
| 11. Harness docs require methodology-aware evidence | PASS | skill/protocol/artifacts docs |
| 12. Stage artifacts are docs-only and preserve MVP-02 PASS proofs | PASS | `progress.md`, `status.json`, `feature_list.json` |
| 13. Link/path and contradiction scans recorded | PASS | raw scan outputs |
| 14. Harness verification recorded | PASS | verify_harness raw output |
| 15. `make verify` run or blocker recorded | BLOCKED_ENV | make verify raw output |
| 16. Fresh verifier reviews this slice | PASS | `.agent/stages/mvp/verdict.json`, `.agent/stages/mvp/problems.md` |

### API/OpenAPI, schema and screenshots

Not applicable. This slice changed documentation and stage artifacts only. No runtime API/controller/OpenAPI/generated-client surface, DB schema, migrations, UI or user-visible screen changed.

### Human gates

No human-gated item was closed. The methodology doc is `accepted_with_human_gates`; final financial correctness, legal/tax wording, HR wording, reward stock/prices/fulfillment and sensitive support answer policy remain pending.

## Prior verified sprints retained

- `MVP-01-bootstrap-001`: prior fresh verifier `PASS`.
- `MVP-02-tenant-domain-001`: prior fresh verifier `PASS`; closes only `MVP-02.01`.
- `MVP-02-invite-issuance-activation-001`: prior fresh verifier `PASS`; closes only `MVP-02.02`.

`MVP-02.03`, `MVP-02.04` and full MVP-02 remain open.
