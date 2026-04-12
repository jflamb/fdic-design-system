import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import type {
  FdHeaderSearch,
  FdHeaderSearchActivateDetail,
  FdHeaderSearchInputDetail,
  FdHeaderSearchItem,
  FdHeaderSearchOpenChangeDetail,
  FdHeaderSearchSubmitDetail,
  HeaderSearchSurface,
} from "./fd-header-search.js";
import { extractHeaderSearchAliasData } from "./fd-header-search-utils.js";

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

const MOBILE_BREAKPOINT = 768;
const COMPACT_MOBILE_BREAKPOINT = 640;
const MOBILE_BREAKPOINT_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;
const HOVER_INTENT_MS = 140;
const PREVIEW_CLEAR_MS = 180;
const SHY_REVEAL_DELTA_PX = 5;
const DEFAULT_SHY_HIDE_DURATION_MS = 300;
// Desktop panels intentionally open in the top-level overview state.
const DEFAULT_PANEL_SECTION_INDEX: number | null = null;
const PANEL_FOCUSABLE_SELECTOR = "[data-panel-focusable='true']";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let globalHeaderInstanceCount = 0;

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

function parseDurationMs(
  value: string,
  fallback = DEFAULT_SHY_HIDE_DURATION_MS,
) {
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const match = trimmed.match(/^(-?\d*\.?\d+)(ms|s)$/);
  if (!match) {
    return fallback;
  }

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount < 0) {
    return fallback;
  }

  return match[2] === "s" ? amount * 1000 : amount;
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
    const { parentheticalAliases, derivedAcronyms } =
      extractHeaderSearchAliasData(item.label);

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
    shy: { type: Boolean, reflect: true },
    shyThreshold: { type: Number, attribute: "shy-threshold" },
    _activePanelId: { state: true },
    _menuOpen: { state: true },
    _selectedSectionIndex: { state: true },
    _selectedItemIndex: { state: true },
    _previewItemIndex: { state: true },
    _activeChildIndex: { state: true },
    _previewingOverview: { state: true },
    _topNavFocusIndex: { state: true },
    _isMobile: { state: true },
    _mobileMenuOpen: { state: true },
    _mobileSearchOpen: { state: true },
    _mobilePath: { state: true },
    _searchValue: { state: true },
    _topNavIndicatorOffset: { state: true },
    _topNavIndicatorWidth: { state: true },
    _topNavIndicatorVisible: { state: true },
    _shyHidden: { state: true },
    _shyTransitionDurationMs: { state: true },
    _compactDesktopMenuVisible: { state: true },
    _compactDesktopSearchExpanded: { state: true },
  };

  static styles = css`
    :host {
      --fd-global-header-color-host: var(--fd-global-header-text-host, light-dark(#10243e, #ffffff));
      --fd-global-header-color-text-primary: var(--ds-color-text-primary);
      --fd-global-header-color-text-secondary: var(--ds-color-text-secondary);
      --fd-global-header-color-text-inverted: var(--fd-global-header-text-inverted, var(--ds-color-neutral-000));
      --fd-global-header-color-surface-base: var(--ds-color-bg-surface);
      --fd-global-header-color-surface-brand: var(--fd-global-header-surface-brand, light-dark(#003256, #84dbff));
      --fd-global-header-color-surface-brand-hover: var(--fd-global-header-surface-brand-hover, light-dark(#0b466f, #38b6ff));
      --fd-global-header-color-accent: var(--ds-focus-ring-color);
      --fd-global-header-color-accent-soft: var(--fd-global-header-accent-soft, light-dark(#84dbff, #e6f4fa));
      --fd-global-header-color-border-subtle: var(--ds-color-border-divider);
      --fd-global-header-color-surface-l2: var(--fd-global-header-surface-l2, light-dark(#f5f5f7, #333335));
      --fd-global-header-color-surface-l3: var(--fd-global-header-surface-l3, light-dark(#edf3f7, #424244));
      --fd-global-header-shadow-floating: var(--ds-color-effect-shadow);
      --fd-global-header-shadow-panel: var(--ds-color-effect-shadow-panel);
      --fd-global-header-glass-sheen: var(--fd-global-header-glass-sheen, var(--ds-gradient-glass-sheen));
      --fd-global-header-glass-border: var(--fd-global-header-glass-border, var(--ds-color-border-glass-soft));
      --fd-global-header-glass-border-strong: var(--fd-global-header-glass-border-strong, var(--ds-color-border-glass));
      --fd-global-header-overlay-hover: var(--ds-color-overlay-brand-hover);
      --fd-global-header-overlay-selected: var(--ds-color-overlay-brand-selected);
      --fd-global-header-overlay-pressed: var(--ds-color-overlay-brand-pressed);
      --fd-global-header-focus-inner: var(--ds-color-border-focus-inner);
      --fd-global-header-glass-surface-1: var(--fd-global-header-mega-col-1, var(--ds-color-surface-glass-1));
      --fd-global-header-glass-surface-2: var(--fd-global-header-mega-col-2, var(--ds-color-surface-glass-2));
      --fd-global-header-glass-surface-2-muted: var(--fd-global-header-mega-col-2-muted, var(--ds-color-surface-glass-2-muted));
      --fd-global-header-glass-surface-3: var(--fd-global-header-mega-col-3, var(--ds-color-surface-glass-3));
      --fd-global-header-glass-surface-3-muted-1: var(--fd-global-header-mega-col-3-muted, var(--ds-color-surface-glass-3-muted-1));
      --fd-global-header-glass-surface-3-muted-2: var(--fd-global-header-mega-col-3-muted, var(--ds-color-surface-glass-3-muted-2));
      display: block;
      color: var(--fd-global-header-color-host);
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
      z-index: 10;
    }

    :host([shy]) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 20;
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
      z-index: 20;
      border-bottom: 0;
      background: var(--fd-global-header-color-surface-base);
    }

    .base[data-shy-active="true"] {
      position: relative;
      transform: translateY(0);
      transition-property: transform;
      transition-duration: var(--_fd-global-header-shy-duration, 300ms);
      transition-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
      will-change: transform;
    }

    .base[data-shy-active="true"][data-shy-hidden="true"] {
      transform: translateY(-100%);
    }

    .base[data-shy-active="true"][data-compact-desktop="true"] {
      transform: translateY(0);
    }

    .base[data-compact-desktop="true"] {
      box-shadow: 0 10px 28px oklch(from var(--fd-global-header-shadow-floating) l c h / 0.5);
      transition:
        transform var(--_fd-global-header-shy-duration, 300ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        box-shadow 250ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .shell {
      width: min(
        var(--ds-layout-shell-max-width, var(--ds-layout-content-max-width, 1312px)),
        calc(100% - 2 * var(--ds-layout-gutter, 64px))
      );
      margin-inline: auto;
    }

    .masthead {
      background: var(--fd-global-header-color-surface-brand);
      color: var(--fd-global-header-color-text-inverted);
      min-height: 5.1875rem;
      padding: 1.5rem 0;
      display: flex;
      align-items: center;
    }

    .base[data-shy-active="true"] .masthead {
      transition:
        padding 250ms cubic-bezier(0.2, 0.7, 0.2, 1),
        min-height 250ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .masthead-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
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
      gap: 0.75rem;
    }

    .controls {
      flex: 0 1 auto;
      justify-content: flex-end;
    }

    .compact-menu-toggle {
      display: none;
    }

    ::slotted([slot="brand"]) {
      display: inline-flex;
      flex: none;
      align-items: center;
      align-self: center;
      height: auto;
      min-height: 0;
      min-width: max-content;
      max-width: none;
      overflow: visible;
      border-radius: 0;
      color: inherit;
      text-decoration: none;
      line-height: 0;
    }

    .utility {
      display: inline-flex;
      flex: none;
      align-items: center;
      gap: 0;
    }

    ::slotted([slot="utility"]) {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: inherit;
      text-decoration: none;
      padding: 0;
      line-height: 1;
      cursor: pointer;
    }

    ::slotted(fd-button[slot="utility"]) {
      --fd-button-height: 2.75rem;
      --fd-button-min-width: 2.75rem;
      --fd-button-icon-only-size: 2.75rem;
      --fd-button-radius: 0;
      --fd-button-focus-gap: var(--fd-global-header-color-surface-brand);
      --fd-button-focus-ring: var(--fd-global-header-color-accent);
      flex: none;
    }

    .icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      width: 2.75rem;
      height: 2.75rem;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .icon-button fd-icon {
      --fd-icon-size: 1.75rem;
    }

    .icon-button--round {
      width: 2.75rem;
    }

    .desktop-search {
      display: block;
    }

    .desktop-search-region {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      flex: none;
      min-width: 0;
    }

    .desktop-search-shell {
      display: block;
      flex: none;
      min-width: 0;
    }

    .compact-search-toggle {
      display: none;
      flex: none;
    }

    .mobile-controls {
      display: none;
      align-items: center;
      gap: 0.5rem;
    }

    .mobile-search-shell {
      display: none;
    }

    .icon-button--search-toggle {
      display: none;
    }

    .top-nav {
      background: var(--fd-global-header-color-surface-brand);
      border-bottom: 6px solid var(--fd-global-header-color-accent-soft);
      position: relative;
      z-index: 61;
    }

    .top-nav-shell {
      overflow: clip;
      transition:
        max-height 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
        border-bottom-width 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
        visibility 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .top-nav-list {
      display: flex;
      align-items: center;
      gap: 0;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .top-nav-track {
      position: relative;
    }

    .top-nav-item {
      display: flex;
      align-items: stretch;
      position: relative;
      z-index: 1;
    }

    .top-nav-link,
    .top-nav-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      padding: 0 1.125rem;
      border: 0;
      background: transparent;
      color: var(--fd-global-header-color-text-inverted);
      font-size: 1.125rem;
      font-weight: 400;
      line-height: 1.375;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
      text-decoration: none;
      z-index: 1;
    }

    .top-nav-label {
      display: inline-grid;
    }

    .top-nav-active-indicator {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--top-nav-indicator-width, 0px);
      background: var(--fd-global-header-color-surface-base);
      pointer-events: none;
      opacity: 0;
      transform: translateX(var(--top-nav-indicator-offset, 0px));
      transition:
        transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        width 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 160ms cubic-bezier(0.2, 0.7, 0.2, 1);
      z-index: 0;
    }

    .top-nav-active-indicator[data-visible="true"] {
      opacity: 1;
    }

    .top-nav-active-indicator::before {
      content: "";
      position: absolute;
      inset-inline-start: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--fd-global-header-color-accent);
    }
    .top-nav-label::after {
      content: attr(data-label);
      grid-area: 1 / 1;
      font-weight: 600;
      visibility: hidden;
      pointer-events: none;
    }

    .top-nav-label-text {
      grid-area: 1 / 1;
    }

    .top-nav-list > .top-nav-item:first-child .top-nav-link,
    .top-nav-list > .top-nav-item:first-child .top-nav-button {
      margin-inline-start: -1.25rem;
      padding-inline-start: 1.25rem;
    }

    .top-nav-link::after,
    .top-nav-button::after {
      content: "";
      position: absolute;
      inset-inline: 0;
      bottom: -6px;
      height: 4px;
      background: var(--fd-global-header-color-accent);
      opacity: 0;
      transition: opacity var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .top-nav-link:hover,
    .top-nav-link:focus-visible,
    .top-nav-button:hover,
    .top-nav-button:focus-visible,
    .top-nav-button[aria-expanded="true"] {
      background-color: var(--fd-global-header-color-surface-brand-hover);
      outline-color: transparent;
    }

    .top-nav-link:hover::after,
    .top-nav-link:focus-visible::after,
    .top-nav-button:hover::after,
    .top-nav-button:focus-visible::after,
    .top-nav-button[aria-expanded="true"]::after {
      opacity: 1;
    }

    .top-nav-link:focus-visible,
    .top-nav-button:focus-visible,
    .top-nav-link[data-manual-focus-visible="true"],
    .top-nav-button[data-manual-focus-visible="true"] {
      box-shadow:
        0 0 0 2px var(--fd-global-header-color-surface-base),
        0 0 0 4px var(--fd-global-header-color-accent);
    }

    .top-nav-button[data-active="true"],
    .top-nav-button[data-active="true"]:hover {
      background-color: var(--fd-global-header-color-surface-base);
      color: var(--fd-global-header-color-text-primary);
      font-weight: 600;
      box-shadow: none;
      z-index: 2;
    }

    .top-nav-button[data-active="true"]:focus-visible,
    .top-nav-button[data-active="true"][data-manual-focus-visible="true"] {
      background-color: var(--fd-global-header-color-surface-base);
      color: var(--fd-global-header-color-text-primary);
      font-weight: 600;
      box-shadow:
        0 0 0 2px var(--fd-global-header-color-surface-base),
        0 0 0 4px var(--fd-global-header-color-accent);
      z-index: 2;
    }
    .top-nav-button[data-active="true"]::after {
      opacity: 0;
    }

    .mega-menu {
      position: absolute;
      inset-inline: 0;
      top: 100%;
      background: transparent;
      z-index: 60;
      padding: 0;
    }

    .mega-menu[hidden] {
      display: none;
    }

    .mega-menu-scrim {
      position: fixed;
      top: 8.1875rem;
      inset-inline: 0;
      bottom: 0;
      background: var(--ds-color-overlay-scrim-soft);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 180ms cubic-bezier(0.2, 0.7, 0.2, 1), visibility 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
      z-index: 10;
    }

    .mega-menu-scrim[data-open="true"] {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .base[data-compact-desktop="true"] .masthead {
      min-height: 0;
      padding: 0.625rem 0;
    }

    .base[data-compact-desktop="true"] .masthead-row {
      gap: 0.75rem;
    }

    .base[data-compact-desktop="true"] .brand-row {
      gap: 0.875rem;
    }

    .base[data-shy-active="true"] ::slotted([slot="brand"]) {
      transition: transform 250ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base[data-compact-desktop="true"] ::slotted([slot="brand"]) {
      transform: scale(0.88);
      transform-origin: left center;
    }

    .base[data-compact-desktop="true"] .controls {
      gap: 0.125rem;
    }

    .base[data-compact-desktop="true"] .utility {
      gap: 0.125rem;
    }

    .base[data-shy-active="true"] ::slotted([slot="utility"]) {
      transition:
        width 250ms cubic-bezier(0.2, 0.7, 0.2, 1),
        height 250ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base[data-compact-desktop="true"] ::slotted([slot="utility"]) {
      width: 2.5rem;
      height: 2.5rem;
    }

    .base[data-compact-desktop="true"] ::slotted(fd-button[slot="utility"]) {
      --fd-button-height: 2.5rem;
      --fd-button-min-width: 2.5rem;
      --fd-button-icon-only-size: 2.5rem;
    }

    .base[data-compact-desktop="true"] .compact-menu-toggle {
      display: inline-flex;
      flex: none;
      --fd-button-height: 2.5rem;
      --fd-button-min-width: 2.5rem;
      --fd-button-radius: 3px;
      --fd-button-text-subtle-inverted: var(--fd-global-header-color-text-inverted);
      --fd-button-focus-gap: var(--fd-global-header-color-surface-brand);
      --fd-button-focus-ring: var(--fd-global-header-color-accent);
    }

    .base[data-compact-desktop="true"] .compact-menu-toggle fd-icon {
      --fd-icon-size: 1rem;
      transition: transform 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base[data-compact-desktop="true"] .compact-menu-toggle[aria-expanded="true"] fd-icon {
      transform: rotate(180deg);
    }

    .base[data-compact-desktop="true"] .desktop-search-region {
      max-width: 2.75rem;
      overflow: hidden;
      transition: max-width 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base[data-compact-desktop="true"] .desktop-search-region[data-search-expanded="true"] {
      max-width: min(18rem, 32vw);
    }

    .base[data-compact-desktop="true"] .desktop-search-shell {
      max-width: 0;
      opacity: 0;
      transform: translateX(0.75rem);
      pointer-events: none;
      transition:
        max-width 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
        transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base[data-compact-desktop="true"] .desktop-search-region[data-search-expanded="true"] .desktop-search-shell {
      max-width: 16rem;
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }

    .base[data-compact-desktop="true"] .compact-search-toggle {
      display: inline-flex;
      flex: none;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity 140ms cubic-bezier(0.2, 0.7, 0.2, 1),
        transform 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .base[data-compact-desktop="true"] .desktop-search-region[data-search-expanded="true"] .compact-search-toggle {
      opacity: 0;
      transform: scale(0.92);
      pointer-events: none;
    }

    .base[data-compact-desktop="true"] .top-nav-shell[data-compact-nav-visible="false"] {
      max-height: 0;
      opacity: 0;
      visibility: hidden;
      border-bottom-width: 0;
      pointer-events: none;
    }

    .base[data-compact-desktop="true"] .top-nav-shell[data-compact-nav-visible="true"] {
      max-height: 28rem;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .mega-menu-frame {
      --mega-col-1-surface: var(--fd-global-header-glass-surface-1);
      --mega-col-2-surface: var(--fd-global-header-glass-surface-2);
      --mega-col-3-surface: var(--fd-global-header-glass-surface-3);
      position: relative;
      width: min(
        var(--ds-layout-shell-max-width, var(--ds-layout-content-max-width, 1312px)),
        calc(100% - 2 * var(--ds-layout-gutter, 64px))
      );
    }

    .mega-menu-frame[data-visible-columns="1"] {
      --mega-col-2-surface: var(--fd-global-header-glass-surface-2-muted);
      --mega-col-3-surface: var(--fd-global-header-glass-surface-3-muted-1);
    }

    .mega-menu-frame[data-visible-columns="2"] {
      --mega-col-3-surface: var(--fd-global-header-glass-surface-3-muted-2);
    }

    .mega-menu-frame::before {
      content: "";
      position: absolute;
      inset: 0;
      box-shadow: 0 8px 16px oklch(from var(--fd-global-header-shadow-floating) l c h / 0.61);
      pointer-events: none;
      z-index: 0;
    }

    .mega-menu-viewport {
      position: relative;
      z-index: 1;
      transition: max-height 160ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .mega-menu-viewport[data-height-animating="true"] {
      overflow: hidden;
    }

    .mega-menu-inner {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-height: 14.8125rem;
      position: relative;
      isolation: isolate;
      clip-path: inset(-40px -40px -40px -40px);
      width: 100%;
      -webkit-backdrop-filter: blur(16px) saturate(165%);
      backdrop-filter: blur(16px) saturate(165%);
    }

    .mega-menu-inner::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        var(--fd-global-header-glass-sheen),
        linear-gradient(
          90deg,
          var(--mega-col-1-surface) 0%,
          var(--mega-col-1-surface) 33.333%,
          var(--mega-col-2-surface) 33.333%,
          var(--mega-col-2-surface) 66.666%,
          var(--mega-col-3-surface) 66.666%,
          var(--mega-col-3-surface) 100%
        );
      border-style: solid;
      border-color: var(--fd-global-header-glass-border);
      border-width: 0 1px 1px;
      z-index: 0;
    }

    @keyframes mega-col-enter {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
    }

    .mega-col {
      position: relative;
      min-width: 0;
      padding: 0.5rem 0;
      z-index: 1;
      animation: mega-col-enter 250ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
    }

    .mega-col--l1 { animation-delay: 0ms; margin-inline-start: -1.5rem; }
    .mega-col--l2 { animation-delay: 40ms; }
    .mega-col--l3 { animation-delay: 80ms; }

    .mega-col::before {
      content: "";
      position: absolute;
      inset-inline-start: 0;
      top: var(--column-rail-top, 0px);
      width: 4px;
      height: var(--column-rail-height, 0px);
      background: var(--fd-global-header-color-accent);
      opacity: var(--column-rail-opacity, 0);
      transition:
        top 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
        height 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .mega-col--l1 {
      background: var(--fd-global-header-color-surface-base);
    }

    .mega-col--l2 {
      background: var(--fd-global-header-color-surface-l2);
    }

    .mega-col--l3 {
      background: var(--fd-global-header-color-surface-l3);
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
      display: grid;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      width: 100%;
      min-height: 2.75rem;
      border: 0;
      background: transparent;
      color: var(--fd-global-header-color-text-primary);
      text-align: start;
      border-radius: 0;
      cursor: pointer;
      font-size: var(--ds-font-size-body-small, 1rem);
      font-weight: 400;
      line-height: 1.4;
      text-decoration: none;
      position: relative;
    }

    .menu-item-link--l1,
    .menu-item-button--l1 {
      grid-template-columns: minmax(0, 1fr) auto;
      column-gap: 0.75rem;
      padding: 0.4375rem 1.125rem 0.4375rem 1.5rem;
    }

    .menu-item-link--l2,
    .menu-item-link--l3 {
      grid-template-columns: minmax(0, 1fr) auto;
      column-gap: 0.75rem;
      padding: 0.375rem 1rem 0.375rem 1.5rem;
    }

    .menu-item-link--l1:hover,
    .menu-item-link--l1:focus-visible,
    .menu-item-button--l1:hover,
    .menu-item-button--l1:focus-visible,
    .menu-item-link--l1[data-selected="true"],
    .menu-item-button--l1[data-selected="true"],
    .menu-item-link--l2:hover,
    .menu-item-link--l2:focus-visible,
    .menu-item-link--l2[data-active="true"],
    .menu-item-link--l3:hover,
    .menu-item-link--l3:focus-visible,
    .menu-item-link--l3[data-active="true"] {
      background: var(--fd-global-header-overlay-selected);
      outline-color: transparent;
    }

    .menu-item-label {
      font-size: var(--ds-font-size-body-small, 1rem);
      font-weight: 400;
      line-height: 1.4;
      color: var(--fd-global-header-color-text-primary);
    }

    .menu-item-link--l1:hover .menu-item-label,
    .menu-item-link--l1:focus-visible .menu-item-label,
    .menu-item-button--l1:hover .menu-item-label,
    .menu-item-button--l1:focus-visible .menu-item-label,
    .menu-item-link--l1[data-selected="true"] .menu-item-label,
    .menu-item-button--l1[data-selected="true"] .menu-item-label,
    .menu-item-link--l2:hover .menu-item-label,
    .menu-item-link--l2:focus-visible .menu-item-label,
    .menu-item-link--l2[data-active="true"] .menu-item-label,
    .menu-item-link--l3:hover .menu-item-label,
    .menu-item-link--l3:focus-visible .menu-item-label,
    .menu-item-link--l3[data-active="true"] .menu-item-label {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
    }

    .menu-description {
      margin: 0;
      padding: 0.5rem 1.5rem 0.75rem;
      color: var(--fd-global-header-color-text-secondary);
      font-size: 0.9375rem;
      font-weight: 400;
      line-height: 1.45;
    }

    .menu-description--inline {
      padding-top: 0.25rem;
    }

    .menu-description--l3 {
      padding-top: 0.5rem;
    }

    .menu-caret {
      color: var(--fd-global-header-color-text-primary);
      --fd-icon-size: 1.25rem;
      flex: none;
    }

    .menu-spacer {
      width: 1rem;
      height: 1rem;
      flex: none;
    }

    .menu-divider {
      height: 1px;
      margin: 0 1.5rem 0.625rem;
      background: var(--fd-global-header-glass-border);
    }

    .mega-col--l1 .menu-description {
      padding-inline: 1.5rem;
    }

    .mega-col--l1 .menu-divider {
      margin-inline: 1.5rem;
    }

    .menu-empty {
      margin: 0;
      padding: 0.5rem 1.5rem;
      color: var(--fd-global-header-color-text-secondary);
      font-size: 0.9375rem;
      line-height: 1.45;
      opacity: 0.7;
    }

    .mobile-drawer {
      position: fixed;
      top: 0;
      inset-inline-start: 0;
      width: min(88vw, 22.5rem);
      height: 100vh;
      height: 100dvh;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      background: var(--fd-global-header-color-surface-base);
      border-inline-end: 1px solid var(--fd-global-header-color-border-subtle);
      transform: translateX(-104%);
      opacity: 0;
      visibility: hidden;
      transition:
        transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
        visibility 260ms cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 80;
      pointer-events: none;
      padding-bottom: 1.125rem;
    }

    .mobile-drawer[data-open="true"] {
      transform: translateX(0);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .mobile-nav-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: var(--ds-color-overlay-scrim-strong);
        -webkit-backdrop-filter: blur(4px) saturate(135%);
        backdrop-filter: blur(4px) saturate(135%);
      opacity: 0;
      transition: opacity 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
      z-index: 70;
      pointer-events: none;
    }

    .mobile-nav-backdrop[data-open="true"] {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-drawer-top {
      display: flex;
      align-items: center;
      min-height: 4.75rem;
      padding: 1.25rem 1rem 0.75rem;
      background: var(--fd-global-header-color-surface-base);
    }

    .mobile-drawer-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 4px;
      background: var(--fd-global-header-color-surface-brand);
      color: var(--fd-global-header-color-text-inverted);
      cursor: pointer;
      padding: 0;
    }

    .mobile-drawer-close fd-icon {
      --fd-icon-size: 1.25rem;
    }

    .mobile-drawer-close:focus-visible {
      outline-color: transparent;
      box-shadow:
        inset 0 0 0 2px var(--fd-global-header-focus-inner),
        inset 0 0 0 4px var(--fd-global-header-color-accent);
    }

    .mobile-drawer-header {
      display: grid;
      gap: 0;
      padding: 0;
      border-bottom: 1px solid var(--fd-global-header-color-border-subtle);
    }

    .mobile-back {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 0;
      background: var(--fd-global-header-color-surface-base);
      color: var(--fd-global-header-color-text-primary);
      font-size: var(--ds-font-size-body-small, 1rem);
      font-weight: 400;
      line-height: 1.375;
      cursor: pointer;
      text-align: start;
      transition:
        box-shadow var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        background-color var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        transform 100ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .mobile-back:hover {
      box-shadow: inset 0 0 0 999px var(--fd-global-header-overlay-hover);
    }

    .mobile-back:focus-visible {
      outline-color: transparent;
      box-shadow:
        0 0 0 2px var(--fd-global-header-color-surface-base),
        0 0 0 4px var(--fd-global-header-color-accent);
      background: var(--fd-global-header-overlay-hover);
      position: relative;
      z-index: 1;
    }

    .mobile-back:active {
      box-shadow: inset 0 0 0 999px var(--fd-global-header-overlay-pressed);
      transform: translateY(1px);
    }

    .mobile-back fd-icon {
      --fd-icon-size: 1rem;
      transition: transform var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .mobile-back:hover fd-icon,
    .mobile-back:focus-visible fd-icon {
      transform: translateX(-2px);
    }

    .mobile-title {
      display: none;
    }

    .mobile-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0;
      width: 100%;
    }

    .mobile-list > li {
      border-top: 1px solid var(--fd-global-header-color-border-subtle);
    }

    .mobile-list > li:first-child {
      border-top: 0;
    }

    .mobile-overview-link,
    .mobile-link,
    .mobile-button {
      position: relative;
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: 0;
      background: var(--fd-global-header-color-surface-base);
      color: var(--fd-global-header-color-text-primary);
      text-align: start;
      text-decoration: none;
      transition:
        box-shadow var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        background-color var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1),
        transform 100ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .mobile-button {
      justify-content: space-between;
      cursor: pointer;
      font-weight: 600;
    }

    .mobile-link {
      justify-content: space-between;
      font-weight: 400;
      line-height: 1.45;
      text-underline-offset: 2px;
      text-decoration-thickness: 1px;
    }

    .mobile-overview-link {
      min-height: 2.5rem;
      font-size: var(--ds-font-size-body-small, 1rem);
      font-weight: 600;
      line-height: 1.375;
      text-underline-offset: 2px;
      text-decoration-thickness: 1px;
    }

    .mobile-overview-link::before,
    .mobile-link::before,
    .mobile-button::before {
      content: "";
      position: absolute;
      inset-inline-start: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--fd-global-header-color-accent);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--ds-motion-duration-fast, 120ms) cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .mobile-link::after {
      content: "";
      width: 1.25rem;
      height: 1.25rem;
      min-width: 1.25rem;
      margin-inline-start: 0.75rem;
    }

    .mobile-overview-link:hover,
    .mobile-link:hover,
    .mobile-button:hover {
      box-shadow: inset 0 0 0 999px var(--fd-global-header-overlay-hover);
    }

    .mobile-overview-link:hover::before,
    .mobile-overview-link:focus-visible::before,
    .mobile-overview-link:active::before,
    .mobile-link:hover::before,
    .mobile-link:focus-visible::before,
    .mobile-link:active::before,
    .mobile-button:hover::before,
    .mobile-button:focus-visible::before,
    .mobile-button:active::before {
      opacity: 1;
    }

    .mobile-overview-link:focus-visible,
    .mobile-link:focus-visible,
    .mobile-button:focus-visible {
      outline-color: transparent;
      box-shadow:
        0 0 0 2px var(--fd-global-header-color-surface-base),
        0 0 0 4px var(--fd-global-header-color-accent);
      background: var(--fd-global-header-overlay-hover);
      position: relative;
      z-index: 1;
    }

    .mobile-overview-link:active,
    .mobile-link:active,
    .mobile-button:active {
      box-shadow: inset 0 0 0 999px var(--fd-global-header-overlay-pressed);
      transform: translateY(1px);
    }

    .mobile-overview-link:hover,
    .mobile-overview-link:focus-visible,
    .mobile-overview-link:active,
    .mobile-link:hover,
    .mobile-link:focus-visible,
    .mobile-link:active {
      text-decoration: underline;
    }

    .mobile-intro {
      padding: 0 1rem 0.75rem;
      color: var(--fd-global-header-color-text-secondary);
      font-size: 0.9375rem;
      line-height: 1.45;
    }

    .mobile-item-label {
      font-size: var(--ds-font-size-body-small, 1rem);
      font-weight: inherit;
      line-height: inherit;
      color: var(--fd-global-header-color-text-primary);
      white-space: normal;
    }

    .mobile-link .mobile-item-label {
      font-weight: 400;
    }

    .mobile-item-meta {
      color: var(--fd-global-header-color-text-secondary);
      font-size: 0.9375rem;
      line-height: 1.45;
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
        width: min(
          var(--ds-layout-shell-max-width, var(--ds-layout-content-max-width, 1312px)),
          calc(100% - 2 * var(--ds-layout-gutter-tablet, 32px))
        );
      }
    }

    /* These host-attribute selectors are the primary responsive path.
       JS sets them from observed component width so the header can adapt
       to container-sized layouts, not only viewport-sized layouts. */
    :host([mobile-layout]) .shell {
      width: min(100%, calc(100% - 2rem));
    }

    :host([mobile-layout]) {
      position: relative;
      top: auto;
      z-index: 0;
    }

    :host([mobile-layout]) .masthead-row {
      min-height: 4.5rem;
    }

    :host([mobile-layout]) .top-nav {
      display: none;
    }

    :host([mobile-layout]) .mobile-controls--menu {
      display: inline-flex;
    }

    :host([mobile-layout]) .mobile-nav-backdrop {
      display: block;
    }

    :host([mobile-layout]) .mobile-controls [data-mobile-toggle="menu"] {
      border: 1px solid var(--fd-global-header-glass-border-strong);
      border-radius: 4px;
    }

    :host([mobile-layout]) .mobile-controls [data-mobile-toggle="menu"] span {
      display: none;
    }

    :host([compact-mobile-layout]) .masthead {
      min-height: auto;
      padding: 1.25rem 0 1rem;
    }

    :host([compact-mobile-layout]) .masthead-row {
      min-height: 0;
    }

    :host([compact-mobile-layout]) .brand-row {
      gap: 0.625rem;
    }

    :host([compact-mobile-layout]) .controls {
      gap: 0.5rem;
    }

    :host([compact-mobile-layout]) .desktop-search {
      display: none;
    }

    :host([compact-mobile-layout]) .mobile-controls--search {
      display: inline-flex;
    }

    :host([compact-mobile-layout]) .mobile-search-shell {
      position: fixed;
      top: 0;
      inset-inline-end: 0;
      bottom: 0;
      width: min(88vw, 22.5rem);
      max-width: 100vw;
      display: block;
      background: var(--fd-global-header-color-surface-base);
      border-inline-start: 1px solid var(--fd-global-header-color-border-subtle);
      box-shadow: -18px 0 48px var(--fd-global-header-shadow-panel);
      transform: translateX(104%);
      opacity: 0;
      visibility: hidden;
      transition:
        transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        visibility 0s 220ms;
      z-index: 80;
      pointer-events: none;
    }

    :host([compact-mobile-layout]) .mobile-search-shell[data-open="true"] {
      transform: translateX(0);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition:
        transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
        visibility 0s 0s;
    }

    :host([compact-mobile-layout]) .mobile-search-sheet {
      display: grid;
      gap: 0.75rem;
      width: 100%;
      height: 100%;
      padding: 1rem;
      background: var(--fd-global-header-color-surface-base);
      overflow: hidden;
    }

    /* These media queries intentionally mirror the host-attribute rules above.
       They preserve a pure-CSS viewport fallback when ResizeObserver-driven
       responsive attributes are unavailable or have not run yet. */
    @media (max-width: 768px) {
      .shell {
        width: min(100%, calc(100% - 2rem));
      }

      .masthead-row {
        min-height: 4.5rem;
      }

      .top-nav {
        display: none;
      }

      .mobile-controls--menu {
        display: inline-flex;
      }

      .mobile-nav-backdrop {
        display: block;
      }

      .mobile-controls [data-mobile-toggle="menu"] {
        border: 1px solid var(--fd-global-header-glass-border-strong);
        border-radius: 4px;
      }

      .mobile-controls [data-mobile-toggle="menu"] span {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .masthead {
        min-height: auto;
        padding: 1.25rem 0 1rem;
      }

      .masthead-row {
        min-height: 0;
      }

      .brand-row {
        gap: 0.625rem;
      }

      .controls {
        gap: 0.5rem;
      }

      .desktop-search {
        display: none;
      }

      .mobile-controls--search {
        display: inline-flex;
      }

      .mobile-search-shell {
        position: fixed;
        top: 0;
        inset-inline-end: 0;
        bottom: 0;
        width: min(88vw, 22.5rem);
        max-width: 100vw;
        display: block;
        background: var(--fd-global-header-color-surface-base);
        border-inline-start: 1px solid var(--fd-global-header-color-border-subtle);
        box-shadow: -18px 0 48px var(--fd-global-header-shadow-panel);
        transform: translateX(104%);
        opacity: 0;
        visibility: hidden;
        transition:
          transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
          opacity 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
          visibility 0s 220ms;
        z-index: 80;
        pointer-events: none;
      }

      .mobile-search-shell[data-open="true"] {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transition:
          transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
          opacity 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
          visibility 0s 0s;
      }

      .mobile-search-sheet {
        display: grid;
        gap: 0.75rem;
        width: 100%;
        height: 100%;
        padding: 1rem;
        background: var(--fd-global-header-color-surface-base);
        overflow: hidden;
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

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition: none !important;
        animation: none !important;
      }

      .base[data-shy-active="true"] {
        transition: none !important;
      }
    }
  `;

  declare navigation: FdGlobalHeaderNavigationItem[];
  declare search: FdGlobalHeaderSearchConfig | null;
  declare shy: boolean;
  declare shyThreshold: number | undefined;
  declare _activePanelId: string | null;
  declare _menuOpen: boolean;
  declare _selectedSectionIndex: number | null;
  declare _selectedItemIndex: number;
  declare _previewItemIndex: number | null;
  declare _activeChildIndex: number | null;
  declare _previewingOverview: boolean;
  declare _topNavFocusIndex: number;
  declare _isMobile: boolean;
  declare _mobileMenuOpen: boolean;
  declare _mobileSearchOpen: boolean;
  declare _mobilePath: MobileDrillPath;
  declare _searchValue: string;
  declare _topNavIndicatorOffset: number;
  declare _topNavIndicatorWidth: number;
  declare _topNavIndicatorVisible: boolean;
  declare _shyHidden: boolean;
  declare _shyTransitionDurationMs: number;
  declare _compactDesktopMenuVisible: boolean;
  declare _compactDesktopSearchExpanded: boolean;

  private _baseId: string;
  private _mobileMediaQuery: MediaQueryList | null = null;
  private _reducedMotionMediaQuery: MediaQueryList | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _hoverTimer: number | null = null;
  private _closeTimer: number | null = null;
  private _lastDesktopTriggerId: string | null = null;
  private _lastMobileToggle: "menu" | "search" | null = null;
  private _lastMobilePath: MobileDrillPath = [];
  private _lastMeasuredWidth = 0;
  private _lastObservedHeight = 0;
  private _prefersReducedMotionEnabled = false;
  private _capturedMegaMenuHeight = 0;
  private _shouldAnimateMegaMenuHeight = false;
  private _megaMenuHeightAnimationTarget: HTMLElement | null = null;
  private _shyLastScrollY = 0;
  private _shyPendingScrollY = 0;
  private _shyScrollAnimationFrame: number | null = null;
  private _shyScrollListening = false;
  private _shyHeightSynced = false;
  private readonly _onDocumentPointerDownBound =
    this._handleDocumentPointerDown.bind(this);
  private readonly _onDocumentKeyDownBound = this._handleDocumentKeyDown.bind(this);
  private readonly _onFocusInBound = () => {
    if (!this.shy) {
      return;
    }

    if (this._isCompactDesktopShyActive()) {
      this._syncShyTrackingFromWindow();
      return;
    }

    this._revealShyHeader({ syncTracking: true });
  };
  private readonly _onMegaMenuHeightTransitionEndBound = (event: Event) => {
    const transitionEvent = event as TransitionEvent;
    if (
      "propertyName" in transitionEvent &&
      transitionEvent.propertyName &&
      transitionEvent.propertyName !== "max-height"
    ) {
      return;
    }

    this._finishMegaMenuHeightAnimation(event.currentTarget as HTMLElement | null);
  };
  private readonly _onMobileMediaChangeBound = (
    event: MediaQueryListEvent,
  ) => {
    this._syncResponsiveState(undefined, event.matches);
  };
  private readonly _onReducedMotionChangeBound = (
    event: MediaQueryListEvent,
  ) => {
    this._prefersReducedMotionEnabled = event.matches;
  };
  private readonly _onWindowScrollBound = () => {
    this._queueShyScrollEvaluation();
  };

  constructor() {
    super();
    this.navigation = [];
    this.search = null;
    this.shy = false;
    this.shyThreshold = undefined;
    this._activePanelId = null;
    this._menuOpen = false;
    this._selectedSectionIndex = null;
    this._selectedItemIndex = 0;
    this._previewItemIndex = null;
    this._activeChildIndex = null;
    this._previewingOverview = false;
    this._topNavFocusIndex = 0;
    this._isMobile = false;
    this._mobileMenuOpen = false;
    this._mobileSearchOpen = false;
    this._mobilePath = [];
    this._searchValue = "";
    this._topNavIndicatorOffset = 0;
    this._topNavIndicatorWidth = 0;
    this._topNavIndicatorVisible = false;
    this._shyHidden = false;
    this._shyTransitionDurationMs = DEFAULT_SHY_HIDE_DURATION_MS;
    this._compactDesktopMenuVisible = false;
    this._compactDesktopSearchExpanded = false;
    this._baseId = `fdgh-${globalHeaderInstanceCount++}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._mobileMediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    this._reducedMotionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    this._prefersReducedMotionEnabled = this._reducedMotionMediaQuery.matches;
    this._startObservingWidth();
    this._syncResponsiveState(undefined, this._mobileMediaQuery.matches);
    this._mobileMediaQuery.addEventListener(
      "change",
      this._onMobileMediaChangeBound,
    );
    this._reducedMotionMediaQuery.addEventListener(
      "change",
      this._onReducedMotionChangeBound,
    );
    document.addEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
    document.addEventListener("keydown", this._onDocumentKeyDownBound, true);
    this.addEventListener("focusin", this._onFocusInBound);
    this._syncShyTrackingFromWindow();
    if (this.shy) {
      this._attachShyScrollListener();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._clearHoverTimer();
    this._clearCloseTimer();
    this._finishMegaMenuHeightAnimation();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._mobileMediaQuery?.removeEventListener(
      "change",
      this._onMobileMediaChangeBound,
    );
    this._mobileMediaQuery = null;
    this._reducedMotionMediaQuery?.removeEventListener(
      "change",
      this._onReducedMotionChangeBound,
    );
    this._reducedMotionMediaQuery = null;
    document.removeEventListener(
      "pointerdown",
      this._onDocumentPointerDownBound,
      true,
    );
    document.removeEventListener("keydown", this._onDocumentKeyDownBound, true);
    this.removeEventListener("focusin", this._onFocusInBound);
    this._detachShyScrollListener();
    this._clearShyHeight();
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("navigation")) {
      this._normalizeNavigationState();
    }

    this._captureMegaMenuHeight(changed);
  }

  override updated(changed: PropertyValues<this>) {
    if (
      changed.has("_menuOpen") ||
      changed.has("_activePanelId") ||
      changed.has("_selectedSectionIndex") ||
      changed.has("_previewItemIndex") ||
      changed.has("_activeChildIndex") ||
      changed.has("_previewingOverview")
    ) {
      this.updateComplete.then(() => {
        this._syncMegaMenuHeight();
        this._syncColumnRails();
      });
    }

    if (changed.has("_menuOpen") || changed.has("_activePanelId")) {
      this.updateComplete.then(() => this._syncTopNavIndicator());
    }

    if (changed.has("_mobileMenuOpen") && this._mobileMenuOpen) {
      this.updateComplete.then(() => this._focusFirstMobileControl());
    }

    if (changed.has("_mobileSearchOpen") && this._mobileSearchOpen) {
      this.updateComplete.then(() => {
        const mobileSearch = this._getHeaderSearchHost("mobile");
        mobileSearch?.focus();
        mobileSearch?.select?.();
      });
    }

    if (changed.has("shy")) {
      if (this.shy) {
        this._setShyHiddenState(false, { immediate: true });
        this._syncShyTrackingFromWindow();
        this._attachShyScrollListener();
        this._syncShyHeight();
      } else {
        this._detachShyScrollListener();
        this._clearShyHeight();
        this._setShyHiddenState(false, { immediate: true });
        this._compactDesktopMenuVisible = false;
        this._compactDesktopSearchExpanded = false;
        this._syncShyTrackingFromWindow();
      }
    } else if (this.shy && changed.has("shyThreshold")) {
      const currentScrollY = this._getWindowScrollY();
      if (currentScrollY <= this._getResolvedShyThreshold()) {
        this._setShyHiddenState(false);
      }
      this._syncShyTrackingFromWindow();
    }

    if (
      this.shy &&
      (changed.has("_menuOpen") ||
        changed.has("_mobileMenuOpen") ||
        changed.has("_mobileSearchOpen"))
    ) {
      if (this._hasOpenOverlay()) {
        if (this._isCompactDesktopShyActive()) {
          this._syncShyTrackingFromWindow();
        } else {
          this._revealShyHeader({ syncTracking: true });
        }
      } else {
        this._syncShyTrackingFromWindow();
      }
    }
  }

  override focus(options?: FocusOptions) {
    const target = this._isMobile
      ? this._getMobileToggle("menu")
      : this._getTopNavItems()[0];
    target?.focus(options);
  }

  private _startObservingWidth() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    this._resizeObserver?.disconnect();
    this._resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find(({ target }) => target === this);
      if (entry?.contentRect.height) {
        this._lastObservedHeight = entry.contentRect.height;
      }
      this._syncResponsiveState(entry?.contentRect.width);
      // Only update the shy height when showing the full (non-compact)
      // header so it reflects the true full-size height.
      if (this.shy && !this._shyHidden) {
        this._syncShyHeight();
      }
      this.updateComplete.then(() => {
        this._syncColumnRails();
        this._syncTopNavIndicator();
        this._checkNavOverflow();
      });
    });
    this._resizeObserver.observe(this);
  }

  private _prefersReducedMotion() {
    return this._prefersReducedMotionEnabled;
  }

  private _getWindowScrollY() {
    if (typeof window === "undefined") {
      return 0;
    }

    return Math.max(window.scrollY || window.pageYOffset || 0, 0);
  }

  private _syncShyTrackingFromWindow() {
    const currentScrollY = this._getWindowScrollY();
    this._shyLastScrollY = currentScrollY;
    this._shyPendingScrollY = currentScrollY;
  }

  private _isCompactDesktopShyActive() {
    return this.shy && this._shyHidden && !this._isMobile;
  }

  private _isCompactDesktopNavVisible() {
    return (
      !this._isCompactDesktopShyActive() ||
      this._compactDesktopMenuVisible ||
      this._menuOpen
    );
  }

  private _toggleCompactDesktopMenu() {
    if (!this._isCompactDesktopShyActive()) {
      return;
    }

    const nextVisible = !this._compactDesktopMenuVisible;
    this._compactDesktopMenuVisible = nextVisible;

    if (!nextVisible) {
      this._closeMenu();
      return;
    }

    this._compactDesktopSearchExpanded = false;
  }

  private _focusCompactDesktopSearch() {
    this._compactDesktopSearchExpanded = true;
    this._compactDesktopMenuVisible = false;
    this._closeMenu();
    this.updateComplete.then(() => {
      const desktopSearch = this._getHeaderSearchHost("desktop");
      desktopSearch?.focus();
      desktopSearch?.select?.();
    });
  }

  private _collapseCompactDesktopSearch({ restoreFocus = false } = {}) {
    if (!this._compactDesktopSearchExpanded) {
      return;
    }

    this._compactDesktopSearchExpanded = false;
    if (restoreFocus) {
      this.updateComplete.then(() =>
        this.shadowRoot
          ?.querySelector<HTMLElement>(".compact-search-toggle")
          ?.focus(),
      );
    }
  }

  private _queueShyScrollEvaluation() {
    if (!this.shy) {
      return;
    }

    this._shyPendingScrollY = this._getWindowScrollY();
    if (this._shyScrollAnimationFrame != null) {
      return;
    }

    this._shyScrollAnimationFrame = window.requestAnimationFrame(() => {
      this._shyScrollAnimationFrame = null;
      this._syncShyVisibilityFromScroll(this._shyPendingScrollY);
    });
  }

  private _attachShyScrollListener() {
    if (this._shyScrollListening || typeof window === "undefined") {
      return;
    }

    window.addEventListener("scroll", this._onWindowScrollBound, {
      passive: true,
    });
    this._shyScrollListening = true;
    this._syncShyTrackingFromWindow();
  }

  private _detachShyScrollListener() {
    if (this._shyScrollAnimationFrame != null) {
      window.cancelAnimationFrame(this._shyScrollAnimationFrame);
      this._shyScrollAnimationFrame = null;
    }

    if (!this._shyScrollListening || typeof window === "undefined") {
      return;
    }

    window.removeEventListener("scroll", this._onWindowScrollBound);
    this._shyScrollListening = false;
  }

  // ---------------------------------------------------------------------------
  // Shy height custom property
  //
  // When shy mode is active the header uses position: fixed, removing it
  // from the document flow. The component exposes its full (non-compact)
  // height as --fd-global-header-shy-height on the host element so the
  // consumer can reserve space (e.g. padding-top on a wrapper).
  // ---------------------------------------------------------------------------

  private _syncShyHeight() {
    const base = this.renderRoot?.querySelector<HTMLElement>(".base");
    const height = base?.offsetHeight || this.offsetHeight || this._lastObservedHeight;
    if (height > 0) {
      this.style.setProperty("--fd-global-header-shy-height", `${height}px`);
      this._shyHeightSynced = true;
    }
  }

  private _clearShyHeight() {
    this.style.removeProperty("--fd-global-header-shy-height");
    this._shyHeightSynced = false;
  }

  private _hasOpenOverlay() {
    return this._menuOpen || this._mobileMenuOpen || this._mobileSearchOpen;
  }

  private _getResolvedShyThreshold() {
    if (typeof this.shyThreshold === "number" && Number.isFinite(this.shyThreshold)) {
      return Math.max(this.shyThreshold, 0);
    }

    const base = this.renderRoot?.querySelector<HTMLElement>(".base");
    return Math.max(
      base?.offsetHeight || this.offsetHeight || this._lastObservedHeight,
      0,
    );
  }

  private _resolveShyHideDurationMs() {
    if (!this.isConnected || typeof window === "undefined") {
      return DEFAULT_SHY_HIDE_DURATION_MS;
    }

    const rawDuration = getComputedStyle(this)
      .getPropertyValue("--fd-global-header-shy-transition-duration");
    return parseDurationMs(rawDuration, DEFAULT_SHY_HIDE_DURATION_MS);
  }

  private _setShyHiddenState(
    hidden: boolean,
    { immediate = false }: { immediate?: boolean } = {},
  ) {
    const nextHidden = this.shy ? hidden : false;
    const hideDuration = this._resolveShyHideDurationMs();
    const nextDuration = immediate || this._prefersReducedMotion()
      ? 0
      : nextHidden
        ? hideDuration
        : Math.max(Math.round(hideDuration * (2 / 3)), 0);

    if (
      this._shyHidden === nextHidden &&
      this._shyTransitionDurationMs === nextDuration
    ) {
      return;
    }

    this._shyHidden = nextHidden;
    this._shyTransitionDurationMs = nextDuration;

    if (!nextHidden) {
      this._compactDesktopMenuVisible = false;
      this._compactDesktopSearchExpanded = false;
    }
  }

  private _revealShyHeader(
    {
      immediate = false,
      syncTracking = false,
    }: { immediate?: boolean; syncTracking?: boolean } = {},
  ) {
    this._setShyHiddenState(false, { immediate });
    if (syncTracking) {
      this._syncShyTrackingFromWindow();
    }
  }

  private _syncShyVisibilityFromScroll(scrollY: number) {
    if (!this.shy) {
      return;
    }

    if (this._hasOpenOverlay()) {
      if (this._isCompactDesktopShyActive()) {
        this._syncShyTrackingFromWindow();
      } else {
        this._revealShyHeader({ syncTracking: true });
      }
      return;
    }

    const currentScrollY = Math.max(scrollY, 0);
    const threshold = this._getResolvedShyThreshold();

    if (currentScrollY <= threshold) {
      this._setShyHiddenState(false);
      this._shyLastScrollY = currentScrollY;
      return;
    }

    const delta = currentScrollY - this._shyLastScrollY;
    if (delta > 0) {
      this._setShyHiddenState(true);
    } else if (delta <= -SHY_REVEAL_DELTA_PX) {
      this._setShyHiddenState(false);
    }

    this._shyLastScrollY = currentScrollY;
  }

  private _clearMegaMenuHeightAnimationListener(target = this._megaMenuHeightAnimationTarget) {
    if (!target) {
      return;
    }

    target.removeEventListener(
      "transitionend",
      this._onMegaMenuHeightTransitionEndBound,
    );
    if (this._megaMenuHeightAnimationTarget === target) {
      this._megaMenuHeightAnimationTarget = null;
    }
  }

  private _finishMegaMenuHeightAnimation(target = this._megaMenuHeightAnimationTarget) {
    if (!target) {
      return;
    }

    this._clearMegaMenuHeightAnimationListener(target);
    target.removeAttribute("data-height-animating");
    target.style.removeProperty("max-height");
  }

  private _resetMegaMenuHeight() {
    const menuViewport = this.shadowRoot?.querySelector<HTMLElement>(".mega-menu-viewport");
    if (menuViewport) {
      this._finishMegaMenuHeightAnimation(menuViewport);
      return;
    }

    this._finishMegaMenuHeightAnimation();
  }

  private _captureMegaMenuHeight(changed: PropertyValues<this>) {
    const menuStateChanged =
      changed.has("_menuOpen") ||
      changed.has("_activePanelId") ||
      changed.has("_selectedSectionIndex") ||
      changed.has("_previewItemIndex") ||
      changed.has("_activeChildIndex") ||
      changed.has("_previewingOverview");

    if (!menuStateChanged) {
      this._shouldAnimateMegaMenuHeight = false;
      this._capturedMegaMenuHeight = 0;
      return;
    }

    const wasMenuOpen = changed.has("_menuOpen")
      ? Boolean(changed.get("_menuOpen"))
      : this._menuOpen;
    const menuViewport = this.shadowRoot?.querySelector<HTMLElement>(".mega-menu-viewport");

    this._capturedMegaMenuHeight = menuViewport
      ? Math.max(menuViewport.getBoundingClientRect().height, 0)
      : 0;
    this._shouldAnimateMegaMenuHeight =
      wasMenuOpen &&
      this._menuOpen &&
      !this._isMobile &&
      !this._prefersReducedMotion() &&
      this._capturedMegaMenuHeight > 0;
  }

  private _syncMegaMenuHeight() {
    const menuViewport = this.shadowRoot?.querySelector<HTMLElement>(".mega-menu-viewport");
    const menuInner = this.shadowRoot?.querySelector<HTMLElement>(".mega-menu-inner");
    if (!menuViewport || !menuInner || !this._menuOpen || this._isMobile) {
      this._shouldAnimateMegaMenuHeight = false;
      this._capturedMegaMenuHeight = 0;
      this._resetMegaMenuHeight();
      return;
    }

    const nextHeight = Math.max(
      menuInner.scrollHeight,
      menuInner.getBoundingClientRect().height,
      0,
    );
    const startHeight = this._capturedMegaMenuHeight;
    const shouldAnimate =
      this._shouldAnimateMegaMenuHeight && Math.abs(startHeight - nextHeight) > 1;

    this._shouldAnimateMegaMenuHeight = false;
    this._capturedMegaMenuHeight = nextHeight;
    if (!shouldAnimate) {
      this._finishMegaMenuHeightAnimation(menuViewport);
      return;
    }

    this._clearMegaMenuHeightAnimationListener(menuViewport);
    menuViewport.setAttribute("data-height-animating", "true");
    menuViewport.style.maxHeight = `${startHeight}px`;
    void menuViewport.offsetHeight;
    this._megaMenuHeightAnimationTarget = menuViewport;
    menuViewport.addEventListener(
      "transitionend",
      this._onMegaMenuHeightTransitionEndBound,
      { once: true },
    );
    menuViewport.style.maxHeight = `${nextHeight}px`;
  }

  private _syncResponsiveState(
    measuredWidth?: number,
    mediaMatches = this._mobileMediaQuery?.matches || false,
  ) {
    if (typeof measuredWidth === "number" && measuredWidth > 0) {
      this._lastMeasuredWidth = measuredWidth;
    }

    const fallbackWidth = mediaMatches
      ? MOBILE_BREAKPOINT
      : typeof window !== "undefined"
        ? window.innerWidth
        : Number.POSITIVE_INFINITY;
    const width = this._lastMeasuredWidth || fallbackWidth;
    const isMobile = width <= MOBILE_BREAKPOINT;
    const isCompactMobile = width <= COMPACT_MOBILE_BREAKPOINT;

    this._isMobile = isMobile;
    this.toggleAttribute("mobile-layout", isMobile);
    this.toggleAttribute("compact-mobile-layout", isCompactMobile);
    if (isMobile) {
      this._menuOpen = false;
      this._compactDesktopMenuVisible = false;
      this._compactDesktopSearchExpanded = false;
    } else {
      this._mobileMenuOpen = false;
      this._mobileSearchOpen = false;
      this._mobilePath = [];
      this._lastMobileToggle = null;
    }

    if (isMobile) {
      this._topNavIndicatorVisible = false;
    }
  }

  private _isTopNavOverflowing(): boolean {
    const navList = this.shadowRoot?.querySelector<HTMLElement>(".top-nav-list");
    if (!navList) {
      return false;
    }
    return navList.scrollWidth > navList.clientWidth + 1;
  }

  private _checkNavOverflow() {
    if (this._isMobile || !this.navigation.length) {
      return;
    }

    if (this._isTopNavOverflowing()) {
      this._isMobile = true;
      this.toggleAttribute("mobile-layout", true);
      this._menuOpen = false;
      this._compactDesktopMenuVisible = false;
      this._compactDesktopSearchExpanded = false;
      this._topNavIndicatorVisible = false;
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
      this._resetPanelSelection();
    }
  }

  private _getHeaderSearchHost(surface: HeaderSearchSurface) {
    return this.shadowRoot?.querySelector<FdHeaderSearch>(
      `[data-search-surface='${surface}']`,
    );
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

  private _syncTopNavIndicator() {
    if (!this._menuOpen || !this._activePanelId || this._isMobile) {
      this._topNavIndicatorVisible = false;
      this._topNavIndicatorOffset = 0;
      this._topNavIndicatorWidth = 0;
      return;
    }

    const list = this.shadowRoot?.querySelector(".top-nav-track") as HTMLElement | null;
    const activeTrigger = this.shadowRoot?.querySelector(
      `[data-panel-trigger="${this._activePanelId}"]`,
    ) as HTMLElement | null;

    if (!list || !activeTrigger) {
      this._topNavIndicatorVisible = false;
      return;
    }

    const listRect = list.getBoundingClientRect();
    const triggerRect = activeTrigger.getBoundingClientRect();

    this._topNavIndicatorOffset = triggerRect.left - listRect.left;
    this._topNavIndicatorWidth = triggerRect.width;
    this._topNavIndicatorVisible = true;
  }

  private _getMobileToggle(kind: "menu" | "search") {
    return this.shadowRoot?.querySelector<HTMLElement>(
      `[data-mobile-toggle='${kind}']`,
    );
  }

  private _isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) {
      return false;
    }

    if (target instanceof HTMLInputElement) {
      return !["button", "checkbox", "radio", "range", "reset", "submit"].includes(
        target.type,
      );
    }

    if (
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target as HTMLElement).isContentEditable
    ) {
      return true;
    }

    return Boolean(
      target.closest(
        "[contenteditable]:not([contenteditable='false']), [role='textbox'], [role='searchbox'], [role='combobox']",
      ),
    );
  }

  private _isMobileSearchToggleVisible() {
    const searchToggle = this._getMobileToggle("search");
    return Boolean(
      searchToggle && getComputedStyle(searchToggle).display !== "none",
    );
  }

  private _focusSearchFieldFromShortcut() {
    if (!this.search) {
      return;
    }

    if (this._isCompactDesktopShyActive()) {
      this._focusCompactDesktopSearch();
      return;
    }

    if (this._isMobile && this._isMobileSearchToggleVisible()) {
      this._toggleMobileSearch(true);
      return;
    }

    this._closeMenu();
    this.updateComplete.then(() => {
      const desktopSearch = this._getHeaderSearchHost("desktop");
      desktopSearch?.focus();
      desktopSearch?.select?.();
    });
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

  private _resetPanelSelection() {
    this._selectedSectionIndex = DEFAULT_PANEL_SECTION_INDEX;
    this._selectedItemIndex = 0;
    this._previewItemIndex = null;
    this._activeChildIndex = null;
    this._previewingOverview = false;
  }

  private _setActivePanel(panelId: string) {
    const panel = this._getPanelById(panelId);
    if (!panel) {
      return;
    }

    this._activePanelId = panel.id;
    this._resetPanelSelection();
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
    this._activeChildIndex = null;
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
      this._mobileMenuOpen = true;
      return;
    }

    this._closeMobileMenu({ restoreFocus: true });
  }

  private _toggleMobileSearch(forceOpen?: boolean) {
    if (!this.search) {
      return;
    }

    const nextOpen =
      typeof forceOpen === "boolean" ? forceOpen : !this._mobileSearchOpen;
    this._lastMobileToggle = "search";
    if (nextOpen) {
      this._mobileSearchOpen = true;
      this._mobileMenuOpen = false;
      return;
    }

    this._closeMobileSearch({ restoreFocus: true });
  }

  private _closeMobileMenu({ restoreFocus = false } = {}) {
    if (!this._mobileMenuOpen) {
      return;
    }

    this._lastMobilePath = this._mobilePath;
    this._mobileMenuOpen = false;
    if (restoreFocus) {
      this.updateComplete.then(() => this._getMobileToggle("menu")?.focus());
    }
  }

  private _closeMobileSearch({ restoreFocus = false } = {}) {
    if (!this._mobileSearchOpen) {
      return;
    }

    this._mobileSearchOpen = false;
    if (restoreFocus) {
      this.updateComplete.then(() => this._getMobileToggle("search")?.focus());
    }
  }

  private _handleDocumentPointerDown(event: PointerEvent) {
    this._clearTopNavManualFocusVisible();

    const path = event.composedPath();
    if (path.includes(this)) {
      return;
    }

    if (this._menuOpen) {
      this._closeMenu();
    }

    if (this._mobileMenuOpen) {
      this._closeMobileMenu();
    }

    if (this._mobileSearchOpen) {
      this._closeMobileSearch();
    }

    if (this._compactDesktopMenuVisible) {
      this._compactDesktopMenuVisible = false;
    }

    if (this._compactDesktopSearchExpanded) {
      this._collapseCompactDesktopSearch();
    }
  }

  private _handleDocumentKeyDown(event: KeyboardEvent) {
    if (
      event.key === "/" &&
      !event.defaultPrevented &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !this._isEditableTarget(event.target)
    ) {
      event.preventDefault();
      this._focusSearchFieldFromShortcut();
      return;
    }

    if (event.key === "Escape") {
      if (this._isCompactDesktopShyActive() && this._compactDesktopSearchExpanded) {
        event.preventDefault();
        this._collapseCompactDesktopSearch({ restoreFocus: true });
        return;
      }

      if (this._isCompactDesktopShyActive() && this._compactDesktopMenuVisible && !this._menuOpen) {
        event.preventDefault();
        this._compactDesktopMenuVisible = false;
        this.updateComplete.then(() =>
          this.shadowRoot
            ?.querySelector<HTMLElement>(".compact-menu-toggle")
            ?.focus(),
        );
        return;
      }

      if (this._mobileSearchOpen) {
        event.preventDefault();
        this._closeMobileSearch({ restoreFocus: true });
        return;
      }

      if (this._mobileMenuOpen) {
        event.preventDefault();
        this._closeMobileMenu({ restoreFocus: true });
        return;
      }

      if (this._menuOpen) {
        event.preventDefault();
        this._closeMenu({ restoreFocus: true });
      }
    }
  }

  private _handleTopNavClick(item: FdGlobalHeaderNavigationItem, index: number) {
    this._clearTopNavManualFocusVisible();

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
    this._clearTopNavManualFocusVisible();

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
    this._clearTopNavManualFocusVisible();

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

  private _clearTopNavManualFocusVisible() {
    this.shadowRoot
      ?.querySelectorAll<HTMLElement>("[data-manual-focus-visible='true']")
      .forEach((item) => item.removeAttribute("data-manual-focus-visible"));
  }

  private _focusActiveTopNavTrigger() {
    if (!this._activePanelId) {
      return false;
    }

    const triggerId = this._getTopTriggerId(this._activePanelId);
    const trigger = this.shadowRoot?.getElementById(triggerId) as HTMLElement | null;
    if (!trigger) {
      return false;
    }

    window.requestAnimationFrame(() => {
      this._clearTopNavManualFocusVisible();
      trigger.setAttribute("data-manual-focus-visible", "true");
      trigger.focus();
    });
    return true;
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
    this._activeChildIndex = null;
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
    if (
      this._previewItemIndex === index &&
      !this._previewingOverview &&
      this._activeChildIndex == null
    ) {
      if (restoreFocus) {
        this._focusColumnItem(
          ".mega-col--l2",
          `.menu-item-link[data-index='${index}']`,
        );
      }
      return;
    }

    this._previewItemIndex = index;
    this._activeChildIndex = null;
    this._previewingOverview = false;
    if (restoreFocus) {
      this.updateComplete.then(() => {
        this._focusColumnItem(".mega-col--l2", `.menu-item-link[data-index='${index}']`);
      });
    }
  }

  private _setPreviewOverview(restoreFocus = false) {
    if (
      this._previewItemIndex == null &&
      this._activeChildIndex == null &&
      this._previewingOverview
    ) {
      if (restoreFocus) {
        this._focusColumnItem(".mega-col--l2", ".menu-item-link--overview");
      }
      return;
    }

    this._previewItemIndex = null;
    this._activeChildIndex = null;
    this._previewingOverview = true;
    if (restoreFocus) {
      this.updateComplete.then(() => {
        this._focusColumnItem(".mega-col--l2", ".menu-item-link--overview");
      });
    }
  }

  private _clearPreview() {
    this._previewItemIndex = null;
    this._activeChildIndex = null;
    this._previewingOverview = false;
  }

  private _setActiveChild(index: number) {
    this._activeChildIndex = index;
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
    const selector =
      this._activeChildIndex != null
        ? `.menu-item-link[data-index='${this._activeChildIndex}']`
        : ".menu-item-link[data-index='0']";

    return this._focusColumnItem(".mega-col--l3", selector);
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
        if (currentIndex <= 0 && this._focusActiveTopNavTrigger()) {
          event.preventDefault();
          items.forEach((item) => {
            item.tabIndex = item === target ? 0 : -1;
          });
          return;
        }
        nextIndex = currentIndex - 1;
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
      const topNav = this.shadowRoot?.querySelector(".top-nav");
      const megaMenu = this.shadowRoot?.querySelector(".mega-menu");
      if (
        activeElement &&
        ((topNav && this._isNodeWithinContainer(topNav, activeElement)) ||
          (megaMenu && this._isNodeWithinContainer(megaMenu, activeElement)))
      ) {
        return;
      }

      this._scheduleDesktopClose();
    });
  }

  private _handleDesktopMenuPointerDown(event: PointerEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }

    this._closeMenu();
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
      this._closeMobileSearch();
    }
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
    const drawerSurface =
      this.shadowRoot?.querySelector<HTMLElement>(".mobile-drawer") || null;
    return this._getFocusableElementsWithin(drawerSurface);
  }

  private _getFocusableElementsWithin(root: ParentNode | null) {
    if (!root) {
      return [];
    }

    const focusableElements: HTMLElement[] = [];
    const collect = (node: ParentNode) => {
      const children = "children" in node ? Array.from(node.children) : [];

      children.forEach((child) => {
        const element = child as HTMLElement;
        if (this._isFocusableElement(element)) {
          focusableElements.push(element);
        }

        if (element.shadowRoot) {
          collect(element.shadowRoot);
        }

        collect(element);
      });
    };

    collect(root);
    return focusableElements;
  }

  private _isFocusableElement(element: HTMLElement) {
    if (
      !element.matches(FOCUSABLE_SELECTOR) ||
      element.hasAttribute("disabled") ||
      element.getAttribute("tabindex") === "-1" ||
      element.closest("[hidden]")
    ) {
      return false;
    }

    return true;
  }

  private _getDeepActiveElement() {
    let activeElement =
      this.shadowRoot?.activeElement || document.activeElement;

    while (
      activeElement instanceof HTMLElement &&
      activeElement.shadowRoot?.activeElement
    ) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
  }

  private _isNodeWithinContainer(container: Node, node: Node | null) {
    let current: Node | null = node;

    while (current) {
      if (current === container) {
        return true;
      }

      const root = current.getRootNode();
      current =
        current.parentNode || (root instanceof ShadowRoot ? root.host : null);
    }

    return false;
  }

  private _handleMobileOverlayKeydown(
    event: KeyboardEvent,
    overlay: "menu" | "search",
  ) {
    if (event.key !== "Tab") {
      return;
    }

    const container =
      overlay === "menu"
        ? this.shadowRoot?.querySelector<HTMLElement>(".mobile-drawer")
        : this.shadowRoot?.querySelector<HTMLElement>(".mobile-search-shell");
    if (!container) {
      return;
    }

    const focusableElements = this._getFocusableElementsWithin(container);
    if (focusableElements.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }

    const activeElement = this._getDeepActiveElement();
    const currentIndex = focusableElements.findIndex(
      (element) => element === activeElement,
    );
    const isWithinContainer = this._isNodeWithinContainer(
      container,
      activeElement,
    );
    const firstFocusable = focusableElements[0]!;
    const lastFocusable = focusableElements[focusableElements.length - 1]!;

    if (event.shiftKey) {
      if (!isWithinContainer || currentIndex <= 0) {
        event.preventDefault();
        lastFocusable.focus();
      }
      return;
    }

    if (!isWithinContainer || currentIndex === focusableElements.length - 1) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  private _focusFirstMobileControl() {
    const drawerSurface = this.shadowRoot?.querySelector(".mobile-drawer");
    const firstFocusable = this.shadowRoot?.querySelector<HTMLElement>(
      ".mobile-drawer a[href], .mobile-drawer button",
    );
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

  private _renderCompactDesktopMenuToggle() {
    if (!this._isCompactDesktopShyActive()) {
      return nothing;
    }

    return html`
      <fd-button
        class="compact-menu-toggle"
        variant="subtle-inverted"
        aria-label="Toggle main menu"
        aria-expanded=${String(this._isCompactDesktopNavVisible())}
        aria-controls=${`${this._baseId}-primary-nav`}
        @click=${() => this._toggleCompactDesktopMenu()}
      >
        Menu
        <fd-icon slot="icon-end" name="caret-down" aria-hidden="true"></fd-icon>
      </fd-button>
    `;
  }

  private _renderDesktopSearchRegion() {
    if (!this.search) {
      return nothing;
    }

    const compactDesktopActive = this._isCompactDesktopShyActive();
    const searchExpanded = !compactDesktopActive || this._compactDesktopSearchExpanded;

    return html`
      <div
        class="desktop-search-region"
        data-search-expanded=${String(searchExpanded)}
      >
        ${compactDesktopActive
          ? html`
              <button
                class="icon-button icon-button--round compact-search-toggle"
                type="button"
                aria-label="Open search"
                @click=${() => this._focusCompactDesktopSearch()}
              >
                <fd-icon
                  name="magnifying-glass"
                  aria-hidden="true"
                ></fd-icon>
              </button>
            `
          : nothing}
        <div class="desktop-search-shell">${this._renderDesktopSearch()}</div>
      </div>
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
            @blur=${this._clearTopNavManualFocusVisible}
            @keydown=${(event: KeyboardEvent) =>
              this._handleTopNavKeydown(event, item, index)}
          >
            <span class="top-nav-label" data-label=${item.label}>
              <span class="top-nav-label-text">${item.label}</span>
            </span>
          </a>
        </li>
      `;
    }

    const isActive = this._activePanelId === item.id && this._menuOpen;
    const controlsId = this._getActivePanel()
      ? `${this._baseId}-mega-menu`
      : nothing;

    return html`
      <li class="top-nav-item">
        <button
          id=${this._getTopTriggerId(item.id)}
          class="top-nav-button"
          type="button"
          aria-expanded=${String(isActive)}
          aria-controls=${controlsId}
          data-panel-trigger=${item.id}
          data-top-nav-index=${String(index)}
          data-active=${String(isActive)}
          @blur=${this._clearTopNavManualFocusVisible}
          @click=${() => this._handleTopNavClick(item, index)}
          @pointerenter=${() => this._handleTopNavPointerEnter(item, index)}
          @pointerleave=${this._clearHoverTimer}
          @keydown=${(event: KeyboardEvent) =>
            this._handleTopNavKeydown(event, item, index)}
        >
          <span class="top-nav-label" data-label=${item.label}>
            <span class="top-nav-label-text">${item.label}</span>
          </span>
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
    const showL2 = Boolean(selectedSection);
    const hasVisibleChildren = Boolean(
      showingPreview && !this._previewingOverview && visibleItem?.children?.length,
    );
    const showL3 = showL2 && hasVisibleChildren;
    const sectionDescription = getSectionMenuDescription(
      selectedSection,
      panel.label,
      selectedSection === overviewSection,
    );
    const defaultSectionDescription =
      selectedSection?.description || sectionOverview?.description || "";
    const l3Description = showL3
      ? this._previewingOverview
        ? sectionOverview?.description || ""
        : showingPreview
          ? visibleItem?.description || ""
          : defaultSectionDescription
      : "";
    const visibleColumnCount = 1 + Number(showL2) + Number(showL3);
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
        @pointerdown=${this._handleDesktopMenuPointerDown}
        @keydown=${this._handlePanelKeydown}
      >
        <div
          class="shell mega-menu-frame"
          data-visible-columns=${String(visibleColumnCount)}
        >
          <div class="mega-menu-viewport">
          <div class="mega-menu-inner">
          <section class="mega-col mega-col--l1" part="panel-column">
            <h2 class="menu-heading">Menu sections</h2>
            <ul class="menu-list" role="list">
              ${overviewSection
                ? html`
                    <li>
                      <a
                        class="menu-item-link menu-item-link--l1 menu-item-link--overview"
                        href=${panel.href || overviewSection.overviewHref || overviewSection.href || "#"}
                        data-index="0"
                        data-selected=${String(this._selectedSectionIndex === 0)}
                        data-panel-focusable="true"
                        tabindex=${this._selectedSectionIndex === 0 ? "0" : "-1"}
                        @pointerenter=${() => this._setSectionSelection(0)}
                        @focus=${() => this._setSectionSelection(0, true)}
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
                            class="menu-item-button menu-item-button--l1"
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
                            class="menu-item-link menu-item-link--l1"
                            href=${section.href || section.overviewHref || "#"}
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
                          </a>
                        `}
                  </li>
                `;
              })}
            </ul>
          </section>

          ${showL2
            ? html`
                <section class="mega-col mega-col--l2" part="panel-column">
                  <h2 class="menu-heading">Section links</h2>
                  <ul class="menu-list" role="list">
                    ${sectionOverview
                      ? html`
                          <li>
                            <a
                              class="menu-item-link menu-item-link--l2 menu-item-link--overview"
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
                            class="menu-item-link menu-item-link--l2"
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
              `
            : nothing}

          ${showL3
            ? html`
                <section class="mega-col mega-col--l3" part="panel-column">
                  <h2 class="menu-heading">Resources</h2>
                  ${l3Description
                    ? html`<p class="menu-description menu-description--l3">${l3Description}</p>`
                    : nothing}
                  ${l3Description && (visibleItem?.children?.length || 0) > 0
                    ? html`<div class="menu-divider" aria-hidden="true"></div>`
                    : nothing}
                  <ul class="menu-list" role="list">
                    ${(visibleItem?.children || []).map((child, index) => html`
                      <li>
                        <a
                          class="menu-item-link menu-item-link--l3"
                          href=${child.href}
                          data-index=${String(index)}
                          data-active=${String(this._activeChildIndex === index)}
                          data-panel-focusable="true"
                          tabindex=${index === 0 ? "0" : "-1"}
                          @pointerenter=${() => this._setActiveChild(index)}
                          @focus=${() => this._setActiveChild(index)}
                        >
                          <span class="menu-item-label">${child.label}</span>
                          <span class="menu-spacer" aria-hidden="true"></span>
                        </a>
                      </li>
                    `)}
                  </ul>
                </section>
              `
            : nothing}
          </div>
          </div>
        </div>
      </section>
    `;
  }

  private _renderMobileListItem(
    label: string,
    href: string | undefined,
    nextPath: MobileDrillPath | null,
  ) {
    const content = html`
      <span class="mobile-item-label">${label}</span>
      ${nextPath
        ? html`<fd-icon class="menu-caret" name="caret-right" aria-hidden="true"></fd-icon>`
        : nothing}
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

  private _renderMobileOverviewItem(
    label: string,
    href: string | undefined,
    description: string | undefined,
  ) {
    return html`
      <li>
        <a class="mobile-overview-link" href=${href || "#"}>
          <span class="mobile-item-label">${label}</span>
        </a>
        ${description
          ? html`<div class="mobile-intro">${description}</div>`
          : nothing}
      </li>
    `;
  }

  private _getMobilePanelLabel(panel: FdGlobalHeaderPanelItem | null) {
    if (!panel) {
      return "Menu";
    }

    return panel.label || panel.overviewLabel || "Menu";
  }

  private _getMobilePanelOverviewLabel(panel: FdGlobalHeaderPanelItem | null) {
    if (!panel) {
      return "Sections";
    }

    return panel.overviewLabel || panel.label || "Sections";
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
          ? this._getMobilePanelOverviewLabel(panel)
          : panel != null
            ? "Main menu"
            : "";

    return html`
      ${panel
        ? html`
            <div class="mobile-drawer-header">
              <button
                class="mobile-back"
                type="button"
                @click=${() => {
                  this._mobilePath = (backTarget as MobileDrillPath) || [];
                }}
              >
                <fd-icon name="caret-left" aria-hidden="true"></fd-icon>
                <span>${backLabel}</span>
              </button>
            </div>
          `
        : nothing}

      ${!panel
        ? html`
            <ul class="mobile-list" role="list">
              ${this.navigation.filter(isPanelItem).map((navItem) => html`
                <li>
                  ${this._renderMobileListItem(navItem.label, undefined, [
                    navItem.id,
                  ])}
                </li>
              `)}
            </ul>
          `
        : item
          ? html`
              <ul class="mobile-list" role="list">
                ${this._renderMobileOverviewItem(
                  item.label,
                  item.href,
                  item.description,
                )}
                ${(item.children || []).map((child) => html`
                  <li>
                    ${this._renderMobileListItem(
                      child.label,
                      child.href,
                      null,
                    )}
                  </li>
                `)}
              </ul>
            `
          : section
            ? html`
                <ul class="mobile-list" role="list">
                  ${this._renderMobileOverviewItem(
                    section.label,
                    section.href || section.overviewHref,
                    getSectionMenuDescription(
                      section,
                      this._getMobilePanelLabel(panel),
                    ),
                  )}
                  ${(section.items || []).map((sectionItem, index) => html`
                    <li>
                      ${this._renderMobileListItem(
                        sectionItem.label,
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
                    ? this._renderMobileOverviewItem(
                        this._getMobilePanelLabel(panel),
                        panel.href,
                        panel.description || "",
                      )
                    : nothing}
                  ${(panel.sections.length > 1 ? panel.sections.slice(1) : panel.sections).map(
                    (sectionEntry, orderIndex) => {
                      const actualIndex =
                        panel.sections.length > 1 ? orderIndex + 1 : orderIndex;
                      return html`
                        <li>
                          ${this._renderMobileListItem(
                            sectionEntry.label,
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
      <div
        class="base"
        part="base"
        data-shy-active=${String(this.shy)}
        data-shy-hidden=${String(this._shyHidden)}
        data-compact-desktop=${String(this._isCompactDesktopShyActive())}
        style=${this.shy
          ? `--_fd-global-header-shy-duration:${this._shyTransitionDurationMs}ms;`
          : nothing}
      >
        <div class="masthead" part="masthead">
          <div class="shell masthead-row">
            <div class="brand-row">
              <div class="mobile-controls mobile-controls--menu">
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
              ${this._renderCompactDesktopMenuToggle()}
              <div class="utility">
                <slot name="utility"></slot>
              </div>
              ${this._renderDesktopSearchRegion()}
              ${this.search
                ? html`
                    <div class="mobile-controls mobile-controls--search">
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
          <div
            class="mobile-search-shell"
            data-open=${String(this._mobileSearchOpen)}
            role=${this._mobileSearchOpen ? "dialog" : nothing}
            aria-modal=${this._mobileSearchOpen ? "true" : nothing}
            aria-labelledby=${this._mobileSearchOpen
              ? `${this._baseId}-mobile-search-title`
              : nothing}
            tabindex=${this._mobileSearchOpen ? "-1" : nothing}
            aria-hidden=${String(!this._mobileSearchOpen)}
            @keydown=${(event: KeyboardEvent) =>
              this._handleMobileOverlayKeydown(event, "search")}
          >
            <section class="mobile-search-sheet" aria-labelledby=${`${this._baseId}-mobile-search-title`}>
              <h2 id=${`${this._baseId}-mobile-search-title`} class="sr-only">
                Search FDICnet
              </h2>
              ${this._renderMobileSearch()}
            </section>
          </div>
        </div>

        <div
          class="top-nav"
          id=${`${this._baseId}-primary-nav`}
          part="primary-nav"
          @pointerenter=${this._cancelDesktopClose}
          @pointerleave=${this._scheduleDesktopClose}
          @focusin=${this._cancelDesktopClose}
          @focusout=${this._handleDesktopFocusOut}
        >
          <div
            class="top-nav-shell"
            data-compact-nav-visible=${String(this._isCompactDesktopNavVisible())}
          >
          <div class="shell">
            <nav aria-label="Primary navigation">
              <div
                class="top-nav-track"
                style=${[
                  `--top-nav-indicator-offset:${this._topNavIndicatorOffset}px`,
                  `--top-nav-indicator-width:${this._topNavIndicatorWidth}px`,
                ].join(";")}
              >
                <div
                  class="top-nav-active-indicator"
                  aria-hidden="true"
                  data-visible=${String(this._topNavIndicatorVisible)}
                ></div>
                <ul class="top-nav-list">
                ${this._getTopLevelItems().map((item, index) =>
                  this._renderTopLevelItem(item, index),
                )}
                </ul>
              </div>
            </nav>
          </div>
          </div>
          ${this._renderDesktopPanel()}
        </div>
        <div
          class="mega-menu-scrim"
          aria-hidden="true"
          data-open=${String(this._menuOpen && !this._isMobile)}
        ></div>

        <div
          class="mobile-nav-backdrop"
          data-open=${String(this._mobileMenuOpen || this._mobileSearchOpen)}
          @click=${() => {
            this._closeMobileMenu();
            this._closeMobileSearch();
          }}
        ></div>
        <div
          class="mobile-drawer"
          part="mobile-drawer"
          data-open=${String(this._mobileMenuOpen)}
          role=${this._mobileMenuOpen ? "dialog" : nothing}
          aria-modal=${this._mobileMenuOpen ? "true" : nothing}
          aria-label=${this._mobileMenuOpen ? "Navigation menu" : nothing}
          tabindex=${this._mobileMenuOpen ? "-1" : nothing}
          aria-hidden=${String(!this._mobileMenuOpen)}
          @keydown=${(event: KeyboardEvent) =>
            this._handleMobileOverlayKeydown(event, "menu")}
        >
          <div class="mobile-drawer-top">
            <button
              class="mobile-drawer-close"
              type="button"
              aria-label="Close menu"
              @click=${() => {
                this._closeMobileMenu({ restoreFocus: true });
              }}
            >
              <fd-icon name="x" aria-hidden="true"></fd-icon>
            </button>
          </div>
          ${this._renderMobileDrawerBody()}
        </div>
      </div>
    `;
  }
}
