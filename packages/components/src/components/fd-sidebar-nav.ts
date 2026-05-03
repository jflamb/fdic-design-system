import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import type { TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";

export type FdSidebarNavRoot = {
  label: string;
  href: string;
};

export type FdSidebarNavItem = {
  id?: string;
  label: string;
  href: string;
  items?: FdSidebarNavItem[];
  expanded?: boolean;
};

type NormalizedSidebarNavItem = {
  id?: string;
  label: string;
  href: string;
  items: NormalizedSidebarNavItem[];
  expanded: boolean;
};

const DEFAULT_LABEL = "Section navigation";
const DEFAULT_MAX_DEPTH = 4;
let sidebarNavLabelId = 0;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeMaxDepth(value: number | undefined): 1 | 2 | 3 | 4 {
  const normalized = Number.isFinite(value)
    ? Math.floor(value ?? DEFAULT_MAX_DEPTH)
    : DEFAULT_MAX_DEPTH;
  return Math.min(4, Math.max(1, normalized)) as 1 | 2 | 3 | 4;
}

function normalizeRoot(value: unknown): FdSidebarNavRoot | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<FdSidebarNavRoot>;
  const label = normalizeText(candidate.label);
  const href = normalizeText(candidate.href);

  return label && href ? { label, href } : undefined;
}

function normalizeItems(value: unknown, depth = 1): NormalizedSidebarNavItem[] {
  if (!Array.isArray(value) || depth > DEFAULT_MAX_DEPTH) {
    return [];
  }

  return value
    .map((item): NormalizedSidebarNavItem | undefined => {
      if (!item || typeof item !== "object") {
        return undefined;
      }

      const candidate = item as Partial<FdSidebarNavItem>;
      const label = normalizeText(candidate.label);
      const href = normalizeText(candidate.href);

      if (!label || !href) {
        return undefined;
      }

      const id = normalizeText(candidate.id) || undefined;
      const items = normalizeItems(candidate.items, depth + 1);

      return {
        id,
        label,
        href,
        items,
        expanded: candidate.expanded === true,
      };
    })
    .filter((item): item is NormalizedSidebarNavItem => Boolean(item));
}

function findCurrentPath(
  items: NormalizedSidebarNavItem[],
  currentHref: string | undefined,
  currentId: string | undefined,
  path: NormalizedSidebarNavItem[] = [],
): NormalizedSidebarNavItem[] {
  for (const item of items) {
    const candidatePath = [...path, item];
    const matchesId = currentId ? item.id === currentId : false;
    const matchesHref = !currentId && currentHref ? item.href === currentHref : false;

    if (matchesId || matchesHref) {
      return candidatePath;
    }

    const childPath = findCurrentPath(
      item.items,
      currentHref,
      currentId,
      candidatePath,
    );

    if (childPath.length > 0) {
      return childPath;
    }
  }

  return [];
}

/**
 * `fd-sidebar-nav` — Local sidebar navigation for content-heavy sections.
 */
export class FdSidebarNav extends LitElement {
  static properties = {
    label: { reflect: true },
    labelledby: { reflect: true },
    root: { attribute: false },
    items: { attribute: false },
    currentHref: { attribute: "current-href", reflect: true },
    currentId: { attribute: "current-id", reflect: true },
    maxDepth: { type: Number, attribute: "max-depth", reflect: true },
    allowExplicitExpanded: {
      type: Boolean,
      attribute: "allow-explicit-expanded",
      reflect: true,
    },
  };

