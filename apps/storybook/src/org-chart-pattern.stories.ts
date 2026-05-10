import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { LitElement, css, html, nothing } from "lit";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import { FdOrgPrintChart } from "../../../packages/components/src/components/org-chart/internal/fd-org-print-chart";
import { normalizeOrgTree } from "../../../packages/components/src/components/org-chart-normalize";
import {
  searchOrgTree,
  type FdOrgFilterState,
  type FdOrgNodeType,
  type FdOrgPhotoResolver,
  type FdOrgSourceStatus,
  type FdOrgTree,
} from "../../../packages/components/src/components/org-chart-types";
import { malformedOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.malformed";
import { statesOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.states";

const NODE_TYPES: Array<[FdOrgNodeType, string]> = [
  ["unit", "Unit"],
  ["position", "Position"],
  ["person", "Person"],
  ["vacancy", "Vacancy"],
];

const SOURCE_STATUSES: Array<[FdOrgSourceStatus, string]> = [
  ["official", "Official"],
  ["override", "Editorial override"],
  ["draft", "Draft/proposed"],
  ["historical", "Historical/effective-dated"],
];

/**
 * Internal shell for the composed org chart pattern. Owns the search/filter/
 * selection state for the three-column layout demonstrated in this story.
 * Not a public component — lives next to the pattern story so layout decisions
 * can iterate without re-shaping the package surface.
 */
class FdOrgPatternShell extends LitElement {
  static properties = {
    tree: { attribute: false },
    selectedNodeId: { attribute: "selected-node-id", reflect: true },
    initialFilters: { attribute: false },
    searchQuery: { state: true },
    filters: { state: true },
    photoResolver: { attribute: false },
    layoutMode: { state: true },
    filtersOpen: { state: true },
    detailsOpen: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--fdic-color-text-primary);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--fdic-font-size-body, 1.125rem);
      container-type: inline-size;
      container-name: org-shell;
    }

    .shell {
      display: grid;
      gap: var(--fdic-spacing-lg, 24px);
      grid-template-columns: 16rem minmax(0, 1fr) 24rem;
      align-items: start;
      max-inline-size: 90rem;
      margin-inline: auto;
    }

    .filters-toggle-wrap,
    .details-toggle-wrap {
      display: none;
    }

    @container org-shell (max-width: 1280px) {
      .shell {
        grid-template-columns: minmax(0, 1fr) 24rem;
      }

      .filters-panel {
        display: none;
      }

      .filters-toggle-wrap {
        display: inline-flex;
      }
    }

    @container org-shell (max-width: 960px) {
      .shell {
        grid-template-columns: minmax(0, 1fr);
      }

      .details-panel {
        display: none;
      }

      .details-toggle-wrap {
        display: inline-flex;
      }
    }

    .filters-panel,
    .details-panel {
      align-self: start;
      position: sticky;
      inset-block-start: var(--fdic-spacing-md, 16px);
      max-block-size: calc(100vh - var(--fdic-spacing-lg, 24px));
      overflow: auto;
    }

    .center {
      min-inline-size: 0;
      display: grid;
      gap: var(--fdic-spacing-md, 16px);
    }

    .header {
      display: grid;
      gap: var(--fdic-spacing-sm, 12px) var(--fdic-spacing-md, 16px);
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
    }

    .header-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fdic-spacing-xs, 8px);
      justify-content: flex-end;
    }

    .search {
      min-inline-size: 0;
    }

    .search-label {
      display: block;
      margin-block-end: var(--fdic-spacing-2xs, 4px);
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
      font-weight: var(--fdic-font-weight-semibold, 600);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--fdic-color-text-secondary);
    }

    .search-control {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-control fd-icon {
      position: absolute;
      inset-inline-start: var(--fdic-spacing-sm, 12px);
      color: var(--fdic-color-icon-secondary, var(--fdic-color-text-secondary));
      pointer-events: none;
      --fd-icon-size: 18px;
    }

    input[type="search"] {
      inline-size: 100%;
      min-block-size: 2.75rem;
      box-sizing: border-box;
      border: 1px solid var(--fdic-color-border-input, #767676);
      border-radius: var(--fdic-corner-radius-sm, 4px);
      padding-inline: calc(var(--fdic-spacing-sm, 12px) * 2 + 18px) var(--fdic-spacing-sm, 12px);
      font: inherit;
      color: inherit;
      background: var(--fdic-color-bg-input, var(--fdic-color-bg-surface));
    }

    input[type="search"]:focus-visible {
      outline-color: transparent;
      border-color: var(--fdic-color-border-input-focus, var(--fdic-focus-ring-color));
      box-shadow:
        0 0 0 var(--fdic-focus-gap-width, 2px) var(--fdic-focus-gap-color),
        0 0 0 calc(var(--fdic-focus-gap-width, 2px) + var(--fdic-focus-ring-width, 4px))
          var(--fdic-focus-ring-color);
    }

    .filters-card {
      display: grid;
      gap: var(--fdic-spacing-md, 16px);
      padding: var(--fdic-spacing-md, 16px);
      border: 1px solid var(--fdic-color-border-subtle);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-surface);
      box-shadow: var(--fdic-shadow-raised);
    }

    fieldset {
      display: grid;
      gap: var(--fdic-spacing-2xs, 4px);
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      padding: 0;
      margin-block-end: var(--fdic-spacing-2xs, 4px);
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
      font-weight: var(--fdic-font-weight-semibold, 600);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--fdic-color-text-secondary);
    }

    .option {
      display: inline-flex;
      align-items: center;
      gap: var(--fdic-spacing-2xs, 4px);
      min-block-size: 2rem;
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    .option input[type="checkbox"] {
      accent-color: var(--fdic-color-bg-active);
      inline-size: 1rem;
      block-size: 1rem;
    }

    .reset {
      justify-self: start;
      background: transparent;
      border: 0;
      padding: 0;
      color: var(--fdic-color-text-link, var(--fdic-color-link-default));
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
    }

    .reset:disabled {
      color: var(--fdic-color-text-disabled);
      cursor: not-allowed;
      text-decoration: none;
    }

    dialog.drawer {
      margin: 0;
      padding: 0;
      max-inline-size: min(20rem, 100vw);
      inline-size: min(20rem, 100vw);
      max-block-size: 100vh;
      block-size: 100vh;
      border: 0;
      border-inline-end: 1px solid var(--fdic-color-border-subtle);
      box-shadow: var(--fdic-shadow-panel, var(--fdic-shadow-raised));
      background: var(--fdic-color-bg-surface);
      color: inherit;
    }

    dialog.drawer[open] {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    dialog.drawer.start {
      inset-inline-start: 0;
      inset-inline-end: auto;
    }

    dialog.drawer.end {
      inset-inline-end: 0;
      inset-inline-start: auto;
      border-inline-end: 0;
      border-inline-start: 1px solid var(--fdic-color-border-subtle);
    }

    /*
     * Backdrop sits at very low opacity. Filters apply live, so the underlying
     * outline must remain readable while the drawer is open — otherwise users
     * cannot see the effect of toggling a filter. The dialog stays modal so
     * focus trap and Escape handling are still owned by the platform.
     */
    dialog.drawer::backdrop {
      background: var(--fdic-color-overlay-scrim-soft, rgba(0, 0, 0, 0.08));
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--fdic-spacing-md, 16px);
      border-block-end: 1px solid var(--fdic-color-border-subtle);
    }

    .drawer-footer {
      display: grid;
      gap: var(--fdic-spacing-2xs, 4px);
      padding: var(--fdic-spacing-md, 16px);
      border-block-start: 1px solid var(--fdic-color-border-subtle);
      background: var(--fdic-color-bg-surface);
    }

    .drawer-footer p {
      margin: 0;
      color: var(--fdic-color-text-secondary);
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
    }

    .drawer-header h2 {
      margin: 0;
      font-size: var(--fdic-font-size-h5, 0.984375rem);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--fdic-color-text-secondary);
    }

    .drawer-body {
      padding: var(--fdic-spacing-md, 16px);
      overflow: auto;
    }

    @media (prefers-reduced-motion: reduce) {
      dialog.drawer {
        transition: none;
      }
    }

    /* The print-only document header sits above the outline when printing. */
    .print-header {
      display: none;
    }

    /*
     * Print stylesheet for the composed pattern. Strips the toolbar, filter
     * rail, details panel, drawers, and pattern-story diagnostics so the
     * printout is just the hierarchy with a one-time document header. The
     * outline component owns its own print rules (force-expand disclosures,
     * flatten tile chrome, single-column leaf groups).
     */
    @media print {
      :host {
        display: block;
      }

      .print-header {
        display: block;
        margin-block-end: var(--fdic-spacing-lg, 24px);
        padding-block-end: var(--fdic-spacing-md, 16px);
        border-block-end: 1px solid #999;
      }

      .print-header h1 {
        margin: 0;
        font-size: var(--fdic-font-size-h3, 1.40625rem);
        font-weight: var(--fdic-font-weight-bold, 700);
      }

      .print-header__subtitle {
        margin: 0;
      }

      .print-header__meta {
        margin: var(--fdic-spacing-2xs, 4px) 0 0;
        font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
        color: #555;
      }

      .shell {
        display: block;
        max-inline-size: none;
        margin: 0;
      }

      .filters-panel,
      .details-panel,
      .header,
      dialog.drawer {
        display: none !important;
      }

      .center {
        display: block;
        gap: 0;
      }
    }
  `;

  declare tree?: FdOrgTree;
  declare selectedNodeId?: string;
  declare initialFilters?: FdOrgFilterState;
  declare searchQuery: string;
  declare filters: FdOrgFilterState;
  declare photoResolver?: FdOrgPhotoResolver;
  declare filtersOpen: boolean;
  declare detailsOpen: boolean;

  constructor() {
    super();
    this.searchQuery = "";
    this.filters = {};
    this.filtersOpen = false;
    this.detailsOpen = false;
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("initialFilters") && this.initialFilters) {
      this.filters = { ...this.initialFilters };
    }
  }

  render() {
    return html`
      ${this.renderPrintHeader()}
      <div class="shell">
        <div class="filters-panel" aria-label="Filters">${this.renderFilterCard()}</div>
        <section class="center" aria-label="Hierarchy">
          <header class="header">
            <div class="search">
              <label class="search-label" for="org-shell-search">Search organization</label>
              <div class="search-control">
                <fd-icon name="magnifying-glass" aria-hidden="true"></fd-icon>
                <input
                  id="org-shell-search"
                  type="search"
                  placeholder="Search by label, title, or person"
                  .value=${this.searchQuery}
                  @input=${this.onSearchInput}
                />
              </div>
            </div>
            <div class="header-actions">
              <span class="filters-toggle-wrap">
                <fd-button
                  variant="outline"
                  type="button"
                  @click=${this.openFiltersDrawer}
                >
                  <fd-icon slot="icon-start" name="funnel" aria-hidden="true"></fd-icon>
                  Filters
                </fd-button>
              </span>
              <span class="details-toggle-wrap">
                <fd-button
                  variant="outline"
                  type="button"
                  @click=${this.openDetailsDrawer}
                  ?disabled=${!this.selectedNodeId}
                >
                  Details
                </fd-button>
              </span>
            </div>
          </header>
          <fd-org-outline
            .tree=${this.tree}
            current-node-id=${this.selectedNodeId ?? ""}
            search-query=${this.searchQuery}
            .filters=${this.filters}
            .photoResolver=${this.photoResolver}
            @fd-org-select=${this.onSelect}
          ></fd-org-outline>
        </section>
        <div class="details-panel" aria-label="Selected record">
          <fd-org-details
            .tree=${this.tree}
            node-id=${this.selectedNodeId ?? ""}
            .photoResolver=${this.photoResolver}
          >
            <fd-button slot="actions" variant="outline" type="button">Open source record</fd-button>
          </fd-org-details>
        </div>
      </div>

      <dialog class="drawer start" @close=${() => (this.filtersOpen = false)}>
        ${this.filtersOpen
          ? html`
              <div class="drawer-header">
                <h2>Filters</h2>
                <fd-button variant="subtle" type="button" @click=${this.closeFiltersDrawer}>
                  Close
                </fd-button>
              </div>
              <div class="drawer-body">${this.renderFilterCard()}</div>
              <div class="drawer-footer">
                <p aria-live="polite">${this.renderVisibleCount()}</p>
                <fd-button variant="primary" type="button" @click=${this.closeFiltersDrawer}>
                  View results
                </fd-button>
              </div>
            `
          : nothing}
      </dialog>

      <dialog class="drawer end" @close=${() => (this.detailsOpen = false)}>
        ${this.detailsOpen
          ? html`
              <div class="drawer-header">
                <h2>Details</h2>
                <fd-button variant="subtle" type="button" @click=${this.closeDetailsDrawer}>
                  Close
                </fd-button>
              </div>
              <div class="drawer-body">
                <fd-org-details
                  .tree=${this.tree}
                  node-id=${this.selectedNodeId ?? ""}
                  .photoResolver=${this.photoResolver}
                ></fd-org-details>
              </div>
            `
          : nothing}
      </dialog>
    `;
  }

  private renderFilterCard() {
    const hasActive =
      (this.filters.nodeTypes?.length ?? 0) > 0 ||
      (this.filters.sourceStatuses?.length ?? 0) > 0 ||
      this.filters.actingOnly === true ||
      this.searchQuery.trim().length > 0;

    return html`
      <div class="filters-card">
        <fieldset>
          <legend>Node type</legend>
          ${NODE_TYPES.map(([value, label]) => this.renderCheckbox("node-type", value, label))}
        </fieldset>
        <fieldset>
          <legend>Source / status</legend>
          ${SOURCE_STATUSES.map(([value, label]) =>
            this.renderCheckbox("source-status", value, label),
          )}
        </fieldset>
        <fieldset>
          <legend>Acting / detail assignment</legend>
          <label class="option">
            <input
              type="checkbox"
              name="acting"
              .checked=${this.filters.actingOnly === true}
              @change=${this.onFilterChange}
            />
            Acting assignment
          </label>
        </fieldset>
        <button
          class="reset"
          type="button"
          ?disabled=${!hasActive}
          @click=${this.resetFilters}
        >
          Reset filters
        </button>
      </div>
    `;
  }

  private renderCheckbox(group: string, value: string, label: string) {
    const checked =
      group === "node-type"
        ? this.filters.nodeTypes?.includes(value as FdOrgNodeType) === true
        : this.filters.sourceStatuses?.includes(value as FdOrgSourceStatus) === true;

    return html`
      <label class="option">
        <input
          type="checkbox"
          name=${group}
          value=${value}
          .checked=${checked}
          @change=${this.onFilterChange}
        />
        ${label}
      </label>
    `;
  }

  /**
   * Live "showing N of M records" line for the filter drawer footer. Computed
   * from the same search/filter logic the outline uses, so it stays accurate
   * during the same update cycle without reading rendered DOM.
   */
  private renderVisibleCount() {
    if (!this.tree) return "No records loaded.";
    const total = Object.keys(this.tree.nodesById).length;
    const matches = searchOrgTree(this.tree, this.searchQuery, this.filters).length;
    return matches === total
      ? `Showing all ${total} records.`
      : `Showing ${matches} of ${total} records.`;
  }

  private onSearchInput(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  /**
   * The rail and the drawer can both render filter cards at the same time
   * (the rail is `display:none` at narrow viewports but stays in the DOM).
   * Reading all checkboxes would double-count, so mutate the filter state
   * from the changed input only and let Lit re-bind .checked on every render.
   */
  private onFilterChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const next: FdOrgFilterState = {
      nodeTypes: [...(this.filters.nodeTypes ?? [])],
      sourceStatuses: [...(this.filters.sourceStatuses ?? [])],
      actingOnly: this.filters.actingOnly === true,
    };

    if (input.name === "node-type") {
      const value = input.value as FdOrgNodeType;
      next.nodeTypes = input.checked
        ? Array.from(new Set([...(next.nodeTypes ?? []), value]))
        : (next.nodeTypes ?? []).filter((v) => v !== value);
    } else if (input.name === "source-status") {
      const value = input.value as FdOrgSourceStatus;
      next.sourceStatuses = input.checked
        ? Array.from(new Set([...(next.sourceStatuses ?? []), value]))
        : (next.sourceStatuses ?? []).filter((v) => v !== value);
    } else if (input.name === "acting") {
      next.actingOnly = input.checked;
    }

    this.filters = next;
  }

  private resetFilters() {
    this.filters = {};
    this.searchQuery = "";
  }

  private onSelect(event: CustomEvent<{ nodeId: string }>) {
    this.selectedNodeId = event.detail.nodeId;
  }

  private openFiltersDrawer() {
    this.filtersOpen = true;
    this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.drawer.start");
      dialog?.showModal();
    });
  }

  private closeFiltersDrawer() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.drawer.start");
    dialog?.close();
  }

  private openDetailsDrawer() {
    if (!this.selectedNodeId) return;
    this.detailsOpen = true;
    this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.drawer.end");
      dialog?.showModal();
    });
  }

  private closeDetailsDrawer() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.drawer.end");
    dialog?.close();
  }

  private renderPrintHeader() {
    const root = this.tree
      ? this.tree.nodesById[this.tree.rootIds[0] ?? ""]
      : undefined;
    const provider = this.tree?.source?.label ?? this.tree?.source?.source ?? null;
    const lastVerified = this.tree?.source?.fetchedAt ?? null;
    const printedOn = new Date().toISOString().slice(0, 10);

    return html`
      <header class="print-header" aria-hidden="true">
        ${root ? html`<h1>${root.label}</h1>` : nothing}
        ${root?.title ? html`<p class="print-header__subtitle">${root.title}</p>` : nothing}
        <p class="print-header__meta">
          ${provider ? html`Source: ${provider}` : nothing}
          ${lastVerified ? html` · last verified ${lastVerified}` : nothing}
          · printed ${printedOn}
        </p>
      </header>
    `;
  }
}

const SHELL_TAG = "fd-internal-org-pattern-shell";
if (!customElements.get(SHELL_TAG)) {
  customElements.define(SHELL_TAG, FdOrgPatternShell);
}

const PRINT_CHART_TAG = "fd-internal-org-print-chart";
if (!customElements.get(PRINT_CHART_TAG)) {
  customElements.define(PRINT_CHART_TAG, FdOrgPrintChart);
}

const mixed = normalizeOrgTree({
  nodes: statesOrgFixture,
  source: {
    source: "fixture",
    label: "Editor review fixture",
    fetchedAt: "2026-05-08",
  },
});
const malformed = normalizeOrgTree(malformedOrgFixture);
const selectedNodeId = "branch-chief";
const printSelectedNodeId = "avery-chen";
const SAMPLE_AVATAR_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <rect width="72" height="72" fill="#d6e8f5" />
    <circle cx="36" cy="25" r="13" fill="#235c86" />
    <path d="M14 72C17 54 25 45 36 45C47 45 55 54 58 72Z" fill="#235c86" />
  </svg>
`);
const SAMPLE_AVATAR_SRC = `data:image/svg+xml;charset=utf-8,${SAMPLE_AVATAR_SVG}`;
const resolveStoryAvatar: FdOrgPhotoResolver = () => SAMPLE_AVATAR_SRC;

