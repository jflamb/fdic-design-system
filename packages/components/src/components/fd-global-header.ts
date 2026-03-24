import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type GlobalHeaderSearchSurface = "desktop" | "mobile";

export interface FdGlobalHeaderLeafItem {
  label: string;
  href: string;
  description?: string;
  keywords?: string[];
}

export interface FdGlobalHeaderSectionItem extends FdGlobalHeaderLeafItem {
  children?: FdGlobalHeaderLeafItem[];
}

export interface FdGlobalHeaderSection {
  label: string;
  href?: string;
  description?: string;
  keywords?: string[];
  items?: FdGlobalHeaderSectionItem[];
}

export interface FdGlobalHeaderLinkItem extends FdGlobalHeaderLeafItem {
  kind: "link";
  current?: boolean;
}

export interface FdGlobalHeaderPanelItem {
  kind: "panel";
  id: string;
  label: string;
  href?: string;
  current?: boolean;
  description?: string;
  keywords?: string[];
  sections: FdGlobalHeaderSection[];
}

export type FdGlobalHeaderNavigationItem =
  | FdGlobalHeaderLinkItem
  | FdGlobalHeaderPanelItem;

export interface FdGlobalHeaderSearchConfig {
  action: string;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  paramName?: string;
}

export interface FdGlobalHeaderSearchSubmitDetail {
  query: string;
  href: string;
  firstMatchHref?: string;
  surface: GlobalHeaderSearchSurface;
}

interface SearchSuggestion {
  href: string;
  label: string;
  meta: string;
  searchText: string;
  priority: number;
}

interface MobilePath {
  panelId: string | null;
  sectionIndex: number | null;
  itemIndex: number | null;
}

const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";
const HOVER_INTENT_MS = 120;
const SEARCH_LIMIT = 8;
const TOP_ITEM_SELECTOR = "[data-top-level-index]";
const PANEL_FOCUSABLE_SELECTOR = "[data-panel-focusable='true']";

let globalHeaderInstanceCount = 0;

