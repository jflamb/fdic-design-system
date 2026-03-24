import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-icon.js";
import "../register/fd-visual.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createVisual(
  attrs: Record<string, string> = {},
  innerHTML = "",
) {
  const el = document.createElement("fd-visual") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getSlot(el: any): HTMLSlotElement | null {
  return el.shadowRoot?.querySelector("slot") ?? null;
}

describe("FdVisual", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-visual", () => {
    expect(customElements.get("fd-visual")).toBeDefined();
  });

  it("defaults to a neutral medium decorative visual", async () => {
    const el = await createVisual();
    const surface = el.shadowRoot?.querySelector("[part=surface]");

    expect(el.type).toBe("neutral");
    expect(el.size).toBe("md");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(surface?.className).toContain("type-neutral");
    expect(surface?.className).toContain("size-md");
  });

  it("renders the archive fallback when no slot content is supplied", async () => {
    const el = await createVisual();
    const fallback = el.shadowRoot?.querySelector("[part=fallback]");

    expect(fallback?.querySelector("rect")).toBeTruthy();
    expect(fallback?.querySelector("circle")).toBeNull();
  });

  it("renders the avatar placeholder fallback in avatar mode", async () => {
    const el = await createVisual({ type: "avatar", size: "lg" });
    const surface = el.shadowRoot?.querySelector("[part=surface]");
    const fallback = el.shadowRoot?.querySelector("[part=fallback]");

    expect(surface?.className).toContain("type-avatar");
    expect(surface?.className).toContain("avatar-surface");
    expect(fallback?.querySelector("circle")).toBeTruthy();
  });

  it("hides the fallback when decorative slot content is present", async () => {
    const el = await createVisual({}, '<fd-icon name="download"></fd-icon>');
    const slot = getSlot(el);

    slot?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    expect(slot?.assignedElements()).toHaveLength(1);
    expect(el.shadowRoot?.querySelector("[part=fallback]")).toBeNull();
  });

  it("updates from fallback to slotted content added after connection", async () => {
    const el = await createVisual();
    const icon = document.createElement("fd-icon");
    icon.setAttribute("name", "download");
    el.appendChild(icon);

    getSlot(el)?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector("[part=fallback]")).toBeNull();
  });

  it("normalizes unsupported type and size values to the default rendering", async () => {
    const el = await createVisual({ type: "unknown", size: "huge" });
    const surface = el.shadowRoot?.querySelector("[part=surface]");

    expect(surface?.className).toContain("type-neutral");
    expect(surface?.className).toContain("size-md");
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createVisual({ type: "warm" });
    await expectNoAxeViolations(el);
  });
});
