import { describe, expect, it } from "vitest";
import { iconRegistry } from "../icons/registry.js";
import "./register-all.js";

describe("register-all", () => {
  it("registers regular icons for default interface use", () => {
    const star = iconRegistry.get("star");
    const caretDown = iconRegistry.get("caret-down");

    expect(star).toBeDefined();
    expect(star).not.toContain('opacity="0.2"');
    expect(caretDown).toContain('stroke="currentColor"');
    expect(caretDown).not.toContain('opacity="0.2"');
  });
});
