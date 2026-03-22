import { describe, it, expect, beforeEach } from "vitest";
import { iconRegistry } from "./registry.js";

describe("iconRegistry", () => {
  beforeEach(() => {
    iconRegistry.clear();
  });

  it("registers and retrieves a single icon", () => {
    const svg = '<svg viewBox="0 0 256 256"><path d="M0 0"/></svg>';
    iconRegistry.register("test-icon", svg);
    expect(iconRegistry.get("test-icon")).toBe(svg);
  });

  it("registers icons in batch via a Record", () => {
    const icons = {
      alpha: '<svg viewBox="0 0 256 256"><circle r="10"/></svg>',
      beta: '<svg viewBox="0 0 256 256"><rect width="10" height="10"/></svg>',
    };
    iconRegistry.register(icons);
    expect(iconRegistry.get("alpha")).toBe(icons.alpha);
    expect(iconRegistry.get("beta")).toBe(icons.beta);
  });

  it("returns undefined for an unknown icon", () => {
    expect(iconRegistry.get("nonexistent")).toBeUndefined();
  });

  it("overwrites on re-register", () => {
    iconRegistry.register("icon", "<svg>first</svg>");
    iconRegistry.register("icon", "<svg>second</svg>");
    expect(iconRegistry.get("icon")).toBe("<svg>second</svg>");
  });

  it("strips <script> tags from registered SVGs", () => {
    const dirty =
      '<svg><script>alert("xss")</script><path d="M0 0"/></svg>';
    iconRegistry.register("scripted", dirty);
    const result = iconRegistry.get("scripted")!;
    expect(result).not.toContain("<script");
    expect(result).not.toContain("</script>");
    expect(result).toContain('<path d="M0 0"/>');
  });

  it("strips on* event handler attributes from registered SVGs", () => {
    const dirty =
      '<svg onclick="alert(1)" onload="alert(2)"><path d="M0 0" onmouseover="alert(3)"/></svg>';
    iconRegistry.register("handlers", dirty);
    const result = iconRegistry.get("handlers")!;
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onload");
    expect(result).not.toContain("onmouseover");
    expect(result).toContain('<path d="M0 0"/>');
  });

  it("names() returns a sorted list of registered icon names", () => {
    iconRegistry.register("zebra", "<svg/>");
    iconRegistry.register("alpha", "<svg/>");
    iconRegistry.register("middle", "<svg/>");
    expect(iconRegistry.names()).toEqual(["alpha", "middle", "zebra"]);
  });

  it("clear() removes all icons", () => {
    iconRegistry.register("a", "<svg/>");
    iconRegistry.register("b", "<svg/>");
    iconRegistry.clear();
    expect(iconRegistry.names()).toEqual([]);
    expect(iconRegistry.get("a")).toBeUndefined();
  });
});
