import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";
import { normalizeLabelText, normalizePillType } from "./chip-common.js";
import type { FdChipRemoveDetail } from "../public-events.js";
import type { PillType } from "./chip-common.js";

export type ChipType = PillType;

/**
 * `fd-chip` — Dismissible pill with a native remove button.
 */
export class FdChip extends LitElement {
  static properties = {
    type: { reflect: true },
    removeLabel: { attribute: "remove-label", reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      max-inline-size: 100%;
    }

    .container {
      display: inline-flex;
      align-items: center;
      min-block-size: var(--fd-chip-height, 28px);
      max-inline-size: 100%;
      box-sizing: border-box;
      padding-inline-start: var(
        --fd-chip-padding-inline-start,
        var(--ds-spacing-sm, 12px)
      );
      border-radius: var(--fd-chip-radius, var(--ds-corner-radius-full, 9999px));
      background: var(
        --fd-chip-bg-neutral,
        var(--ds-color-bg-interactive, #f5f5f7)
      );
      color: var(
        --fd-chip-text-color,
        var(--ds-color-text-primary, #212123)
      );
      font-family: var(--ds-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(
        --fd-chip-font-size,
        var(--ds-font-size-body-small, 1rem)
      );
      line-height: 1.375;
    }

    .cool {
      background: var(
        --fd-chip-bg-cool,
        var(--ds-color-semantic-bg-info, #f1f8fe)
      );
    }

    .warm {
      background: var(
        --fd-chip-bg-warm,
        var(--ds-color-semantic-bg-warm, #f8efda)
      );
    }

    .positive {
      background: var(
        --fd-chip-bg-positive,
        var(--ds-color-semantic-bg-success, #e8f5e9)
      );
    }

    .alert {
      background: var(
        --fd-chip-bg-alert,
        var(--ds-color-semantic-bg-error, #fdedea)
      );
    }

    .label {
      display: inline-flex;
      align-items: center;
      min-inline-size: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
      padding-block: var(--ds-spacing-2xs, 4px);
    }

    .remove-wrap {
      display: inline-flex;
      align-items: center;
      padding-inline-start: var(
        --fd-chip-remove-gap,
        var(--ds-spacing-3xs, 2px)
      );
    }

    .remove-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-chip-remove-size, 28px);
      block-size: var(--fd-chip-remove-size, 28px);
      border: none;
      border-radius: var(--ds-corner-radius-full, 9999px);
      background: transparent;
      color: inherit;
      padding: 0;
      margin: 0;
      cursor: pointer;
      position: relative;
      flex: none;
      appearance: none;
      box-sizing: border-box;
    }

    .remove-button::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }

    .remove-button:hover::before {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-chip-remove-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    .remove-button:active::before {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-chip-remove-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    .remove-button:focus {
      outline-color: transparent;
    }

    .remove-button:focus-visible {
      outline-color: transparent;
      box-shadow: inset 0 0 0 2.5px
        var(
          --fd-chip-remove-focus-ring,
          var(--ds-color-border-input-focus, #38b6ff)
        );
    }

    .remove-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 16px;
      block-size: 16px;
      line-height: 0;
      pointer-events: none;
    }

    .remove-icon svg {
      inline-size: 100%;
      block-size: 100%;
    }

    @media (forced-colors: active) {
      .container {
        background: Canvas;
        color: CanvasText;
        border: 1px solid ButtonText;
      }

      .remove-button {
        color: ButtonText;
      }

      .remove-button:hover::before,
      .remove-button:active::before {
        box-shadow: none;
      }

      .remove-button:focus-visible {
        box-shadow: none;
        outline: 2px solid Highlight;
        outline-offset: 0;
      }
    }
  `;

  declare type: string;
  declare removeLabel: string | undefined;

  constructor() {
    super();
    this.type = "neutral";
    this.removeLabel = undefined;
  }

  override focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector<HTMLButtonElement>("[part=remove-button]")?.focus(options);
  }

  private _requestSlotRefresh() {
    this.requestUpdate();
  }

  private get _labelText() {
    return normalizeLabelText(this.textContent);
  }

  private get _computedRemoveLabel() {
    const override = normalizeLabelText(this.removeLabel);
    if (override) {
      return override;
    }

    const text = this._labelText;
    return text ? `Remove ${text}` : "Remove chip";
  }

  private _handleRemoveClick() {
    this.dispatchEvent(
      new CustomEvent<FdChipRemoveDetail>("fd-chip-remove", {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  private _renderIcon() {
    const svg = iconRegistry.get("x");

    if (!svg) {
      return html`<span aria-hidden="true">&times;</span>`;
    }

    return html`${unsafeSVG(svg)}`;
  }

  render() {
    const tone = normalizePillType(this.type);

    return html`
      <span part="container" class=${`container ${tone}`}>
        <span part="label" class="label">
          <slot @slotchange=${this._requestSlotRefresh}></slot>
        </span>
        <span class="remove-wrap">
          <button
            part="remove-button"
            class="remove-button"
            type="button"
            aria-label=${this._computedRemoveLabel}
            @click=${this._handleRemoveClick}
          >
            <span part="remove-icon" class="remove-icon" aria-hidden="true">
              ${this._renderIcon() ?? nothing}
            </span>
          </button>
        </span>
      </span>
    `;
  }
}
