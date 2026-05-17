#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  registerExportComponents,
  repoRoot,
  symbolExportComponents,
} from "./components/lib.mjs";

const additionalPublicModules = [
  "fd-global-header-content",
  "fd-global-header-drupal",
  "fd-global-header-reference",
];
const iconPublicModules = ["phosphor-duotone", "phosphor-regular"];
const errors = [];

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(repoRoot, relativePath), "utf8"),
  );
}

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function listFiles(relativePath, matcher) {
  const absolutePath = path.join(repoRoot, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  return fs.readdirSync(absolutePath).filter(matcher).sort();
}

function assertExportTarget(exportPath, targetPath, packageName) {
  assert(
    exists(targetPath),
    `${packageName} export ${exportPath} points at missing file: ${targetPath}`,
  );
}

function assertConditionalExport(exportPath, value, packageName) {
  assert(
    typeof value === "object" && value !== null,
    `${packageName} export ${exportPath} must be a conditional export object`,
  );

  if (typeof value !== "object" || value === null) {
    return;
  }

  assert(
    typeof value.types === "string",
    `${packageName} export ${exportPath} must include a types target`,
  );
  assert(
    typeof value.import === "string",
    `${packageName} export ${exportPath} must include an import target`,
  );

  if (typeof value.types === "string") {
    assertExportTarget(exportPath, `packages/components/${value.types}`, packageName);
  }

  if (typeof value.import === "string") {
    assertExportTarget(exportPath, `packages/components/${value.import}`, packageName);
  }
}

function expectedComponentsExports() {
  const exportsMap = {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
    },
    "./public-events": {
      types: "./dist/public-events.d.ts",
      import: "./dist/public-events.js",
    },
    "./register-all": {
      types: "./dist/register/register-all.d.ts",
      import: "./dist/register/register-all.js",
    },
    "./register/*": {
      types: "./dist/register/*.d.ts",
      import: "./dist/register/*.js",
    },
    "./styles.css": "./styles.css",
  };

  for (const moduleName of additionalPublicModules) {
    exportsMap[`./${moduleName}`] = {
      types: `./dist/${moduleName}.d.ts`,
      import: `./dist/${moduleName}.js`,
    };
  }

  for (const component of symbolExportComponents) {
    exportsMap[`./${component.tagName}`] = {
      types: `./dist/components/${component.tagName}.d.ts`,
      import: `./dist/components/${component.tagName}.js`,
    };
  }

  for (const iconName of iconPublicModules) {
    exportsMap[`./icons/${iconName}`] = {
      types: `./dist/icons/${iconName}.d.ts`,
      import: `./dist/icons/${iconName}.js`,
    };
  }

  return exportsMap;
}

function compareExports(actual, expected, packageName) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected).sort();

  for (const key of expectedKeys) {
    assert(
      Object.hasOwn(actual, key),
      `${packageName} is missing public export ${key}`,
    );
  }

  for (const key of actualKeys) {
    assert(
      Object.hasOwn(expected, key),
      `${packageName} exposes unexpected public export ${key}`,
    );
  }

  for (const key of expectedKeys) {
    if (!Object.hasOwn(actual, key)) continue;

    assert(
      JSON.stringify(actual[key]) === JSON.stringify(expected[key]),
      `${packageName} export ${key} does not match the generated public contract`,
    );
  }
}

function validateComponentsPackage() {
  const packageJson = readJson("packages/components/package.json");
  const expectedExports = expectedComponentsExports();

  compareExports(packageJson.exports, expectedExports, "@jflamb/fdic-ds-components");

  assert(
    packageJson.files.includes("dist"),
    "@jflamb/fdic-ds-components must publish dist",
  );
  assert(
    packageJson.files.includes("styles.css"),
    "@jflamb/fdic-ds-components must publish styles.css",
  );

  for (const [exportPath, value] of Object.entries(packageJson.exports)) {
    if (exportPath === "./styles.css") {
      assertExportTarget(exportPath, "packages/components/styles.css", packageJson.name);
      continue;
    }

    if (exportPath === "./register/*") {
      continue;
    }

    assertConditionalExport(exportPath, value, packageJson.name);
  }

  const expectedComponentFiles = new Set(
    symbolExportComponents.flatMap((component) => [
      `${component.tagName}.js`,
      `${component.tagName}.d.ts`,
    ]),
  );
  const actualComponentFiles = listFiles(
    "packages/components/dist/components",
    (file) => /^fd-.*\.(js|d\.ts)$/.test(file),
  );

  for (const file of expectedComponentFiles) {
    assert(
      actualComponentFiles.includes(file),
      `built component public entry is missing: dist/components/${file}`,
    );
  }

  for (const file of actualComponentFiles) {
    assert(
      expectedComponentFiles.has(file),
      `built component directory exposes unexpected public-looking entry: dist/components/${file}`,
    );
  }

  const expectedRegisterFiles = new Set([
    "register-all.js",
    "register-all.d.ts",
    ...registerExportComponents.flatMap((component) => [
      `${component.tagName}.js`,
      `${component.tagName}.d.ts`,
    ]),
  ]);
  const actualRegisterFiles = listFiles(
    "packages/components/dist/register",
    (file) => /\.(js|d\.ts)$/.test(file),
  );

  for (const file of expectedRegisterFiles) {
    assert(
      actualRegisterFiles.includes(file),
      `built register public entry is missing: dist/register/${file}`,
    );
  }

  for (const file of actualRegisterFiles) {
    assert(
      expectedRegisterFiles.has(file),
      `built register directory exposes unexpected entry: dist/register/${file}`,
    );
  }

  for (const forbidden of ["fd-placeholder", "fd-internal", "org-chart/internal"]) {
    const publicPaths = [
      ...actualComponentFiles.map((file) => `dist/components/${file}`),
      ...actualRegisterFiles.map((file) => `dist/register/${file}`),
      ...Object.keys(packageJson.exports),
    ];

    assert(
      !publicPaths.some((value) => value.includes(forbidden)),
      `public component package leaks internal surface containing ${forbidden}`,
    );
  }
}

function validateTokensPackage() {
  const packageJson = readJson("packages/tokens/package.json");
  const expectedExports = {
    "./styles.css": "./styles.css",
    "./fdic.tokens.json": "./fdic.tokens.json",
    "./interaction.css": "./interaction.css",
    "./semantic.css": "./semantic.css",
  };

  compareExports(packageJson.exports, expectedExports, "@jflamb/fdic-ds-tokens");

  for (const [exportPath, targetPath] of Object.entries(packageJson.exports)) {
    assertExportTarget(exportPath, `packages/tokens/${targetPath}`, packageJson.name);
  }

  for (const file of Object.values(expectedExports)) {
    assert(
      packageJson.files.includes(file.replace("./", "")),
      `@jflamb/fdic-ds-tokens must publish ${file}`,
    );
  }
}

validateComponentsPackage();
validateTokensPackage();

if (errors.length > 0) {
  console.error("\nBuilt public contract validation failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Built public contract validation passed.");
