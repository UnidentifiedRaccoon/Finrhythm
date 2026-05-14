# Harness upgrade notes

Статус: bootstrap note  
Обновлено: 2026-05-14

## Что изменено

- Codex model policy upgraded to `gpt-5.5` + `xhigh` for parent and custom subagents.
- `approval_policy` set to `on-request` in root and profiles.
- Backend baseline set to Spring Boot + Java + Maven Wrapper + PostgreSQL.
- Stage skill made self-contained: it no longer depends on a separate task-loop skill.
- Added VRK-inspired durable artifacts: `stage_spec.md`, `feature_list.json`, `sprint_contract.md`, `evidence.md`, `evidence.json`, `verdict.json`, `problems.md`, `raw/`.
- Added stage roles: `stage_spec_freezer`, `stage_builder`, `stage_verifier`, `stage_fixer`.
- Added semantic harness self-check script.
- Added documentation workflow and doc-sync proof gate for material canonical changes.
- Added optional post-PASS publish handoff: verified slices delegate git/GitHub publish mechanics to `$push-main`, then print the next copyable continuation prompt when `publish_after_pass=true`.
- Added harness-lite risk tiers: Tier C code-first low-risk, Tier B compact integration proof, Tier A full regulated proof loop.
- Reduced default bootstrap profile to core stage agents while keeping optional specialists available.
- Added code-first/proof-churn guardrail script: `node scripts/check-code-first-slice.mjs`.
- Added default search exclusions for tracked proof history, raw content exports and generated runtime output.

## Почему

Long-running autonomous work fails when scope, evidence, docs and verification are not separated. The harness splits these concerns, but proof must stay proportionate: high-risk financial/privacy/schema work keeps full verification, while low-risk code slices should not produce more proof files than product code.

## Проверка

```bash
./scripts/validate-bootstrap.sh
```
