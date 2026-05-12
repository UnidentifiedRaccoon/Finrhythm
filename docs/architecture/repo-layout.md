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

Current MVP-04 web baseline: a minimal Next.js + React mobile-first learning shell renders a direct demo learning entry, the `Новичок` N1-N7 track and one safe lesson preview from synthetic fixtures. It intentionally bypasses deferred onboarding/consent/diagnostics for development and must not be treated as a production employee flow until those slices are separately approved.

### `apps/admin`

Operator scenarios: content, challenge/marathon, rewards/store, moderation/support, publish/unpublish, import/export, audit views.

Current MVP-02 admin baseline: a minimal Next.js app renders a read-only access-pool/code status view from the verified backend DTO. It uses synthetic fixture mode by default; optional live mode is controlled only by deploy/server environment and sends the configured admin bearer token to the backend. Admin code-status and the MVP-03 legal acceptance DTO/path helpers are covered by the checked-in `packages/api-client` OpenAPI snapshot, generator and drift checks.

### `apps/api`

Backend: auth/session, diagnostics scoring, learning progress, points ledger, store/redemption, support tickets, content/CMS APIs, jobs/integrations. Baseline stack is Spring Boot + Java + Maven + PostgreSQL.

### `packages/api-client`

Generated TypeScript client and shared types from OpenAPI. The current narrow surface covers employee registration DTOs, admin code-status DTO/client helper and legal document acceptance DTO/client helper. No manual competing contract types.

### `.agent/stages/<stage_id>/`

Durable stage memory, task files, evidence, verifier verdicts and audits.

## Principle

If one directory starts holding several bounded contexts, decompose. If real layout differs, update this doc and `AGENTS.md` in the same slice.

## MVP-01 bootstrap state

The current repository has the target top-level directories and root wrappers. Empty workspace directories are kept with `.gitkeep` until their first code slice:

- `packages/ui`;
- `packages/config`;
- `content/imports`;
- `content/exports`;
- `infra/yc`.

Local PostgreSQL bootstrap is defined in `infra/local/compose.yaml` and `apps/api/src/main/resources/db/migration/V001__dev_bootstrap_runs.sql`.

## MVP-02 API baseline

`apps/api` now contains a minimal Spring Boot + Maven Wrapper backend baseline. The active Flyway-managed access model uses tenant, pilot launch, access pool and invite-code tables for the corporate pilot access model. Historical migrations may still show superseded terminology, but runtime code and the final migrated schema use `pilotLaunch`/`accessPool`.

## MVP-02 admin UI baseline

`apps/admin` now contains a minimal Next.js + React scaffold for the read-only access-pool/code status view. Root `make verify`, `make test-unit` and `make build` include the available admin checks. The admin UI must keep using privacy-safe DTO fields only and must not expose raw invite codes or employee contact data.

## MVP-04 web learning shell baseline

`apps/web` now contains a minimal Next.js + React scaffold for the mobile learning entry. Root `make verify`, `make test-unit` and `make build` include the available web checks before admin/backend checks. The web shell uses synthetic fixtures only and must keep customer brand, real employee/customer data, diagnostics completion, consent completion, progress persistence and points out of scope until separate frozen slices introduce them.
