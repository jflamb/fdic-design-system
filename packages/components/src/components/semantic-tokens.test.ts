import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const semanticCss = readFileSync(
  resolve(process.cwd(), "../tokens/semantic.css"),
  "utf8",
);

describe("semantic tokens", () => {
  it("defines primitive palette values in OKLCH", () => {
    expect(semanticCss).toContain("--ds-color-primary-500: oklch(");
    expect(semanticCss).toContain("--ds-color-neutral-100: oklch(");
    expect(semanticCss).toContain("--ds-color-error-600: oklch(");
  });

  it("keeps dark-mode-sensitive semantic roles on shared tokens", () => {
    expect(semanticCss).toContain("--ds-color-text-disabled: light-dark(");
    expect(semanticCss).toContain("--ds-color-border-subtle: light-dark(");
    expect(semanticCss).toContain("--ds-color-overlay-scrim: light-dark(");
    expect(semanticCss).toContain("--ds-color-effect-shadow: light-dark(");
  });

  it("defines reusable OKLCH-interpolated gradient tokens", () => {
    expect(semanticCss).toContain("--ds-gradient-brand-core: linear-gradient(");
    expect(semanticCss).toContain("135deg in oklch");
    expect(semanticCss).toContain("--ds-gradient-hero-overlay-cool: linear-gradient(");
    expect(semanticCss).toContain("--ds-gradient-glass-button: linear-gradient(");
    expect(semanticCss).toContain("--ds-gradient-glass-sheen: linear-gradient(");
  });
});
