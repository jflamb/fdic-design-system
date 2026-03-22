import { describe, it, expect, beforeEach, vi } from "vitest";
import { iconRegistry } from "../icons/registry.js";

// Register a test icon before component import
iconRegistry.register(
  "test-icon",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="128" r="96"/></svg>',
);

// Import component (triggers custom element registration)
import "./fd-icon.js";
import { FdIcon } from "./fd-icon.js";

describe("fd-icon", () => {
  beforeEach(() => {
    // Re-register the test icon in case a test cleared the registry
    iconRegistry.register(
      "test-icon",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="128" r="96"/></svg>',
    );
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-icon")).toBe(FdIcon);
  });

  it("renders SVG for a registered icon", async () => {
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "test-icon");
    document.body.appendChild(el);
    await (el as any).updateComplete;

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("fill")).toBe("currentColor");

    document.body.removeChild(el);
  });

  it("renders nothing for an unknown icon and logs console.warn", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = document.createElement("fd-icon");
    el.setAttribute("name", "nonexistent-icon");
    document.body.appendChild(el);
    await (el as any).updateComplete;

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      '[fd-icon] Unknown icon name: "nonexistent-icon"',
    );

    warnSpy.mockRestore();
    document.body.removeChild(el);
  });

  it("is aria-hidden='true' when no label is set", async () => {
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "test-icon");
    document.body.appendChild(el);
    await (el as any).updateComplete;

    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);

    document.body.removeChild(el);
  });

  it("has role='img' and aria-label when label is set", async () => {
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "test-icon");
    el.setAttribute("label", "Test icon label");
    document.body.appendChild(el);
    await (el as any).updateComplete;

    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Test icon label");
    expect(el.hasAttribute("aria-hidden")).toBe(false);

    document.body.removeChild(el);
  });

  it("exposes a static register method", () => {
    expect(typeof FdIcon.register).toBe("function");
  });
});
