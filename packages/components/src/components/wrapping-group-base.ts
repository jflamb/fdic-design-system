import { LitElement, css, html, unsafeCSS } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

interface WrappingGroupOptions {
  gapVar: `--${string}`;
  tag: string;
}

type WrappingGroupConstructor = new () => LitElement & {
  label: string | undefined;
};

export function createWrappingGroup({
  gapVar,
  tag,
}: WrappingGroupOptions): WrappingGroupConstructor {
  return class WrappingGroup extends LitElement {
    static tagName = tag;

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
        gap: var(${unsafeCSS(gapVar)}, var(--fdic-spacing-2xs, 4px));
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
  };
}
