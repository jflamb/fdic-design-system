import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokenSource } from "./source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const outputs = {
  stylesCss: path.join(repoRoot, "packages/tokens/styles.css"),
  semanticCss: path.join(repoRoot, "packages/tokens/semantic.css"),
  interactionCss: path.join(repoRoot, "packages/tokens/interaction.css"),
  dtcgJson: path.join(repoRoot, "packages/tokens/fdic.tokens.json"),
};

const mode = process.argv.includes("--check") ? "check" : "write";

async function main() {
  const rendered = {
    [outputs.stylesCss]: renderStylesCss(tokenSource),
    [outputs.interactionCss]: renderInteractionCss(tokenSource),
    [outputs.semanticCss]: renderSemanticCssAlias(),
    [outputs.dtcgJson]: renderDtcgJson(tokenSource),
  };

  if (mode === "check") {
    const stale = [];

    for (const [filePath, next] of Object.entries(rendered)) {
      const current = await fs.readFile(filePath, "utf8").catch(() => "");
      if (current !== next) {
        stale.push(path.relative(repoRoot, filePath));
      }
    }

    if (stale.length > 0) {
      console.error("Generated token artifacts are out of date:");
      for (const file of stale) {
        console.error(`- ${file}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log("Token artifacts are up to date.");
    return;
  }

  await Promise.all(
    Object.entries(rendered).map(([filePath, contents]) =>
      fs.writeFile(filePath, contents),
    ),
  );

  console.log(
    [
      outputs.stylesCss,
      outputs.interactionCss,
      outputs.semanticCss,
      outputs.dtcgJson,
    ]
      .map((filePath) => `Generated ${path.relative(repoRoot, filePath)}`)
      .join("\n"),
  );
}

function renderInteractionCss(source) {
  const lines = [
    "/*",
    " * Shared interaction tokens — focus geometry, overlay intensities, motion.",
    " */",
    "",
    ":root {",
    `  --ds-focus-gap-color: ${renderCssReference(source.interaction.focus.color.gap)};`,
    `  --ds-focus-ring-color: ${renderCssReference(source.interaction.focus.color.ring)};`,
    "",
    `  --ds-focus-gap-width: ${source.interaction.focus.width.gap};`,
    `  --ds-focus-ring-width: ${source.interaction.focus.width.ring};`,
    "",
    `  --ds-motion-duration-fast: ${source.interaction.motion.duration.fast};`,
    `  --ds-motion-duration-normal: ${source.interaction.motion.duration.normal};`,
    `  --ds-motion-duration-slow: ${source.interaction.motion.duration.slow};`,
    `  --ds-motion-easing-default: ${source.interaction.motion.easing.default};`,
    "}",
    "",
  ];

  return lines.join("\n");
}

function renderStylesCss(source) {
  const lines = [
    '@import "./interaction.css";',
    "",
    "/*",
    " * FDIC Design System — Stable runtime token contract (v1)",
    " *",
    " * Stable entry point: @jflamb/fdic-ds-tokens/styles.css",
    " *",
    " * This stylesheet publishes the supported runtime custom properties for",
    " * colors, interaction, effects, typography, spacing, radius, and layout.",
    " *",
    " * Consumers should prefer semantic role tokens (--ds-color-[role]-[variant])",
    " * and foundation tokens (--ds-spacing-*, --ds-layout-*, --fdic-font-*).",
    " *",
    " * Dark mode is activated by the active color-scheme and semantic tokens",
    " * use light-dark() so they adapt automatically.",
    " *",
    " * Source: scripts/tokens/source.mjs",
    " */",
    "",
  ];

  for (const registration of source.propertyRegistrations) {
    lines.push(`@property ${registration.name} {`);
    lines.push(`  syntax: "${registration.syntax}";`);
    lines.push(`  inherits: ${registration.inherits ? "true" : "false"};`);
    lines.push(`  initial-value: ${registration.initialValue};`);
    lines.push("}");
    lines.push("");
  }

  lines.push(":root {");
  lines.push(`  color-scheme: ${source.runtime.root.colorScheme};`);
  lines.push(`  accent-color: ${renderCssReference(source.runtime.root.accentColor, true)};`);
  lines.push("");
  lines.push("  /* ===== Primitives ===== */");
  lines.push("");

  for (const [family, tokens] of Object.entries(source.coreColors)) {
    lines.push(`  /* ${labelize(family)} */`);
    for (const [token, value] of Object.entries(tokens)) {
      lines.push(`  ${coreCssVariableName(family, token)}: ${value};`);
    }
    lines.push("");
  }

  lines.push("  /* ===== Semantic tokens ===== */");
  lines.push("");

  for (const [group, tokens] of Object.entries(source.semanticColors)) {
    lines.push(`  /* ${labelize(group)} */`);
    for (const [token, value] of Object.entries(tokens)) {
      lines.push(`  --ds-color-${semanticVariableName(group, token)}: ${renderCssTokenValue(value)};`);
    }
    lines.push("");
  }

  lines.push("  /* Effect */");
  for (const [name, value] of Object.entries(source.cssEffects.shadow)) {
    lines.push(`  --ds-shadow-${name}: ${Array.isArray(value) ? `\n    ${value.join(",\n    ")}` : value};`);
  }
  lines.push("");
  lines.push("  /* Gradient */");
  for (const [name, gradient] of Object.entries(source.cssEffects.gradient)) {
    lines.push(
      `  --ds-gradient-${name}: linear-gradient(\n    ${gradient.angle},\n    ${gradient.stops.join(",\n    ")}\n  );`,
    );
  }

  lines.push("");
  lines.push("  /* ===== Typography ===== */");
  lines.push("");

  lines.push("  /* Font family */");
  for (const [name, value] of Object.entries(source.typography.fontFamily)) {
    lines.push(`  --fdic-font-family-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* Font size */");
  for (const [name, value] of Object.entries(source.typography.fontSize)) {
    lines.push(`  --fdic-font-size-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* Font weight */");
  for (const [name, value] of Object.entries(source.typography.fontWeight)) {
    lines.push(`  --fdic-font-weight-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* Line height */");
  for (const [name, value] of Object.entries(source.typography.lineHeight)) {
    lines.push(`  --fdic-line-height-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* Letter spacing */");
  for (const [name, value] of Object.entries(source.typography.letterSpacing)) {
    lines.push(`  --fdic-letter-spacing-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* Heading padding */");
  for (const [name, value] of Object.entries(source.typography.headingPadding)) {
    lines.push(`  --fdic-heading-padding-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* ===== Spacing ===== */");
  lines.push("");
  for (const [name, value] of Object.entries(source.spacing)) {
    lines.push(`  --ds-spacing-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* ===== Corner radius ===== */");
  lines.push("");
  for (const [name, value] of Object.entries(source.cornerRadius)) {
    lines.push(`  --ds-corner-radius-${name}: ${value};`);
  }
  lines.push("");

  lines.push("  /* ===== Layout ===== */");
  lines.push("");
  for (const [name, value] of Object.entries(source.layout)) {
    lines.push(`  --ds-layout-${name}: ${value};`);
  }

  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function renderSemanticCssAlias() {
  return [
    "/*",
    " * Backward-compatible alias for the stable runtime token bundle.",
    " * Prefer @jflamb/fdic-ds-tokens/styles.css for new integrations.",
    " */",
    "",
    '@import "./styles.css";',
    "",
  ].join("\n");
}

function renderDtcgJson(source) {
  const dtcg = {
    $schema: source.metadata.schema,
    $description: source.metadata.description,
    $extensions: {
      "org.fdic-ds": {
        sources: ["scripts/tokens/source.mjs"],
        notes:
          "Generated from the repo-local token source module; CSS and DTCG artifacts share the same source of truth.",
        stableRuntimeCss: "@jflamb/fdic-ds-tokens/styles.css",
      },
    },
    core: {
      color: {},
    },
    semantic: {
      color: {
        light: {},
        dark: {},
      },
    },
    typography: {
      font: {
        family: {
          $type: "fontFamily",
          sans: { $value: ["Source Sans 3", "Source Sans Pro", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"] },
          mono: { $value: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "Liberation Mono", "monospace"] },
        },
      },
      fontSize: {
        $type: "dimension",
        ...Object.fromEntries(Object.entries(source.typography.fontSize).map(([k, v]) => [k, { $value: parseDimension(v) }])),
      },
      fontWeight: {
        $type: "number",
        ...Object.fromEntries(Object.entries(source.typography.fontWeight).map(([k, v]) => [k, { $value: Number(v) }])),
      },
      lineHeight: {
        $type: "number",
        ...Object.fromEntries(Object.entries(source.typography.lineHeight).map(([k, v]) => [k, { $value: Number(v) }])),
      },
    },
    spacing: {
      $type: "dimension",
      ...Object.fromEntries(Object.entries(source.spacing).filter(([k]) => k !== "none").map(([k, v]) => [k, { $value: parseDimension(v) }])),
    },
    cornerRadius: {
      $type: "dimension",
      ...Object.fromEntries(Object.entries(source.cornerRadius).filter(([k]) => k !== "full").map(([k, v]) => [k, { $value: parseDimension(v) }])),
    },
    layout: {
      $type: "dimension",
      ...Object.fromEntries(
        Object.entries(source.layout)
          .filter(([, value]) => /^-?\d+(?:\.\d+)?(?:px|rem)$/.test(value))
          .map(([key, value]) => [key, { $value: parseDimension(value) }]),
      ),
    },
    interaction: {
      focus: {
        width: {
          $type: "dimension",
          gap: { $value: parseDimension(source.interaction.focus.width.gap) },
          ring: { $value: parseDimension(source.interaction.focus.width.ring) },
        },
        color: {
          $type: "color",
          gap: { $value: resolveDtcgColorValue(source.interaction.focus.color.gap, source) },
          ring: { $value: resolveDtcgColorValue(source.interaction.focus.color.ring, source) },
        },
      },
      motion: {
        duration: {
          $type: "duration",
          fast: { $value: parseDuration(source.interaction.motion.duration.fast) },
          normal: { $value: parseDuration(source.interaction.motion.duration.normal) },
          slow: { $value: parseDuration(source.interaction.motion.duration.slow) },
        },
        easing: {
          default: {
            $type: "cubicBezier",
            $value: cubicBezierForKeyword(source.interaction.motion.easing.default),
          },
        },
      },
    },
  };

  for (const [family, tokens] of Object.entries(source.coreColors)) {
    dtcg.core.color[family] = { $type: "color" };
    for (const [token, value] of Object.entries(tokens)) {
      dtcg.core.color[family][token] = {
        $value: colorObjectFromCss(value),
      };
    }
  }

  for (const [group, tokens] of Object.entries(source.semanticColors)) {
    const lightGroup = { $type: "color" };
    const darkGroup = { $type: "color" };

    for (const [token, value] of Object.entries(tokens)) {
      if (isDualMode(value)) {
        lightGroup[token] = { $value: resolveDtcgColorValue(value.light, source) };
        darkGroup[token] = { $value: resolveDtcgColorValue(value.dark, source) };
      } else {
        const resolved = { $value: resolveDtcgColorValue(value, source) };
        lightGroup[token] = resolved;
        darkGroup[token] = resolved;
      }
    }

    dtcg.semantic.color.light[group] = lightGroup;
    dtcg.semantic.color.dark[group] = darkGroup;
  }

  return `${JSON.stringify(dtcg, null, 2)}\n`;
}

function renderCssTokenValue(value) {
  if (isDualMode(value)) {
    return `light-dark(${renderCssScalar(value.light)}, ${renderCssScalar(value.dark)})`;
  }

  return renderCssScalar(value);
}

function renderCssScalar(value) {
  if (typeof value === "string") {
    return renderCssReference(value);
  }

  if (isRelativeColor(value)) {
    return `oklch(from ${renderCssReference(value.from)} l c h / ${trimNumber(value.alpha)})`;
  }

  throw new Error(`Unsupported CSS token value: ${JSON.stringify(value)}`);
}

function renderCssReference(reference, withFallback = false) {
  if (typeof reference !== "string" || !reference.startsWith("{")) {
    return reference;
  }

  const variableName = cssVariableNameForReference(reference);
  if (!withFallback) {
    return `var(${variableName})`;
  }

  const fallback = referenceToCssValue(reference, tokenSource);
  return `var(${variableName}, ${fallback})`;
}

function cssVariableNameForReference(reference) {
  const path = parseReference(reference);

  if (path[0] === "core" && path[1] === "color") {
    return coreCssVariableName(path[2], path[3]);
  }

  if (path[0] === "semantic" && path[1] === "color") {
    return `--ds-color-${semanticVariableName(path[2], path[3])}`;
  }

  if (path[0] === "interaction" && path[1] === "focus" && path[2] === "color") {
    return path[3] === "gap" ? "--ds-focus-gap-color" : "--ds-focus-ring-color";
  }

  throw new Error(`Unsupported reference: ${reference}`);
}

function referenceToCssValue(reference, source) {
  const path = parseReference(reference);

  if (path[0] === "core" && path[1] === "color") {
    return source.coreColors[path[2]][path[3]];
  }

  if (path[0] === "semantic" && path[1] === "color") {
    const value = source.semanticColors[path[2]][path[3]];
    return renderCssTokenValue(value);
  }

  throw new Error(`Unsupported fallback reference: ${reference}`);
}

function semanticVariableName(group, token) {
  if (group === "background") {
    return `bg-${token}`;
  }
  if (group === "semantic") {
    return `semantic-${token}`;
  }
  return `${group}-${token}`;
}

function coreCssVariableName(family, token) {
  return family === "link" ? `--ds-color-link-${token}` : `--ds-color-${token}`;
}

function labelize(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isDualMode(value) {
  return Boolean(value && typeof value === "object" && "light" in value && "dark" in value);
}

function isRelativeColor(value) {
  return Boolean(value && typeof value === "object" && "from" in value && "alpha" in value);
}

function resolveDtcgColorValue(value, source) {
  if (typeof value === "string") {
    if (value.startsWith("{")) {
      return value;
    }
    return colorObjectFromCss(value);
  }

  if (isRelativeColor(value)) {
    const base = resolveDtcgColorValue(value.from, source);
    if (typeof base === "string") {
      const object = colorObjectForReference(base, source);
      return { ...object, alpha: Number(value.alpha.toFixed(6)) };
    }
    return { ...base, alpha: Number(value.alpha.toFixed(6)) };
  }

  throw new Error(`Unsupported DTCG color value: ${JSON.stringify(value)}`);
}

function colorObjectForReference(reference, source) {
  const path = parseReference(reference);

  if (path[0] === "core" && path[1] === "color") {
    return colorObjectFromCss(source.coreColors[path[2]][path[3]]);
  }

  if (path[0] === "semantic" && path[1] === "color") {
    const value = source.semanticColors[path[2]][path[3]];
    const concrete = isDualMode(value) ? value.light : value;
    return resolveDtcgColorValue(concrete, source);
  }

  throw new Error(`Unsupported color reference for object resolution: ${reference}`);
}

function colorObjectFromCss(value) {
  const oklchMatch = value.match(/^oklch\(([^)]+)\)$/);
  if (oklchMatch) {
    const [componentsText, alphaText] = oklchMatch[1].split("/").map((part) => part.trim());
    const components = componentsText.split(/\s+/).map(Number);
    return alphaText
      ? { colorSpace: "oklch", components, alpha: Number(alphaText) }
      : { colorSpace: "oklch", components };
  }

  throw new Error(`Unsupported color syntax: ${value}`);
}

function parseReference(reference) {
  return reference.slice(1, -1).split(".");
}

function parseDimension(value) {
  const match = value.match(/^(-?\d+(?:\.\d+)?)(px|rem)$/);
  if (!match) {
    throw new Error(`Unsupported dimension: ${value}`);
  }
  return { value: Number(match[1]), unit: match[2] };
}

function parseDuration(value) {
  const match = value.match(/^(-?\d+(?:\.\d+)?)(ms|s)$/);
  if (!match) {
    throw new Error(`Unsupported duration: ${value}`);
  }
  return { value: Number(match[1]), unit: match[2] };
}

function cubicBezierForKeyword(keyword) {
  const mapping = {
    ease: [0.25, 0.1, 0.25, 1],
    linear: [0, 0, 1, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
  };

  if (!(keyword in mapping)) {
    throw new Error(`Unsupported easing keyword: ${keyword}`);
  }

  return mapping[keyword];
}

function trimNumber(value) {
  return Number(value.toFixed(6)).toString();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
