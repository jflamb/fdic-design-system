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

  it("applies the cool tone class", async () => {
    const el = await createStripe({ type: "cool" });

    expect(el.shadowRoot?.querySelector("[part=stripe]")?.className).toContain(
      "type-cool",
    );
  });

  it("applies the warm tone class", async () => {
    const el = await createStripe({ type: "warm" });

    expect(el.shadowRoot?.querySelector("[part=stripe]")?.className).toContain(
      "type-warm",
    );
  });

  it("renders the decorative stripe as a span", async () => {
    const el = await createStripe();

    expect(el.shadowRoot?.querySelector("[part=stripe]")?.tagName).toBe("SPAN");
  });

  it("keeps host semantics decorative only", async () => {
    const el = await createStripe();

    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("role")).toBe(false);
  });

  it("updates the rendered tone when type changes after connection", async () => {
    const el = await createStripe();

    el.type = "warm";
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector("[part=stripe]")?.className).toContain(
      "type-warm",
    );
  });

  it("keeps the host block-level for layout usage", () => {
    const styles = (
      customElements.get("fd-stripe") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain(":host {\n      display: block;");
    expect(styles).toContain("line-height: 0;");
  });

  it("defines sizing tokens for width and height", () => {
    const styles = (
      customElements.get("fd-stripe") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("var(--fd-stripe-width, 80px)");
    expect(styles).toContain("var(--fd-stripe-height, 4px)");
  });

  it("includes a forced-colors fallback for the stripe", () => {
    const styles = (
      customElements.get("fd-stripe") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("@media (forced-colors: active)");
    expect(styles).toContain("background: CanvasText;");
  });

  it("does not expose an accessible name", async () => {
    const el = await createStripe();

    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("reflects the provided type attribute on the host", async () => {
    const el = await createStripe({ type: "cool" });

    expect(el.getAttribute("type")).toBe("cool");
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createStripe({ type: "cool" });
    await expectNoAxeViolations(el);
  });
});
