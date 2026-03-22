import { describe, it, expect, beforeEach, vi } from "vitest";
import { computePlacement } from "./placement.js";
import type { Placement } from "./placement.js";

/**
 * Create a mock element with a fixed bounding rect.
 */
function mockElement(rect: Partial<DOMRect>): Element {
  const defaults = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) };
  const full = { ...defaults, ...rect };
  return {
    getBoundingClientRect: () => full,
  } as unknown as Element;
}

describe("computePlacement", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollX", { value: 0, writable: true });
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
  });

  it("positions bottom-start: below anchor, left-aligned", () => {
    const anchor = mockElement({ top: 100, left: 50, right: 150, bottom: 140, width: 100, height: 40 });
    const surface = mockElement({ width: 200, height: 120, top: 0, left: 0, right: 200, bottom: 120 });

    const result = computePlacement(anchor, surface, "bottom-start");

    expect(result.top).toBe(140);
    expect(result.left).toBe(50);
    expect(result.placement).toBe("bottom-start");
  });

  it("positions bottom-end: below anchor, right-aligned", () => {
    const anchor = mockElement({ top: 100, left: 200, right: 400, bottom: 140, width: 200, height: 40 });
    const surface = mockElement({ width: 180, height: 120, top: 0, left: 0, right: 180, bottom: 120 });

    const result = computePlacement(anchor, surface, "bottom-end");

    expect(result.top).toBe(140);
    expect(result.left).toBe(400 - 180); // right-aligned
    expect(result.placement).toBe("bottom-end");
  });

  it("positions top-start: above anchor, left-aligned", () => {
    const anchor = mockElement({ top: 300, left: 50, right: 150, bottom: 340, width: 100, height: 40 });
    const surface = mockElement({ width: 200, height: 120, top: 0, left: 0, right: 200, bottom: 120 });

    const result = computePlacement(anchor, surface, "top-start");

    expect(result.top).toBe(300 - 120);
    expect(result.left).toBe(50);
    expect(result.placement).toBe("top-start");
  });

  it("positions top-end: above anchor, right-aligned", () => {
    const anchor = mockElement({ top: 300, left: 200, right: 400, bottom: 340, width: 200, height: 40 });
    const surface = mockElement({ width: 180, height: 120, top: 0, left: 0, right: 180, bottom: 120 });

    const result = computePlacement(anchor, surface, "top-end");

    expect(result.top).toBe(300 - 120);
    expect(result.left).toBe(400 - 180);
    expect(result.placement).toBe("top-end");
  });

  it("flips bottom to top when menu would overflow viewport bottom", () => {
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
    // Anchor near bottom of viewport
    const anchor = mockElement({ top: 700, left: 50, right: 150, bottom: 740, width: 100, height: 40 });
    const surface = mockElement({ width: 200, height: 120, top: 0, left: 0, right: 200, bottom: 120 });

    const result = computePlacement(anchor, surface, "bottom-start");

    // Should flip to top since 740 + 120 > 800
    expect(result.top).toBe(700 - 120);
    expect(result.left).toBe(50);
    expect(result.placement).toBe("top-start");
  });

  it("flips top to bottom when menu would overflow viewport top", () => {
    // Anchor near top of viewport
    const anchor = mockElement({ top: 50, left: 50, right: 150, bottom: 90, width: 100, height: 40 });
    const surface = mockElement({ width: 200, height: 120, top: 0, left: 0, right: 200, bottom: 120 });

    const result = computePlacement(anchor, surface, "top-start");

    // Should flip to bottom since 50 - 120 < 0
    expect(result.top).toBe(90);
    expect(result.left).toBe(50);
    expect(result.placement).toBe("bottom-start");
  });

  it("keeps bottom when flip to top would also overflow", () => {
    Object.defineProperty(window, "innerHeight", { value: 200, writable: true });
    // Small viewport, anchor in middle — neither side fits but bottom was preferred
    const anchor = mockElement({ top: 80, left: 50, right: 150, bottom: 120, width: 100, height: 40 });
    const surface = mockElement({ width: 200, height: 150, top: 0, left: 0, right: 200, bottom: 150 });

    const result = computePlacement(anchor, surface, "bottom-start");

    // 120 + 150 > 200 (overflows bottom), but 80 - 150 < 0 (also overflows top)
    // Stays bottom (no flip since top candidate < 0)
    expect(result.top).toBe(120);
    expect(result.placement).toBe("bottom-start");
  });

  it("accounts for scroll position", () => {
    Object.defineProperty(window, "scrollX", { value: 100, writable: true });
    Object.defineProperty(window, "scrollY", { value: 200, writable: true });

    const anchor = mockElement({ top: 100, left: 50, right: 150, bottom: 140, width: 100, height: 40 });
    const surface = mockElement({ width: 200, height: 120, top: 0, left: 0, right: 200, bottom: 120 });

    const result = computePlacement(anchor, surface, "bottom-start");

    expect(result.top).toBe(140 + 200); // bottom + scrollY
    expect(result.left).toBe(50 + 100); // left + scrollX
  });

  it("preserves end alignment when flipping", () => {
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
    const anchor = mockElement({ top: 700, left: 200, right: 400, bottom: 740, width: 200, height: 40 });
    const surface = mockElement({ width: 180, height: 120, top: 0, left: 0, right: 180, bottom: 120 });

    const result = computePlacement(anchor, surface, "bottom-end");

    expect(result.left).toBe(400 - 180); // end alignment preserved
    expect(result.placement).toBe("top-end"); // flipped to top
  });
});
