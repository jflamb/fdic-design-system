import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";

/**
 * `fd-page-header-button` — Glassmorphism pill button for use inside `fd-page-header` actions.
 */
export class FdPageHeaderButton extends LitElement {
  static properties = {
    icon: { reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      display: inline-flex;
      align-items: center;
      gap: var(--fd-page-header-button-gap, 8px);
      padding-block: 4px;
      padding-inline-start: var(--fd-page-header-button-padding-start, 8px);
      padding-inline-end: var(--fd-page-header-button-padding-end, 12px);
      border: 1px solid
        var(--fd-page-header-button-border-color, var(--ds-color-border-glass));
      border-radius: var(--fd-page-header-button-radius, 9999px);
      background: var(--fd-page-header-button-background, var(--ds-gradient-glass-button));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: var(
        --fd-page-header-button-text-color,
        var(--ds-color-text-inverted, light-dark(#ffffff, #000000))
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
      font-size: var(--fd-page-header-button-font-size, 16px);
      font-weight: 400;
      line-height: 1.375;
      white-space: nowrap;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      margin: 0;
      overflow: clip;
    }

    .base::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
    }

    .base:hover::before {
      box-shadow: inset 0 0 0 999px
        var(--ds-color-overlay-hover, light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.08)));
    }

    .base:active::before {
      box-shadow: inset 0 0 0 999px
        var(--ds-color-overlay-pressed, light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.14)));
    }

    .base:focus {
      outline-color: transparent;
    }

    .base:focus-visible {
      outline-color: transparent;
      box-shadow: 0 0 0 2px var(--ds-color-bg-base, light-dark(#ffffff, #000000)),
        0 0 0 4px var(--ds-color-border-input-focus, light-dark(#38b6ff, #0d6191));
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-page-header-button-icon-size, 16px);
      block-size: var(--fd-page-header-button-icon-size, 16px);
      flex-shrink: 0;
    }

    .icon svg {
      inline-size: 100%;
      block-size: 100%;
    }

    @media (max-width: 640px) {
      .base {
        font-size: var(--fd-page-header-button-font-size-mobile, 14px);
        gap: var(--fd-page-header-button-gap-mobile, 6px);
        padding-inline-start: var(
          --fd-page-header-button-padding-start-mobile,
          6px
        );
        padding-inline-end: var(
          --fd-page-header-button-padding-end-mobile,
          8px
        );
      }

      .icon {
        inline-size: var(--fd-page-header-button-icon-size-mobile, 14px);
        block-size: var(--fd-page-header-button-icon-size-mobile, 14px);
      }
    }

    @media (forced-colors: active) {
      .base {
        border-color: ButtonText;
        color: ButtonText;
        background: Canvas;
        forced-color-adjust: none;
      }

      .base:hover::before,
      .base:active::before {
        box-shadow: none;
      }

      .base:focus-visible {
        box-shadow: none;
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }

    @media print {
      :host {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .base,
      .base::before {
        transition: none;
      }
    }
  `;

  declare icon: string;

  constructor() {
    super();
    this.icon = "";
  }

  private _renderIcon() {
    const name = (this.icon ?? "").trim();
    if (!name) return nothing;

    const svg = iconRegistry.get(name);
    if (!svg) return nothing;

    return html`<span part="icon" class="icon" aria-hidden="true"
      >${unsafeSVG(svg)}</span
    >`;
  }

  render() {
    return html`
      <button part="base" class="base" type="button">
        ${this._renderIcon()}
        <slot></slot>
      </button>
    `;
  }
}
