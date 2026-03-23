import { describe, it, expect } from "vitest";
import { iconRegistry } from "./registry.js";
// Import triggers auto-registration
import "./phosphor-regular.js";

describe("phosphor-regular built-in icons", () => {
  const expectedIcons = [
    "arrow-square-out",
    "caret-down",
    "caret-left",
    "caret-right",
    "caret-up",
    "check",
    "check-square",
    "download",
    "eye",
    "eye-slash",
    "info",
    "magnifying-glass",
    "minus",
    "minus-square",
    "pencil",
    "plus",
    "square",
    "spinner-gap",
    "star",
    "trash",
    "upload",
    "warning",
    "warning-circle",
    "warning-octagon",
    "x",
  ];

  it("all expected icons are registered after import", () => {
    const registered = iconRegistry.names();
    for (const name of expectedIcons) {
      expect(registered, `expected icon "${name}" to be registered`).toContain(
        name,
      );
    }
    expect(registered).toHaveLength(expectedIcons.length);
  });

  it('each icon SVG contains <svg, viewBox, and fill="currentColor"', () => {
    for (const name of expectedIcons) {
      const svg = iconRegistry.get(name);
      expect(svg, `icon "${name}" should be registered`).toBeDefined();
      expect(svg, `icon "${name}" should contain <svg`).toContain("<svg");
      expect(svg, `icon "${name}" should contain viewBox`).toContain(
        "viewBox",
      );
      expect(
        svg,
        `icon "${name}" should contain fill="currentColor"`,
      ).toContain('fill="currentColor"');
    }
  });
});
