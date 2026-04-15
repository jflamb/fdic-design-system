#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const tokensPackage = readJson("packages/tokens/package.json");
  const componentsPackage = readJson("packages/components/package.json");
  const tokenStyles = readText("packages/tokens/styles.css");
  const tokenSemanticAlias = readText("packages/tokens/semantic.css");
  const componentStyles = readText("packages/components/styles.css");
  const tokenJson = readJson("packages/tokens/fdic.tokens.json");

  assert(tokensPackage.exports["./styles.css"] === "./styles.css", "tokens package must export ./styles.css");
  assert(tokensPackage.files.includes("styles.css"), "tokens package must publish styles.css");
  assert(tokenSemanticAlias.includes('@import "./styles.css";'), "semantic.css must remain an alias to styles.css");
  assert(tokenStyles.includes("--fdic-font-size-body:"), "styles.css must publish typography tokens");
  assert(tokenStyles.includes("--ds-spacing-md:"), "styles.css must publish spacing tokens");
  assert(tokenStyles.includes("--ds-corner-radius-md:"), "styles.css must publish radius tokens");
  assert(tokenStyles.includes("--ds-layout-max-width:"), "styles.css must publish layout tokens");
  assert(tokenStyles.includes("--ds-shadow-raised:"), "styles.css must publish effect tokens");
  assert(tokenStyles.includes("--ds-gradient-brand-core:"), "styles.css must publish gradient tokens");
  assert(!tokenStyles.includes("legacy-fdic-colors"), "styles.css must not reintroduce legacy color aliases");
  assert(tokenJson.$extensions?.["org.fdic-ds"]?.stableRuntimeCss === "@jflamb/fdic-ds-tokens/styles.css", "DTCG JSON must declare the stable runtime stylesheet");

  assert(componentsPackage.exports["./styles.css"] === "./styles.css", "components package must export ./styles.css");
  assert(componentsPackage.files.includes("styles.css"), "components package must publish styles.css");
  assert(
    componentsPackage.dependencies["@jflamb/fdic-ds-tokens"] === tokensPackage.version,
    "components package must depend on the published tokens version"
  );
  const importsTokenRuntimeViaRelativePath = componentStyles.includes('@import "../fdic-ds-tokens/styles.css";');
  const importsTokenRuntimeViaPackagePath = componentStyles.includes('@import "@jflamb/fdic-ds-tokens/styles.css";');
  assert(
    importsTokenRuntimeViaRelativePath || importsTokenRuntimeViaPackagePath,
    "components styles.css must import the token runtime stylesheet"
  );

  console.log("Package surfaces are internally consistent.");
}

main();
