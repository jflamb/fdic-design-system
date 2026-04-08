import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import type { FdPaginationRequestDetail } from "../public-events.js";
import "../icons/phosphor-regular.js";

type PaginationEntry =
  | {
      key: string;
      kind: "page";
      page: number;
    }
  | {
      key: string;
      kind: "ellipsis";
    };

function normalizePositiveInteger(value: number | undefined) {
  const normalized = Number.isFinite(value) ? Math.floor(value ?? 1) : 1;
  return Math.max(1, normalized);
}

let paginationSelectId = 0;

/**
 * `fd-pagination` — Bounded pagination navigation with desktop and mobile layouts.
 */
export class FdPagination extends LitElement {
  static override get observedAttributes() {
    return [...super.observedAttributes, "aria-label", "style"];
  }

  static properties = {
    currentPage: { type: Number, attribute: "current-page", reflect: true },
    totalPages: { type: Number, attribute: "total-pages", reflect: true },
    hrefTemplate: { attribute: "href-template", reflect: true },
    mobile: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ds-color-text-primary, #212123);
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([hidden]) {
      display: none;
    }

    [part="nav"] {
      display: block;
    }

    .desktop,
    .mobile {
      align-items: center;
      min-inline-size: 0;
    }

    .desktop {
      display: flex;
      gap: var(--fd-pagination-gap, var(--fdic-spacing-xl, 24px));
      justify-content: flex-start;
    }

    .mobile {
      display: flex;
      gap: var(--fd-pagination-mobile-gap, var(--fdic-spacing-sm, 12px));
      justify-content: flex-start;
    }

    .mobile[hidden],
    .desktop[hidden] {
      display: none;
    }

    [part="list"] {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fd-pagination-page-gap, var(--fdic-spacing-xs, 8px));
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
      min-inline-size: 0;
    }

    [part~="item"] {
      display: flex;
      align-items: center;
    }

