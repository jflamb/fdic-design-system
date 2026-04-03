import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

function isTileElement(node: Element): node is HTMLElement {
  return node.tagName.toLowerCase() === "fd-tile";
}

/**
 * `fd-tile-list` — Responsive list layout for related tiles.
 */
export class FdTileList extends LitElement {
  static properties = {
    label: { reflect: true },
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

  constructor() {
    super();
    this.label = undefined;
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._syncTileRoles();
  }

  private _handleSlotChange() {
    this._syncTileRoles();
  }

  private _syncTileRoles() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) {
      return;
    }

    for (const element of slot.assignedElements({ flatten: true })) {
      if (isTileElement(element)) {
        element.setAttribute("role", "listitem");
      }
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
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
}
