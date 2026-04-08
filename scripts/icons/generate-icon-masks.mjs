#!/usr/bin/env node

/**
 * Generate CSS icon masks from the shared Phosphor icon data.
 *
 * Reads SVG strings from phosphor-data.mjs, strips fill="currentColor",
 * URL-encodes to data URIs, and writes CSS custom properties for use
 * as mask-image values in the docs theme.
 *
 * Run: npm run generate:icon-masks
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { phosphorRegularIcons } from "../../packages/components/src/icons/phosphor-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

/** Icons consumed by prose.css — subset of the full registry. */
const PROSE_ICONS = [
  "arrow-square-out",
  "caret-down",
  "check-circle",
  "info",
  "lightbulb",
  "warning",
  "warning-octagon",
];

/**
 * Convert an SVG string to a mask-safe data URI.
 * Strips fill="currentColor" so the shape is colorless (mask only),
 * then percent-encodes for use in url().
 */
function toMaskDataUri(svg) {
  const maskSvg = svg.replace(/ fill="currentColor"/, "");
  const encoded = maskSvg
    .replace(/"/g, "'")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
  return `url("data:image/svg+xml,${encoded}")`;
}

const lines = [
  "/*",
  " * Auto-generated icon masks — do not edit manually.",
  " * Source: packages/components/src/icons/phosphor-data.mjs",
  " * Run: npm run generate:icon-masks",
  " */",
  "",
  ":root {",
];

for (const name of PROSE_ICONS) {
  const svg = phosphorRegularIcons[name];
  if (!svg) {
    console.error(`ERROR: Icon "${name}" not found in phosphor-data.mjs`);
    process.exit(1);
  }
  lines.push(`  --fd-icon-mask-${name}: ${toMaskDataUri(svg)};`);
}

lines.push("}", "");

const outDir = path.join(
  repoRoot,
  "apps/docs/.vitepress/theme/generated",
);
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "icon-masks.css");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);