  static styles = css`
    :host {
      display: block;
      inline-size: var(
        --fd-sidebar-nav-width,
        var(--fdic-layout-sidebar-width, 20rem)
      );
      max-inline-size: 100%;
      color: var(--fdic-color-text-primary);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--fdic-font-size-body, 18px);
      line-height: 1.375;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([hidden]) {
      display: none;
    }

    [part="nav"] {
      display: block;
      inline-size: 100%;
    }

    [part~="list"] {
      display: flex;
      flex-direction: column;
      gap: 0;
      min-inline-size: 0;
      inline-size: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    [part~="sublist"] {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    [part~="item"] {
      min-inline-size: 0;
    }

    [part~="link"] {
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-block-size: var(--fd-sidebar-nav-item-min-height, 40px);
      inline-size: 100%;
      padding-block: var(--fdic-spacing-2xs, 4px);
      padding-inline: calc(
          var(--fd-sidebar-nav-indent-step, var(--fdic-spacing-md, 16px)) *
            var(--fd-sidebar-nav-level, 1)
        )
        var(--fdic-spacing-xs, 8px);
      color: var(--fd-sidebar-nav-link-color, var(--fdic-color-text-link));
      font-weight: 400;
      text-decoration-line: none;
      outline-color: transparent;
      overflow-wrap: anywhere;
    }

    [part~="root-link"] {
      --fd-sidebar-nav-level: 0;
      padding-inline-start: 0;
    }

    [part~="link"]:hover {
      color: var(--fd-sidebar-nav-link-hover-color, var(--fdic-color-text-link));
      text-decoration-line: underline;
      box-shadow: inset 0 0 0 999px var(--fdic-color-overlay-hover);
    }

    [part~="link"]:active {
      box-shadow: inset 0 0 0 999px
        var(--fdic-color-overlay-active, rgba(0, 0, 0, 0.08));
    }

    [part~="link"]:focus-visible {
      outline-color: transparent;
      text-decoration-line: underline;
      box-shadow: inset 0 0 0 2.5px
        var(--fdic-color-border-input-focus, var(--fdic-focus-ring-color));
    }

    [part~="link"][aria-current="page"] {
      color: var(
        --fd-sidebar-nav-current-color,
        var(--fdic-color-text-primary)
      );
      font-weight: 600;
    }

    [part~="link"][aria-current="page"]::before {
      position: absolute;
      inset-block: var(--fdic-spacing-2xs, 4px);
      inset-inline-start: 0;
      inline-size: var(--fd-sidebar-nav-current-indicator-width, 4px);
      background: var(
        --fd-sidebar-nav-current-indicator-color,
        var(--fdic-color-primary-400)
      );
      content: "";
    }

    [part~="root-link"][aria-current="page"]::before {
      content: none;
    }

    [part~="link"][data-path="true"] {
      color: var(--fd-sidebar-nav-path-color, var(--fdic-color-text-link));
    }

    [part="divider"] {
      display: block;
      box-sizing: border-box;
      inline-size: 100%;
      margin-block: var(--fdic-spacing-2xs, 4px);
      border-block-start: 1px solid
        var(
          --fd-sidebar-nav-divider-color,
          var(--fdic-color-border-divider)
        );
    }

    @media (forced-colors: active) {
      [part~="link"] {
        forced-color-adjust: none;
        color: LinkText;
      }

      [part~="link"][aria-current="page"] {
        color: CanvasText;
      }

      [part~="link"][aria-current="page"]::before {
        background: Highlight;
      }

      [part~="link"]:focus-visible {
        box-shadow: inset 0 0 0 2px Highlight;
      }
    }
  `;

  declare label: string;
  declare labelledby?: string;
  declare root?: FdSidebarNavRoot;
  declare items: FdSidebarNavItem[];
  declare currentHref?: string;
  declare currentId?: string;
  declare maxDepth?: 1 | 2 | 3 | 4;
  declare allowExplicitExpanded: boolean;

  private readonly _labelProxyId = `fd-sidebar-nav-label-${sidebarNavLabelId += 1}`;
  private _labelSourceObserver: MutationObserver | undefined;
  private _labelledbyText = "";

  constructor() {
    super();
    this.label = "";
    this.items = [];
    this.maxDepth = 4;
    this.allowExplicitExpanded = false;
  }

