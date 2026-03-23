import { describe, it, expect, beforeEach, vi } from "vitest";
import "../register/fd-menu.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createMenuItem(
  attrs: Record<string, string> = {},
  innerHTML = "Save as draft",
) {
  const el = document.createElement("fd-menu-item") as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=base]") as HTMLElement;
}

describe("fd-menu-item", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-menu-item")).toBeDefined();
  });

  it("renders a native <button> with role='menuitem'", async () => {
    const el = await createMenuItem();
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("role")).toBe("menuitem");
  });

  it("has tabindex='-1' by default (roving tabindex managed by fd-menu)", async () => {
    const el = await createMenuItem();
    const inner = getInternal(el);
    expect(inner.getAttribute("tabindex")).toBe("-1");
  });

  it("fires fd-menu-item-select and deprecated fd-select on click", async () => {
    const el = await createMenuItem();
    const inner = getInternal(el);
    const selectSpy = vi.fn();
    const deprecatedSpy = vi.fn();
    el.addEventListener("fd-menu-item-select", selectSpy);
    el.addEventListener("fd-select", deprecatedSpy);

    inner.click();

    expect(selectSpy).toHaveBeenCalledOnce();
    expect(deprecatedSpy).toHaveBeenCalledOnce();
  });

  it("fires fd-menu-item-select event on Enter keydown", async () => {
    const el = await createMenuItem();
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("fd-menu-item-select", spy);

    inner.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(spy).toHaveBeenCalledOnce();
  });

  it("fires fd-menu-item-select event on Space keydown", async () => {
    const el = await createMenuItem();
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("fd-menu-item-select", spy);

    inner.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

    expect(spy).toHaveBeenCalledOnce();
  });

  it("does not fire fd-menu-item-select when disabled (click)", async () => {
    const el = await createMenuItem({ disabled: "" });
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("fd-menu-item-select", spy);

    inner.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it("does not fire fd-menu-item-select when disabled (Enter)", async () => {
    const el = await createMenuItem({ disabled: "" });
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("fd-menu-item-select", spy);

    inner.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(spy).not.toHaveBeenCalled();
  });

  it("sets aria-disabled='true' when disabled", async () => {
    const el = await createMenuItem({ disabled: "" });
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-disabled")).toBe("true");
  });

  it("sets aria-disabled='false' when not disabled", async () => {
    const el = await createMenuItem();
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-disabled")).toBe("false");
  });

  it("applies destructive class for variant='destructive'", async () => {
    const el = await createMenuItem({ variant: "destructive" });
    const inner = getInternal(el);
    expect(inner.classList.contains("destructive")).toBe(true);
  });

  it("has default slot for label text", async () => {
    const el = await createMenuItem({}, "Delete account");
    const slots = el.shadowRoot!.querySelectorAll("slot:not([name])");
    expect(slots.length).toBeGreaterThan(0);
  });

  it("has icon-start slot for leading icon", async () => {
    const el = await createMenuItem(
      {},
      '<fd-icon slot="icon-start" name="trash"></fd-icon>Delete',
    );
    const iconSlot = el.shadowRoot!.querySelector(
      'slot[name="icon-start"]',
    ) as HTMLSlotElement;
    expect(iconSlot).not.toBeNull();
  });

  it("has no axe violations for a default menu item", async () => {
    // Wrap in a menu role container for valid ARIA context
    const wrapper = document.createElement("div");
    wrapper.setAttribute("role", "menu");
    document.body.appendChild(wrapper);

    const el = document.createElement("fd-menu-item") as any;
    el.innerHTML = "Save as draft";
    wrapper.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(wrapper);
  });

  it("has no axe violations for a disabled menu item", async () => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("role", "menu");
    document.body.appendChild(wrapper);

    const el = document.createElement("fd-menu-item") as any;
    el.setAttribute("disabled", "");
    el.innerHTML = "Unavailable action";
    wrapper.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(wrapper);
  });
});
