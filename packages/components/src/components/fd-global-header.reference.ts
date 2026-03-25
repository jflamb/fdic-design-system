import type {
  FdGlobalHeaderNavigationItem,
  FdGlobalHeaderPanelItem,
  FdGlobalHeaderSection,
  FdGlobalHeaderSectionItem,
  FdGlobalHeaderSearchConfig,
} from "./fd-global-header.js";
import { createHeaderSearchItemsFromNavigation } from "./fd-global-header.js";
import { fdicNetMainMenuReferenceContent } from "./fd-global-header.reference-content.js";

interface ReferenceL3 {
  id: string;
  label: string;
  href: string;
  description?: string;
}

interface ReferenceL2 {
  id: string;
  label: string;
  href: string;
  description?: string;
  l3?: readonly ReferenceL3[];
}

interface ReferenceL1 {
  id: string;
  label: string;
  href?: string;
  overviewLabel?: string;
  overviewHref?: string;
  description?: string;
  l2?: readonly ReferenceL2[];
}

interface ReferencePanel {
  ariaLabel?: string;
  overviewLabel?: string;
  overviewHref?: string;
  description?: string;
  l1?: readonly ReferenceL1[];
}

const referencePanels = fdicNetMainMenuReferenceContent.menu
  .panels as unknown as Record<string, ReferencePanel>;
const referenceNav = fdicNetMainMenuReferenceContent.header.nav as ReadonlyArray<{
  id: string;
  label: string;
  panelKey?: string;
}>;

function mapReferenceL3(item: ReferenceL3) {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    description: item.description,
  };
}

function mapReferenceL2(item: ReferenceL2): FdGlobalHeaderSectionItem {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    description: item.description,
    children: (item.l3 || []).map(mapReferenceL3),
  };
}

function mapReferenceL1(item: ReferenceL1): FdGlobalHeaderSection {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    overviewLabel: item.overviewLabel,
    overviewHref: item.overviewHref,
    description: item.description,
    items: (item.l2 || []).map(mapReferenceL2),
  };
}

function mapReferencePanel(panelKey: string, panel: ReferencePanel, label: string): FdGlobalHeaderPanelItem {
  return {
    kind: "panel",
    id: panelKey,
    label,
    href: panel.overviewHref,
    overviewLabel: panel.overviewLabel,
    ariaLabel: panel.ariaLabel,
    description: panel.description,
    sections: (panel.l1 || []).map(mapReferenceL1),
  };
}

export const fdGlobalHeaderReferenceNavigation: FdGlobalHeaderNavigationItem[] =
  referenceNav.map((item) => {
    const panelKey = item.panelKey || item.id;
    const panel = referencePanels[panelKey];

    return mapReferencePanel(panelKey, panel, item.label);
  });

export function createFdGlobalHeaderReferenceSearch(
  action = "/search",
): FdGlobalHeaderSearchConfig {
  return {
    action,
    label: "Search FDICnet",
    placeholder: fdicNetMainMenuReferenceContent.header.searchPlaceholder || "Search FDICnet",
    submitLabel: "Open first matching result",
    searchAllLabel: "Search all FDICnet",
    paramName: "q",
    items: createHeaderSearchItemsFromNavigation(fdGlobalHeaderReferenceNavigation),
  };
}

export const fdGlobalHeaderReferenceSearch =
  createFdGlobalHeaderReferenceSearch();

export const fdGlobalHeaderReferenceBrand = {
  label: "FDICnet",
  href: "/",
  ariaLabel: "FDICnet home",
} as const;

export const fdGlobalHeaderReferenceUtilityLinks = [
  { label: "Employee directory", href: "#employee-directory" },
  { label: "Help", href: "#help" },
] as const;
