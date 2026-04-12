import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-chip.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createChip(
  attrs: Record<string, string> = {},
  label = "Active filter",
) {
  const el = document.createElement("fd-chip") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = label;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getRemoveButton(el: any): HTMLButtonElement | null {
  return el.shadowRoot?.querySelector("[part=remove-button]") ?? null;
}

describe("FdChip", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-chip", () => {
    expect(customElements.get("fd-chip")).toBeDefined();
  });

  it("defaults to neutral styling", async () => {
    const el = await createChip();
    expect(el.type).toBe("neutral");
    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(
      "neutral",
    );
  });

  it("derives the remove button label from slotted text", async () => {
    const el = await createChip({}, "Pending review");
    expect(getRemoveButton(el)?.getAttribute("aria-label")).toBe(
      "Remove Pending review",
    );
  });

  it("uses remove-label when provided", async () => {
    const el = await createChip(
      {
        "remove-label": "Remove this active filter",
      },
      "Pending review",
    );

    expect(getRemoveButton(el)?.getAttribute("aria-label")).toBe(
      "Remove this active filter",
    );
  });

  it("falls back to a generic remove label when slot text is empty", async () => {
    const el = await createChip({}, "   ");
    expect(getRemoveButton(el)?.getAttribute("aria-label")).toBe("Remove chip");
  });

  it.each([
    ["cool"],
    ["warm"],
    ["positive"],
    ["alert"],
  ])("applies the %s tone class", async (type) => {
    const el = await createChip({ type });
    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(type);
  });

  it("normalizes unsupported tones back to neutral", async () => {
    const el = await createChip({ type: "unknown" });

    expect(el.shadowRoot?.querySelector("[part=container]")?.className).toContain(
      "neutral",
    );
  });

  it("renders a native button for removal", async () => {
    const el = await createChip();

    expect(getRemoveButton(el)?.getAttribute("type")).toBe("button");
  });

  it("renders the remove icon", async () => {
    const el = await createChip();
    const removeIcon = el.shadowRoot?.querySelector("[part=remove-icon]");

    expect(removeIcon).not.toBeNull();
    expect(removeIcon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("dispatches fd-chip-remove from the host", async () => {
    const el = await createChip();
    const onRemove = vi.fn();
    el.addEventListener("fd-chip-remove", onRemove);

    getRemoveButton(el)?.click();

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("dispatches a bubbling composed remove event with an empty detail payload", async () => {
    const el = await createChip();
    let capturedEvent: CustomEvent | undefined;
    document.body.addEventListener(
      "fd-chip-remove",
      (event) => {
        capturedEvent = event as CustomEvent;
      },
      { once: true },
    );

    getRemoveButton(el)?.click();

    expect(capturedEvent?.bubbles).toBe(true);
    expect(capturedEvent?.composed).toBe(true);
    expect(capturedEvent?.detail).toEqual({});
  });

  it("recomputes the remove label when slot text changes", async () => {
    const el = await createChip({}, "Pending review");

    el.textContent = "Updated filter";
    await el.updateComplete;

    expect(getRemoveButton(el)?.getAttribute("aria-label")).toBe(
      "Remove Updated filter",
    );
  });

  it("focus() forwards to the internal remove button", async () => {
    const el = await createChip();
    const button = getRemoveButton(el);

    el.focus();

    expect(el.shadowRoot?.activeElement).toBe(button);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createChip();
    await expectNoAxeViolations(el);
  });
});
