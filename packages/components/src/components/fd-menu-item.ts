import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { FdMenuItemSelectDetail } from "../public-events.js";

export type MenuItemVariant = "default" | "destructive";

export class FdMenuItem extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    variant: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      inline-size: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .base {
      display: flex;
      align-items: center;
      gap: var(--fd-menu-item-gap, var(--ds-spacing-xs, 8px));
      inline-size: 100%;
      padding: var(--ds-spacing-xs, 8px) var(--ds-spacing-sm, 12px);
      min-height: var(--fd-menu-item-min-height, 44px);
      border: none;
      background: none;
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--fd-menu-item-font-size, var(--fdic-font-size-body, 18px));
      line-height: 1.375;
      color: var(--ds-color-text-primary);
      text-align: start;
      cursor: pointer;
      box-sizing: border-box;
    }

    .base:hover {
      background-color: var(
        --ds-color-overlay-hover
      );
    }

    .base:focus {
      outline-color: transparent;
    }

    .base:focus-visible {
      background-color: var(
        --ds-color-overlay-pressed
      );
      outline: 2px solid var(--ds-focus-ring-color);
      outline-offset: -2px;
      border-radius: 2px;
    }

    .destructive {
      color: var(--fd-menu-item-destructive-color, var(--ds-color-bg-destructive));
    }

    .disabled {
      color: var(--ds-color-text-disabled);
      cursor: default;
    }

    .disabled:hover {
      background-color: transparent;
    }

    /* --- Slots --- */
    ::slotted([slot="icon-start"]) {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      .base {
        color: ButtonText;
      }
      .base:hover,
      .base:focus-visible {
        background-color: Highlight;
        color: HighlightText;
        outline-color: Highlight;
        forced-color-adjust: none;
      }
      .disabled {
        color: GrayText;
      }
      .disabled:hover {
        background-color: transparent;
        color: GrayText;
      }
    }

    /* --- Reduced motion guard --- */
    @media (prefers-reduced-motion: reduce) {
      .base {
        transition: none;
      }
    }
  `;

  declare disabled: boolean;
  declare variant: MenuItemVariant;

  constructor() {
    super();
    this.disabled = false;
    this.variant = "default";
  }

  private _dispatchSelectEvents() {
    const detail: FdMenuItemSelectDetail = {};

    this.dispatchEvent(
      new CustomEvent("fd-menu-item-select", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    // @deprecated Compatibility event. Remove in the next breaking major version.
    this.dispatchEvent(
      new CustomEvent("fd-select", {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    this._dispatchSelectEvents();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!this.disabled) {
        this._dispatchSelectEvents();
      }
    }
  }

  render() {
    const classes = {
      base: true,
      destructive: this.variant === "destructive",
      disabled: this.disabled,
    };

    return html`<button
      part="base"
      class=${classMap(classes)}
      role="menuitem"
      tabindex="-1"
      aria-disabled=${this.disabled ? "true" : "false"}
      @click=${this._handleClick}
      @keydown=${this._handleKeydown}
    >
      <slot name="icon-start"></slot>
      <slot></slot>
    </button>`;
  }
}
