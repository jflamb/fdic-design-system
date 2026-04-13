import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { CollectionChildController } from "./collection-child-controller.js";
import {
  COLLECTION_COLUMNS,
  type CollectionColumns,
  collectionGridStyles,
} from "./collection-grid.js";
import { EVENT_TONES, type EventTone } from "./fd-event.js";

function isEventElement(node: Element): node is HTMLElement {
  return node.tagName.toLowerCase() === "fd-event";
}

const EVENT_TONE_SET = new Set<string>(EVENT_TONES);
const EVENT_LIST_COLUMNS_SET = new Set<string>(COLLECTION_COLUMNS);

function normalizeEventTone(value: string | undefined): EventTone {
  return value && EVENT_TONE_SET.has(value) ? (value as EventTone) : "neutral";
}

function normalizeColumns(value: string | undefined): CollectionColumns {
  return value && EVENT_LIST_COLUMNS_SET.has(value)
    ? (value as CollectionColumns)
    : "3";
}

/**
 * `fd-event-list` — Responsive list layout for direct `fd-event` children.
 */
export class FdEventList extends LitElement {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    tone: { reflect: true },
  };

  static styles = [
    collectionGridStyles("fd-event-list"),
    css`
    :host {
      display: block;
      --fd-event-list-col-2-min: var(--fdic-layout-col-2-min);
      --fd-event-list-col-2-max: var(--fdic-layout-col-2-max);
      --fd-event-list-col-2-gap: var(--fdic-layout-col-2-gap);
      --fd-event-list-col-3-min: var(--fdic-layout-col-3-min);
      --fd-event-list-col-3-max: var(--fdic-layout-col-3-max);
      --fd-event-list-col-3-gap: var(--fdic-layout-col-3-gap);
      --fd-event-list-col-4-min: var(--fdic-layout-col-4-min);
      --fd-event-list-col-4-max: var(--fdic-layout-col-4-max);
      --fd-event-list-col-4-gap: var(--fdic-layout-col-4-gap);
      --fd-event-list-col-2-min-mobile: var(--fdic-layout-col-2-min-narrow);
      --fd-event-list-col-2-gap-mobile: var(--fdic-layout-col-2-gap-narrow);
      --fd-event-list-col-3-min-mobile: var(--fdic-layout-col-3-min-narrow);
      --fd-event-list-col-3-gap-mobile: var(--fdic-layout-col-3-gap-narrow);
      --fd-event-list-col-4-min-mobile: var(--fdic-layout-col-4-min-narrow);
      --fd-event-list-col-4-max-mobile: var(--fdic-layout-col-4-max-narrow);
      --fd-event-list-col-4-gap-mobile: var(--fdic-layout-col-4-gap-narrow);
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
          minmax(var(--_fd-event-list-track-min), var(--_fd-event-list-track-max))
        );
      }
    }

    @container (max-width: 1175px) {
      :host([columns="3"]) [part="base"] {
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--_fd-event-list-track-min), var(--_fd-event-list-track-max))
        );
      }
    }

    @container (max-width: 1167px) {
      :host([columns="4"]) [part="base"] {
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--_fd-event-list-track-min), var(--_fd-event-list-track-max))
        );
      }
    }

    ::slotted(fd-event) {
      inline-size: 100%;
      min-inline-size: 0;
      max-inline-size: 100%;
    }
  `,
  ];

  declare columns: CollectionColumns;
  declare label: string | undefined;
  declare tone: EventTone;

  private readonly _childController = new CollectionChildController({
    applyToChild: (element) =>
      this._applyToneToEvent(element, normalizeEventTone(this.tone)),
    attributeFilter: ["role", "tone"],
    isManagedChild: isEventElement,
    slot: () => this.shadowRoot?.querySelector("slot") ?? null,
  });

  constructor() {
    super();
    this.columns = "3";
    this.label = undefined;
    this.tone = "neutral";
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this._childController.sync();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("columns")) {
      const normalized = normalizeColumns(this.columns);
      if (normalized !== this.columns) {
        this.columns = normalized;
        return;
      }
    }

    if (changedProperties.has("tone")) {
      this._childController.sync();
    }
  }

  override disconnectedCallback() {
    this._childController.disconnect();
    super.disconnectedCallback();
  }

  private _applyToneToEvent(element: HTMLElement, tone: EventTone) {
    if (element.getAttribute("role") !== "listitem") {
      element.setAttribute("role", "listitem");
    }

    if (element.getAttribute("tone") !== tone) {
      element.setAttribute("tone", tone);
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
