import { describe, expect, it } from "vitest";
import { iconRegistry } from "./registry.js";
// Import triggers auto-registration.
import "./phosphor-regular.js";

describe("phosphor-regular built-in icons", () => {
  it("registers the regular icon set", () => {
    const star = iconRegistry.get("star");
    const outlook = iconRegistry.get("microsoft-outlook-logo");

    expect(star).toBeDefined();
    expect(star).not.toContain('opacity="0.2"');
    expect(outlook).toBeDefined();
    expect(outlook).toContain("M120,128a32,32");
    expect(outlook).not.toContain('opacity="0.2"');
  });

  it("uses stroked carets for interface chrome", () => {
    const caretDown = iconRegistry.get("caret-down");

    expect(caretDown).toBeDefined();
    expect(caretDown).toContain('fill="none"');
    expect(caretDown).toContain('stroke="currentColor"');
    expect(caretDown).not.toContain('opacity="0.2"');
  });
});
