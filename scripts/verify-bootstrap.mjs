import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quiet = process.argv.includes("--quiet");
const checks = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function record(id, status, detail) {
  checks.push({ id, status, detail });
}

function assertCheck(id, condition, detail) {
  record(id, condition ? "PASS" : "FAIL", detail);
}

function collectLegacyFixtureTerms(value, currentPath = "$", hits = []) {
  const legacyTerm = /cohort|wave/i;

  if (typeof value === "string") {
    if (legacyTerm.test(value)) {
      hits.push(`${currentPath}=${JSON.stringify(value)}`);
    }
    return hits;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLegacyFixtureTerms(item, `${currentPath}[${index}]`, hits));
    return hits;
  }

  if (value && typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      const nextPath = `${currentPath}.${key}`;
      if (legacyTerm.test(key)) {
        hits.push(nextPath);
      }
      collectLegacyFixtureTerms(nestedValue, nextPath, hits);
    }
  }

  return hits;
}

const requiredPaths = [
  "Makefile",
  "package.json",
  "pnpm-workspace.yaml",
  "infra/local/compose.yaml",
  "scripts/check-toolchain.sh",
  "scripts/init/version.json",
  "content/fixtures/demo-bootstrap.json",
  "apps/api/src/main/resources/db/migration/V001__dev_bootstrap_runs.sql",
  "packages/ui",
  "packages/config",
  "packages/api-client",
  "content/fixtures",
  "content/imports",
  "content/exports",
  "tests/e2e"
];

for (const relativePath of requiredPaths) {
  assertCheck(`path:${relativePath}`, fs.existsSync(path.join(root, relativePath)), `${relativePath} exists`);
}

const makefile = readText("Makefile");
for (const target of ["install", "init", "dev", "verify", "test-unit", "test-e2e", "build"]) {
  assertCheck(`make-target:${target}`, new RegExp(`^${target}:`, "m").test(makefile), `Makefile defines ${target}`);
}
assertCheck(
  "install-checks-toolchain",
  /^install:\n(?:\t.+\n)*\t\.\/scripts\/check-toolchain\.sh\n(?:\t.+\n)*\tpnpm install --frozen-lockfile/m.test(makefile),
  "make install runs the toolchain readiness check before pnpm install"
);
assertCheck(
  "install-help-toolchain",
  /make install\s+Check Node\/pnpm\/Corepack\/Java 21\/Maven wrapper/.test(makefile),
  "make help describes install toolchain readiness expectations"
);

const initLocal = readText("scripts/init-local.sh");
assertCheck(
  "init-runs-flyway-migrations",
  initLocal.includes("flyway-maven-plugin") && initLocal.includes(":migrate"),
  "make init delegates schema migration to Flyway through the backend Maven wrapper"
);
assertCheck(
  "init-not-v001-only",
  !/MIGRATION_FILE=.*V001__dev_bootstrap_runs\.sql/.test(initLocal) && !/<\s*\"\$MIGRATION_FILE\"/.test(initLocal),
  "make init does not manually apply only V001__dev_bootstrap_runs.sql"
);
assertCheck(
  "init-record-after-flyway",
  initLocal.indexOf("run_flyway_migrations") !== -1 &&
    initLocal.lastIndexOf("run_flyway_migrations") < initLocal.indexOf("insert into dev_bootstrap_runs"),
  "bootstrap run is recorded only after Flyway migration command"
);

const packageJson = readJson("package.json");
assertCheck("package-manager", packageJson.packageManager === "pnpm@10.27.0", "package.json pins pnpm@10.27.0");

const version = readJson("scripts/init/version.json");
assertCheck("bootstrap-key", version.bootstrapKey === "local_init", "bootstrap key is local_init");
assertCheck("bootstrap-version", /^\d{4}-\d{2}-\d{2}\.\d+$/.test(version.version), "bootstrap version is date-versioned");
assertCheck("bootstrap-checksum", typeof version.checksum === "string" && version.checksum.length > 0, "bootstrap checksum marker is present");
assertCheck("bootstrap-fixture", version.fixture === "content/fixtures/demo-bootstrap.json", "bootstrap fixture path is explicit");

const fixtureText = readText("content/fixtures/demo-bootstrap.json");
const fixture = JSON.parse(fixtureText);
const fixtureLower = fixtureText.toLowerCase();
const pilotLaunches = Array.isArray(fixture.pilotLaunches) ? fixture.pilotLaunches : [];
const accessPools = Array.isArray(fixture.accessPools) ? fixture.accessPools : [];
const inviteCodes = Array.isArray(fixture.inviteCodes) ? fixture.inviteCodes : [];
const pilotLaunchKeys = new Set(pilotLaunches.map((pilotLaunch) => pilotLaunch.key));
const accessPoolKeys = new Set(accessPools.map((accessPool) => accessPool.key));
const legacyFixtureHits = collectLegacyFixtureTerms(fixture);
assertCheck("fixture-no-customer-brand", !fixtureLower.includes("lemanapro") && !fixtureLower.includes("лемана"), "employee fixture does not expose customer brand");
assertCheck("fixture-no-real-person", !fixtureLower.includes("@") && !fixtureLower.includes("+7"), "fixture contains no real-looking contact data");
assertCheck("fixture-active-access-shape", pilotLaunches.length > 0 && accessPools.length > 0, "fixture uses pilotLaunches/accessPools arrays");
assertCheck("fixture-no-legacy-access-terms", legacyFixtureHits.length === 0, legacyFixtureHits.length === 0 ? "fixture has no cohort/wave keys or string values" : `legacy terms: ${legacyFixtureHits.join(", ")}`);
assertCheck("fixture-access-pool-launch-links", accessPools.every((accessPool) => pilotLaunchKeys.has(accessPool.pilotLaunchKey)), "each access pool links to an existing pilot launch");
assertCheck("fixture-invite-access-pool-links", inviteCodes.every((inviteCode) => accessPoolKeys.has(inviteCode.accessPoolKey)), "each invite code links to an existing access pool");
assertCheck("fixture-privacy-threshold", fixture.privacy?.minimumReportingGroupSize >= 20, "fixture keeps HR reporting threshold at least 20");
assertCheck("fixture-points-not-money", fixture.rewardCatalog.every((item) => Number.isInteger(item.pointsPrice) && !("price" in item) && !("money" in item)), "rewards use pointsPrice, not money fields");

const migration = readText("apps/api/src/main/resources/db/migration/V001__dev_bootstrap_runs.sql").toLowerCase();
assertCheck("migration-bootstrap-table", migration.includes("create table if not exists dev_bootstrap_runs"), "migration creates dev_bootstrap_runs");
assertCheck("migration-idempotency-key", migration.includes("primary key (bootstrap_key, version)"), "migration records bootstrap idempotency key");

const compose = readText("infra/local/compose.yaml");
assertCheck("compose-postgres", compose.includes("postgres:16-alpine"), "local compose defines PostgreSQL 16");

const status = checks.every((check) => check.status === "PASS") ? "PASS" : "FAIL";
const report = {
  status,
  checked_at: new Date().toISOString(),
  repo_root: root,
  checks
};

if (!quiet) {
  console.log(JSON.stringify(report, null, 2));
}

if (status !== "PASS") {
  process.exit(1);
}
