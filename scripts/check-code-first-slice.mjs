#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, ".agents/skills/stage-launch-proof-loop/harness.manifest.json");

const args = parseArgs(process.argv.slice(2));
const taskKind = args["task-kind"] ?? "product";
const tier = (args.tier ?? "C").toUpperCase();
const warnOnly = Boolean(args["warn-only"]);
const base = args.base ?? "HEAD";

if (!["product", "harness", "docs", "publish"].includes(taskKind)) {
  fail(`Unsupported --task-kind ${taskKind}. Use product, harness, docs or publish.`);
}

const manifest = readJson(manifestPath);
const tierConfig = manifest.workflow_tiers?.[tier];
if (!tierConfig) {
  fail(`Tier ${tier} is not defined in ${relative(manifestPath)}.`);
}

const numstat = git(["diff", "--numstat", base, "--"], { allowNoDiff: true });
const nameStatus = git(["diff", "--name-status", base, "--"], { allowNoDiff: true });
const untracked = git(["ls-files", "--others", "--exclude-standard"], { allowNoDiff: true });
const files = [...parseNumstat(numstat), ...parseUntracked(untracked)];
const renamedOnly = new Set(parseNameStatusRenames(nameStatus));

const totals = summarize(files, renamedOnly);
const issues = [];
const warnings = [];

if (files.length === 0) {
  printReport("PASS", totals, issues, warnings, "No diff detected.");
  process.exit(0);
}

if (taskKind === "product") {
  if (totals.productFiles === 0) {
    issues.push("Product task changed no apps/**, packages/** or tests/** files.");
  }

  if (totals.agentAdditions > 0 && totals.productAdditions === 0) {
    issues.push("Product task added agent proof lines before any product/test additions.");
  }
}

if (tier !== "A") {
  if (Number.isFinite(tierConfig.agent_additions_max) && totals.agentAdditions > tierConfig.agent_additions_max) {
    issues.push(`Tier ${tier} agent additions ${totals.agentAdditions} exceed budget ${tierConfig.agent_additions_max}.`);
  }
  if (Number.isFinite(tierConfig.docs_additions_max) && totals.docsAdditions > tierConfig.docs_additions_max) {
    issues.push(`Tier ${tier} docs additions ${totals.docsAdditions} exceed budget ${tierConfig.docs_additions_max}.`);
  }
  if (tierConfig.generated_allowed_only_when_api_changed && totals.generatedAdditions > 0 && totals.apiAdditions === 0) {
    issues.push(`Tier ${tier} generated additions require an API/source contract change.`);
  }
}

if (totals.rawProofFiles > 0) {
  issues.push("Raw proof artifacts under .agent/**/raw/** must stay untracked unless explicitly requested.");
}

if (totals.agentAdditions > totals.productAdditions && ["product", "harness"].includes(taskKind) && tier !== "A") {
  warnings.push(`Agent proof additions (${totals.agentAdditions}) exceed product/test additions (${totals.productAdditions}).`);
}

const status = issues.length === 0 || warnOnly ? "PASS" : "FAIL";
printReport(status, totals, issues, warnings, warnOnly && issues.length > 0 ? "warn-only mode" : null);
if (issues.length > 0 && !warnOnly) {
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const raw = argv[index];
    if (!raw.startsWith("--")) {
      fail(`Unexpected argument ${raw}.`);
    }
    const key = raw.slice(2);
    if (key === "warn-only") {
      parsed[key] = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`Missing value for --${key}.`);
    }
    parsed[key] = value;
    index += 1;
  }
  return parsed;
}

function readJson(path) {
  if (!existsSync(path)) {
    fail(`Missing ${relative(path)}.`);
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`Invalid JSON in ${relative(path)}: ${error.message}`);
  }
}

