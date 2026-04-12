#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const referencePath = "apps/docs/guide/cms-filing-reference.md";

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractFencedCodeBlocks(markdown) {
  return [...markdown.matchAll(/```[a-zA-Z0-9-]*\n([\s\S]*?)```/g)].map((match) => match[1]);
}

function collectPublishedTokenNames() {
  const css = read("packages/tokens/styles.css");
  const names = new Set();

  for (const match of css.matchAll(/--fdic-[a-z0-9-]+/g)) {
    const token = match[0];
    if (!token.endsWith("-")) {
      names.add(token);
    }
  }

  return names;
}

function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function validateImports(markdown, errors) {
  for (const block of extractFencedCodeBlocks(markdown)) {
    const importMatches = [
      ...block.matchAll(/import\s+[^"'`\n]*?from\s+["']([^"']+)["']/g),
      ...block.matchAll(/import\s+["']([^"']+)["']/g),
      ...block.matchAll(/@import\s+["']([^"']+)["']/g),
    ];

    for (const match of importMatches) {
      const specifier = match[1];
      if (!specifier.includes("fdic-ds")) continue;

      assert(
        specifier.startsWith("@jflamb/fdic-ds-components") ||
          specifier.startsWith("@jflamb/fdic-ds-tokens"),
        `${referencePath}: unsupported import in downstream reference: ${specifier}`,
        errors,
      );
    }
  }
}

function validateTokens(markdown, publishedTokenNames, errors) {
  for (const match of markdown.matchAll(/--fdic-[a-z0-9-]+/g)) {
    const token = match[0];
    if (token.endsWith("-")) continue;

    assert(
      publishedTokenNames.has(token),
      `${referencePath}: unsupported published token reference: ${token}`,
      errors,
    );
  }

  for (const match of markdown.matchAll(/--fd-(?!ic-)[a-z0-9-]+/g)) {
    assert(
      false,
      `${referencePath}: downstream reference must not rely on component-private token hooks: ${match[0]}`,
      errors,
    );
  }
}

function validateFormContract(markdown, errors) {
  assert(
    !/<fd-button[^>]+type="submit"/.test(markdown),
    `${referencePath}: must not use fd-button as a submit control`,
    errors,
  );

  assert(
    !/<fd-button[^>]+type="reset"/.test(markdown),
    `${referencePath}: must not use fd-button as a reset control`,
    errors,
  );

  for (const forbidden of ['slot="label"', 'slot="input"', 'slot="message"']) {
    assert(
      !markdown.includes(forbidden),
      `${referencePath}: must not use unsupported fd-field slot composition: ${forbidden}`,
      errors,
    );
  }

  const fieldBlocks = markdown.match(/<fd-field>[\s\S]*?<\/fd-field>/g) ?? [];

  for (const block of fieldBlocks) {
    assert(
      !/<\s*(div|section|article|aside|fieldset|p|label|input|textarea)\b/i.test(block),
      `${referencePath}: fd-field example must keep direct-child composition without wrapper elements`,
      errors,
    );

    assert(
      /<fd-label\b[\s\S]*<fd-(input|textarea)\b[\s\S]*<fd-message\b/.test(block),
      `${referencePath}: each fd-field example must show the supported label + text-entry control + message composition`,
      errors,
    );
  }

  assert(
    markdown.includes('type="submit"'),
    `${referencePath}: downstream reference must show a native submit button`,
    errors,
  );
}

function main() {
  const markdown = read(referencePath);
  const publishedTokenNames = collectPublishedTokenNames();
  const errors = [];

  validateImports(markdown, errors);
  validateTokens(markdown, publishedTokenNames, errors);
  validateFormContract(markdown, errors);

  if (errors.length > 0) {
    console.error("\nDownstream reference validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Downstream reference validation passed.");
}

main();
