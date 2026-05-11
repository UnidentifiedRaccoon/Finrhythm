# Documentation Workflow

Статус: accepted  
Обновлено: 2026-05-03

## Назначение

Этот документ задаёт обязательный `doc-sync` для agent-first разработки FinLit. Цель — не допускать расхождения между кодом, stage artifacts, архитектурными решениями, API contract and canonical docs.

## Когда doc-sync обязателен

Агент обязан обновить документацию в том же logical slice, если он:

- изменил user behavior, business rule, product contract or operating flow;
- уточнил неоднозначность и фактически принял новое решение по architecture, integration, status model, workflow or data;
- изменил API contract, setup/runtime expectations or developer workflow;
- добавил важный module, boundary, integration path or proof policy;
- обнаружил contradiction между текущей документацией и реализованным решением.

Молчаливый documentation drift считается workflow defect.

## Куда писать canonical changes

Обновляй самый узкий source of truth:

- product intent and customer-context assumptions: `docs/product/**` markdown files;
- product/stage scope: `docs/stages/*.md` only when changing stage baseline intentionally;
- repo-wide architecture and stack: `docs/architecture/source-of-truth.md`;
- organization/access/subscription model: `docs/architecture/access-and-subscriptions.md` and `docs/architecture/organization-access-subscription-model.md`;
- doc-sync and harness policy: `AGENTS.md`, this document, `.agents/skills/stage-launch-proof-loop/*`;
- API contract: Spring/OpenAPI source in `apps/api` and generated client notes;
- setup/runtime: `README.md`, `docs/setup/codex-setup.md`, `docs/architecture/init-and-dev-contract.md`;
- backend local rules: `apps/api/AGENTS.md`;
- human gates and DoD: `docs/engineering/*.md`.

Stage artifacts in `.agent/stages/<stage_id>/` are required for handoff and proof, but they do not replace canonical docs.

## Product foundation sync

Если stage связан с product foundation, stage/spec-freeze агент обязан прочитать соответствующий `docs/product/**` markdown before freezing scope. Для текущего MVP это `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`.

Rules:
- stage docs must stay consistent with canonical product foundation;
- markdown-нормализация is canonical for agent execution;
- binary files under `references/` preserve source materials, but do not become source of truth until their decisions are reflected in markdown;
- if `.docx`, `.pptx`, PDF or other binary source contradicts markdown/stage docs, record the discrepancy and update the narrowest canonical markdown doc before implementation.

## Что должно попадать в evidence

Every non-trivial slice must record:

- canonical docs updated;
- decisions made or clarified;
- Mermaid diagram refs added/refreshed;
- explicit note when docs did not need changes;
- any deferred doc debt with exact reason.

## Диаграммы

Use Mermaid when text alone would not explain the system safely. Diagrams are especially expected for:

- state machines and lifecycle flows;
- stage/orchestrator handoff paths;
- auth/session, points ledger, redemption, support and CMS publishing flows;
- retry/conflict/idempotency paths;
- multi-module data flow.

Rules:
- keep diagrams small and targeted;
- update existing diagrams instead of creating contradictory ones;
- explain what the diagram fixes and what it does not cover.

## Doc-sync loop

```mermaid
flowchart LR
    A["Spec freeze: определить doc targets"] --> B["Build/Fix: менять код и canonical docs согласованно"]
    B --> C["Evidence: перечислить doc updates и diagram refs"]
    C --> D["Fresh verify: проверить code, docs и evidence"]
    D -->|proof gap| E["Minimal fix: обновить code and/or docs"]
    E --> C
    D -->|PASS| F["Close slice / stage handoff"]
```

Material docs drift is a verifier proof gap.
