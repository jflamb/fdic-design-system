#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(repoRoot, relativePath), "utf8"),
  );
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const reactPackage = readJson("packages/react/package.json");
  const moduleUrl = pathToFileURL(
    path.join(repoRoot, "packages/react/dist/index.js"),
  ).href;
  const reactEntry = await import(moduleUrl);

  assert(reactPackage.private === true, "react workspace must remain private while experimental");
  assert(
    /experimental/i.test(reactPackage.description ?? ""),
    "react workspace description must remain explicitly experimental",
  );
  assert(
    reactEntry.reactPackageStatus === "experimental-generated-wrappers",
    "react entry must keep the experimental-generated-wrappers status marker",
  );

  for (const exportName of ["FdButton", "FdInput", "FdGlobalHeader"]) {
    assert(
      exportName in reactEntry,
      `react entry must export ${exportName} in the built package`,
    );
  }

  console.log("React package smoke validation passed.");
}

main();
