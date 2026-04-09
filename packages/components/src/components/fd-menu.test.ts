import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-menu.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { createToggleEvent, installPopoverShim } from "./test-popover.js";

installPopoverShim();

async function createMenu(
  attrs: Record<string, string> = {},
  items: Array<{ label: string; disabled?: boolean; variant?: string }> = [
    { label: "Save as draft" },
    { label: "Save & submit" },
    { label: "Discard" },
  ],
  anchorId?: string,
) {
  // Create anchor button if requested
  if (anchorId) {
    const anchor = document.createElement("button");
    anchor.id = anchorId;
    anchor.setAttribute("aria-haspopup", "menu");
    anchor.textContent = "Actions";
    document.body.appendChild(anchor);
  }

  const el = document.createElement("fd-menu") as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);

  for (const item of items) {
    const menuItem = document.createElement("fd-menu-item") as any;
    menuItem.textContent = item.label;
    if (item.disabled) menuItem.setAttribute("disabled", "");
    if (item.variant) menuItem.setAttribute("variant", item.variant);
    el.appendChild(menuItem);
  }

  document.body.appendChild(el);
  await el.updateComplete;

  // Wait for all menu items to render
  const menuItems = el.querySelectorAll("fd-menu-item");
  for (const mi of menuItems) {
    await (mi as any).updateComplete;
  }

  return el;
}

function getMenuRole(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[role=menu]") as HTMLElement;
}

function getSurface(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=surface]") as HTMLElement;
}

function getItemButton(item: any): HTMLElement {
  return item.shadowRoot!.querySelector("[part=base]") as HTMLElement;
}

