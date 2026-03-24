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

  it("projects slotted chips", async () => {
    const el = await createGroup();
    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(2);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createGroup({ label: "Active filters" });
    await expectNoAxeViolations(el);
  });
});
