import type { FdOrgInputNode } from "../org-chart-types.js";

export const malformedOrgFixture: FdOrgInputNode[] = [
  {
    id: "root",
    label: "Malformed Fixture Root",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "orphan",
    parentId: "missing-parent",
    label: "Orphaned position",
    nodeType: "position",
    sourceStatus: "official",
  },
  {
    id: "cycle-a",
    parentId: "cycle-c",
    label: "Cycle A",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "cycle-b",
    parentId: "cycle-a",
    label: "Cycle B",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "cycle-c",
    parentId: "cycle-b",
    label: "Cycle C",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "missing-label",
    nodeType: "person",
    sourceStatus: "official",
  },
  {
    id: "duplicate-exact",
    parentId: "root",
    label: "Exact duplicate",
    nodeType: "position",
    sourceStatus: "official",
  },
  {
    id: "duplicate-exact",
    parentId: "root",
    label: "Exact duplicate",
    nodeType: "position",
    sourceStatus: "official",
  },
  {
    id: "duplicate-conflict",
    parentId: "root",
    label: "Duplicate source value",
    nodeType: "position",
    sourceStatus: "official",
  },
  {
    id: "duplicate-conflict",
    parentId: "root",
    label: "Duplicate override value",
    nodeType: "position",
    sourceStatus: "override",
  },
];
