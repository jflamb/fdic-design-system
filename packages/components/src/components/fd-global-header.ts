import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import type {
  FdHeaderSearchActivateDetail,
  FdHeaderSearchInputDetail,
  FdHeaderSearchItem,
  FdHeaderSearchOpenChangeDetail,
  FdHeaderSearchSubmitDetail,
  HeaderSearchSurface,
} from "./fd-header-search.js";

export type GlobalHeaderSearchSurface = HeaderSearchSurface;

export interface FdGlobalHeaderLeafItem {
  id?: string;
  label: string;
  href: string;
  description?: string;
  keywords?: string[];
}

export interface FdGlobalHeaderSectionItem extends FdGlobalHeaderLeafItem {
  children?: FdGlobalHeaderLeafItem[];
}

export interface FdGlobalHeaderSection {
  id?: string;
  label: string;
  href?: string;
  overviewLabel?: string;
  overviewHref?: string;
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
  overviewLabel?: string;
  ariaLabel?: string;
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
  items?: FdHeaderSearchItem[];
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  searchAllLabel?: string;
  paramName?: string;
}

export type FdGlobalHeaderSearchSubmitDetail = FdHeaderSearchSubmitDetail;

type MobileDrillPath = [] | [string] | [string, number] | [string, number, number];

const MOBILE_BREAKPOINT_QUERY = "(max-width: 768px)";
const HOVER_INTENT_MS = 140;
const PREVIEW_CLEAR_MS = 180;
const PANEL_FOCUSABLE_SELECTOR = "[data-panel-focusable='true']";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let globalHeaderInstanceCount = 0;

function normalizeSearchText(value: string | undefined) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractLauncherAliasData(label: string) {
  const parentheticalAliases = new Set<string>();
  const derivedAcronyms = new Set<string>();
  const rawLabel = String(label || "");
  const parentheticalMatches = [...rawLabel.matchAll(/\(([^)]+)\)/g)];

  parentheticalMatches.forEach(([, match]) => {
    const normalizedMatch = normalizeSearchText(match);
    if (!normalizedMatch) {
      return;
    }

    parentheticalAliases.add(normalizedMatch);
    normalizedMatch.split(" ").forEach((token) => {
      if (token.length >= 2) {
        parentheticalAliases.add(token);
      }
    });
  });

  const acronymSource = normalizeSearchText(rawLabel.replace(/\([^)]*\)/g, " "));
  const acronymWords = acronymSource
    .split(" ")
    .filter(
      (word) =>
        word &&
        !["a", "an", "and", "for", "of", "the", "to"].includes(word),
    );

  if (acronymWords.length >= 2) {
    derivedAcronyms.add(acronymWords.map((word) => word[0]).join(""));
  }

  return {
    parentheticalAliases: [...parentheticalAliases],
    derivedAcronyms: [...derivedAcronyms],
  };
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

function getDefaultSectionIndex(panel: FdGlobalHeaderPanelItem | null) {
  if (!panel || panel.sections.length === 0) {
    return null;
  }

  return panel.sections.length > 1 ? 1 : 0;
}

function getSectionOverview(section: FdGlobalHeaderSection | null) {
  if (!section || (!section.overviewLabel && !section.overviewHref)) {
    return null;
  }

  return {
    label: section.overviewLabel || `${section.label} Overview`,
    href: section.overviewHref || section.href || "#",
    description: "",
  };
}

function getFallbackSectionDescription(
  section: FdGlobalHeaderSection | null,
  panelLabel: string,
  isOverview = false,
) {
  const label = section?.label || "this section";
  if (isOverview) {
    return `Start with the full ${panelLabel} overview, then jump to the area you need.`;
  }

  return `Explore ${label} services, guidance, and related resources.`;
}

function getSectionMenuDescription(
  section: FdGlobalHeaderSection | null,
  panelLabel: string,
  isOverview = false,
) {
  const overview = getSectionOverview(section);
  const explicitDescription = section?.description || overview?.description || "";
  if (explicitDescription) {
    return explicitDescription;
  }

  return getFallbackSectionDescription(section, panelLabel, isOverview);
}

export function createHeaderSearchItemsFromNavigation(
  navigation: FdGlobalHeaderNavigationItem[],
) {
  const entries: FdHeaderSearchItem[] = [];

  navigation.forEach((item) => {
    if (isLinkItem(item)) {
      entries.push({
        id: item.id || `link:${item.label}`,
        title: item.label,
        href: item.href,
        description: item.description,
        keywords: item.keywords,
      });
      return;
    }

    const panelLabel = item.label;
    const { parentheticalAliases, derivedAcronyms } = extractLauncherAliasData(
      item.label,
    );

    entries.push({
      id: `panel:${item.id}`,
      title: item.label,
      href: item.href || "#",
      description: item.ariaLabel || item.description,
      keywords: [
        ...(item.keywords || []),
        ...parentheticalAliases,
        ...derivedAcronyms,
      ],
    });

    item.sections.forEach((section, sectionIndex) => {
      entries.push({
        id: `l1:${item.id}:${sectionIndex}`,
        title: section.label,
        href: section.overviewHref || section.href || "#",
        meta: [panelLabel, section.label].filter(Boolean).join(" / "),
        description: section.description,
        keywords: section.keywords,
      });

      const overview = getSectionOverview(section);
      if (overview) {
        entries.push({
          id: `l2overview:${item.id}:${sectionIndex}`,
          title: overview.label,
          href: overview.href,
          meta: [panelLabel, section.label].filter(Boolean).join(" / "),
          description: overview.description,
          keywords: section.keywords,
        });
      }

      (section.items || []).forEach((sectionItem, itemIndex) => {
        const meta = [panelLabel, section.label, sectionItem.label]
          .filter(Boolean)
          .join(" / ");

        entries.push({
          id: `l2:${item.id}:${sectionIndex}:${itemIndex}`,
          title: sectionItem.label,
          href: sectionItem.href,
          meta,
          description: sectionItem.description,
          keywords: sectionItem.keywords,
        });

        (sectionItem.children || []).forEach((child, childIndex) => {
          entries.push({
            id: `l3:${item.id}:${sectionIndex}:${itemIndex}:${childIndex}`,
            title: child.label,
            href: child.href,
            meta,
            description: child.description,
            keywords: child.keywords,
          });
        });
      });
    });
  });

  return entries;
}

export class FdGlobalHeader extends LitElement {
  static properties = {
    navigation: { attribute: false },
    search: { attribute: false },
    _activePanelId: { state: true },
    _menuOpen: { state: true },
    _selectedSectionIndex: { state: true },
    _selectedItemIndex: { state: true },
    _previewItemIndex: { state: true },
    _previewingOverview: { state: true },
    _topNavFocusIndex: { state: true },
    _isMobile: { state: true },
    _mobileMenuOpen: { state: true },
    _mobileSearchOpen: { state: true },
    _mobilePath: { state: true },
    _searchValue: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: #10243e;
      font-family: var(
        --fdic-font-family-sans-serif,
        "Source Sans 3",
        "Source Sans Pro",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif
      );
      position: relative;
      z-index: 0;
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

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      color: inherit;
    }

