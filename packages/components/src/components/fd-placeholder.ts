/**
 * Internal development placeholder — NOT part of the public package surface.
 * This component is not exported from the root package or any subpath.
 * Do not depend on it in consumer code.
 */
import { LitElement, css, html } from "lit";

export class FdPlaceholder extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 12rem;
      padding: 0.75rem 1rem;
      border: 1px dashed var(--fdic-color-border, #7a7a7a);
      border-radius: 0.5rem;
      background: var(--fdic-color-surface, #f5f5f5);
      color: var(--fdic-color-text, #1f1f1f);
      font: 600 0.95rem/1.2 sans-serif;
      letter-spacing: 0.02em;
    }
  `;

  render() {
    return html`<span>Placeholder component</span>`;
  }
}

