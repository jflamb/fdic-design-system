import type { FdOrgInputNode } from "../org-chart-types.js";

export const minimalOrgFixture: FdOrgInputNode[] = [
  {
    id: "division-risk",
    label: "Division of Risk Management Supervision",
    title: "Division",
    nodeType: "unit",
    sourceStatus: "official",
    sourceMeta: { source: "fixture", label: "Fixture", fetchedAt: "2026-05-08" },
  },
  {
    id: "office-policy",
    parentId: "division-risk",
    label: "Policy and Program Development",
    title: "Office",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "pos-director",
    parentId: "office-policy",
    label: "Associate Director",
    title: "Policy and Program Development",
    nodeType: "position",
    sourceStatus: "official",
  },
  {
    id: "person-rivera",
    parentId: "pos-director",
    label: "Alex Rivera",
    title: "Associate Director",
    nodeType: "person",
    sourceStatus: "official",
    person: { displayName: "Alex Rivera", photoRef: "avatar:alex-rivera" },
  },
];
