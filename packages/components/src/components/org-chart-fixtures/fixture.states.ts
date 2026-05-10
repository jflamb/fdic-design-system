import type { FdOrgInputNode } from "../org-chart-types.js";

/**
 * Pattern-story fixture, shaped like the real Division of Insurance and
 * Research org chart in miniature: a root office, a director, two sections
 * with their own staff, and a few peer leaves under the director. Each of
 * the four required source statuses appears at least once. The structure
 * exists at all levels for the multi-column leaf flow and the
 * branches-first / vacancy-last sort to be observable in the demo.
 */
export const statesOrgFixture: FdOrgInputNode[] = [
  {
    id: "office-root",
    label: "Office of Example Programs",
    title: "Office",
    nodeType: "unit",
    sourceStatus: "official",
    sourceMeta: {
      source: "fixture",
      label: "Editor review fixture",
      fetchedAt: "2026-05-08",
    },
  },
  {
    id: "avery-chen",
    parentId: "office-root",
    label: "Avery Chen",
    title: "Director",
    nodeType: "person",
    sourceStatus: "official",
    person: { displayName: "Avery Chen", photoRef: "avatar:avery-chen" },
  },

  // Programs Section — director's first reporting branch.
  {
    id: "programs-section",
    parentId: "avery-chen",
    label: "Programs Section",
    title: "Section",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "robin-kim",
    parentId: "programs-section",
    label: "Robin Kim",
    title: "Section Chief",
    nodeType: "person",
    sourceStatus: "official",
    person: { displayName: "Robin Kim", photoRef: "avatar:robin-kim" },
  },
  {
    id: "jordan-pierce",
    parentId: "robin-kim",
    label: "Jordan Pierce",
    title: "Senior Analyst",
    nodeType: "person",
    sourceStatus: "official",
    person: { displayName: "Jordan Pierce", photoRef: "avatar:jordan-pierce" },
  },
  {
    id: "sam-taylor",
    parentId: "robin-kim",
    label: "Sam Taylor",
    title: "Senior Analyst",
    nodeType: "person",
    sourceStatus: "official",
    actingMeta: {
      assignmentLabel: "Acting Senior Analyst",
      effectiveStart: "2026-03-15",
      sourceLabel: "Editor review",
    },
    person: { displayName: "Sam Taylor", photoRef: "avatar:sam-taylor" },
  },
  {
    id: "vacant-analyst",
    parentId: "robin-kim",
    label: "Vacant",
    title: "Analyst",
    nodeType: "vacancy",
    sourceStatus: "official",
  },

  // Operations Section — director's second reporting branch.
  {
    id: "operations-section",
    parentId: "avery-chen",
    label: "Operations Section",
    title: "Section",
    nodeType: "unit",
    sourceStatus: "official",
  },
  {
    id: "lin-wei",
    parentId: "operations-section",
    label: "Lin Wei",
    title: "Section Chief",
    nodeType: "person",
    sourceStatus: "official",
    person: { displayName: "Lin Wei", photoRef: "avatar:lin-wei" },
  },
  {
    id: "branch-chief",
    parentId: "operations-section",
    label: "Branch Chief",
    title: "Position with editorial override",
    nodeType: "position",
    sourceStatus: "override",
    overrideMeta: {
      label: "Reports-to override",
      updatedAt: "2026-03-20",
      author: "Editor",
    },
    conflictMeta: [
      {
        field: "Reports to",
        sourceValue: "Programs Section",
        overrideValue: "Operations Section",
        sourceLabel: "Source of truth",
        overrideLabel: "Override",
      },
    ],
  },

  // Director-level peer leaves — exercise draft and historical statuses.
  {
    id: "proposed-deputy",
    parentId: "avery-chen",
    label: "Proposed Deputy Director",
    title: "Draft position",
    nodeType: "position",
    sourceStatus: "draft",
  },
  {
    id: "legacy-team",
    parentId: "avery-chen",
    label: "Legacy Review Team",
    title: "Historical team",
    nodeType: "unit",
    sourceStatus: "historical",
  },
];
