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

HARNESS_MANIFEST = ".agents/skills/stage-launch-proof-loop/harness.manifest.json"

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


def check_no_legacy_terms(root: Path, manifest: dict[str, Any]) -> list[str]:
    legacy_scan = manifest.get("legacy_scan", {})
    if not isinstance(legacy_scan, dict):
        return ["harness.manifest.json legacy_scan must be an object"]
    ignored_dirs = set(legacy_scan.get("ignored_dirs", []))
    ignored_files = set(legacy_scan.get("ignored_files", []))
    legacy_patterns = legacy_scan.get("patterns", [])
    if (
        not all(isinstance(item, str) for item in ignored_dirs)
        or not all(isinstance(item, str) for item in ignored_files)
        or not all(isinstance(item, str) for item in legacy_patterns)
    ):
        return ["harness.manifest.json legacy_scan ignored_dirs, ignored_files and patterns must be string arrays"]
    issues: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(root)
        if any(part in ignored_dirs for part in relative.parts):
            continue
        if str(relative) in ignored_files:
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


def load_manifest(root: Path) -> dict[str, Any]:
    manifest, err = read_json(root / HARNESS_MANIFEST)
    if err:
        raise SystemExit(f"Harness manifest invalid: {err}")
    if not isinstance(manifest, dict):
        raise SystemExit("Harness manifest must be a JSON object.")
    return manifest


def manifest_list(manifest: dict[str, Any], key: str) -> list[str]:
    value = manifest.get(key)
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise SystemExit(f"Harness manifest key `{key}` must be a string array.")
    return value


