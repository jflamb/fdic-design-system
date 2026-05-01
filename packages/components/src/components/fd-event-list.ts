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
import { EVENT_TONES, type EventTone } from "./fd-event.js";

const EVENT_TONE_SET = new Set<string>(EVENT_TONES);

function normalizeEventTone(value: string | undefined): EventTone {
  return value && EVENT_TONE_SET.has(value) ? (value as EventTone) : "neutral";
}

/**
 * `fd-event-list` — Responsive list layout for direct `fd-event` children.
 *
 * Public API markers for component metadata validation:
 * <slot></slot> part="base"
 * --fd-event-list-col-2-min --fd-event-list-col-2-max --fd-event-list-col-2-gap
 * --fd-event-list-col-3-min --fd-event-list-col-3-max --fd-event-list-col-3-gap --fd-event-list-col-3-row-gap
 * --fd-event-list-col-4-min --fd-event-list-col-4-max --fd-event-list-col-4-gap
 * --fd-event-list-col-2-min-mobile --fd-event-list-col-2-gap-mobile
 * --fd-event-list-col-3-min-mobile --fd-event-list-col-3-gap-mobile --fd-event-list-col-3-row-gap-mobile
 * --fd-event-list-col-4-min-mobile --fd-event-list-col-4-max-mobile --fd-event-list-col-4-gap-mobile
 */
export class FdEventList extends CollectionListBase {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    labelledby: { reflect: true },
    tone: { reflect: true },
  };

  static styles = [
    // `collectionGridStyles` owns `container-type` for this list's collapse queries.
    collectionGridStyles("fd-event-list"),
    collectionGridLayoutStyles("fd-event-list", "fd-event"),
  ];

  declare columns: CollectionColumns;
  declare label: string | undefined;
  declare labelledby: string | undefined;
  declare tone: EventTone;

  constructor() {
    super({
      attributeFilter: ["role", "tone"],
      isManagedChild: isCollectionElement("fd-event"),
    });
    this.columns = "3";
    this.label = undefined;
    this.labelledby = undefined;
    this.tone = "neutral";
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("tone")) {
      const normalized = normalizeEventTone(this.tone);
      if (normalized !== this.tone) {
        this.tone = normalized;
      }
    }
  }

  protected override applyToChild(element: HTMLElement) {
    const tone = normalizeEventTone(this.tone);
    this.applyListItemRole(element);

    if (element.getAttribute("tone") !== tone) {
      element.setAttribute("tone", tone);
    }
  }

  protected override shouldSyncChildren(changedProperties: PropertyValues<this>) {
    return changedProperties.has("tone");
  }
}
