#!/usr/bin/env python3
"""Verify the active repo-local FinLit stage harness."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

REQUIRED_AGENT_FILES = (
    "stage-orchestrator.toml",
    "task-explorer.toml",
    "stage-spec-freezer.toml",
    "stage-builder.toml",
    "stage-verifier.toml",
    "stage-fixer.toml",
    "api-worker.toml",
    "web-worker.toml",
    "admin-worker.toml",
    "content-worker.toml",
)

REQUIRED_SKILL_FILES = (
    "SKILL.md",
    "references/ARTIFACTS.md",
    "references/PROTOCOL.md",
    "references/SUBAGENTS.md",
    "references/COMMANDS.md",
    "references/DELEGATION.md",
)

REQUIRED_STAGE_FILES = (
    "source.md",
    "stage_spec.md",
    "backlog.md",
    "feature_list.json",
    "sprint_contract.md",
    "progress.md",
    "decisions.md",
    "risks.md",
    "status.json",
    "evidence.md",
    "evidence.json",
    "verdict.json",
    "problems.md",
    "raw",
    "task-files",
    "audits",
)

VALID_VERDICTS = {"PENDING", "FAIL", "PASS", "INSUFFICIENT_EVIDENCE"}

@dataclass
class CheckResult:
    id: str
    status: str
    detail: str


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / "AGENTS.md").exists() and (candidate / ".codex").exists():
            return candidate
    raise SystemExit("Could not locate repo root from script path.")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def missing_paths(base: Path, entries: Iterable[str]) -> list[str]:
    return [entry for entry in entries if not (base / entry).exists()]


def has(text: str, needle: str) -> bool:
    return needle in text


def check_no_legacy_terms(root: Path) -> list[str]:
    ignored_dirs = {
        ".agent",
        ".git",
        ".local",
        ".pnpm-store",
        ".next",
        ".turbo",
        "coverage",
        "dist",
        "node_modules",
        "out",
        "raw",
        "target",
    }
    legacy_patterns = [
        "gpt-" + "5.4",
        "approval_policy = " + "\"never\"",
        "Grad" + "le",
        "grad" + "le",
        "repo-" + "task-proof-loop",
        "pos" + "gres",
        "Post" + "gres",
    ]
    issues: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(root)
        if any(part in ignored_dirs for part in relative.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for pattern in legacy_patterns:
            if pattern in text:
                issues.append(f"{relative} contains legacy token `{pattern}`")
    return issues


def read_json(path: Path) -> tuple[Any | None, str | None]:
    try:
        return json.loads(path.read_text(encoding="utf-8")), None
    except FileNotFoundError:
        return None, f"Missing {path.name}."
    except json.JSONDecodeError as exc:
        return None, f"{path.name} is invalid JSON: {exc.msg}."


def check_content_baseline(root: Path) -> list[str]:
    """Verify local headline facts for the active raw content baseline."""

    issues: list[str] = []
    content_dir = root / "content" / "getcourse-finstrategy"
    links_path = root / "course-export" / "stream-546010026" / "all-lesson-links.json"
    downloads_dir = content_dir / "downloads"

    required = (
        content_dir / "README.md",
        content_dir / "CONTENT_BRIEF.md",
        links_path,
    )
    for path in required:
        if not path.exists():
            issues.append(f"missing active content baseline path: {path.relative_to(root)}")

    inactive_paths = (
        root / "content" / "getcourse-path-to-money",
        root / "course-export" / "lesson-links.json",
        root / "course-export" / "lesson-links.txt",
    )
    for path in inactive_paths:
        if path.exists():
            issues.append(f"inactive content export is still present: {path.relative_to(root)}")

    links, err = read_json(links_path)
    if err:
        issues.append(f"content links invalid: {err}")
    elif not isinstance(links, dict) or not isinstance(links.get("lessons"), list):
        issues.append("all-lesson-links.json must contain a lessons array")
    elif len(links["lessons"]) != 73:
        issues.append(f"expected 73 lesson URLs, found {len(links['lessons'])}")

    lesson_files = sorted(content_dir.glob("[0-9][0-9]-lesson-*.md"))
    if len(lesson_files) != 73:
        issues.append(f"expected 73 lesson markdown files, found {len(lesson_files)}")

    statuses: dict[str, int] = {}
    human_review_required = 0
    for path in lesson_files:
        text = read(path)
        status_match = re.search(r'^exportStatus:\s*"?([^"\n]+)"?', text, re.MULTILINE)
        status = status_match.group(1) if status_match else "missing"
        statuses[status] = statuses.get(status, 0) + 1
        if re.search(r'^humanReview:\s*"required"', text, re.MULTILINE):
            human_review_required += 1

    if statuses.get("exported", 0) != 70 or statuses.get("blocked", 0) != 3:
        issues.append(f"expected 70 exported and 3 blocked lessons, found {statuses}")
    if human_review_required != 73:
        issues.append(f"expected 73 humanReview=required lessons, found {human_review_required}")

    if not downloads_dir.exists():
        issues.append("missing content/getcourse-finstrategy/downloads")
    else:
        downloaded_assets = [
            path
            for path in downloads_dir.iterdir()
            if path.is_file() and not path.name.startswith(".") and path.name != "README.md"
        ]
        if len(downloaded_assets) != 30:
            issues.append(f"expected 30 downloaded assets, found {len(downloaded_assets)}")

    return issues


def validate_stage(stage_dir: Path, stage_id: str, root: Path) -> list[str]:
    issues: list[str] = []
    issues.extend(f"missing {p}" for p in missing_paths(stage_dir, REQUIRED_STAGE_FILES))
    if issues:
        return issues

    feature_list, err = read_json(stage_dir / "feature_list.json")
    if err:
        issues.append(err)
    elif not isinstance(feature_list, list):
        issues.append("feature_list.json must be a JSON array.")
    else:
        for i, item in enumerate(feature_list, 1):
            if not isinstance(item, dict):
                issues.append(f"feature_list[{i}] must be object")
                continue
            if not isinstance(item.get("id"), str) or not item["id"].strip():
                issues.append(f"feature_list[{i}].id missing")
            if not isinstance(item.get("passes"), bool):
                issues.append(f"feature_list[{i}].passes must be boolean")
            refs = item.get("evidence_refs", [])
            if not isinstance(refs, list):
                issues.append(f"feature_list[{i}].evidence_refs must be list")
            if item.get("passes") is True and not refs:
                issues.append(f"feature_list[{i}] passes=true but evidence_refs empty")
            for ref in refs if isinstance(refs, list) else []:
                if isinstance(ref, str) and ref and not (root / ref).exists():
                    issues.append(f"missing evidence ref: {ref}")

    verdict, err = read_json(stage_dir / "verdict.json")
    if err:
        issues.append(err)
    elif isinstance(verdict, dict) and verdict.get("status") not in VALID_VERDICTS:
        issues.append(f"invalid verdict status: {verdict.get('status')}")

    evidence, err = read_json(stage_dir / "evidence.json")
    if err:
        issues.append(err)
    elif isinstance(evidence, dict) and evidence.get("stage_id") != stage_id:
        issues.append(f"evidence.json stage_id must be {stage_id}")

    return issues


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify FinLit Codex harness.")
    parser.add_argument("--stage-id", default=None, help="Optional stage directory under .agent/stages to semantically inspect.")
    parser.add_argument("--bootstrap-only", action="store_true", help="Only verify bootstrap/runtime harness files.")
    args = parser.parse_args()

    root = find_repo_root(Path(__file__).resolve())
    checks: list[CheckResult] = []

    agents_md = root / "AGENTS.md"
    agents_text = read(agents_md) if agents_md.exists() else ""
    managed_ok = "<!-- BEGIN FINLIT STAGE HARNESS -->" in agents_text and "<!-- END FINLIT STAGE HARNESS -->" in agents_text
    checks.append(CheckResult("agents-managed-block", "PASS" if managed_ok else "FAIL", "AGENTS.md contains FinLit harness block." if managed_ok else "Missing FinLit harness block."))

    config = root / ".codex" / "config.toml"
    config_text = read(config) if config.exists() else ""
    config_ok = all(s in config_text for s in ('model = "gpt-5.5"', 'model_reasoning_effort = "xhigh"', 'approval_policy = "on-request"'))
    checks.append(CheckResult("codex-config-policy", "PASS" if config_ok else "FAIL", "Codex config pins gpt-5.5/xhigh/on-request." if config_ok else "Codex config policy is incomplete."))

    agent_dir = root / ".codex" / "agents"
    missing_agents = missing_paths(agent_dir, REQUIRED_AGENT_FILES)
    agent_texts_ok = True
    bad_agents: list[str] = []
    for rel in REQUIRED_AGENT_FILES:
        path = agent_dir / rel
        if path.exists():
            text = read(path)
            if 'model = "gpt-5.5"' not in text or 'model_reasoning_effort = "xhigh"' not in text:
                agent_texts_ok = False
                bad_agents.append(rel)
    checks.append(CheckResult("codex-agents", "PASS" if not missing_agents and agent_texts_ok else "FAIL", "Required subagents are present and pinned to gpt-5.5/xhigh." if not missing_agents and agent_texts_ok else f"Missing agents: {missing_agents}; bad model policy: {bad_agents}"))

    skill_root = root / ".agents" / "skills" / "stage-launch-proof-loop"
    missing_skill = missing_paths(skill_root, REQUIRED_SKILL_FILES)
    checks.append(CheckResult("skill-layout", "PASS" if not missing_skill else "FAIL", "Stage skill files are present." if not missing_skill else f"Missing skill files: {missing_skill}"))

    doc_workflow = root / "docs" / "architecture" / "documentation-workflow.md"
    checks.append(CheckResult("documentation-workflow", "PASS" if doc_workflow.exists() else "FAIL", "Documentation workflow is present." if doc_workflow.exists() else "Missing docs/architecture/documentation-workflow.md."))

    api_agents = root / "apps" / "api" / "AGENTS.md"
    api_text = read(api_agents) if api_agents.exists() else ""
    api_ok = all(s in api_text for s in ("Spring Boot", "Maven Wrapper", "PostgreSQL", "Flyway"))
    checks.append(CheckResult("backend-stack", "PASS" if api_ok else "FAIL", "apps/api baseline is Spring/Java/Maven/PostgreSQL." if api_ok else "apps/api baseline is incomplete."))

    legacy = check_no_legacy_terms(root)
    checks.append(CheckResult("legacy-token-scan", "PASS" if not legacy else "FAIL", "No legacy model/approval/backend tokens found." if not legacy else "; ".join(legacy[:25])))

    content_baseline = check_content_baseline(root)
    checks.append(CheckResult("content-baseline", "PASS" if not content_baseline else "FAIL", "Active FinStrategy content baseline is present and matches expected headline counts." if not content_baseline else "; ".join(content_baseline[:25])))

    if args.stage_id and not args.bootstrap_only:
        stage_dir = root / ".agent" / "stages" / args.stage_id
        stage_issues = validate_stage(stage_dir, args.stage_id, root)
        checks.append(CheckResult("stage-artifacts", "PASS" if not stage_issues else "FAIL", f"Stage {args.stage_id} artifacts are valid." if not stage_issues else "; ".join(stage_issues)))

    status = "PASS" if all(c.status == "PASS" for c in checks) else "FAIL"
    report = {
        "status": status,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "repo_root": str(root),
        "checks": [asdict(c) for c in checks],
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if status != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
