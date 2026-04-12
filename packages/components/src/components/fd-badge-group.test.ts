import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-badge-group.js";
import "../register/fd-badge.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createGroup(
  attrs: Record<string, string> = {},
  innerHTML = `
    <fd-badge>Small business</fd-badge>
    <fd-badge type="positive">Approved</fd-badge>
  `,
) {
  const el = document.createElement("fd-badge-group") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdBadgeGroup", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-badge-group", () => {
    expect(customElements.get("fd-badge-group")).toBeDefined();
  });

  it("does not add group semantics by default", async () => {
    const el = await createGroup();
    const container = el.shadowRoot?.querySelector("[part=container]");
    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("aria-label")).toBe(false);
  });

  it("adds group semantics when label is provided", async () => {
    const el = await createGroup({ label: "Account tags" });
    const container = el.shadowRoot?.querySelector("[part=container]");
    expect(container?.getAttribute("role")).toBe("group");
    expect(container?.getAttribute("aria-label")).toBe("Account tags");
  });

  it("ignores whitespace-only labels", async () => {
    const el = await createGroup({ label: "   " });
    const container = el.shadowRoot?.querySelector("[part=container]");
    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("aria-label")).toBe(false);
  });

  it("projects slotted badges", async () => {
    const el = await createGroup();
    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(2);
  });

  it("reflects the group label on the host", async () => {
    const el = await createGroup({ label: "Account tags" });
    expect(el.getAttribute("label")).toBe("Account tags");
  });

  it("updates group semantics when the label changes", async () => {
    const el = await createGroup();
    const container = el.shadowRoot?.querySelector("[part=container]");

    el.setAttribute("label", "Status badges");
    await el.updateComplete;

    expect(container?.getAttribute("role")).toBe("group");
    expect(container?.getAttribute("aria-label")).toBe("Status badges");
  });

  it("removes group semantics when the label is cleared", async () => {
    const el = await createGroup({ label: "Status badges" });
    const container = el.shadowRoot?.querySelector("[part=container]");

    el.removeAttribute("label");
    await el.updateComplete;

    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("aria-label")).toBe(false);
  });

  it("accepts dynamically added badges", async () => {
    const el = await createGroup();
    const badge = document.createElement("fd-badge");
    badge.textContent = "Flagged";

    el.appendChild(badge);
    await el.updateComplete;

    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(3);
  });

  it("preserves non-badge slotted content", async () => {
    const el = await createGroup({}, `<span>Inline summary</span>`);
    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;

    expect(slot.assignedElements()[0]?.tagName.toLowerCase()).toBe("span");
  });

  it("uses wrapping layout styles for grouped badges", () => {
    const styles = (
      customElements.get("fd-badge-group") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("flex-wrap: wrap");
    expect(styles).toContain("max-inline-size: 100%");
  });

  it("keeps the host display block so grouped badges can fill the row", () => {
    const styles = (
      customElements.get("fd-badge-group") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain(":host {\n      display: block;");
  });

  it("includes a token-driven gap between badges", () => {
    const styles = (
      customElements.get("fd-badge-group") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("var(--fd-badge-group-gap, var(--fdic-spacing-2xs, 4px))");
  });

  it("keeps assigned badge count in sync when a badge is removed", async () => {
    const el = await createGroup();
    const [firstBadge] = el.querySelectorAll("fd-badge");
    firstBadge?.remove();
    await el.updateComplete;

    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(1);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createGroup({ label: "Account tags" });
    await expectNoAxeViolations(el);
  });
});
