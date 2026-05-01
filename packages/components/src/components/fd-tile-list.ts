import type { PropertyValues } from "lit";
import {
  CollectionListBase,
  isCollectionElement,
} from "./collection-list-base.js";
import {
  type CollectionColumns,
  collectionGridLayoutStyles,
  collectionGridStyles,
} from "./collection-grid.js";
import { TILE_TONES, type TileTone } from "./fd-tile.js";

const TILE_TONE_SET = new Set<string>(TILE_TONES);

function normalizeTileTone(value: string | undefined): TileTone {
  return value && TILE_TONE_SET.has(value) ? (value as TileTone) : "neutral";
}

/**
 * `fd-tile-list` — Responsive list layout for related tiles.
 *
 * Public API markers for component metadata validation:
 * <slot></slot> part="base"
 * --fd-tile-list-col-2-min --fd-tile-list-col-2-max --fd-tile-list-col-2-gap
 * --fd-tile-list-col-3-min --fd-tile-list-col-3-max --fd-tile-list-col-3-gap --fd-tile-list-col-3-row-gap
 * --fd-tile-list-col-4-min --fd-tile-list-col-4-max --fd-tile-list-col-4-gap
 * --fd-tile-list-col-2-min-mobile --fd-tile-list-col-2-gap-mobile
 * --fd-tile-list-col-3-min-mobile --fd-tile-list-col-3-gap-mobile --fd-tile-list-col-3-row-gap-mobile
 * --fd-tile-list-col-4-min-mobile --fd-tile-list-col-4-max-mobile --fd-tile-list-col-4-gap-mobile
 */
export class FdTileList extends CollectionListBase {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    labelledby: { reflect: true },
    tone: { reflect: true },
  };

  static styles = [
    collectionGridStyles("fd-tile-list"),
    collectionGridLayoutStyles("fd-tile-list", "fd-tile"),
  ];

  declare columns: CollectionColumns;
  declare label: string | undefined;
  declare labelledby: string | undefined;
  declare tone: TileTone;

  constructor() {
    super({
      attributeFilter: ["role", "tone"],
      isManagedChild: isCollectionElement("fd-tile"),
    });
    this.columns = "3";
    this.label = undefined;
    this.labelledby = undefined;
    this.tone = "neutral";
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("tone")) {
      const normalized = normalizeTileTone(this.tone);
      if (normalized !== this.tone) {
        this.tone = normalized;
      }
    }
  }

  protected override applyToChild(element: HTMLElement) {
    const tone = normalizeTileTone(this.tone);
    this.applyListItemRole(element);

    if (element.getAttribute("tone") !== tone) {
      element.setAttribute("tone", tone);
    }
  }

  protected override shouldSyncChildren(changedProperties: PropertyValues<this>) {
    return changedProperties.has("tone");
  }
}
