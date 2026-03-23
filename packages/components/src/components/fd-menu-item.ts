import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";

export type MenuItemVariant = "default" | "destructive";

export class FdMenuItem extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    variant: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .base {
      display: flex;
      align-items: center;
      gap: var(--fd-menu-item-gap, var(--fdic-spacing-xs, 8px));
      width: 100%;
      padding: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-sm, 12px);
      border: none;
      background: none;
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
      font-size: var(--fd-menu-item-font-size, var(--fdic-font-size-body, 18px));
      line-height: 1.375;
      color: var(--fdic-text-primary, #212123);
      text-align: start;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .base:hover {
      background-color: var(
        --fdic-overlay-emphasize-100,
        rgba(0, 0, 0, 0.04)
      );
    }

    .base:focus {
      outline: none;
    }

    .base:focus-visible {
      background-color: var(
        --fdic-overlay-emphasize-200,
        rgba(0, 0, 0, 0.08)
      );
      outline: 2px solid var(--fdic-border-input-focus, #38b6ff);
      outline-offset: -2px;
      border-radius: 2px;
    }

    .destructive {
      color: var(--fd-menu-item-destructive-color, var(--ds-color-bg-destructive, #d80e3a));
    }

    .disabled {
      color: var(--fdic-text-disabled, var(--ds-color-text-disabled, #9e9ea0));
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

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("fd-select", {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!this.disabled) {
        this.dispatchEvent(
          new CustomEvent("fd-select", {
            bubbles: true,
            composed: true,
            detail: {},
          }),
        );
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
