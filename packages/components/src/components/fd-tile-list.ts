import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  TILE_TONES,
  type TileTone,
} from "./fd-tile.js";

function isTileElement(node: Element): node is HTMLElement {
  return node.tagName.toLowerCase() === "fd-tile";
}

const TILE_TONE_SET = new Set<string>(TILE_TONES);

function normalizeTileTone(value: string | undefined): TileTone {
  return value && TILE_TONE_SET.has(value) ? (value as TileTone) : "neutral";
}

/**
 * `fd-tile-list` — Responsive list layout for related tiles.
 */
export class FdTileList extends LitElement {
  static properties = {
    label: { reflect: true },
    tone: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    [part="base"] {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, var(--fd-tile-list-min-column-size, 344px)), 1fr)
      );
      row-gap: var(--fd-tile-list-row-gap, 20px);
      column-gap: var(--fd-tile-list-column-gap, 24px);
      align-items: start;
    }

    slot {
      display: contents;
    }

    ::slotted(fd-tile) {
      min-inline-size: 0;
      max-inline-size: 100%;
    }
  `;

  declare label: string | undefined;
  declare tone: TileTone;

  private readonly _tileObservers = new Map<HTMLElement, MutationObserver>();

  constructor() {
    super();
    this.label = undefined;
    this.tone = "neutral";
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this._syncTiles();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("tone")) {
      this._syncTiles();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownTileObservers();
  }

  private _handleSlotChange() {
    this._syncTiles();
  }

  private _applyToneToTile(element: HTMLElement, tone: TileTone) {
    element.setAttribute("role", "listitem");

    if (element.getAttribute("tone") !== tone) {
      element.setAttribute("tone", tone);
    }
  }

  private _syncTiles() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) {
      return;
    }

    const tone = normalizeTileTone(this.tone);
    const assignedTiles = slot
      .assignedElements({ flatten: true })
      .filter(isTileElement);

    for (const element of [...this._tileObservers.keys()]) {
      if (!assignedTiles.includes(element)) {
        this._tileObservers.get(element)?.disconnect();
        this._tileObservers.delete(element);
      }
    }

    for (const element of assignedTiles) {
      this._applyToneToTile(element, tone);

      if (!this._tileObservers.has(element)) {
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            if (record.type === "attributes" && record.attributeName === "tone") {
              this._applyToneToTile(element, normalizeTileTone(this.tone));
            }
          }
        });

        observer.observe(element, {
          attributes: true,
          attributeFilter: ["tone"],
        });
        this._tileObservers.set(element, observer);
      }
    }
  }

  private _teardownTileObservers() {
    for (const observer of this._tileObservers.values()) {
      observer.disconnect();
    }

    this._tileObservers.clear();
  }

  render() {
    const label = this.label?.trim();

    return html`
      <div
        part="base"
        role="list"
        aria-label=${ifDefined(label || undefined)}
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
}
