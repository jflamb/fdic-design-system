import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

export type ButtonGroupAlign = "start" | "end" | "spread";
export type ButtonGroupDirection = "horizontal" | "vertical";

export class FdButtonGroup extends LitElement {
  static properties = {
    align: { reflect: true },
    direction: { reflect: true },
    label: { reflect: true },
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

    .vertical {
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

    .vertical ::slotted(:first-child) {
      margin-inline-end: 0;
    }

    ::slotted(*) {
      max-inline-size: 100%;
    }

    .vertical ::slotted(*) {
      inline-size: 100%;
    }
  `;

  declare align: ButtonGroupAlign;
  declare direction: ButtonGroupDirection;
  declare label: string | undefined;

  constructor() {
    super();
    this.align = "start";
    this.direction = "horizontal";
    this.label = undefined;
  }

  render() {
    const hasLabel = Boolean(this.label?.trim());
    const classes = {
      container: true,
      horizontal: this.direction === "horizontal",
      vertical: this.direction === "vertical",
      "align-start": this.direction === "vertical" || this.align === "start",
      "align-end": this.direction === "horizontal" && this.align === "end",
      "align-spread":
        this.direction === "horizontal" && this.align === "spread",
    };

    return html`
      <div
        part="container"
        class=${classMap(classes)}
        role=${ifDefined(hasLabel ? "group" : undefined)}
        aria-label=${ifDefined(hasLabel ? this.label : undefined)}
      >
        <slot></slot>
      </div>
    `;
  }
}
