import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

export interface FdPageHeaderBreadcrumb {
  label: string;
  href: string;
}

const SEPARATOR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>';

/**
 * `fd-page-header` — Page-level header with breadcrumbs, title, optional kicker, and actions.
 *
 * Renders on a brand-blue background with inverted (white) text.
 */
export class FdPageHeader extends LitElement {
  static properties = {
    heading: { reflect: true },
    kicker: { reflect: true },
    breadcrumbs: { attribute: false },
    breadcrumbLabel: { attribute: "breadcrumb-label", reflect: true },
    _hasActions: { state: true },
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
      color: var(--fd-page-header-text-color, var(--fdic-text-inverted, #ffffff));
    }

    :host([hidden]) {
      display: none;
    }

    /* --- Section (full-width brand bg) --- */

    .base {
      display: block;
      box-sizing: border-box;
      background: var(
        --fd-page-header-bg,
        var(--fdic-brand-core-default, #0d6191)
      );
      padding-block: var(--fd-page-header-padding-block, 48px);
      padding-inline: var(--fd-page-header-padding-inline, 64px);
    }

    /* --- Content (constrained width) --- */

    .content {
      max-inline-size: var(--fd-page-header-max-width, 1440px);
      margin-inline: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* --- Breadcrumbs --- */

    .breadcrumbs {
      margin: 0;
      padding: 0;
    }

    .breadcrumb-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: var(--fd-page-header-breadcrumb-font-size, 16px);
      line-height: 1.375;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb-link {
      color: var(
        --fd-page-header-breadcrumb-color,
        var(--fdic-text-inverted, #ffffff)
      );
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.12em;
    }

    .breadcrumb-link:hover {
      text-decoration-thickness: 2px;
    }

    .breadcrumb-link:focus-visible {
      outline: 2px solid var(--fdic-border-input-focus, #38b6ff);
      outline-offset: 2px;
      border-radius: 2px;
    }

    .breadcrumb-current {
      color: var(
        --fd-page-header-breadcrumb-current-color,
        var(--fdic-text-inverted, #ffffff)
      );
    }

    .breadcrumb-separator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 16px;
      block-size: 16px;
      color: var(
        --fd-page-header-separator-color,
        var(--fdic-text-inverted, #ffffff)
      );
      flex-shrink: 0;
    }

    .breadcrumb-separator svg {
      inline-size: 100%;
      block-size: 100%;
    }

    /* --- Heading container --- */

    .heading-container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 12px;
    }

    /* --- Nameplate (title + kicker) --- */

    .nameplate {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1 0 0;
      min-inline-size: 344px;
    }

    .title {
      font-size: var(--fd-page-header-title-size, 40.5px);
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.01em;
      color: inherit;
      margin: 0;
      overflow-wrap: anywhere;
    }

    .kicker {
      display: block;
      font-size: var(--fd-page-header-kicker-size, 20px);
      font-weight: 450;
      line-height: 1.25;
      color: inherit;
      margin: 0;
    }

    /* --- Actions --- */

    .actions {
      display: flex;
      align-items: flex-end;
      gap: var(--fd-page-header-actions-gap, 8px);
      flex-shrink: 0;
      padding-block-end: var(--fd-page-header-actions-offset, 8px);
    }

    .actions-hidden {
      display: none;
    }

    /* --- Responsive (≤640px) --- */

    @media (max-width: 640px) {
      .base {
        padding-block-start: var(
          --fd-page-header-padding-block-start-mobile,
          16px
        );
        padding-block-end: var(
          --fd-page-header-padding-block-end-mobile,
          20px
        );
        padding-inline: var(--fd-page-header-padding-inline-mobile, 16px);
      }

      .title {
        font-size: var(--fd-page-header-title-size-mobile, 28px);
      }

      .kicker {
        font-size: var(--fd-page-header-kicker-size-mobile, 18px);
      }

      .nameplate {
        min-inline-size: 0;
      }

      .heading-container {
        flex-direction: column;
        align-items: flex-start;
      }

      .actions {
        padding-block-end: 0;
        gap: var(--fd-page-header-actions-gap-mobile, 6px);
      }
    }

    /* --- Print --- */

    @media print {
      .base {
        background: none;
        padding: 0;
      }

      :host {
        color: #000;
      }

      .breadcrumbs {
        display: none;
      }

      .actions {
        display: none;
      }

      .kicker {
        color: #333;
      }
    }

    /* --- Forced colors --- */

    @media (forced-colors: active) {
      .base {
        background: Canvas;
        border-block-end: 2px solid ButtonText;
      }

      :host {
        color: CanvasText;
      }

      .breadcrumb-link {
        color: LinkText;
      }

      .breadcrumb-current {
        color: CanvasText;
      }

      .breadcrumb-separator {
        color: CanvasText;
      }

      .kicker {
        color: GrayText;
      }

      .breadcrumb-link:focus-visible {
        outline-color: Highlight;
      }
    }
  `;

  declare heading: string;
  declare kicker: string;
  declare breadcrumbs: FdPageHeaderBreadcrumb[];
  declare breadcrumbLabel: string;
  declare _hasActions: boolean;

  private readonly _actionsObserver: MutationObserver;

  constructor() {
    super();
    this.heading = "";
    this.kicker = "";
    this.breadcrumbs = [];
    this.breadcrumbLabel = "Breadcrumbs";
    this._hasActions = false;
    this._actionsObserver = new MutationObserver(() => {
      this._syncActionsContent();
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this._syncActionsContent();
    this._actionsObserver.observe(this, { childList: true });
  }

  override disconnectedCallback() {
    this._actionsObserver.disconnect();
    super.disconnectedCallback();
  }

  private _syncActionsContent() {
    this._hasActions = Array.from(this.children).some(
      (child) => (child as HTMLElement).slot === "actions",
    );
  }

  private _handleActionsSlotChange = (event: Event) => {
    const slot = event.currentTarget as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._hasActions = nodes.some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
    });
  };

  private _renderBreadcrumbs() {
    const items = this.breadcrumbs;
    if (!Array.isArray(items) || items.length === 0) return nothing;

    return html`
      <nav
        part="breadcrumbs"
        class="breadcrumbs"
        aria-label=${this.breadcrumbLabel}
      >
        <ol class="breadcrumb-list">
          ${items.map((item, index) => {
            const isLast = index === items.length - 1;
            return html`
              <li class="breadcrumb-item">
                ${index > 0
                  ? html`<span
                      class="breadcrumb-separator"
                      aria-hidden="true"
                      >${unsafeSVG(SEPARATOR_SVG)}</span
                    >`
                  : nothing}
                ${isLast
                  ? html`<span
                      class="breadcrumb-current"
                      aria-current="page"
                      >${item.label}</span
                    >`
                  : html`<a class="breadcrumb-link" href=${item.href}
                      >${item.label}</a
                    >`}
              </li>
            `;
          })}
        </ol>
      </nav>
    `;
  }

  private _renderKicker() {
    const text = (this.kicker ?? "").trim();
    if (!text) return nothing;

    return html`<span part="kicker" class="kicker">${text}</span>`;
  }

  render() {
    const headingText = (this.heading ?? "").trim();
    if (!headingText) return nothing;

    const actionsClass = this._hasActions ? "actions" : "actions actions-hidden";

    return html`
      <div part="base" class="base">
        <div class="content">
          ${this._renderBreadcrumbs()}
          <div class="heading-container">
            <div part="nameplate" class="nameplate">
              <h1 part="title" class="title">${headingText}</h1>
              ${this._renderKicker()}
            </div>
            <div part="actions" class=${actionsClass}>
              <slot
                name="actions"
                @slotchange=${this._handleActionsSlotChange}
              ></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
