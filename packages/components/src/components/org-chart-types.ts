export type FdOrgNodeType = "unit" | "position" | "person" | "vacancy";

/**
 * Per-record source status. The four values match the v1 design requirements
 * exactly:
 *
 * - `official`: CHRIS-sourced data, the system of record.
 * - `override`: editorial override applied on top of source data.
 * - `draft`: proposed/not-yet-finalized.
 * - `historical`: past or effective-dated record.
 *
 * Tree-level concerns (orphan, cycle, missing fields, source-system disagreement)
 * surface through {@link FdOrgDiagnostic} or {@link FdOrgConflictMeta}, not by
 * mutating the record's status.
 */
export type FdOrgSourceStatus =
  | "official"
  | "override"
  | "draft"
  | "historical";

export type FdOrgSourceKind = "chris" | "drupal" | "json" | "fixture";

export type FdOrgDiagnosticType =
  | "orphan"
  | "cycle"
  | "missing-required-field"
  | "conflicting-duplicate";

export type FdOrgActingMeta = {
  effectiveStart?: string;
  effectiveEnd?: string;
  sourceLabel?: string;
  assignmentLabel?: string;
};

export type FdOrgSourceMeta = {
  source: FdOrgSourceKind;
  label?: string;
  fetchedAt?: string;
  effectiveAt?: string;
};

export type FdOrgConflictMeta = {
  field: string;
  sourceValue?: string;
  overrideValue?: string;
  sourceLabel?: string;
  overrideLabel?: string;
};

export type FdOrgOverrideMeta = {
  label?: string;
  author?: string;
  updatedAt?: string;
  reason?: string;
};

export type FdOrgPerson = {
  name?: string;
  displayName?: string;
  photoRef?: string;
  contactRefs?: string[];
};

export type FdOrgInputNode = {
  id?: string;
  parentId?: string | null;
  label?: string;
  title?: string;
  description?: string;
  nodeType?: FdOrgNodeType;
  sourceStatus?: FdOrgSourceStatus;
  actingMeta?: FdOrgActingMeta;
  sourceMeta?: FdOrgSourceMeta;
  conflictMeta?: FdOrgConflictMeta[];
  overrideMeta?: FdOrgOverrideMeta;
  effectiveStart?: string;
  effectiveEnd?: string;
  person?: FdOrgPerson;
};

export type FdOrgNode = Required<
  Pick<FdOrgInputNode, "id" | "label" | "nodeType" | "sourceStatus">
> &
  Omit<FdOrgInputNode, "id" | "label" | "nodeType" | "sourceStatus"> & {
    parentId?: string;
    childrenIds: string[];
  };

export type FdOrgTree = {
  rootIds: string[];
  nodesById: Record<string, FdOrgNode>;
  source?: FdOrgSourceMeta;
  unattachedRootId?: string;
};

export type FdOrgDiagnostic = {
  type: FdOrgDiagnosticType;
  nodeId?: string;
  relatedNodeId?: string;
  fields?: string[];
  message: string;
};

export type FdOrgNormalizeResult = {
  tree: FdOrgTree;
  diagnostics: FdOrgDiagnostic[];
};

export type FdOrgFilterState = {
  nodeTypes?: FdOrgNodeType[];
  sourceStatuses?: FdOrgSourceStatus[];
  actingOnly?: boolean;
};

export type FdOrgSearchResult = {
  node: FdOrgNode;
  ancestorIds: string[];
};

export type FdOrgPrintScope = "all" | "selected-branch";

export type FdOrgPrintDecision = {
  mode: "outline" | "table" | "chart";
  reason: string;
  metrics: {
    nodeCount: number;
    maxDepth: number;
    maxLabelLength: number;
    minimumTextSizePt: number;
    estimatedChartPages: number;
    clippingTolerance: number;
  };
};

