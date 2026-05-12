import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const appRoot = new URL("..", import.meta.url).pathname;
const fixturePath = join(appRoot, "lib", "code-status-fixture.json");
const clientPath = join(appRoot, "lib", "code-status-client.ts");
const managedSourceDirs = ["app", "components", "lib"];
const statuses = ["CREATED", "ISSUED", "RESERVED", "ACTIVATED", "REVOKED", "EXPIRED"];

describe("admin code-status local boundary", () => {
  it("matches the proven backend DTO shape used by the UI fixture", async () => {
    const body = JSON.parse(await readFile(fixturePath, "utf8"));

    assert.equal(typeof body.tenantId, "string");
    assert.equal(typeof body.pilotLaunchId, "string");
    assert.equal(typeof body.pilotLaunchKey, "string");
    assert.equal(typeof body.pilotLaunchName, "string");
    assert.equal(typeof body.accessPoolId, "string");
    assert.equal(typeof body.accessPoolKey, "string");
    assert.equal(typeof body.accessPoolName, "string");
    assert.equal(typeof body.poolCapacity, "number");
    assert.ok(body.summary);
    assert.ok(Array.isArray(body.statusCounts));
    assert.ok(body.codes);
    assert.ok(Array.isArray(body.codes.items));
    assert.ok(body.codes.size <= 100);

    assert.deepEqual(
      body.statusCounts.map((item) => item.status),
      statuses
    );

    for (const item of body.codes.items) {
      assert.equal(typeof item.inviteCodeId, "string");
      assert.ok(statuses.includes(item.status));
      assert.equal(typeof item.registered, "boolean");
      assert.ok(Object.hasOwn(item, "issuedAt"));
      assert.ok(Object.hasOwn(item, "expiresAt"));
      assert.ok(Object.hasOwn(item, "activatedAt"));
      assert.ok(Object.hasOwn(item, "registeredAt"));
    }
  });

  it("keeps managed admin source and fixture free of forbidden response fields", async () => {
    const haystack = await managedSourceText();
    const forbidden = [
      "raw" + "Invite" + "Code",
      "lookup" + "Hash",
      "activation" + "Subject" + "Ref",
      "full" + "Name",
      "em" + "ail",
      "pho" + "ne",
      "diag" + "nostic",
      "weak" + "Zone",
      "Lem" + "ana",
      "Лем" + "ана"
    ];

    for (const token of forbidden) {
      assert.equal(haystack.includes(token), false, `forbidden token found: ${token}`);
    }
  });

  it("does not put plain code-like values into the fixture rows", async () => {
    const fixtureText = await readFile(fixturePath, "utf8");
    assert.equal(/INV[-_A-Z0-9]{6,}/.test(fixtureText), false);
    assert.equal(/CODE[-_A-Z0-9]{6,}/.test(fixtureText), false);
  });

  it("keeps live source deploy-controlled and sends the admin bearer token", async () => {
    const clientSource = await readFile(clientPath, "utf8");

    assert.match(clientSource, /@finrhythm\/api-client/);
    assert.match(clientSource, /fetchAdminCodeStatus/);
    assert.match(clientSource, /FINRHYTHM_ADMIN_CODE_STATUS_SOURCE/);
    assert.match(clientSource, /FINRHYTHM_ADMIN_API_TOKEN/);
    assert.match(clientSource, /Authorization:\s*`Bearer/);
    assert.equal(clientSource.includes("params.mode"), false);
    assert.equal(clientSource.includes("first(params.mode)"), false);
  });
});

async function managedSourceText() {
  const files = [];
  for (const dir of managedSourceDirs) {
    files.push(...(await listFiles(join(appRoot, dir))));
  }

  const chunks = await Promise.all(
    files
      .filter((file) => /\.(css|json|ts|tsx)$/.test(file))
      .map((file) => readFile(file, "utf8"))
  );
  return chunks.join("\n");
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else {
      files.push(path);
    }
  }
  return files;
}
