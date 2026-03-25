import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawn } from "node:child_process";
import net from "node:net";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const tempDir = join(repoRoot, ".tmp");
const statePath = join(tempDir, "local-dev-servers.json");
const logsDir = join(tempDir, "dev-logs");
const defaultHost = "127.0.0.1";

const services = {
  storybook: {
    name: "storybook",
    defaultPort: 6006,
    basePath: "/",
    commandTokens: ["storybook dev", `${repoRoot}/node_modules/.bin/storybook`],
    startArgs: ["run", "storybook", "--workspace", "@fdic-ds/storybook", "--"],
  },
  docs: {
    name: "docs",
    defaultPort: 5173,
    basePath: "/fdic-design-system/",
    commandTokens: ["vitepress dev", `${repoRoot}/node_modules/.bin/vitepress`],
    startArgs: ["run", "docs:dev", "--workspace", "@fdic-ds/docs", "--"],
  },
};

function ensureTempDirs() {
  mkdirSync(tempDir, { recursive: true });
  mkdirSync(logsDir, { recursive: true });
}

function readState() {
  if (!existsSync(statePath)) {
    return {};
  }

  try {
    return JSON.parse(readFileSync(statePath, "utf8"));
  } catch {
    return {};
  }
}

function writeState(state) {
  ensureTempDirs();
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function parseArgs(argv) {
  const [, , command = "status", ...rest] = argv;
  const options = {};
  const positionals = [];

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const key = token.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = value;
    index += 1;
  }

  return { command, positionals, options };
}

function getServiceNames(target) {
  if (!target || target === "all") {
    return Object.keys(services);
  }

  if (!(target in services)) {
    throw new Error(`Unknown service "${target}". Use one of: ${Object.keys(services).join(", ")}, all`);
  }

  return [target];
}

function getServiceUrl(serviceName, host, port) {
  const service = services[serviceName];
  return `http://${host}:${port}${service.basePath}`;
}

function safeExec(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8" });
  } catch (error) {
    if (typeof error.stdout === "string" && error.status === 1) {
      return error.stdout;
    }
    throw error;
  }
}

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function getCommandForPid(pid) {
  return safeExec("ps", ["-p", String(pid), "-o", "command="]).trim();
}

function listListeningProcesses() {
  const output = safeExec("lsof", ["-nP", "-iTCP", "-sTCP:LISTEN"]);
  return output
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const columns = line.split(/\s+/);
      const pid = Number(columns[1]);
      const name = columns.slice(8).join(" ");
      const match = name.match(/([^:]+):(\d+)(?:\s+\(LISTEN\))?$/);
      return {
        pid,
        name: columns[0],
        host: match?.[1] || "",
        port: Number(match?.[2] || "0"),
      };
    })
    .filter((entry) => Number.isFinite(entry.pid) && entry.port > 0);
}

function listServiceInstances(serviceName) {
  const service = services[serviceName];
  return listListeningProcesses()
    .map((entry) => ({ ...entry, command: getCommandForPid(entry.pid) }))
    .filter(
      (entry) =>
        entry.command.includes(repoRoot) &&
        service.commandTokens.some((token) => entry.command.includes(token)),
    )
    .sort((left, right) => left.port - right.port);
}

async function isUrlWorking(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  }
}

async function findAvailablePort(host, startPort) {
  let port = startPort;

  while (true) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();
      server.unref();
      server.once("error", () => resolve(false));
      server.listen({ host, port }, () => {
        server.close(() => resolve(true));
      });
    });

    if (available) {
      return port;
    }

    port += 1;
  }
}

