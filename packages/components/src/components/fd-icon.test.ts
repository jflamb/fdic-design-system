import { describe, it, expect, beforeEach, vi } from "vitest";
import { iconRegistry } from "../icons/registry.js";
import { expectNoAxeViolations } from "./test-a11y.js";

// Register a test icon before component import
iconRegistry.register(
  "test-icon",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="128" r="96"/></svg>',
);

// Import component (triggers custom element registration)
import "../register/fd-icon.js";
import { FdIcon } from "./fd-icon.js";

async function createIcon(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-icon");
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  document.body.appendChild(el);
  await (el as any).updateComplete;
  return el;
}

describe("fd-icon", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
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
    const el = await createIcon({ name: "test-icon" });

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("fill")).toBe("currentColor");
    expect(svg!.getAttribute("viewBox")).toBe("0 0 256 256");
  });

  it("renders nothing for an unknown icon and logs console.warn", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createIcon({ name: "nonexistent-icon" });

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      '[fd-icon] Unknown icon name: "nonexistent-icon"',
    );

    warnSpy.mockRestore();
  });

  it("renders nothing without warning when no icon name is provided", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const el = await createIcon();

    expect(el.shadowRoot!.querySelector("svg")).toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("is aria-hidden='true' when no label is set", async () => {
    const el = await createIcon({ name: "test-icon" });

    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("has role='img' and aria-label when label is set", async () => {
    const el = await createIcon({
      name: "test-icon",
      label: "Test icon label",
    });

    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Test icon label");
    expect(el.hasAttribute("aria-hidden")).toBe(false);
  });

  it("restores decorative semantics when a label is removed", async () => {
    const el = await createIcon({
      name: "test-icon",
      label: "Temporary label",
    });

    el.removeAttribute("label");
    await (el as any).updateComplete;

    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("has no axe violations in decorative mode", async () => {
    const el = await createIcon({ name: "test-icon" });

    await expectNoAxeViolations(el);
  });

  it("has no axe violations in semantic mode", async () => {
    const el = await createIcon({ name: "test-icon", label: "Warning" });

    await expectNoAxeViolations(el);
  });

  it("exposes a static register method", () => {
    expect(typeof FdIcon.register).toBe("function");
  });

  it("registers icons through the static helper", async () => {
    FdIcon.register(
      "registered-via-helper",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10"/></svg>',
    );

    const el = await createIcon({ name: "registered-via-helper" });

    expect(el.shadowRoot!.querySelector("svg rect")).not.toBeNull();
  });

  it("registers multiple icons from an object map", async () => {
    FdIcon.register({
      "batch-one":
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="3"/></svg>',
      "batch-two":
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" fill="currentColor"><path d="M1 1h6v6H1z"/></svg>',
    });

    const el = await createIcon({ name: "batch-two" });

    expect(el.shadowRoot!.querySelector("svg path")).not.toBeNull();
  });

  it("reflects the provided name attribute on the host", async () => {
    const el = await createIcon({ name: "test-icon" });
    expect(el.getAttribute("name")).toBe("test-icon");
  });

  it("renders the SVG inside the part=svg wrapper", async () => {
    const el = await createIcon({ name: "test-icon" });
    const wrapper = el.shadowRoot!.querySelector('[part="svg"]');

    expect(wrapper?.tagName.toLowerCase()).toBe("span");
    expect(wrapper?.querySelector("svg")).not.toBeNull();
  });

  it("uses token-driven sizing in the component stylesheet", () => {
    const styles = (
      customElements.get("fd-icon") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("inline-size: var(--fd-icon-size, 18px)");
    expect(styles).toContain("block-size: var(--fd-icon-size, 18px)");
  });
});
