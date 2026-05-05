import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { reducedMotion } from "./reduced-motion.js";

export type FdSidebarMenuRoot = {
  label: string;
  href: string;
};

export type FdSidebarMenuItem = {
  id?: string;
  label: string;
  href: string;
  items?: FdSidebarMenuItem[];
  expanded?: boolean;
};

type NormalizedSidebarMenuItem = {
  id?: string;
  key: string;
  label: string;
  href: string;
  expanded: boolean;
  items: NormalizedSidebarMenuItem[];
};

const DEFAULT_LABEL = "Section menu";
const TRANSITION_DURATION_MS = 160;

let sidebarMenuLabelId = 0;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRoot(value: unknown): FdSidebarMenuRoot | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<FdSidebarMenuRoot>;
  const label = normalizeText(candidate.label);
  const href = normalizeText(candidate.href);

  return label && href ? { label, href } : undefined;
}

function normalizeItems(
  value: unknown,
  depth = 1,
  parentKey = "item",
): NormalizedSidebarMenuItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index): NormalizedSidebarMenuItem | undefined => {
      if (!item || typeof item !== "object") {
        return undefined;
      }

      const candidate = item as Partial<FdSidebarMenuItem>;
      const label = normalizeText(candidate.label);
      const href = normalizeText(candidate.href);

      if (!label || !href) {
        return undefined;
      }

      const id = normalizeText(candidate.id) || undefined;
      const key = `${parentKey}-${id ?? href}-${index}`;

      return {
        id,
        key,
        label,
        href,
        expanded: candidate.expanded === true,
        items: normalizeItems(candidate.items, depth + 1, key),
      };
    })
    .filter((item): item is NormalizedSidebarMenuItem => Boolean(item));
}

function normalizeMaxDepth(value: unknown): 1 | 2 | 3 | 4 {
  const numberValue = Number(value);

  if (numberValue === 1 || numberValue === 2 || numberValue === 3) {
    return numberValue;
  }

  return 4;
}

function findCurrentPath(
  items: NormalizedSidebarMenuItem[],
  currentHref: string | undefined,
  currentId: string | undefined,
  path: NormalizedSidebarMenuItem[] = [],
): NormalizedSidebarMenuItem[] {
  for (const item of items) {
    const nextPath = [...path, item];
    const matchesCurrentId = currentId && item.id === currentId;
    const matchesCurrentHref = !currentId && currentHref && item.href === currentHref;

    if (matchesCurrentId || matchesCurrentHref) {
      return nextPath;
    }

    const childPath = findCurrentPath(item.items, currentHref, currentId, nextPath);

    if (childPath.length > 0) {
      return childPath;
    }
  }

  return [];
}

function collectExpandableKeys(
  items: NormalizedSidebarMenuItem[],
  keys = new Set<string>(),
) {
  for (const item of items) {
    if (item.items.length > 0) {
      keys.add(item.key);
      collectExpandableKeys(item.items, keys);
    }
  }

  return keys;
}

/**
 * `fd-sidebar-menu` — Disclosure-style sidebar navigation for content-heavy sections.
 */
