# Self-Verification: P0 Init/dev contract

## Verdict

PASS

## Checks

- `make init` no longer applies only `V001__dev_bootstrap_runs.sql`.
- Flyway is invoked through `apps/api` Maven wrapper before `dev_bootstrap_runs` is written.
- Existing legacy local DBs with only manual `V001` can be migrated through `baselineOnMigrate=true` / `baselineVersion=1`.
- Init refuses non-compose DB targets before starting Docker or touching a database.
- Repeated init is idempotent for `local_init` / `2026-05-12.1`.
- Domain seed import is not faked; the script and docs state it remains out of scope.

## Commands

- `bash -n scripts/init-local.sh scripts/dev-local.sh`
- `node scripts/verify-bootstrap.mjs`
- `FINRHYTHM_DATABASE_URL='jdbc:postgresql://db.example.internal:5432/finrhythm' ./scripts/init-local.sh`
- `make init`
- `make init`
- `docker compose -f infra/local/compose.yaml exec -T postgres psql -U finlit -d finrhythm -v ON_ERROR_STOP=1 -c "select version, description, success from flyway_schema_history where type in ('SQL','BASELINE') order by installed_rank;"`
- `docker compose -f infra/local/compose.yaml exec -T postgres psql -U finlit -d finrhythm -v ON_ERROR_STOP=1 -c "select bootstrap_key, version, checksum, count(*) over () as matching_rows from dev_bootstrap_runs where bootstrap_key = 'local_init' and version = '2026-05-12.1';"`
- `git diff --check -- scripts/init-local.sh scripts/dev-local.sh Makefile scripts/verify-bootstrap.mjs docs/architecture/init-and-dev-contract.md .agent/tasks/audit-20260512-init-dev-contract`
- `if rg -n "[ \t]+$" .agent/tasks/audit-20260512-init-dev-contract; then exit 1; fi`

## Residual Risk

- The current repository still has no domain seed importer, so local init is app-schema-ready but not populated with demo tenant/content rows.
- Full repository verification was intentionally not run for this isolated audit issue.
