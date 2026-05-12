# Evidence: P0 Init/dev contract

Статус: `PASS`

## What Changed

- `scripts/init-local.sh` now runs backend Flyway migrations through `apps/api` Maven wrapper before inserting `dev_bootstrap_runs`.
- `make init` is guarded to local compose PostgreSQL only and refuses custom/non-compose `FINRHYTHM_DATABASE_URL` or DB credentials.
- `make init` keeps idempotent bootstrap record semantics and supports `FORCE=1 make init` / `./scripts/init-local.sh --force`.
- Domain seed import remains out of scope and is stated in script output and canonical docs.
- `scripts/verify-bootstrap.mjs` now includes regression checks that init is not `V001`-only and records bootstrap after Flyway.
- `docs/architecture/init-and-dev-contract.md` documents full Flyway migration, local-only guard and seed/import limitation.

## Verification

| Command / check | Result | Evidence |
| --- | --- | --- |
| `bash -n scripts/init-local.sh scripts/dev-local.sh` | PASS | shell syntax ok |
| `node scripts/verify-bootstrap.mjs` | PASS | includes `init-runs-flyway-migrations`, `init-not-v001-only`, `init-record-after-flyway` |
| `FINRHYTHM_DATABASE_URL='jdbc:postgresql://db.example.internal:5432/finrhythm' ./scripts/init-local.sh` | PASS expected refusal | exited `5` before Docker/DB mutation |
| `make init` on local compose PostgreSQL | PASS | started local Postgres, ran Flyway, inserted `local_init` record |
| second `make init` | PASS | `INSERT 0 0`; existing `local_init` record reused |
| `select version, description, success from flyway_schema_history ...` | PASS | versions `001` through `007` successful |
| `select ... from dev_bootstrap_runs ...` | PASS | exactly one `local_init` / `2026-05-12.1` row |
| `git diff --check -- scripts/init-local.sh scripts/dev-local.sh Makefile scripts/verify-bootstrap.mjs docs/architecture/init-and-dev-contract.md .agent/tasks/audit-20260512-init-dev-contract` | PASS | no whitespace errors |
| `if rg -n "[ \t]+$" .agent/tasks/audit-20260512-init-dev-contract; then exit 1; fi` | PASS | untracked task evidence has no trailing whitespace |

## Database Evidence Summary

`flyway_schema_history` after `make init`:

- `001 dev bootstrap runs`
- `002 tenant cohort invite model`
- `003 invite issuance activation binding`
- `004 employee registration`
- `005 pilot launch access pool model`
- `006 entity comments`
- `007 legal document acceptance log`

Public base tables after migration:

- `access_pools`
- `dev_bootstrap_runs`
- `employee_registrations`
- `flyway_schema_history`
- `invite_codes`
- `legal_document_acceptance_log`
- `pilot_launches`
- `tenants`

## Limitations

- No domain seed/importer was implemented or run. This is intentional and documented.
- Full `make verify`, `make test-unit` and `make build` were not run for this audit slice; the requested focused checks and actual `make init` proof were run instead.
- Docker local compose resources were created/used, but no DB reset, volume deletion or destructive cleanup was performed.
- The local `finrhythm-postgres` compose service was left running as expected after `make init`.
- Unrelated concurrent worktree changes were left untouched.
