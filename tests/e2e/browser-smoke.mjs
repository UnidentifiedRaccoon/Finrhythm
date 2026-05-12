import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const rootDir = process.cwd();
const outputDir = process.env.E2E_OUTPUT_DIR ?? join(".local", "e2e", "browser-smoke");
const startupTimeoutMs = Number.parseInt(process.env.E2E_STARTUP_TIMEOUT_MS ?? "90000", 10);
const reuseAllServers = process.env.E2E_REUSE_SERVERS === "1";

const suites = [
  {
    name: "web",
    filter: "@finrhythm/web",
    port: process.env.WEB_SMOKE_PORT ?? "3400",
    baseUrlEnv: "WEB_SMOKE_BASE_URL",
    outputDirEnv: "WEB_SMOKE_OUTPUT_DIR",
    smokeEnv: {
      WEB_SMOKE_SCREENSHOT_PREFIX: process.env.WEB_SMOKE_SCREENSHOT_PREFIX ?? "root-web-browser-smoke"
    },
    startupPath: "/learning"
  },
  {
    name: "admin",
    filter: "@finrhythm/admin",
    port: process.env.ADMIN_SMOKE_PORT ?? "3300",
    baseUrlEnv: "ADMIN_SMOKE_BASE_URL",
    outputDirEnv: "ADMIN_SMOKE_OUTPUT_DIR",
    smokeEnv: {},
    startupPath: "/"
  }
];

const startedServers = [];

process.on("SIGINT", () => {
  stopStartedServers();
  process.exit(130);
});

process.on("SIGTERM", () => {
  stopStartedServers();
  process.exit(143);
});

try {
  for (const suite of suites) {
    await runSuite(suite);
  }
  console.log("root browser smoke passed");
} finally {
  stopStartedServers();
}

async function runSuite(suite) {
  const explicitBaseUrl = process.env[suite.baseUrlEnv];
  const baseUrl = explicitBaseUrl ?? `http://127.0.0.1:${suite.port}`;
  const suiteOutputDir = process.env[suite.outputDirEnv] ?? join(outputDir, suite.name);
  const shouldReuseServer = reuseAllServers || Boolean(explicitBaseUrl);

  await mkdir(suiteOutputDir, { recursive: true });

  if (shouldReuseServer) {
    console.log(`[${suite.name}] waiting for existing server at ${baseUrl}`);
    await waitForServer(baseUrl, suite.startupPath, startupTimeoutMs);
  } else {
    if (await isServerReady(baseUrl, suite.startupPath)) {
      throw new Error(
        `[${suite.name}] ${baseUrl} already responds; set E2E_REUSE_SERVERS=1 to use it or choose another *_SMOKE_PORT`
      );
    }
    const server = startDevServer(suite, baseUrl);
    startedServers.push(server);
    await waitForServer(baseUrl, suite.startupPath, startupTimeoutMs, server);
  }

  await runCommand("pnpm", ["--filter", suite.filter, "smoke:browser"], {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    [suite.baseUrlEnv]: baseUrl,
    [suite.outputDirEnv]: suiteOutputDir,
    ...suite.smokeEnv
  });
}

function startDevServer(suite, baseUrl) {
  console.log(`[${suite.name}] starting dev server at ${baseUrl}`);
  const child = spawn(
    "pnpm",
    ["--filter", suite.filter, "exec", "next", "dev", "--hostname", "127.0.0.1", "--port", suite.port],
    {
      cwd: rootDir,
      detached: true,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  child.spawnError = null;
  child.stopping = false;
  child.stdout.on("data", (data) => process.stdout.write(prefixLines(`[${suite.name}:dev]`, data)));
  child.stderr.on("data", (data) => process.stderr.write(prefixLines(`[${suite.name}:dev]`, data)));
  child.once("error", (error) => {
    child.spawnError = error;
    console.error(`[${suite.name}] failed to start dev server: ${error.message}`);
  });

  child.once("exit", (code, signal) => {
    if (!child.stopping && code !== 0) {
      console.error(`[${suite.name}] dev server exited early: code=${code} signal=${signal ?? ""}`);
    }
  });

  return child;
}

function stopStartedServers() {
  for (const child of startedServers.splice(0).reverse()) {
    if (child.killed || child.exitCode !== null) {
      continue;
    }
    try {
      child.stopping = true;
      process.kill(-child.pid, "SIGTERM");
    } catch {
      try {
        child.stopping = true;
        child.kill("SIGTERM");
      } catch {
        // Best-effort cleanup; the process may have already exited.
      }
    }
  }
}

async function runCommand(command, args, env) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env,
      stdio: "inherit"
    });

    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed: code=${code} signal=${signal ?? ""}`));
    });
  });
}

async function waitForServer(baseUrl, path, timeoutMs, server = null) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    if (server?.spawnError) {
      throw server.spawnError;
    }
    if (server && server.exitCode !== null) {
      throw new Error(`Dev server exited before ${new URL(path, baseUrl).toString()} became ready`);
    }
    try {
      if (await isServerReady(baseUrl, path)) {
        return;
      }
    } catch (error) {
      lastError = error;
    }
    await sleep(500);
  }

  throw new Error(`Timed out waiting for ${new URL(path, baseUrl).toString()}: ${lastError?.message ?? "not ready"}`);
}

async function isServerReady(baseUrl, path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    const response = await fetch(new URL(path, baseUrl), {
      cache: "no-store",
      signal: controller.signal
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function prefixLines(prefix, data) {
  return String(data)
    .split(/(\r?\n)/)
    .map((part) => (part === "\n" || part === "\r\n" || part.length === 0 ? part : `${prefix} ${part}`))
    .join("");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
