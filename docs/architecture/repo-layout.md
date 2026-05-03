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