    .base {
      position: relative;
      z-index: 0;
      border-bottom: 1px solid rgba(9, 53, 84, 0.12);
      background: #ffffff;
    }

    .shell {
      width: min(90rem, calc(100% - 8rem));
      margin-inline: auto;
    }

    .masthead {
      background: #003256;
      color: #ffffff;
    }

    .masthead-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-height: 5.1875rem;
      padding-block: 0.75rem;
    }

    .brand-row,
    .controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .brand-row {
      flex: 1 1 auto;
    }

    .controls {
      flex: 0 1 auto;
      justify-content: flex-end;
    }

    ::slotted([slot="brand"]) {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
      color: inherit;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .utility {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    ::slotted([slot="utility"]) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.75rem;
      min-height: 2.75rem;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      color: inherit;
    }

    .icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-width: 2.75rem;
      min-height: 2.75rem;
      padding: 0 0.875rem;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .icon-button fd-icon {
      --fd-icon-size: 1.25rem;
    }

    .icon-button--round {
      padding-inline: 0;
      width: 2.75rem;
    }

    .desktop-search {
      display: block;
    }

    .mobile-controls {
      display: none;
      align-items: center;
      gap: 0.5rem;
    }

    .top-nav {
      background: #ffffff;
      border-bottom: 1px solid rgba(9, 53, 84, 0.12);
      position: relative;
      z-index: 2;
    }

    .top-nav-list {
      display: flex;
      align-items: stretch;
      gap: 0;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .top-nav-item {
      display: flex;
      align-items: stretch;
      position: relative;
    }

    .top-nav-link,
    .top-nav-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 3rem;
      padding: 0 1.25rem;
      border: 0;
      border-bottom: 4px solid transparent;
      background: transparent;
      color: #10243e;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      white-space: nowrap;
    }

    .top-nav-button fd-icon {
      --fd-icon-size: 1rem;
      transition: transform 180ms ease;
    }

    .top-nav-button[aria-expanded="true"] fd-icon {
      transform: rotate(180deg);
    }

    .top-nav-link:hover,
    .top-nav-link:focus-visible,
    .top-nav-button:hover,
    .top-nav-button:focus-visible,
    .top-nav-link[aria-current="page"],
    .top-nav-button[data-active="true"] {
      background: rgba(0, 110, 190, 0.08);
      border-bottom-color: #84dbff;
      outline: none;
    }

    .mega-menu {
      position: absolute;
      inset-inline: 0;
      top: 100%;
      background: #ffffff;
      border-bottom: 1px solid rgba(9, 53, 84, 0.12);
      box-shadow: 0 18px 48px rgba(0, 18, 32, 0.22);
      z-index: 3;
    }

    .mega-menu[hidden] {
      display: none;
    }

    .mega-menu-inner {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-height: 14.8125rem;
      overflow: hidden;
    }

    .mega-col {
      position: relative;
      min-width: 0;
      padding: 1rem 1.125rem 1.25rem;
    }

    .mega-col::before {
      content: "";
      position: absolute;
      inset-inline-start: 0;
      top: var(--column-rail-top, 0px);
      width: 4px;
      height: var(--column-rail-height, 0px);
      background: #38b6ff;
      opacity: var(--column-rail-opacity, 0);
      transition:
        top 180ms ease,
        height 180ms ease,
        opacity 180ms ease;
    }

    .mega-col--l1 {
      background: #ffffff;
    }

    .mega-col--l2 {
      background: #f7fafc;
      border-inline-start: 1px solid rgba(9, 53, 84, 0.08);
    }

    .mega-col--l3 {
      background: #edf3f7;
      border-inline-start: 1px solid rgba(9, 53, 84, 0.08);
    }

    .menu-heading {
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

    .menu-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .menu-list--with-intro {
      padding-top: 0;
    }

    .menu-item-link,
    .menu-item-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      width: 100%;
      min-height: 3rem;
      padding: 0.75rem 0.875rem;
      border: 0;
      background: transparent;
      color: inherit;
      text-align: left;
      border-radius: 0.625rem;
      cursor: pointer;
    }

    .menu-item-link:hover,
    .menu-item-link:focus-visible,
    .menu-item-button:hover,
    .menu-item-button:focus-visible,
    .menu-item-link[data-active="true"],
    .menu-item-button[data-active="true"],
    .menu-item-button[data-selected="true"] {
      background: rgba(0, 110, 190, 0.08);
      outline: none;
    }

    .menu-item-label {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.25;
      color: #0c2336;
    }

    .menu-item-meta,
    .menu-description,
    .menu-empty {
      color: #4b5b69;
      font-size: 0.9375rem;
      line-height: 1.35;
    }

    .menu-description {
      margin: 0;
      padding: 0.25rem 0.875rem 0.875rem;
    }

    .menu-description--inline {
      padding-top: 0;
    }

    .menu-description--l3 {
      padding-inline: 0;
    }

    .menu-caret {
      color: #0b466f;
      --fd-icon-size: 1rem;
      flex: none;
    }

    .menu-spacer {
      width: 1rem;
      height: 1rem;
      flex: none;
    }

    .menu-divider {
      height: 1px;
      margin: 0.125rem 0 0.75rem;
      background: rgba(9, 53, 84, 0.1);
    }

    .menu-empty {
      margin: 0;
      padding: 0.875rem;
    }

    .mobile-drawer {
      --fd-drawer-surface: #ffffff;
      --fd-drawer-border-color: rgba(9, 53, 84, 0.14);
      --fd-drawer-shadow: 0 18px 48px rgba(0, 18, 32, 0.22);
    }

    .mobile-drawer-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid rgba(9, 53, 84, 0.08);
    }

    .mobile-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: 0;
      background: transparent;
      color: #0b466f;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }

    .mobile-back fd-icon {
      --fd-icon-size: 1rem;
    }

    .mobile-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      line-height: 1.2;
      color: #0c2336;
    }

    .mobile-list {
      margin: 0;
      padding: 0.5rem 1rem 1rem;
      list-style: none;
      display: grid;
      gap: 0.25rem;
    }

    .mobile-context {
      padding: 0.5rem 1rem 0;
    }

    .mobile-context-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.375rem;
      margin: 0;
      padding: 0;
      list-style: none;
      color: #4b5b69;
      font-size: 0.875rem;
      line-height: 1.35;
    }

    .mobile-context-crumb,
    .mobile-context-current {
      display: inline-flex;
      align-items: center;
      border: 0;
      background: transparent;
      color: inherit;
      padding: 0;
      font: inherit;
    }

    .mobile-context-crumb {
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 0.12em;
    }

    .mobile-context-separator {
      color: #0b466f;
      --fd-icon-size: 0.875rem;
    }

    .mobile-link,
    .mobile-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      width: 100%;
      min-height: 3rem;
      padding: 0.875rem 0.875rem;
      border: 0;
      border-radius: 0.75rem;
      background: transparent;
      color: inherit;
      text-align: left;
      cursor: pointer;
    }

    .mobile-link:hover,
    .mobile-link:focus-visible,
    .mobile-button:hover,
    .mobile-button:focus-visible {
      background: rgba(0, 110, 190, 0.08);
      outline: none;
    }

    .mobile-item-copy {
      display: grid;
      gap: 0.1875rem;
    }

    .mobile-item-label {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.25;
      color: #0c2336;
    }

    .mobile-item-meta {
      color: #4b5b69;
      font-size: 0.9375rem;
      line-height: 1.35;
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

    @media (min-width: 769px) and (max-width: 1049px) {
      .shell {
        width: min(90rem, calc(100% - 4rem));
      }
    }

    @media (max-width: 768px) {
      .shell {
        width: min(100%, calc(100% - 2rem));
      }

      .masthead-row {
        min-height: 4.5rem;
      }

      .desktop-search,
      .top-nav,
      .utility {
        display: none;
      }

      .mobile-controls {
        display: inline-flex;
      }
    }

    @media (forced-colors: active) {
      .base,
      .top-nav,
      .mega-menu,
      .icon-button,
      .menu-item-link,
      .menu-item-button,
      .mobile-link,
      .mobile-button {
        forced-color-adjust: none;
      }

      .top-nav-link[aria-current="page"],
      .top-nav-button[data-active="true"] {
        border-bottom-color: Highlight;
      }
    }
  `;

  declare navigation: FdGlobalHeaderNavigationItem[];
  declare search: FdGlobalHeaderSearchConfig | null;
  declare _activePanelId: string | null;
  declare _menuOpen: boolean;
  declare _selectedSectionIndex: number | null;
  declare _selectedItemIndex: number;
  declare _previewItemIndex: number | null;
  declare _previewingOverview: boolean;
  declare _topNavFocusIndex: number;
  declare _isMobile: boolean;
  declare _mobileMenuOpen: boolean;
  declare _mobileSearchOpen: boolean;
  declare _mobilePath: MobileDrillPath;
  declare _searchValue: string;

  private _baseId: string;
  private _mobileMediaQuery: MediaQueryList | null = null;
  private _hoverTimer: number | null = null;
  private _closeTimer: number | null = null;
  private _lastDesktopTriggerId: string | null = null;
  private _lastMobileToggle: "menu" | "search" | null = null;
  private _lastMobilePath: MobileDrillPath = [];
  private readonly _onDocumentPointerDownBound =
    this._handleDocumentPointerDown.bind(this);
  private readonly _onDocumentKeyDownBound = this._handleDocumentKeyDown.bind(this);
  private readonly _onMobileMediaChangeBound = (
    event: MediaQueryListEvent,
  ) => {
    this._syncMobileState(event.matches);
  };

  constructor() {
    super();
    this.navigation = [];
    this.search = null;
    this._activePanelId = null;
    this._menuOpen = false;
    this._selectedSectionIndex = null;
    this._selectedItemIndex = 0;
    this._previewItemIndex = null;
    this._previewingOverview = false;
    this._topNavFocusIndex = 0;
    this._isMobile = false;
    this._mobileMenuOpen = false;
    this._mobileSearchOpen = false;
    this._mobilePath = [];
    this._searchValue = "";
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
    document.addEventListener("keydown", this._onDocumentKeyDownBound, true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._clearHoverTimer();
    this._clearCloseTimer();
    this._mobileMediaQuery?.removeEventListener(
      "change",
      this._onMobileMediaChangeBound,
    );
    document.removeEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
    document.removeEventListener("keydown", this._onDocumentKeyDownBound, true);
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("navigation")) {
      this._normalizeNavigationState();
    }
  }

  override updated(changed: PropertyValues<this>) {
    if (
      changed.has("_menuOpen") ||
      changed.has("_activePanelId") ||
      changed.has("_selectedSectionIndex") ||
      changed.has("_previewItemIndex") ||
      changed.has("_previewingOverview")
    ) {
      this.updateComplete.then(() => this._syncColumnRails());
    }

    if (changed.has("_mobileMenuOpen") && this._mobileMenuOpen) {
      this.updateComplete.then(() => this._focusFirstMobileControl());
    }

    if (changed.has("_mobileSearchOpen") && this._mobileSearchOpen) {
      this.updateComplete.then(() => {
        const mobileSearch = this.shadowRoot?.querySelector<any>(
          "[data-search-surface='mobile']",
        );
        mobileSearch?.focus();
        mobileSearch?.select?.();
      });
    }
  }

  override focus(options?: FocusOptions) {
    const target = this._isMobile
      ? this._getMobileToggle("menu")
      : this._getTopNavItems()[0];
    target?.focus(options);
  }

  private _syncMobileState(isMobile: boolean) {
    this._isMobile = isMobile;
    if (isMobile) {
      this._menuOpen = false;
    } else {
      this._mobileMenuOpen = false;
      this._mobileSearchOpen = false;
      this._mobilePath = [];
      this._lastMobileToggle = null;
    }
  }

  private _normalizeNavigationState() {
    const firstPanel = this.navigation.find(isPanelItem) || null;
    if (!firstPanel) {
      this._activePanelId = null;
      this._selectedSectionIndex = null;
      return;
    }

    if (!this._activePanelId || !this._getPanelById(this._activePanelId)) {
      this._activePanelId = firstPanel.id;
      this._resetPanelSelection(firstPanel);
    }
  }

  private _clearHoverTimer() {
    if (this._hoverTimer == null) {
      return;
    }

    window.clearTimeout(this._hoverTimer);
    this._hoverTimer = null;
  }

  private _clearCloseTimer() {
    if (this._closeTimer == null) {
      return;
    }

    window.clearTimeout(this._closeTimer);
    this._closeTimer = null;
  }

  private _scheduleHover(callback: () => void) {
    this._clearHoverTimer();
    this._hoverTimer = window.setTimeout(() => {
      this._hoverTimer = null;
      callback();
    }, HOVER_INTENT_MS);
  }

  private _scheduleDesktopClose() {
    this._clearCloseTimer();
    this._closeTimer = window.setTimeout(() => {
      this._closeTimer = null;
      if (!this._isMobile) {
        this._closeMenu();
      }
    }, PREVIEW_CLEAR_MS);
  }

  private _cancelDesktopClose() {
    this._clearCloseTimer();
  }

  private _getTopLevelItems() {
    return this.navigation;
  }

  private _getTopNavItems() {
    return Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>("[data-top-nav-index]") || [],
    );
  }

  private _getMobileToggle(kind: "menu" | "search") {
    return this.shadowRoot?.querySelector<HTMLElement>(
      `[data-mobile-toggle='${kind}']`,
    );
  }

  private _getPanelById(panelId: string) {
    return this.navigation.find(
      (item): item is FdGlobalHeaderPanelItem =>
        isPanelItem(item) && item.id === panelId,
    ) || null;
  }

  private _getActivePanel() {
    return this._activePanelId ? this._getPanelById(this._activePanelId) : null;
  }

  private _getSelectedSection() {
    const panel = this._getActivePanel();
    if (!panel || this._selectedSectionIndex == null) {
      return null;
    }

    return panel.sections[this._selectedSectionIndex] || null;
  }

  private _getVisibleItemIndex() {
    if (this._previewItemIndex != null) {
      return this._previewItemIndex;
    }

    return this._selectedItemIndex;
  }

  private _getVisibleItem() {
    const section = this._getSelectedSection();
    if (!section) {
      return null;
    }

    return section.items?.[this._getVisibleItemIndex()] || null;
  }

  private _getSearchItems() {
    if (!this.search) {
      return [];
    }

    return this.search.items || createHeaderSearchItemsFromNavigation(this.navigation);
  }

  private _resetPanelSelection(panel: FdGlobalHeaderPanelItem | null = this._getActivePanel()) {
    this._selectedSectionIndex = getDefaultSectionIndex(panel);
    this._selectedItemIndex = 0;
    this._previewItemIndex = null;
    this._previewingOverview = false;
  }

  private _setActivePanel(panelId: string) {
    const panel = this._getPanelById(panelId);
    if (!panel) {
      return;
    }

    this._activePanelId = panel.id;
    this._resetPanelSelection(panel);
    const navIndex = this.navigation.findIndex(
      (item) => isPanelItem(item) && item.id === panelId,
    );
    if (navIndex >= 0) {
      this._topNavFocusIndex = navIndex;
    }
  }

  private _openMenu({ focusFirst = false } = {}) {
    if (this._isMobile || !this._activePanelId) {
      return;
    }

    this._menuOpen = true;
    this._mobileMenuOpen = false;
    this._mobileSearchOpen = false;
    if (focusFirst) {
      this.updateComplete.then(() => this._focusFirstDesktopPanelControl());
    }
  }

  private _closeMenu({ restoreFocus = false } = {}) {
    if (!this._menuOpen) {
      return;
    }

    this._menuOpen = false;
    this._previewItemIndex = null;
    this._previewingOverview = false;

    if (restoreFocus && this._lastDesktopTriggerId) {
      this.updateComplete.then(() => {
        this.shadowRoot
          ?.querySelector<HTMLElement>(`#${this._lastDesktopTriggerId}`)
          ?.focus();
      });
    }
  }

  private _toggleMobileMenu() {
    const nextOpen = !this._mobileMenuOpen;
    this._lastMobileToggle = "menu";
    if (nextOpen) {
      this._mobileSearchOpen = false;
      this._mobilePath =
        this._lastMobilePath.length > 0
          ? this._lastMobilePath
          : this._activePanelId
            ? [this._activePanelId]
            : [];
    } else {
      this._lastMobilePath = this._mobilePath;
      this.updateComplete.then(() => this._getMobileToggle("menu")?.focus());
    }
    this._mobileMenuOpen = nextOpen;
  }

  private _toggleMobileSearch(forceOpen?: boolean) {
    if (!this.search) {
      return;
    }

    const nextOpen =
      typeof forceOpen === "boolean" ? forceOpen : !this._mobileSearchOpen;
    this._lastMobileToggle = "search";
    this._mobileSearchOpen = nextOpen;
    if (nextOpen) {
      this._mobileMenuOpen = false;
      return;
    }

    this.updateComplete.then(() => this._getMobileToggle("search")?.focus());
  }

  private _handleDocumentPointerDown(event: PointerEvent) {
    const path = event.composedPath();
    if (path.includes(this)) {
      return;
    }

    if (this._menuOpen) {
      this._closeMenu();
    }

    if (this._mobileMenuOpen) {
      this._mobileMenuOpen = false;
    }

    if (this._mobileSearchOpen) {
      this._toggleMobileSearch(false);
    }
  }

  private _handleDocumentKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape") {
      return;
    }

    if (this._mobileSearchOpen) {
      event.preventDefault();
      this._toggleMobileSearch(false);
      this.updateComplete.then(() => this._getMobileToggle("search")?.focus());
      return;
    }

    if (this._mobileMenuOpen) {
      event.preventDefault();
      this._mobileMenuOpen = false;
      this.updateComplete.then(() => this._getMobileToggle("menu")?.focus());
      return;
    }

    if (this._menuOpen) {
      event.preventDefault();
      this._closeMenu({ restoreFocus: true });
    }
  }

  private _handleTopNavClick(item: FdGlobalHeaderNavigationItem, index: number) {
    if (isLinkItem(item)) {
      this._closeMenu();
      return;
    }

    this._lastDesktopTriggerId = this._getTopTriggerId(item.id);
    if (this._menuOpen && this._activePanelId === item.id) {
      this._closeMenu();
      return;
    }

    this._topNavFocusIndex = index;
    this._setActivePanel(item.id);
    this._openMenu();
  }

  private _handleTopNavPointerEnter(item: FdGlobalHeaderNavigationItem, index: number) {
    if (this._isMobile || isLinkItem(item)) {
      return;
    }

    this._cancelDesktopClose();
    this._scheduleHover(() => {
      this._topNavFocusIndex = index;
      this._setActivePanel(item.id);
      this._openMenu();
    });
  }

  private _handleTopNavKeydown(
    event: KeyboardEvent,
    item: FdGlobalHeaderNavigationItem,
    index: number,
  ) {
    const items = this._getTopNavItems();
    if (items.length === 0) {
      return;
    }

    const moveToIndex = (nextIndex: number) => {
      const wrapped = (nextIndex + items.length) % items.length;
      this._topNavFocusIndex = wrapped;
      items[wrapped]?.focus();
    };

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToIndex(index + 1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToIndex(index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveToIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveToIndex(items.length - 1);
      return;
    }

    if (event.key === "ArrowDown" && isPanelItem(item)) {
      event.preventDefault();
      this._lastDesktopTriggerId = this._getTopTriggerId(item.id);
      this._topNavFocusIndex = index;
      this._setActivePanel(item.id);
      this._openMenu({ focusFirst: true });
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isPanelItem(item)) {
      event.preventDefault();
      this._handleTopNavClick(item, index);
    }
  }

  private _getTopTriggerId(panelId: string) {
    return `${this._baseId}-trigger-${panelId}`;
  }

  private _focusFirstDesktopPanelControl() {
    this.shadowRoot
      ?.querySelector<HTMLElement>(PANEL_FOCUSABLE_SELECTOR)
      ?.focus();
  }

  private _setSectionSelection(index: number, restoreFocus = false) {
    if (this._selectedSectionIndex === index && !this._previewingOverview && this._previewItemIndex == null) {
      if (restoreFocus) {
        this._focusColumnItem(".mega-col--l1", `.menu-item-button[data-index='${index}'], .menu-item-link[data-index='${index}']`);
      }
      return;
    }

    this._selectedSectionIndex = index;
    this._selectedItemIndex = 0;
    this._previewItemIndex = null;
    this._previewingOverview = false;

    if (restoreFocus) {
      this.updateComplete.then(() => {
        this._focusColumnItem(
          ".mega-col--l1",
          `.menu-item-button[data-index='${index}'], .menu-item-link[data-index='${index}']`,
        );
      });
    }
  }

  private _setPreviewItem(index: number, restoreFocus = false) {
    this._previewItemIndex = index;
    this._previewingOverview = false;
    if (restoreFocus) {
      this.updateComplete.then(() => {
        this._focusColumnItem(".mega-col--l2", `.menu-item-link[data-index='${index}']`);
      });
    }
  }

  private _setPreviewOverview(restoreFocus = false) {
    this._previewItemIndex = null;
    this._previewingOverview = true;
    if (restoreFocus) {
      this.updateComplete.then(() => {
        this._focusColumnItem(".mega-col--l2", ".menu-item-link--overview");
      });
    }
  }

  private _clearPreview() {
    this._previewItemIndex = null;
    this._previewingOverview = false;
  }

  private _focusColumnItem(columnSelector: string, itemSelector: string) {
    const column = this.shadowRoot?.querySelector<HTMLElement>(columnSelector);
    const items = Array.from(
      column?.querySelectorAll<HTMLElement>(
        ".menu-item-link, .menu-item-button",
      ) || [],
    );
    const target = column?.querySelector<HTMLElement>(itemSelector) || null;
    if (!target) {
      return false;
    }

    items.forEach((item) => {
      item.tabIndex = item === target ? 0 : -1;
    });
    target.focus();
    return true;
  }

  private _focusActiveL2() {
    const selector = this._previewingOverview
      ? ".menu-item-link--overview"
      : this._previewItemIndex != null
        ? `.menu-item-link[data-index='${this._previewItemIndex}']`
        : ".mega-col--l2 .menu-item-link[data-index='0']";

    return this._focusColumnItem(".mega-col--l2", selector);
  }

  private _focusActiveL3() {
    return this._focusColumnItem(".mega-col--l3", ".menu-item-link[data-index='0']");
  }

  private _focusSelectedL1() {
    if (this._selectedSectionIndex == null) {
      return false;
    }

    return this._focusColumnItem(
      ".mega-col--l1",
      `.menu-item-button[data-index='${this._selectedSectionIndex}'], .menu-item-link[data-index='${this._selectedSectionIndex}']`,
    );
  }

  private _handlePanelKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const withinL1 = target.closest(".mega-col--l1");
    const withinL2 = target.closest(".mega-col--l2");
    const withinL3 = target.closest(".mega-col--l3");

    const moveWithinColumn = (selector: string) => {
      const items = Array.from(
        target
          .closest(".mega-col, .mobile-list")
          ?.querySelectorAll<HTMLElement>(selector) || [],
      );
      const currentIndex = items.indexOf(target);
      if (currentIndex < 0) {
        return;
      }

      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      items.forEach((item) => {
        item.tabIndex = item === items[nextIndex] ? 0 : -1;
      });
      items[nextIndex]?.focus();
    };

    if (
      ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) &&
      (withinL1 || withinL2 || withinL3)
    ) {
      moveWithinColumn(".menu-item-link, .menu-item-button");
      return;
    }

    if (event.key === "ArrowRight" && withinL1) {
      event.preventDefault();
      this._focusActiveL2();
      return;
    }

    if (event.key === "ArrowLeft" && withinL2) {
      event.preventDefault();
      this._focusSelectedL1();
      return;
    }

    if (event.key === "ArrowRight" && withinL2) {
      event.preventDefault();
      this._focusActiveL3();
      return;
    }

    if (event.key === "ArrowLeft" && withinL3) {
      event.preventDefault();
      this._focusActiveL2();
    }
  }

  private _handleDesktopFocusOut() {
    window.requestAnimationFrame(() => {
      const activeElement = this.shadowRoot?.activeElement || document.activeElement;
      if (
        activeElement &&
        (this.shadowRoot?.querySelector(".top-nav")?.contains(activeElement) ||
          this.shadowRoot?.querySelector(".mega-menu")?.contains(activeElement))
      ) {
        return;
      }

      this._scheduleDesktopClose();
    });
  }

  private _handleSearchInput(
    event: CustomEvent<FdHeaderSearchInputDetail>,
  ) {
    event.stopPropagation();
    this._searchValue = event.detail.value;
  }

  private _handleSearchOpenChange(
    event: CustomEvent<FdHeaderSearchOpenChangeDetail>,
  ) {
    event.stopPropagation();
    if (event.detail.surface !== "mobile") {
      return;
    }

    this._mobileSearchOpen = event.detail.open;
    if (event.detail.open) {
      this._mobileMenuOpen = false;
      return;
    }

    if (this._lastMobileToggle === "search") {
      this.updateComplete.then(() => this._getMobileToggle("search")?.focus());
    }
  }

  private _handleSearchSubmit(
    event: CustomEvent<FdHeaderSearchSubmitDetail>,
  ) {
    event.stopPropagation();
    const forwarded = new CustomEvent<FdGlobalHeaderSearchSubmitDetail>("fd-global-header-search-submit", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: event.detail,
    });

    if (!this.dispatchEvent(forwarded)) {
      event.preventDefault();
    }
  }

  private _handleSearchActivate(
    event: CustomEvent<FdHeaderSearchActivateDetail>,
  ) {
    event.stopPropagation();
    if (event.detail.surface === "mobile") {
      this._mobileSearchOpen = false;
    }
  }

  private _handleMobileDrawerCloseRequest(event: Event) {
    event.stopPropagation();
    this._mobileMenuOpen = false;
    this.updateComplete.then(() => this._getMobileToggle("menu")?.focus());
  }

  private _syncColumnRail(columnSelector: string, itemSelector: string) {
    const column = this.shadowRoot?.querySelector<HTMLElement>(columnSelector);
    if (!column) {
      return;
    }

    const target = column.querySelector<HTMLElement>(itemSelector);
    if (!target) {
      column.style.setProperty("--column-rail-opacity", "0");
      column.style.setProperty("--column-rail-height", "0px");
      column.style.setProperty("--column-rail-top", "0px");
      return;
    }

    const columnRect = column.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    column.style.setProperty("--column-rail-opacity", "1");
    column.style.setProperty(
      "--column-rail-height",
      `${Math.max(targetRect.height, 0)}px`,
    );
    column.style.setProperty(
      "--column-rail-top",
      `${Math.max(targetRect.top - columnRect.top, 0)}px`,
    );
  }

  private _syncColumnRails() {
    this._syncColumnRail(".mega-col--l1", ".menu-item-button[data-selected='true'], .menu-item-link[data-selected='true']");
    this._syncColumnRail(".mega-col--l2", ".menu-item-link[data-active='true']");
    this._syncColumnRail(".mega-col--l3", ".menu-item-link[data-active='true']");
  }

  private _getMobileFocusableElements() {
    return Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>(
        ".mobile-drawer [slot], .mobile-drawer a[href], .mobile-drawer button, .mobile-drawer [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => !element.hasAttribute("hidden"));
  }

  private _focusFirstMobileControl() {
    const drawerSurface =
      this.shadowRoot?.querySelector(".mobile-drawer [part='surface']") ||
      this.shadowRoot?.querySelector(".mobile-drawer");
    const firstFocusable =
      this.shadowRoot?.querySelector<HTMLElement>(
        ".mobile-drawer a[href], .mobile-drawer button",
      ) || null;
    firstFocusable?.focus();
    if (!firstFocusable) {
      (drawerSurface as HTMLElement | null)?.focus();
    }
  }

  private _renderDesktopSearch() {
    if (!this.search) {
      return nothing;
    }

    return html`
      <fd-header-search
        class="desktop-search"
        data-search-surface="desktop"
        surface="desktop"
        .action=${this.search.action}
        .label=${this.search.label || "Search FDICnet"}
        .placeholder=${this.search.placeholder || "Search FDICnet"}
        .submitLabel=${this.search.submitLabel || "Open first matching result"}
        .searchAllLabel=${this.search.searchAllLabel || "Search all FDICnet"}
        .paramName=${this.search.paramName || "q"}
        .items=${this._getSearchItems()}
        .value=${this._searchValue}
        @fd-header-search-input=${this._handleSearchInput}
        @fd-header-search-submit=${this._handleSearchSubmit}
        @fd-header-search-activate=${this._handleSearchActivate}
      ></fd-header-search>
    `;
  }

  private _renderMobileSearch() {
    if (!this.search) {
      return nothing;
    }

    return html`
      <fd-header-search
        class="mobile-search"
        data-search-surface="mobile"
        surface="mobile"
        .open=${this._mobileSearchOpen}
        .action=${this.search.action}
        .label=${this.search.label || "Search FDICnet"}
        .placeholder=${this.search.placeholder || "Search FDICnet"}
        .submitLabel=${this.search.submitLabel || "Open first matching result"}
        .searchAllLabel=${this.search.searchAllLabel || "Search all FDICnet"}
        .paramName=${this.search.paramName || "q"}
        .items=${this._getSearchItems()}
        .value=${this._searchValue}
        @fd-header-search-input=${this._handleSearchInput}
        @fd-header-search-open-change=${this._handleSearchOpenChange}
        @fd-header-search-submit=${this._handleSearchSubmit}
        @fd-header-search-activate=${this._handleSearchActivate}
      ></fd-header-search>
    `;
  }

  private _renderTopLevelItem(item: FdGlobalHeaderNavigationItem, index: number) {
    if (isLinkItem(item)) {
      return html`
        <li class="top-nav-item">
          <a
            class="top-nav-link"
            href=${item.href}
            aria-current=${item.current ? "page" : nothing}
            data-top-nav-index=${String(index)}
            @keydown=${(event: KeyboardEvent) =>
              this._handleTopNavKeydown(event, item, index)}
          >
            ${item.label}
          </a>
        </li>
      `;
    }

    const isActive = this._activePanelId === item.id && this._menuOpen;

    return html`
      <li class="top-nav-item">
        <button
          id=${this._getTopTriggerId(item.id)}
          class="top-nav-button"
          type="button"
          aria-expanded=${String(isActive)}
          aria-controls=${`${this._baseId}-mega-menu`}
          data-panel-trigger=${item.id}
          data-top-nav-index=${String(index)}
          data-active=${String(isActive)}
          @click=${() => this._handleTopNavClick(item, index)}
          @pointerenter=${() => this._handleTopNavPointerEnter(item, index)}
          @keydown=${(event: KeyboardEvent) =>
            this._handleTopNavKeydown(event, item, index)}
        >
          <span>${item.label}</span>
          <fd-icon name="caret-down" aria-hidden="true"></fd-icon>
        </button>
      </li>
    `;
  }

  private _renderDesktopPanel() {
    const panel = this._getActivePanel();
    if (!panel) {
      return nothing;
    }

    const hasOverviewRow = panel.sections.length > 1;
    const overviewSection = hasOverviewRow ? panel.sections[0] : null;
    const primarySections = hasOverviewRow ? panel.sections.slice(1) : panel.sections;
    const selectedSection = this._getSelectedSection();
    const sectionOverview = getSectionOverview(selectedSection);
    const selectedItem = selectedSection?.items?.[this._selectedItemIndex] || null;
    const visibleItem = this._getVisibleItem();
    const showingPreview = this._previewItemIndex != null;
    const hasVisibleChildren = Boolean(
      showingPreview && !this._previewingOverview && visibleItem?.children?.length,
    );
    const sectionDescription = getSectionMenuDescription(
      selectedSection,
      panel.label,
      selectedSection === overviewSection,
    );
    const defaultSectionDescription =
      selectedSection?.description || sectionOverview?.description || "";
    const l3Description = this._previewingOverview
      ? sectionOverview?.description || ""
      : showingPreview
        ? hasVisibleChildren
          ? visibleItem?.description || ""
          : visibleItem?.description || ""
        : defaultSectionDescription;

    return html`
      <section
        id=${`${this._baseId}-mega-menu`}
        class="mega-menu"
        part="panel"
        ?hidden=${!this._menuOpen}
        @pointerenter=${this._cancelDesktopClose}
        @pointerleave=${this._scheduleDesktopClose}
        @focusin=${this._cancelDesktopClose}
        @focusout=${this._handleDesktopFocusOut}
        @keydown=${this._handlePanelKeydown}
      >
        <div class="shell mega-menu-inner">
          <section class="mega-col mega-col--l1" part="panel-column">
            <h2 class="menu-heading">Menu sections</h2>
            <ul class="menu-list" role="list">
              ${overviewSection
                ? html`
                    <li>
                      <a
                        class="menu-item-link menu-item-link--overview"
                        href=${panel.href || overviewSection.overviewHref || overviewSection.href || "#"}
                        data-index="0"
                        data-selected=${String(this._selectedSectionIndex === 0)}
                        data-panel-focusable="true"
                        tabindex=${this._selectedSectionIndex === 0 ? "0" : "-1"}
                      >
                        <span class="menu-item-label">
                          ${overviewSection.label}
                        </span>
                        <span class="menu-spacer" aria-hidden="true"></span>
                      </a>
                    </li>
                    ${panel.description
                      ? html`
                          <li>
                            <p class="menu-description menu-description--inline">
                              ${panel.description}
                            </p>
                          </li>
                        `
                      : nothing}
                    ${primarySections.length > 0
                      ? html`
                          <li aria-hidden="true">
                            <div class="menu-divider"></div>
                          </li>
                        `
                      : nothing}
                  `
                : nothing}
              ${primarySections.map((section, orderIndex) => {
                const actualIndex = hasOverviewRow ? orderIndex + 1 : orderIndex;
                const hasChildren = Boolean(section.items?.length);
                const content = html`
                  <span class="menu-item-label">${section.label}</span>
                  ${hasChildren
                    ? html`<fd-icon class="menu-caret" name="caret-right" aria-hidden="true"></fd-icon>`
                    : html`<span class="menu-spacer" aria-hidden="true"></span>`}
                `;

                return html`
                  <li>
                    ${hasChildren
                      ? html`
                          <button
                            class="menu-item-button"
                            type="button"
                            data-index=${String(actualIndex)}
                            data-selected=${String(
                              this._selectedSectionIndex === actualIndex,
                            )}
                            data-panel-focusable="true"
                            tabindex=${this._selectedSectionIndex === actualIndex
                              ? "0"
                              : "-1"}
                            @pointerenter=${() =>
                              this._setSectionSelection(actualIndex)}
                            @focus=${() =>
                              this._setSectionSelection(actualIndex, true)}
                          >
                            ${content}
                          </button>
                        `
                      : html`
                          <a
                            class="menu-item-link"
                            href=${section.href || section.overviewHref || "#"}
                            data-index=${String(actualIndex)}
                            data-selected=${String(
                              this._selectedSectionIndex === actualIndex,
                            )}
                            data-panel-focusable="true"
                            tabindex=${this._selectedSectionIndex === actualIndex
                              ? "0"
                              : "-1"}
                          >
                            ${content}
                          </a>
                        `}
                  </li>
                `;
              })}
            </ul>
          </section>

          <section class="mega-col mega-col--l2" part="panel-column">
            <h2 class="menu-heading">Section links</h2>
            <ul class="menu-list" role="list">
              ${sectionOverview
                ? html`
                    <li>
                      <a
                        class="menu-item-link menu-item-link--overview"
                        href=${sectionOverview.href}
                        data-active=${String(this._previewingOverview)}
                        data-panel-focusable="true"
                        tabindex=${this._previewingOverview
                          ? "0"
                          : (selectedSection?.items?.length || 0) === 0
                            ? "0"
                            : "-1"}
                        @pointerenter=${() => this._setPreviewOverview()}
                        @focus=${() => this._setPreviewOverview(true)}
                      >
                        <span class="menu-item-label">${sectionOverview.label}</span>
                        <span class="menu-spacer" aria-hidden="true"></span>
                      </a>
                    </li>
                    ${sectionDescription
                      ? html`
                          <li>
                            <p class="menu-description menu-description--inline">
                              ${sectionDescription}
                            </p>
                          </li>
                        `
                      : nothing}
                    ${(selectedSection?.items?.length || 0) > 0
                      ? html`
                          <li aria-hidden="true">
                            <div class="menu-divider"></div>
                          </li>
                        `
                      : nothing}
                  `
                : nothing}
              ${(selectedSection?.items || []).map((item, index) => {
                const hasChildren = Boolean(item.children?.length);
                return html`
                  <li>
                    <a
                      class="menu-item-link"
                      href=${item.href}
                      data-index=${String(index)}
                      data-active=${String(
                        this._previewItemIndex === index && !this._previewingOverview,
                      )}
                      data-panel-focusable="true"
                      tabindex=${index === 0 ? "0" : "-1"}
                      @pointerenter=${() => this._setPreviewItem(index)}
                      @focus=${() => this._setPreviewItem(index, true)}
                    >
                      <span class="menu-item-label">${item.label}</span>
                      ${hasChildren
                        ? html`<fd-icon class="menu-caret" name="caret-right" aria-hidden="true"></fd-icon>`
                        : html`<span class="menu-spacer" aria-hidden="true"></span>`}
                    </a>
                  </li>
                `;
              })}
            </ul>
          </section>

          <section class="mega-col mega-col--l3" part="panel-column">
            <h2 class="menu-heading">Resources</h2>
            ${hasVisibleChildren
              ? html`
                  <ul class="menu-list" role="list">
                    ${(visibleItem?.children || []).map((child, index) => html`
                      <li>
                        <a
                          class="menu-item-link"
                          href=${child.href}
                          data-index=${String(index)}
                          data-active=${String(index === 0)}
                          data-panel-focusable="true"
                          tabindex=${index === 0 ? "0" : "-1"}
                        >
                          <span class="menu-item-label">${child.label}</span>
                          <span class="menu-spacer" aria-hidden="true"></span>
                        </a>
                      </li>
                    `)}
                  </ul>
                `
              : nothing}
            ${l3Description
              ? html`<p class="menu-description menu-description--l3">${l3Description}</p>`
              : html`<p class="menu-empty">Select a link to see more detail.</p>`}
          </section>
        </div>
      </section>
    `;
  }

  private _renderMobileListItem(
    label: string,
    description: string | undefined,
    href: string | undefined,
    nextPath: MobileDrillPath | null,
  ) {
    const content = html`
      <span class="mobile-item-copy">
        <span class="mobile-item-label">${label}</span>
        ${description
          ? html`<span class="mobile-item-meta">${description}</span>`
          : nothing}
      </span>
      ${nextPath
        ? html`<fd-icon class="menu-caret" name="caret-right" aria-hidden="true"></fd-icon>`
        : html`<span class="menu-spacer" aria-hidden="true"></span>`}
    `;

    if (nextPath) {
      return html`
        <button
          class="mobile-button"
          type="button"
          @click=${() => {
            this._mobilePath = nextPath;
            if (typeof nextPath[0] === "string") {
              this._activePanelId = nextPath[0];
            }
          }}
        >
          ${content}
        </button>
      `;
    }

    return html`
      <a class="mobile-link" href=${href || "#"}>
        ${content}
      </a>
    `;
  }

  private _renderMobileContext(panel: FdGlobalHeaderPanelItem | null, section: FdGlobalHeaderSection | null, item: FdGlobalHeaderSectionItem | null) {
    if (!panel || (!section && !item)) {
      return nothing;
    }

    const crumbs: Array<{ label: string; path?: MobileDrillPath }> = [
      { label: panel.label, path: [panel.id] },
    ];

    if (section) {
      crumbs.push({
        label: section.label,
        path: [panel.id, this._mobilePath[1] as number],
      });
    }

    if (item) {
      crumbs.push({
        label: item.label,
        path: [panel.id, this._mobilePath[1] as number, this._mobilePath[2] as number],
      });
    }

    return html`
      <nav class="mobile-context" aria-label="Current location">
        <span class="sr-only">You are here: </span>
        <ol class="mobile-context-list">
          ${crumbs.map((crumb, index) => {
            const isCurrent = index === crumbs.length - 1;
            return html`
              <li>
                ${isCurrent
                  ? html`
                      <span class="mobile-context-current" aria-current="location">
                        ${crumb.label}
                      </span>
                    `
                  : html`
                      <button
                        class="mobile-context-crumb"
                        type="button"
                        @click=${() => {
                          this._mobilePath = crumb.path || [];
                        }}
                      >
                        ${crumb.label}
                      </button>
                    `}
              </li>
              ${!isCurrent
                ? html`
                    <li aria-hidden="true">
                      <fd-icon
                        class="mobile-context-separator"
                        name="caret-right"
                      ></fd-icon>
                    </li>
                  `
                : nothing}
            `;
          })}
        </ol>
      </nav>
    `;
  }

  private _renderMobileDrawerBody() {
    const panel = this._mobilePath[0]
      ? this._getPanelById(this._mobilePath[0])
      : null;
    const section =
      panel && typeof this._mobilePath[1] === "number"
        ? panel.sections[this._mobilePath[1]] || null
        : null;
    const item =
      section && typeof this._mobilePath[2] === "number"
        ? section.items?.[this._mobilePath[2]] || null
        : null;

    const heading = item
      ? item.label
      : section
        ? section.label
        : panel
          ? panel.label
          : "Menu";

    const backTarget =
      item != null
        ? [panel!.id, this._mobilePath[1] as number]
        : section != null
          ? [panel!.id]
          : panel != null
            ? []
            : null;
    const backLabel =
      item != null
        ? section?.label || panel?.label || "Menu"
        : section != null
          ? panel?.overviewLabel || panel?.label || "Menu"
          : panel != null
            ? "Main menu"
            : "";

    return html`
      <div slot="header" class="mobile-drawer-header">
        ${backTarget
          ? html`
              <button
                class="mobile-back"
                type="button"
                @click=${() => {
                  this._mobilePath = backTarget as MobileDrillPath;
                }}
              >
                <fd-icon name="caret-left" aria-hidden="true"></fd-icon>
                <span>${backLabel}</span>
              </button>
            `
          : html`<span></span>`}
        <h2 class="mobile-title">${heading}</h2>
      </div>

      ${!panel
        ? html`
            <ul class="mobile-list" role="list">
              ${this.navigation.filter(isPanelItem).map((navItem) => html`
                <li>
                  ${this._renderMobileListItem(navItem.label, undefined, undefined, [
                    navItem.id,
                  ])}
                </li>
              `)}
            </ul>
          `
        : item
          ? html`
              ${this._renderMobileContext(panel, section, item)}
              <ul class="mobile-list" role="list">
                <li>
                  ${this._renderMobileListItem(
                    item.label,
                    item.description,
                    item.href,
                    null,
                  )}
                </li>
                ${(item.children || []).map((child) => html`
                  <li>
                    ${this._renderMobileListItem(
                      child.label,
                      child.description,
                      child.href,
                      null,
                    )}
                  </li>
                `)}
              </ul>
            `
          : section
            ? html`
                ${this._renderMobileContext(panel, section, null)}
                <ul class="mobile-list" role="list">
                  <li>
                    ${this._renderMobileListItem(
                      section.label,
                      getSectionMenuDescription(section, panel.label),
                      section.href || section.overviewHref,
                      null,
                    )}
                  </li>
                  ${(section.items || []).map((sectionItem, index) => html`
                    <li>
                      ${this._renderMobileListItem(
                        sectionItem.label,
                        sectionItem.description,
                        sectionItem.href,
                        sectionItem.children?.length
                          ? [panel.id, this._mobilePath[1] as number, index]
                          : null,
                      )}
                    </li>
                  `)}
              </ul>
              `
            : html`
                <ul class="mobile-list" role="list">
                  ${panel.sections.length > 1 && panel.href
                    ? html`
                        <li>
                          ${this._renderMobileListItem(
                            panel.label,
                            panel.description,
                            panel.href,
                            null,
                          )}
                        </li>
                      `
                    : nothing}
                  ${(panel.sections.length > 1 ? panel.sections.slice(1) : panel.sections).map(
                    (sectionEntry, orderIndex) => {
                      const actualIndex =
                        panel.sections.length > 1 ? orderIndex + 1 : orderIndex;
                      return html`
                        <li>
                          ${this._renderMobileListItem(
                            sectionEntry.label,
                            undefined,
                            sectionEntry.href || sectionEntry.overviewHref,
                            sectionEntry.items?.length
                              ? [panel.id, actualIndex]
                              : null,
                          )}
                        </li>
                      `;
                    },
                  )}
                </ul>
              `}
    `;
  }

  override render() {
    return html`
      <div class="base" part="base">
        <div class="masthead" part="masthead">
          <div class="shell masthead-row">
            <div class="brand-row">
              <div class="mobile-controls">
                <button
                  class="icon-button"
                  type="button"
                  data-mobile-toggle="menu"
                  aria-label=${this._mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded=${String(this._mobileMenuOpen)}
                  @click=${this._toggleMobileMenu}
                >
                  <fd-icon
                    name=${this._mobileMenuOpen ? "x" : "list"}
                    aria-hidden="true"
                  ></fd-icon>
                  <span>${this._mobileMenuOpen ? "Close" : "Menu"}</span>
                </button>
              </div>
              <slot name="brand"></slot>
            </div>
            <div class="controls">
              <div class="utility">
                <slot name="utility"></slot>
              </div>
              ${this._renderDesktopSearch()}
              ${this.search
                ? html`
                    <div class="mobile-controls">
                      <button
                        class="icon-button icon-button--round"
                        type="button"
                        data-mobile-toggle="search"
                        aria-label=${this._mobileSearchOpen
                          ? "Close search"
                          : "Open search"}
                        aria-expanded=${String(this._mobileSearchOpen)}
                        @click=${() => this._toggleMobileSearch()}
                      >
                        <fd-icon
                          name=${this._mobileSearchOpen
                            ? "x"
                            : "magnifying-glass"}
                          aria-hidden="true"
                        ></fd-icon>
                      </button>
                    </div>
                  `
                : nothing}
            </div>
          </div>
          ${this._renderMobileSearch()}
        </div>

        <div
          class="top-nav"
          part="primary-nav"
          @pointerenter=${this._cancelDesktopClose}
          @pointerleave=${this._scheduleDesktopClose}
          @focusin=${this._cancelDesktopClose}
          @focusout=${this._handleDesktopFocusOut}
        >
          <div class="shell">
            <nav aria-label="Primary navigation">
              <ul class="top-nav-list">
                ${this._getTopLevelItems().map((item, index) =>
                  this._renderTopLevelItem(item, index),
                )}
              </ul>
            </nav>
          </div>
          ${this._renderDesktopPanel()}
        </div>

        <fd-drawer
          class="mobile-drawer"
          part="mobile-drawer"
          .open=${this._mobileMenuOpen}
          .label=${"Main menu"}
          .modal=${true}
          .placement=${"top" as const}
          @fd-drawer-close-request=${this._handleMobileDrawerCloseRequest}
        >
          ${this._renderMobileDrawerBody()}
        </fd-drawer>
      </div>
    `;
  }
}