export const FD_ORG_NODE_TYPE_LABELS: Record<FdOrgNodeType, string> = {
  unit: "Unit",
  position: "Position",
  person: "Person",
  vacancy: "Vacancy",
};

export const FD_ORG_SOURCE_STATUS_LABELS: Record<FdOrgSourceStatus, string> = {
  official: "Official",
  draft: "Draft",
  historical: "Historical",
  override: "Editorial override",
};

export const FD_ORG_SOURCE_STATUS_TONES: Record<
  FdOrgSourceStatus,
  "neutral" | "cool" | "warm" | "positive"
> = {
  official: "positive",
  draft: "cool",
  historical: "neutral",
  override: "warm",
};

/**
 * Phosphor icon names paired with each source status. Components render the
 * matching `fd-icon` so status remains identifiable in greyscale and at the
 * minimum legible text size required by FDIC accessibility guidance.
 */
export const FD_ORG_SOURCE_STATUS_ICONS: Record<FdOrgSourceStatus, string> = {
  official: "check-circle",
  draft: "pencil",
  historical: "eye",
  override: "file-text",
};

export type FdOrgIssueLevel = "none" | "warn";

/**
 * Classify whether a node has an open issue an editor should review. Tiles
 * surface only this severity as an ambient dot; specifics live in the details
 * panel.
 *
 * - `warn`: source data is usable but needs editor attention (`override`,
 *   acting assignment in effect, or the position is a vacancy).
 * - `none`: nothing to flag (`official`, `draft`, `historical` without acting).
 *
 * Tree-level conditions surfaced through {@link FdOrgDiagnostic} (orphan,
 * cycle, missing fields, conflicting duplicates) do not raise the per-node
 * level; consumers may render diagnostics separately.
 */
export function getOrgNodeIssueLevel(node: FdOrgNode): FdOrgIssueLevel {
  if (
    node.sourceStatus === "override" ||
    node.actingMeta !== undefined ||
    node.nodeType === "vacancy"
  ) {
    return "warn";
  }

  return "none";
}

/**
 * Short text describing the highest-priority issue on a node. Returns an empty
 * string when the node has no issues. Intended for the visually hidden text
 * referenced by the tile's ambient indicator.
 */
export function getOrgNodeIssueSummary(node: FdOrgNode): string {
  const level = getOrgNodeIssueLevel(node);
  if (level === "none") return "";

  const reason =
    node.sourceStatus === "override"
      ? "editorial override"
      : node.nodeType === "vacancy"
        ? "vacancy"
        : node.actingMeta
          ? "acting assignment"
          : "open issues";

  return `Has ${reason} — see details`;
}

export function getOrgChildren(tree: FdOrgTree, nodeId: string) {
  return (tree.nodesById[nodeId]?.childrenIds ?? [])
    .map((id) => tree.nodesById[id])
    .filter((node): node is FdOrgNode => Boolean(node));
}

export function getOrgAncestors(tree: FdOrgTree, nodeId: string) {
  const ancestors: FdOrgNode[] = [];
  let current = tree.nodesById[nodeId];
  const seen = new Set<string>();

  while (current?.parentId && !seen.has(current.parentId)) {
    seen.add(current.parentId);
    const parent = tree.nodesById[current.parentId];
    if (!parent) break;
    ancestors.unshift(parent);
    current = parent;
  }

  return ancestors;
}

export function getOrgDescendantIds(tree: FdOrgTree, nodeId: string) {
  const ids: string[] = [];
  const visit = (id: string) => {
    for (const childId of tree.nodesById[id]?.childrenIds ?? []) {
      ids.push(childId);
      visit(childId);
    }
  };

  visit(nodeId);
  return ids;
}

export function getOrgNodeCount(tree: FdOrgTree) {
  return Object.keys(tree.nodesById).length;
}

export function getOrgMaxDepth(tree: FdOrgTree) {
  let maxDepth = 0;
  const visit = (id: string, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    for (const childId of tree.nodesById[id]?.childrenIds ?? []) {
      visit(childId, depth + 1);
    }
  };

  for (const rootId of tree.rootIds) {
    visit(rootId, 1);
  }

  return maxDepth;
}

