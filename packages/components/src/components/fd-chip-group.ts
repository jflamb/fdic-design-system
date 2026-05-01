import { createWrappingGroup } from "./wrapping-group-base.js";

/**
 * `fd-chip-group` — Wrapping layout for related chips.
 */
export class FdChipGroup extends createWrappingGroup({
  tag: "fd-chip-group",
  gapVar: "--fd-chip-group-gap",
}) {}
