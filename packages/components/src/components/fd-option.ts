import { LitElement, css, html, nothing } from "lit";

export class FdOption extends LitElement {
  static properties = {
    value: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    description: { reflect: true },
    _focused: { type: Boolean, state: true },
    _variant: { type: String, state: true },
  };

  static styles = css`
    :host {
      display: block;
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
      font-size: var(--fdic-font-size-body, 18px);
      line-height: 1.375;
      color: var(--fd-selector-option-text, var(--fdic-text-primary, #212123));
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }

    :host([hidden]) {
      display: none;
    }

    :host([disabled]) {
      cursor: default;
      color: var(--fdic-text-disabled, #9e9ea0);
    }

    [part="option"] {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      position: relative;
      background: var(--fd-selector-option-bg, var(--fdic-background-base, #ffffff));
      overflow: clip;
      min-height: 36px;
      box-sizing: border-box;
    }

    :host([selected]) [part="option"] {
      background: var(
        --fd-selector-option-bg-selected,
        var(--ds-color-bg-selected, #b4e4f8)
      );
    }

    :host(:not([disabled])) [part="option"]::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0);
      transition: box-shadow 0.15s ease;
    }

    :host(:not([disabled]):hover) [part="option"]::after {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-selector-option-bg-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    :host(:not([disabled]):active) [part="option"]::after {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-selector-option-bg-press,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    :host([data-focused]) [part="option"] {
      outline: 2px solid
        var(--fd-selector-focus-color, var(--fdic-border-input-focus, #38b6ff));
      outline-offset: -2px;
    }

    /* --- Indicator (radio / checkbox visual) --- */

    [part="indicator"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      color: var(--fd-selector-indicator-color, var(--fdic-text-primary, #212123));
    }

    :host([disabled]) [part="indicator"] {
      color: var(--fdic-text-disabled, #9e9ea0);
    }

    /* Radio indicator */
    .radio-outer {
      width: 14px;
      height: 14px;
      border-radius: 9999px;
      border: 2px solid currentColor;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radio-dot {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: transparent;
    }

    :host([selected]) .radio-outer {
      color: var(
        --fd-selector-indicator-selected,
        var(--ds-color-bg-active, #0d6191)
      );
    }

    :host([selected]) .radio-dot {
      background: currentColor;
    }

    /* Checkbox indicator */
    .checkbox-outer {
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 2px solid currentColor;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([selected]) .checkbox-outer {
      color: var(
        --fd-selector-indicator-selected,
        var(--ds-color-bg-active, #0d6191)
      );
      background: currentColor;
    }

    .checkbox-check {
      display: none;
      width: 10px;
      height: 10px;
    }

    :host([selected]) .checkbox-check {
      display: block;
      color: var(--fdic-text-inverted, #ffffff);
    }

    /* --- Text content --- */

    [part="option-text"] {
      flex: 1;
      min-width: 0;
    }

    .primary-text {
      display: block;
    }

    [part="option-description"] {
      display: block;
      color: var(--fdic-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      [part="option"] {
        forced-color-adjust: none;
      }

      :host([selected]) [part="option"] {
        background: Highlight;
        color: HighlightText;
      }

      :host([data-focused]) [part="option"] {
        outline-color: LinkText;
      }

      [part="indicator"] {
        color: ButtonText;
      }

      :host([selected]) [part="indicator"] {
        color: HighlightText;
      }

      :host([selected]) .checkbox-outer {
        background: HighlightText;
        color: Highlight;
      }

      :host([disabled]) [part="option"] {
        color: GrayText;
      }

      :host([disabled]) [part="indicator"] {
        color: GrayText;
      }
    }

    /* --- Reduced motion --- */
    @media (prefers-reduced-motion: reduce) {
      [part="option"]::after {
        transition: none !important;
      }
    }
  `;

  declare value: string;
  declare disabled: boolean;
  declare selected: boolean;
  declare description: string;
  declare _focused: boolean;
  declare _variant: "simple" | "single" | "multiple";

  constructor() {
    super();
    this.value = "";
    this.disabled = false;
    this.selected = false;
    this.description = "";
    this._focused = false;
    this._variant = "simple";
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "option");
    this._syncAria();
    this.addEventListener("click", this._onClick);
  }

  override disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    super.disconnectedCallback();
  }

  private _onClick = () => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("fd-option-select", {
        bubbles: true,
        composed: true,
        detail: { option: this },
      }),
    );
  };

  override updated() {
    this._syncAria();
  }

  private _syncAria() {
    this.setAttribute("aria-selected", String(this.selected));
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }
  }

  /** Returns the display text for this option (text content, not description). */
  get displayText(): string {
    return this.textContent?.trim() ?? "";
  }

  private _renderIndicator() {
    if (this._variant === "simple") return nothing;

    if (this._variant === "single") {
      return html`
        <span part="indicator" aria-hidden="true">
          <span class="radio-outer">
            <span class="radio-dot"></span>
          </span>
        </span>
      `;
    }

    // multiple
    return html`
      <span part="indicator" aria-hidden="true">
        <span class="checkbox-outer">
          <svg
            class="checkbox-check"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 5.5L4 8L8.5 2"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </span>
    `;
  }

  render() {
    return html`
      <div part="option">
        ${this._renderIndicator()}
        <span part="option-text">
          <span class="primary-text"><slot></slot></span>
          ${this.description
            ? html`<span part="option-description">${this.description}</span>`
            : nothing}
        </span>
      </div>
    `;
  }
}

if (!customElements.get("fd-option")) {
  customElements.define("fd-option", FdOption);
}