export class FdSidebarMenu extends LitElement {
  static properties = {
    label: { reflect: true },
    labelledby: { reflect: true },
    root: { attribute: false },
    items: { attribute: false },
    currentHref: { attribute: "current-href", reflect: true },
    currentId: { attribute: "current-id", reflect: true },
    maxDepth: { type: Number, attribute: "max-depth", reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      inline-size: var(
        --fd-sidebar-menu-width,
        var(--fd-sidebar-nav-width, var(--fdic-layout-sidebar-width, 20rem))
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
      display: flex;
      flex-direction: column;
      block-size: 0;
      margin: 0;
      padding: 0;
      list-style: none;
      overflow: hidden;
      transition: block-size var(--fd-sidebar-menu-transition-duration, 160ms)
        ease;
      interpolate-size: allow-keywords;
    }

    [part~="sublist"][data-expanded="true"] {
      block-size: auto;
    }

    [part~="sublist"][hidden] {
      display: none;
    }

    [part~="item"] {
      min-inline-size: 0;
    }

    [part="row"] {
      display: grid;
      grid-template-columns: minmax(0, 1fr) var(
          --fd-sidebar-menu-toggle-size,
          var(--fd-sidebar-nav-item-min-height, 40px)
        );
      min-inline-size: 0;
      inline-size: 100%;
    }

    [part~="link"] {
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-block-size: var(
        --fd-sidebar-menu-item-min-height,
        var(--fd-sidebar-nav-item-min-height, 40px)
      );
      inline-size: 100%;
      padding-block: var(--fdic-spacing-2xs, 4px);
      padding-inline: calc(
          var(
              --fd-sidebar-menu-indent-step,
              var(--fd-sidebar-nav-indent-step, var(--fdic-spacing-md, 16px))
            ) *
            var(--fd-sidebar-menu-level, 1)
        )
        var(--fdic-spacing-xs, 8px);
      color: var(
        --fd-sidebar-menu-link-color,
        var(--fd-sidebar-nav-link-color, var(--fdic-color-text-link))
      );
      font-weight: 400;
      text-decoration-line: none;
      outline-color: transparent;
      overflow-wrap: anywhere;
    }

    [part~="link"][data-has-toggle="false"] {
      grid-column: 1 / -1;
      padding-inline-end: var(--fdic-spacing-xs, 8px);
    }

    [part~="root-link"] {
      --fd-sidebar-menu-level: 0;
      padding-inline-start: 0;
    }

    [part~="link"]:hover {
      color: var(
        --fd-sidebar-menu-link-hover-color,
        var(--fd-sidebar-nav-link-hover-color, var(--fdic-color-text-link))
      );
      text-decoration-line: underline;
      box-shadow: inset 0 0 0 999px var(--fdic-color-overlay-hover);
    }

    [part~="link"]:active {
      box-shadow: inset 0 0 0 999px
        var(--fdic-color-overlay-active, rgba(0, 0, 0, 0.08));
    }

    [part~="link"]:focus-visible,
    [part~="toggle"]:focus-visible {
      outline-color: transparent;
      text-decoration-line: underline;
      box-shadow: inset 0 0 0 2.5px
        var(--fdic-color-border-input-focus, var(--fdic-focus-ring-color));
    }

    [part~="link"][aria-current="page"] {
      color: var(
        --fd-sidebar-menu-current-color,
        var(--fd-sidebar-nav-current-color, var(--fdic-color-text-primary))
      );
      font-weight: 600;
    }

    [part~="link"][aria-current="page"]::before {
      position: absolute;
      inset-block: var(--fdic-spacing-2xs, 4px);
      inset-inline-start: 0;
      inline-size: var(
        --fd-sidebar-menu-current-indicator-width,
        var(--fd-sidebar-nav-current-indicator-width, 4px)
      );
      background: var(
        --fd-sidebar-menu-current-indicator-color,
        var(--fd-sidebar-nav-current-indicator-color, var(--fdic-color-primary-400))
      );
      content: "";
    }

    [part~="root-link"][aria-current="page"]::before {
      content: none;
    }

    [part~="link"][data-path="true"] {
      color: var(
        --fd-sidebar-menu-path-color,
        var(--fd-sidebar-nav-path-color, var(--fdic-color-text-link))
      );
    }

    [part~="toggle"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-block-size: var(
        --fd-sidebar-menu-item-min-height,
        var(--fd-sidebar-nav-item-min-height, 40px)
      );
      inline-size: var(
        --fd-sidebar-menu-toggle-size,
        var(--fd-sidebar-nav-item-min-height, 40px)
      );
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: var(
        --fd-sidebar-menu-toggle-color,
        var(--fd-sidebar-menu-link-color, var(--fdic-color-text-link))
      );
      cursor: pointer;
      font: inherit;
      outline-color: transparent;
    }

    [part~="toggle"]:hover {
      color: var(
        --fd-sidebar-menu-link-hover-color,
        var(--fd-sidebar-nav-link-hover-color, var(--fdic-color-text-link))
      );
      box-shadow: inset 0 0 0 999px var(--fdic-color-overlay-hover);
    }

    [part~="toggle"] fd-icon {
      inline-size: var(--fd-sidebar-menu-caret-size, 1em);
      block-size: var(--fd-sidebar-menu-caret-size, 1em);
      transition: transform var(--fd-sidebar-menu-transition-duration, 160ms)
        ease;
    }

    [part~="toggle"][aria-expanded="true"] fd-icon {
      transform: rotate(90deg);
    }

    [part="divider"] {
      display: block;
      box-sizing: border-box;
      inline-size: 100%;
      margin-block: var(--fdic-spacing-2xs, 4px);
      border-block-start: 1px solid
        var(
          --fd-sidebar-menu-divider-color,
          var(--fd-sidebar-nav-divider-color, var(--fdic-color-border-divider))
        );
    }

    @media (forced-colors: active) {
      [part~="link"],
      [part~="toggle"] {
        forced-color-adjust: none;
        color: LinkText;
      }

      [part~="link"][aria-current="page"] {
        color: CanvasText;
      }

      [part~="link"][aria-current="page"]::before {
        background: Highlight;
      }

      [part~="link"]:focus-visible,
      [part~="toggle"]:focus-visible {
        box-shadow: inset 0 0 0 2px Highlight;
      }
    }

    ${reducedMotion`
      [part~="sublist"],
      [part~="toggle"] fd-icon {
        transition: none !important;
      }
    `}
  `;

  declare label: string;
  declare labelledby?: string;
  declare root?: FdSidebarMenuRoot;
  declare items: FdSidebarMenuItem[];
  declare currentHref?: string;
  declare currentId?: string;
  declare maxDepth?: 1 | 2 | 3 | 4;

  private readonly _labelProxyId = `fd-sidebar-menu-label-${sidebarMenuLabelId += 1}`;
  private _labelSourceObserver: MutationObserver | undefined;
  private _labelledbyText = "";
  private _expandedKeys = new Set<string>();
  private _collapsedKeys = new Set<string>();
  private _transitioningKeys = new Set<string>();
  private _transitionTimers = new Map<string, number>();
  private _openingKeys = new Set<string>();
  private _openingFrameIds = new Map<string, number>();

  constructor() {
    super();
    this.label = "";
    this.items = [];
    this.maxDepth = 4;
  }

  override disconnectedCallback() {
    this._labelSourceObserver?.disconnect();
    for (const timer of this._transitionTimers.values()) {
      window.clearTimeout(timer);
    }
    this._transitionTimers.clear();
    for (const frameId of this._openingFrameIds.values()) {
      window.cancelAnimationFrame(frameId);
    }
    this._openingFrameIds.clear();
    super.disconnectedCallback();
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("labelledby")) {
      this._syncLabelledbyText();
    }

    if (changedProperties.has("items")) {
      this._pruneExpandedState();
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

  private _pruneExpandedState() {
    const validKeys = collectExpandableKeys(normalizeItems(this.items));

    this._expandedKeys = new Set(
      [...this._expandedKeys].filter((key) => validKeys.has(key)),
    );
    this._collapsedKeys = new Set(
      [...this._collapsedKeys].filter((key) => validKeys.has(key)),
    );
    this._transitioningKeys = new Set(
      [...this._transitioningKeys].filter((key) => validKeys.has(key)),
    );
    this._openingKeys = new Set(
      [...this._openingKeys].filter((key) => validKeys.has(key)),
    );

    for (const [key, timer] of this._transitionTimers) {
      if (!validKeys.has(key)) {
        window.clearTimeout(timer);
        this._transitionTimers.delete(key);
      }
    }

    for (const [key, frameId] of this._openingFrameIds) {
      if (!validKeys.has(key)) {
        window.cancelAnimationFrame(frameId);
        this._openingFrameIds.delete(key);
      }
    }
  }

  private _isExpanded(
    item: NormalizedSidebarMenuItem,
    currentSet: Set<NormalizedSidebarMenuItem>,
  ) {
    if (this._collapsedKeys.has(item.key)) {
      return false;
    }

    return item.expanded || currentSet.has(item) || this._expandedKeys.has(item.key);
  }

  private _toggleItem(item: NormalizedSidebarMenuItem, expanded: boolean) {
    const existingTimer = this._transitionTimers.get(item.key);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    const existingFrame = this._openingFrameIds.get(item.key);
    if (existingFrame) {
      window.cancelAnimationFrame(existingFrame);
      this._openingFrameIds.delete(item.key);
    }

    this._transitioningKeys.add(item.key);

    if (expanded) {
      this._openingKeys.delete(item.key);
      this._collapsedKeys.add(item.key);
      this._expandedKeys.delete(item.key);
    } else {
      this._openingKeys.add(item.key);
      this._expandedKeys.add(item.key);
      this._collapsedKeys.delete(item.key);

      void this.updateComplete.then(() => {
        const frameId = window.requestAnimationFrame(() => {
          this._openingKeys.delete(item.key);
          this._openingFrameIds.delete(item.key);
          this.requestUpdate();
        });
        this._openingFrameIds.set(item.key, frameId);
      });
    }

    const timer = window.setTimeout(() => {
      this._transitioningKeys.delete(item.key);
      this._transitionTimers.delete(item.key);
      this.requestUpdate();
    }, TRANSITION_DURATION_MS);
    this._transitionTimers.set(item.key, timer);
    this.requestUpdate();
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
                  (item) => item.key,
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
    root: FdSidebarMenuRoot,
    current: boolean,
  ): TemplateResult {
    return html`
      <ul part="list root-list">
        <li part="item root-item">
          <div part="row">
            <a
              part="link root-link ${current ? "current-link" : ""}"
              href=${root.href}
              aria-current=${ifDefined(current ? "page" : undefined)}
              data-current=${ifDefined(current ? "true" : undefined)}
              data-has-toggle="false"
            >
              ${root.label}
            </a>
          </div>
        </li>
      </ul>
    `;
  }

  private _renderItem(
    item: NormalizedSidebarMenuItem,
    context: {
      level: number;
      maxDepth: 1 | 2 | 3 | 4;
      currentItem: NormalizedSidebarMenuItem | undefined;
      currentSet: Set<NormalizedSidebarMenuItem>;
    },
  ): TemplateResult {
    const isCurrent = item === context.currentItem;
    const isPath = context.currentSet.has(item) && !isCurrent;
    const canRenderChildren =
      item.items.length > 0 && context.level < context.maxDepth;
    const expanded = canRenderChildren
      ? this._isExpanded(item, context.currentSet)
      : false;
    const transitioning = this._transitioningKeys.has(item.key);
    const visuallyExpanded = expanded && !this._openingKeys.has(item.key);
    const sublistId = `${item.key}-sublist`;

    return html`
      <li part="item" data-level=${context.level}>
        <div part="row">
          <a
            part="link ${isCurrent ? "current-link" : ""} ${isPath
              ? "path-link"
              : ""}"
            href=${item.href}
            aria-current=${ifDefined(isCurrent ? "page" : undefined)}
            data-current=${ifDefined(isCurrent ? "true" : undefined)}
            data-path=${ifDefined(isPath ? "true" : undefined)}
            data-has-toggle=${canRenderChildren ? "true" : "false"}
            style="--fd-sidebar-menu-level:${context.level};"
          >
            ${item.label}
          </a>
          ${canRenderChildren
            ? html`
                <button
                  part="toggle"
                  type="button"
                  aria-expanded=${expanded ? "true" : "false"}
                  aria-controls=${sublistId}
                  aria-label=${`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                  data-expanded=${expanded ? "true" : "false"}
                  @click=${() => this._toggleItem(item, expanded)}
                >
                  <fd-icon name="caret-right" aria-hidden="true"></fd-icon>
                </button>
              `
            : nothing}
        </div>
        ${canRenderChildren
          ? html`
              <ul
                id=${sublistId}
                part="list sublist"
                data-expanded=${visuallyExpanded ? "true" : "false"}
                ?hidden=${!expanded && !transitioning}
              >
                ${repeat(
                  item.items,
                  (child) => child.key,
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