export function getOrgMaxLabelLength(tree: FdOrgTree) {
  return Object.values(tree.nodesById).reduce(
    (max, node) => Math.max(max, node.label.length, node.title?.length ?? 0),
    0,
  );
}

export function orgNodeMatchesFilters(
  node: FdOrgNode,
  filters: FdOrgFilterState = {},
) {
  if (filters.nodeTypes?.length && !filters.nodeTypes.includes(node.nodeType)) {
    return false;
  }

  if (
    filters.sourceStatuses?.length &&
    !filters.sourceStatuses.includes(node.sourceStatus)
  ) {
    return false;
  }

  if (filters.actingOnly && !node.actingMeta) {
    return false;
  }

  return true;
}

export function searchOrgTree(
  tree: FdOrgTree,
  query: string,
  filters: FdOrgFilterState = {},
) {
  const normalizedQuery = query.trim().toLowerCase();
  const results: FdOrgSearchResult[] = [];

  for (const node of Object.values(tree.nodesById)) {
    if (!orgNodeMatchesFilters(node, filters)) continue;

    const searchable = [
      node.label,
      node.title,
      node.description,
      node.person?.displayName,
      node.person?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!normalizedQuery || searchable.includes(normalizedQuery)) {
      results.push({
        node,
        ancestorIds: getOrgAncestors(tree, node.id).map((ancestor) => ancestor.id),
      });
    }
  }

  return results;
}

export function printDecision(
  tree: FdOrgTree,
  scope: FdOrgPrintScope = "all",
  selectedNodeId?: string,
): FdOrgPrintDecision {
  const scopedIds =
    scope === "selected-branch" && selectedNodeId && tree.nodesById[selectedNodeId]
      ? [selectedNodeId, ...getOrgDescendantIds(tree, selectedNodeId)]
      : Object.keys(tree.nodesById);
  const scopedNodes = scopedIds
    .map((id) => tree.nodesById[id])
    .filter((node): node is FdOrgNode => Boolean(node));
  const scopedTree: FdOrgTree = {
    rootIds: tree.rootIds.filter((id) => scopedIds.includes(id)),
    nodesById: Object.fromEntries(scopedNodes.map((node) => [node.id, node])),
    source: tree.source,
    unattachedRootId: scopedIds.includes(tree.unattachedRootId ?? "")
      ? tree.unattachedRootId
      : undefined,
  };
  const nodeCount = scopedNodes.length;
  const maxDepth = Math.max(1, getOrgMaxDepth(scopedTree));
  const maxLabelLength = scopedNodes.reduce(
    (max, node) => Math.max(max, node.label.length, node.title?.length ?? 0),
    0,
  );
  const estimatedChartPages = Math.ceil((nodeCount * Math.max(1, maxDepth)) / 120);
  const minimumTextSizePt = maxLabelLength > 42 ? 8 : 10;
  const clippingTolerance = maxDepth > 6 ? 0 : 2;

  if (nodeCount > 175 || estimatedChartPages > 4 || minimumTextSizePt < 9) {
    return {
      mode: nodeCount > 350 ? "table" : "outline",
      reason:
        "Hierarchy/table print selected because a visual chart would exceed the v1 legibility or page-count thresholds.",
      metrics: {
        nodeCount,
        maxDepth,
        maxLabelLength,
        minimumTextSizePt,
        estimatedChartPages,
        clippingTolerance,
      },
    };
  }

  return {
    mode: "outline",
    reason:
      "V1 has no visual chart renderer, so printable output remains outline-first even when chart thresholds would allow a chart.",
    metrics: {
      nodeCount,
      maxDepth,
      maxLabelLength,
      minimumTextSizePt,
      estimatedChartPages,
      clippingTolerance,
    },
  };
}
