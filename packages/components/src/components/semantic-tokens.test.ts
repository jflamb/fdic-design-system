import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesCss = readFileSync(
  resolve(process.cwd(), "../tokens/styles.css"),
  "utf8",
);
const semanticCssAlias = readFileSync(
  resolve(process.cwd(), "../tokens/semantic.css"),
  "utf8",
);
const tokensJson = readFileSync(
  resolve(process.cwd(), "../tokens/fdic.tokens.json"),
  "utf8",
);

describe("semantic tokens", () => {
  it("ships the stable runtime stylesheet and keeps the legacy semantic entrypoint as an alias", () => {
    expect(stylesCss).toContain("Stable runtime token contract (v1)");
    expect(semanticCssAlias).toContain('@import "./styles.css";');
  });

  it("defines primitive palette values in OKLCH", () => {
    expect(stylesCss).toContain("--fdic-color-primary-500: oklch(");
    expect(stylesCss).toContain("--fdic-color-neutral-100: oklch(");
    expect(stylesCss).toContain("--fdic-color-error-600: oklch(");
  });

  it("keeps dark-mode-sensitive semantic roles on shared tokens", () => {
    expect(stylesCss).toContain("--fdic-color-text-disabled: light-dark(");
    expect(stylesCss).toContain("--fdic-color-border-subtle: light-dark(");
    expect(stylesCss).toContain("--fdic-color-overlay-scrim: light-dark(");
    expect(stylesCss).toContain("--fdic-color-effect-shadow: light-dark(");
  });

  it("defines reusable OKLCH-interpolated gradient tokens", () => {
    expect(stylesCss).toContain("--fdic-gradient-brand-core: linear-gradient(");
    expect(stylesCss).toContain("135deg in oklch");
    expect(stylesCss).toContain("--fdic-gradient-hero-overlay-cool: linear-gradient(");
    expect(stylesCss).toContain("--fdic-gradient-glass-button: linear-gradient(");
    expect(stylesCss).toContain("--fdic-gradient-glass-sheen: linear-gradient(");
  });

  it("publishes non-color foundations in the stable runtime bundle", () => {
    expect(stylesCss).toContain("--fdic-font-size-body: 1.125rem;");
    expect(stylesCss).toContain("--fdic-font-size-body: var(--fdic-font-size-body);");
    expect(stylesCss).toContain("--fdic-spacing-md: 1rem;");
    expect(stylesCss).toContain("--fdic-corner-radius-md: 5px;");
    expect(stylesCss).toContain("--fdic-layout-max-width: 1440px;");
    expect(stylesCss).toContain("--fdic-layout-shell-max-width: 1312px;");
    expect(stylesCss).toContain("--fdic-layout-section-block-padding: 3rem;");
    expect(stylesCss).toContain("--fdic-layout-content-gap: 1.5rem;");
    expect(stylesCss).toContain("--fdic-layout-stack-gap: 1rem;");
    expect(stylesCss).toContain("--fdic-layout-sidebar-width: 18rem;");
    expect(stylesCss).toContain("--fdic-layout-col-2-min: 384px;");
    expect(stylesCss).toContain("--fdic-layout-col-4-max-narrow: 180px;");
    expect(stylesCss).toContain("--fdic-shadow-raised:");
  });

  it("keeps runtime CSS and DTCG output aligned for layout tokens", () => {
    expect(tokensJson).toContain('"section-block-padding"');
    expect(tokensJson).toContain('"content-gap"');
    expect(tokensJson).toContain('"stack-gap"');
    expect(tokensJson).toContain('"sidebar-width"');
    expect(tokensJson).toContain('"paragraph-max-width"');
  });
});
