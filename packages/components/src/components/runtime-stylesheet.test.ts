import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeStylesheet = readFileSync(
  resolve(process.cwd(), "styles.css"),
  "utf8",
);

describe("component runtime stylesheet", () => {
  it("uses a browser-resolvable token import for direct package serving", () => {
    expect(runtimeStylesheet).toContain('@import "../fdic-ds-tokens/styles.css";');
    expect(runtimeStylesheet).not.toContain('@import "@jflamb/fdic-ds-tokens/styles.css";');
  });

  it("includes a section-header composition scope that neutralizes prose heading rhythm", () => {
    expect(runtimeStylesheet).toContain(".fdic-section-header");
    expect(runtimeStylesheet).toContain(".fdic-section-header :where(h1, h2, h3, h4, h5, h6, p)");
    expect(runtimeStylesheet).toContain("margin-block: 0");
    expect(runtimeStylesheet).toContain("padding-block: 0");
  });
});
