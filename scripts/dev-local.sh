#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT/infra/local/compose.yaml"

node "$ROOT/scripts/verify-bootstrap.mjs" --quiet

if ! docker info >/dev/null 2>&1; then
  echo "make dev: Docker daemon is not running. Start Docker and rerun make dev." >&2
  exit 2
fi

docker compose -f "$COMPOSE_FILE" up -d postgres

echo "make dev: local PostgreSQL requested on localhost:${FINRHYTHM_POSTGRES_PORT:-54329}"
echo "make dev: no migrations or bootstrap seed are applied by this target"
