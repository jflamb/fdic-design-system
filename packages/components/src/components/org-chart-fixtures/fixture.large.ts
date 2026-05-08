import type { FdOrgInputNode } from "../org-chart-types.js";

export const largeOrgFixture: FdOrgInputNode[] = Array.from(
  { length: 500 },
  (_, index): FdOrgInputNode => {
    if (index === 0) {
      return {
        id: "large-root",
        label: "Large Fixture Root",
        title: "Agency",
        nodeType: "unit",
        sourceStatus: "official",
        sourceMeta: { source: "fixture", label: "Large fixture", fetchedAt: "2026-05-08" },
      };
    }

    const parentIndex = Math.max(0, Math.floor((index - 1) / 4));
    const nodeTypes = ["unit", "position", "person", "vacancy"] as const;

    return {
      id: `large-node-${index}`,
      parentId: parentIndex === 0 ? "large-root" : `large-node-${parentIndex}`,
      label: `Large fixture node ${index}`,
      title: `Hierarchy level ${Math.floor(Math.log(index + 1) / Math.log(4)) + 1}`,
      nodeType: nodeTypes[index % nodeTypes.length],
      sourceStatus: index % 23 === 0 ? "historical" : "official",
    };
  },
);
