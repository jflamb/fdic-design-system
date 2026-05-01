import { createWrappingGroup } from "./wrapping-group-base.js";

/**
 * `fd-badge-group` — Wrapping layout for related badges.
 */
export class FdBadgeGroup extends createWrappingGroup({
  tag: "fd-badge-group",
  gapVar: "--fd-badge-group-gap",
}) {}
