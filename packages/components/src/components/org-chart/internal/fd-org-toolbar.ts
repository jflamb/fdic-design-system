import { LitElement, css, html } from "lit";
import type {
  FdOrgFilterState,
  FdOrgNodeType,
  FdOrgSourceStatus,
  FdOrgTree,
} from "../../org-chart-types.js";

export type FdOrgToolbarChangeDetail = {
  searchQuery: string;
  filters: FdOrgFilterState;
};

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
 * `fd-org-toolbar` — Embedded toolbar for the composed org chart pattern.
 * Provides search and filter controls; print is handled at the consumer
 * level via `window.print()` and the component's print stylesheets.
 *
 * @fires fd-org-toolbar-change - Fired when approved v1 search or filters change.
 */
export class FdOrgToolbar extends LitElement {
  static properties = {
    tree: { attribute: false },
    searchQuery: { attribute: "search-query", reflect: true },
    filters: { attribute: false },
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

    form {
      display: grid;
      gap: var(--fdic-spacing-md, 16px) var(--fdic-spacing-lg, 24px);
      grid-template-columns: minmax(18rem, 1fr) auto;
      align-items: start;
      max-inline-size: 100%;
      padding: var(--fdic-spacing-md, 16px);
      border: 1px solid var(--fdic-color-border-subtle);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-surface);
      box-shadow: var(--fdic-shadow-raised);
    }

    fieldset {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-md, 16px);
      min-inline-size: 0;
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

    label.search-label {
      display: block;
      margin-block-end: var(--fdic-spacing-2xs, 4px);
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
      font-weight: var(--fdic-font-weight-semibold, 600);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--fdic-color-text-secondary);
    }

    .search {
      min-inline-size: 0;
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

    input[type="search"]::placeholder {
      color: var(--fdic-color-icon-placeholder, var(--fdic-color-text-secondary));
    }

    input:focus-visible {
      outline-color: transparent;
      border-color: var(--fdic-color-border-input-focus, var(--fdic-focus-ring-color));
      box-shadow:
        0 0 0 var(--fdic-focus-gap-width, 2px) var(--fdic-focus-gap-color),
        0 0 0 calc(var(--fdic-focus-gap-width, 2px) + var(--fdic-focus-ring-width, 4px))
          var(--fdic-focus-ring-color);
    }

    .filters {
      display: grid;
      gap: var(--fdic-spacing-md, 16px);
      grid-column: 1 / -1;
      padding-block-start: var(--fdic-spacing-sm, 12px);
      border-block-start: 1px solid var(--fdic-color-border-subtle);
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

    @media (max-width: 56rem) {
      form {
        grid-template-columns: 1fr;
      }
    }

    /* The toolbar is workflow chrome, not part of the printable hierarchy. */
    @media print {
      :host {
        display: none;
      }
    }
  `;

  declare tree?: FdOrgTree;
  declare searchQuery: string;
  declare filters: FdOrgFilterState;

  constructor() {
    super();
    this.searchQuery = "";
    this.filters = {};
  }

  render() {
    return html`
      <form @submit=${(event: Event) => event.preventDefault()}>
        <div class="search">
          <label class="search-label" for="org-search">Search organization</label>
          <div class="search-control">
            <fd-icon name="magnifying-glass" aria-hidden="true"></fd-icon>
            <input
              id="org-search"
              type="search"
              placeholder="Search by label, title, or person"
              .value=${this.searchQuery}
              @input=${this.onSearchInput}
            />
          </div>
        </div>
        <div class="filters">
          <fieldset>
            <legend>Node type</legend>
            ${NODE_TYPES.map(([value, label]) => this.renderCheckbox("node-type", value, label))}
          </fieldset>
          <fieldset>
            <legend>Source/status</legend>
            ${SOURCE_STATUSES.map(([value, label]) => this.renderCheckbox("source-status", value, label))}
          </fieldset>
          <fieldset>
            <legend>Acting/detail assignment</legend>
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
        </div>
      </form>
    `;
  }

  private renderCheckbox(group: string, value: string, label: string) {
    const checked = group === "node-type"
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

  private onSearchInput(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.emitChange();
  }

  private onFilterChange() {
    const inputs = Array.from(
      this.renderRoot.querySelectorAll<HTMLInputElement>("input[type='checkbox']"),
    );
    this.filters = {
      nodeTypes: inputs
        .filter((input) => input.name === "node-type" && input.checked)
        .map((input) => input.value as FdOrgNodeType),
      sourceStatuses: inputs
        .filter((input) => input.name === "source-status" && input.checked)
        .map((input) => input.value as FdOrgSourceStatus),
      actingOnly: inputs.some((input) => input.name === "acting" && input.checked),
    };
    this.emitChange();
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent<FdOrgToolbarChangeDetail>("fd-org-toolbar-change", {
        detail: { searchQuery: this.searchQuery, filters: this.filters },
        bubbles: true,
        composed: true,
      }),
    );
  }

}