describe("fd-menu", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-menu")).toBeDefined();
  });

  it("renders a surface with role='menu'", async () => {
    const el = await createMenu();
    const menu = getMenuRole(el);
    expect(menu).not.toBeNull();
    expect(menu.getAttribute("role")).toBe("menu");
  });

  it("surface has popover='auto' attribute", async () => {
    const el = await createMenu();
    const surface = getSurface(el);
    expect(surface.getAttribute("popover")).toBe("auto");
  });

  it("does not reserve a persistent scrollbar gutter on the menu surface", () => {
    const styles = (
      customElements.get("fd-menu") as typeof HTMLElement & {
        styles?: { cssText?: string } | Array<{ cssText?: string }>;
      }
    ).styles;
    const cssText = Array.isArray(styles)
      ? styles.map((value) => value?.cssText ?? "").join("\n")
      : styles?.cssText ?? "";

    expect(cssText).not.toContain("scrollbar-gutter: stable");
  });

  it("stretches menu items to the full menu width", async () => {
    const el = await createMenu();
    const firstItem = el.querySelector("fd-menu-item") as HTMLElement | null;
    expect(firstItem).not.toBeNull();

    const itemStyles = (
      customElements.get("fd-menu-item") as typeof HTMLElement & {
        styles?: { cssText?: string } | Array<{ cssText?: string }>;
      }
    ).styles;
    const cssText = Array.isArray(itemStyles)
      ? itemStyles.map((value) => value?.cssText ?? "").join("\n")
      : itemStyles?.cssText ?? "";

    expect(cssText).toContain(":host");
    expect(cssText).toContain("inline-size: 100%");
  });

  it("defaults to placement='bottom-start'", async () => {
    const el = await createMenu();
    expect(el.placement).toBe("bottom-start");
  });

  it("reflects placement attribute", async () => {
    const el = await createMenu({ placement: "top-end" });
    expect(el.placement).toBe("top-end");
    expect(el.getAttribute("placement")).toBe("top-end");
  });

  it("starts with open=false", async () => {
    const el = await createMenu();
    expect(el.open).toBe(false);
  });

  // --- show/hide/toggle ---

  it("show() sets open=true and fires fd-menu-open-change", async () => {
    const el = await createMenu({ label: "Actions" });
    const spy = vi.fn();
    el.addEventListener("fd-menu-open-change", spy);

    el.show();

    expect(el.open).toBe(true);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(true);
  });

  it("show() also fires deprecated fd-open", async () => {
    const el = await createMenu({ label: "Actions" });
    const spy = vi.fn();
    el.addEventListener("fd-open", spy);

    el.show();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(true);
  });

  it("hide() sets open=false and fires fd-menu-open-change", async () => {
    const el = await createMenu({ label: "Actions" });
    el.show();

    const spy = vi.fn();
    el.addEventListener("fd-menu-open-change", spy);
    el.hide();

    expect(el.open).toBe(false);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(false);
  });

  it("toggle() opens when closed and closes when open", async () => {
    const el = await createMenu({ label: "Actions" });

    el.toggle();
    expect(el.open).toBe(true);

    el.toggle();
    expect(el.open).toBe(false);
  });

  it("show() is idempotent when already open", async () => {
    const el = await createMenu({ label: "Actions" });
    const spy = vi.fn();
    el.addEventListener("fd-menu-open-change", spy);

    el.show();
    el.show();

    expect(spy).toHaveBeenCalledOnce();
  });

  it("hide() is idempotent when already closed", async () => {
    const el = await createMenu({ label: "Actions" });
    const spy = vi.fn();
    el.addEventListener("fd-menu-open-change", spy);

    el.hide();

    expect(spy).not.toHaveBeenCalled();
  });

  // --- open attribute reflection ---

  it("reflects open as an attribute", async () => {
    const el = await createMenu({ label: "Actions" });

    el.show();
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(true);

    el.hide();
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(false);
  });

  // --- aria-label / aria-labelledby ---

  it("forwards label to aria-label on the menu container", async () => {
    const el = await createMenu({ label: "File actions" });
    const menu = getMenuRole(el);
    expect(menu.getAttribute("aria-label")).toBe("File actions");
  });

  it("forwards labelledby to aria-labelledby on the menu container", async () => {
    const heading = document.createElement("h2");
    heading.id = "menu-heading";
    heading.textContent = "Actions";
    document.body.appendChild(heading);

    const el = await createMenu({ labelledby: "menu-heading" });
    const menu = getMenuRole(el);
    expect(menu.getAttribute("aria-labelledby")).toBe("menu-heading");
  });

  // --- Anchor management ---

  it("manages aria-expanded on anchor element when open", async () => {
    const el = await createMenu({ label: "Actions", anchor: "trigger-btn" }, undefined, "trigger-btn");
    const anchorEl = document.getElementById("trigger-btn")!;

    el.show();
    expect(anchorEl.getAttribute("aria-expanded")).toBe("true");

    el.hide();
    expect(anchorEl.getAttribute("aria-expanded")).toBe("false");
  });

  // --- Keyboard: ArrowDown/ArrowUp ---

  it("ArrowDown moves focus to next item (wraps)", async () => {
    const el = await createMenu({ label: "Actions" });
    el.show();

    // Wait for focus to settle
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");
    const firstBtn = getItemButton(items[0]);
    const secondBtn = getItemButton(items[1]);

    // Simulate ArrowDown from first item
    const menuRole = getMenuRole(el);
    menuRole.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );

    await new Promise((r) => requestAnimationFrame(r));

    // Second item should have tabindex="0"
    expect(secondBtn.getAttribute("tabindex")).toBe("0");
  });

  it("ArrowUp moves focus to previous item (wraps)", async () => {
    const el = await createMenu({ label: "Actions" });
    el.show();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");

    // ArrowUp from first should wrap to last
    const menuRole = getMenuRole(el);
    menuRole.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );

    await new Promise((r) => requestAnimationFrame(r));

    const lastBtn = getItemButton(items[items.length - 1]);
    expect(lastBtn.getAttribute("tabindex")).toBe("0");
  });

  // --- Keyboard: Home/End ---

  it("Home moves focus to first item", async () => {
    const el = await createMenu({ label: "Actions" });
    el.show();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const menuRole = getMenuRole(el);
    menuRole.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
    );

    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");
    const firstBtn = getItemButton(items[0]);
    expect(firstBtn.getAttribute("tabindex")).toBe("0");
  });

  it("End moves focus to last item", async () => {
    const el = await createMenu({ label: "Actions" });
    el.show();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const menuRole = getMenuRole(el);
    menuRole.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );

    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");
    const lastBtn = getItemButton(items[items.length - 1]);
    expect(lastBtn.getAttribute("tabindex")).toBe("0");
  });

  // --- Keyboard: Escape ---

  it("Escape closes menu", async () => {
    const el = await createMenu({ label: "Actions", anchor: "esc-btn" }, undefined, "esc-btn");
    el.show();

    const menuRole = getMenuRole(el);
    menuRole.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    expect(el.open).toBe(false);
  });

  // --- Keyboard: Tab ---

  it("Tab closes menu without trapping focus", async () => {
    const el = await createMenu({ label: "Actions" });
    el.show();

    const menuRole = getMenuRole(el);
    const tabEvent = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
    const preventSpy = vi.spyOn(tabEvent, "preventDefault");

    menuRole.dispatchEvent(tabEvent);

    expect(el.open).toBe(false);
    // Tab should NOT be prevented — natural focus movement
    expect(preventSpy).not.toHaveBeenCalled();
  });

  // --- Disabled items in rotation ---

  it("disabled items are in arrow-key rotation", async () => {
    const el = await createMenu(
      { label: "Actions" },
      [
        { label: "Save", disabled: false },
        { label: "Delete", disabled: true },
        { label: "Cancel", disabled: false },
      ],
    );
    el.show();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");
    const menuRole = getMenuRole(el);

    // ArrowDown from first → should go to disabled second item
    menuRole.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );

    await new Promise((r) => requestAnimationFrame(r));

    const secondBtn = getItemButton(items[1]);
    expect(secondBtn.getAttribute("tabindex")).toBe("0");
  });

  // --- Item activation closes menu ---

  it("item activation (fd-menu-item-select) closes menu", async () => {
    const el = await createMenu({ label: "Actions", anchor: "act-btn" }, undefined, "act-btn");
    el.show();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");
    items[0]?.dispatchEvent(
      new CustomEvent("fd-menu-item-select", {
        bubbles: true,
        composed: true,
      }),
    );

    expect(el.open).toBe(false);
  });

  it("syncs open state when the native popover light-dismisses", async () => {
    const el = await createMenu({ label: "Actions", anchor: "toggle-btn" }, undefined, "toggle-btn");
    const anchorEl = document.getElementById("toggle-btn")!;
    const spy = vi.fn();
    el.addEventListener("fd-menu-open-change", spy);

    el.show();
    spy.mockClear();

    getSurface(el).dispatchEvent(createToggleEvent("closed", "open"));

    expect(el.open).toBe(false);
    expect(anchorEl.getAttribute("aria-expanded")).toBe("false");
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(false);
  });

  // --- showLast() ---

  it("showLast() focuses the last item", async () => {
    const el = await createMenu({ label: "Actions" });
    el.showLast();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const items = el.querySelectorAll("fd-menu-item");
    const lastBtn = getItemButton(items[items.length - 1]);
    expect(lastBtn.getAttribute("tabindex")).toBe("0");
  });

  // --- Axe accessibility ---

  it("has no axe violations for menu with items", async () => {
    const el = await createMenu({ label: "File actions" });
    el.show();

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    // axe needs to check the shadow DOM content
    const menuRole = getMenuRole(el);
    await expectNoAxeViolations(menuRole);
  });
});
