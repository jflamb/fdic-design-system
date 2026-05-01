import { LitElement, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { CollectionChildController } from "./collection-child-controller.js";
import {
  COLLECTION_COLUMNS,
  type CollectionColumns,
} from "./collection-grid.js";

const COLLECTION_COLUMNS_SET = new Set<string>(COLLECTION_COLUMNS);
let collectionListBaseId = 0;

type CollectionListBaseOptions = {
  attributeFilter?: string[];
  isManagedChild: (node: Element) => node is HTMLElement;
};

export function isCollectionElement(
  localName: string,
): (node: Element) => node is HTMLElement {
  return (node: Element): node is HTMLElement =>
    node instanceof HTMLElement && node.localName === localName;
}

export function normalizeCollectionColumns(
  value: string | undefined,
): CollectionColumns {
  return value && COLLECTION_COLUMNS_SET.has(value)
    ? (value as CollectionColumns)
    : "3";
}

export abstract class CollectionListBase extends LitElement {
  static properties = {
    columns: { reflect: true },
    label: { reflect: true },
    labelledby: { reflect: true },
  };

  declare columns: CollectionColumns;
  declare label: string | undefined;
  declare labelledby: string | undefined;

  private readonly _childController: CollectionChildController;
  private readonly _isManagedChild: CollectionListBaseOptions["isManagedChild"];
  private readonly _labelProxyId = `fd-collection-list-label-${collectionListBaseId += 1}`;
  private _labelSourceObserver: MutationObserver | undefined;
  private _labelledbyText = "";
  private _managedChildCount = 0;

  protected constructor(options: CollectionListBaseOptions) {
    super();
    this.columns = "3";
    this.label = undefined;
    this.labelledby = undefined;
    this._isManagedChild = options.isManagedChild;
    this._childController = new CollectionChildController({
      applyToChild: (element) => this.applyToChild(element),
      attributeFilter: options.attributeFilter ?? ["role"],
      isManagedChild: options.isManagedChild,
      slot: () => this.shadowRoot?.querySelector("slot") ?? null,
    });
  }

  override firstUpdated(changedProperties: PropertyValues<this>) {
    super.firstUpdated(changedProperties);
    this.syncChildren();
  }

  override disconnectedCallback() {
    this._labelSourceObserver?.disconnect();
    this._childController.disconnect();
    super.disconnectedCallback();
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    this._managedChildCount = this.getManagedChildCount();

    if (changedProperties.has("columns")) {
      const normalized = normalizeCollectionColumns(this.columns);
      if (normalized !== this.columns) {
        this.columns = normalized;
      }
    }

    if (changedProperties.has("labelledby")) {
      this.syncLabelledbyText();
    }
  }

  override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (this.shouldSyncChildren(changedProperties)) {
      this.syncChildren();
    }
  }

  protected applyToChild(element: HTMLElement) {
    this.applyListItemRole(element);
  }

  protected applyListItemRole(element: HTMLElement) {
    if (element.getAttribute("role") !== "listitem") {
      element.setAttribute("role", "listitem");
    }
  }

  protected shouldSyncChildren(_changedProperties: PropertyValues<this>) {
    return false;
  }

  protected syncChildren() {
    const managedChildCount = this._childController.sync();
    if (managedChildCount !== this._managedChildCount) {
      this._managedChildCount = managedChildCount;
      this.requestUpdate();
    }
  }

  private getManagedChildCount() {
    return Array.from(this.children).filter(this._isManagedChild).length;
  }

  protected syncLabelledbyText() {
    this._labelSourceObserver?.disconnect();
    this._labelSourceObserver = undefined;

    const source = this.getLabelledbyElement();
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

  private getLabelledbyElement() {
    const id = this.labelledby?.trim();
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
    const label = this.label?.trim();
    const labelledby = this.labelledby?.trim();
    const labelledbyText = this._labelledbyText;
    const hasManagedChildren = this._managedChildCount > 0;

    return html`
      ${labelledby && labelledbyText
        ? html`<span id=${this._labelProxyId} hidden>${labelledbyText}</span>`
        : nothing}
      <div
        part="base"
        role=${ifDefined(hasManagedChildren ? "list" : undefined)}
        aria-label=${ifDefined(hasManagedChildren && !labelledbyText ? label || undefined : undefined)}
        aria-labelledby=${ifDefined(hasManagedChildren && labelledbyText ? this._labelProxyId : undefined)}
      >
        <slot @slotchange=${() => this.syncChildren()}></slot>
      </div>
    `;
  }
}
