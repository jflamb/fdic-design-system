import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { FdDrawerCloseRequestDetail } from "./fd-drawer.js";
import {
  extractHeaderSearchAliasData,
  normalizeHeaderSearchText,
} from "./fd-header-search-utils.js";

export type HeaderSearchSurface = "desktop" | "mobile";

export interface FdHeaderSearchItem {
  id: string;
  title: string;
  href: string;
  meta?: string;
  description?: string;
  keywords?: string[];
}

export interface FdHeaderSearchInputDetail {
  value: string;
  surface: HeaderSearchSurface;
}

export interface FdHeaderSearchOpenChangeDetail {
  open: boolean;
  surface: HeaderSearchSurface;
}

export interface FdHeaderSearchSubmitDetail {
  query: string;
  href: string;
  firstMatchHref?: string;
  surface: HeaderSearchSurface;
}

export interface FdHeaderSearchActivateDetail {
  item: FdHeaderSearchItem;
  query: string;
  surface: HeaderSearchSurface;
}

const SEARCH_DEBOUNCE_MS = 180;
const SEARCH_LIMIT = 8;
let headerSearchInstanceCount = 0;

function getItemMatchRank(item: FdHeaderSearchItem, query: string) {
  if (!query) {
    return Number.POSITIVE_INFINITY;
  }

  const normalizedTitle = normalizeHeaderSearchText(item.title);
  const normalizedMeta = normalizeHeaderSearchText(item.meta);
  const normalizedDescription = normalizeHeaderSearchText(item.description);
  const normalizedKeywords = (item.keywords || []).map((keyword) =>
    normalizeHeaderSearchText(keyword),
  );
  const { parentheticalAliases, derivedAcronyms } =
    extractHeaderSearchAliasData(item.title);
  const titleTokens = normalizedTitle ? normalizedTitle.split(" ") : [];
  const searchText = [
    normalizedTitle,
    normalizedMeta,
    normalizedDescription,
    ...normalizedKeywords,
  ]
    .filter(Boolean)
    .join(" ");

  if (normalizedTitle === query) return 0;
  if (parentheticalAliases.includes(query)) return 1;
  if (normalizedTitle.startsWith(query)) return 2;
  if (derivedAcronyms.includes(query)) return 3;
  if (titleTokens.includes(query)) return 4;
  if (searchText.includes(query)) return 5;
  return Number.POSITIVE_INFINITY;
}

