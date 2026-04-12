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

describe("semantic tokens", () => {
  it("ships the stable runtime stylesheet and keeps the legacy semantic entrypoint as an alias", () => {
    expect(stylesCss).toContain("Stable runtime token contract (v1)");
    expect(semanticCssAlias).toContain('@import "./styles.css";');
  });

  it("defines primitive palette values in OKLCH", () => {
    expect(stylesCss).toContain("--ds-color-primary-500: oklch(");
    expect(stylesCss).toContain("--ds-color-neutral-100: oklch(");
    expect(stylesCss).toContain("--ds-color-error-600: oklch(");
  });

  it("keeps dark-mode-sensitive semantic roles on shared tokens", () => {
    expect(stylesCss).toContain("--ds-color-text-disabled: light-dark(");
    expect(stylesCss).toContain("--ds-color-border-subtle: light-dark(");
    expect(stylesCss).toContain("--ds-color-overlay-scrim: light-dark(");
    expect(stylesCss).toContain("--ds-color-effect-shadow: light-dark(");
  });

  it("defines reusable OKLCH-interpolated gradient tokens", () => {
    expect(stylesCss).toContain("--ds-gradient-brand-core: linear-gradient(");
    expect(stylesCss).toContain("135deg in oklch");
    expect(stylesCss).toContain("--ds-gradient-hero-overlay-cool: linear-gradient(");
    expect(stylesCss).toContain("--ds-gradient-glass-button: linear-gradient(");
    expect(stylesCss).toContain("--ds-gradient-glass-sheen: linear-gradient(");
  });

  it("publishes non-color foundations in the stable runtime bundle", () => {
    expect(stylesCss).toContain("--fdic-font-size-body: 1.125rem;");
    expect(stylesCss).toContain("--ds-spacing-md: 1rem;");
    expect(stylesCss).toContain("--ds-corner-radius-md: 5px;");
    expect(stylesCss).toContain("--ds-layout-max-width: 1440px;");
    expect(stylesCss).toContain("--ds-shadow-raised:");
  });
});
