import { LitElement, css, html } from "lit";
import { normalizePillType } from "./chip-common.js";
import type { PillType } from "./chip-common.js";

export type BadgeType = PillType;

/**
 * `fd-badge` — Static label pill for tags and statuses.
 */
export class FdBadge extends LitElement {
  static properties = {
    type: { reflect: true },
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
      min-block-size: var(--fd-badge-height, 28px);
      max-inline-size: 100%;
      box-sizing: border-box;
      padding-block: var(--fdic-spacing-2xs, 4px);
      padding-inline: var(
        --fd-badge-padding-inline,
        var(--fdic-spacing-sm, 12px)
      );
      border-radius: var(--fd-badge-radius, 9999px);
      background: var(
        --fd-badge-bg-neutral,
        var(--ds-color-bg-interactive, #f5f5f7)
      );
      color: var(
        --fd-badge-text-color,
        var(--ds-color-text-primary, #212123)
      );
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
      font-size: var(
        --fd-badge-font-size,
        var(--fdic-font-size-body-small, 1rem)
      );
      line-height: 1.375;
    }

    .cool {
      background: var(
        --fd-badge-bg-cool,
        var(--ds-color-info-050, #f1f8fe)
      );
    }

    .warm {
      background: var(
        --fd-badge-bg-warm,
        var(--ds-color-secondary-050, #f8efda)
      );
    }

    .positive {
      background: var(
        --fd-badge-bg-positive,
        var(--ds-color-success-050, #e8f5e9)
      );
    }

    .alert {
      background: var(
        --fd-badge-bg-alert,
        var(--ds-color-error-050, #fdedea)
      );
    }

    .label {
      display: inline-flex;
      align-items: center;
      min-inline-size: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    @media (forced-colors: active) {
      .container {
        background: Canvas;
        color: CanvasText;
        border: 1px solid ButtonText;
      }
    }
  `;

  declare type: string;

  constructor() {
    super();
    this.type = "neutral";
  }

  render() {
    const tone = normalizePillType(this.type);

    return html`
      <span part="container" class=${`container ${tone}`}>
        <span part="label" class="label">
          <slot></slot>
        </span>
      </span>
    `;
  }
}