export function getHeaderSearchMatches(
  query: string,
  items: FdHeaderSearchItem[],
  limit = SEARCH_LIMIT,
) {
  const normalizedQuery = normalizeHeaderSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  return items
    .map((item) => ({ item, rank: getItemMatchRank(item, normalizedQuery) }))
    .filter((entry) => Number.isFinite(entry.rank))
    .sort((left, right) => {
      if (left.rank !== right.rank) {
        return left.rank - right.rank;
      }

      return left.item.title.localeCompare(right.item.title);
    })
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function buildHeaderSearchFallbackHref(
  action: string,
  paramName: string,
  query: string,
) {
  const url = new URL(action, window.location.href);
  url.searchParams.set(paramName || "q", query);
  return url.toString();
}

export class FdHeaderSearch extends LitElement {
  static properties = {
    surface: { reflect: true },
    action: { reflect: true },
    label: { reflect: true },
    placeholder: { reflect: true },
    submitLabel: { attribute: "submit-label", reflect: true },
    searchAllLabel: { attribute: "search-all-label", reflect: true },
    paramName: { attribute: "param-name", reflect: true },
    items: { attribute: false },
    value: { reflect: true },
    open: { type: Boolean, reflect: true },
    _results: { state: true },
    _activeIndex: { state: true },
    _hasFocusWithin: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      color: inherit;
      font-family: var(
        --fd-header-search-font-family,
        var(
          --fdic-font-family-sans-serif,
          "Source Sans 3",
          "Source Sans Pro",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif
        )
      );
    }

    :host([hidden]) {
      display: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    button,
    input,
    a {
      font: inherit;
    }

    button {
      color: inherit;
    }

    .root {
      display: block;
    }

    .field {
      position: relative;
      width: 100%;
    }

    :host([surface="desktop"]) .field {
      width: min(100%, 16rem);
    }

    .input-row {
      position: relative;
      display: flex;
      align-items: center;
      min-height: 2.75rem;
      border: 1px solid rgba(9, 53, 84, 0.16);
      border-radius: 0.75rem;
      background: #ffffff;
      overflow: visible;
    }

    .label {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      min-width: 0;
      gap: 0.625rem;
      padding-inline: 0.875rem;
    }

    .label fd-icon {
      flex: none;
      color: #365063;
      --fd-icon-size: 1.125rem;
    }

    .native {
      flex: 1 1 auto;
      min-width: 0;
      border: none;
      background: transparent;
      color: #0c2336;
      padding: 0;
      line-height: 1.3;
      outline: none;
    }

    .native::placeholder {
      color: #4b5b69;
    }

    .native::-webkit-search-decoration,
    .native::-webkit-search-cancel-button,
    .native::-webkit-search-results-button,
    .native::-webkit-search-results-decoration {
      appearance: none;
      -webkit-appearance: none;
      display: none;
    }

    .shortcut {
      position: absolute;
      inset-inline-end: 0.375rem;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: 1px solid rgba(9, 53, 84, 0.16);
      border-radius: 0.375rem;
      background: #f5f7f9;
      color: #4b5b69;
      font-size: 0.8125rem;
      font-weight: 700;
      pointer-events: none;
    }

    :host([surface="desktop"]) .field[data-focused="true"] .shortcut {
      display: none;
    }

    .clear,
    .submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 2.25rem;
      height: 2.25rem;
      margin-inline-end: 0.125rem;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: #365063;
      cursor: pointer;
      position: relative;
      z-index: 1;
    }

    .clear[hidden] {
      display: none;
    }

    :host([surface="desktop"]) .submit {
      display: none;
    }

    :host([surface="desktop"]) .field[data-focused="true"] .submit {
      display: inline-flex;
    }

    .clear:hover,
    .clear:focus-visible,
    .submit:hover,
    .submit:focus-visible {
      outline: none;
      background: rgba(0, 110, 190, 0.12);
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #38b6ff;
    }

    .panel {
      position: absolute;
      inset-inline: auto 0;
      top: calc(100% + 0.625rem);
      width: min(42.5rem, 100vw - 2.5rem);
      overflow: hidden;
      border: 1px solid rgba(9, 53, 84, 0.14);
      border-radius: 1rem;
      background: #ffffff;
      box-shadow: 0 18px 48px rgba(0, 18, 32, 0.22);
      z-index: 20;
    }

    .panel[hidden] {
      display: none;
    }

    .results {
      margin: 0;
      padding: 0;
      list-style: none;
      max-height: min(52vh, 32.5rem);
      overflow: auto;
      overscroll-behavior: contain;
    }

    .result-item + .result-item {
      border-top: 1px solid rgba(9, 53, 84, 0.08);
    }

    .result-link {
      display: grid;
      gap: 0.1875rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: transparent;
      color: inherit;
      text-decoration: none;
      text-align: left;
    }

    .result-link:hover,
    .result-link:focus-visible,
    .result-link[data-active="true"] {
      background: rgba(0, 110, 190, 0.08);
      outline: none;
    }

    .result-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0c2336;
      line-height: 1.25;
    }

    .result-meta,
    .status,
    .shortcut-hint {
      color: #4b5b69;
      font-size: 0.9375rem;
      line-height: 1.35;
    }

    .status {
      margin: 0;
      padding: 0.625rem 1rem 0.875rem;
      border-top: 1px solid rgba(9, 53, 84, 0.08);
    }

    .mobile-sheet {
      display: grid;
      gap: 0.875rem;
      padding: 1rem;
    }

    .mobile-sheet--results {
      gap: 0;
      padding: 0;
    }

    .mobile-sheet .field {
      width: 100%;
    }

    .mobile-sheet .submit {
      display: inline-flex;
    }

    :host([surface="mobile"]) .result-link {
      padding-inline: 1rem;
    }

    .shortcut-hint {
      display: none;
      margin: 0;
    }

    :host([surface="mobile"]) .shortcut-hint[data-visible="true"] {
      display: block;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (forced-colors: active) {
      .input-row,
      .panel {
        border-color: CanvasText;
        forced-color-adjust: none;
      }

      .clear,
      .submit {
        border: 1px solid ButtonText;
      }
    }
  `;

  declare surface: HeaderSearchSurface;
  declare action: string;
  declare label: string;
  declare placeholder: string;
  declare submitLabel: string;
  declare searchAllLabel: string;
  declare paramName: string;
  declare items: FdHeaderSearchItem[];
  declare value: string;
  declare open: boolean;
  declare _results: FdHeaderSearchItem[];
  declare _activeIndex: number;
  declare _hasFocusWithin: boolean;

  private _debounceTimer: number | null = null;
  private readonly _baseId: string;
  private readonly _onDocumentPointerDownBound =
    this._handleDocumentPointerDown.bind(this);

  constructor() {
    super();
    this.surface = "desktop";
    this.action = "/search";
    this.label = "Search";
    this.placeholder = "Search";
    this.submitLabel = "Open first matching result";
    this.searchAllLabel = "Search all";
    this.paramName = "q";
    this.items = [];
    this.value = "";
    this.open = false;
    this._results = [];
    this._activeIndex = -1;
    this._hasFocusWithin = false;
    this._baseId = `fdhs-${headerSearchInstanceCount++}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._clearDebounce();
    document.removeEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
  }

  override updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("value") || changed.has("items")) {
      this._scheduleResults();
    }

    if (changed.has("surface") && this.surface === "desktop") {
      this.open = false;
    }

    if (changed.has("open") && !this.open) {
      this._activeIndex = -1;
      this._hasFocusWithin = false;
    }
  }

  override focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector<HTMLInputElement>(".native")?.focus(options);
  }

  select() {
    this.shadowRoot?.querySelector<HTMLInputElement>(".native")?.select();
  }

  private _clearDebounce() {
    if (this._debounceTimer == null) {
      return;
    }

    window.clearTimeout(this._debounceTimer);
    this._debounceTimer = null;
  }

  private _scheduleResults() {
    this._clearDebounce();
    const trimmedValue = this.value.trim();

    if (!trimmedValue) {
      this._results = [];
      this._activeIndex = -1;
      if (this.surface === "desktop") {
        this._setOpen(false);
      }
      return;
    }

    this._debounceTimer = window.setTimeout(() => {
      this._debounceTimer = null;
      this._results = getHeaderSearchMatches(trimmedValue, this.items);
      this._activeIndex = -1;
      if (this.surface === "desktop") {
        this._setOpen(this._hasFocusWithin && this._results.length > 0);
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  private _setOpen(nextOpen: boolean) {
    if (this.surface === "mobile" && !nextOpen) {
      this._activeIndex = -1;
    }

    if (this.open === nextOpen) {
      return;
    }

    this.open = nextOpen;
    this.dispatchEvent(new CustomEvent<FdHeaderSearchOpenChangeDetail>("fd-header-search-open-change", {
      bubbles: true,
      composed: true,
      detail: { open: nextOpen, surface: this.surface },
    }));
  }

  private _handleDocumentPointerDown(event: PointerEvent) {
    if (this.surface !== "desktop" || !this.open) {
      return;
    }

    const path = event.composedPath();
    if (path.includes(this)) {
      return;
    }

    this._setOpen(false);
    this._hasFocusWithin = false;
  }

  private _handleFocusIn() {
    this._hasFocusWithin = true;
    if (this.surface === "desktop" && this._results.length > 0) {
      this._setOpen(true);
    }
  }

  private _handleFocusOut() {
    window.requestAnimationFrame(() => {
      const activeElement = this._getDeepActiveElement();

      if (
        activeElement &&
        (this.contains(activeElement) || this.shadowRoot?.contains(activeElement))
      ) {
        return;
      }

      this._hasFocusWithin = false;
      if (this.surface === "desktop") {
        this._setOpen(false);
      }
    });
  }

  private _handleInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement | null;
    this.value = input?.value ?? "";
    this.dispatchEvent(
      new CustomEvent<FdHeaderSearchInputDetail>("fd-header-search-input", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, surface: this.surface },
      }),
    );
  }

  private _handleClear() {
    this.value = "";
    this._results = [];
    this._activeIndex = -1;
    if (this.surface === "desktop") {
      this._setOpen(false);
    }
    this.dispatchEvent(
      new CustomEvent<FdHeaderSearchInputDetail>("fd-header-search-input", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, surface: this.surface },
      }),
    );
    this.focus();
  }

  private _activateSuggestion(item: FdHeaderSearchItem) {
    const activateEvent =
      new CustomEvent<FdHeaderSearchActivateDetail>("fd-header-search-activate", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          item,
          query: this.value.trim(),
          surface: this.surface,
        },
      });

    if (!this.dispatchEvent(activateEvent)) {
      return;
    }

    window.location.assign(item.href);
  }

  private _handleSubmit(event: Event) {
    event.preventDefault();
    const query = this.value.trim();
    if (!query) {
      return;
    }

    const firstMatchHref = this._results[0]?.href;
    const fallbackHref = buildHeaderSearchFallbackHref(
      this.action,
      this.paramName,
      query,
    );
    const submitEvent =
      new CustomEvent<FdHeaderSearchSubmitDetail>("fd-header-search-submit", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          query,
          href: fallbackHref,
          firstMatchHref,
          surface: this.surface,
        },
      });

    if (!this.dispatchEvent(submitEvent)) {
      return;
    }

    window.location.assign(firstMatchHref || fallbackHref);
  }

  private _handleInputKeydown(event: KeyboardEvent) {
    const resultsCount = this._results.length;

    if (event.key === "Escape") {
      if (this.surface === "desktop" && this.open) {
        event.preventDefault();
        this._setOpen(false);
      }

      if (this.surface === "mobile" && this.open) {
        event.preventDefault();
        this._setOpen(false);
      }

      return;
    }

    if (resultsCount === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._activeIndex = (this._activeIndex + 1 + resultsCount) % resultsCount;
      if (this.surface === "desktop") {
        this._setOpen(true);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._activeIndex =
        this._activeIndex <= 0 ? resultsCount - 1 : this._activeIndex - 1;
      if (this.surface === "desktop") {
        this._setOpen(true);
      }
      return;
    }

    if (event.key === "Enter" && this._activeIndex >= 0) {
      event.preventDefault();
      this._activateSuggestion(this._results[this._activeIndex]!);
    }
  }

  private _handleResultClick(event: Event, item: FdHeaderSearchItem) {
    event.preventDefault();
    this._activateSuggestion(item);
  }

  private _handleDrawerCloseRequest(
    event: CustomEvent<FdDrawerCloseRequestDetail>,
  ) {
    event.stopPropagation();
    this._setOpen(false);
  }

  private _getDeepActiveElement() {
    let active: Element | null = this.ownerDocument.activeElement;

    while (active instanceof HTMLElement && active.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }

    return active instanceof HTMLElement ? active : null;
  }

  private _renderResultsList(resultsId: string) {
    if (this._results.length === 0) {
      return nothing;
    }

    return html`
      <ul
        id=${resultsId}
        class="results"
        role="list"
        aria-label="Matching menu content"
      >
        ${this._results.map(
          (item, index) => html`
            <li id=${`${resultsId}-option-${index}`} class="result-item">
              <a
                class="result-link"
                href=${item.href}
                data-active=${String(index === this._activeIndex)}
                @click=${(event: Event) => this._handleResultClick(event, item)}
              >
                <span class="result-title">${item.title}</span>
                ${item.meta
                  ? html`<span class="result-meta">${item.meta}</span>`
                  : nothing}
              </a>
            </li>
          `,
        )}
      </ul>
    `;
  }

  private _renderStatus() {
    const query = this.value.trim();
    if (!query) {
      return nothing;
    }

    if (this._results.length === 0) {
      if (this.surface === "desktop") {
        return nothing;
      }

      return html`
        <p class="status" role="status" aria-live="polite">
          No menu destinations match "${query}".
        </p>
      `;
    }

    return html`
      <p class="status" role="status" aria-live="polite">
        ${this._results.length} menu result${this._results.length === 1
          ? ""
          : "s"} available.
      </p>
    `;
  }

  private _renderField(showShortcut = false) {
    const trimmedValue = this.value.trim();
    const inputId = `${this._baseId}-${this.surface}-input`;
    const resultsId = `${this._baseId}-${this.surface}-results`;
    const statusId = `${this._baseId}-${this.surface}-status`;

    return html`
      <div
        class="field"
        data-focused=${String(this._hasFocusWithin)}
        @focusin=${this._handleFocusIn}
        @focusout=${this._handleFocusOut}
      >
        <form @submit=${this._handleSubmit}>
          <div class="input-row" part="form">
            <label class="label" for=${inputId}>
              <span class="sr-only">${this.label || "Search"}</span>
              <fd-icon name="magnifying-glass" aria-hidden="true"></fd-icon>
              <input
                id=${inputId}
                class="native"
                type="search"
                .value=${this.value}
                placeholder=${this.placeholder || "Search"}
                autocomplete="off"
                aria-controls=${ifDefined(
                  this._results.length > 0 || this.surface === "mobile"
                    ? resultsId
                    : undefined,
                )}
                aria-describedby=${ifDefined(trimmedValue ? statusId : undefined)}
                @input=${this._handleInput}
                @keydown=${this._handleInputKeydown}
              />
            </label>
            ${showShortcut
              ? html`<span class="shortcut" aria-hidden="true">/</span>`
              : nothing}
            <button
              class="clear"
              type="button"
              aria-label="Clear search"
              ?hidden=${!trimmedValue}
              @click=${this._handleClear}
            >
              <fd-icon name="x" aria-hidden="true"></fd-icon>
            </button>
            <button
              class="submit"
              type="submit"
              aria-label=${this.submitLabel || "Open first matching result"}
            >
              <fd-icon name="caret-right" aria-hidden="true"></fd-icon>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  private _renderDesktop() {
    const resultsId = `${this._baseId}-${this.surface}-results`;
    const statusId = `${this._baseId}-${this.surface}-status`;

    return html`
      <div class="root">
        ${this._renderField(true)}
        <section
          class="panel"
          part="results"
          aria-label="Search suggestions"
          ?hidden=${!(this.open && this._results.length > 0)}
        >
          ${this._renderResultsList(resultsId)}
          <div id=${statusId}>${this._renderStatus()}</div>
        </section>
      </div>
    `;
  }

  private _renderMobile() {
    const resultsId = `${this._baseId}-${this.surface}-results`;
    const statusId = `${this._baseId}-${this.surface}-status`;

    return html`
      <fd-drawer
        .open=${this.open}
        .label=${this.label || "Search"}
        .modal=${true}
        .placement=${"top" as const}
        @fd-drawer-close-request=${this._handleDrawerCloseRequest}
      >
        <div slot="header" class="mobile-sheet">
          ${this._renderField(false)}
          <p
            class="shortcut-hint"
            data-visible=${String(this.open)}
          >
            Press <span aria-hidden="true">/</span> to jump to search.
          </p>
        </div>
        <div class="mobile-sheet mobile-sheet--results">
          ${this._renderResultsList(resultsId)}
          <div id=${statusId}>${this._renderStatus()}</div>
        </div>
      </fd-drawer>
    `;
  }

  override render() {
    return this.surface === "mobile"
      ? this._renderMobile()
      : this._renderDesktop();
  }
}