const renderEditorReview = () => html`
  <style>
    .org-pattern {
      display: grid;
      gap: var(--fdic-spacing-lg, 24px);
    }

    .org-pattern__diagnostics {
      border: 1px solid var(--fdic-color-border-subtle);
      border-radius: var(--fdic-corner-radius-md, 6px);
      padding: var(--fdic-spacing-md, 16px);
      background: var(--fdic-color-bg-surface);
    }

    .org-pattern__diagnostics h3 {
      margin-block: 0 var(--fdic-spacing-xs, 8px);
      font-size: var(--fdic-font-size-h5, 0.984375rem);
    }

    .org-pattern__diagnostics ul {
      margin-block: 0;
      padding-inline-start: 1.25rem;
    }

    @media print {
      .org-pattern__diagnostics {
        display: none;
      }

      @page {
        margin: 0.5in;
      }
    }
  </style>
  <section class="org-pattern" aria-label="Dynamic org chart editor review">
    <fd-internal-org-pattern-shell
      .tree=${mixed.tree}
      selected-node-id=${selectedNodeId}
      .initialFilters=${{
        sourceStatuses: ["override", "draft", "historical"],
      }}
      .photoResolver=${resolveStoryAvatar}
    ></fd-internal-org-pattern-shell>
    <section class="org-pattern__diagnostics" aria-labelledby="diagnostics-heading">
      <h3 id="diagnostics-heading">Diagnostics from malformed fixture</h3>
      <ul>
        ${malformed.diagnostics.map(
          (diagnostic) => html`<li>${diagnostic.type}: ${diagnostic.message}</li>`,
        )}
      </ul>
    </section>
  </section>
`;

