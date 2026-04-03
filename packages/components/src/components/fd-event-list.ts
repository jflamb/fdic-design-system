import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { EVENT_TONES, type EventTone } from "./fd-event.js";

function isEventElement(node: Element): node is HTMLElement {
  return node.tagName.toLowerCase() === "fd-event";
}

const EVENT_TONE_SET = new Set<string>(EVENT_TONES);

function normalizeEventTone(value: string | undefined): EventTone {
  return value && EVENT_TONE_SET.has(value) ? (value as EventTone) : "neutral";
}

/**
 * `fd-event-list` — Responsive list layout for direct `fd-event` children.
 */
export class FdEventList extends LitElement {
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
        minmax(min(100%, var(--fd-event-list-min-column-size, 384px)), 1fr)
      );
      row-gap: var(--fd-event-list-row-gap, 20px);
      column-gap: var(--fd-event-list-column-gap, 24px);
      align-items: start;
    }

    slot {
      display: contents;
    }

    ::slotted(fd-event) {
      min-inline-size: 0;
      max-inline-size: 100%;
    }
  `;

  declare label: string | undefined;
  declare tone: EventTone;

  private readonly _eventObservers = new Map<HTMLElement, MutationObserver>();

  constructor() {
    super();
    this.label = undefined;
    this.tone = "neutral";
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this._syncEvents();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("tone")) {
      this._syncEvents();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownEventObservers();
  }

  private _handleSlotChange() {
    this._syncEvents();
  }

  private _applyToneToEvent(element: HTMLElement, tone: EventTone) {
    element.setAttribute("role", "listitem");

    if (element.getAttribute("tone") !== tone) {
      element.setAttribute("tone", tone);
    }
  }

  private _syncEvents() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) {
      return;
    }

    const tone = normalizeEventTone(this.tone);
    const assignedEvents = slot
      .assignedElements({ flatten: true })
      .filter(isEventElement);

    for (const element of [...this._eventObservers.keys()]) {
      if (!assignedEvents.includes(element)) {
        this._eventObservers.get(element)?.disconnect();
        this._eventObservers.delete(element);
      }
    }

    for (const element of assignedEvents) {
      this._applyToneToEvent(element, tone);

      if (!this._eventObservers.has(element)) {
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            if (record.type === "attributes" && record.attributeName === "tone") {
              this._applyToneToEvent(element, normalizeEventTone(this.tone));
            }
          }
        });

        observer.observe(element, {
          attributes: true,
          attributeFilter: ["tone"],
        });
        this._eventObservers.set(element, observer);
      }
    }
  }

  private _teardownEventObservers() {
    for (const observer of this._eventObservers.values()) {
      observer.disconnect();
    }

    this._eventObservers.clear();
  }

  render() {
    const label = this.label?.trim();

    return html`
      <div part="base" role="list" aria-label=${ifDefined(label || undefined)}>
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
}
