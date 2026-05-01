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

export const SOCIAL_MEDIA_LIST_COLUMNS = COLLECTION_COLUMNS;
export type SocialMediaListColumns = CollectionColumns;

/**
 * `fd-social-media-list` — Responsive list layout for social media items.
 *
 * Public API markers for component metadata validation:
 * <slot></slot> part="base"
 * --fd-social-media-list-col-2-min --fd-social-media-list-col-2-max --fd-social-media-list-col-2-gap
 * --fd-social-media-list-col-3-min --fd-social-media-list-col-3-gap --fd-social-media-list-col-3-row-gap
 * --fd-social-media-list-col-4-min --fd-social-media-list-col-4-max --fd-social-media-list-col-4-gap
 */
export class FdSocialMediaList extends CollectionListBase {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    labelledby: { reflect: true },
  };

  static styles = [
    // `collectionGridStyles` owns `container-type` for this list's collapse queries.
    collectionGridStyles("fd-social-media-list"),
    collectionGridLayoutStyles("fd-social-media-list", "fd-social-media-item"),
  ];

  declare columns: SocialMediaListColumns;
  declare label: string | undefined;
  declare labelledby: string | undefined;

  constructor() {
    super({
      isManagedChild: isCollectionElement("fd-social-media-item"),
    });
    this.columns = "3";
    this.label = undefined;
    this.labelledby = undefined;
  }
}
