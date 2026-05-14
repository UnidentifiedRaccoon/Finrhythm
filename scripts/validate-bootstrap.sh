#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HARNESS_PROFILE="${HARNESS_PROFILE:-lite}"

if ! python3 - "$ROOT" <<'PY'
import json
import sys
from pathlib import Path

root = Path(sys.argv[1])
manifest_path = root / ".agents/skills/stage-launch-proof-loop/harness.manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
missing = [
    rel
    for rel in manifest["bootstrap_required_files"]
    if not (root / rel).is_file()
]
for rel in missing:
    print(f"MISSING: {rel}")
raise SystemExit(1 if missing else 0)
PY
then
  echo "validate-bootstrap.sh: FAIL"
  exit 1
fi

python3 "$ROOT/.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py" --bootstrap-only --harness-profile "$HARNESS_PROFILE"

echo "validate-bootstrap.sh: PASS ($HARNESS_PROFILE)"
