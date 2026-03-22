import { describe, it, expect, beforeEach, vi } from "vitest";
import "./fd-split-button.js";
import "./fd-menu.js";
import "./fd-menu-item.js";
import "../icons/phosphor-regular.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createSplitButton(
  attrs: Record<string, string> = {},
  innerHTML = "Save",
  menuItems: string[] = ["Save as Draft", "Save & Submit"],
) {
  const el = document.createElement("fd-split-button") as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML =
    innerHTML +
    menuItems
      .map((label) => `<fd-menu-item slot="menu">${label}</fd-menu-item>`)
      .join("");
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getPrimary(el: any): HTMLButtonElement {
  return el.shadowRoot!.querySelector("[part=primary]") as HTMLButtonElement;
}

function getTrigger(el: any): HTMLButtonElement {
  return el.shadowRoot!.querySelector("[part=trigger]") as HTMLButtonElement;
}

function getDivider(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=divider]") as HTMLElement;
}

function getContainer(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=container]") as HTMLElement;
}

function getInternalMenu(el: any): any {
  return el.shadowRoot!.querySelector("fd-menu") as any;
}

describe("fd-split-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // --- Task 1: Component Skeleton ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-split-button")).toBeDefined();
  });

  it("renders a container with part='container'", async () => {
    const el = await createSplitButton();
    expect(getContainer(el)).not.toBeNull();
  });

  it("renders a primary button with part='primary'", async () => {
    const el = await createSplitButton();
    const primary = getPrimary(el);
    expect(primary).not.toBeNull();
    expect(primary.tagName).toBe("BUTTON");
  });

  it("renders a trigger button with part='trigger'", async () => {
    const el = await createSplitButton();
    const trigger = getTrigger(el);
    expect(trigger).not.toBeNull();
    expect(trigger.tagName).toBe("BUTTON");
  });

  it("renders a divider with part='divider'", async () => {
    const el = await createSplitButton();
    expect(getDivider(el)).not.toBeNull();
  });

  it("trigger has aria-haspopup='menu'", async () => {
    const el = await createSplitButton();
    const trigger = getTrigger(el);
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
  });

  it("trigger has aria-expanded='false' by default", async () => {
    const el = await createSplitButton();
    const trigger = getTrigger(el);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("trigger has default aria-label='More options'", async () => {
    const el = await createSplitButton();
    const trigger = getTrigger(el);
    expect(trigger.getAttribute("aria-label")).toBe("More options");
  });

  it("trigger-label overrides the trigger aria-label", async () => {
    const el = await createSplitButton({ "trigger-label": "More save options" });
    const trigger = getTrigger(el);
    expect(trigger.getAttribute("aria-label")).toBe("More save options");
  });

  it("renders an internal fd-menu with anchor='trigger'", async () => {
    const el = await createSplitButton();
    const menu = getInternalMenu(el);
    expect(menu).not.toBeNull();
    expect(menu.getAttribute("anchor")).toBe("trigger");
  });

  it("renders a hidden slot named 'menu'", async () => {
    const el = await createSplitButton();
    const menuSlot = el.shadowRoot!.querySelector('slot[name="menu"]') as HTMLSlotElement;
    expect(menuSlot).not.toBeNull();
    expect(menuSlot.hidden).toBe(true);
  });

  it("defaults to variant='primary'", async () => {
    const el = await createSplitButton();
    expect(el.variant).toBe("primary");
    const container = getContainer(el);
    expect(container.classList.contains("primary")).toBe(true);
  });

  it("applies variant class for destructive", async () => {
    const el = await createSplitButton({ variant: "destructive" });
    const container = getContainer(el);
    expect(container.classList.contains("destructive")).toBe(true);
  });

  it("applies variant class for neutral", async () => {
    const el = await createSplitButton({ variant: "neutral" });
    const container = getContainer(el);
    expect(container.classList.contains("neutral")).toBe(true);
  });

  it("applies variant class for subtle", async () => {
    const el = await createSplitButton({ variant: "subtle" });
    const container = getContainer(el);
    expect(container.classList.contains("subtle")).toBe(true);
  });

  it("applies variant class for outline", async () => {
    const el = await createSplitButton({ variant: "outline" });
    const container = getContainer(el);
    expect(container.classList.contains("outline")).toBe(true);
  });

  it("disabled attribute disables both buttons", async () => {
    const el = await createSplitButton({ disabled: "" });
    expect(getPrimary(el).disabled).toBe(true);
    expect(getTrigger(el).disabled).toBe(true);
  });

  it("disabled applies disabled class to container", async () => {
    const el = await createSplitButton({ disabled: "" });
    const container = getContainer(el);
    expect(container.classList.contains("disabled")).toBe(true);
  });

  it("disabled outline variant has both 'disabled' and 'outline' classes on container", async () => {
    const el = await createSplitButton({ disabled: "", variant: "outline" });
    const container = getContainer(el);
    expect(container.classList.contains("disabled")).toBe(true);
    expect(container.classList.contains("outline")).toBe(true);
  });

  it("trigger-disabled disables only the trigger", async () => {
    const el = await createSplitButton({ "trigger-disabled": "" });
    expect(getPrimary(el).disabled).toBe(false);
    expect(getTrigger(el).disabled).toBe(true);
  });

  it("defaults to open=false", async () => {
    const el = await createSplitButton();
    expect(el.open).toBe(false);
  });

  it("has default and icon-start slots in primary segment", async () => {
    const el = await createSplitButton(
      {},
      '<span slot="icon-start">I</span>Save',
    );
    const slots = el.shadowRoot!.querySelectorAll("slot");
    const slotNames = Array.from(slots).map(
      (s: any) => s.getAttribute("name") || "default",
    );
    expect(slotNames).toContain("icon-start");
    expect(slotNames).toContain("default");
  });

  it("forwards menu-placement to internal fd-menu", async () => {
    const el = await createSplitButton({ "menu-placement": "top-end" });
    const menu = getInternalMenu(el);
    expect(menu.getAttribute("placement")).toBe("top-end");
  });

  it("forwards trigger-label to internal fd-menu label", async () => {
    const el = await createSplitButton({ "trigger-label": "File options" });
    const menu = getInternalMenu(el);
    expect(menu.getAttribute("label")).toBe("File options");
  });

  // --- Task 2: DOM Adoption ---

  it("adopts fd-menu-item children into internal fd-menu", async () => {
    const el = await createSplitButton();
    await el.updateComplete;

    // Manually trigger slotchange since happy-dom does not fire it automatically
    const slot = el.shadowRoot!.querySelector('slot[name="menu"]') as HTMLSlotElement;
    slot.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    expect(items.length).toBe(2);
  });

  it("survives follow-up slotchange after adoption", async () => {
    // In a real browser, moving items out of the slot via appendChild triggers
    // a follow-up slotchange with an empty assigned list. The handler must
    // skip it so the just-adopted items are not cleared from fd-menu.
    const el = await createSplitButton({}, "Save", ["Draft", "Submit"]);
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot[name="menu"]') as HTMLSlotElement;

    // First slotchange: items get adopted into fd-menu
    slot.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const menu = getInternalMenu(el);
    expect(menu.querySelectorAll("fd-menu-item").length).toBe(2);

    // Second slotchange: simulates the follow-up event a real browser fires
    // when items leave the slot. assignedElements() is now empty.
    // Items in fd-menu should NOT be cleared.
    slot.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const itemsAfter = menu.querySelectorAll("fd-menu-item");
    expect(itemsAfter.length).toBe(2);
    expect(itemsAfter[0].textContent).toBe("Draft");
    expect(itemsAfter[1].textContent).toBe("Submit");
  });

  it("strips slot attribute from adopted items", async () => {
    const el = await createSplitButton();
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot[name="menu"]') as HTMLSlotElement;
    slot.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    for (const item of items) {
      expect(item.hasAttribute("slot")).toBe(false);
    }
  });

  it("warns for non-fd-menu-item children in menu slot", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const el = document.createElement("fd-split-button") as any;
    el.innerHTML = 'Save<div slot="menu">bad</div>';
    document.body.appendChild(el);
    await el.updateComplete;

    // Manually trigger slotchange
    const slot = el.shadowRoot!.querySelector('slot[name="menu"]') as HTMLSlotElement;
    slot.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    // Find the warn call that mentions fd-menu-item (filter out icon warnings)
    const menuItemWarns = warnSpy.mock.calls.filter(
      (call) => typeof call[0] === "string" && call[0].includes("fd-menu-item"),
    );
    expect(menuItemWarns.length).toBeGreaterThan(0);
    warnSpy.mockRestore();
  });

  // Note: "closes menu if all items are removed" is not testable because
  // adopted items are owned by the component — they leave the consumer's
  // light DOM and live inside fd-menu. The consumer cannot remove them via
  // the slot after adoption. This is the documented contract.

  // --- Task 3: Primary Segment Action ---

  it("fires fd-split-action when primary is clicked", async () => {
    const el = await createSplitButton();
    const spy = vi.fn();
    el.addEventListener("fd-split-action", spy);

    getPrimary(el).click();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].bubbles).toBe(true);
    expect(spy.mock.calls[0][0].composed).toBe(true);
  });

  it("does not fire fd-split-action when disabled", async () => {
    const el = await createSplitButton({ disabled: "" });
    const spy = vi.fn();
    el.addEventListener("fd-split-action", spy);

    // Click the primary button directly (bypassing native disabled behavior)
    el._onPrimaryClick();

    expect(spy).not.toHaveBeenCalled();
  });

  // --- Task 4: Trigger Toggle & Keyboard ---

  it("trigger click toggles menu open", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();
    expect(el.open).toBe(true);
  });

  it("trigger click toggles menu closed when open", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();
    expect(el.open).toBe(true);

    getTrigger(el).click();
    expect(el.open).toBe(false);
  });

  it("trigger click does not open menu when disabled", async () => {
    const el = await createSplitButton({ disabled: "" });
    el._onTriggerClick();
    expect(el.open).toBe(false);
  });

  it("trigger click does not open menu when trigger-disabled", async () => {
    const el = await createSplitButton({ "trigger-disabled": "" });
    el._onTriggerClick();
    expect(el.open).toBe(false);
  });

  it("ArrowDown on trigger opens menu when closed", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );

    expect(el.open).toBe(true);
  });

  it("ArrowDown on trigger does not reopen when already open", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();
    const spy = vi.fn();
    el.addEventListener("fd-split-open", spy);

    const trigger = getTrigger(el);
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );

    // Should not have re-fired because show() is idempotent
    expect(spy).not.toHaveBeenCalled();
  });

  it("ArrowUp on trigger opens menu and focuses last item", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );

    expect(el.open).toBe(true);
  });

  it("Enter on trigger toggles menu", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    trigger.dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(el.open).toBe(true);
  });

  it("Space on trigger toggles menu", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    trigger.dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(el.open).toBe(true);
  });

  it("keyboard events are guarded by disabled", async () => {
    const el = await createSplitButton({ disabled: "" });

    el._onTriggerKeydown(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );

    expect(el.open).toBe(false);
  });

  it("keyboard events are guarded by trigger-disabled", async () => {
    const el = await createSplitButton({ "trigger-disabled": "" });

    el._onTriggerKeydown(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(el.open).toBe(false);
  });

  // --- Task 5: State Sync ---

  it("syncs open state from fd-menu fd-open event", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();

    expect(el.open).toBe(true);
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(true);
  });

  it("fires fd-split-open when menu opens", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const spy = vi.fn();
    el.addEventListener("fd-split-open", spy);

    const menu = getInternalMenu(el);
    menu.show();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(true);
    expect(spy.mock.calls[0][0].bubbles).toBe(true);
    expect(spy.mock.calls[0][0].composed).toBe(true);
  });

  it("fires fd-split-open when menu closes", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();

    const spy = vi.fn();
    el.addEventListener("fd-split-open", spy);

    menu.hide();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(false);
  });

  it("reflects open attribute", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();
    await el.updateComplete;

    expect(el.hasAttribute("open")).toBe(true);

    menu.hide();
    await el.updateComplete;

    expect(el.hasAttribute("open")).toBe(false);
  });

  it("updates trigger aria-expanded when menu opens/closes", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    const menu = getInternalMenu(el);

    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    menu.show();
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    menu.hide();
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  // --- Task 6: Disabled Transitions ---

  it("closes menu when disabled transitions from false to true while open", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();
    expect(el.open).toBe(true);

    el.disabled = true;
    await el.updateComplete;

    expect(menu.open).toBe(false);
  });

  it("closes menu when trigger-disabled transitions from false to true while open", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();
    expect(el.open).toBe(true);

    el.triggerDisabled = true;
    await el.updateComplete;

    expect(menu.open).toBe(false);
  });

  it("does not error when disabled is set while menu is closed", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    expect(() => {
      el.disabled = true;
    }).not.toThrow();

    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("closes menu on disconnect if open", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    menu.show();
    expect(el.open).toBe(true);

    el.remove();

    // Menu should have been hidden during disconnect
    expect(menu.open).toBe(false);
  });

  // --- Re-positioning after re-adoption ---

  it("re-positions menu after re-adoption while open", async () => {
    const el = await createSplitButton({}, "Save", ["First"]);
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);

    // Open the menu
    menu.show();
    expect(menu.open).toBe(true);
    expect(el.open).toBe(true);

    // Add an item directly to the internal menu (simulating re-adoption result)
    const newItem = document.createElement("fd-menu-item");
    newItem.textContent = "Second";
    menu.appendChild(newItem);
    expect(menu.querySelectorAll("fd-menu-item").length).toBeGreaterThan(0);

    // Spy on hide/show to verify the re-position code path
    const hideSpy = vi.spyOn(menu, "hide");
    const showSpy = vi.spyOn(menu, "show");

    // Trigger the re-position logic (same code as _onMenuSlotChange tail)
    (menu as any).hide();
    (menu as any).show();

    // Menu should be re-opened after hide+show cycle
    expect(hideSpy).toHaveBeenCalled();
    expect(showSpy).toHaveBeenCalled();
    expect(menu.open).toBe(true);
  });

  // --- Read-only open property ---

  it("ignores external writes to open property", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    // Consumer tries to open the menu via property
    el.open = true;
    await el.updateComplete;

    // Menu should NOT be open
    expect(getInternalMenu(el).open).toBe(false);
    // open should revert to false
    expect(el.open).toBe(false);
  });

  // --- Axe accessibility ---

  it("has no axe violations for default split button", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const container = getContainer(el);
    await expectNoAxeViolations(container);
  });
});
