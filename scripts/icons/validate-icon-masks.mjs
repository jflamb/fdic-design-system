#!/usr/bin/env node

/**
 * Validate that the committed icon-masks.css matches what the generator
 * would produce from the current phosphor-data.mjs source.
 *
 * Run: npm run validate:icon-masks
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const committedPath = path.join(
  repoRoot,
  "apps/docs/.vitepress/theme/generated/icon-masks.css",
);

if (!fs.existsSync(committedPath)) {
  console.error(
    "ERROR: icon-masks.css does not exist. Run `npm run generate:icon-masks`.",
  );
  process.exit(1);
}

const before = fs.readFileSync(committedPath, "utf8");

execFileSync("node", ["scripts/icons/generate-icon-masks.mjs"], {
  cwd: repoRoot,
  stdio: "inherit",
});

const after = fs.readFileSync(committedPath, "utf8");

if (before !== after) {
  console.error(
    "ERROR: icon-masks.css is out of date. Run `npm run generate:icon-masks` and commit the result.",
  );
  process.exit(1);
}

console.log("icon-masks.css is up to date.");
