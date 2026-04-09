import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { CollectionChildController } from "./collection-child-controller.js";
import {
  COLLECTION_COLUMNS,
  type CollectionColumns,
  collectionGridStyles,
  getCollectionNarrowThresholdPx,
} from "./collection-grid.js";

export const CARD_GROUP_COLUMNS = COLLECTION_COLUMNS;
export type CardGroupColumns = CollectionColumns;

const CARD_GROUP_COLUMNS_SET = new Set<string>(CARD_GROUP_COLUMNS);

function isCardElement(node: Element): node is HTMLElement {
  return node.tagName.toLowerCase() === "fd-card";
}

function normalizeColumns(value: string | undefined): CardGroupColumns {
  return value && CARD_GROUP_COLUMNS_SET.has(value)
    ? (value as CardGroupColumns)
    : "3";
}

/**
 * `fd-card-group` — Responsive list/grid wrapper for related cards.
 */
export class FdCardGroup extends LitElement {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
  };

  static styles = [
    collectionGridStyles("fd-card-group"),
    css`
    :host {
      display: block;
      --fd-card-group-col-2-min: 384px;
      --fd-card-group-col-2-max: 688px;
      --fd-card-group-col-2-gap: 48px;
      --fd-card-group-col-3-min: 360px;
      --fd-card-group-col-3-max: 440px;
      --fd-card-group-col-3-gap: 48px;
      --fd-card-group-col-4-min: 256px;
      --fd-card-group-col-4-max: 320px;
      --fd-card-group-col-4-gap: 48px;

      --fd-card-group-col-2-min-mobile: 320px;
      --fd-card-group-col-2-gap-mobile: 16px;
      --fd-card-group-col-3-min-mobile: 200px;
      --fd-card-group-col-3-gap-mobile: 16px;
      --fd-card-group-col-4-min-mobile: 160px;
      --fd-card-group-col-4-max-mobile: 180px;
      --fd-card-group-col-4-gap-mobile: 16px;
    }

    :host([hidden]) {
      display: none;
    }

    slot {
      display: contents;
    }

    ::slotted(fd-card) {
      display: block;
      inline-size: 100%;
      min-inline-size: 0;
      max-inline-size: 100%;
    }

    ::slotted(*) {
      max-inline-size: 100%;
    }
  `,
  ];

  declare columns: CardGroupColumns;
  declare label: string | undefined;

  private readonly _childController = new CollectionChildController({
    applyToChild: (element) => {
      element.setAttribute("role", "listitem");
    },
    attributeFilter: ["role"],
    isManagedChild: isCardElement,
    slot: () => this.shadowRoot?.querySelector("slot") ?? null,
  });
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.columns = "3";
    this.label = undefined;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._startObservingLayout();
  }

  override firstUpdated() {
    this._childController.sync();
    this._updateNarrowLayout();
  }

  override disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._childController.disconnect();
    super.disconnectedCallback();
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("columns")) {
      const normalized = normalizeColumns(this.columns);
      if (normalized !== this.columns) {
        this.columns = normalized;
        return;
      }

      this._updateNarrowLayout();
    }
  }

  private _startObservingLayout() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    this._resizeObserver?.disconnect();
    this._resizeObserver = new ResizeObserver(() => {
      this._updateNarrowLayout();
    });
    this._resizeObserver.observe(this);
  }

  private _updateNarrowLayout() {
    const columns = normalizeColumns(this.columns);
    const threshold = getCollectionNarrowThresholdPx(
      this,
      "fd-card-group",
      columns,
    );
    const inlineSize = this.clientWidth || this.getBoundingClientRect().width || 0;
    const shouldUseNarrow = inlineSize > 0 && inlineSize < threshold;

    if (shouldUseNarrow) {
      this.setAttribute("data-narrow", "");
    } else {
      this.removeAttribute("data-narrow");
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