function git(argv, { allowNoDiff = false } = {}) {
  const result = spawnSync("git", argv, {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0 && !(allowNoDiff && result.status === 1 && result.stdout === "")) {
    const detail = result.stderr.trim() || result.stdout.trim();
    fail(`git ${argv.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }
  return result.stdout;
}

function parseNumstat(output) {
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [addedRaw, deletedRaw, ...pathParts] = line.split("\t");
      const path = pathParts.join("\t");
      return {
        path: normalizeGitPath(path),
        additions: addedRaw === "-" ? 0 : Number.parseInt(addedRaw, 10),
        deletions: deletedRaw === "-" ? 0 : Number.parseInt(deletedRaw, 10),
      };
    });
}

function parseNameStatusRenames(output) {
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      const [status, from, to] = line.split("\t");
      return status?.startsWith("R") && to ? [to] : [];
    });
}

function parseUntracked(output) {
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((path) => ({
      path,
      additions: countLines(resolve(root, path)),
      deletions: 0,
    }));
}

function countLines(path) {
  try {
    const text = readFileSync(path, "utf8");
    if (!text) {
      return 0;
    }
    return text.endsWith("\n") ? text.split("\n").length - 1 : text.split("\n").length;
  } catch {
    return 0;
  }
}

function normalizeGitPath(path) {
  const braceRename = path.match(/^(.*)\{(.+) => (.+)\}(.*)$/);
  if (braceRename) {
    return `${braceRename[1]}${braceRename[3]}${braceRename[4]}`;
  }
  if (path.includes(" => ")) {
    const parts = path.split(" => ");
    return parts.at(-1).replace(/[{}]/g, "");
  }
  return path;
}

function summarize(files, renamedOnly) {
  const totals = {
    files: files.length,
    productFiles: 0,
    productAdditions: 0,
    agentAdditions: 0,
    docsAdditions: 0,
    generatedAdditions: 0,
    apiAdditions: 0,
    rawProofFiles: 0,
    additions: 0,
    deletions: 0,
  };

  for (const file of files) {
    const additions = Number.isFinite(file.additions) ? file.additions : 0;
    const deletions = Number.isFinite(file.deletions) ? file.deletions : 0;
    totals.additions += additions;
    totals.deletions += deletions;

    if (isProductPath(file.path) && !renamedOnly.has(file.path)) {
      totals.productFiles += 1;
      totals.productAdditions += additions;
    }
    if (isAgentPath(file.path)) {
      totals.agentAdditions += additions;
    }
    if (isDocsPath(file.path)) {
      totals.docsAdditions += additions;
    }
    if (isGeneratedPath(file.path)) {
      totals.generatedAdditions += additions;
    }
    if (isApiSourcePath(file.path)) {
      totals.apiAdditions += additions;
    }
    if (file.path.includes("/raw/") && file.path.startsWith(".agent/")) {
      totals.rawProofFiles += 1;
    }
  }

  return totals;
}

function isProductPath(path) {
  return path.startsWith("apps/") || path.startsWith("packages/") || path.startsWith("tests/");
}

function isAgentPath(path) {
  return path.startsWith(".agent/");
}

function isDocsPath(path) {
  return (
    path === "AGENTS.md" ||
    path.startsWith("docs/") ||
    path.startsWith("prompts/") ||
    path.startsWith(".agents/skills/")
  );
}

function isGeneratedPath(path) {
  return path.startsWith("packages/api-client/src/generated/") ||
    path.startsWith("packages/api-client/dist/") ||
    path.startsWith("packages/api-client/openapi/");
}

function isApiSourcePath(path) {
  return path.startsWith("apps/api/src/") || path.startsWith("apps/api/pom.xml");
}

function printReport(status, totals, issues, warnings, note) {
  const report = {
    status,
    tier,
    task_kind: taskKind,
    base,
    note,
    totals,
    issues,
    warnings,
  };
  console.log(JSON.stringify(report, null, 2));
}

function relative(path) {
  return path.replace(`${root}/`, "");
}

function fail(message) {
  console.error(`check-code-first-slice: ${message}`);
  process.exit(1);
}
