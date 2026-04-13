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
});
