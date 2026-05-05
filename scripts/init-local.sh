#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT/infra/local/compose.yaml"
MIGRATION_FILE="$ROOT/apps/api/src/main/resources/db/migration/V001__dev_bootstrap_runs.sql"

node "$ROOT/scripts/verify-bootstrap.mjs" --quiet

if ! docker info >/dev/null 2>&1; then
  echo "make init: Docker daemon is not running. Start Docker and rerun make init." >&2
  exit 2
fi

docker compose -f "$COMPOSE_FILE" up -d postgres

ready=0
for _ in $(seq 1 60); do
  if docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U finlit -d finrhythm >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [[ "$ready" -ne 1 ]]; then
  echo "make init: PostgreSQL did not become ready within 60 seconds." >&2
  exit 3
fi

docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U finlit -d finrhythm -v ON_ERROR_STOP=1 < "$MIGRATION_FILE"

bootstrap_key="$(node -e "const v=require('./scripts/init/version.json'); process.stdout.write(v.bootstrapKey)")"
bootstrap_version="$(node -e "const v=require('./scripts/init/version.json'); process.stdout.write(v.version)")"
bootstrap_checksum="$(node -e "const v=require('./scripts/init/version.json'); process.stdout.write(v.checksum)")"

if [[ "${FORCE:-0}" == "1" ]]; then
  docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U finlit -d finrhythm -v ON_ERROR_STOP=1 \
    -v bootstrap_key="$bootstrap_key" \
    -v bootstrap_version="$bootstrap_version" \
    -c "delete from dev_bootstrap_runs where bootstrap_key = :'bootstrap_key' and version = :'bootstrap_version';"
fi

docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U finlit -d finrhythm -v ON_ERROR_STOP=1 \
  -v bootstrap_key="$bootstrap_key" \
  -v bootstrap_version="$bootstrap_version" \
  -v bootstrap_checksum="$bootstrap_checksum" <<'SQL'
insert into dev_bootstrap_runs (bootstrap_key, version, checksum)
select :'bootstrap_key', :'bootstrap_version', :'bootstrap_checksum'
where not exists (
    select 1
    from dev_bootstrap_runs
    where bootstrap_key = :'bootstrap_key'
      and version = :'bootstrap_version'
);

select bootstrap_key, version, checksum, applied_at
from dev_bootstrap_runs
where bootstrap_key = :'bootstrap_key'
  and version = :'bootstrap_version'
order by applied_at desc;
SQL

echo "make init: PASS"
