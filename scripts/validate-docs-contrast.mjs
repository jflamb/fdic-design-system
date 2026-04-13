import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import axe from "axe-core";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "apps/docs");
const port = process.env.FDIC_DOCS_A11Y_PORT ?? "4174";
const baseUrl = `http://127.0.0.1:${port}/fdic-design-system`;
const serverReadyTimeoutMs = 30_000;

const docsServer = spawn(
  "npm",
  ["run", "docs:dev", "--workspace", "@fdic-ds/docs", "--", "--host", "127.0.0.1", "--port", port],
  {
    cwd: repoRoot,
    stdio: "ignore",
    shell: process.platform === "win32",
  },
);

const stopServer = async () => {
  if (docsServer.exitCode !== null || docsServer.signalCode !== null) {
    return;
  }

  docsServer.kill("SIGTERM");
  await delay(250);

  if (docsServer.exitCode === null && docsServer.signalCode === null) {
    docsServer.kill("SIGKILL");
  }
};

const walkMarkdownFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(absolutePath);
    }
  }

  return files.sort();
};

const routeForMarkdownFile = (absolutePath) => {
  const relativePath = path.relative(docsRoot, absolutePath).replaceAll(path.sep, "/");

  if (relativePath === "index.md") {
    return "/";
  }

  if (relativePath.endsWith("/index.md")) {
    return `/${relativePath.slice(0, -"/index.md".length)}/`;
  }

  return `/${relativePath.replace(/\.md$/, ".html")}`;
};

const waitForServer = async () => {
  const deadline = Date.now() + serverReadyTimeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the dev server is ready.
    }

    if (docsServer.exitCode !== null) {
      throw new Error(`Docs dev server exited early with code ${docsServer.exitCode}.`);
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for docs dev server at ${baseUrl}.`);
};

const collectViolations = async (page) => {
  const result = await page.evaluate(async () => {
    const axeResult = await globalThis.axe.run(document, {
      runOnly: { type: "rule", values: ["color-contrast"] },
    });

    return axeResult.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({
        target: node.target.join(" "),
        html: node.html,
        failureSummary: node.failureSummary,
      })),
    }));
  });

  return result;
};

try {
  await waitForServer();

  const markdownFiles = walkMarkdownFiles(docsRoot);
  const routes = markdownFiles.map(routeForMarkdownFile);
  const browser = await chromium.launch({ headless: true });
  const failures = [];

  for (const mode of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });

    await context.addInitScript((theme) => {
      localStorage.setItem("vitepress-theme-appearance", theme);
    }, mode);

    const page = await context.newPage();

    for (const route of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
      await delay(150);
      await page.addScriptTag({ content: axe.source });

      const violations = await collectViolations(page);

      if (violations.length > 0) {
        failures.push({
          mode,
          route,
          violations,
        });
      }
    }

    await context.close();
  }

  await browser.close();

  if (failures.length > 0) {
    console.error("Docs contrast validation failed.");

    for (const failure of failures) {
      console.error(`- [${failure.mode}] ${failure.route}`);
      for (const violation of failure.violations) {
        console.error(`  rule: ${violation.id}${violation.impact ? ` (${violation.impact})` : ""}`);
        for (const node of violation.nodes.slice(0, 5)) {
          console.error(`    target: ${node.target}`);
          console.error(`    issue: ${node.failureSummary?.replaceAll("\n", " ")}`);
        }
      }
    }

    process.exit(1);
  }

  console.log(`Docs contrast validation passed (${routes.length} pages in light and dark mode).`);
} finally {
  await stopServer();
}
