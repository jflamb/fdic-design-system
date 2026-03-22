# fd-split-button Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement `fd-split-button` — a split button web component that composes a primary action button with a menu trigger, using `fd-menu` internally for popup behavior.

**Architecture:** `fd-split-button` extends LitElement with Shadow DOM. It renders two native `<button>` segments (primary + trigger) and an internal `<fd-menu>`. Consumer-provided `<fd-menu-item slot="menu">` children are adopted into the internal fd-menu via DOM adoption on slotchange. All popup behavior delegates to fd-menu's existing public API.

**Tech Stack:** Lit 3, TypeScript, Vitest + happy-dom, axe-core, Storybook

**Design doc:** `docs/plans/2026-03-22-fd-split-button-design.md`

---

### Task 1: Component Skeleton — Rendering Two Segments

**Files:**
- Create: `packages/components/src/components/fd-split-button.ts`
- Create: `packages/components/src/components/fd-split-button.test.ts`

**Step 1: Write failing tests for basic rendering**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import "./fd-split-button.js";
import "./fd-menu.js";
import "./fd-menu-item.js";

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
  return el.shadowRoot!.querySelector("fd-menu");
}

describe("fd-split-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-split-button")).toBeDefined();
  });

  it("renders a primary button, divider, and trigger button", async () => {
    const el = await createSplitButton();
    expect(getPrimary(el)).not.toBeNull();
    expect(getPrimary(el).tagName).toBe("BUTTON");
    expect(getDivider(el)).not.toBeNull();
    expect(getTrigger(el)).not.toBeNull();
    expect(getTrigger(el).tagName).toBe("BUTTON");
  });

  it("renders an internal fd-menu element", async () => {
    const el = await createSplitButton();
    const menu = getInternalMenu(el);
    expect(menu).not.toBeNull();
    expect(menu.tagName.toLowerCase()).toBe("fd-menu");
  });

  it("primary segment projects default slot content", async () => {
    const el = await createSplitButton({}, "Submit");
    const primary = getPrimary(el);
    const label = primary.querySelector(".label");
    expect(label).not.toBeNull();
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

  it("trigger has default aria-label 'More options'", async () => {
    const el = await createSplitButton();
    const trigger = getTrigger(el);
    expect(trigger.getAttribute("aria-label")).toBe("More options");
  });

  it("trigger-label overrides the trigger aria-label", async () => {
    const el = await createSplitButton({ "trigger-label": "More save options" });
    const trigger = getTrigger(el);
    expect(trigger.getAttribute("aria-label")).toBe("More save options");
  });

  it("defaults to variant='primary'", async () => {
    const el = await createSplitButton();
    expect(el.variant).toBe("primary");
  });

  it("internal menu has anchor pointing to trigger", async () => {
    const el = await createSplitButton();
    const menu = getInternalMenu(el);
    expect(menu.getAttribute("anchor")).toBe("trigger");
  });

  it("internal menu has label matching trigger-label", async () => {
    const el = await createSplitButton({ "trigger-label": "More save options" });
    const menu = getInternalMenu(el);
    expect(menu.getAttribute("label")).toBe("More save options");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
import { LitElement, css, html } from "lit";
import type { ButtonVariant } from "./fd-button.js";
import type { Placement } from "./placement.js";
import "./fd-menu.js";
import "./fd-menu-item.js";
import "./fd-icon.js";

export class FdSplitButton extends LitElement {
  static properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    triggerDisabled: { attribute: "trigger-disabled", type: Boolean, reflect: true },
    triggerLabel: { attribute: "trigger-label", reflect: true },
    menuPlacement: { attribute: "menu-placement", reflect: true },
    open: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .container {
      display: inline-flex;
      align-items: stretch;
      border-radius: var(--fd-button-radius, var(--fdic-corner-radius-sm, 3px));
      position: relative;
    }

    .primary-segment,
    .trigger-segment {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-family: var(
        --fdic-font-family-sans-serif,
        "Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
      );
      font-size: var(--fd-button-font-size, var(--fdic-font-size-body, 18px));
      line-height: 1.375;
      cursor: pointer;
      box-sizing: border-box;
      min-height: var(--fd-button-height, 44px);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .primary-segment {
      gap: var(--fd-button-gap, var(--fdic-spacing-2xs, 4px));
      padding-inline: 7px;
      border-radius: var(--fd-button-radius, var(--fdic-corner-radius-sm, 3px)) 0 0 var(--fd-button-radius, var(--fdic-corner-radius-sm, 3px));
    }

    .trigger-segment {
      width: var(--fd-split-button-trigger-width, 44px);
      min-width: var(--fd-split-button-trigger-width, 44px);
      border-radius: 0 var(--fd-button-radius, var(--fdic-corner-radius-sm, 3px)) var(--fd-button-radius, var(--fdic-corner-radius-sm, 3px)) 0;
    }

    .divider {
      width: var(--fd-split-button-divider-width, 1px);
      align-self: stretch;
    }

    .label {
      display: inline-flex;
      align-items: center;
      padding-inline: 6px;
    }

    ::slotted([slot="icon-start"]) {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    /* --- Variant: Primary --- */
    .primary .primary-segment,
    .primary .trigger-segment {
      background-color: var(--fd-button-bg-primary, var(--ds-color-bg-active, #0d6191));
      color: var(--fd-button-text-primary, var(--ds-color-text-inverted, #ffffff));
      font-weight: 600;
    }
    .primary .divider {
      background-color: var(--fd-split-button-divider-color, rgba(255, 255, 255, 0.3));
    }

    /* --- Variant: Destructive --- */
    .destructive .primary-segment,
    .destructive .trigger-segment {
      background-color: var(--fd-button-bg-destructive, var(--ds-color-bg-destructive, #d80e3a));
      color: var(--fd-button-text-destructive, var(--ds-color-text-inverted, #ffffff));
      font-weight: 600;
    }
    .destructive .divider {
      background-color: var(--fd-split-button-divider-color, rgba(255, 255, 255, 0.3));
    }

    /* --- Variant: Neutral --- */
    .neutral .primary-segment,
    .neutral .trigger-segment {
      background-color: var(--fd-button-bg-neutral, var(--ds-color-bg-interactive, #f5f5f7));
      color: var(--fd-button-text-neutral, var(--ds-color-text-primary, #212123));
      font-weight: 400;
    }
    .neutral .divider {
      background-color: var(--fd-split-button-divider-color, var(--fdic-border-divider, #bdbdbf));
    }

    /* --- Variant: Subtle --- */
    .subtle .primary-segment,
    .subtle .trigger-segment {
      background-color: transparent;
      color: var(--fd-button-text-subtle, var(--ds-color-text-primary, #212123));
      font-weight: 400;
    }
    .subtle .divider {
      background-color: var(--fd-split-button-divider-color, var(--fdic-border-divider, #bdbdbf));
    }

    /* --- Variant: Outline --- */
    .outline {
      border: 2px solid var(--fd-button-border-outline, var(--ds-color-bg-active, #0d6191));
    }
    .outline .primary-segment,
    .outline .trigger-segment {
      background-color: var(--ds-color-bg-input, #ffffff);
      color: var(--fd-button-text-outline, var(--ds-color-text-link, #1278b0));
      font-weight: 400;
    }
    .outline .divider {
      background-color: var(--fd-split-button-divider-color, var(--fd-button-border-outline, var(--ds-color-bg-active, #0d6191)));
    }

    /* --- Hover --- */
    .primary-segment:hover,
    .trigger-segment:hover {
      box-shadow: inset 0 0 0 999px var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)));
    }

    /* --- Active --- */
    .primary-segment:active,
    .trigger-segment:active {
      box-shadow: inset 0 0 0 999px var(--fd-button-overlay-active, var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08)));
    }

    /* --- Focus --- */
    .primary-segment:focus,
    .trigger-segment:focus {
      outline: none;
    }
    .primary-segment:focus-visible,
    .trigger-segment:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--fd-button-focus-gap, var(--ds-color-bg-input, #ffffff)),
        0 0 0 4px var(--fd-button-focus-ring, var(--ds-color-border-input-focus, #38b6ff));
      z-index: 1;
      position: relative;
    }

    /* --- Disabled --- */
    :host([disabled]) {
      pointer-events: none;
    }
    .disabled .primary-segment,
    .disabled .trigger-segment {
      background-color: var(--fd-button-bg-disabled, var(--ds-color-bg-container, #f5f5f7));
      color: var(--fd-button-text-disabled, var(--ds-color-text-disabled, #9e9ea0));
      cursor: default;
    }
    .disabled .primary-segment:hover,
    .disabled .primary-segment:active,
    .disabled .trigger-segment:hover,
    .disabled .trigger-segment:active {
      box-shadow: none;
    }
    .disabled .divider {
      background-color: var(--fd-button-text-disabled, var(--ds-color-text-disabled, #9e9ea0));
      opacity: 0.3;
    }
    .disabled.outline {
      border-color: var(--fd-button-border-outline-disabled, var(--ds-color-border-input-disabled, #d6d6d8));
    }

    /* --- Trigger-disabled only --- */
    .trigger-disabled .trigger-segment {
      background-color: var(--fd-button-bg-disabled, var(--ds-color-bg-container, #f5f5f7));
      color: var(--fd-button-text-disabled, var(--ds-color-text-disabled, #9e9ea0));
      cursor: default;
    }
    .trigger-disabled .trigger-segment:hover,
    .trigger-disabled .trigger-segment:active {
      box-shadow: none;
    }

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      .container {
        border: 1px solid ButtonText;
      }
      .divider {
        background: ButtonBorder;
      }
      .primary-segment:focus-visible,
      .trigger-segment:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
      .disabled .container,
      .disabled {
        border-color: GrayText;
      }
      .disabled .primary-segment,
      .disabled .trigger-segment {
        color: GrayText;
      }
    }
  `;

  declare variant: ButtonVariant;
  declare disabled: boolean;
  declare triggerDisabled: boolean;
  declare triggerLabel: string;
  declare menuPlacement: Placement;
  declare open: boolean;

  constructor() {
    super();
    this.variant = "primary";
    this.disabled = false;
    this.triggerDisabled = false;
    this.triggerLabel = "More options";
    this.menuPlacement = "bottom-start";
    this.open = false;
  }

  render() {
    const isDisabled = this.disabled;
    const isTriggerDisabled = this.triggerDisabled || isDisabled;

    const containerClasses = [
      "container",
      isDisabled ? "disabled" : this.variant,
      !isDisabled && this.triggerDisabled ? "trigger-disabled" : "",
      this.variant === "outline" ? "outline" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div part="container" class=${containerClasses}>
        <button
          part="primary"
          class="primary-segment"
          type="button"
          ?disabled=${isDisabled}
        >
          <slot name="icon-start"></slot>
          <span class="label"><slot></slot></span>
        </button>
        <span part="divider" class="divider"></span>
        <button
          part="trigger"
          class="trigger-segment"
          type="button"
          id="trigger"
          aria-haspopup="menu"
          aria-expanded=${this.open ? "true" : "false"}
          aria-label=${this.triggerLabel}
          ?disabled=${isTriggerDisabled}
        >
          <fd-icon name="caret-down" aria-hidden="true"></fd-icon>
        </button>
      </div>
      <fd-menu
        anchor="trigger"
        placement=${this.menuPlacement}
        label=${this.triggerLabel}
      ></fd-menu>
      <slot name="menu" hidden @slotchange=${this._onMenuSlotChange}></slot>
    `;
  }

  private _onMenuSlotChange(_e: Event) {
    // Implemented in Task 2
  }
}

if (!customElements.get("fd-split-button")) {
  customElements.define("fd-split-button", FdSplitButton);
}
```

**Step 4: Run tests to verify they pass**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-split-button.ts packages/components/src/components/fd-split-button.test.ts
git commit -m "feat(split-button): add component skeleton with two-segment rendering (#18)"
```

---

### Task 2: DOM Adoption

**Files:**
- Modify: `packages/components/src/components/fd-split-button.test.ts`
- Modify: `packages/components/src/components/fd-split-button.ts`

**Step 1: Write failing tests for item adoption**

Add to the test file's `describe` block:

```typescript
  // --- DOM Adoption ---

  it("adopts fd-menu-item children into internal fd-menu", async () => {
    const el = await createSplitButton();
    // Wait for slotchange + adoption
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe("Save as Draft");
    expect(items[1].textContent).toBe("Save & Submit");
  });

  it("strips slot attribute from adopted items", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    for (const item of items) {
      expect(item.hasAttribute("slot")).toBe(false);
    }
  });

  it("preserves consumer order during adoption", async () => {
    const el = await createSplitButton({}, "Save", [
      "First",
      "Second",
      "Third",
    ]);
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    expect(items[0].textContent).toBe("First");
    expect(items[1].textContent).toBe("Second");
    expect(items[2].textContent).toBe("Third");
  });

  it("warns and rejects non-fd-menu-item children", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const el = document.createElement("fd-split-button") as any;
    el.innerHTML = `
      Save
      <fd-menu-item slot="menu">Valid</fd-menu-item>
      <div slot="menu">Invalid</div>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    expect(items.length).toBe(1);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("re-adopts when menu items change", async () => {
    const el = await createSplitButton({}, "Save", ["First"]);
    await new Promise((r) => requestAnimationFrame(r));

    // Add a new item
    const newItem = document.createElement("fd-menu-item");
    newItem.setAttribute("slot", "menu");
    newItem.textContent = "Second";
    el.appendChild(newItem);

    // Wait for slotchange
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const menu = getInternalMenu(el);
    const items = menu.querySelectorAll("fd-menu-item");
    expect(items.length).toBe(2);
  });
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: FAIL — adoption tests fail (items not in fd-menu)

**Step 3: Implement DOM adoption in `_onMenuSlotChange`**

Replace the empty `_onMenuSlotChange` method in `fd-split-button.ts`:

```typescript
  private _onMenuSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    const menu = this.shadowRoot?.querySelector("fd-menu");
    if (!menu) return;

    // Clear existing adopted children
    while (menu.firstChild) {
      menu.removeChild(menu.firstChild);
    }

    // Adopt valid items
    for (const el of assigned) {
      if (el.tagName.toLowerCase() === "fd-menu-item") {
        el.removeAttribute("slot");
        menu.appendChild(el);
      } else {
        console.warn(
          "fd-split-button: only fd-menu-item elements are supported in the menu slot. Received:",
          el.tagName.toLowerCase(),
        );
      }
    }

    // If menu is open and now empty, close it
    if (this.open && menu.querySelectorAll("fd-menu-item").length === 0) {
      (menu as any).hide();
    }
  }
```

**Step 4: Run tests to verify they pass**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-split-button.ts packages/components/src/components/fd-split-button.test.ts
git commit -m "feat(split-button): implement DOM adoption for menu items (#18)"
```

---

### Task 3: Primary Segment — Action Event

**Files:**
- Modify: `packages/components/src/components/fd-split-button.test.ts`
- Modify: `packages/components/src/components/fd-split-button.ts`

**Step 1: Write failing tests for primary action**

```typescript
  // --- Primary segment ---

  it("fires fd-split-action on primary click", async () => {
    const el = await createSplitButton();
    const spy = vi.fn();
    el.addEventListener("fd-split-action", spy);

    getPrimary(el).click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it("does not fire fd-split-action on trigger click", async () => {
    const el = await createSplitButton();
    const spy = vi.fn();
    el.addEventListener("fd-split-action", spy);

    getTrigger(el).click();

    expect(spy).not.toHaveBeenCalled();
  });

  it("does not fire fd-split-action when disabled", async () => {
    const el = await createSplitButton({ disabled: "" });
    const spy = vi.fn();
    el.addEventListener("fd-split-action", spy);

    getPrimary(el).click();

    expect(spy).not.toHaveBeenCalled();
  });
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: FAIL — no fd-split-action fired

**Step 3: Add primary click handler**

Add to the class:

```typescript
  private _onPrimaryClick() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("fd-split-action", {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }
```

Add to the primary button in `render()`:

```typescript
        <button
          part="primary"
          class="primary-segment"
          type="button"
          ?disabled=${isDisabled}
          @click=${this._onPrimaryClick}
        >
```

**Step 4: Run tests to verify they pass**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-split-button.ts packages/components/src/components/fd-split-button.test.ts
git commit -m "feat(split-button): fire fd-split-action on primary activation (#18)"
```

---

### Task 4: Trigger Segment — Menu Toggle & Keyboard

**Files:**
- Modify: `packages/components/src/components/fd-split-button.test.ts`
- Modify: `packages/components/src/components/fd-split-button.ts`

**Step 1: Write failing tests for trigger behavior**

```typescript
  // --- Trigger segment ---

  it("trigger click opens menu", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();

    expect(getInternalMenu(el).open).toBe(true);
  });

  it("trigger click toggles menu closed", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();
    expect(getInternalMenu(el).open).toBe(true);

    getTrigger(el).click();
    expect(getInternalMenu(el).open).toBe(false);
  });

  it("trigger does not open menu when trigger-disabled", async () => {
    const el = await createSplitButton({ "trigger-disabled": "" });
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();

    expect(getInternalMenu(el).open).toBe(false);
  });

  it("trigger does not open menu when disabled", async () => {
    const el = await createSplitButton({ disabled: "" });
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();

    expect(getInternalMenu(el).open).toBe(false);
  });

  it("ArrowDown on trigger opens menu", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    trigger.dispatchEvent(event);

    expect(getInternalMenu(el).open).toBe(true);
    expect(preventSpy).toHaveBeenCalled();
  });

  it("ArrowUp on trigger opens menu and focuses last item", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    trigger.dispatchEvent(event);

    expect(getInternalMenu(el).open).toBe(true);
    expect(preventSpy).toHaveBeenCalled();
  });

  it("Enter on trigger toggles menu", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(getInternalMenu(el).open).toBe(true);
  });

  it("Space on trigger toggles menu and prevents scroll", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    const trigger = getTrigger(el);
    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    trigger.dispatchEvent(event);

    expect(getInternalMenu(el).open).toBe(true);
    expect(preventSpy).toHaveBeenCalled();
  });
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: FAIL — trigger click does nothing, keyboard does nothing

**Step 3: Add trigger click and keydown handlers**

Add to the class:

```typescript
  private _onTriggerClick() {
    if (this.disabled || this.triggerDisabled) return;
    const menu = this.shadowRoot?.querySelector("fd-menu") as any;
    if (!menu) return;
    menu.toggle();
  }

  private _onTriggerKeydown(e: KeyboardEvent) {
    if (this.disabled || this.triggerDisabled) return;
    const menu = this.shadowRoot?.querySelector("fd-menu") as any;
    if (!menu) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (!menu.open) menu.show();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!menu.open) menu.showLast();
        break;
      }
      case "Enter": {
        e.preventDefault();
        menu.toggle();
        break;
      }
      case " ": {
        e.preventDefault();
        menu.toggle();
        break;
      }
    }
  }
```

Update trigger button in `render()`:

```typescript
        <button
          part="trigger"
          class="trigger-segment"
          type="button"
          id="trigger"
          aria-haspopup="menu"
          aria-expanded=${this.open ? "true" : "false"}
          aria-label=${this.triggerLabel}
          ?disabled=${isTriggerDisabled}
          @click=${this._onTriggerClick}
          @keydown=${this._onTriggerKeydown}
        >
```

**Step 4: Run tests to verify they pass**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-split-button.ts packages/components/src/components/fd-split-button.test.ts
git commit -m "feat(split-button): add trigger toggle and keyboard support (#18)"
```

---

### Task 5: State Sync — Open State & Events

**Files:**
- Modify: `packages/components/src/components/fd-split-button.test.ts`
- Modify: `packages/components/src/components/fd-split-button.ts`

**Step 1: Write failing tests for state sync**

```typescript
  // --- State sync ---

  it("open reflects menu state", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();
    expect(el.open).toBe(true);

    getTrigger(el).click();
    expect(el.open).toBe(false);
  });

  it("fires fd-split-open when menu opens", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));
    const spy = vi.fn();
    el.addEventListener("fd-split-open", spy);

    getTrigger(el).click();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(true);
  });

  it("fires fd-split-open when menu closes", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();

    const spy = vi.fn();
    el.addEventListener("fd-split-open", spy);

    getTrigger(el).click();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.open).toBe(false);
  });

  it("aria-expanded updates with open state", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();
    await el.updateComplete;
    expect(getTrigger(el).getAttribute("aria-expanded")).toBe("true");

    getTrigger(el).click();
    await el.updateComplete;
    expect(getTrigger(el).getAttribute("aria-expanded")).toBe("false");
  });
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: FAIL — open doesn't sync, no fd-split-open event

**Step 3: Add fd-open listener and state sync**

Add to the `render()` method on the `<fd-menu>`:

```typescript
      <fd-menu
        anchor="trigger"
        placement=${this.menuPlacement}
        label=${this.triggerLabel}
        @fd-open=${this._onMenuOpen}
      ></fd-menu>
```

Add the handler:

```typescript
  private _disconnecting = false;

  private _onMenuOpen(e: CustomEvent) {
    if (this._disconnecting) return;
    this.open = e.detail.open;
    this.dispatchEvent(
      new CustomEvent("fd-split-open", {
        bubbles: true,
        composed: true,
        detail: { open: e.detail.open },
      }),
    );
  }
```

**Step 4: Run tests to verify they pass**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-split-button.ts packages/components/src/components/fd-split-button.test.ts
git commit -m "feat(split-button): sync open state from fd-menu events (#18)"
```

---

### Task 6: Disabled Transitions — Close on Disable

**Files:**
- Modify: `packages/components/src/components/fd-split-button.test.ts`
- Modify: `packages/components/src/components/fd-split-button.ts`

**Step 1: Write failing tests for close-on-disable**

```typescript
  // --- Disabled transitions ---

  it("closes menu when disabled becomes true", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();
    expect(getInternalMenu(el).open).toBe(true);

    el.disabled = true;
    await el.updateComplete;

    expect(getInternalMenu(el).open).toBe(false);
  });

  it("closes menu when trigger-disabled becomes true", async () => {
    const el = await createSplitButton();
    await new Promise((r) => requestAnimationFrame(r));

    getTrigger(el).click();
    expect(getInternalMenu(el).open).toBe(true);

    el.triggerDisabled = true;
    await el.updateComplete;

    expect(getInternalMenu(el).open).toBe(false);
  });
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: FAIL — menu stays open

**Step 3: Add `updated()` lifecycle with transition detection**

Add to the class:

```typescript
  private _prevDisabled = false;
  private _prevTriggerDisabled = false;

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);

    // Close menu on disabled transition (false -> true)
    if (changed.has("disabled") && this.disabled && !this._prevDisabled && this.open) {
      const menu = this.shadowRoot?.querySelector("fd-menu") as any;
      menu?.hide();
    }
    if (changed.has("triggerDisabled") && this.triggerDisabled && !this._prevTriggerDisabled && this.open) {
      const menu = this.shadowRoot?.querySelector("fd-menu") as any;
      menu?.hide();
    }

    this._prevDisabled = this.disabled;
    this._prevTriggerDisabled = this.triggerDisabled;
  }

  override disconnectedCallback() {
    this._disconnecting = true;
    const menu = this.shadowRoot?.querySelector("fd-menu") as any;
    if (menu?.open) menu.hide();
    super.disconnectedCallback();
    this._disconnecting = false;
  }
```

**Note:** The `_prevDisabled` / `_prevTriggerDisabled` pattern detects transitions. Lit's `changed` map tells us the property changed, but the old value in the map is the *previous* value. We can simplify by using `changed.get("disabled")` to read the old value:

```typescript
  override updated(changed: Map<string, unknown>) {
    super.updated(changed);

    if (changed.has("disabled") && this.disabled && this.open) {
      const menu = this.shadowRoot?.querySelector("fd-menu") as any;
      menu?.hide();
    }
    if (changed.has("triggerDisabled") && this.triggerDisabled && this.open) {
      const menu = this.shadowRoot?.querySelector("fd-menu") as any;
      menu?.hide();
    }
  }

  override disconnectedCallback() {
    this._disconnecting = true;
    const menu = this.shadowRoot?.querySelector("fd-menu") as any;
    if (menu?.open) menu.hide();
    super.disconnectedCallback();
    this._disconnecting = false;
  }
```

Using `changed.has("disabled") && this.disabled` is sufficient: `changed.has()` means it changed, and `this.disabled` means it's now true — so it transitioned false→true. Remove the `_prevDisabled` / `_prevTriggerDisabled` fields.

**Step 4: Run tests to verify they pass**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-split-button.ts packages/components/src/components/fd-split-button.test.ts
git commit -m "feat(split-button): close menu on disabled transitions (#18)"
```

---

### Task 7: Accessibility — Axe Audit

**Files:**
- Modify: `packages/components/src/components/fd-split-button.test.ts`

**Step 1: Write axe tests**

```typescript
import { expectNoAxeViolations } from "./test-a11y.js";

  // --- Accessibility ---

  it("has no axe violations for default split button", async () => {
    const el = await createSplitButton({}, "Save");
    await new Promise((r) => requestAnimationFrame(r));

    const container = getContainer(el);
    await expectNoAxeViolations(container);
  });

  it("has no axe violations when disabled", async () => {
    const el = await createSplitButton({ disabled: "" }, "Save");
    await new Promise((r) => requestAnimationFrame(r));

    const container = getContainer(el);
    await expectNoAxeViolations(container);
  });

  it("has no axe violations with custom trigger-label", async () => {
    const el = await createSplitButton(
      { "trigger-label": "More save options" },
      "Save",
    );
    await new Promise((r) => requestAnimationFrame(r));

    const container = getContainer(el);
    await expectNoAxeViolations(container);
  });
```

**Step 2: Run tests to verify they pass (or fail if ARIA is wrong)**

Run: `cd packages/components && npx vitest run src/components/fd-split-button.test.ts`
Expected: PASS (if ARIA attributes are correct). If they fail, fix the ARIA issues in the component.

**Step 3: Commit**

```bash
git add packages/components/src/components/fd-split-button.test.ts
git commit -m "test(split-button): add axe accessibility audits (#18)"
```

---

### Task 8: Export from Package Index

**Files:**
- Modify: `packages/components/src/index.ts`

**Step 1: Add export**

Add to `packages/components/src/index.ts`:

```typescript
export { FdSplitButton } from "./components/fd-split-button.js";
```

**Step 2: Run build to verify**

Run: `cd packages/components && npx tsup src/index.ts --format esm --dts --clean`
Expected: Build succeeds with no errors

**Step 3: Run all tests to verify nothing broke**

Run: `cd packages/components && npx vitest run`
Expected: All PASS

**Step 4: Commit**

```bash
git add packages/components/src/index.ts
git commit -m "feat(split-button): export FdSplitButton from package index (#18)"
```

---

### Task 9: Storybook Stories

**Files:**
- Create: `apps/storybook/src/fd-split-button.stories.ts`

**Reference:** Read `apps/storybook/src/fd-button.stories.ts` and `apps/storybook/src/fd-menu.stories.ts` (if it exists) for the established Storybook patterns in this repo — meta structure, argTypes, play function conventions.

**Step 1: Write stories**

Create comprehensive stories covering:
- **Playground** — interactive with all controls (variant, disabled, triggerDisabled, triggerLabel)
- **Primary** — default variant
- **Neutral** — neutral variant
- **Subtle** — subtle variant
- **Outline** — outline variant
- **Destructive** — destructive variant
- **AllVariants** — grid showing all five variants side by side
- **WithIcon** — primary segment with icon-start slot
- **Disabled** — both segments disabled
- **TriggerDisabled** — only trigger disabled, primary active
- **AllVariantsDisabled** — grid of all variants in disabled state
- **DocsOverview** — composite story for autodocs showing key states

Each story should include realistic banking/regulatory content (e.g., "Save", "Submit Filing", "Export Report") per the CLAUDE.md content guidelines.

Stories that test interactive behavior (Playground, Primary) should include `play` functions that verify basic rendering using `@storybook/test` utilities (`expect`, `within`).

**Step 2: Run Storybook build to verify**

Run: `cd apps/storybook && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/storybook/src/fd-split-button.stories.ts
git commit -m "feat(storybook): add fd-split-button stories (#18)"
```

---

### Task 10: Component Documentation

**Files:**
- Create: `apps/docs/components/split-button.md`
- Modify: `apps/docs/.vitepress/config.ts` (add to sidebar nav)

**Reference:** Read existing component docs (e.g., `apps/docs/components/button.md`) for the documentation pattern — structure, sections, Storybook embed format, accessibility guidance format.

**Step 1: Write documentation**

The docs page should include:
- Overview explaining what a split button is and when to use it
- **When to use / When not to use** — per issue #18's guidance: use for a single primary action with related alternates; don't use when actions are unrelated, when there are many options, or when the primary action isn't obvious
- Usage example with code
- Properties table
- Slots table
- Events table
- CSS custom properties table
- Storybook embed for live examples
- Accessibility section covering keyboard behavior, screen reader naming, ARIA attributes
- Content guidance: primary label should be the most common action, trigger should be named contextually
- Cross-reference to button component docs

**Step 2: Add to sidebar navigation**

Add the split-button page to the components section in `apps/docs/.vitepress/config.ts`.

**Step 3: Build docs to verify**

Run: `cd apps/docs && npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add apps/docs/components/split-button.md apps/docs/.vitepress/config.ts
git commit -m "docs(split-button): add component documentation page (#18)"
```

---

### Task 11: Final Verification

**Step 1: Run all component tests**

Run: `cd packages/components && npx vitest run`
Expected: All PASS

**Step 2: Build the component package**

Run: `cd packages/components && npx tsup src/index.ts --format esm --dts --clean`
Expected: Clean build, no errors

**Step 3: Build Storybook**

Run: `cd apps/storybook && npm run build`
Expected: Clean build

**Step 4: Build docs**

Run: `cd apps/docs && npm run build`
Expected: Clean build

**Step 5: Commit any remaining fixes, then create final commit or PR branch**

If all builds pass, the implementation is complete. Use `superpowers:finishing-a-development-branch` to decide merge strategy.
