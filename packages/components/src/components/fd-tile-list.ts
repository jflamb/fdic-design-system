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
import {
  TILE_TONES,
  type TileTone,
} from "./fd-tile.js";

function isTileElement(node: Element): node is HTMLElement {
  return node.tagName.toLowerCase() === "fd-tile";
}

const TILE_TONE_SET = new Set<string>(TILE_TONES);
const TILE_LIST_COLUMNS_SET = new Set<string>(COLLECTION_COLUMNS);

function normalizeTileTone(value: string | undefined): TileTone {
  return value && TILE_TONE_SET.has(value) ? (value as TileTone) : "neutral";
}

function normalizeColumns(value: string | undefined): CollectionColumns {
  return value && TILE_LIST_COLUMNS_SET.has(value)
    ? (value as CollectionColumns)
    : "3";
}

/**
 * `fd-tile-list` — Responsive list layout for related tiles.
 */
export class FdTileList extends LitElement {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    tone: { reflect: true },
  };

  static styles = [
    collectionGridStyles("fd-tile-list"),
    css`
    :host {
      display: block;
      --fd-tile-list-col-2-min: 384px;
      --fd-tile-list-col-2-max: 688px;
      --fd-tile-list-col-2-gap: 48px;
      --fd-tile-list-col-3-min: 360px;
      --fd-tile-list-col-3-max: 440px;
      --fd-tile-list-col-3-gap: 48px;
      --fd-tile-list-col-4-min: 256px;
      --fd-tile-list-col-4-max: 320px;
      --fd-tile-list-col-4-gap: 48px;
      --fd-tile-list-col-2-min-mobile: 320px;
      --fd-tile-list-col-2-gap-mobile: 16px;
      --fd-tile-list-col-3-min-mobile: 200px;
      --fd-tile-list-col-3-gap-mobile: 16px;
      --fd-tile-list-col-4-min-mobile: 160px;
      --fd-tile-list-col-4-max-mobile: 180px;
      --fd-tile-list-col-4-gap-mobile: 16px;
    }

    :host([hidden]) {
      display: none;
    }

    slot {
      display: contents;
    }

    ::slotted(fd-tile) {
      inline-size: 100%;
      min-inline-size: 0;
      max-inline-size: 100%;
    }
  `,
  ];

  declare columns: CollectionColumns;
  declare label: string | undefined;
  declare tone: TileTone;

  private readonly _childController = new CollectionChildController({
    applyToChild: (element) => this._applyToneToTile(element, normalizeTileTone(this.tone)),
    attributeFilter: ["role", "tone"],
    isManagedChild: isTileElement,
    slot: () => this.shadowRoot?.querySelector("slot") ?? null,
  });
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.columns = "3";
    this.label = undefined;
    this.tone = "neutral";
  }

  override connectedCallback() {
    super.connectedCallback();
    this._startObservingLayout();
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this._childController.sync();
    this._updateNarrowLayout();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("columns")) {
      const normalized = normalizeColumns(this.columns);
      if (normalized !== this.columns) {
        this.columns = normalized;
        return;
      }

      this._updateNarrowLayout();
    }

    if (changedProperties.has("tone")) {
      this._childController.sync();
    }
  }

  override disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._childController.disconnect();
    super.disconnectedCallback();
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

  private _applyToneToTile(element: HTMLElement, tone: TileTone) {
    element.setAttribute("role", "listitem");

    if (element.getAttribute("tone") !== tone) {
      element.setAttribute("tone", tone);
    }
  }

  private _updateNarrowLayout() {
    const columns = normalizeColumns(this.columns);
    const threshold = getCollectionNarrowThresholdPx(
      this,
      "fd-tile-list",
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
      <div
        part="base"
        role="list"
        aria-label=${ifDefined(label || undefined)}
      >
        <slot @slotchange=${() => this._childController.sync()}></slot>
      </div>
    `;
  }
}
