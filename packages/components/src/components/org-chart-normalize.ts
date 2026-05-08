import type {
  FdOrgDiagnostic,
  FdOrgInputNode,
  FdOrgNormalizeResult,
  FdOrgNode,
  FdOrgNodeType,
  FdOrgSourceMeta,
  FdOrgSourceStatus,
} from "./org-chart-types.js";

type NormalizeInput = FdOrgInputNode[] | {
  nodes?: FdOrgInputNode[];
  source?: FdOrgSourceMeta;
};

const VALID_NODE_TYPES = new Set<FdOrgNodeType>([
  "unit",
  "position",
  "person",
  "vacancy",
]);
const VALID_SOURCE_STATUSES = new Set<FdOrgSourceStatus>([
  "official",
  "draft",
  "historical",
  "override",
]);
export const FD_ORG_UNATTACHED_ID = "__fd-org-unattached";

export function normalizeOrgTree(input: NormalizeInput): FdOrgNormalizeResult {
  const source = Array.isArray(input) ? undefined : input.source;
  const records = Array.isArray(input) ? input : input.nodes ?? [];
  const diagnostics: FdOrgDiagnostic[] = [];
  const nodesById: Record<string, FdOrgNode> = {};
  const signaturesById = new Map<string, string>();
  const duplicateCounts = new Map<string, number>();

  records.forEach((record, index) => {
    const missing: string[] = [];
    const rawId = text(record.id);
    const id = rawId || `missing-id-${index + 1}`;
    const label = text(record.label) || "Unnamed org record";

    if (!rawId) missing.push("id");
    if (!text(record.label)) missing.push("label");

    const nodeType = VALID_NODE_TYPES.has(record.nodeType as FdOrgNodeType)
      ? record.nodeType as FdOrgNodeType
      : "unit";
    // Records with missing required fields default to `historical`. The
    // diagnostic carries the actual issue; the status no longer changes to
    // an out-of-spec "unavailable" value.
    const sourceStatus = missing.length > 0
      ? "historical"
      : VALID_SOURCE_STATUSES.has(record.sourceStatus as FdOrgSourceStatus)
        ? record.sourceStatus as FdOrgSourceStatus
        : "official";
    const node: FdOrgNode = {
      ...record,
      id,
      parentId: text(record.parentId) || undefined,
      label,
      nodeType,
      sourceStatus,
      childrenIds: [],
    };
    const signature = stableSignature({ ...node, childrenIds: [] });

    if (missing.length > 0) {
      diagnostics.push({
        type: "missing-required-field",
        nodeId: id,
        message: `Org record ${index + 1} is missing required field(s): ${missing.join(", ")}.`,
      });
    }

    if (!nodesById[id]) {
      nodesById[id] = node;
      signaturesById.set(id, signature);
      return;
    }

    if (signaturesById.get(id) === signature) {
      return;
    }

    // Conflicting duplicates are retained side by side; the diagnostic
    // captures the disagreement, and `conflictMeta` on the duplicate carries
    // the field-by-field comparison for the details panel. We no longer
    // mutate `sourceStatus` for either record.
    const duplicateIndex = (duplicateCounts.get(id) ?? 1) + 1;
    duplicateCounts.set(id, duplicateIndex);
    const duplicateId = `${id}#duplicate-${duplicateIndex}`;
    const existingNode = nodesById[id];
    const fields = diffFields(existingNode, node);
    nodesById[duplicateId] = {
      ...node,
      id: duplicateId,
      conflictMeta: [
        ...(node.conflictMeta ?? []),
        ...fields.map((field) => ({
          field,
          sourceValue: formatValue(existingNode[field as keyof FdOrgNode]),
          overrideValue: formatValue(node[field as keyof FdOrgNode]),
          sourceLabel: "First duplicate",
          overrideLabel: "Conflicting duplicate",
        })),
      ],
    };
    diagnostics.push({
      type: "conflicting-duplicate",
      nodeId: id,
      relatedNodeId: duplicateId,
      fields,
      message: `Conflicting duplicate org records were retained for ${id}; differing field(s): ${fields.join(", ")}.`,
    });
  });

  const unattachedChildren: string[] = [];

  for (const node of Object.values(nodesById)) {
    if (!node.parentId) continue;

    if (!nodesById[node.parentId]) {
      unattachedChildren.push(node.id);
      diagnostics.push({
        type: "orphan",
        nodeId: node.id,
        relatedNodeId: node.parentId,
        message: `${node.label} references missing parent ${node.parentId}; rendered under Unattached.`,
      });
      node.parentId = FD_ORG_UNATTACHED_ID;
    }
  }

  if (unattachedChildren.length > 0) {
    nodesById[FD_ORG_UNATTACHED_ID] = {
      id: FD_ORG_UNATTACHED_ID,
      label: "Unattached",
      description: "Records whose parent was not present in the source data.",
      nodeType: "unit",
      sourceStatus: "historical",
      childrenIds: [],
    };
  }

  rebuildChildren(nodesById);
  breakCycles(nodesById, diagnostics);
  rebuildChildren(nodesById);

  const rootIds = Object.values(nodesById)
    .filter((node) => !node.parentId)
    .map((node) => node.id);

  return {
    tree: {
      rootIds,
      nodesById,
      source,
      unattachedRootId: nodesById[FD_ORG_UNATTACHED_ID]
        ? FD_ORG_UNATTACHED_ID
        : undefined,
    },
    diagnostics,
  };
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stableSignature(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableSignature).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableSignature(entryValue)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function diffFields(left: FdOrgNode, right: FdOrgNode) {
  const fields = new Set([
    ...Object.keys(left),
    ...Object.keys(right),
  ]);

  fields.delete("childrenIds");

  return Array.from(fields).filter((field) =>
    stableSignature(left[field as keyof FdOrgNode]) !==
      stableSignature(right[field as keyof FdOrgNode])
  );
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string") return value;
  return stableSignature(value);
}

function rebuildChildren(nodesById: Record<string, FdOrgNode>) {
  for (const node of Object.values(nodesById)) {
    node.childrenIds = [];
  }

  for (const node of Object.values(nodesById)) {
    if (node.parentId && nodesById[node.parentId]) {
      nodesById[node.parentId].childrenIds.push(node.id);
    }
  }
}

function breakCycles(
  nodesById: Record<string, FdOrgNode>,
  diagnostics: FdOrgDiagnostic[],
) {
  const visited = new Set<string>();
  const active = new Set<string>();

  const visit = (nodeId: string) => {
    if (active.has(nodeId)) return;
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    active.add(nodeId);

    for (const childId of [...(nodesById[nodeId]?.childrenIds ?? [])]) {
      if (active.has(childId)) {
        const child = nodesById[childId];
        const parent = nodesById[nodeId];
        child.parentId = undefined;
        diagnostics.push({
          type: "cycle",
          nodeId,
          relatedNodeId: childId,
          message: `Cycle detected at edge ${parent.id} -> ${child.id}; ${child.label} was promoted to a root.`,
        });
        continue;
      }

      visit(childId);
    }

    active.delete(nodeId);
  };

  for (const nodeId of Object.keys(nodesById)) {
    visit(nodeId);
  }
}