function normalizeSearchText(value: string | undefined): string {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildFallbackSearchHref(
  config: FdGlobalHeaderSearchConfig,
  query: string,
): string {
  const paramName = config.paramName?.trim() || "q";
  const url = new URL(config.action, window.location.href);
  url.searchParams.set(paramName, query);
  return url.toString();
}

function isPanelItem(
  item: FdGlobalHeaderNavigationItem,
): item is FdGlobalHeaderPanelItem {
  return item.kind === "panel";
}

function isLinkItem(
  item: FdGlobalHeaderNavigationItem,
): item is FdGlobalHeaderLinkItem {
  return item.kind === "link";
}

function getFirstPanelId(
  navigation: FdGlobalHeaderNavigationItem[],
): string | null {
  return navigation.find(isPanelItem)?.id ?? null;
}

export class FdGlobalHeader extends LitElement {
  static properties = {
    navigation: { attribute: false },
    search: { attribute: false },
    _activeItemIndex: { state: true },
    _activePanelId: { state: true },
    _activeSectionIndex: { state: true },
    _desktopPanelOpen: { state: true },
    _isMobile: { state: true },
    _mobileMenuOpen: { state: true },
    _mobilePath: { state: true },
    _mobileSearchOpen: { state: true },
    _searchQuery: { state: true },
    _visibleSearchSurface: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--fdic-text-primary, #212123);
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
      font-size: var(--fdic-font-size-body, 1.125rem);
      line-height: 1.375;
      position: relative;
      z-index: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([hidden]) {
      display: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    a,
    button,
    input {
      font: inherit;
    }

    button {
      color: inherit;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button:focus-visible,
    a:focus-visible,
    fd-input:focus-visible,
    [data-panel-focusable='true']:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px
          var(--fd-global-header-focus-gap, var(--ds-color-bg-input, #ffffff)),
        0 0 0 4px
          var(
            --fd-global-header-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
      border-radius: var(--fdic-corner-radius-sm, 3px);
    }

    [part="base"] {
      position: relative;
      background: var(--fd-global-header-surface, #ffffff);
      border-block-end: 1px solid
        var(
          --fd-global-header-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
    }

    .masthead {
      background: var(--fd-global-header-surface, #ffffff);
      border-block-end: 1px solid
        var(
          --fd-global-header-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
    }

    .shell {
      max-width: min(100%, 90rem);
      margin-inline: auto;
      padding-inline: var(--fdic-spacing-md, 1rem);
    }

    .masthead-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--fdic-spacing-md, 1rem);
      min-height: 4.5rem;
      padding-block: var(--fdic-spacing-xs, 0.5rem);
    }

    .brand-row,
    .utility-row {
      display: flex;
      align-items: center;
      gap: var(--fdic-spacing-sm, 0.75rem);
      min-width: 0;
    }

    .brand-row {
      flex: 1 1 auto;
    }

    .utility-row {
      justify-content: flex-end;
      flex: 0 1 48rem;
    }

    ::slotted([slot="brand"]) {
      display: inline-flex;
      align-items: center;
      gap: var(--fdic-spacing-xs, 0.5rem);
      min-width: 0;
      color: inherit;
      text-decoration: none;
    }

    ::slotted([slot="utility"]) {
      display: inline-flex;
      align-items: center;
      gap: var(--fdic-spacing-2xs, 0.25rem);
    }

    .icon-control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.75rem;
      min-height: 2.75rem;
      padding: 0;
      border: 1px solid
        var(
          --fd-global-header-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
      border-radius: var(--fdic-corner-radius-sm, 3px);
      background: transparent;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease;
    }

    .icon-control:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .icon-control[hidden] {
      display: none;
    }

    .icon-control fd-icon {
      --fd-icon-size: 1.25rem;
    }

    .menu-toggle {
      min-width: auto;
      padding-inline: 0.75rem;
      gap: 0.5rem;
    }

    .toggle-label {
      font-size: var(--fdic-font-size-body-small, 1rem);
      font-weight: 600;
    }

    .desktop-search,
    .mobile-search {
      position: relative;
      width: min(100%, 26rem);
    }

    .search-inner {
      display: flex;
      align-items: center;
      gap: var(--fdic-spacing-2xs, 0.25rem);
      width: 100%;
    }

    .search-input {
      flex: 1 1 auto;
      min-width: 0;
      --fd-input-height: 2.75rem;
      --fd-input-slot-size: 2.5rem;
      --fd-input-border-radius: var(--fdic-corner-radius-sm, 3px);
    }

    .search-clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      min-height: 2rem;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--fdic-text-secondary, #595961);
      border-radius: 999px;
    }

    .search-submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.75rem;
      min-height: 2.75rem;
      padding: 0;
      border: none;
      border-radius: var(--fdic-corner-radius-sm, 3px);
      background: var(
        --fd-global-header-accent,
        var(--ds-color-bg-active, #0d6191)
      );
      color: var(--ds-color-text-inverted, #ffffff);
      cursor: pointer;
    }

    .search-submit:hover {
      box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.08);
    }

    .search-results {
      position: absolute;
      inset-inline: 0;
      top: calc(100% + 0.25rem);
      display: grid;
      gap: var(--fdic-spacing-3xs, 0.125rem);
      padding: var(--fdic-spacing-2xs, 0.25rem);
      margin: 0;
      list-style: none;
      background: var(
        --fd-global-header-panel-surface,
        var(--fdic-background-base, #ffffff)
      );
      border: 1px solid
        var(
          --fd-global-header-panel-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
      border-radius: var(--fdic-corner-radius-md, 5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      z-index: 3;
    }

    .search-results[hidden] {
      display: none;
    }

    .search-status {
      position: absolute;
      inset-inline: 0;
      top: calc(100% + 0.25rem);
      padding: var(--fdic-spacing-sm, 0.75rem);
      background: var(
        --fd-global-header-panel-surface,
        var(--fdic-background-base, #ffffff)
      );
      border: 1px solid
        var(
          --fd-global-header-panel-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
      border-radius: var(--fdic-corner-radius-md, 5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      color: var(--fdic-text-secondary, #595961);
      z-index: 3;
    }

    .search-status[hidden] {
      display: none;
    }

    .search-result-link {
      display: grid;
      gap: 0.125rem;
      width: 100%;
      padding: 0.75rem;
      border-radius: var(--fdic-corner-radius-sm, 3px);
      color: inherit;
      text-align: left;
    }

    .search-result-link:hover,
    .search-result-link:focus-visible {
      background: rgba(0, 0, 0, 0.04);
    }

    .search-result-title {
      font-weight: 600;
    }

    .search-result-meta {
      color: var(--fdic-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    .mobile-search-row {
      display: none;
      padding-block: 0 0.75rem;
    }

    .primary-nav {
      position: relative;
      background: var(--fd-global-header-surface, #ffffff);
    }

    .primary-list {
      display: flex;
      align-items: stretch;
      gap: var(--fdic-spacing-3xs, 0.125rem);
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .primary-item {
      display: flex;
      align-items: stretch;
    }

    .primary-link,
    .primary-button {
      display: inline-flex;
      align-items: center;
      gap: var(--fdic-spacing-2xs, 0.25rem);
      min-height: 3rem;
      padding-inline: 0.875rem;
      border: none;
      background: transparent;
      cursor: pointer;
      color: inherit;
      font-weight: 600;
      border-radius: 0;
      border-block-end: 3px solid transparent;
      white-space: nowrap;
    }

    .primary-link[aria-current="page"],
    .primary-button[data-current="true"],
    .primary-button[aria-expanded="true"] {
      border-block-end-color: var(
        --fd-global-header-accent,
        var(--ds-color-bg-active, #0d6191)
      );
      color: var(--ds-color-bg-active, #0d6191);
    }

    .primary-link:hover,
    .primary-link:focus-visible,
    .primary-button:hover,
    .primary-button:focus-visible {
      background: rgba(0, 0, 0, 0.04);
    }

    .primary-button fd-icon {
      --fd-icon-size: 1rem;
      transition: transform 120ms ease;
    }

    .primary-button[aria-expanded="true"] fd-icon {
      transform: rotate(180deg);
    }

    .desktop-panel {
      position: absolute;
      inset-inline: 0;
      top: 100%;
      z-index: 2;
      background: var(
        --fd-global-header-panel-surface,
        var(--fdic-background-base, #ffffff)
      );
      border-block-end: 1px solid
        var(
          --fd-global-header-panel-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
    }

    .desktop-panel[hidden] {
      display: none;
    }

    .desktop-panel-inner {
      display: grid;
      gap: var(--fdic-spacing-lg, 1.5rem);
      padding-block: 1rem 1.5rem;
    }

    .panel-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--fdic-spacing-sm, 0.75rem);
    }

    .panel-title {
      margin: 0;
      font-size: 1.25rem;
      line-height: 1.25;
      font-weight: 700;
    }

    .panel-description {
      margin: 0;
      color: var(--fdic-text-secondary, #595961);
      max-width: 48rem;
    }

    .panel-columns {
      display: grid;
      gap: var(--fdic-spacing-md, 1rem);
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .panel-column {
      display: grid;
      gap: var(--fdic-spacing-sm, 0.75rem);
      align-content: start;
      min-width: 0;
      padding-inline-start: var(--fdic-spacing-sm, 0.75rem);
      border-inline-start: 3px solid
        rgba(13, 97, 145, 0.16);
    }

    .panel-column-heading {
      margin: 0;
      font-size: var(--fdic-font-size-body-small, 1rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--fdic-text-secondary, #595961);
    }

    .panel-list {
      display: grid;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .panel-link,
    .panel-button {
      display: grid;
      gap: 0.125rem;
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: var(--fdic-corner-radius-sm, 3px);
      background: transparent;
      cursor: pointer;
      text-align: left;
      color: inherit;
    }

    .panel-link:hover,
    .panel-link:focus-visible,
    .panel-button:hover,
    .panel-button:focus-visible,
    .panel-link[data-active="true"],
    .panel-button[data-active="true"] {
      background: rgba(13, 97, 145, 0.08);
    }

    .panel-link-label,
    .panel-button-label {
      font-weight: 600;
    }

    .panel-link-meta,
    .panel-button-meta,
    .panel-context {
      color: var(--fdic-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    .panel-empty {
      margin: 0;
      color: var(--fdic-text-secondary, #595961);
    }

    .mobile-surface,
    .mobile-backdrop {
      display: none;
    }

    .mobile-surface {
      position: relative;
      z-index: 2;
      background: var(
        --fd-global-header-panel-surface,
        var(--fdic-background-base, #ffffff)
      );
      border-block-end: 1px solid
        var(
          --fd-global-header-panel-border-color,
          var(--fdic-border-divider, #bdbdbf)
        );
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
    }

    .mobile-surface[hidden] {
      display: none;
    }

    .mobile-panel {
      display: grid;
      gap: 1rem;
      padding-block: 0.75rem 1rem;
    }

    .mobile-header {
      display: flex;
      align-items: center;
      gap: var(--fdic-spacing-sm, 0.75rem);
      justify-content: space-between;
    }

    .mobile-heading {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
    }

    .mobile-list {
      display: grid;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .mobile-link,
    .mobile-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--fdic-spacing-sm, 0.75rem);
      width: 100%;
      min-height: 3rem;
      padding: 0.875rem 1rem;
      border: none;
      border-radius: var(--fdic-corner-radius-sm, 3px);
      background: transparent;
      cursor: pointer;
      text-align: left;
      color: inherit;
    }

    .mobile-link:hover,
    .mobile-link:focus-visible,
    .mobile-button:hover,
    .mobile-button:focus-visible {
      background: rgba(13, 97, 145, 0.08);
    }

    .mobile-item-label {
      display: grid;
      gap: 0.125rem;
    }

    .mobile-item-meta {
      color: var(--fdic-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.24);
      z-index: 1;
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

    @media (max-width: 767px) {
      .masthead-row {
        min-height: 4rem;
      }

      .desktop-search,
      .primary-nav,
      ::slotted([slot="utility"]) {
        display: none;
      }

      .mobile-search-row[data-open="true"] {
        display: block;
      }

      .mobile-search {
        width: 100%;
      }

      .mobile-surface[data-open="true"],
      .mobile-backdrop[data-open="true"] {
        display: block;
      }
    }

    @media (forced-colors: active) {
      [part="base"],
      .masthead,
      .desktop-panel,
      .mobile-surface,
      .search-results,
      .search-status {
        border-color: CanvasText;
        forced-color-adjust: none;
      }

      .primary-link[aria-current="page"],
      .primary-button[data-current="true"],
      .primary-button[aria-expanded="true"] {
        border-block-end-color: Highlight;
        color: Highlight;
      }

      .search-submit {
        background: ButtonFace;
        color: ButtonText;
        border: 1px solid ButtonText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .primary-button fd-icon {
        transition: none;
      }
    }
  `;

  declare navigation: FdGlobalHeaderNavigationItem[];
  declare search: FdGlobalHeaderSearchConfig | null;
  declare _activeItemIndex: number | null;
  declare _activePanelId: string | null;
  declare _activeSectionIndex: number | null;
  declare _desktopPanelOpen: boolean;
  declare _isMobile: boolean;
  declare _mobileMenuOpen: boolean;
  declare _mobilePath: MobilePath;
  declare _mobileSearchOpen: boolean;
  declare _searchQuery: string;
  declare _visibleSearchSurface: GlobalHeaderSearchSurface | null;

  private _baseId: string;
  private _hoverTimer: number | null = null;
  private _lastDesktopTriggerId: string | null = null;
  private _lastMobileToggle: "menu" | "search" | null = null;
  private _mobileMediaQuery: MediaQueryList | null = null;
  private readonly _onDocumentPointerDownBound =
    this._handleDocumentPointerDown.bind(this);
  private readonly _onDocumentKeyDownBound = this._onDocumentKeyDown.bind(this);
  private readonly _onMobileMediaChangeBound = (
    event: MediaQueryListEvent,
  ) => {
    this._syncMobileState(event.matches);
  };

  constructor() {
    super();
    this.navigation = [];
    this.search = null;
    this._activeItemIndex = null;
    this._activePanelId = null;
    this._activeSectionIndex = null;
    this._desktopPanelOpen = false;
    this._isMobile = false;
    this._mobileMenuOpen = false;
    this._mobilePath = { panelId: null, sectionIndex: null, itemIndex: null };
    this._mobileSearchOpen = false;
    this._searchQuery = "";
    this._visibleSearchSurface = null;
    this._baseId = `fdgh-${globalHeaderInstanceCount++}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._mobileMediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    this._syncMobileState(this._mobileMediaQuery.matches);
    this._mobileMediaQuery.addEventListener(
      "change",
      this._onMobileMediaChangeBound,
    );
    document.addEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
    document.addEventListener("keydown", this._onDocumentKeyDownBound);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._clearHoverTimer();
    this._mobileMediaQuery?.removeEventListener(
      "change",
      this._onMobileMediaChangeBound,
    );
    document.removeEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
    document.removeEventListener("keydown", this._onDocumentKeyDownBound);
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("navigation")) {
      this._normalizeNavigationState();
    }
  }

  override focus(options?: FocusOptions) {
    const target = this._isMobile
      ? this.shadowRoot?.querySelector<HTMLElement>("[data-mobile-toggle='menu']")
      : this.shadowRoot?.querySelector<HTMLElement>(TOP_ITEM_SELECTOR);
    target?.focus(options);
  }

  private _syncMobileState(isMobile: boolean) {
    this._isMobile = isMobile;
    if (isMobile) {
      this._desktopPanelOpen = false;
      this._visibleSearchSurface =
        this._visibleSearchSurface === "desktop"
          ? null
          : this._visibleSearchSurface;
    } else {
      this._mobileMenuOpen = false;
      this._mobileSearchOpen = false;
      this._mobilePath = { panelId: null, sectionIndex: null, itemIndex: null };
      this._lastMobileToggle = null;
      if (this._visibleSearchSurface === "mobile") {
        this._visibleSearchSurface = null;
      }
    }
  }

  private _normalizeNavigationState() {
    const firstPanelId = getFirstPanelId(this.navigation);
    const activePanel = this._activePanelId
      ? this._getPanelById(this._activePanelId)
      : null;
    if (!activePanel) {
      this._activePanelId = firstPanelId;
    }

    const nextPanel = this._getActivePanel();
    const nextSectionCount = nextPanel?.sections.length ?? 0;
    if (
      this._activeSectionIndex == null ||
      this._activeSectionIndex < 0 ||
      this._activeSectionIndex >= nextSectionCount
    ) {
      this._activeSectionIndex = nextSectionCount > 0 ? 0 : null;
    }

    const nextSection = this._getActiveSection();
    const nextItemCount = nextSection?.items?.length ?? 0;
    if (
      this._activeItemIndex == null ||
      this._activeItemIndex < 0 ||
      this._activeItemIndex >= nextItemCount
    ) {
      this._activeItemIndex = nextItemCount > 0 ? 0 : null;
    }

    if (this._mobilePath.panelId && !this._getPanelById(this._mobilePath.panelId)) {
      this._mobilePath = { panelId: null, sectionIndex: null, itemIndex: null };
    }
  }

  private _clearHoverTimer() {
    if (this._hoverTimer !== null) {
      window.clearTimeout(this._hoverTimer);
      this._hoverTimer = null;
    }
  }

  private _getActivePanel(): FdGlobalHeaderPanelItem | null {
    return this._activePanelId ? this._getPanelById(this._activePanelId) : null;
  }

  private _getActiveSection(): FdGlobalHeaderSection | null {
    const panel = this._getActivePanel();
    if (!panel || this._activeSectionIndex == null) return null;
    return panel.sections[this._activeSectionIndex] ?? null;
  }

  private _getActiveSectionItem(): FdGlobalHeaderSectionItem | null {
    const section = this._getActiveSection();
    if (!section || this._activeItemIndex == null) return null;
    return section.items?.[this._activeItemIndex] ?? null;
  }

  private _getPanelById(panelId: string): FdGlobalHeaderPanelItem | null {
    return this.navigation.find(
      (item): item is FdGlobalHeaderPanelItem =>
        isPanelItem(item) && item.id === panelId,
    ) ?? null;
  }

  private _getTopLevelItems() {
    return this.navigation;
  }

  private _getSearchSuggestions(query: string): SearchSuggestion[] {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      return [];
    }

    const suggestions: SearchSuggestion[] = [];

    const pushSuggestion = (
      href: string | undefined,
      label: string,
      meta: string,
      priority: number,
      description?: string,
      keywords?: string[],
    ) => {
      if (!href) return;
      const searchText = [
        normalizeSearchText(label),
        normalizeSearchText(meta),
        normalizeSearchText(description),
        ...(keywords || []).map((keyword) => normalizeSearchText(keyword)),
      ]
        .filter(Boolean)
        .join(" ");

      suggestions.push({
        href,
        label,
        meta,
        searchText,
        priority,
      });
    };

    for (const item of this.navigation) {
      if (isLinkItem(item)) {
        pushSuggestion(
          item.href,
          item.label,
          "Primary navigation",
          0,
          item.description,
          item.keywords,
        );
        continue;
      }

      pushSuggestion(
        item.href,
        item.label,
        "Overview",
        1,
        item.description,
        item.keywords,
      );

      item.sections.forEach((section) => {
        pushSuggestion(
          section.href,
          section.label,
          item.label,
          2,
          section.description,
          section.keywords,
        );

        (section.items || []).forEach((sectionItem) => {
          pushSuggestion(
            sectionItem.href,
            sectionItem.label,
            `${item.label} / ${section.label}`,
            3,
            sectionItem.description,
            sectionItem.keywords,
          );

          (sectionItem.children || []).forEach((child) => {
            pushSuggestion(
              child.href,
              child.label,
              `${item.label} / ${section.label} / ${sectionItem.label}`,
              4,
              child.description,
              child.keywords,
            );
          });
        });
      });
    }

    return suggestions
      .map((suggestion) => {
        const label = normalizeSearchText(suggestion.label);
        let rank = Number.POSITIVE_INFINITY;
        if (label === normalizedQuery) {
          rank = 0;
        } else if (label.startsWith(normalizedQuery)) {
          rank = 1;
        } else if (suggestion.searchText.includes(normalizedQuery)) {
          rank = 2;
        }

        return { rank, suggestion };
      })
      .filter((entry) => Number.isFinite(entry.rank))
      .sort((left, right) => {
        if (left.rank !== right.rank) {
          return left.rank - right.rank;
        }
        if (left.suggestion.priority !== right.suggestion.priority) {
          return left.suggestion.priority - right.suggestion.priority;
        }
        return left.suggestion.label.localeCompare(right.suggestion.label);
      })
      .slice(0, SEARCH_LIMIT)
      .map((entry) => entry.suggestion);
  }

  private _handleSearchSubmit(
    surface: GlobalHeaderSearchSurface,
    event?: Event,
  ) {
    event?.preventDefault();
    if (!this.search) return;

    const query = this._searchQuery.trim();
    if (!query) return;

    const suggestions = this._getSearchSuggestions(query);
    const fallbackHref = buildFallbackSearchHref(this.search, query);
    const firstMatchHref = suggestions[0]?.href;
    const submitEvent =
      new CustomEvent<FdGlobalHeaderSearchSubmitDetail>("fd-global-header-search-submit", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          query,
          href: fallbackHref,
          firstMatchHref,
          surface,
        },
      });

    if (!this.dispatchEvent(submitEvent)) {
      return;
    }

    window.location.assign(firstMatchHref || fallbackHref);
  }

  private _handleSearchInput(event: Event) {
    const target = event.currentTarget as (HTMLElement & { value?: string }) | null;
    this._searchQuery = target?.value ?? "";
    this._visibleSearchSurface = this._isMobile ? "mobile" : "desktop";
  }

  private _handleSearchFocusIn(surface: GlobalHeaderSearchSurface) {
    this._visibleSearchSurface = surface;
  }

  private _handleSearchFocusOut(
    surface: GlobalHeaderSearchSurface,
    event: FocusEvent,
  ) {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const nextTarget = event.relatedTarget as Node | null;
    if (currentTarget?.contains(nextTarget)) {
      return;
    }

    window.setTimeout(() => {
      if (this._visibleSearchSurface === surface) {
        this._visibleSearchSurface = null;
      }
    }, 0);
  }

  private _handleClearSearch() {
    this._searchQuery = "";
    this._visibleSearchSurface = this._isMobile
      ? this._mobileSearchOpen
        ? "mobile"
        : null
      : "desktop";
  }

  private _toggleMobileSearch(forceOpen?: boolean) {
    const nextOpen =
      typeof forceOpen === "boolean" ? forceOpen : !this._mobileSearchOpen;
    this._mobileSearchOpen = nextOpen;
    this._lastMobileToggle = "search";
    if (nextOpen) {
      this._mobileMenuOpen = false;
      this._visibleSearchSurface = "mobile";
    } else if (this._visibleSearchSurface === "mobile") {
      this._visibleSearchSurface = null;
    }
  }

  private _toggleMobileMenu(forceOpen?: boolean) {
    const nextOpen =
      typeof forceOpen === "boolean" ? forceOpen : !this._mobileMenuOpen;
    this._mobileMenuOpen = nextOpen;
    this._lastMobileToggle = "menu";
    if (nextOpen) {
      this._mobileSearchOpen = false;
      this._visibleSearchSurface = null;
    } else {
      this._mobilePath = { panelId: null, sectionIndex: null, itemIndex: null };
    }
  }

  private _setActivePanel(panelId: string) {
    const panel = this._getPanelById(panelId);
    if (!panel) return;
    this._activePanelId = panel.id;
    this._activeSectionIndex = panel.sections.length > 0 ? 0 : null;
    this._activeItemIndex =
      panel.sections[0]?.items?.length ? 0 : null;
  }

  private async _openDesktopPanel(panelId: string, focusPanel = false) {
    const button = this._getDesktopPanelTrigger(panelId);
    if (button?.id) {
      this._lastDesktopTriggerId = button.id;
    }
    this._setActivePanel(panelId);
    this._desktopPanelOpen = true;
    this._visibleSearchSurface = null;
    await this.updateComplete;
    if (focusPanel) {
      this._focusFirstPanelItem();
    }
  }

  private _closeDesktopPanel(restoreFocus = true) {
    this._desktopPanelOpen = false;
    if (!restoreFocus) {
      return;
    }

    const trigger = this._lastDesktopTriggerId
      ? this.shadowRoot?.getElementById(this._lastDesktopTriggerId)
      : null;
    if (trigger instanceof HTMLElement) {
      trigger.focus();
    }
  }

  private _getDesktopPanelTrigger(panelId: string): HTMLElement | null {
    return (
      this.shadowRoot?.querySelector<HTMLElement>(
        `[data-panel-trigger='${panelId}']`,
      ) ?? null
    );
  }

  private _focusFirstPanelItem() {
    const firstItem = this.shadowRoot?.querySelector<HTMLElement>(
      PANEL_FOCUSABLE_SELECTOR,
    );
    firstItem?.focus();
  }

  private _focusTopLevelIndex(index: number) {
    const items = [
      ...(this.shadowRoot?.querySelectorAll<HTMLElement>(TOP_ITEM_SELECTOR) ||
        []),
    ];
    items[index]?.focus();
  }

  private _handleTopLevelKeyDown(
    index: number,
    item: FdGlobalHeaderNavigationItem,
    event: KeyboardEvent,
  ) {
    const items = this._getTopLevelItems();
    if (!items.length) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      this._focusTopLevelIndex((index + 1) % items.length);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this._focusTopLevelIndex((index - 1 + items.length) % items.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      this._focusTopLevelIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      this._focusTopLevelIndex(items.length - 1);
      return;
    }

    if (event.key === "Escape" && isPanelItem(item) && this._desktopPanelOpen) {
      event.preventDefault();
      this._closeDesktopPanel(false);
      return;
    }

    if (event.key === "ArrowDown" && isPanelItem(item)) {
      event.preventDefault();
      void this._openDesktopPanel(item.id, true);
    }
  }

  private _handleDesktopTriggerClick(panelId: string) {
    if (this._desktopPanelOpen && this._activePanelId === panelId) {
      this._closeDesktopPanel(false);
      return;
    }

    void this._openDesktopPanel(panelId, false);
  }

  private _handleDesktopTriggerEnter(panelId: string) {
    if (this._isMobile) return;
    this._clearHoverTimer();
    this._hoverTimer = window.setTimeout(() => {
      this._hoverTimer = null;
      void this._openDesktopPanel(panelId, false);
    }, HOVER_INTENT_MS);
  }

  private _handleDesktopLinkEnter() {
    if (this._desktopPanelOpen) {
      this._closeDesktopPanel(false);
    }
  }

  private _handleFocusOut() {
    window.setTimeout(() => {
      if (this._isMobile || !this._desktopPanelOpen) return;
      if (this.matches(":focus-within") || this.matches(":hover")) return;
      this._closeDesktopPanel(false);
    }, 0);
  }

  private _handleDocumentPointerDown(event: PointerEvent) {
    if (!this.shadowRoot || !this.isConnected) return;
    const path = event.composedPath();
    if (path.includes(this)) {
      return;
    }

    this._clearHoverTimer();
    this._visibleSearchSurface = null;
    if (this._desktopPanelOpen) {
      this._closeDesktopPanel(false);
    }
    if (this._mobileMenuOpen) {
      this._toggleMobileMenu(false);
    }
    if (this._mobileSearchOpen) {
      this._toggleMobileSearch(false);
    }
  }

  private _onDocumentKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    if (this._mobileSearchOpen) {
      event.preventDefault();
      this._toggleMobileSearch(false);
      this._focusMobileToggle("search");
      return;
    }

    if (this._mobileMenuOpen) {
      event.preventDefault();
      this._toggleMobileMenu(false);
      this._focusMobileToggle("menu");
      return;
    }

    const activeWithinShadow = this.shadowRoot?.activeElement;
    if (
      this._desktopPanelOpen &&
      (this.matches(":focus-within") || Boolean(activeWithinShadow))
    ) {
      event.preventDefault();
      this._closeDesktopPanel(true);
    }
  }

  private _focusMobileToggle(kind: "menu" | "search") {
    const control = this.shadowRoot?.querySelector<HTMLElement>(
      `[data-mobile-toggle='${kind}']`,
    );
    control?.focus();
  }

  private _handleSectionEnter(index: number) {
    this._activeSectionIndex = index;
    const section = this._getActiveSection();
    const itemCount = section?.items?.length ?? 0;
    this._activeItemIndex = itemCount > 0 ? 0 : null;
  }

  private _handleItemEnter(index: number) {
    this._activeItemIndex = index;
  }

  private _renderSearchSurface(surface: GlobalHeaderSearchSurface) {
    if (!this.search) return nothing;

    const isVisible = this._visibleSearchSurface === surface;
    const suggestions = this._getSearchSuggestions(this._searchQuery);
    const showResults = isVisible && suggestions.length > 0;
    const showEmptyState =
      isVisible && this._searchQuery.trim().length > 0 && suggestions.length === 0;
    const label = this.search.label || "Search";
    const placeholder = this.search.placeholder || "Search";
    const submitLabel = this.search.submitLabel || "Open search";
    const wrapperClass = surface === "desktop" ? "desktop-search" : "mobile-search";

    return html`
      <div
        class=${wrapperClass}
        @focusin=${() => this._handleSearchFocusIn(surface)}
        @focusout=${(event: FocusEvent) =>
          this._handleSearchFocusOut(surface, event)}
      >
        <form
          part="search-form"
          role="search"
          class="search-inner"
          @submit=${(event: Event) => this._handleSearchSubmit(surface, event)}
        >
          <fd-input
            class="search-input"
            type="search"
            .value=${this._searchQuery}
            placeholder=${placeholder}
            aria-label=${label}
            @input=${this._handleSearchInput}
          >
            <fd-icon
              slot="prefix"
              name="magnifying-glass"
              aria-hidden="true"
            ></fd-icon>
            ${this._searchQuery
              ? html`
                  <button
                    slot="suffix"
                    class="search-clear"
                    type="button"
                    aria-label="Clear search"
                    @click=${this._handleClearSearch}
                  >
                    <fd-icon name="x" aria-hidden="true"></fd-icon>
                  </button>
                `
              : nothing}
          </fd-input>
          <button
            class="search-submit"
            type="submit"
            aria-label=${submitLabel}
            title=${submitLabel}
          >
            <fd-icon name="caret-right" aria-hidden="true"></fd-icon>
          </button>
        </form>
        <ul
          part="search-results"
          class="search-results"
          ?hidden=${!showResults}
        >
          ${suggestions.map(
            (suggestion) => html`
              <li>
                <a class="search-result-link" href=${suggestion.href}>
                  <span class="search-result-title">${suggestion.label}</span>
                  <span class="search-result-meta">${suggestion.meta}</span>
                </a>
              </li>
            `,
          )}
        </ul>
        <div class="search-status" ?hidden=${!showEmptyState}>
          No header destinations match “${this._searchQuery.trim()}”.
        </div>
      </div>
    `;
  }

  private _renderTopLevelItem(
    item: FdGlobalHeaderNavigationItem,
    index: number,
  ) {
    if (isLinkItem(item)) {
      return html`
        <li class="primary-item">
          <a
            class="primary-link"
            href=${item.href}
            aria-current=${ifDefined(item.current ? "page" : undefined)}
            data-top-level-index=${String(index)}
            @mouseenter=${this._handleDesktopLinkEnter}
            @focus=${this._handleDesktopLinkEnter}
            @keydown=${(event: KeyboardEvent) =>
              this._handleTopLevelKeyDown(index, item, event)}
          >
            ${item.label}
          </a>
        </li>
      `;
    }

    const isActive =
      this._desktopPanelOpen && this._activePanelId === item.id && !this._isMobile;
    const buttonId = `${this._baseId}-trigger-${item.id}`;

    return html`
      <li class="primary-item">
        <button
          id=${buttonId}
          class="primary-button"
          type="button"
          data-top-level-index=${String(index)}
          data-panel-trigger=${item.id}
          data-current=${String(Boolean(item.current))}
          aria-expanded=${String(isActive)}
          aria-controls=${this._desktopPanelId}
          @click=${() => this._handleDesktopTriggerClick(item.id)}
          @mouseenter=${() => this._handleDesktopTriggerEnter(item.id)}
          @keydown=${(event: KeyboardEvent) =>
            this._handleTopLevelKeyDown(index, item, event)}
        >
          <span>${item.label}</span>
          <fd-icon name="caret-down" aria-hidden="true"></fd-icon>
        </button>
      </li>
    `;
  }

  private get _desktopPanelId() {
    return `${this._baseId}-desktop-panel`;
  }

  private get _mobileMenuId() {
    return `${this._baseId}-mobile-menu`;
  }

  private get _mobileSearchId() {
    return `${this._baseId}-mobile-search`;
  }

  private _renderDesktopPanel() {
    const panel = this._getActivePanel();
    if (!panel) return nothing;

    const section = this._getActiveSection();
    const sectionItem = this._getActiveSectionItem();
    const sectionItems = section?.items || [];
    const tertiaryItems = sectionItem?.children || [];
    const tertiaryDescription =
      sectionItem?.description || section?.description || panel.description || "";

    return html`
      <div
        id=${this._desktopPanelId}
        class="desktop-panel"
        part="panel"
        role="region"
        aria-label=${panel.label}
        ?hidden=${!(this._desktopPanelOpen && !this._isMobile)}
        @mouseleave=${this._handleFocusOut}
        @focusout=${this._handleFocusOut}
      >
        <div class="shell desktop-panel-inner">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">${panel.label}</h2>
              ${panel.description
                ? html`<p class="panel-description">${panel.description}</p>`
                : nothing}
            </div>
            ${panel.href
              ? html`
                  <a class="panel-link" href=${panel.href}>
                    <span class="panel-link-label">Overview</span>
                  </a>
                `
              : nothing}
          </div>
          <div class="panel-columns">
            <section class="panel-column" part="panel-column">
              <h3 class="panel-column-heading">Sections</h3>
              <ul class="panel-list">
                ${panel.sections.map((panelSection, sectionIndex) => {
                  const isActive = this._activeSectionIndex === sectionIndex;
                  const content = html`
                    <span class="panel-link-label">${panelSection.label}</span>
                    ${panelSection.description
                      ? html`
                          <span class="panel-link-meta"
                            >${panelSection.description}</span
                          >
                        `
                      : nothing}
                  `;

                  if (panelSection.href) {
                    return html`
                      <li>
                        <a
                          class="panel-link"
                          href=${panelSection.href}
                          data-active=${String(isActive)}
                          data-panel-focusable="true"
                          @mouseenter=${() =>
                            this._handleSectionEnter(sectionIndex)}
                          @focus=${() => this._handleSectionEnter(sectionIndex)}
                        >
                          ${content}
                        </a>
                      </li>
                    `;
                  }

                  return html`
                    <li>
                      <button
                        class="panel-button"
                        type="button"
                        data-active=${String(isActive)}
                        data-panel-focusable="true"
                        @mouseenter=${() =>
                          this._handleSectionEnter(sectionIndex)}
                        @focus=${() => this._handleSectionEnter(sectionIndex)}
                      >
                        ${content}
                      </button>
                    </li>
                  `;
                })}
              </ul>
            </section>
            <section class="panel-column" part="panel-column">
              <h3 class="panel-column-heading">
                ${section?.label || "Links"}
              </h3>
              ${section?.description
                ? html`<p class="panel-context">${section.description}</p>`
                : nothing}
              ${sectionItems.length
                ? html`
                    <ul class="panel-list">
                      ${sectionItems.map((item, itemIndex) => {
                        const isActive = this._activeItemIndex === itemIndex;
                        return html`
                          <li>
                            <a
                              class="panel-link"
                              href=${item.href}
                              data-active=${String(isActive)}
                              data-panel-focusable="true"
                              @mouseenter=${() =>
                                this._handleItemEnter(itemIndex)}
                              @focus=${() => this._handleItemEnter(itemIndex)}
                            >
                              <span class="panel-link-label">${item.label}</span>
                              ${item.description
                                ? html`
                                    <span class="panel-link-meta"
                                      >${item.description}</span
                                    >
                                  `
                                : nothing}
                            </a>
                          </li>
                        `;
                      })}
                    </ul>
                  `
                : html`<p class="panel-empty">No additional links.</p>`}
            </section>
            <section class="panel-column" part="panel-column">
              <h3 class="panel-column-heading">
                ${sectionItem?.children?.length
                  ? sectionItem.label
                  : "Details"}
              </h3>
              ${tertiaryItems.length
                ? html`
                    <ul class="panel-list">
                      ${tertiaryItems.map(
                        (child) => html`
                          <li>
                            <a
                              class="panel-link"
                              href=${child.href}
                              data-panel-focusable="true"
                            >
                              <span class="panel-link-label">${child.label}</span>
                              ${child.description
                                ? html`
                                    <span class="panel-link-meta"
                                      >${child.description}</span
                                    >
                                  `
                                : nothing}
                            </a>
                          </li>
                        `,
                      )}
                    </ul>
                  `
                : tertiaryDescription
                  ? html`<p class="panel-context">${tertiaryDescription}</p>`
                  : html`<p class="panel-empty">Select a link to see more detail.</p>`}
            </section>
          </div>
        </div>
      </div>
    `;
  }

  private _renderMobileRootList() {
    return html`
      <ul class="mobile-list">
        ${this.navigation.map((item) => {
          if (isLinkItem(item)) {
            return html`
              <li>
                <a
                  class="mobile-link"
                  href=${item.href}
                  aria-current=${ifDefined(item.current ? "page" : undefined)}
                >
                  <span class="mobile-item-label">
                    <span>${item.label}</span>
                    ${item.description
                      ? html`
                          <span class="mobile-item-meta">${item.description}</span>
                        `
                      : nothing}
                  </span>
                </a>
              </li>
            `;
          }

          return html`
            <li>
              <button
                class="mobile-button"
                type="button"
                @click=${() => {
                  this._mobilePath = {
                    panelId: item.id,
                    sectionIndex: null,
                    itemIndex: null,
                  };
                }}
              >
                <span class="mobile-item-label">
                  <span>${item.label}</span>
                  ${item.description
                    ? html`
                        <span class="mobile-item-meta">${item.description}</span>
                      `
                    : nothing}
                </span>
                <fd-icon name="caret-right" aria-hidden="true"></fd-icon>
              </button>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private _renderMobileSectionList(panel: FdGlobalHeaderPanelItem) {
    return html`
      <ul class="mobile-list">
        ${panel.href
          ? html`
              <li>
                <a class="mobile-link" href=${panel.href}>
                  <span class="mobile-item-label">
                    <span>Overview</span>
                    ${panel.description
                      ? html`
                          <span class="mobile-item-meta">${panel.description}</span>
                        `
                      : nothing}
                  </span>
                </a>
              </li>
            `
          : nothing}
        ${panel.sections.map((section, sectionIndex) => {
          const hasItems = Boolean(section.items?.length);
          const content = html`
            <span class="mobile-item-label">
              <span>${section.label}</span>
              ${section.description
                ? html`<span class="mobile-item-meta">${section.description}</span>`
                : nothing}
            </span>
            ${hasItems
              ? html`<fd-icon name="caret-right" aria-hidden="true"></fd-icon>`
              : nothing}
          `;

          if (hasItems) {
            return html`
              <li>
                <button
                  class="mobile-button"
                  type="button"
                  @click=${() => {
                    this._mobilePath = {
                      panelId: panel.id,
                      sectionIndex,
                      itemIndex: null,
                    };
                  }}
                >
                  ${content}
                </button>
              </li>
            `;
          }

          return html`
            <li>
              <a class="mobile-link" href=${section.href || "#"}>${content}</a>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private _renderMobileItemList(
    panel: FdGlobalHeaderPanelItem,
    section: FdGlobalHeaderSection,
    sectionIndex: number,
  ) {
    return html`
      <ul class="mobile-list">
        ${section.href
          ? html`
              <li>
                <a class="mobile-link" href=${section.href}>
                  <span class="mobile-item-label">
                    <span>Section overview</span>
                    ${section.description
                      ? html`
                          <span class="mobile-item-meta">${section.description}</span>
                        `
                      : nothing}
                  </span>
                </a>
              </li>
            `
          : nothing}
        ${(section.items || []).map((item, itemIndex) => {
          const hasChildren = Boolean(item.children?.length);
          const content = html`
            <span class="mobile-item-label">
              <span>${item.label}</span>
              ${item.description
                ? html`<span class="mobile-item-meta">${item.description}</span>`
                : nothing}
            </span>
            ${hasChildren
              ? html`<fd-icon name="caret-right" aria-hidden="true"></fd-icon>`
              : nothing}
          `;

          if (hasChildren) {
            return html`
              <li>
                <button
                  class="mobile-button"
                  type="button"
                  @click=${() => {
                    this._mobilePath = {
                      panelId: panel.id,
                      sectionIndex,
                      itemIndex,
                    };
                  }}
                >
                  ${content}
                </button>
              </li>
            `;
          }

          return html`
            <li>
              <a class="mobile-link" href=${item.href}>${content}</a>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private _renderMobileChildList(item: FdGlobalHeaderSectionItem) {
    return html`
      <ul class="mobile-list">
        <li>
          <a class="mobile-link" href=${item.href}>
            <span class="mobile-item-label">
              <span>Item overview</span>
              ${item.description
                ? html`<span class="mobile-item-meta">${item.description}</span>`
                : nothing}
            </span>
          </a>
        </li>
        ${(item.children || []).map(
          (child) => html`
            <li>
              <a class="mobile-link" href=${child.href}>
                <span class="mobile-item-label">
                  <span>${child.label}</span>
                  ${child.description
                    ? html`
                        <span class="mobile-item-meta">${child.description}</span>
                      `
                    : nothing}
                </span>
              </a>
            </li>
          `,
        )}
      </ul>
    `;
  }

  private _renderMobileDrawer() {
    if (!this._isMobile) return nothing;

    const panel = this._mobilePath.panelId
      ? this._getPanelById(this._mobilePath.panelId)
      : null;
    const section =
      panel && this._mobilePath.sectionIndex != null
        ? panel.sections[this._mobilePath.sectionIndex] ?? null
        : null;
    const item =
      section && this._mobilePath.itemIndex != null
        ? section.items?.[this._mobilePath.itemIndex] ?? null
        : null;

    let heading = "Menu";
    let content: TemplateResult = this._renderMobileRootList();
    let backAction: (() => void) | null = null;

    if (panel) {
      heading = panel.label;
      content = this._renderMobileSectionList(panel);
      backAction = () => {
        this._mobilePath = { panelId: null, sectionIndex: null, itemIndex: null };
      };
    }

    if (panel && section) {
      heading = section.label;
      content = this._renderMobileItemList(
        panel,
        section,
        this._mobilePath.sectionIndex!,
      );
      backAction = () => {
        this._mobilePath = { panelId: panel.id, sectionIndex: null, itemIndex: null };
      };
    }

    if (item && section) {
      heading = item.label;
      content = this._renderMobileChildList(item);
      backAction = () => {
        this._mobilePath = {
          panelId: panel?.id || null,
          sectionIndex: this._mobilePath.sectionIndex,
          itemIndex: null,
        };
      };
    }

    return html`
      <div
        class="mobile-backdrop"
        data-open=${String(this._mobileMenuOpen || this._mobileSearchOpen)}
        aria-hidden=${String(!(this._mobileMenuOpen || this._mobileSearchOpen))}
      ></div>
      <div
        id=${this._mobileMenuId}
        class="mobile-surface"
        part="mobile-drawer"
        data-open=${String(this._mobileMenuOpen)}
        ?hidden=${!this._mobileMenuOpen}
      >
        <div class="shell mobile-panel">
          <div class="mobile-header">
            <h2 class="mobile-heading">${heading}</h2>
            ${backAction
              ? html`
                  <button
                    class="icon-control"
                    type="button"
                    aria-label="Back"
                    @click=${backAction}
                  >
                    <fd-icon name="caret-left" aria-hidden="true"></fd-icon>
                  </button>
                `
              : nothing}
          </div>
          ${content}
        </div>
      </div>
    `;
  }

  override render() {
    const hasNavigation = this.navigation.length > 0;

    return html`
      <header part="base" @focusout=${this._handleFocusOut}>
        <div class="masthead" part="masthead">
          <div class="shell">
            <div class="masthead-row">
              <div class="brand-row">
                <button
                  class="icon-control menu-toggle"
                  type="button"
                  data-mobile-toggle="menu"
                  aria-label=${this._mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded=${String(this._mobileMenuOpen)}
                  aria-controls=${this._mobileMenuId}
                  ?hidden=${!this._isMobile || !hasNavigation}
                  @click=${() => this._toggleMobileMenu()}
                >
                  <fd-icon
                    name=${this._mobileMenuOpen ? "x" : "caret-down"}
                    aria-hidden="true"
                  ></fd-icon>
                  <span class="toggle-label">Menu</span>
                </button>
                <slot name="brand"></slot>
              </div>
              <div class="utility-row">
                <slot name="utility"></slot>
                <button
                  class="icon-control"
                  type="button"
                  data-mobile-toggle="search"
                  aria-label=${this._mobileSearchOpen ? "Close search" : "Open search"}
                  aria-expanded=${String(this._mobileSearchOpen)}
                  aria-controls=${this._mobileSearchId}
                  ?hidden=${!this._isMobile || !this.search}
                  @click=${() => this._toggleMobileSearch()}
                >
                  <fd-icon
                    name=${this._mobileSearchOpen ? "x" : "magnifying-glass"}
                    aria-hidden="true"
                  ></fd-icon>
                </button>
                ${this._renderSearchSurface("desktop")}
              </div>
            </div>
            <div
              id=${this._mobileSearchId}
              class="mobile-search-row"
              data-open=${String(this._mobileSearchOpen)}
            >
              ${this._renderSearchSurface("mobile")}
            </div>
          </div>
        </div>

        ${hasNavigation
          ? html`
              <nav
                class="primary-nav"
                part="primary-nav"
                aria-label="Primary"
              >
                <div class="shell">
                  <ul class="primary-list">
                    ${this.navigation.map((item, index) =>
                      this._renderTopLevelItem(item, index),
                    )}
                  </ul>
                </div>
                ${this._renderDesktopPanel()}
              </nav>
            `
          : nothing}

        ${this._renderMobileDrawer()}
      </header>
    `;
  }
}
