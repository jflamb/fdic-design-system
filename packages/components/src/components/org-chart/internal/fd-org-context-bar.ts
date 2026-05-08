import { LitElement, css, html, nothing } from "lit";
import type { FdOrgTree } from "../../org-chart-types.js";
import { getOrgAncestors } from "../../org-chart-types.js";

/**
 * `fd-org-context-bar` — Embedded hierarchy context and source summary.
 */
export class FdOrgContextBar extends LitElement {
  static properties = {
    tree: { attribute: false },
    nodeId: { attribute: "node-id", reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: 100%;
      color: var(--fdic-color-text-secondary, #565c65);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    :host([hidden]) {
      display: none;
    }

    [part="bar"] {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-md, 16px);
      align-items: center;
      justify-content: space-between;
      padding-block: var(--fdic-spacing-sm, 12px);
      padding-inline: var(--fdic-spacing-md, 16px);
      border: 1px solid var(--fdic-color-border-subtle);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-surface);
    }

    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--fdic-spacing-3xs, 2px) var(--fdic-spacing-2xs, 4px);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--fdic-spacing-3xs, 2px);
    }

    li:not(:last-child)::after {
      content: "";
      display: inline-block;
      inline-size: 6px;
      block-size: 6px;
      margin-inline-start: var(--fdic-spacing-2xs, 4px);
      border-inline-end: 1.5px solid currentColor;
      border-block-start: 1.5px solid currentColor;
      transform: rotate(45deg);
      opacity: 0.7;
    }

    li:last-child {
      color: var(--fdic-color-text-primary);
      font-weight: var(--fdic-font-weight-semibold, 600);
    }

    [part="source"] {
      margin: 0;
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
    }

    /* Workflow chrome — the print header carries source/path context on paper. */
    @media print {
      :host {
        display: none;
      }
    }
  `;

  declare tree?: FdOrgTree;
  declare nodeId?: string;

  render() {
    const node = this.nodeId && this.tree ? this.tree.nodesById[this.nodeId] : undefined;
    const path = node && this.tree ? [...getOrgAncestors(this.tree, node.id), node] : [];
    const source = node?.sourceMeta ?? this.tree?.source;

    return html`
      <div part="bar">
        <nav aria-label="Selected organization path">
          ${path.length
            ? html`<ol>${path.map((item) => html`<li>${item.label}</li>`)}</ol>`
            : html`No organization record selected`}
        </nav>
        <p part="source">
          ${source
            ? html`${source.label ?? source.source}${source.fetchedAt ? html` · updated ${source.fetchedAt}` : nothing}`
            : "Source not provided"}
        </p>
      </div>
    `;
  }
}
