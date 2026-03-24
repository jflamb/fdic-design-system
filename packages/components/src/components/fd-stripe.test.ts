import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-stripe.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createStripe(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-stripe") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdStripe", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-stripe", () => {
    expect(customElements.get("fd-stripe")).toBeDefined();
  });

  it("defaults to a neutral decorative stripe", async () => {
    const el = await createStripe();
    const stripe = el.shadowRoot?.querySelector("[part=stripe]");

    expect(el.type).toBe("neutral");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(stripe?.className).toContain("type-neutral");
  });

  it("normalizes unsupported tone values to neutral", async () => {
    const el = await createStripe({ type: "alert" });

    expect(el.shadowRoot?.querySelector("[part=stripe]")?.className).toContain(
      "type-neutral",
    );
  });

  it("does not render interactive or slotted content", async () => {
    const el = await createStripe({ type: "warm" });

    expect(el.shadowRoot?.querySelector("button")).toBeNull();
    expect(el.shadowRoot?.querySelector("slot")).toBeNull();
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createStripe({ type: "cool" });
    await expectNoAxeViolations(el);
  });
});