const renderPrintableVisualPrototype = () => html`
  <style>
    .print-prototype {
      display: grid;
      gap: var(--fdic-spacing-xl, 32px);
    }

    .print-prototype__section {
      display: grid;
      gap: var(--fdic-spacing-md, 16px);
    }

    .print-prototype__section h3 {
      margin: 0;
      font-size: var(--fdic-font-size-h4, 1.125rem);
    }

    .print-prototype__note {
      margin: 0;
      color: var(--fdic-color-text-secondary);
      font-size: var(--fdic-font-size-body-small, 1rem);
      max-inline-size: 72ch;
    }

    .print-prototype__preview {
      padding: var(--fdic-spacing-lg, 24px);
      border: 1px solid var(--fdic-color-border-subtle);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-subtle);
    }

    .print-only {
      display: none;
    }

    @media print {
      @page {
        size: landscape;
        margin: 0.45in;
      }

      .screen-only,
      .print-prototype__preview {
        display: none !important;
      }

      .print-only {
        display: block;
      }
    }
  </style>
  <section class="print-prototype" aria-label="Printable visual org chart prototype">
    <section class="screen-only print-prototype__section" aria-labelledby="interactive-heading">
      <h3 id="interactive-heading">Interactive view</h3>
      <p class="print-prototype__note">
        The screen experience stays outline-first. Printing switches to an internal visual
        adapter when the selected branch fits the chart thresholds.
      </p>
      <fd-internal-org-pattern-shell
        .tree=${mixed.tree}
        selected-node-id=${selectedNodeId}
        .photoResolver=${resolveStoryAvatar}
      ></fd-internal-org-pattern-shell>
    </section>

    <section class="screen-only print-prototype__section" aria-labelledby="preview-heading">
      <h3 id="preview-heading">Print preview adapter</h3>
      <p class="print-prototype__note">
        This is the same internal renderer used by the print-only layer below. It consumes
        the normalized tree directly rather than reading the expanded outline DOM.
      </p>
      <div class="print-prototype__preview">
        <fd-internal-org-print-chart
          .tree=${mixed.tree}
          scope="selected-branch"
          selected-node-id=${printSelectedNodeId}
          heading="Selected branch visual print prototype"
          generated-on="2026-05-08"
        ></fd-internal-org-print-chart>
      </div>
    </section>

    <div class="print-only" aria-hidden="true">
      <fd-internal-org-print-chart
        .tree=${mixed.tree}
        scope="selected-branch"
        selected-node-id=${printSelectedNodeId}
        heading="Selected branch visual print prototype"
        generated-on="2026-05-08"
      ></fd-internal-org-print-chart>
    </div>
  </section>
`;

