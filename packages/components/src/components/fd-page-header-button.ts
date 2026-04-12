import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";

/**
 * `fd-page-header-button` — Convenience wrapper around `fd-button` for `fd-page-header` actions.
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

    fd-button {
      --fd-button-text-subtle: var(
        --fd-page-header-button-text-color,
        var(--fdic-color-text-inverted)
      );
      --fd-button-overlay-hover: var(
        --fd-page-header-button-overlay-hover,
        rgba(255, 255, 255, 0.12)
      );
      --fd-button-overlay-active: var(
        --fd-page-header-button-overlay-active,
        rgba(255, 255, 255, 0.18)
      );
      --fd-button-focus-gap: var(
        --fd-page-header-button-focus-gap,
        var(--fdic-color-primary-500)
      );
      --fd-button-focus-ring: var(
        --fd-page-header-button-focus-ring,
        var(--fdic-focus-ring-color)
      );
      --fd-button-gap: var(--fd-page-header-button-gap, var(--fdic-spacing-xs, 8px));
      --fd-button-height: var(--fd-page-header-button-height, 32px);
      --fd-button-font-size: var(
        --fd-page-header-button-font-size,
        var(--fdic-font-size-body-small, 16px)
      );
      --fd-button-radius: var(--fd-page-header-button-radius, var(--fdic-corner-radius-full, 9999px));
      --fd-button-icon-edge-padding: var(
        --fd-page-header-button-padding-end,
        var(--fdic-spacing-xs, 8px)
      );
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
      fd-button {
        --fd-button-gap: var(--fd-page-header-button-gap-mobile, 6px);
        --fd-button-font-size: var(--fd-page-header-button-font-size-mobile, 14px);
        --fd-button-height: var(--fd-page-header-button-height-mobile, 28px);
        --fd-button-icon-edge-padding: var(
          --fd-page-header-button-padding-end-mobile,
          6px
        );
      }

      .icon {
        inline-size: var(--fd-page-header-button-icon-size-mobile, 14px);
        block-size: var(--fd-page-header-button-icon-size-mobile, 14px);
      }
    }

    @media (forced-colors: active) {
      fd-button {
        --fd-button-text-subtle: ButtonText;
      }
    }

    @media print {
      :host {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      fd-button {
        --fd-button-spinner-speed: 0s;
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

    return html`<span
      slot="icon-start"
      part="icon"
      class="icon"
      aria-hidden="true"
      >${unsafeSVG(svg)}</span
    >`;
  }

  render() {
    return html`
      <fd-button part="base" variant="subtle" type="button">
        ${this._renderIcon()}
        <slot></slot>
      </fd-button>
    `;
  }
}