    .control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--fdic-spacing-xs, 8px);
      min-block-size: var(--fd-pagination-control-min-size, 44px);
      min-inline-size: var(--fd-pagination-control-min-size, 44px);
      padding-inline: 7px;
      border: none;
      border-radius: var(
        --fd-pagination-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(
        --fd-pagination-control-bg,
        var(--ds-color-bg-interactive, #f5f5f7)
      );
      color: var(
        --fd-pagination-control-color,
        var(--ds-color-text-primary, #212123)
      );
      cursor: pointer;
      font: inherit;
      line-height: 1.375;
      text-decoration: none;
      box-sizing: border-box;
    }

    .control:hover:not(.disabled),
    .control:active:not(.disabled) {
      box-shadow: inset 0 0 0 999px
        var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04));
    }

    .control:focus {
      outline-color: transparent;
    }

    .control:focus-visible,
    .mobile-select:focus-visible {
      outline-color: transparent;
      box-shadow: 0 0 0 2px
          var(--fd-pagination-focus-gap, var(--ds-color-bg-input, #ffffff)),
        0 0 0 4px
          var(
            --fd-pagination-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
    }

    .current {
      background: var(
        --fd-pagination-current-bg,
        var(--ds-color-bg-active, #0d6191)
      );
      color: var(
        --fd-pagination-current-color,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    .disabled {
      background: var(
        --fd-pagination-control-bg-disabled,
        var(--ds-color-bg-container, #f5f5f7)
      );
      color: var(
        --fd-pagination-control-color-disabled,
        var(--ds-color-text-disabled, #9e9ea0)
      );
      cursor: default;
      box-shadow: none;
    }

    .label {
      display: inline-flex;
      align-items: center;
      padding-inline: 6px;
      white-space: nowrap;
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: currentColor;
    }

    .icon fd-icon,
    .select-icon fd-icon {
      inline-size: 18px;
      block-size: 18px;
    }

    .ellipsis-item {
      min-block-size: var(--fd-pagination-control-min-size, 44px);
    }

    [part="ellipsis"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-block-size: var(--fd-pagination-control-min-size, 44px);
      min-inline-size: var(--fd-pagination-control-min-size, 44px);
      color: var(
        --fd-pagination-control-color-disabled,
        var(--ds-color-text-disabled, #9e9ea0)
      );
      padding-inline: 7px;
      box-sizing: border-box;
    }

    .mobile-select-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      inline-size: min(100%, 72px);
      min-inline-size: 72px;
    }

    .mobile-select {
      appearance: none;
      inline-size: 100%;
      min-block-size: var(--fd-pagination-control-min-size, 44px);
      padding-inline: 12px 34px;
      border: 1px solid
        var(
          --fd-pagination-select-border,
          var(--ds-color-border-input, #bdbdbf)
        );
      border-radius: var(
        --fd-pagination-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(
        --fd-pagination-select-bg,
        var(--ds-color-bg-input, #ffffff)
      );
      color: var(
        --fd-pagination-control-color,
        var(--ds-color-text-primary, #212123)
      );
      font: inherit;
      line-height: 1.375;
      box-sizing: border-box;
    }

    .select-icon {
      position: absolute;
      inset-inline-end: 9px;
      pointer-events: none;
      color: var(--ds-color-icon-primary, #424244);
    }

    [part="mobile-summary"] {
      white-space: nowrap;
      color: var(
        --fd-pagination-control-color,
        var(--ds-color-text-primary, #212123)
      );
    }

    .sr-only {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (forced-colors: active) {
      .control,
      .mobile-select {
        border: 1px solid ButtonText;
        background: Canvas;
        color: ButtonText;
      }

      .current {
        background: Highlight;
        color: HighlightText;
        forced-color-adjust: none;
      }

      .disabled,
      [part="ellipsis"] {
        color: GrayText;
      }

      .control:focus-visible,
      .mobile-select:focus-visible {
        box-shadow: none;
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }

      .select-icon {
        color: ButtonText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .control,
      .mobile-select {
        transition: none !important;
      }
    }

    @media print {
      .control {
        box-shadow: none;
        border: 1px solid #000;
      }
    }
  `;

  declare currentPage: number;
  declare totalPages: number;
  declare hrefTemplate: string | undefined;
  declare mobile: boolean;

  private _resizeObserver: ResizeObserver | null = null;
  private _collapseThresholdPx: number | null = null;
  private _selectId: string;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.hrefTemplate = undefined;
    this.mobile = false;
    this._selectId = `fd-pagination-select-${paginationSelectId += 1}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._startObserving();
  }

  override disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this._refreshThresholdPx();
    this._updateMobileMode();
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) {
      return;
    }

    if (name === "style") {
      this._collapseThresholdPx = null;
      this._refreshThresholdPx();
      this._updateMobileMode();
    }

    if (name === "aria-label") {
      this.requestUpdate();
    }
  }

  override focus(options?: FocusOptions) {
    const target = this.mobile
      ? this._getMobileSelect()
      : this._getCurrentPageControl();
    target?.focus(options);
  }

  override updated(changed: PropertyValues<this>) {
    if (
      changed.has("mobile") ||
      changed.has("currentPage") ||
      changed.has("totalPages")
    ) {
      const { currentPage } = this._getNormalizedState();
      const select = this._getMobileSelect();

      if (select) {
        select.value = String(currentPage);
      }
    }
  }

  private _startObserving() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    this._resizeObserver?.disconnect();
    this._resizeObserver = new ResizeObserver(() => {
      this._updateMobileMode();
    });
    this._resizeObserver.observe(this);
  }

  private _parseLengthToPx(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      return 480;
    }

    if (normalized.endsWith("px")) {
      return Number.parseFloat(normalized);
    }

    if (normalized.endsWith("rem")) {
      const fontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize || "16",
      );
      return Number.parseFloat(normalized) * fontSize;
    }

    if (normalized.endsWith("em")) {
      const fontSize = Number.parseFloat(getComputedStyle(this).fontSize || "16");
      return Number.parseFloat(normalized) * fontSize;
    }

    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 480;
  }

  private _refreshThresholdPx() {
    const value =
      getComputedStyle(this).getPropertyValue("--fd-pagination-collapse-at") ||
      "480px";
    this._collapseThresholdPx = this._parseLengthToPx(value);
  }

  private _getThresholdPx() {
    if (this._collapseThresholdPx === null) {
      this._refreshThresholdPx();
    }

    return this._collapseThresholdPx ?? 480;
  }

  private _getInlineSize() {
    return this.clientWidth || this.getBoundingClientRect().width || 0;
  }

  private _updateMobileMode() {
    const inlineSize = this._getInlineSize();
    const shouldUseMobile =
      inlineSize > 0 && inlineSize <= this._getThresholdPx();

    if (this.mobile !== shouldUseMobile) {
      this.mobile = shouldUseMobile;
    }
  }

  private _getNormalizedState() {
    const totalPages = normalizePositiveInteger(this.totalPages);
    const currentPage = Math.min(
      totalPages,
      normalizePositiveInteger(this.currentPage),
    );

    return { currentPage, totalPages };
  }

  private _getNavLabel() {
    return this.getAttribute("aria-label")?.trim() || "Pagination";
  }

  private _getHref(page: number) {
    if (!this.hrefTemplate) {
      return undefined;
    }

    return this.hrefTemplate.replaceAll("{page}", String(page));
  }

  private _getEntries(currentPage: number, totalPages: number): PaginationEntry[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => ({
        key: `page-${index + 1}`,
        kind: "page" as const,
        page: index + 1,
      }));
    }

    if (currentPage <= 3) {
      return [
        { key: "page-1", kind: "page", page: 1 },
        { key: "page-2", kind: "page", page: 2 },
        { key: "page-3", kind: "page", page: 3 },
        { key: "page-4", kind: "page", page: 4 },
        { key: "ellipsis-trailing", kind: "ellipsis" },
        { key: `page-${totalPages}`, kind: "page", page: totalPages },
      ];
    }

    if (currentPage >= totalPages - 2) {
      return [
        { key: "page-1", kind: "page", page: 1 },
        { key: "ellipsis-leading", kind: "ellipsis" },
        { key: `page-${totalPages - 3}`, kind: "page", page: totalPages - 3 },
        { key: `page-${totalPages - 2}`, kind: "page", page: totalPages - 2 },
        { key: `page-${totalPages - 1}`, kind: "page", page: totalPages - 1 },
        { key: `page-${totalPages}`, kind: "page", page: totalPages },
      ];
    }

    return [
      { key: "page-1", kind: "page", page: 1 },
      { key: "ellipsis-leading", kind: "ellipsis" },
      { key: `page-${currentPage - 1}`, kind: "page", page: currentPage - 1 },
      { key: `page-${currentPage}`, kind: "page", page: currentPage },
      { key: `page-${currentPage + 1}`, kind: "page", page: currentPage + 1 },
      { key: "ellipsis-trailing", kind: "ellipsis" },
      { key: `page-${totalPages}`, kind: "page", page: totalPages },
    ];
  }

  private _dispatchPageRequest(page: number, href: string | undefined) {
    return this.dispatchEvent(
      new CustomEvent<FdPaginationRequestDetail>("fd-page-request", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { page, href },
      }),
    );
  }

  private _onControlClick(event: Event) {
    const control = event.currentTarget as HTMLElement | null;
    if (!control) {
      return;
    }

    const page = Number.parseInt(control.dataset.page ?? "", 10);
    if (!Number.isFinite(page)) {
      return;
    }

    const { currentPage } = this._getNormalizedState();
    const href = this._getHref(page);

    if (page === currentPage && !href) {
      return;
    }

    const allowed = this._dispatchPageRequest(page, href);
    if (!allowed) {
      event.preventDefault();
    }
  }

  private _onSelectChange(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    const page = Number.parseInt(select.value, 10);
    if (!Number.isFinite(page)) {
      return;
    }

    const href = this._getHref(page);
    const allowed = this._dispatchPageRequest(page, href);

    if (allowed && href) {
      window.location.assign(href);
    }
  }

  private _getControlLabel(page: number, totalPages: number) {
    if (page === totalPages && totalPages > 1) {
      return `Last page, page ${page}`;
    }

    return `Page ${page}`;
  }

  private _getCurrentPageControl() {
    return this.shadowRoot?.querySelector<HTMLElement>("[data-current-page]");
  }

  private _getMobileSelect() {
    return this.shadowRoot?.querySelector<HTMLSelectElement>("[part~='mobile-select']");
  }

  private _renderControl(options: {
    page: number;
    text: string;
    label: string;
    current?: boolean;
    disabled?: boolean;
    iconStart?: string;
    iconEnd?: string;
  }) {
    const href = this._getHref(options.page);
    const classes = {
      control: true,
      current: options.current ?? false,
      disabled: options.disabled ?? false,
    };
    const iconStart = options.iconStart
      ? html`<span class="icon" aria-hidden="true"
          ><fd-icon name=${options.iconStart}></fd-icon
        ></span>`
      : null;
    const iconEnd = options.iconEnd
      ? html`<span class="icon" aria-hidden="true"
          ><fd-icon name=${options.iconEnd}></fd-icon
        ></span>`
      : null;
    const content = html`
      ${iconStart}
      <span class="label">${options.text}</span>
      ${iconEnd}
    `;

    if (href && !options.disabled) {
      return html`
        <a
          part="control"
          class=${classMap(classes)}
          href=${href}
          data-page=${String(options.page)}
          data-current-page=${ifDefined(options.current ? "true" : undefined)}
          aria-label=${options.label}
          aria-current=${ifDefined(options.current ? "page" : undefined)}
          @click=${this._onControlClick}
        >
          ${content}
        </a>
      `;
    }

    return html`
      <button
        part="control"
        class=${classMap(classes)}
        type="button"
        data-page=${String(options.page)}
        data-current-page=${ifDefined(options.current ? "true" : undefined)}
        aria-label=${options.label}
        aria-current=${ifDefined(options.current ? "page" : undefined)}
        ?disabled=${options.disabled ?? false}
        @click=${this._onControlClick}
      >
        ${content}
      </button>
    `;
  }

  private _renderDesktop(currentPage: number, totalPages: number) {
    const entries = this._getEntries(currentPage, totalPages);

    return html`
      <div class="desktop" ?hidden=${this.mobile}>
        ${this._renderControl({
          page: currentPage - 1,
          text: "Previous",
          label: "Previous page",
          disabled: currentPage === 1,
          iconStart: "caret-left",
        })}
        <ul part="list">
          ${repeat(
            entries,
            (entry) => entry.key,
            (entry) =>
              entry.kind === "ellipsis"
                ? html`
                    <li part="item" class="ellipsis-item" aria-label="Collapsed pages">
                      <span part="ellipsis" aria-hidden="true">…</span>
                    </li>
                  `
                : html`
                    <li part="item">
                      ${this._renderControl({
                        page: entry.page,
                        text: String(entry.page),
                        label: this._getControlLabel(entry.page, totalPages),
                        current: entry.page === currentPage,
                      })}
                    </li>
                  `,
          )}
        </ul>
        ${this._renderControl({
          page: currentPage + 1,
          text: "Next",
          label: "Next page",
          disabled: currentPage === totalPages,
          iconEnd: "caret-right",
        })}
      </div>
    `;
  }

  private _renderMobile(currentPage: number, totalPages: number) {
    return html`
      <div class="mobile" ?hidden=${!this.mobile}>
        ${this._renderControl({
          page: currentPage - 1,
          text: "Prev",
          label: "Previous page",
          disabled: currentPage === 1,
          iconStart: "caret-left",
        })}

        <label class="sr-only" for=${this._selectId}>Page</label>
        <div class="mobile-select-wrap">
          <select
            id=${this._selectId}
            part="mobile-select"
            class="mobile-select"
            aria-label="Page"
            @change=${this._onSelectChange}
          >
            ${Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return html`
                <option value=${String(page)} ?selected=${page === currentPage}>
                  ${page}
                </option>
              `;
            })}
          </select>
          <span class="select-icon" aria-hidden="true">
            <fd-icon name="caret-down"></fd-icon>
          </span>
        </div>

        <span part="mobile-summary">of ${totalPages}</span>

        ${this._renderControl({
          page: currentPage + 1,
          text: "Next",
          label: "Next page",
          disabled: currentPage === totalPages,
          iconEnd: "caret-right",
        })}
      </div>
    `;
  }

  render() {
    const { currentPage, totalPages } = this._getNormalizedState();

    return html`
      <nav part="nav" aria-label=${this._getNavLabel()}>
        ${this._renderDesktop(currentPage, totalPages)}
        ${this._renderMobile(currentPage, totalPages)}
      </nav>
    `;
  }
}
