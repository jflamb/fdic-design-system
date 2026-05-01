import {
  CollectionListBase,
  isCollectionElement,
} from "./collection-list-base.js";
import {
  COLLECTION_COLUMNS,
  type CollectionColumns,
  collectionGridLayoutStyles,
  collectionGridStyles,
} from "./collection-grid.js";

export const MEDIA_LIST_COLUMNS = COLLECTION_COLUMNS;
export type MediaListColumns = CollectionColumns;

/**
 * `fd-media-list` — Responsive list layout for direct media item children.
 *
 * Public API markers for component metadata validation:
 * <slot></slot> part="base"
 * --fd-media-list-col-2-min --fd-media-list-col-2-max --fd-media-list-col-2-gap
 * --fd-media-list-col-3-min --fd-media-list-col-3-gap --fd-media-list-col-3-row-gap
 * --fd-media-list-col-4-min --fd-media-list-col-4-max --fd-media-list-col-4-gap
 */
export class FdMediaList extends CollectionListBase {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    labelledby: { reflect: true },
  };

  static styles = [
    // `collectionGridStyles` owns `container-type` for this list's collapse queries.
    collectionGridStyles("fd-media-list"),
    collectionGridLayoutStyles("fd-media-list", "fd-media-item"),
  ];

  declare columns: MediaListColumns;
  declare label: string | undefined;
  declare labelledby: string | undefined;

  constructor() {
    super({
      isManagedChild: isCollectionElement("fd-media-item"),
    });
    this.columns = "3";
    this.label = undefined;
    this.labelledby = undefined;
  }
}
