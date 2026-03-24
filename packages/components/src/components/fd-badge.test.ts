import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-badge.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createBadge(
  attrs: Record<string, string> = {},
  label = "Status label",
) {
  const el = document.createElement("fd-badge") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = label;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdBadge", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-badge", () => {
    expect(customElements.get("fd-badge")).toBeDefined();
  });

  it("defaults to neutral styling", async () => {
    const el = await createBadge();
    expect(el.type).toBe("neutral");
    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(
      "neutral",
    );
  });

  it("renders slotted text content", async () => {
    const el = await createBadge({}, "Small business");
    expect(el.textContent?.trim()).toBe("Small business");
  });

  it("does not render an internal button", async () => {
    const el = await createBadge();
    expect(el.shadowRoot?.querySelector("button")).toBeNull();
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createBadge();
    await expectNoAxeViolations(el);
  });
});
