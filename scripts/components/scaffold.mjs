#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  COMPONENT_KINDS,
  apiMetadataPath,
  docsPathFor,
  kebabToPascal,
  repoRoot,
  slugToSourceFile,
  slugToStoryFile,
  storyPathFor,
  writeJson,
  writeText,
} from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));

if (!args.name || !args.kind) {
  console.error(
    "Usage: npm run new:component -- --name account-alert --kind first-class --docs-category actions-navigation --docs-order 10",
  );
  process.exit(1);
}

if (
  (args.kind === COMPONENT_KINDS.FIRST_CLASS ||
    args.kind === COMPONENT_KINDS.SUPPORTING_STANDALONE) &&
  (!args["docs-category"] || !args["docs-order"])
) {
  console.error(
    "Standalone docs components require --docs-category and --docs-order so the docs IA stays explicit.",
  );
  process.exit(1);
}

const slug = args.name.replace(/^fd-/, "");
const tagName = `fd-${slug}`;
const className = `Fd${kebabToPascal(slug)}`;
const docsTitle = args.title ?? kebabToPascal(slug).replace(/([a-z])([A-Z])/g, "$1 $2");
const storyPrefix =
  args.kind === COMPONENT_KINDS.SUPPORTING_STANDALONE
    ? "Supporting Primitives"
    : "Components";

const component = {
  tagName,
  className,
  sourceFile: slugToSourceFile(slug),
  docs:
    args.kind === COMPONENT_KINDS.INTERNAL_ONLY
      ? { kind: args.kind }
      : args.kind === COMPONENT_KINDS.SUPPORTING_EMBEDDED
      ? { kind: args.kind, parentTagName: args.parent }
        : {
            kind: args.kind,
            title: docsTitle,
            slug,
            category: args["docs-category"],
            order: Number(args["docs-order"]),
          },
  storybook:
    args.kind === COMPONENT_KINDS.FIRST_CLASS ||
    args.kind === COMPONENT_KINDS.SUPPORTING_STANDALONE
      ? {
          title: `${storyPrefix}/${docsTitle}`,
          file: slugToStoryFile(slug),
        }
      : null,
  register: {
    exportSubpath:
      args.kind === COMPONENT_KINDS.FIRST_CLASS ||
      args.kind === COMPONENT_KINDS.SUPPORTING_STANDALONE,
    includeInRegisterAll:
      args.kind === COMPONENT_KINDS.FIRST_CLASS ||
      args.kind === COMPONENT_KINDS.SUPPORTING_STANDALONE,
    dependencies: [],
  },
  typeExports: [],
};

const componentPath = path.join(
  repoRoot,
  "packages/components/src/components",
  component.sourceFile,
);
const testPath = path.join(
  repoRoot,
  "packages/components/src/components",
  component.sourceFile.replace(/\.ts$/, ".test.ts"),
);

assertMissing(componentPath);
assertMissing(testPath);

writeText(componentPath, sourceTemplate({ tagName, className, docsTitle }));
writeText(testPath, testTemplate(component));

if (component.storybook) {
  const docsPath = docsPathFor(component);
  const storyPath = storyPathFor(component);

  assertMissing(docsPath);
  assertMissing(storyPath);
  writeText(docsPath, docsTemplate(component));
  writeText(storyPath, storyTemplate(component));
}

appendInventory(component);
appendApiMetadata(tagName);
execFileSync("node", ["scripts/components/sync.mjs"], {
  cwd: repoRoot,
  stdio: "inherit",
});

console.log(`Created ${tagName}.`);
console.log("Next steps:");
console.log("1. Implement the component source and tests.");
console.log("2. Fill in apps/docs content and scripts/components/api-metadata.json.");
console.log("3. Run npm run validate:components before commit.");

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    parsed[value.slice(2)] = argv[index + 1];
    index += 1;
  }

  return parsed;
}

function assertMissing(filePath) {
  if (fs.existsSync(filePath)) {
    console.error(`Refusing to overwrite existing file: ${filePath}`);
    process.exit(1);
  }
}

function appendInventory(newComponent) {
  const inventoryPath = path.join(repoRoot, "scripts/components/inventory.mjs");
  const inventoryText = fs.readFileSync(inventoryPath, "utf8");
  const serializedComponent = `  ${JSON.stringify(newComponent, null, 2)
    .replace(/^/gm, "  ")
    .replace(/"([^"]+)":/g, "$1:")},\n`;

  fs.writeFileSync(
    inventoryPath,
    inventoryText.replace(
      /  \/\/ New component entries are inserted above this line by the scaffold script\./,
      `${serializedComponent}  // New component entries are inserted above this line by the scaffold script.`,
    ),
  );
}

function appendApiMetadata(newTagName) {
  const metadata = JSON.parse(fs.readFileSync(apiMetadataPath, "utf8"));
  metadata[newTagName] = {
    properties: {
      rows: [],
      after: "",
    },
    slots: {
      rows: [],
      after: "",
    },
    events: {
      rows: [],
      after: "",
    },
    cssProperties: {
      rows: [],
      after: "",
    },
    shadowParts: {
      rows: [],
      after: "",
    },
  };
  writeJson(apiMetadataPath, metadata);
}

function sourceTemplate({ tagName: componentTagName, className: componentClassName, docsTitle: componentTitle }) {
  return `import { LitElement, css, html } from "lit";

/**
 * \`${componentTagName}\` — ${componentTitle}.
 *
 * Replace the placeholder implementation with the approved component contract.
 */
export class ${componentClassName} extends LitElement {
  static properties = {};

  static styles = css\`
    :host {
      display: block;
    }
  \`;

  render() {
    return html\`<slot></slot>\`;
  }
}
`;
}

function testTemplate(newComponent) {
  return `import { describe, expect, it } from "vitest";
import "../register/${newComponent.tagName}.js";

describe("${newComponent.className}", () => {
  it("registers ${newComponent.tagName}", () => {
    expect(customElements.get("${newComponent.tagName}")).toBeDefined();
  });
});
`;
}

function storyTemplate(newComponent) {
  return `import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

const meta = {
  title: "${newComponent.storybook.title}",
  tags: ["autodocs"],
  argTypes: {
    ...getComponentArgTypes("${newComponent.tagName}"),
  },
  args: {
    ...getComponentArgs("${newComponent.tagName}"),
  },
  render: () => html\`<${newComponent.tagName}></${newComponent.tagName}>\`,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
`;
}

function docsTemplate(newComponent) {
  return `# ${newComponent.docs.title}

Add component guidance here.

## When to use

- TODO

## When not to use

- TODO

## Examples

<StoryEmbed
  storyId="${newComponent.storybook.title.toLowerCase().replace(/[ /]+/g, "-")}--playground"
  linkStoryId="${newComponent.storybook.title.toLowerCase().replace(/[ /]+/g, "-")}--playground"
  caption="TODO"
/>

## Accessibility

- TODO

## Known limitations

- TODO

## Related components

- TODO
`;
}
