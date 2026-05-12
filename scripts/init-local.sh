#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT/infra/local/compose.yaml"
API_DIR="$ROOT/apps/api"
FLYWAY_MAVEN_PLUGIN_VERSION="10.10.0"

postgres_port="${FINRHYTHM_POSTGRES_PORT:-54329}"
default_database_url="jdbc:postgresql://localhost:${postgres_port}/finrhythm"
database_url="${FINRHYTHM_DATABASE_URL:-$default_database_url}"
database_username="${FINRHYTHM_DATABASE_USERNAME:-finlit}"
database_password="${FINRHYTHM_DATABASE_PASSWORD:-finlit_local}"
force="${FORCE:-0}"

if [[ "${1:-}" == "--force" ]]; then
  force=1
elif [[ "$#" -gt 0 ]]; then
  echo "make init: usage is make init, FORCE=1 make init or ./scripts/init-local.sh --force." >&2
  exit 64
fi

if [[ "$database_url" != "$default_database_url" && "$database_url" != "jdbc:postgresql://127.0.0.1:${postgres_port}/finrhythm" ]]; then
  echo "make init: refusing non-compose FINRHYTHM_DATABASE_URL '$database_url'." >&2
  echo "make init: local init only targets localhost:${postgres_port}/finrhythm from infra/local/compose.yaml." >&2
  exit 5
fi

if [[ "$database_username" != "finlit" || "$database_password" != "finlit_local" ]]; then
  echo "make init: refusing custom database credentials for local compose bootstrap." >&2
  exit 5
fi

node "$ROOT/scripts/verify-bootstrap.mjs" --quiet

if [[ -z "${JAVA_HOME:-}" ]]; then
  for java_home_candidate in /opt/homebrew/opt/openjdk@21 /usr/local/opt/openjdk@21; do
    if [[ -d "$java_home_candidate" ]]; then
      export JAVA_HOME="$java_home_candidate"
      export PATH="$JAVA_HOME/bin:$PATH"
      break
    fi
  done
fi

if ! command -v java >/dev/null 2>&1; then
  echo "make init: Java 21 is required for backend Flyway migrations. Run make install or set JAVA_HOME." >&2
  exit 4
fi

run_flyway_migrations() {
  echo "make init: applying backend Flyway migrations from apps/api/src/main/resources/db/migration."
  (
    cd "$API_DIR"
    ./mvnw -q "org.flywaydb:flyway-maven-plugin:${FLYWAY_MAVEN_PLUGIN_VERSION}:migrate" \
      "-Dflyway.url=$database_url" \
      "-Dflyway.user=$database_username" \
      "-Dflyway.password=$database_password" \
      "-Dflyway.locations=filesystem:$API_DIR/src/main/resources/db/migration" \
      "-Dflyway.baselineOnMigrate=true" \
      "-Dflyway.baselineVersion=1" \
      "-Dflyway.baselineDescription=local init baseline for legacy V001-only databases" \
      "-Dflyway.connectRetries=10" \
      "-Dflyway.cleanDisabled=true"
  )
}

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

run_flyway_migrations

bootstrap_key="$(node -e "const v=require(process.argv[1]); process.stdout.write(v.bootstrapKey)" "$ROOT/scripts/init/version.json")"
bootstrap_version="$(node -e "const v=require(process.argv[1]); process.stdout.write(v.version)" "$ROOT/scripts/init/version.json")"
bootstrap_checksum="$(node -e "const v=require(process.argv[1]); process.stdout.write(v.checksum)" "$ROOT/scripts/init/version.json")"

if [[ "$force" == "1" ]]; then
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

echo "make init: domain seed import is out of scope until a seed importer exists; no demo domain rows were inserted."
echo "make init: PASS"
