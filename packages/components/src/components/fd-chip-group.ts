import { LitElement, css, html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * `fd-chip-group` — Wrapping layout for related chips.
 */
export class FdChipGroup extends LitElement {
  static properties = {
    label: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fd-chip-group-gap, var(--ds-spacing-2xs, 4px));
      align-items: flex-start;
      inline-size: 100%;
      box-sizing: border-box;
    }

    ::slotted(*) {
      max-inline-size: 100%;
    }
  `;

  declare label: string | undefined;

  constructor() {
    super();
    this.label = undefined;
  }

  render() {
    const label = this.label?.trim();

    return html`
      <div
        part="container"
        class="container"
        role=${ifDefined(label ? "group" : undefined)}
        aria-label=${ifDefined(label || undefined)}
      >
        <slot></slot>
      </div>
    `;
  }
}
