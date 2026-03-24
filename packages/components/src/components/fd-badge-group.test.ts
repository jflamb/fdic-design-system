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

  it("projects slotted badges", async () => {
    const el = await createGroup();
    const slot = el.shadowRoot?.querySelector("slot") as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(2);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createGroup({ label: "Account tags" });
    await expectNoAxeViolations(el);
  });
});
