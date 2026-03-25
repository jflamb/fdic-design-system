#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  componentInventory,
  componentSourceText,
  docsPathFor,
  extractCssPropertyNames,
  extractEventNames,
  extractShadowPartNames,
  extractSlotNames,
  extractStaticProperties,
  kebabToCamel,
  loadApiMetadata,
  repoRoot,
  standaloneDocComponents,
  storyPathFor,
  registerExportComponents,
} from "./lib.mjs";

const API_START = "<!-- GENERATED_COMPONENT_API:START -->";
const apiMetadata = loadApiMetadata();
const errors = [];
const generatedFiles = [
  "packages/components/src/index.ts",
  "packages/components/src/register/register-all.ts",
  "packages/components/package.json",
  "packages/components/tsup.config.ts",
  "apps/storybook/src/generated/component-arg-types.ts",
  "apps/docs/.vitepress/generated/component-navigation.ts",
  "apps/docs/components/index.md",
  ...registerExportComponents.map(
    (component) => `packages/components/src/register/${component.sourceFile}`,
  ),
  ...standaloneDocComponents.map(
    (component) => `apps/docs/components/${component.docs.slug}.md`,
  ),
];
const beforeSync = snapshotFiles(generatedFiles);

execFileSync("node", ["scripts/components/sync.mjs"], {
  cwd: repoRoot,
  stdio: "inherit",
});
const afterSync = snapshotFiles(generatedFiles);

for (const component of componentInventory) {
  const sourcePath = path.join(
    repoRoot,
    "packages/components/src/components",
    component.sourceFile,
  );
  const testPath = sourcePath.replace(/\.ts$/, ".test.ts");

  if (!fs.existsSync(sourcePath)) {
    errors.push(`Missing component source for ${component.tagName}: ${sourcePath}`);
  }

  if (!["first-class", "supporting-standalone"].includes(component.docs.kind)) {
    continue;
  }

  if (!component.docs.category) {
    errors.push(`Missing docs category for ${component.tagName}.`);
  }

  if (typeof component.docs.order !== "number") {
    errors.push(`Missing numeric docs order for ${component.tagName}.`);
  }

  if (!fs.existsSync(testPath)) {
    errors.push(`Missing colocated test for ${component.tagName}: ${testPath}`);
  }
}

for (const component of standaloneDocComponents) {
  const docsPath = docsPathFor(component);
  const storyPath = storyPathFor(component);

  if (!fs.existsSync(storyPath)) {
    errors.push(`Missing Storybook file for ${component.tagName}: ${storyPath}`);
  }

  if (!fs.existsSync(docsPath)) {
    errors.push(`Missing docs page for ${component.tagName}: ${docsPath}`);
    continue;
  }

  const docsText = fs.readFileSync(docsPath, "utf8");
  const sourceText = componentSourceText(component);
  const metadata = apiMetadata[component.tagName] ?? {};

  if (hasAnyRows(metadata) && !docsText.includes(API_START)) {
    errors.push(`Docs page for ${component.tagName} is missing generated API markers.`);
  }

  const sourceProperties = new Set(
    extractStaticProperties(sourceText).map((property) => property.name),
  );
  const sourceSlots = new Set(extractSlotNames(sourceText));
  const sourceEvents = new Set(extractEventNames(sourceText));
  const sourceCssProperties = new Set(extractCssPropertyNames(sourceText));
  const sourceShadowParts = new Set(extractShadowPartNames(sourceText));

  for (const row of metadata.properties?.rows ?? []) {
    if (
      !sourceProperties.has(row.name) &&
      !sourceProperties.has(kebabToCamel(row.name)) &&
      !propertyExistsInSource(sourceText, kebabToCamel(row.name))
    ) {
      errors.push(
        `${component.tagName} metadata property "${row.name}" is not present in source.`,
      );
    }
  }

  for (const row of metadata.slots?.rows ?? []) {
    if (!sourceSlots.has(row.name)) {
      errors.push(
        `${component.tagName} metadata slot "${row.name}" is not present in source.`,
      );
    }
  }

  for (const row of metadata.events?.rows ?? []) {
    if (isNativeEventRow(row)) continue;

    if (!sourceEvents.has(row.name)) {
      errors.push(
        `${component.tagName} metadata event "${row.name}" is not present in source.`,
      );
    }
  }

  for (const row of metadata.cssProperties?.rows ?? []) {
    if (!sourceCssProperties.has(row.name)) {
      errors.push(
        `${component.tagName} metadata CSS custom property "${row.name}" is not present in source.`,
      );
    }
  }

  for (const row of metadata.shadowParts?.rows ?? []) {
    if (!sourceShadowParts.has(row.name)) {
      errors.push(
        `${component.tagName} metadata shadow part "${row.name}" is not present in source.`,
      );
    }
  }
}

if (generatedFilesChanged(beforeSync, afterSync)) {
  errors.push(
    "Generated files are out of date. Run `npm run sync:components` and commit the results.",
  );
}

if (errors.length > 0) {
  console.error("\nComponent validation failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Component validation passed.");

function hasAnyRows(metadata) {
  return [
    metadata.properties,
    metadata.slots,
    metadata.events,
    metadata.cssProperties,
    metadata.shadowParts,
  ].some((section) => Array.isArray(section?.rows) && section.rows.length > 0);
}

function snapshotFiles(files) {
  return new Map(
    files.map((file) => {
      const absolutePath = path.join(repoRoot, file);
      return [
        file,
        fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : null,
      ];
    }),
  );
}

function generatedFilesChanged(before, after) {
  for (const [file, beforeValue] of before.entries()) {
    if (beforeValue !== after.get(file)) {
      return true;
    }
  }

  return false;
}

function propertyExistsInSource(sourceText, propertyName) {
  return (
    new RegExp(`declare\\s+${propertyName}:`).test(sourceText) ||
    new RegExp(`get\\s+${propertyName}\\s*\\(`).test(sourceText) ||
    new RegExp(`set\\s+${propertyName}\\s*\\(`).test(sourceText)
  );
}

function isNativeEventRow(row) {
  return typeof row.detail === "string" && row.detail.includes("Native");
}
