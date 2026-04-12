import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-chip-group.js";
import "../register/fd-chip.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createGroup(
  attrs: Record<string, string> = {},
  innerHTML = `
    <fd-chip>Pending review</fd-chip>
    <fd-chip>Low balance</fd-chip>
  `,
) {
  const el = document.createElement("fd-chip-group") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdChipGroup", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-chip-group", () => {
    expect(customElements.get("fd-chip-group")).toBeDefined();
  });

  it("does not add group semantics by default", async () => {
    const el = await createGroup();
    const container = el.shadowRoot?.querySelector("[part=container]");
    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("aria-label")).toBe(false);
  });

  it("adds group semantics when label is provided", async () => {
    const el = await createGroup({ label: "Active filters" });
    const container = el.shadowRoot?.querySelector("[part=container]");
    expect(container?.getAttribute("role")).toBe("group");
    expect(container?.getAttribute("aria-label")).toBe("Active filters");
  });

  it("ignores whitespace-only labels", async () => {
    const el = await createGroup({ label: "   " });
    const container = el.shadowRoot?.querySelector("[part=container]");
    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("aria-label")).toBe(false);
  });

  it("projects slotted chips", async () => {
    const el = await createGroup();
    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(2);
  });

  it("reflects the label attribute to the host", async () => {
    const el = await createGroup({ label: "Current selections" });
    expect(el.getAttribute("label")).toBe("Current selections");
  });

  it("updates group semantics when the label changes", async () => {
    const el = await createGroup();
    const container = el.shadowRoot?.querySelector("[part=container]");

    el.setAttribute("label", "Changed filters");
    await el.updateComplete;

    expect(container?.getAttribute("role")).toBe("group");
    expect(container?.getAttribute("aria-label")).toBe("Changed filters");
  });

  it("removes group semantics when the label is cleared", async () => {
    const el = await createGroup({ label: "Active filters" });
    const container = el.shadowRoot?.querySelector("[part=container]");

    el.removeAttribute("label");
    await el.updateComplete;

    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("aria-label")).toBe(false);
  });

  it("accepts dynamically added chips", async () => {
    const el = await createGroup();
    const chip = document.createElement("fd-chip");
    chip.textContent = "Escalated";

    el.appendChild(chip);
    await el.updateComplete;

    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(3);
  });

  it("preserves non-chip slotted content", async () => {
    const el = await createGroup({}, `<span>Inline helper</span>`);
    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;

    expect(slot.assignedElements()[0]?.tagName.toLowerCase()).toBe("span");
  });

  it("uses wrapping layout styles for chip collections", () => {
    const styles = (
      customElements.get("fd-chip-group") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("flex-wrap: wrap");
    expect(styles).toContain("max-inline-size: 100%");
  });

  it("keeps the host display block so the group can span available width", () => {
    const styles = (
      customElements.get("fd-chip-group") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain(":host {\n      display: block;");
  });

  it("includes a token-driven gap between chips", () => {
    const styles = (
      customElements.get("fd-chip-group") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("var(--fd-chip-group-gap, var(--fdic-spacing-2xs, 4px))");
  });

  it("keeps assigned chip count in sync when a chip is removed", async () => {
    const el = await createGroup();
    const [firstChip] = el.querySelectorAll("fd-chip");
    firstChip?.remove();
    await el.updateComplete;

    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(1);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createGroup({ label: "Active filters" });
    await expectNoAxeViolations(el);
  });
});