def normalize_sprint_id(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    cleaned = value.strip().strip("`").strip()
    return cleaned or None


def extract_sprint_contract_id(text: str) -> str | None:
    match = re.search(r"^#\s+Sprint contract:\s*`?([^`\n]+?)`?\s*$", text, re.MULTILINE)
    return normalize_sprint_id(match.group(1)) if match else None


def extract_problem_heading_id(text: str) -> str | None:
    match = re.search(
        r"^#\s+(?:Fresh verifier problems|Verifier problems|Problems):\s*`?([^`\n]+?)`?\s*$",
        text,
        re.MULTILINE,
    )
    return normalize_sprint_id(match.group(1)) if match else None


def resolve_repo_ref(root: Path, ref: Any) -> Path | None:
    if not isinstance(ref, str) or not ref.strip():
        return None
    path = Path(ref)
    if path.is_absolute():
        return path
    return root / path


def add_id_source(sources: dict[str, str | None], label: str, value: Any) -> None:
    sources[label] = normalize_sprint_id(value)


def extract_contract_status(text: str) -> str | None:
    match = re.search(r"^Status:\s*`?([^`\n]+?)`?\s*$", text, re.MULTILINE)
    return match.group(1).strip() if match else None


def check_stage_artifact_consistency(stage_dir: Path, root: Path, manifest: dict[str, Any]) -> list[str]:
    """Verify latest stage artifact aliases all describe the same sprint contract."""

    issues: list[str] = []
    sources: dict[str, str | None] = {}

    pass_states = set(manifest_list(manifest, "pass_states"))

    sprint_text = read(stage_dir / "sprint_contract.md")
    sources["sprint_contract.md"] = extract_sprint_contract_id(sprint_text)
    contract_status = extract_contract_status(sprint_text)

    status, status_err = read_json(stage_dir / "status.json")
    if status_err:
        issues.append(status_err)
    elif isinstance(status, dict):
        add_id_source(sources, "status.json.latest_verified_sprint_contract_id", status.get("latest_verified_sprint_contract_id"))
        state = status.get("state")
        active_id = normalize_sprint_id(status.get("active_sprint_contract_id"))
        active_ids = status.get("active_ids")
        if state in pass_states:
            if active_id:
                issues.append("passed stage must keep active_sprint_contract_id null")
            if isinstance(active_ids, list) and active_ids:
                issues.append("passed stage must keep active_ids empty")
            if contract_status and contract_status != "PASS":
                issues.append(f"sprint_contract.md status must be PASS for passed stage, found {contract_status}")
        elif active_id and (not isinstance(active_ids, list) or not active_ids or active_id in active_ids):
            add_id_source(sources, "status.json.active_sprint_contract_id", active_id)
    else:
        issues.append("status.json must be a JSON object.")

    evidence, evidence_err = read_json(stage_dir / "evidence.json")
    if evidence_err:
        issues.append(evidence_err)
    elif isinstance(evidence, dict):
        add_id_source(sources, "evidence.json.sprint_contract_id", evidence.get("sprint_contract_id"))
        verdict_refs = evidence.get("verdict")
        if isinstance(verdict_refs, dict):
            raw_ref = verdict_refs.get("raw")
            raw_path = resolve_repo_ref(root, raw_ref)
            if raw_ref and raw_path is None:
                issues.append("evidence.json verdict.raw must be a path string.")
            elif raw_path is not None:
                raw_verdict, raw_err = read_json(raw_path)
                if raw_err:
                    issues.append(f"evidence.json verdict.raw invalid: {raw_err}")
                elif isinstance(raw_verdict, dict):
                    add_id_source(sources, f"evidence.json verdict.raw {raw_path.relative_to(root)}", raw_verdict.get("sprint_contract_id"))
                else:
                    issues.append(f"evidence.json verdict.raw {raw_path.relative_to(root)} must be a JSON object.")

            problems_ref = verdict_refs.get("problems")
            problems_path = resolve_repo_ref(root, problems_ref)
            if problems_ref and problems_path is None:
                issues.append("evidence.json verdict.problems must be a path string.")
            elif problems_path is not None:
                try:
                    problem_id = extract_problem_heading_id(read(problems_path))
                except FileNotFoundError:
                    issues.append(f"evidence.json verdict.problems invalid: Missing {problems_path.name}.")
                else:
                    sources[f"evidence.json verdict.problems {problems_path.relative_to(root)}"] = problem_id
    else:
        issues.append("evidence.json must be a JSON object.")

    verdict, verdict_err = read_json(stage_dir / "verdict.json")
    if verdict_err:
        issues.append(verdict_err)
    elif isinstance(verdict, dict):
        add_id_source(sources, "verdict.json.sprint_contract_id", verdict.get("sprint_contract_id"))
    else:
        issues.append("verdict.json must be a JSON object.")

    sources["problems.md heading"] = extract_problem_heading_id(read(stage_dir / "problems.md"))

    missing = [label for label, sprint_id in sources.items() if sprint_id is None]
    if missing:
        issues.append(f"missing sprint contract id in latest artifacts: {', '.join(missing)}")

    concrete = {label: sprint_id for label, sprint_id in sources.items() if sprint_id is not None}
    if len(set(concrete.values())) > 1:
        detail = "; ".join(f"{label}={sprint_id}" for label, sprint_id in concrete.items())
        issues.append(f"sprint artifact id mismatch: {detail}")

    return issues


def check_content_baseline(root: Path, manifest: dict[str, Any]) -> list[str]:
    """Verify local headline facts for the active raw content baseline."""

    issues: list[str] = []
    content_manifest_ref = manifest.get("content_baseline_manifest")
    if not isinstance(content_manifest_ref, str):
        return ["harness.manifest.json content_baseline_manifest must be a path string"]
    content_manifest, err = read_json(root / content_manifest_ref)
    if err:
        return [f"content baseline manifest invalid: {err}"]
    if not isinstance(content_manifest, dict):
        return ["content baseline manifest must be a JSON object"]

    for rel in content_manifest.get("required_paths", []):
        if not isinstance(rel, str):
            issues.append("content baseline required_paths must contain strings")
            continue
        path = root / rel
        if not path.exists():
            issues.append(f"missing active content baseline path: {path.relative_to(root)}")

    for rel in content_manifest.get("inactive_paths", []):
        if not isinstance(rel, str):
            issues.append("content baseline inactive_paths must contain strings")
            continue
        path = root / rel
        if path.exists():
            issues.append(f"inactive content export is still present: {path.relative_to(root)}")

    links_path = root / str(content_manifest.get("links_path", ""))
    links, err = read_json(links_path)
    expected = content_manifest.get("expected", {})
    if not isinstance(expected, dict):
        return ["content baseline expected must be an object"]
    if err:
        issues.append(f"content links invalid: {err}")
    elif not isinstance(links, dict) or not isinstance(links.get("lessons"), list):
        issues.append("all-lesson-links.json must contain a lessons array")
    elif len(links["lessons"]) != expected.get("lesson_urls"):
        issues.append(f"expected {expected.get('lesson_urls')} lesson URLs, found {len(links['lessons'])}")

    lesson_glob = content_manifest.get("lesson_file_glob")
    if not isinstance(lesson_glob, str):
        return ["content baseline lesson_file_glob must be a string"]
    lesson_files = sorted(root.glob(lesson_glob))
    if len(lesson_files) != expected.get("markdown_lessons"):
        issues.append(f"expected {expected.get('markdown_lessons')} lesson markdown files, found {len(lesson_files)}")

    statuses: dict[str, int] = {}
    human_review_required = 0
    for path in lesson_files:
        text = read(path)
        status_match = re.search(r'^exportStatus:\s*"?([^"\n]+)"?', text, re.MULTILINE)
        status = status_match.group(1) if status_match else "missing"
        statuses[status] = statuses.get(status, 0) + 1
        if re.search(r'^humanReview:\s*"required"', text, re.MULTILINE):
            human_review_required += 1

    expected_statuses = expected.get("export_status_counts", {})
    if not isinstance(expected_statuses, dict):
        return ["content baseline expected.export_status_counts must be an object"]
    for status, count in expected_statuses.items():
        if statuses.get(status, 0) != count:
            issues.append(f"expected {count} {status} lessons, found {statuses.get(status, 0)}")
    if human_review_required != expected.get("human_review_required_lessons"):
        issues.append(f"expected {expected.get('human_review_required_lessons')} humanReview=required lessons, found {human_review_required}")

    downloads_dir = root / str(content_manifest.get("downloads_dir", ""))
    if not downloads_dir.exists():
        issues.append(f"missing {downloads_dir.relative_to(root)}")
    else:
        excluded = set(content_manifest.get("download_exclude_names", []))
        downloaded_assets = [
            path
            for path in downloads_dir.iterdir()
            if path.is_file() and not path.name.startswith(".") and path.name not in excluded
        ]
        if len(downloaded_assets) != expected.get("downloaded_assets"):
            issues.append(f"expected {expected.get('downloaded_assets')} downloaded assets, found {len(downloaded_assets)}")

    return issues


def validate_stage(stage_dir: Path, stage_id: str, root: Path, manifest: dict[str, Any]) -> list[str]:
    issues: list[str] = []
    issues.extend(f"missing {p}" for p in missing_paths(stage_dir, manifest_list(manifest, "required_stage_files")))
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
    elif isinstance(verdict, dict) and verdict.get("status") not in set(manifest_list(manifest, "valid_verdict_statuses")):
        issues.append(f"invalid verdict status: {verdict.get('status')}")

    evidence, err = read_json(stage_dir / "evidence.json")
    if err:
        issues.append(err)
    elif isinstance(evidence, dict) and evidence.get("stage_id") != stage_id:
        issues.append(f"evidence.json stage_id must be {stage_id}")

    issues.extend(check_stage_artifact_consistency(stage_dir, root, manifest))

    return issues


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify FinLit Codex harness.")
    parser.add_argument("--stage-id", default=None, help="Optional stage directory under .agent/stages to semantically inspect.")
    parser.add_argument("--bootstrap-only", action="store_true", help="Only verify bootstrap/runtime harness files.")
    args = parser.parse_args()

    root = find_repo_root(Path(__file__).resolve())
    manifest = load_manifest(root)
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
    missing_agents = missing_paths(agent_dir, manifest_list(manifest, "required_agent_files"))
    agent_texts_ok = True
    bad_agents: list[str] = []
    for rel in manifest_list(manifest, "required_agent_files"):
        path = agent_dir / rel
        if path.exists():
            text = read(path)
            if 'model = "gpt-5.5"' not in text or 'model_reasoning_effort = "xhigh"' not in text:
                agent_texts_ok = False
                bad_agents.append(rel)
    checks.append(CheckResult("codex-agents", "PASS" if not missing_agents and agent_texts_ok else "FAIL", "Required subagents are present and pinned to gpt-5.5/xhigh." if not missing_agents and agent_texts_ok else f"Missing agents: {missing_agents}; bad model policy: {bad_agents}"))

    skill_root = root / ".agents" / "skills" / "stage-launch-proof-loop"
    missing_skill = missing_paths(skill_root, manifest_list(manifest, "required_skill_files"))
    checks.append(CheckResult("skill-layout", "PASS" if not missing_skill else "FAIL", "Stage skill files are present." if not missing_skill else f"Missing skill files: {missing_skill}"))

    doc_workflow = root / "docs" / "architecture" / "documentation-workflow.md"
    checks.append(CheckResult("documentation-workflow", "PASS" if doc_workflow.exists() else "FAIL", "Documentation workflow is present." if doc_workflow.exists() else "Missing docs/architecture/documentation-workflow.md."))

    api_agents = root / "apps" / "api" / "AGENTS.md"
    api_text = read(api_agents) if api_agents.exists() else ""
    api_ok = all(s in api_text for s in ("Spring Boot", "Maven Wrapper", "PostgreSQL", "Flyway"))
    checks.append(CheckResult("backend-stack", "PASS" if api_ok else "FAIL", "apps/api baseline is Spring/Java/Maven/PostgreSQL." if api_ok else "apps/api baseline is incomplete."))

    legacy = check_no_legacy_terms(root, manifest)
    checks.append(CheckResult("legacy-token-scan", "PASS" if not legacy else "FAIL", "No legacy model/approval/backend tokens found." if not legacy else "; ".join(legacy[:25])))

    content_baseline = check_content_baseline(root, manifest)
    checks.append(CheckResult("content-baseline", "PASS" if not content_baseline else "FAIL", "Active FinStrategy content baseline is present and matches expected headline counts." if not content_baseline else "; ".join(content_baseline[:25])))

    if args.stage_id and not args.bootstrap_only:
        stage_dir = root / ".agent" / "stages" / args.stage_id
        stage_issues = validate_stage(stage_dir, args.stage_id, root, manifest)
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