const meta = {
  title: "Patterns/Org Chart",
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Composed Dynamic Org Chart v1 pattern. Three-column shell — filters left, search + outline center, details right — collapsing to drawers at narrower viewports. V1 is outline-first on all viewports and keeps the visual chart adapter out of scope.",
      },
    },
  },
  render: renderEditorReview,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditorReview: Story = {};

export const PrintableVisualPrototype: Story = {
  render: renderPrintableVisualPrototype,
  parameters: {
    docs: {
      description: {
        story:
          "Post-v1 prototype that keeps the interactive experience outline-first and renders an internal visual chart adapter for print/PDF when the scoped hierarchy fits the printDecision thresholds.",
      },
    },
  },
};

EditorReview.play = async ({ canvasElement }) => {
  const shell = canvasElement.querySelector(SHELL_TAG) as any;
  await shell?.updateComplete;
  const outline = shell?.shadowRoot?.querySelector("fd-org-outline") as any;
  const details = shell?.shadowRoot?.querySelector("fd-org-details") as any;
  await outline?.updateComplete;
  await details?.updateComplete;

  // Status text now lives in the details panel only — outline tiles are clean.
  expect(outline?.shadowRoot?.querySelectorAll("fd-badge").length).toBe(0);
  expect(details?.shadowRoot?.textContent).toContain("Editorial override");
  expect(details?.shadowRoot?.textContent).toContain("Conflict comparison");

  // Outline tiles expose ambient issue level via a data attribute.
  const items = Array.from(
    outline?.shadowRoot?.querySelectorAll("[part~='item']") ?? [],
  ) as HTMLElement[];
  expect(items.some((item) => item.dataset.issueLevel === "warn")).toBe(true);

  // Filter checkbox toggles update shell state.
  const officialFilter = shell?.shadowRoot?.querySelector<HTMLInputElement>(
    "input[name='source-status'][value='official']",
  );
  officialFilter?.click();
  await shell?.updateComplete;
  expect(shell?.filters?.sourceStatuses).toContain("official");

  expect(canvasElement.textContent).toContain("Diagnostics from malformed fixture");
  expect(outline?.shadowRoot?.querySelector("[role='tree']")).toBeNull();
};

PrintableVisualPrototype.play = async ({ canvasElement }) => {
  const printChart = canvasElement.querySelector(PRINT_CHART_TAG) as any;
  await printChart?.updateComplete;

  expect(canvasElement.textContent).toContain("Interactive view");
  expect(printChart?.shadowRoot?.querySelector("svg")).toBeTruthy();
  expect(printChart?.shadowRoot?.textContent).toContain("Selected branch visual print prototype");
};
