import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  componentInventory,
  publicComponentInventory,
  registerAllComponents,
  registerExportComponents,
  standaloneDocComponents,
  symbolExportComponents,
  COMPONENT_KINDS,
} from "./inventory.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, "../..");
export const componentsRoot = path.join(
  repoRoot,
  "packages/components/src/components",
);
export const registerRoot = path.join(repoRoot, "packages/components/src/register");
export const storybookGeneratedPath = path.join(
  repoRoot,
  "apps/storybook/src/generated/component-arg-types.ts",
);
export const docsNavGeneratedPath = path.join(
  repoRoot,
  "apps/docs/.vitepress/generated/component-navigation.ts",
);
export const componentIndexPath = path.join(
  repoRoot,
  "apps/docs/components/index.md",
);
export const docsConfigPath = path.join(repoRoot, "apps/docs/.vitepress/config.ts");
export const componentsPackagePath = path.join(
  repoRoot,
  "packages/components/package.json",
);
export const componentsIndexPath = path.join(
  repoRoot,
  "packages/components/src/index.ts",
);
export const tsupConfigPath = path.join(
  repoRoot,
  "packages/components/tsup.config.ts",
);
export const apiMetadataPath = path.join(
  repoRoot,
  "scripts/components/api-metadata.json",
);

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value);
}

export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

export function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function componentSourcePath(component) {
  return path.join(componentsRoot, component.sourceFile);
}

export function componentSourceText(component) {
  return readText(componentSourcePath(component));
}

export function kebabToPascal(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function kebabToCamel(value) {
  const pascal = kebabToPascal(value);
  return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : value;
}

export function slugToStoryFile(slug) {
  return `fd-${slug}.stories.ts`;
}

export function slugToSourceFile(slug) {
  return `fd-${slug}.ts`;
}

export function docsPathFor(component) {
  return component.docs.slug
    ? path.join(repoRoot, `apps/docs/components/${component.docs.slug}.md`)
    : null;
}

export function storyPathFor(component) {
  return component.storybook
    ? path.join(repoRoot, `apps/storybook/src/${component.storybook.file}`)
    : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractDeclaredPropertyType(sourceText, propertyName) {
  const typeMatch = sourceText.match(
    new RegExp(`declare\\s+${escapeRegExp(propertyName)}:\\s*([^;]+);`),
  );

  return typeMatch?.[1]?.trim() ?? null;
}

export function extractConstructorDefault(sourceText, propertyName) {
  const defaultMatch = sourceText.match(
    new RegExp(`this\\.${escapeRegExp(propertyName)}\\s*=\\s*([^;]+);`),
  );

  if (!defaultMatch) return null;

  return normalizeLiteral(defaultMatch[1].trim());
}

function normalizeLiteral(value) {
  if (value === "undefined") return undefined;
  if (value === "null") return null;
  if (value === "true") return true;
  if (value === "false") return false;

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return JSON.parse(
      value
        .replace(/^'/, '"')
        .replace(/'$/, '"')
        .replace(/\\"/g, '\\"'),
    );
  }

  return value;
}

export function extractStaticProperties(sourceText) {
  const blockMatch = sourceText.match(
    /static\s+properties\s*=\s*{([\s\S]*?)};\n/s,
  );

  if (!blockMatch) return [];

  const block = blockMatch[1];
  const propertyPattern = /^\s*([A-Za-z0-9_]+):\s*{([^}]*)},?/gm;
  const properties = [];

  for (const match of block.matchAll(propertyPattern)) {
    const [, name, configText] = match;
    const typeMatch = configText.match(/type:\s*([A-Za-z0-9_]+)/);
    properties.push({
      name,
      reflected: /reflect:\s*true/.test(configText),
      declaredType: extractDeclaredPropertyType(sourceText, name),
      runtimeType: typeMatch?.[1] ?? null,
      defaultValue: extractConstructorDefault(sourceText, name),
      internal: name.startsWith("_"),
    });
  }

  return properties;
}

export function extractSlotNames(sourceText) {
  const slots = new Set();

  for (const match of sourceText.matchAll(/<slot(?:\s+name="([^"]+)")?/g)) {
    slots.add(match[1] ?? "default");
  }

  return [...slots];
}

export function extractEventNames(sourceText) {
  const events = new Set();

  for (const match of sourceText.matchAll(/new\s+CustomEvent(?:<[^>]+>)?\("([^"]+)"/g)) {
    events.add(match[1]);
  }

  return [...events];
}

export function extractCssPropertyNames(sourceText) {
  const properties = new Set();

  for (const match of sourceText.matchAll(/--fd-[a-z0-9-]+/g)) {
    properties.add(match[0]);
  }

  return [...properties];
}

export function extractShadowPartNames(sourceText) {
  const parts = new Set();

  for (const match of sourceText.matchAll(/part="([^"]+)"/g)) {
    for (const part of match[1].split(/\s+/)) {
      if (part) parts.add(part);
    }
  }

  return [...parts];
}

export function inferStorybookControl(typeValue) {
  if (!typeValue) {
    return { control: "text" };
  }

  const normalized = typeValue
    .replace(/`/g, "")
    .replace(/\\\|/g, "|")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized === "boolean") {
    return { control: "boolean" };
  }

  if (normalized === "number") {
    return { control: "number" };
  }

  const literalOptions = normalized
    .split("|")
    .map((part) => part.trim())
    .filter((part) => /^".+"$/.test(part))
    .map((part) => part.slice(1, -1));

  if (literalOptions.length > 0) {
    return {
      control: "select",
      options: literalOptions,
    };
  }

  return { control: "text" };
}

export function loadApiMetadata() {
  return readJson(apiMetadataPath);
}

export function isDocComponent(component) {
  return standaloneDocComponents.includes(component);
}

export function isFirstClassComponent(component) {
  return component.docs.kind === COMPONENT_KINDS.FIRST_CLASS;
}

export {
  COMPONENT_KINDS,
  componentInventory,
  publicComponentInventory,
  registerAllComponents,
  registerExportComponents,
  standaloneDocComponents,
  symbolExportComponents,
};
