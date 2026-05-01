import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { CollectionChildController } from "./collection-child-controller.js";
import {
  COLLECTION_COLUMNS,
  type CollectionColumns,
  collectionGridStyles,
} from "./collection-grid.js";

export const MEDIA_LIST_COLUMNS = COLLECTION_COLUMNS;
export type MediaListColumns = CollectionColumns;

const MEDIA_LIST_COLUMNS_SET = new Set<string>(MEDIA_LIST_COLUMNS);

function isElementChild(node: Element): node is HTMLElement {
  return node instanceof HTMLElement;
}

function normalizeColumns(value: string | undefined): MediaListColumns {
  return value && MEDIA_LIST_COLUMNS_SET.has(value)
    ? (value as MediaListColumns)
    : "3";
}

/**
 * `fd-media-list` — Responsive list layout for direct media item children.
 */
export class FdMediaList extends LitElement {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
  };

  static styles = [
    collectionGridStyles("fd-media-list"),
    css`
    :host {
      display: block;
      --fd-media-list-col-2-min: var(--fdic-layout-col-2-min);
      --fd-media-list-col-2-max: var(--fdic-layout-col-2-max);
      --fd-media-list-col-2-gap: var(--fdic-layout-col-2-gap);
      --fd-media-list-col-3-min: var(--fdic-layout-col-3-min, 320px);
      --fd-media-list-col-3-max: calc(
        (
          var(--fdic-layout-shell-max-width, 1312px) -
            (2 * var(--fd-media-list-col-3-gap, var(--fdic-layout-col-3-gap, 48px)))
        ) / 3
      );
      --fd-media-list-col-3-gap: var(--fdic-layout-col-3-gap);
      --fd-media-list-col-3-row-gap: var(--fdic-layout-section-block-padding-compact, 24px);
      --fd-media-list-col-4-min: var(--fdic-layout-col-4-min);
      --fd-media-list-col-4-max: var(--fdic-layout-col-4-max);
      --fd-media-list-col-4-gap: var(--fdic-layout-col-4-gap);
      --fd-media-list-col-2-min-mobile: var(--fdic-layout-col-2-min-narrow);
      --fd-media-list-col-2-gap-mobile: var(--fdic-layout-col-2-gap-narrow);
      --fd-media-list-col-3-min-mobile: var(--fdic-layout-col-3-min-narrow, 320px);
      --fd-media-list-col-3-gap-mobile: var(--fdic-layout-col-3-gap, 48px);
      --fd-media-list-col-3-row-gap-mobile: var(--fdic-layout-section-block-padding-compact, 24px);
      --fd-media-list-col-4-min-mobile: var(--fdic-layout-col-4-min-narrow);
      --fd-media-list-col-4-max-mobile: var(--fdic-layout-col-4-max-narrow);
      --fd-media-list-col-4-gap-mobile: var(--fdic-layout-col-4-gap-narrow);
    }

    :host([hidden]) {
      display: none;
    }

    slot {
      display: contents;
    }

    :host([columns="2"]) [part="base"] {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :host([columns="3"]) [part="base"] {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    :host([columns="4"]) [part="base"] {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @container (max-width: 815px) {
      :host([columns="2"]) [part="base"] {
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--_fd-media-list-track-min), var(--_fd-media-list-track-max))
        );
      }
    }

    @container (max-width: 1175px) {
      :host([columns="3"]) [part="base"] {
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--_fd-media-list-track-min), var(--_fd-media-list-track-max))
        );
      }
    }

    @container (max-width: 1167px) {
      :host([columns="4"]) [part="base"] {
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--_fd-media-list-track-min), var(--_fd-media-list-track-max))
        );
      }
    }

    ::slotted(fd-media-item) {
      inline-size: 100%;
      min-inline-size: 0;
    }
  `,
  ];

  declare columns: MediaListColumns;
  declare label: string | undefined;

  private readonly _childController = new CollectionChildController({
    applyToChild: (element) => {
      if (element.getAttribute("role") !== "listitem") {
        element.setAttribute("role", "listitem");
      }
    },
    attributeFilter: ["role"],
    isManagedChild: isElementChild,
    slot: () => this.shadowRoot?.querySelector("slot") ?? null,
  });

  constructor() {
    super();
    this.columns = "3";
    this.label = undefined;
  }

  override firstUpdated(changedProperties: PropertyValues<this>) {
    super.firstUpdated(changedProperties);
    this._childController.sync();
  }

  override disconnectedCallback() {
    this._childController.disconnect();
    super.disconnectedCallback();
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("columns")) {
      const normalized = normalizeColumns(this.columns);
      if (normalized !== this.columns) {
        this.columns = normalized;
      }
    }
  }

  render() {
    const label = this.label?.trim();

    return html`
      <div part="base" role="list" aria-label=${ifDefined(label || undefined)}>
        <slot @slotchange=${() => this._childController.sync()}></slot>
      </div>
    `;
  }
}
