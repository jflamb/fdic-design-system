#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const targetedDocs = [
  "apps/docs/components/button.md",
  "apps/docs/components/checkbox.md",
  "apps/docs/components/chip.md",
  "apps/docs/components/file-input.md",
  "apps/docs/guide/getting-started.md",
  "apps/docs/guide/form-workflows.md",
  "apps/docs/guide/using-tokens.md",
  "apps/docs/guide/cms-integration.md",
  "apps/docs/guide/browser-support.md",
  "apps/docs/guide/choosing-a-component.md",
  "apps/docs/guide/index.md",
  "apps/docs/guide/foundations/index.md",
  "apps/docs/components/global-header.md",
  "apps/docs/components/input.md",
  "apps/docs/components/link.md",
  "apps/docs/components/pagination.md",
  "apps/docs/components/radio.md",
  "apps/docs/components/selector.md",
  "apps/docs/components/slider.md",
  "apps/docs/components/textarea.md",
  "apps/docs/components/field.md",
  "apps/docs/guide/cms-filing-reference.md",
];

const storybookFiles = [
  "apps/storybook/src/fd-button.stories.ts",
  "apps/storybook/src/fd-checkbox.stories.ts",
  "apps/storybook/src/fd-checkbox-group.stories.ts",
  "apps/storybook/src/fd-input.stories.ts",
  "apps/storybook/src/fd-radio.stories.ts",
  "apps/storybook/src/fd-radio-group.stories.ts",
  "apps/storybook/src/fd-selector.stories.ts",
  "apps/storybook/src/fd-textarea.stories.ts",
];

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
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

function validateDocImports(relativePath, markdown, errors) {
  const codeBlocks = extractFencedCodeBlocks(markdown);

  for (const block of codeBlocks) {
    const importMatches = [
      ...block.matchAll(/import\s+[^"'`\n]*?from\s+["']([^"']+)["']/g),
      ...block.matchAll(/import\s+["']([^"']+)["']/g),
    ];

    for (const match of importMatches) {
      const specifier = match[1];
      if (!specifier.includes("fdic-ds")) continue;

      const isAllowedPublicSpecifier =
        specifier.startsWith("@jflamb/fdic-ds-components") ||
        specifier.startsWith("@jflamb/fdic-ds-tokens");

      assert(
        isAllowedPublicSpecifier,
        `${relativePath}: unsupported package import in docs snippet: ${specifier}`,
        errors,
      );
    }
  }
}

function validateDocTokens(relativePath, markdown, publishedTokenNames, errors) {
  for (const match of markdown.matchAll(/--fdic-[a-z0-9-]+/g)) {
    const token = match[0];
    if (token.endsWith("-")) continue;

    assert(
      publishedTokenNames.has(token),
      `${relativePath}: unsupported token reference in docs content: ${token}`,
      errors,
    );
  }
}

function validateConsumerContractLanguage(relativePath, markdown, errors) {
  assert(
    !markdown.includes("WCAG 2.1 AA"),
    `${relativePath}: stale WCAG 2.1 AA language remains in consumer-facing docs`,
    errors,
  );

  assert(
    !markdown.includes("@fdic-ds/react"),
    `${relativePath}: consumer-facing docs must not reference the private React workspace`,
    errors,
  );
}

function validateFormRecipe(errors) {
  const formWorkflows = read("apps/docs/guide/form-workflows.md");

  for (const forbidden of ['slot="label"', 'slot="input"', 'slot="message"']) {
    assert(
      !formWorkflows.includes(forbidden),
      `apps/docs/guide/form-workflows.md: unsupported fd-field slot usage remains in the minimum viable form: ${forbidden}`,
      errors,
    );
  }

  assert(
    !/<fd-button[^>]+type="submit"/.test(formWorkflows),
    "apps/docs/guide/form-workflows.md: fd-button submit usage remains in the public form recipe",
    errors,
  );

  assert(
    formWorkflows.includes("native `<button type=\"submit\">`"),
    "apps/docs/guide/form-workflows.md: canonical guidance must explicitly keep submit behavior on native HTML buttons",
    errors,
  );

  assert(
    !formWorkflows.includes("native `<button type=\"reset\">`"),
    "apps/docs/guide/form-workflows.md: canonical guidance must not endorse reset buttons in the recommended form path",
    errors,
  );
}

function validateStorybookFormStories(errors) {
  for (const relativePath of storybookFiles) {
    const source = read(relativePath);

    assert(
      !/<fd-button[^>]+type="submit"/.test(source),
      `${relativePath}: public Storybook story still uses unsupported fd-button submit behavior`,
      errors,
    );

    assert(
      !/<fd-button[^>]+type="reset"/.test(source),
      `${relativePath}: public Storybook story still uses unsupported fd-button reset behavior`,
      errors,
    );
  }
}

function validateFieldContractGuidance(errors) {
  const choosing = read("apps/docs/guide/choosing-a-component.md");
  const checkbox = read("apps/docs/components/checkbox.md");
  const slider = read("apps/docs/components/slider.md");
  const field = read("apps/docs/components/field.md");
  const formField = read("apps/docs/components/form-field.md");
  const accessibility = read("apps/docs/guide/accessibility.md");

  assert(
    !choosing.includes("Almost every form field should be wrapped in `fd-field`"),
    "apps/docs/guide/choosing-a-component.md: must not present fd-field as the default wrapper for almost every form field",
    errors,
  );

  assert(
    !checkbox.includes("Wrap in fd-field"),
    "apps/docs/components/checkbox.md: standalone checkbox guidance must not route consumers through fd-field",
    errors,
  );

  assert(
    !slider.includes("Wrap in fd-field"),
    "apps/docs/components/slider.md: slider guidance must not route consumers through fd-field",
    errors,
  );

  assert(
    field.includes("Server-rendered or CMS-rendered text-entry markup"),
    "apps/docs/components/field.md: fd-field guidance must explain the authored-markup/server-rendered text-entry use case",
    errors,
  );

  assert(
    formField.includes("default wrapper-based field-shell primitive"),
    "apps/docs/components/form-field.md: fd-form-field guidance must identify the default wrapper-based contract for new work",
    errors,
  );

  assert(
    accessibility.includes("component-level automated tests disable axe-core's `color-contrast` rule"),
    "apps/docs/guide/accessibility.md: accessibility guidance must disclose the current automated contrast-validation boundary",
    errors,
  );
}

function main() {
  const errors = [];
  const publishedTokenNames = collectPublishedTokenNames();

  for (const relativePath of targetedDocs) {
    const markdown = read(relativePath);
    validateDocImports(relativePath, markdown, errors);
    validateDocTokens(relativePath, markdown, publishedTokenNames, errors);
    validateConsumerContractLanguage(relativePath, markdown, errors);
  }

  validateFormRecipe(errors);
  validateStorybookFormStories(errors);
  validateFieldContractGuidance(errors);

  if (errors.length > 0) {
    console.error("\nDocs contract validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Docs contract validation passed.");
}

main();
