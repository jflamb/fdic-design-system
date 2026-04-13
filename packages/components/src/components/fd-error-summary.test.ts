import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-error-summary.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import type {
  ErrorSummaryFocusTarget,
  ErrorSummaryItem,
} from "./fd-error-summary.js";

async function createSummary({
  heading = "Fix the following before you continue",
  intro = "Review each item and return to the linked field or group.",
  items = [
    { href: "#routing-number", text: "Enter the 9-digit routing number." },
    {
      href: "#contact-method-group",
      text: "Select how we should contact you if a reviewer needs clarification.",
    },
  ] satisfies ErrorSummaryItem[],
  open = true,
  autofocus = false,
  focusTarget = "container",
}: {
  heading?: string;
  intro?: string;
  items?: ErrorSummaryItem[];
  open?: boolean;
  autofocus?: boolean;
  focusTarget?: ErrorSummaryFocusTarget;
} = {}) {
  const el = document.createElement("fd-error-summary") as any;
  el.heading = heading;
  el.intro = intro;
  el.items = items;
  el.open = open;
  el.autofocus = autofocus;
  el.focusTarget = focusTarget;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  return el;
}

describe("FdErrorSummary", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-error-summary", () => {
    expect(customElements.get("fd-error-summary")).toBeDefined();
  });

  it("renders a labelled focusable container with authored links", async () => {
    const el = await createSummary();

    const base = el.shadowRoot?.querySelector('[part="base"]');
    const heading = el.shadowRoot?.querySelector('[part="heading"]');
    const links = el.shadowRoot?.querySelectorAll('[part="link"]');

    expect(base?.getAttribute("tabindex")).toBe("-1");
    expect(base?.getAttribute("aria-labelledby")).toBe(heading?.id);
    expect(heading?.textContent?.trim()).toBe("Fix the following before you continue");
    expect(links).toHaveLength(2);
    expect(links?.[0]?.getAttribute("href")).toBe("#routing-number");
  });

  it("does not render while closed", async () => {
    const el = await createSummary({ open: false });

    expect(el.shadowRoot?.querySelector('[part="base"]')).toBeNull();
  });

  it("autofocuses the container when opened", async () => {
    const el = await createSummary({ open: false, autofocus: true });

    el.open = true;
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(document.activeElement).toBe(el);
    expect(el.shadowRoot?.activeElement).toBe(
      el.shadowRoot?.querySelector('[part="base"]'),
    );
  });

  it("can autofocus the heading instead of the container", async () => {
    const el = await createSummary({
      open: false,
      autofocus: true,
      focusTarget: "heading",
    });

    el.open = true;
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(el.shadowRoot?.activeElement).toBe(
      el.shadowRoot?.querySelector('[part="heading"]'),
    );
  });

  it("has no axe violations when open", async () => {
    const el = await createSummary();
    await expectNoAxeViolations(el.shadowRoot ?? el);
  });
});
