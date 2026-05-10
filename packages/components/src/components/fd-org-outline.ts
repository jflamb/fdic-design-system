import { LitElement, css, html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type {
  FdOrgFilterState,
  FdOrgNode,
  FdOrgPhotoResolver,
  FdOrgTree,
} from "./org-chart-types.js";
import {
  getOrgAncestors,
  getOrgChildren,
  getOrgNodeIssueLevel,
  getOrgNodeIssueSummary,
  orgNodeMatchesFilters,
  searchOrgTree,
} from "./org-chart-types.js";

export { normalizeOrgTree } from "./org-chart-normalize.js";
export {
  printDecision,
  searchOrgTree,
} from "./org-chart-types.js";
export type {
  FdOrgActingMeta,
  FdOrgConflictMeta,
  FdOrgDiagnostic,
  FdOrgFilterState,
  FdOrgInputNode,
  FdOrgNode,
  FdOrgNodeType,
  FdOrgNormalizeResult,
  FdOrgPhotoResolver,
  FdOrgPrintDecision,
  FdOrgPrintScope,
  FdOrgSearchResult,
  FdOrgSourceKind,
  FdOrgSourceMeta,
  FdOrgSourceStatus,
  FdOrgTree,
} from "./org-chart-types.js";

export type FdOrgSelectDetail = {
  nodeId: string;
  node: FdOrgNode;
};

/**
 * Vacancies are pending-data states. They sort to the bottom of their level
 * so the active hierarchy stays in the dominant position, while the records
 * remain visible for editor follow-up.
 */
function isLowPriority(node: FdOrgNode) {
  return node.nodeType === "vacancy";
}

/**
 * `fd-org-outline` — Semantic outline-first organization hierarchy.
 *
 * @fires fd-org-select - Fired when a node is selected.
 *
 * @csspart outline - Root outline container.
 * @csspart list - Root and nested unordered lists.
 * @csspart item - List item wrapper for each org node.
 * @csspart disclosure - Native disclosure wrapper for nodes with children.
 * @csspart summary - Native summary row for expandable nodes.
 * @csspart node-button - Native button row for leaf nodes.
 * @csspart avatar - Decorative avatar visual for person nodes when photo media is available.
 * @csspart label - Node label text.
 * @csspart meta - Secondary title or metadata line.
 * @csspart indicator - Ambient "has issues" dot. Present on every tile but hidden when the node has no open issues.
 * @csspart sr-only - Visually hidden text linked from the indicator via aria-describedby.
 * @csspart empty - Empty-state message shown when the tree is empty or filters hide every record.
 */
export class FdOrgOutline extends LitElement {
  static properties = {
    label: { reflect: true },
    emptyLabel: { attribute: "empty-label", reflect: true },
    noResultsLabel: { attribute: "no-results-label", reflect: true },
    tree: { attribute: false },
    currentNodeId: { attribute: "current-node-id", reflect: true },
    searchQuery: { attribute: "search-query", reflect: true },
    filters: { attribute: false },
    photoResolver: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: 100%;
      color: var(--fdic-color-text-primary);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--fdic-font-size-body, 1.125rem);
      line-height: var(--fdic-line-height-body, 1.45);
    }

    :host([hidden]) {
      display: none;
    }

    [part="outline"] {
      display: block;
      max-inline-size: 100%;
    }

    /*
     * Each level is rendered as two adjacent lists: a branches list and a
     * leaves list. Branches stay full-width, leaves auto-fit into a multi-
     * column grid. Splitting into two lists is what lets auto-fit collapse
     * unused trailing tracks for the leaf group — a branch spanning a single
     * combined grid would prevent any track from being considered empty.
     */
    [part~="list"] {
      display: grid;
      gap: var(--fdic-spacing-sm, 12px);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    [part~="list"][data-kind-group="branches"] {
      grid-template-columns: 1fr;
    }

    [part~="list"][data-kind-group="leaves"] {
      grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    }

    [part~="list"][data-depth]:not([data-depth="1"]) {
      margin-block-start: var(--fdic-spacing-sm, 12px);
      padding-inline-start: var(--fd-org-outline-indent, var(--fdic-spacing-lg, 24px));
      border-inline-start: 1px solid var(--fdic-color-border-divider, #dfe1e2);
    }

    [part~="item"] {
      min-inline-size: 0;
    }

    [part~="disclosure"] {
      min-inline-size: 0;
    }

    [part~="summary"],
    [part~="node-button"] {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-auto-rows: min-content;
      align-content: start;
      gap: 0 var(--fdic-spacing-sm, 12px);
      inline-size: 100%;
      block-size: 100%;
      box-sizing: border-box;
      position: relative;
      border: 1px solid var(--fdic-color-border-subtle, #dfe1e2);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-surface, #ffffff);
      color: inherit;
      padding-block: var(--fdic-spacing-sm, 12px);
      padding-inline: var(--fdic-spacing-md, 16px);
      box-shadow: var(--fdic-shadow-raised);
      text-align: start;
      cursor: pointer;
      transition:
        box-shadow 160ms ease,
        border-color 160ms ease,
        background-color 160ms ease;
    }

    /* Summaries (branches) keep a leading caret column; node-buttons (leaves)
       use a label/indicator two-column layout. Selectors are scoped to the
       immediate surface so that nested leaves inside a branch do not inherit
       the branch's three-column template via descendant matching. */
    [part~="summary"] {
      grid-template-columns: auto auto minmax(0, 1fr) auto;
    }

    [part~="node-button"]:not(:has(> [part~="avatar"])) {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    [part~="summary"]:not(:has(> [part~="avatar"])) {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    [part~="summary"]:hover,
    [part~="node-button"]:hover {
      border-color: var(--fdic-color-border-divider);
      box-shadow: var(--fdic-shadow-raised-hover);
    }

    [part~="summary"] {
      list-style: none;
    }

    [part~="summary"]::-webkit-details-marker {
      display: none;
    }

    [part~="node-button"] {
      appearance: none;
      font: inherit;
    }

    [part~="summary"]:focus-visible,
    [part~="node-button"]:focus-visible {
      outline-color: transparent;
      box-shadow:
        0 0 0 var(--fdic-focus-gap-width, 2px) var(--fdic-focus-gap-color),
        0 0 0 calc(var(--fdic-focus-gap-width, 2px) + var(--fdic-focus-ring-width, 4px))
          var(--fdic-focus-ring-color);
    }

    [data-current="true"] > [part~="summary"],
    [data-current="true"] > [part~="node-button"] {
      border-color: var(--fdic-color-bg-active);
      background: var(--fdic-color-bg-selected, var(--fdic-color-bg-surface));
    }

    [part~="caret"] {
      color: var(--fdic-color-text-secondary);
      transition: transform var(--fd-org-outline-transition-duration, 160ms) ease;
      align-self: start;
      margin-block-start: 2px;
      grid-row: 1 / span 2;
    }

    [part~="avatar"] {
      grid-column: 1;
      grid-row: 1 / span 2;
      align-self: center;
      --fd-visual-bg-avatar: var(--fdic-color-bg-subtle, #f6f7f9);
    }

    [part~="summary"] > [part~="avatar"] {
      grid-column: 2;
    }

    details[open] > [part~="summary"] [part~="caret"] {
      transform: rotate(90deg);
    }

    [part~="label"] {
      display: block;
      font-weight: var(--fdic-font-weight-semibold, 600);
      font-size: var(--fdic-font-size-body, 1.125rem);
      line-height: 1.3;
      overflow-wrap: anywhere;
      grid-column: 2;
    }

    [part~="node-button"]:not(:has(> [part~="avatar"])) > [part~="label"] {
      grid-column: 1;
    }

    [part~="summary"] > [part~="label"] {
      grid-column: 3;
    }

    [part~="summary"]:not(:has(> [part~="avatar"])) > [part~="label"] {
      grid-column: 2;
    }

    [part~="meta"] {
      display: block;
      color: var(--fdic-color-text-secondary, #565c65);
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: 1.35;
      margin-block-start: var(--fdic-spacing-3xs, 2px);
      overflow-wrap: anywhere;
      grid-column: 2;
    }

    [part~="node-button"]:not(:has(> [part~="avatar"])) > [part~="meta"] {
      grid-column: 1;
    }

    [part~="summary"] > [part~="meta"] {
      grid-column: 3;
    }

    [part~="summary"]:not(:has(> [part~="avatar"])) > [part~="meta"] {
      grid-column: 2;
    }

    [part~="indicator"] {
      grid-column: 3;
      grid-row: 1 / span 2;
      align-self: start;
      margin-block-start: 6px;
      inline-size: 8px;
      block-size: 8px;
      border-radius: 50%;
      background: var(--fdic-color-semantic-fg-warning, #b86b08);
      flex: none;
    }

    [part~="summary"] > [part~="indicator"] {
      grid-column: 4;
    }

    [part~="node-button"]:not(:has(> [part~="avatar"])) > [part~="indicator"] {
      grid-column: 2;
    }

    [part~="summary"]:not(:has(> [part~="avatar"])) > [part~="indicator"] {
      grid-column: 3;
    }

    [part~="indicator"][data-level="none"] {
      visibility: hidden;
    }

    [part~="sr-only"] {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }

    [part~="empty"] {
      margin: 0;
      padding: var(--fdic-spacing-lg, 24px);
      border: 1px dashed var(--fdic-color-border-divider, #c9c9c9);
      border-radius: var(--fdic-corner-radius-md, 6px);
      color: var(--fdic-color-text-secondary, #565c65);
      text-align: center;
    }

    mark {
      background: var(--fdic-color-semantic-bg-warning, #fff7d6);
      color: inherit;
      padding-inline: 0.1em;
      border-radius: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      [part~="summary"],
      [part~="node-button"],
      [part~="caret"] {
        transition: none;
      }
    }

    @media print {
      :host {
        font-size: var(--fdic-font-size-body-small, 1rem);
      }

      [part~="list"] {
        gap: 0;
      }

      /* Force a clean indented list on paper. The on-screen multi-column
         leaf grid produces awkwardly narrow text columns on a print page. */
      [part~="list"][data-kind-group="leaves"] {
        grid-template-columns: 1fr;
      }

      [part~="summary"],
      [part~="node-button"] {
        border: 0;
        border-block-end: 1px solid #999;
        border-radius: 0;
        box-shadow: none;
        break-inside: avoid;
        padding-block: var(--fdic-spacing-2xs, 4px);
      }

      [part~="indicator"] {
        display: none;
      }

      [part~="avatar"] {
        display: none;
      }

      [part~="caret"] {
        /* The disclosure caret is meaningless on paper — branches are always
           open in print. Hide it so labels align flush. */
        display: none;
      }

      details:not([open]) > [part~="list"] {
        display: grid;
      }
    }
  `;

  declare label: string;
  declare emptyLabel: string;
  declare noResultsLabel: string;
  declare tree?: FdOrgTree;
  declare currentNodeId?: string;
  declare searchQuery: string;
  declare filters: FdOrgFilterState;
  declare photoResolver?: FdOrgPhotoResolver;

  constructor() {
    super();
    this.label = "Organization outline";
    this.emptyLabel = "No organization records are available.";
    this.noResultsLabel = "No organization records match the current filters.";
    this.currentNodeId = undefined;
    this.searchQuery = "";
    this.filters = {};
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("beforeprint", this.openDisclosuresForPrint);
    window.addEventListener("afterprint", this.restoreDisclosuresAfterPrint);
  }

  disconnectedCallback() {
    window.removeEventListener("beforeprint", this.openDisclosuresForPrint);
    window.removeEventListener("afterprint", this.restoreDisclosuresAfterPrint);
    super.disconnectedCallback();
  }

  render() {
    if (!this.tree || this.tree.rootIds.length === 0) {
      return html`<p part="empty">${this.emptyLabel}</p>`;
    }

    const visibleIds = this.getVisibleIds();

    if (visibleIds.size === 0) {
      return html`<p part="empty">${this.noResultsLabel}</p>`;
    }

    return html`
      <nav part="outline" aria-label=${this.label}>
        ${this.renderList(this.tree.rootIds, 1, visibleIds)}
      </nav>
    `;
  }

  private renderList(
    ids: string[],
    depth: number,
    visibleIds: Set<string>,
  ): TemplateResult {
    const nodes = ids
      .map((id) => this.tree?.nodesById[id])
      .filter(
        (node): node is FdOrgNode => node !== undefined && visibleIds.has(node.id),
      );

    // Partition into branches (rendered as a single-column list) and leaves
    // (rendered as an auto-fit multi-column list). Source order is preserved
    // within each partition; vacancies sort to the bottom of the leaves
    // partition only.
    const branches: FdOrgNode[] = [];
    const leaves: FdOrgNode[] = [];
    for (const node of nodes) {
      if (this.hasVisibleChildren(node, visibleIds)) {
        branches.push(node);
      } else {
        leaves.push(node);
      }
    }
    const sortedLeaves = leaves
      .slice()
      .sort((left, right) => Number(isLowPriority(left)) - Number(isLowPriority(right)));

    return html`
      ${branches.length
        ? html`
            <ul part="list" data-depth=${depth} data-kind-group="branches">
              ${repeat(
                branches,
                (node) => node.id,
                (node) => this.renderNode(node, depth, visibleIds),
              )}
            </ul>
          `
        : nothing}
      ${sortedLeaves.length
        ? html`
            <ul part="list" data-depth=${depth} data-kind-group="leaves">
              ${repeat(
                sortedLeaves,
                (node) => node.id,
                (node) => this.renderNode(node, depth, visibleIds),
              )}
            </ul>
          `
        : nothing}
    `;
  }

  private hasVisibleChildren(node: FdOrgNode, visibleIds: Set<string>) {
    if (!this.tree) return false;
    return getOrgChildren(this.tree, node.id).some((child) => visibleIds.has(child.id));
  }

  private renderNode(
    node: FdOrgNode,
    depth: number,
    visibleIds: Set<string>,
  ) {
    const children = this.tree ? getOrgChildren(this.tree, node.id) : [];
    const visibleChildren = children.filter((child) => visibleIds.has(child.id));
    const current = node.id === this.currentNodeId;
    const open = this.shouldOpen(node);
    const hasChildren = visibleChildren.length > 0;
    const issueLevel = getOrgNodeIssueLevel(node);
    const issueSummary = getOrgNodeIssueSummary(node);
    const summaryId = issueSummary ? `${node.id}__issue` : undefined;
    const caret = hasChildren
      ? html`<fd-icon part="caret" name="caret-right"></fd-icon>`
      : nothing;
    const indicator = html`
      <span
        part="indicator"
        data-level=${issueLevel}
        aria-hidden="true"
      ></span>
      ${summaryId
        ? html`<span part="sr-only" id=${summaryId}>${issueSummary}</span>`
        : nothing}
    `;
    const body = html`
      ${caret}
      ${this.renderAvatar(node)}
      <span part="label">${this.renderHighlightedText(node.label)}</span>
      ${this.renderMeta(node)}
      ${indicator}
    `;

    return html`
      <li
        part="item"
        data-kind=${hasChildren ? "branch" : "leaf"}
        data-current=${String(current)}
        data-issue-level=${issueLevel}
      >
        ${hasChildren
          ? html`
              <details part="disclosure" ?open=${open}>
                <summary
                  part="summary"
                  aria-current=${current ? "true" : nothing}
                  aria-describedby=${summaryId ?? nothing}
                  @click=${() => this.selectNode(node)}
                >
                  ${body}
                </summary>
                ${this.renderList(visibleChildren.map((child) => child.id), depth + 1, visibleIds)}
              </details>
            `
          : html`
              <button
                part="node-button"
                type="button"
                aria-current=${current ? "true" : nothing}
                aria-describedby=${summaryId ?? nothing}
                @click=${() => this.selectNode(node)}
              >
                ${body}
              </button>
            `}
      </li>
    `;
  }

  private renderMeta(node: FdOrgNode) {
    // For person nodes the label IS the person's display name, so dropping
    // any meta entry that equals the label avoids "Director · Morgan Lee"
    // appearing under a tile already labeled "Morgan Lee".
    const meta = [
      node.title,
      node.description,
      node.person?.displayName,
      node.person?.name,
    ]
      .filter(
        (field): field is string => Boolean(field) && field !== node.label,
      )
      .join(" · ");

    return meta ? html`<span part="meta">${this.renderHighlightedText(meta)}</span>` : nothing;
  }

  private renderAvatar(node: FdOrgNode) {
    const src = this.resolvePhotoUrl(node);
    if (!src) return nothing;

    return html`
      <fd-visual part="avatar" type="avatar" size="lg">
        <img alt="" src=${src} />
      </fd-visual>
    `;
  }

  private resolvePhotoUrl(node: FdOrgNode) {
    if (node.nodeType !== "person") return undefined;

    const resolved = this.photoResolver?.(node);
    if (resolved) return resolved;

    const ref = node.person?.photoRef;
    return ref && /^(https?:|data:|\/)/.test(ref) ? ref : undefined;
  }

  private renderHighlightedText(value: string) {
    const query = this.searchQuery.trim();
    if (!query) return value;

    const lowerValue = value.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts: Array<string | TemplateResult> = [];
    let cursor = 0;
    let index = lowerValue.indexOf(lowerQuery);

    while (index >= 0) {
      if (index > cursor) parts.push(value.slice(cursor, index));
      parts.push(html`<mark>${value.slice(index, index + query.length)}</mark>`);
      cursor = index + query.length;
      index = lowerValue.indexOf(lowerQuery, cursor);
    }

    if (cursor < value.length) parts.push(value.slice(cursor));

    return parts.length ? parts : value;
  }

  private printOpenedDisclosures: HTMLDetailsElement[] = [];

  private openDisclosuresForPrint = () => {
    this.printOpenedDisclosures = Array.from(
      this.renderRoot.querySelectorAll<HTMLDetailsElement>("details:not([open])"),
    );

    for (const details of this.printOpenedDisclosures) {
      details.open = true;
    }
  };

  private restoreDisclosuresAfterPrint = () => {
    for (const details of this.printOpenedDisclosures) {
      details.open = false;
    }

    this.printOpenedDisclosures = [];
  };

  private shouldOpen(node: FdOrgNode) {
    if (this.searchQuery.trim()) return true;
    if (!this.tree || !this.currentNodeId) return true;

    return getOrgAncestors(this.tree, this.currentNodeId).some(
      (ancestor) => ancestor.id === node.id,
    );
  }

  private getVisibleIds() {
    const visibleIds = new Set<string>();

    if (!this.tree) return visibleIds;

    const query = this.searchQuery.trim();
    const matchedIds = new Set(
      searchOrgTree(this.tree, query, this.filters).map((result) => result.node.id),
    );

    for (const node of Object.values(this.tree.nodesById)) {
      const matchesQuery = !query || matchedIds.has(node.id);
      const matchesFilters = orgNodeMatchesFilters(node, this.filters);
      if (matchesQuery && matchesFilters) {
        visibleIds.add(node.id);
        for (const ancestor of getOrgAncestors(this.tree, node.id)) {
          visibleIds.add(ancestor.id);
        }
      }
    }

    return visibleIds;
  }

  private selectNode(node: FdOrgNode) {
    this.currentNodeId = node.id;
    this.dispatchEvent(
      new CustomEvent<FdOrgSelectDetail>("fd-org-select", {
        detail: { nodeId: node.id, node },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
