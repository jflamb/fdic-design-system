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

  it.each([
    ["cool"],
    ["warm"],
    ["positive"],
    ["alert"],
  ])("applies the %s tone class", async (type) => {
    const el = await createBadge({ type });
    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(type);
  });

  it("normalizes unsupported tones back to neutral", async () => {
    const el = await createBadge({ type: "unsupported" });
    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(
      "neutral",
    );
  });

  it("does not render an internal button", async () => {
    const el = await createBadge();
    expect(el.shadowRoot?.querySelector("button")).toBeNull();
  });

  it("renders a dedicated label wrapper in the shadow DOM", async () => {
    const el = await createBadge({}, "Escalated review");
    const label = el.shadowRoot?.querySelector("[part=label]");
    const slot = label?.querySelector("slot") as HTMLSlotElement | null;

    expect(label).not.toBeNull();
    expect(slot?.assignedNodes().length).toBeGreaterThan(0);
  });

  it("keeps host semantics presentational by default", async () => {
    const el = await createBadge();
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("reflects the provided type attribute on the host", async () => {
    const el = await createBadge({ type: "positive" });
    expect(el.getAttribute("type")).toBe("positive");
  });

  it("supports multiline content with wrapping styles", () => {
    const styles = (
      customElements.get("fd-badge") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("overflow-wrap: anywhere");
    expect(styles).toContain("word-break: break-word");
  });

  it("includes a forced-colors fallback for the container", () => {
    const styles = (
      customElements.get("fd-badge") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("@media (forced-colors: active)");
    expect(styles).toContain("border: 1px solid ButtonText");
  });

  it("renders the visual shell as a non-interactive span", async () => {
    const el = await createBadge();
    expect(el.shadowRoot?.querySelector("[part=container]")?.tagName.toLowerCase()).toBe("span");
  });

  it("updates the rendered tone class when type changes after connection", async () => {
    const el = await createBadge();

    el.type = "warm";
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(
      "warm",
    );
  });

  it("renders the label shell as a span wrapper", async () => {
    const el = await createBadge();

    expect(el.shadowRoot?.querySelector("[part=label]")?.tagName).toBe("SPAN");
  });

  it("keeps the host inline-flex for authored inline layouts", () => {
    const styles = (
      customElements.get("fd-badge") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain(":host {\n      display: inline-flex;");
    expect(styles).toContain("max-inline-size: 100%;");
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createBadge();
    await expectNoAxeViolations(el);
  });
});
