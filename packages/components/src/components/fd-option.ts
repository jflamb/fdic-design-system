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
      color: var(--fd-selector-option-text, var(--ds-color-text-primary));
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }

    :host([hidden]) {
      display: none;
    }

    :host([disabled]) {
      cursor: default;
      color: var(--ds-color-text-disabled);
    }

    [part="option"] {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      position: relative;
      background: var(--fd-selector-option-bg, var(--ds-color-bg-base));
      overflow: clip;
      min-height: 36px;
      box-sizing: border-box;
    }

    :host([selected]) [part="option"] {
      background: var(
        --fd-selector-option-bg-selected,
        var(--ds-color-bg-selected)
      );
    }

    :host(:not([disabled])) [part="option"]::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0);
      transition: box-shadow var(--ds-motion-duration-normal, 150ms) var(--ds-motion-easing-default, ease);
    }

    :host(:not([disabled]):hover) [part="option"]::after {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-selector-option-bg-hover,
          var(--ds-color-overlay-hover)
        );
    }

    :host(:not([disabled]):active) [part="option"]::after {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-selector-option-bg-press,
          var(--ds-color-overlay-pressed)
        );
    }

    :host([data-focused]) [part="option"] {
      outline: 2px solid
        var(--fd-selector-focus-color, var(--ds-focus-ring-color));
      outline-offset: -2px;
    }

    /* --- Indicator (radio / checkbox visual) --- */

    [part="indicator"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      color: var(--fd-selector-indicator-color, var(--ds-color-text-primary));
    }

    :host([disabled]) [part="indicator"] {
      color: var(--ds-color-text-disabled);
    }

    /* Radio indicator */
    .radio-outer {
      width: 20px;
      height: 20px;
      border-radius: 9999px;
      border: 2px solid currentColor;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radio-dot {
      width: 8px;
      height: 8px;
      border-radius: 9999px;
      background: transparent;
    }

    :host([selected]) .radio-outer {
      color: var(
        --fd-selector-indicator-selected,
        var(--ds-color-bg-active)
      );
    }

    :host([selected]) .radio-dot {
      background: currentColor;
    }

    /* Checkbox indicator */
    .checkbox-outer {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      border: 2px solid currentColor;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([selected]) .checkbox-outer {
      color: var(
        --fd-selector-indicator-selected,
        var(--ds-color-bg-active)
      );
      background: currentColor;
    }

    .checkbox-check {
      display: none;
      width: 14px;
      height: 14px;
    }

    :host([selected]) .checkbox-check {
      display: block;
      color: var(--ds-color-text-inverted);
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
      color: var(--ds-color-text-secondary);
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

    @media print {
      [part="option"]::after {
        box-shadow: none;
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

  private _selectFired = false;

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "option");
    this._syncAria();
    this.addEventListener("click", this._onHostClick);
  }

  override disconnectedCallback() {
    this.removeEventListener("click", this._onHostClick);
    super.disconnectedCallback();
  }

  private _fireSelect() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("fd-option-select", {
        bubbles: true,
        composed: true,
        detail: { option: this },
      }),
    );
  }

  /**
   * Shadow DOM click: fires select and sets a flag so the host handler
   * skips the duplicate. The click event continues to bubble normally.
   */
  private _onShadowClick() {
    this._selectFired = true;
    this._fireSelect();
  }

  /**
   * Host click: handles programmatic .click() calls (tests, AT).
   * Skips if the shadow handler already fired for this click.
   */
  private _onHostClick = () => {
    if (this._selectFired) {
      this._selectFired = false;
      return;
    }
    this._fireSelect();
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
      <div part="option" @click=${this._onShadowClick}>
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
