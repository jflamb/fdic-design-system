import { describe, expect, it } from "vitest";
import { iconRegistry } from "./registry.js";
// Import triggers the legacy compatibility entry point.
import "./phosphor-regular.js";

describe("phosphor-regular compatibility entry point", () => {
  it("registers the current duotone icon set", () => {
    const star = iconRegistry.get("star");

    expect(star).toBeDefined();
    expect(star).toContain('opacity="0.2"');
  });
});
