import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-button-group.js";
import "../register/fd-button.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createButtonGroup(
  attrs: Record<string, string> = {},
  innerHTML = `
    <fd-button variant="primary">Save</fd-button>
    <fd-button variant="outline">Cancel</fd-button>
  `,
) {
  const el = document.createElement("fd-button-group") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getContainer(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=container]") as HTMLElement;
}

describe("fd-button-group", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-button-group")).toBeDefined();
  });

  it("renders a container with part='container'", async () => {
    const el = await createButtonGroup();
    expect(getContainer(el)).not.toBeNull();
  });

  it("defaults to start alignment and horizontal layout", async () => {
    const el = await createButtonGroup();
    const container = getContainer(el);

    expect(el.align).toBe("start");
    expect(el.direction).toBe("horizontal");
    expect(container.classList.contains("horizontal")).toBe(true);
    expect(container.classList.contains("align-start")).toBe(true);
  });

  it("applies end alignment when requested", async () => {
    const el = await createButtonGroup({ align: "end" });
    const container = getContainer(el);

    expect(container.classList.contains("align-end")).toBe(true);
  });

  it("applies spread alignment when requested", async () => {
    const el = await createButtonGroup({ align: "spread" });
    const container = getContainer(el);

    expect(container.classList.contains("align-spread")).toBe(true);
  });

  it("uses vertical layout when direction='vertical'", async () => {
    const el = await createButtonGroup({ direction: "vertical" });
    const container = getContainer(el);

    expect(container.classList.contains("vertical")).toBe(true);
    expect(container.classList.contains("horizontal")).toBe(false);
  });

  it("does not add group semantics by default", async () => {
    const el = await createButtonGroup();
    const container = getContainer(el);

    expect(container.hasAttribute("role")).toBe(false);
    expect(container.hasAttribute("aria-label")).toBe(false);
  });

  it("adds role='group' and aria-label when label is provided", async () => {
    const el = await createButtonGroup({ label: "Document actions" });
    const container = getContainer(el);

    expect(container.getAttribute("role")).toBe("group");
    expect(container.getAttribute("aria-label")).toBe("Document actions");
  });

  it("does not add group semantics for a whitespace-only label", async () => {
    const el = await createButtonGroup({ label: "   " });
    const container = getContainer(el);

    expect(container.hasAttribute("role")).toBe(false);
    expect(container.hasAttribute("aria-label")).toBe(false);
  });

  it("projects slotted buttons through the default slot", async () => {
    const el = await createButtonGroup();
    const slot = el.shadowRoot!.querySelector("slot") as HTMLSlotElement;
    const assigned = slot.assignedElements();

    expect(assigned).toHaveLength(2);
    expect(assigned[0].tagName).toBe("FD-BUTTON");
    expect(assigned[1].tagName).toBe("FD-BUTTON");
  });

  it("keeps horizontal groups in a wrapping row regardless of inline size", async () => {
    const el = await createButtonGroup();
    await el.updateComplete;

    const container = getContainer(el);
    expect(container.classList.contains("horizontal")).toBe(true);
    expect(container.classList.contains("stacked")).toBe(false);
    expect(container.hasAttribute("data-stacked")).toBe(false);
  });

  it("has no obvious accessibility violations in default layout", async () => {
    const el = await createButtonGroup({ label: "Form actions" });
    await expectNoAxeViolations(el);
  });
});
