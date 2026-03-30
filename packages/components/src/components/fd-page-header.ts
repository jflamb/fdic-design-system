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
      color: var(--fdic-text-primary, #212123);
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      display: block;
      box-sizing: border-box;
      max-inline-size: var(--fd-page-header-max-width, none);
      padding-block: var(--fd-page-header-padding-block, 24px);
      padding-inline: var(--fd-page-header-padding-inline, 24px);
      background: var(--fd-page-header-bg, transparent);
    }

    /* --- Breadcrumbs --- */

    .breadcrumbs {
      margin: 0;
      padding: 0;
      margin-block-end: var(--fd-page-header-breadcrumb-gap, 12px);
    }

    .breadcrumb-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--fd-page-header-breadcrumb-item-gap, 4px);
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: var(--fdic-line-height-body, 1.5);
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: var(--fd-page-header-breadcrumb-item-gap, 4px);
    }

    .breadcrumb-link {
      color: var(
        --fd-page-header-breadcrumb-color,
        var(--fdic-text-link, #1278b0)
      );
      text-decoration: underline;
      text-decoration-thickness: 6.25%;
      text-underline-offset: 12.5%;
    }

    .breadcrumb-link:hover {
      color: var(
        --fd-page-header-breadcrumb-hover-color,
        var(--link-unvisited-hover, #0d6191)
      );
      text-decoration-thickness: 2px;
    }

    .breadcrumb-link:focus-visible {
      outline: 2px solid
        var(--fd-page-header-focus-ring, var(--fdic-border-input-focus, #38b6ff));
      outline-offset: 2px;
      border-radius: 2px;
    }

    .breadcrumb-current {
      color: var(
        --fd-page-header-breadcrumb-current-color,
        var(--fdic-text-secondary, #595961)
      );
    }

    .breadcrumb-separator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-page-header-separator-size, 16px);
      block-size: var(--fd-page-header-separator-size, 16px);
      color: var(
        --fd-page-header-separator-color,
        var(--fdic-text-secondary, #595961)
      );
      flex-shrink: 0;
    }

    .breadcrumb-separator svg {
      inline-size: 100%;
      block-size: 100%;
    }

    /* --- Heading group --- */

    .heading-group {
      display: flex;
      flex-direction: column;
      gap: var(--fd-page-header-kicker-gap, 4px);
    }

    .heading-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--fd-page-header-actions-gap, 16px);
      flex-wrap: wrap;
    }

    .kicker {
      display: block;
      font-size: var(--fdic-font-size-body-small, 1rem);
      font-weight: 400;
      line-height: var(--fdic-line-height-body, 1.5);
      letter-spacing: var(--fdic-letter-spacing-0, 0);
      color: var(
        --fd-page-header-kicker-color,
        var(--fdic-text-secondary, #595961)
      );
      margin: 0;
    }

    .title {
      font-size: var(--fdic-font-size-h1, 2.5313rem);
      font-weight: 600;
      line-height: var(--fdic-line-height-h1, 1.15);
      letter-spacing: var(--fdic-letter-spacing-1, -0.01em);
      color: var(
        --fd-page-header-title-color,
        var(--fdic-text-primary, #212123)
      );
      margin: 0;
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }

    /* --- Actions --- */

    .actions {
      display: flex;
      align-items: center;
      gap: var(--fd-page-header-actions-item-gap, 8px);
      flex-shrink: 0;
      padding-block-start: var(--fd-page-header-actions-offset, 4px);
    }

    .actions-hidden {
      display: none;
    }

    /* --- Responsive --- */

    @media (max-width: 640px) {
      .title {
        font-size: 2rem;
      }

      .heading-row {
        flex-direction: column;
        gap: var(--fd-page-header-actions-gap-mobile, 12px);
      }

      .actions {
        padding-block-start: 0;
      }
    }

    /* --- Print --- */

    @media print {
      .breadcrumbs {
        display: none;
      }

      .actions {
        display: none;
      }

      .title {
        color: #000;
      }

      .kicker {
        color: #333;
      }
    }

    /* --- Forced colors --- */

    @media (forced-colors: active) {
      .breadcrumb-link {
        color: LinkText;
      }

      .breadcrumb-current {
        color: CanvasText;
      }

      .breadcrumb-separator {
        color: CanvasText;
      }

      .title {
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
        ${this._renderBreadcrumbs()}
        <div part="heading-group" class="heading-group">
          ${this._renderKicker()}
          <div class="heading-row">
            <h1 part="title" class="title">${headingText}</h1>
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
