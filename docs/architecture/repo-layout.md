# Repo layout

Recommended monorepo structure:

```text
.
├─ AGENTS.md
├─ README.md
├─ Makefile
├─ .codex/
│  ├─ config.toml
│  └─ agents/
├─ .agents/
│  └─ skills/
├─ .agent/
│  ├─ stages/
│  └─ tasks/
├─ apps/
│  ├─ web/
│  ├─ admin/
│  └─ api/
│     ├─ pom.xml
│     ├─ mvnw
│     └─ src/
├─ packages/
│  ├─ ui/
│  ├─ config/
│  └─ api-client/
├─ content/
│  ├─ fixtures/
│  ├─ exports/
│  └─ imports/
├─ infra/
│  ├─ local/
│  └─ yc/
├─ tests/
│  └─ e2e/
└─ docs/
   ├─ stages/
   ├─ architecture/
   ├─ engineering/
   ├─ legal/
   └─ product/
```

## Responsibility split

### `apps/web`

User-facing scenarios: onboarding, diagnostic, learning path, lessons/quizzes, challenge/marathon, store, profile/support.

### `apps/admin`

Operator scenarios: content, challenge/marathon, rewards/store, moderation/support, publish/unpublish, import/export, audit views.

### `apps/api`

Backend: auth/session, diagnostics scoring, learning progress, points ledger, store/redemption, support tickets, content/CMS APIs, jobs/integrations. Baseline stack is Spring Boot + Java + Maven + PostgreSQL.

### `packages/api-client`

Generated TypeScript client and shared types from OpenAPI. No manual competing contract types.

### `.agent/stages/<stage_id>/`

Durable stage memory, task files, evidence, verifier verdicts and audits.

## Principle

If one directory starts holding several bounded contexts, decompose. If real layout differs, update this doc and `AGENTS.md` in the same slice.

## MVP-01 bootstrap state

The current repository has the target top-level directories and root wrappers. Empty workspace directories are kept with `.gitkeep` until their first code slice:

- `packages/ui`;
- `packages/config`;
- `packages/api-client`;
- `content/imports`;
- `content/exports`;
- `infra/yc`.

Local PostgreSQL bootstrap is defined in `infra/local/compose.yaml` and `apps/api/src/main/resources/db/migration/V001__dev_bootstrap_runs.sql`.

## MVP-02 API baseline

`apps/api` now contains a minimal Spring Boot + Maven Wrapper backend baseline. The first append-only domain migration after `V001` introduces tenant, cohort/wave and invite-code tables for the corporate pilot access model. There is no public API/controller surface in this slice; frontend/admin contract generation remains unchanged until an explicit API slice.