async function waitForUrl(url, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isUrlWorking(url)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

async function stopService(serviceName) {
  const state = readState();
  const instances = listServiceInstances(serviceName);

  for (const instance of instances) {
    try {
      process.kill(instance.pid, "SIGTERM");
    } catch {
      // Process already exited.
    }
  }

  const deadline = Date.now() + 5000;
  while (Date.now() < deadline && instances.some((instance) => isProcessAlive(instance.pid))) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  for (const instance of instances.filter((entry) => isProcessAlive(entry.pid))) {
    try {
      process.kill(instance.pid, "SIGKILL");
    } catch {
      // Process already exited.
    }
  }

  delete state[serviceName];
  writeState(state);

  return instances;
}

async function startService(serviceName, options) {
  const service = services[serviceName];
  const requestedPort =
    typeof options.port === "string" ? Number.parseInt(options.port, 10) : service.defaultPort;
  const host = typeof options.host === "string" ? options.host : defaultHost;

  if (!Number.isFinite(requestedPort) || requestedPort <= 0) {
    throw new Error(`Invalid port "${options.port}"`);
  }

  const existingInstances = listServiceInstances(serviceName);
  if (existingInstances.length === 1) {
    const [instance] = existingInstances;
    const state = readState();
    state[serviceName] = {
      pid: instance.pid,
      host: instance.host,
      port: instance.port,
      url: getServiceUrl(serviceName, instance.host, instance.port),
      logPath: state[serviceName]?.logPath || null,
      startedAt: state[serviceName]?.startedAt || new Date().toISOString(),
    };
    writeState(state);
    return { reused: true, ...state[serviceName] };
  }

  if (existingInstances.length > 1) {
    await stopService(serviceName);
  }

  const port = await findAvailablePort(host, requestedPort);
  ensureTempDirs();
  const logPath = join(logsDir, `${serviceName}-${port}.log`);
  const logStream = createWriteStream(logPath, { flags: "a" });
  const child = spawn(
    "npm",
    [...service.startArgs, "--host", host, "--port", String(port)],
    {
      cwd: repoRoot,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);
  child.unref();

  const url = getServiceUrl(serviceName, host, port);
  const working = await waitForUrl(url);
  if (!working) {
    throw new Error(
      `Timed out waiting for ${serviceName} at ${url}. Check ${logPath} for startup output.`,
    );
  }

  const listenerInstance = listServiceInstances(serviceName).find(
    (instance) => instance.host === host && instance.port === port,
  );

  const state = readState();
  state[serviceName] = {
    pid: listenerInstance?.pid || child.pid,
    host,
    port,
    url,
    logPath,
    startedAt: new Date().toISOString(),
  };
  writeState(state);

  return { reused: false, ...state[serviceName] };
}

async function getStatus(serviceName) {
  const state = readState();
  const tracked = state[serviceName];
  const instances = listServiceInstances(serviceName);
  const currentPid =
    tracked && isProcessAlive(tracked.pid) ? tracked.pid : instances.length === 1 ? instances[0].pid : null;

  return Promise.all(
    instances.map(async (instance) => {
      const url = getServiceUrl(serviceName, instance.host, instance.port);
      return {
        ...instance,
        url,
        working: await isUrlWorking(url),
        current: instance.pid === currentPid,
      };
    }),
  );
}

async function printStatus(target) {
  const serviceNames = getServiceNames(target);
  let foundAny = false;

  for (const serviceName of serviceNames) {
    const statuses = await getStatus(serviceName);
    console.log(`${serviceName}:`);
    if (statuses.length === 0) {
      console.log("  stopped");
      continue;
    }

    foundAny = true;
    for (const status of statuses) {
      const labels = [
        status.current ? "current" : null,
        status.working ? "working" : "unresponsive",
      ]
        .filter(Boolean)
        .join(", ");
      console.log(`  ${status.url} pid=${status.pid} ${labels}`);
    }
  }

  process.exitCode = foundAny ? 0 : 1;
}

async function printUrls(target) {
  const serviceNames = getServiceNames(target);
  let printedAny = false;

  for (const serviceName of serviceNames) {
    const statuses = await getStatus(serviceName);
    const preferred =
      statuses.find((status) => status.current && status.working) ||
      statuses.find((status) => status.working);
    if (!preferred) {
      continue;
    }

    printedAny = true;
    console.log(`${serviceName}: ${preferred.url}`);
  }

  process.exitCode = printedAny ? 0 : 1;
}

async function main() {
  const { command, positionals, options } = parseArgs(process.argv);

  if (command === "status") {
    await printStatus(positionals[0] || "all");
    return;
  }

  if (command === "url") {
    await printUrls(positionals[0] || "all");
    return;
  }

  if (command === "start") {
    const serviceNames = getServiceNames(positionals[0] || "all");
    for (const serviceName of serviceNames) {
      const result = await startService(serviceName, options);
      const action = result.reused ? "reused" : "started";
      console.log(`${serviceName}: ${action} ${result.url} pid=${result.pid}`);
      if (result.logPath) {
        console.log(`  log: ${result.logPath}`);
      }
    }
    return;
  }

  if (command === "stop") {
    const serviceNames = getServiceNames(positionals[0] || "all");
    for (const serviceName of serviceNames) {
      const stopped = await stopService(serviceName);
      if (stopped.length === 0) {
        console.log(`${serviceName}: already stopped`);
        continue;
      }
      console.log(
        `${serviceName}: stopped ${stopped.map((instance) => instance.pid).join(", ")}`,
      );
    }
    return;
  }

  throw new Error(
    `Unknown command "${command}". Use: status, url, start, stop`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