  override disconnectedCallback() {
    this._labelSourceObserver?.disconnect();
    super.disconnectedCallback();
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("labelledby")) {
      this._syncLabelledbyText();
    }
  }

  private _syncLabelledbyText() {
    this._labelSourceObserver?.disconnect();
    this._labelSourceObserver = undefined;

    const source = this._getLabelledbyElement();
    this._labelledbyText = source?.textContent?.trim() ?? "";

    if (source) {
      this._labelSourceObserver = new MutationObserver(() => {
        this._labelledbyText = source.textContent?.trim() ?? "";
        this.requestUpdate();
      });
      this._labelSourceObserver.observe(source, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }

  private _getLabelledbyElement() {
    const id = normalizeText(this.labelledby);
    if (!id) {
      return null;
    }

    const root = this.getRootNode();
    if (root instanceof Document || root instanceof ShadowRoot) {
      return root.getElementById(id);
    }

    return document.getElementById(id);
  }

  render() {
    const root = normalizeRoot(this.root);
    const items = normalizeItems(this.items);
    const maxDepth = normalizeMaxDepth(this.maxDepth);
    const currentHref = normalizeText(this.currentHref) || undefined;
    const currentId = normalizeText(this.currentId) || undefined;
    const currentRoot = !currentId && root?.href === currentHref;
    const currentPath = findCurrentPath(
      items,
      currentRoot ? undefined : currentHref,
      currentId,
    );
    const currentItem = currentPath.at(-1);
    const currentSet = new Set(currentPath);
    const labelledbyText = this._labelledbyText;
    const label = normalizeText(this.label) || DEFAULT_LABEL;

    return html`
      ${labelledbyText
        ? html`<span id=${this._labelProxyId} hidden>${labelledbyText}</span>`
        : nothing}
      <nav
        part="nav"
        aria-label=${ifDefined(labelledbyText ? undefined : label)}
        aria-labelledby=${ifDefined(
          labelledbyText ? this._labelProxyId : undefined,
        )}
      >
        ${root ? this._renderRoot(root, currentRoot) : nothing}
        ${root && items.length > 0 ? html`<span part="divider"></span>` : nothing}
        ${items.length > 0
          ? html`
              <ul part="list">
                ${repeat(
                  items,
                  (item) => item.id ?? item.href,
                  (item) =>
                    this._renderItem(item, {
                      level: 1,
                      maxDepth,
                      currentItem,
                      currentSet,
                    }),
                )}
              </ul>
            `
          : nothing}
      </nav>
    `;
  }

  private _renderRoot(
    root: FdSidebarNavRoot,
    current: boolean,
  ): TemplateResult {
    return html`
      <ul part="list root-list">
        <li part="item root-item">
          <a
            part="link root-link ${current ? "current-link" : ""}"
            href=${root.href}
            aria-current=${ifDefined(current ? "page" : undefined)}
            data-current=${ifDefined(current ? "true" : undefined)}
          >
            ${root.label}
          </a>
        </li>
      </ul>
    `;
  }

  private _renderItem(
    item: NormalizedSidebarNavItem,
    context: {
      level: number;
      maxDepth: 1 | 2 | 3 | 4;
      currentItem: NormalizedSidebarNavItem | undefined;
      currentSet: Set<NormalizedSidebarNavItem>;
    },
  ): TemplateResult {
    const isCurrent = item === context.currentItem;
    const isPath = context.currentSet.has(item) && !isCurrent;
    const canRenderChildren =
      item.items.length > 0 &&
      context.level < context.maxDepth &&
      (isPath ||
        isCurrent ||
        (this.allowExplicitExpanded && item.expanded === true));

    return html`
      <li part="item" data-level=${context.level}>
        <a
          part="link ${isCurrent ? "current-link" : ""} ${isPath
            ? "path-link"
            : ""}"
          href=${item.href}
          aria-current=${ifDefined(isCurrent ? "page" : undefined)}
          data-current=${ifDefined(isCurrent ? "true" : undefined)}
          data-path=${ifDefined(isPath ? "true" : undefined)}
          style="--fd-sidebar-nav-level:${context.level};"
        >
          ${item.label}
        </a>
        ${canRenderChildren
          ? html`
              <ul part="list sublist">
                ${repeat(
                  item.items,
                  (child) => child.id ?? child.href,
                  (child) =>
                    this._renderItem(child, {
                      ...context,
                      level: context.level + 1,
                    }),
                )}
              </ul>
            `
          : nothing}
      </li>
    `;
  }
}
