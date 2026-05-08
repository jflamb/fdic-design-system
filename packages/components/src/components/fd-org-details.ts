import { LitElement, css, html, nothing } from "lit";
import type { FdOrgNode, FdOrgTree } from "./org-chart-types.js";
import {
  FD_ORG_NODE_TYPE_LABELS,
  FD_ORG_SOURCE_STATUS_ICONS,
  FD_ORG_SOURCE_STATUS_LABELS,
  FD_ORG_SOURCE_STATUS_TONES,
  getOrgAncestors,
  getOrgChildren,
} from "./org-chart-types.js";

/**
 * `fd-org-details` — Details panel for the selected org node.
 *
 * @slot actions - Optional downstream actions for the selected node.
 *
 * @csspart panel - Details panel wrapper.
 * @csspart live - Visually hidden polite live region announcing the selected record.
 * @csspart eyebrow - Node type/source summary.
 * @csspart heading - Selected node heading.
 * @csspart status - Status badge row.
 * @csspart badge - Individual text-plus-icon status badge.
 * @csspart section - Details section.
 * @csspart conflict - Conflict comparison block.
 * @csspart actions - Optional actions slot wrapper.
 */
export class FdOrgDetails extends LitElement {
  static properties = {
    tree: { attribute: false },
    nodeId: { attribute: "node-id", reflect: true },
    emptyLabel: { attribute: "empty-label", reflect: true },
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

    [part="panel"] {
      display: grid;
      gap: var(--fdic-spacing-md, 16px);
      padding: var(--fdic-spacing-lg, 24px);
      border: 1px solid var(--fdic-color-border-subtle, #c9c9c9);
      border-radius: var(--fdic-corner-radius-lg, 7px);
      background: var(--fdic-color-bg-surface, #ffffff);
      box-shadow: var(--fdic-shadow-raised);
      position: relative;
    }

    [part="live"] {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }

    [part="header"] {
      display: grid;
      gap: var(--fdic-spacing-3xs, 2px);
    }

    [part="eyebrow"] {
      margin: 0;
      color: var(--fdic-color-text-secondary, #565c65);
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
      font-weight: var(--fdic-font-weight-semibold, 600);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    [part="heading"] {
      margin: 0;
      font-size: var(--fdic-font-size-h3, 1.40625rem);
      line-height: var(--fdic-line-height-h3, 1.2);
      font-weight: var(--fdic-font-weight-bold, 700);
      overflow-wrap: anywhere;
      text-wrap: balance;
    }

    [part="subtitle"] {
      margin: 0;
      color: var(--fdic-color-text-secondary, #565c65);
      font-size: var(--fdic-font-size-body, 1rem);
    }

    [part="status"] {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fdic-spacing-2xs, 4px);
    }

    [part="actions"] {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fdic-spacing-xs, 8px);
      padding-block-start: var(--fdic-spacing-xs, 8px);
      border-block-start: 1px solid var(--fdic-color-border-subtle);
    }

    [part="actions"]:empty,
    [part="actions"]:not(:has(*)) {
      display: none;
    }

    [part="section"] {
      display: grid;
      gap: var(--fdic-spacing-xs, 8px);
      padding: var(--fdic-spacing-sm, 12px) 0 0;
      border-block-start: 1px solid var(--fdic-color-border-subtle);
    }

    [part="section"] h3 {
      margin: 0;
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
      font-weight: var(--fdic-font-weight-semibold, 600);
      color: var(--fdic-color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    dl {
      display: grid;
      grid-template-columns: minmax(8rem, max-content) minmax(0, 1fr);
      gap: var(--fdic-spacing-2xs, 4px) var(--fdic-spacing-md, 16px);
      margin: 0;
    }

    dt {
      font-weight: var(--fdic-font-weight-semibold, 600);
      color: var(--fdic-color-text-secondary);
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }

    [part="conflict"] {
      display: grid;
      gap: var(--fdic-spacing-xs, 8px);
      padding: var(--fdic-spacing-md, 16px);
      border: 1px solid var(--fdic-color-semantic-border-error, #b50909);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-semantic-bg-error, #fdedea);
    }

    [part="conflict"] h3 {
      color: var(--fdic-color-semantic-fg-error, inherit);
      text-transform: none;
      letter-spacing: 0;
      font-size: var(--fdic-font-size-body, 1rem);
    }

    @media (max-width: 48rem) {
      dl {
        grid-template-columns: 1fr;
      }
      dd {
        margin-block-end: var(--fdic-spacing-2xs, 4px);
      }
    }

    /* The details panel is workflow chrome, not part of the printable
       hierarchy. Hide on print so any pattern that mounts it inline does not
       end up printing both the chart and the panel. */
    @media print {
      :host {
        display: none;
      }
    }
  `;

  declare tree?: FdOrgTree;
  declare nodeId?: string;
  declare emptyLabel: string;

  constructor() {
    super();
    this.emptyLabel = "Select an organization record to review details.";
  }

  render() {
    const node = this.nodeId && this.tree ? this.tree.nodesById[this.nodeId] : undefined;

    if (!node) {
      return html`
        <section part="panel" aria-label="Organization details">
          <span part="live" aria-live="polite">${this.emptyLabel}</span>
          <p part="subtitle">${this.emptyLabel}</p>
        </section>
      `;
    }

    const ancestors = this.tree ? getOrgAncestors(this.tree, node.id) : [];
    const children = this.tree ? getOrgChildren(this.tree, node.id) : [];

    return html`
      <section part="panel" aria-label="Organization details">
        <span part="live" aria-live="polite">${node.label} details loaded.</span>
        <header part="header">
          <p part="eyebrow">
            ${FD_ORG_NODE_TYPE_LABELS[node.nodeType]} · ${FD_ORG_SOURCE_STATUS_LABELS[node.sourceStatus]}
          </p>
          <h2 part="heading">${node.label}</h2>
          ${node.title ? html`<p part="subtitle">${node.title}</p>` : nothing}
        </header>
        <div part="status">${this.renderStatus(node)}</div>
        <section part="section">
          <h3>Reporting context</h3>
          <dl>
            <dt>Reports to</dt>
            <dd>${ancestors.at(-1)?.label ?? "Top level"}</dd>
            <dt>Direct reports</dt>
            <dd>${children.length}</dd>
            <dt>Path</dt>
            <dd>${ancestors.map((ancestor) => ancestor.label).concat(node.label).join(" / ")}</dd>
          </dl>
        </section>
        ${this.renderSource(node)}
        ${node.actingMeta
          ? html`
              <section part="section">
                <h3>Acting assignment</h3>
                <dl>
                  <dt>Effective</dt>
                  <dd>${this.formatEffectiveRange(node.actingMeta.effectiveStart, node.actingMeta.effectiveEnd) ?? "Not provided"}</dd>
                  <dt>Source</dt>
                  <dd>${node.actingMeta.sourceLabel ?? "Not provided"}</dd>
                </dl>
              </section>
            `
          : nothing}
        ${node.overrideMeta
          ? html`
              <section part="section">
                <h3>Editorial override</h3>
                <dl>
                  <dt>Label</dt>
                  <dd>${node.overrideMeta.label ?? "Override"}</dd>
                  <dt>Updated</dt>
                  <dd>${node.overrideMeta.updatedAt ?? "Not provided"}</dd>
                  <dt>Reason</dt>
                  <dd>${node.overrideMeta.reason ?? "Not provided"}</dd>
                </dl>
              </section>
            `
          : nothing}
        ${node.conflictMeta?.length ? this.renderConflicts(node) : nothing}
        <div part="actions"><slot name="actions"></slot></div>
      </section>
    `;
  }

  /**
   * Source provenance: who supplied the data, when it was last verified, and
   * the period it was effective for. Surfacing `fetchedAt` is the requirements
   * "data-source confidence" hook; surfacing `effectiveStart`/`effectiveEnd`
   * as a range covers the historical/effective-dated state explicitly. Empty
   * rows are skipped, and the section is omitted entirely if no provenance
   * data is available.
   */
  private renderSource(node: FdOrgNode) {
    const provider =
      node.sourceMeta?.label ??
      node.sourceMeta?.source ??
      this.tree?.source?.label ??
      this.tree?.source?.source ??
      null;
    const lastVerified = node.sourceMeta?.fetchedAt ?? this.tree?.source?.fetchedAt ?? null;
    const effective = this.formatEffectiveRange(
      node.effectiveStart ?? node.sourceMeta?.effectiveAt,
      node.effectiveEnd,
    );

    if (!provider && !lastVerified && !effective) return nothing;

    return html`
      <section part="section">
        <h3>Source</h3>
        <dl>
          ${provider
            ? html`<dt>Provider</dt><dd>${provider}</dd>`
            : nothing}
          ${lastVerified
            ? html`<dt>Last verified</dt><dd>${lastVerified}</dd>`
            : nothing}
          ${effective
            ? html`<dt>Effective</dt><dd>${effective}</dd>`
            : nothing}
        </dl>
      </section>
    `;
  }

  /**
   * Format an effective-dated range as a single string. Returns `null` when
   * neither date is present so callers can omit the row entirely.
   */
  private formatEffectiveRange(
    start: string | undefined,
    end: string | undefined,
  ): string | null {
    if (start && end) return `${start} to ${end}`;
    if (start) return `${start} onward`;
    if (end) return `Until ${end}`;
    return null;
  }

  private renderStatus(node: FdOrgNode) {
    // The "Editorial override" label is self-explanatory; the file-text icon
    // doesn't add semantic value next to it. Skip the icon for override and
    // keep it for the other statuses where the glyph reinforces the label.
    const showStatusIcon = node.sourceStatus !== "override";
    return html`
      <fd-badge part="badge" type=${FD_ORG_SOURCE_STATUS_TONES[node.sourceStatus]}>
        ${showStatusIcon
          ? html`<fd-icon name=${FD_ORG_SOURCE_STATUS_ICONS[node.sourceStatus]} aria-hidden="true"></fd-icon>`
          : nothing}
        <span>${FD_ORG_SOURCE_STATUS_LABELS[node.sourceStatus]}</span>
      </fd-badge>
      ${node.actingMeta
        ? html`
            <fd-badge part="badge" type="warm">
              <fd-icon name="info" aria-hidden="true"></fd-icon>
              <span>Acting</span>
            </fd-badge>
          `
        : nothing}
      ${node.nodeType === "vacancy"
        ? html`
            <fd-badge part="badge" type="neutral">
              <fd-icon name="minus-square" aria-hidden="true"></fd-icon>
              <span>Vacancy</span>
            </fd-badge>
          `
        : nothing}
    `;
  }

  private renderConflicts(node: FdOrgNode) {
    return html`
      <section part="conflict">
        <h3>Conflict comparison</h3>
        ${node.conflictMeta?.map(
          (conflict) => html`
            <dl>
              <dt>Field</dt>
              <dd>${conflict.field}</dd>
              <dt>${conflict.sourceLabel ?? "Source of truth"}</dt>
              <dd>${conflict.sourceValue ?? "Not provided"}</dd>
              <dt>${conflict.overrideLabel ?? "Override"}</dt>
              <dd>${conflict.overrideValue ?? "Not provided"}</dd>
            </dl>
          `,
        )}
      </section>
    `;
  }
}
