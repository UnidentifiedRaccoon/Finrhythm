# Audit issue: P1 Runtime content boundary

Дата: 2026-05-12

## Scope

- Перенести крупный demo lesson fixture payload из `apps/web/lib/learning-fixtures.ts` в импортируемый источник под `content/`.
- Оставить `apps/web` потребителем/адаптером для renderer state, без статуса content source of truth.
- Сохранить review/provenance для demo уроков и явно не использовать `production_ready`.
- Добавить focused web tests/guardrails для runtime boundary и review statuses.
- Записать evidence в `.agent/tasks/audit-20260512-runtime-content-boundary/`.

## Out of Scope

- Stage aliases, stage harness files, `.agent/stages/**/raw/**`.
- Unrelated onboarding work already present in worktree.
- CMS/backend publishing flow implementation.
- Human approval of financial/legal/public copy.

## Canonical Inputs Read

- `AGENTS.md` из текущего запроса.
- `apps/web/AGENTS.md`.
- `.agents/skills/stage-launch-proof-loop/profiles/CONTENT_PROFILE.md`.
- `docs/architecture/source-of-truth.md`.
- `docs/architecture/documentation-workflow.md`.
- `docs/engineering/definition-of-done.md`.
- `docs/engineering/human-gates.md`.
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` targeted matches for learning baseline.
- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md` targeted N1/N2/N3/C1-C4/approve-flow sections.
- `content/getcourse-finstrategy/README.md`.
- `content/getcourse-finstrategy/CONTENT_BRIEF.md`.
- `content/getcourse-finstrategy/content-baseline.manifest.json`.
- `content/getcourse-finstrategy/12-lesson-235010153.md` for N3 provenance only.

## Frozen Decisions

- `content/` is the demo/import fixture source; CMS/PostgreSQL remains production content source of truth.
- Web code may import and adapt demo fixtures, but must not own lesson payload text as UI source.
- Demo content review statuses stay draft/human-gated and must not become `production_ready`.
- Financial wording, reward wording, privacy-sensitive copy and lesson correctness remain `DONE_WITH_HUMAN_PENDING`.
