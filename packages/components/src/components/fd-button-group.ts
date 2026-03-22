import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

export type ButtonGroupAlign = "start" | "end" | "spread";
export type ButtonGroupDirection = "horizontal" | "vertical";

export class FdButtonGroup extends LitElement {
  static override get observedAttributes() {
    return [...super.observedAttributes, "style"];
  }

  static properties = {
    align: { reflect: true },
    direction: { reflect: true },
    label: { reflect: true },
    stacked: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      inline-size: 100%;
    }

    .container {
      display: flex;
      gap: var(--fd-button-group-gap, var(--fdic-spacing-sm, 0.75rem));
      align-items: flex-start;
      inline-size: 100%;
      box-sizing: border-box;
    }

    .horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .vertical,
    .stacked {
      flex-direction: column;
      align-items: stretch;
    }

    .align-start {
      justify-content: flex-start;
    }

    .align-end {
      justify-content: flex-end;
    }

    .align-spread {
      justify-content: flex-start;
    }

    .align-spread ::slotted(:first-child) {
      margin-inline-end: auto;
    }

    .vertical ::slotted(:first-child),
    .stacked ::slotted(:first-child) {
      margin-inline-end: 0;
    }

    ::slotted(*) {
      max-inline-size: 100%;
    }

    .vertical ::slotted(*),
    .stacked ::slotted(*) {
      inline-size: 100%;
    }
  `;

  declare align: ButtonGroupAlign;
  declare direction: ButtonGroupDirection;
  declare label: string | undefined;
  declare stacked: boolean;

  private _resizeObserver: ResizeObserver | null = null;
  private _stackThresholdPx: number | null = null;

  constructor() {
    super();
    this.align = "start";
    this.direction = "horizontal";
    this.label = undefined;
    this.stacked = false;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._startObserving();
  }

  override disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this._refreshThresholdPx();
    this._updateStacked();
  }

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("direction")) {
      this._updateStacked();
    }
  }

  private _startObserving() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    this._resizeObserver?.disconnect();
    this._resizeObserver = new ResizeObserver(() => {
      this._updateStacked();
    });
    this._resizeObserver.observe(this);
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "style" && oldValue !== newValue) {
      this._stackThresholdPx = null;
      this._refreshThresholdPx();
      this._updateStacked();
    }
  }

  private _parseLengthToPx(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      return 480;
    }

    if (normalized.endsWith("px")) {
      return Number.parseFloat(normalized);
    }

    if (normalized.endsWith("rem")) {
      const fontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize || "16",
      );
      return Number.parseFloat(normalized) * fontSize;
    }

    if (normalized.endsWith("em")) {
      const fontSize = Number.parseFloat(getComputedStyle(this).fontSize || "16");
      return Number.parseFloat(normalized) * fontSize;
    }

    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 480;
  }

  private _refreshThresholdPx() {
    const value =
      getComputedStyle(this).getPropertyValue("--fd-button-group-stack-at") ||
      "480px";
    this._stackThresholdPx = this._parseLengthToPx(value);
  }

  private _getThresholdPx() {
    if (this._stackThresholdPx === null) {
      this._refreshThresholdPx();
    }

    return this._stackThresholdPx ?? 480;
  }

  private _getInlineSize() {
    return this.clientWidth || this.getBoundingClientRect().width || 0;
  }

  private _updateStacked() {
    const inlineSize = this._getInlineSize();
    const thresholdPx = this._getThresholdPx();
    const shouldStack =
      this.direction === "vertical" ||
      (this.direction === "horizontal" &&
        inlineSize > 0 &&
        inlineSize <= thresholdPx);

    if (this.stacked !== shouldStack) {
      this.stacked = shouldStack;
    }
  }

  render() {
    const hasLabel = Boolean(this.label?.trim());
    const classes = {
      container: true,
      horizontal: this.direction === "horizontal" && !this.stacked,
      vertical: this.direction === "vertical",
      stacked: this.stacked && this.direction === "horizontal",
      "align-start": this.stacked || this.direction === "vertical" || this.align === "start",
      "align-end": !this.stacked && this.direction === "horizontal" && this.align === "end",
      "align-spread":
        !this.stacked && this.direction === "horizontal" && this.align === "spread",
    };

    return html`
      <div
        part="container"
        class=${classMap(classes)}
        role=${ifDefined(hasLabel ? "group" : undefined)}
        aria-label=${ifDefined(hasLabel ? this.label : undefined)}
        ?data-stacked=${this.stacked}
      >
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("fd-button-group")) {
  customElements.define("fd-button-group", FdButtonGroup);
}
