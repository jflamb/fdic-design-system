import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { ButtonVariant } from "./fd-button.js";
import type { Placement } from "./placement.js";
import type { FdMenu } from "./fd-menu.js";
import "./fd-menu.js";
import "./fd-menu-item.js";
import "./fd-icon.js";

export class FdSplitButton extends LitElement {
  static properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    triggerDisabled: { attribute: "trigger-disabled", type: Boolean, reflect: true },
    triggerLabel: { attribute: "trigger-label" },
    menuPlacement: { attribute: "menu-placement" },
    open: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }
    :host([disabled]) {
      pointer-events: none;
    }

    /* --- Container --- */
    .container {
      display: inline-flex;
      align-items: stretch;
      border-radius: var(
        --fd-button-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      overflow: hidden;
    }

    /* --- Shared segment styles --- */
    .primary-segment,
    .trigger-segment {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-family: var(
        --fdic-font-family-sans-serif,
        "Source Sans 3",
        "Source Sans Pro",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        sans-serif
      );
      font-size: var(--fd-button-font-size, var(--fdic-font-size-body, 18px));
      line-height: 1.375;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      position: relative;
    }

    .primary-segment {
      gap: var(--fd-button-gap, var(--fdic-spacing-2xs, 4px));
      min-height: var(--fd-button-height, 44px);
      padding-inline: 7px;
      border-radius: 0;
    }

    .trigger-segment {
      min-width: var(--fd-split-button-trigger-width, 44px);
      min-height: var(--fd-button-height, 44px);
      padding-inline: 0;
      border-radius: 0;
    }

    /* --- Label --- */
    .label {
      display: inline-flex;
      align-items: center;
      padding-inline: 6px;
    }

    /* --- Focus --- */
    .primary-segment:focus,
    .trigger-segment:focus {
      outline: none;
    }
    .primary-segment:focus-visible,
    .trigger-segment:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px
          var(--fd-button-focus-gap, var(--ds-color-bg-input, #ffffff)),
        0 0 0 4px
          var(
            --fd-button-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
      z-index: 1;
    }

    /* --- Variant: Primary --- */
    .container.primary .primary-segment,
    .container.primary .trigger-segment {
      background-color: var(
        --fd-button-bg-primary,
        var(--ds-color-bg-active, #0d6191)
      );
      color: var(
        --fd-button-text-primary,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    /* --- Variant: Destructive --- */
    .container.destructive .primary-segment,
    .container.destructive .trigger-segment {
      background-color: var(
        --fd-button-bg-destructive,
        var(--ds-color-bg-destructive, #d80e3a)
      );
      color: var(
        --fd-button-text-destructive,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    /* --- Variant: Neutral --- */
    .container.neutral .primary-segment,
    .container.neutral .trigger-segment {
      background-color: var(
        --fd-button-bg-neutral,
        var(--ds-color-bg-interactive, #f5f5f7)
      );
      color: var(
        --fd-button-text-neutral,
        var(--ds-color-text-primary, #212123)
      );
      font-weight: 400;
    }

    /* --- Variant: Subtle --- */
    .container.subtle .primary-segment,
    .container.subtle .trigger-segment {
      background-color: transparent;
      color: var(
        --fd-button-text-subtle,
        var(--ds-color-text-primary, #212123)
      );
      font-weight: 400;
    }

    /* --- Variant: Outline --- */
    .container.outline {
      border: 2px solid
        var(--fd-button-border-outline, var(--ds-color-bg-active, #0d6191));
    }
    .container.outline .primary-segment,
    .container.outline .trigger-segment {
      background-color: var(--ds-color-bg-input, #ffffff);
      color: var(
        --fd-button-text-outline,
        var(--ds-color-text-link, #1278b0)
      );
      font-weight: 400;
    }

    /* --- Hover --- */
    .primary-segment:hover,
    .trigger-segment:hover {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    /* --- Active --- */
    .primary-segment:active,
    .trigger-segment:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Divider --- */
    .divider {
      width: var(--fd-split-button-divider-width, 1px);
      align-self: stretch;
      flex-shrink: 0;
    }

    /* Filled variants: semi-transparent white */
    .container.primary .divider,
    .container.destructive .divider {
      background-color: var(
        --fd-split-button-divider-color,
        rgba(255, 255, 255, 0.3)
      );
    }

    /* Light variants: standard divider */
    .container.neutral .divider,
    .container.subtle .divider,
    .container.outline .divider {
      background-color: var(
        --fd-split-button-divider-color,
        var(--fdic-border-divider, #bdbdbf)
      );
    }

    /* --- Disabled --- */
    .container.disabled .primary-segment,
    .container.disabled .trigger-segment {
      background-color: var(
        --fd-button-bg-disabled,
        var(--ds-color-bg-container, #f5f5f7)
      );
      color: var(
        --fd-button-text-disabled,
        var(--ds-color-text-disabled, #9e9ea0)
      );
      cursor: default;
    }
    .container.disabled .primary-segment:hover,
    .container.disabled .trigger-segment:hover,
    .container.disabled .primary-segment:active,
    .container.disabled .trigger-segment:active {
      box-shadow: none;
    }
    .container.disabled.outline {
      border-color: var(
        --fd-button-border-outline-disabled,
        var(--ds-color-border-input-disabled, #d6d6d8)
      );
    }
    .container.disabled .divider {
      background-color: var(
        --fd-split-button-divider-color,
        var(--fdic-border-divider, #bdbdbf)
      );
    }

    /* Trigger-disabled only */
    .trigger-segment[disabled] {
      background-color: var(
        --fd-button-bg-disabled,
        var(--ds-color-bg-container, #f5f5f7)
      );
      color: var(
        --fd-button-text-disabled,
        var(--ds-color-text-disabled, #9e9ea0)
      );
      cursor: default;
    }
    .trigger-segment[disabled]:hover,
    .trigger-segment[disabled]:active {
      box-shadow: none;
    }

    /* --- Slots --- */
    ::slotted([slot="icon-start"]) {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
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
      .container.disabled {
        border-color: GrayText;
      }
      .container.disabled .primary-segment,
      .container.disabled .trigger-segment {
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

  private _disconnecting = false;
  private _openSetInternally = false;

  constructor() {
    super();
    this.variant = "primary";
    this.disabled = false;
    this.triggerDisabled = false;
    this.triggerLabel = "More options";
    this.menuPlacement = "bottom-start";
    this.open = false;
  }

  // --- Internal menu reference ---

  private _getMenu(): FdMenu | null {
    return this.shadowRoot?.querySelector("fd-menu") as FdMenu | null;
  }

  // --- Task 2: DOM Adoption ---

  private _onMenuSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    const menu = this._getMenu();
    if (!menu) return;

    // Clear existing children from internal fd-menu
    while (menu.firstChild) {
      menu.removeChild(menu.firstChild);
    }

    let validCount = 0;
    for (const el of assigned) {
      if (el.tagName.toLowerCase() === "fd-menu-item") {
        el.removeAttribute("slot");
        menu.appendChild(el);
        validCount++;
      } else {
        console.warn(
          `[fd-split-button] Only <fd-menu-item> elements are allowed in the menu slot. Received <${el.tagName.toLowerCase()}>.`,
        );
      }
    }

    // If menu is open and now has zero items, close it
    if (this.open && validCount === 0) {
      menu.hide();
    }

    // Re-position if menu is open and still has items
    if (this.open && menu.querySelectorAll("fd-menu-item").length > 0) {
      (menu as any).hide();
      (menu as any).show();
    }
  }

  // --- Task 3: Primary Segment Action ---

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

  // --- Task 4: Trigger Toggle & Keyboard ---

  private _onTriggerClick() {
    if (this.disabled || this.triggerDisabled) return;
    const menu = this._getMenu();
    menu?.toggle();
  }

  private _onTriggerKeydown(e: KeyboardEvent) {
    if (this.disabled || this.triggerDisabled) return;
    const menu = this._getMenu();
    if (!menu) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!this.open) {
          menu.show();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!this.open) {
          menu.showLast();
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        menu.toggle();
        break;
    }
  }

  // --- Task 5: State Sync ---

  private _onMenuOpen(e: CustomEvent) {
    if (this._disconnecting) return;
    const newOpen = e.detail.open;
    if (this.open !== newOpen) {
      this._openSetInternally = true;
      this.open = newOpen;
    }
    this.dispatchEvent(
      new CustomEvent("fd-split-open", {
        bubbles: true,
        composed: true,
        detail: { open: newOpen },
      }),
    );
  }

  // --- Read-only open guard & disabled transitions ---

  private _needsMenuHide = false;

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("open") && !this._openSetInternally) {
      // External write — revert to match actual menu state
      const menu = this.shadowRoot?.querySelector("fd-menu") as any;
      if (menu) {
        this.open = menu.open ?? false;
      }
    }
    this._openSetInternally = false;

    // Close menu when disabled or trigger-disabled while open
    if (changed.has("disabled") && this.disabled && this.open) {
      this.open = false;
      this._needsMenuHide = true;
    }
    if (changed.has("triggerDisabled") && this.triggerDisabled && this.open) {
      this.open = false;
      this._needsMenuHide = true;
    }
  }

  override updated(_changed: PropertyValues) {
    super.updated(_changed);

    if (this._needsMenuHide) {
      this._needsMenuHide = false;
      const menu = this._getMenu();
      if (menu) {
        this._openSetInternally = true;
        menu.hide();
      }
    }
  }

  override disconnectedCallback() {
    this._disconnecting = true;
    if (this.open) {
      this._getMenu()?.hide();
    }
    super.disconnectedCallback();
    this._disconnecting = false;
  }

  render() {
    const isDisabled = this.disabled;
    const isTriggerDisabled = this.triggerDisabled || isDisabled;

    const containerClasses = {
      container: true,
      [this.variant]: true,
      disabled: isDisabled,
      "trigger-disabled": !isDisabled && this.triggerDisabled,
    };

    return html`
      <div part="container" class=${classMap(containerClasses)}>
        <button
          part="primary"
          class="primary-segment"
          ?disabled=${isDisabled}
          @click=${this._onPrimaryClick}
        >
          <slot name="icon-start"></slot>
          <span class="label"><slot></slot></span>
        </button>
        <span part="divider" class="divider"></span>
        <button
          part="trigger"
          class="trigger-segment"
          id="trigger"
          aria-haspopup="menu"
          aria-expanded=${this.open ? "true" : "false"}
          aria-label=${this.triggerLabel}
          ?disabled=${isTriggerDisabled}
          @click=${this._onTriggerClick}
          @keydown=${this._onTriggerKeydown}
        >
          <fd-icon name="caret-down" aria-hidden="true"></fd-icon>
        </button>
      </div>
      <fd-menu
        anchor="trigger"
        placement=${this.menuPlacement}
        label=${this.triggerLabel}
        @fd-open=${this._onMenuOpen}
      ></fd-menu>
      <slot name="menu" hidden @slotchange=${this._onMenuSlotChange}></slot>
    `;
  }
}

if (!customElements.get("fd-split-button")) {
  customElements.define("fd-split-button", FdSplitButton);
}
