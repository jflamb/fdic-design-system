import type {
  FdGlobalHeaderNavigationItem,
  FdGlobalHeaderPanelItem,
  FdGlobalHeaderSection,
  FdGlobalHeaderSectionItem,
  FdGlobalHeaderSearchConfig,
} from "./fd-global-header.js";
import { createHeaderSearchItemsFromNavigation } from "./fd-global-header.js";
import { fdicNetMainMenuPrototypeContent } from "./fd-global-header.prototype-content.js";

interface PrototypeL3 {
  id: string;
  label: string;
  href: string;
  description?: string;
}

interface PrototypeL2 {
  id: string;
  label: string;
  href: string;
  description?: string;
  l3?: readonly PrototypeL3[];
}

interface PrototypeL1 {
  id: string;
  label: string;
  href?: string;
  overviewLabel?: string;
  overviewHref?: string;
  description?: string;
  l2?: readonly PrototypeL2[];
}

interface PrototypePanel {
  ariaLabel?: string;
  overviewLabel?: string;
  overviewHref?: string;
  description?: string;
  l1?: readonly PrototypeL1[];
}

const prototypePanels = fdicNetMainMenuPrototypeContent.menu
  .panels as unknown as Record<string, PrototypePanel>;
const prototypeNav = fdicNetMainMenuPrototypeContent.header.nav as ReadonlyArray<{
  id: string;
  label: string;
  panelKey?: string;
}>;

function mapPrototypeL3(item: PrototypeL3) {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    description: item.description,
  };
}

function mapPrototypeL2(item: PrototypeL2): FdGlobalHeaderSectionItem {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    description: item.description,
    children: (item.l3 || []).map(mapPrototypeL3),
  };
}

function mapPrototypeL1(item: PrototypeL1): FdGlobalHeaderSection {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    overviewLabel: item.overviewLabel,
    overviewHref: item.overviewHref,
    description: item.description,
    items: (item.l2 || []).map(mapPrototypeL2),
  };
}

function mapPrototypePanel(panelKey: string, panel: PrototypePanel, label: string): FdGlobalHeaderPanelItem {
  return {
    kind: "panel",
    id: panelKey,
    label,
    href: panel.overviewHref,
    overviewLabel: panel.overviewLabel,
    ariaLabel: panel.ariaLabel,
    description: panel.description,
    sections: (panel.l1 || []).map(mapPrototypeL1),
  };
}

export const fdGlobalHeaderPrototypeNavigation: FdGlobalHeaderNavigationItem[] =
  prototypeNav.map((item) => {
    const panelKey = item.panelKey || item.id;
    const panel = prototypePanels[panelKey];

    return mapPrototypePanel(panelKey, panel, item.label);
  });

export function createFdGlobalHeaderPrototypeSearch(
  action = "/search",
): FdGlobalHeaderSearchConfig {
  return {
    action,
    label: "Search FDICnet",
    placeholder:
      fdicNetMainMenuPrototypeContent.header.searchPlaceholder || "Search FDICnet",
    submitLabel: "Open first matching result",
    searchAllLabel: "Search all FDICnet",
    paramName: "q",
    items: createHeaderSearchItemsFromNavigation(fdGlobalHeaderPrototypeNavigation),
  };
}

export const fdGlobalHeaderPrototypeSearch =
  createFdGlobalHeaderPrototypeSearch();

export const fdGlobalHeaderPrototypeBrand = {
  label: "FDICnet",
  href: "/",
  ariaLabel: "FDICnet home",
} as const;

export const fdGlobalHeaderPrototypeUtilityLinks = [
  { label: "Employee directory", href: "#employee-directory" },
  { label: "Help", href: "#help" },
] as const;
