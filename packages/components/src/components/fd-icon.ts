import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";

export class FdIcon extends LitElement {
  static properties = {
    name: { type: String, reflect: true },
    label: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-icon-size, 18px);
      block-size: var(--fd-icon-size, 18px);
      color: inherit;
      line-height: 0;
    }
    span {
      display: contents;
    }
    svg {
      inline-size: 100%;
      block-size: 100%;
    }
  `;

  declare name: string;
  declare label: string;

  constructor() {
    super();
    this.name = "";
    this.label = "";
  }

  /**
   * Proxy to `iconRegistry.register()` for convenience.
   */
  static register(
    nameOrIcons: string | Record<string, string>,
    svg?: string,
  ): void {
    iconRegistry.register(nameOrIcons, svg);
  }

  updated() {
    if (this.label) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", this.label);
      this.removeAttribute("aria-hidden");
    } else {
      this.setAttribute("aria-hidden", "true");
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
    }
  }

  render() {
    const svg = this.name ? iconRegistry.get(this.name) : undefined;

    if (!svg) {
      if (this.name) {
        console.warn(`[fd-icon] Unknown icon name: "${this.name}"`);
      }
      return nothing;
    }

    return html`<span part="svg">${unsafeSVG(svg)}</span>`;
  }
}
