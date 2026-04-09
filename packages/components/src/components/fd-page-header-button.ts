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
      --fd-page-header-button-sheen: var(--ds-gradient-glass-sheen);
      --fd-page-header-button-shadow:
        0 10px 24px oklch(from var(--ds-color-neutral-1000) l c h / 0.16),
        0 2px 6px oklch(from var(--ds-color-neutral-1000) l c h / 0.12);
      --fd-page-header-button-shadow-hover:
        0 14px 28px oklch(from var(--ds-color-neutral-1000) l c h / 0.2),
        0 4px 10px oklch(from var(--ds-color-neutral-1000) l c h / 0.14);
      --fd-page-header-button-overlay-hover: var(--ds-color-overlay-brand-hover);
      --fd-page-header-button-overlay-active: var(--ds-color-overlay-brand-pressed);
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
      background:
        var(--fd-page-header-button-sheen),
        var(--fd-page-header-button-background, var(--ds-gradient-glass-button));
      backdrop-filter: blur(16px) saturate(165%);
      -webkit-backdrop-filter: blur(16px) saturate(165%);
      color: var(
        --fd-page-header-button-text-color,
        var(--ds-color-text-inverted)
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
      isolation: isolate;
      box-shadow:
        inset 0 1px 0 oklch(from var(--ds-color-neutral-000) l c h / 0.32),
        inset 0 -1px 0 oklch(from var(--ds-color-primary-900) l c h / 0.18),
        var(--fd-page-header-button-shadow);
      transition:
        box-shadow var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        transform 100ms cubic-bezier(0.2, 0.7, 0.2, 1),
        border-color var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        background var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background:
        radial-gradient(
          circle at top left,
          oklch(from var(--ds-color-neutral-000) l c h / 0.34) 0%,
          oklch(from var(--ds-color-neutral-000) l c h / 0) 60%
        );
      opacity: 0.95;
      transition:
        box-shadow var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base::after {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      border: 1px solid oklch(from var(--ds-color-neutral-000) l c h / 0.14);
      pointer-events: none;
      opacity: 0.7;
      transition: opacity var(--ds-motion-duration-fast, 120ms)
        cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base:hover {
      box-shadow:
        inset 0 1px 0 oklch(from var(--ds-color-neutral-000) l c h / 0.42),
        inset 0 -1px 0 oklch(from var(--ds-color-primary-900) l c h / 0.22),
        var(--fd-page-header-button-shadow-hover);
      transform: translateY(-1px);
    }

    .base:hover::before {
      box-shadow: inset 0 0 0 999px var(--fd-page-header-button-overlay-hover);
      opacity: 1;
    }

    .base:active::before {
      box-shadow: inset 0 0 0 999px var(--fd-page-header-button-overlay-active);
      opacity: 0.85;
    }

    .base:active {
      transform: translateY(0);
      box-shadow:
        inset 0 1px 0 oklch(from var(--ds-color-neutral-000) l c h / 0.24),
        inset 0 -1px 0 oklch(from var(--ds-color-primary-900) l c h / 0.28),
        0 6px 16px oklch(from var(--ds-color-neutral-1000) l c h / 0.16);
    }

    .base:hover::after,
    .base:focus-visible::after {
      opacity: 0.95;
    }

    .base:focus {
      outline-color: transparent;
    }

    .base:focus-visible {
      outline-color: transparent;
      box-shadow: 0 0 0 var(--ds-focus-gap-width, 2px) var(--ds-color-bg-base),
        0 0 0 var(--ds-focus-ring-width, 4px) var(--ds-focus-ring-color);
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
        box-shadow: none;
        forced-color-adjust: none;
      }

      .base:hover::before,
      .base:active::before,
      .base::after {
        box-shadow: none;
        background: none;
        opacity: 1;
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
