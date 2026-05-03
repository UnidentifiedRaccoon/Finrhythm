#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

required_files=(
  "AGENTS.md"
  ".codex/config.toml"
  ".codex/agents/stage-orchestrator.toml"
  ".codex/agents/task-explorer.toml"
  ".codex/agents/stage-spec-freezer.toml"
  ".codex/agents/stage-builder.toml"
  ".codex/agents/stage-verifier.toml"
  ".codex/agents/stage-fixer.toml"
  ".codex/agents/api-worker.toml"
  ".agents/skills/stage-launch-proof-loop/SKILL.md"
  ".agents/skills/stage-launch-proof-loop/references/PROTOCOL.md"
  ".agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md"
  ".agents/skills/stage-launch-proof-loop/references/SUBAGENTS.md"
  ".agents/skills/stage-launch-proof-loop/scripts/verify_harness.py"
  "docs/architecture/source-of-truth.md"
  "docs/architecture/documentation-workflow.md"
  "docs/architecture/init-and-dev-contract.md"
  "docs/engineering/definition-of-done.md"
  "docs/engineering/human-gates.md"
  "docs/setup/codex-setup.md"
  "prompts/run-mvp.prompt.md"
  "prompts/run-v1.prompt.md"
  "prompts/run-v2.prompt.md"
)

missing=0
for rel in "${required_files[@]}"; do
  if [[ ! -f "$ROOT/$rel" ]]; then
    echo "MISSING: $rel"
    missing=1
  fi
done

if [[ $missing -ne 0 ]]; then
  echo "validate-bootstrap.sh: FAIL"
  exit 1
fi

python3 "$ROOT/.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py" --bootstrap-only

echo "validate-bootstrap.sh: PASS"
