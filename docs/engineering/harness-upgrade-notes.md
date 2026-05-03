# Harness upgrade notes

Статус: bootstrap note  
Обновлено: 2026-05-03

## Что изменено

- Codex model policy upgraded to `gpt-5.5` + `xhigh` for parent and custom subagents.
- `approval_policy` set to `on-request` in root and profiles.
- Backend baseline set to Spring Boot + Java + Maven Wrapper + PostgreSQL.
- Stage skill made self-contained: it no longer depends on a separate task-loop skill.
- Added VRK-inspired durable artifacts: `stage_spec.md`, `feature_list.json`, `sprint_contract.md`, `evidence.md`, `evidence.json`, `verdict.json`, `problems.md`, `raw/`.
- Added stage roles: `stage_spec_freezer`, `stage_builder`, `stage_verifier`, `stage_fixer`.
- Added semantic harness self-check script.
- Added mandatory documentation workflow and doc-sync proof gate.

## Почему

Long-running autonomous work fails when scope, evidence, docs and verification are not separated. The new harness splits these concerns and requires fresh verification before anything is marked complete.

## Проверка

```bash
./scripts/validate-bootstrap.sh
```
