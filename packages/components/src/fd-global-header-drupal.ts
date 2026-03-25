import type {
  FdGlobalHeaderLeafItem,
  FdGlobalHeaderNavigationItem,
  FdGlobalHeaderPanelItem,
  FdGlobalHeaderSection,
  FdGlobalHeaderSectionItem,
  FdGlobalHeaderSearchConfig,
} from "./components/fd-global-header.js";
import {
  createFdGlobalHeaderContent,
  createFdGlobalHeaderSearchConfig,
  createHeaderSearchItemsFromNavigation,
} from "./fd-global-header-content.js";
import type { FdGlobalHeaderContent } from "./fd-global-header-content.js";

export interface DrupalMenuLinkLike {
  id?: string;
  title: string;
  url?: string | null;
  description?: string;
  current?: boolean;
  keywords?: string[];
  overviewTitle?: string;
  overviewUrl?: string | null;
  ariaLabel?: string;
  below?: readonly DrupalMenuLinkLike[];
}

export interface DrupalGlobalHeaderSearchOptions
  extends Omit<FdGlobalHeaderSearchConfig, "items"> {
  items?: FdGlobalHeaderSearchConfig["items"];
}

export interface DrupalGlobalHeaderSource {
  items: readonly DrupalMenuLinkLike[];
  search?: DrupalGlobalHeaderSearchOptions | null;
}

function trimEdgeHyphens(value: string) {
  let start = 0;
  let end = value.length;

  while (start < end && value[start] === "-") {
    start += 1;
  }

  while (end > start && value[end - 1] === "-") {
    end -= 1;
  }

  return value.slice(start, end);
}

function toIdentifier(value: string, fallback: string) {
  const normalized = trimEdgeHyphens(value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-"));

  return normalized || fallback;
}

function getNodeId(item: DrupalMenuLinkLike, fallback: string) {
  return item.id || toIdentifier(item.title, fallback);
}

function hasChildren(item: DrupalMenuLinkLike) {
  return Boolean(item.below?.length);
}

function hasCurrentDescendant(item: DrupalMenuLinkLike): boolean {
  return Boolean(item.current || item.below?.some(hasCurrentDescendant));
}

function getOverviewLabel(
  title: string,
  explicitLabel?: string,
  href?: string | null,
) {
  if (explicitLabel) {
    return explicitLabel;
  }

  return href ? `${title} Overview` : undefined;
}

function mapLeafItem(item: DrupalMenuLinkLike): FdGlobalHeaderLeafItem {
  return {
    id: item.id,
    label: item.title,
    href: item.url || "#",
    description: item.description,
    keywords: item.keywords,
  };
}

function mapSectionItem(item: DrupalMenuLinkLike): FdGlobalHeaderSectionItem {
  return {
    ...mapLeafItem(item),
    children: (item.below || []).map(mapLeafItem),
  };
}

function mapSection(item: DrupalMenuLinkLike): FdGlobalHeaderSection {
  const href = item.url ?? undefined;
  const overviewHref = item.overviewUrl ?? href;
  const overviewLabel = getOverviewLabel(
    item.title,
    item.overviewTitle,
    overviewHref,
  );

  return {
    id: item.id,
    label: item.title,
    href,
    overviewLabel,
    overviewHref,
    description: item.description,
    keywords: item.keywords,
    items: (item.below || []).map(mapSectionItem),
  };
}

function createPanelOverviewSection(
  item: DrupalMenuLinkLike,
  panelHref: string,
  fallbackId: string,
): FdGlobalHeaderSection {
  const overviewLabel = getOverviewLabel(
    item.title,
    item.overviewTitle,
    panelHref,
  ) || `${item.title} Overview`;

  return {
    id: `${fallbackId}-overview`,
    label: overviewLabel,
    href: panelHref,
    overviewLabel,
    overviewHref: panelHref,
    description: item.description,
    items: [],
  };
}

function mapPanelItem(
  item: DrupalMenuLinkLike,
  index: number,
): FdGlobalHeaderPanelItem {
  const panelId = getNodeId(item, `panel-${index + 1}`);
  const sections = (item.below || []).map(mapSection);
  const panelHref =
    item.overviewUrl ||
    item.url ||
    sections[0]?.overviewHref ||
    sections[0]?.href ||
    "#";
  const needsOverviewSection =
    sections.length > 1 ||
    Boolean(item.overviewTitle || item.overviewUrl || item.url);
  const normalizedSections = needsOverviewSection
    ? [createPanelOverviewSection(item, panelHref, panelId), ...sections]
    : sections;

  return {
    kind: "panel",
    id: panelId,
    label: item.title,
    href: panelHref,
    overviewLabel: getOverviewLabel(item.title, item.overviewTitle, panelHref),
    ariaLabel: item.ariaLabel,
    current: hasCurrentDescendant(item),
    description: item.description,
    keywords: item.keywords,
    sections: normalizedSections,
  };
}

export function createFdGlobalHeaderNavigationFromDrupal(
  items: readonly DrupalMenuLinkLike[],
): FdGlobalHeaderNavigationItem[] {
  return items.map((item, index) => {
    if (hasChildren(item)) {
      return mapPanelItem(item, index);
    }

    return {
      kind: "link",
      id: getNodeId(item, `link-${index + 1}`),
      label: item.title,
      href: item.url || "#",
      current: Boolean(item.current),
      description: item.description,
      keywords: item.keywords,
    };
  });
}

export function createFdGlobalHeaderContentFromDrupal(
  source: DrupalGlobalHeaderSource,
): FdGlobalHeaderContent {
  const navigation = createFdGlobalHeaderNavigationFromDrupal(source.items);
  const search = source.search
    ? createFdGlobalHeaderSearchConfig({
        ...source.search,
        items:
          source.search.items ||
          createHeaderSearchItemsFromNavigation(navigation),
      })
    : null;

  return createFdGlobalHeaderContent({
    navigation,
    search,
  });
}
