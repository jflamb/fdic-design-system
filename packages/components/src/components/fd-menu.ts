import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { FdMenuOpenChangeDetail } from "../public-events.js";
import { computePlacement } from "./placement.js";
import type { Placement } from "./placement.js";
import type { FdMenuItem } from "./fd-menu-item.js";

export { Placement };

export class FdMenu extends LitElement {
  static properties = {
    anchor: { reflect: true },
    placement: { reflect: true },
    open: { type: Boolean, reflect: true },
    label: { reflect: true },
    labelledby: { reflect: true },
  };

  static styles = css`
    :host {
      display: contents;
    }

    .surface {
      margin: 0;
      padding: 0;
      border: 1px solid var(--fdic-border-divider, #bdbdbf);
      border-radius: var(--fd-menu-border-radius, var(--fdic-corner-radius-lg, 7px));
      background: var(--fdic-background-base, var(--ds-color-bg-surface, #ffffff));
      box-shadow: 0 4px 12px var(--ds-color-effect-shadow, rgba(0, 0, 0, 0.08));
      min-width: var(--fd-menu-min-width, 180px);
      max-width: var(--fd-menu-max-width, 320px);
      max-height: var(--fd-menu-max-height, min(300px, 60dvh));
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      box-sizing: border-box;
    }

    /* When popover is supported, the surface is positioned via top-layer */
    .surface[popover] {
      inset: unset;
    }

    .surface:not([open]):not(:popover-open) {
      display: none;
    }

    .menu {
      list-style: none;
      margin: 0;
      padding: var(--fdic-spacing-2xs, 4px) 0;
    }

    @media (max-width: 768px) {
      .surface {
        max-width: var(--fd-menu-max-width-mobile, none);
      }
    }

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      .surface {
        border-color: ButtonBorder;
        forced-color-adjust: none;
      }
    }

    /* --- Reduced motion guard --- */
    @media (prefers-reduced-motion: reduce) {
      .surface {
        transition: none;
      }
    }

    @media print {
      .surface {
        position: static;
        box-shadow: none;
        border: 1px solid #000;
      }
    }
  `;

  declare anchor: string | undefined;
  declare placement: Placement;
  declare open: boolean;
  declare label: string | undefined;
  declare labelledby: string | undefined;

  private _anchorEl: HTMLElement | null = null;
  private _rafId: number | null = null;

  constructor() {
    super();
    this.anchor = undefined;
    this.placement = "bottom-start";
    this.open = false;
    this.label = undefined;
    this.labelledby = undefined;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._onScrollResize = this._onScrollResize.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onSurfaceToggle = this._onSurfaceToggle.bind(this);
    this.addEventListener("fd-menu-item-select", this._onItemSelect as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removePositionListeners();
    this.removeEventListener("fd-menu-item-select", this._onItemSelect as EventListener);
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  // --- Public API ---

  show() {
    if (this.open) return;
    this._resolveAnchor();
    this.open = true;
    this._showSurface();
    this._updatePosition();
    this._addPositionListeners();
    this._setAnchorExpanded(true);
    this._focusFirstItem();
    this._fireOpenEvent(true);
  }

  /** Show and focus the last item (for ArrowUp-to-open). */
  showLast() {
    if (this.open) return;
    this._resolveAnchor();
    this.open = true;
    this._showSurface();
    this._updatePosition();
    this._addPositionListeners();
    this._setAnchorExpanded(true);
    this._focusLastItem();
    this._fireOpenEvent(true);
  }

  hide() {
    if (!this.open) return;
    this.open = false;
    this._hideSurface();
    this._removePositionListeners();
    this._setAnchorExpanded(false);
    this._fireOpenEvent(false);
  }

  toggle() {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  // --- Items ---

  private _getItems(): FdMenuItem[] {
    return Array.from(this.querySelectorAll("fd-menu-item")) as FdMenuItem[];
  }

  private _focusFirstItem() {
    requestAnimationFrame(() => {
      const items = this._getItems();
      if (items.length > 0) {
        this._focusItem(items[0]);
      }
    });
  }

  private _focusLastItem() {
    requestAnimationFrame(() => {
      const items = this._getItems();
      if (items.length > 0) {
        this._focusItem(items[items.length - 1]);
      }
    });
  }

  private _focusItem(item: FdMenuItem) {
    const items = this._getItems();
    for (const it of items) {
      const btn = it.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;
      if (btn) {
        btn.setAttribute("tabindex", it === item ? "0" : "-1");
      }
    }
    const btn = item.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;
    btn?.focus();
  }

  private _focusNextItem(current: FdMenuItem) {
    const items = this._getItems();
    const idx = items.indexOf(current);
    const next = items[(idx + 1) % items.length];
    this._focusItem(next);
  }

  private _focusPreviousItem(current: FdMenuItem) {
    const items = this._getItems();
    const idx = items.indexOf(current);
    const prev = items[(idx - 1 + items.length) % items.length];
    this._focusItem(prev);
  }

  // --- Anchor management ---

  private _resolveAnchor() {
    if (this.anchor) {
      const owner = this.getRootNode() as Document | ShadowRoot;
      this._anchorEl = (owner.getElementById?.(this.anchor) ??
        document.getElementById(this.anchor)) as HTMLElement | null;
    }
  }

  private _setAnchorExpanded(expanded: boolean) {
    if (this._anchorEl) {
      this._anchorEl.setAttribute("aria-expanded", String(expanded));
    }
  }

  // --- Popover / fallback surface ---

  private _getSurface(): HTMLElement | null {
    return this.shadowRoot?.querySelector(".surface") as HTMLElement | null;
  }

  private _showSurface() {
    const surface = this._getSurface();
    if (!surface) return;
    surface.showPopover();
  }

  private _hideSurface() {
    const surface = this._getSurface();
    if (!surface) return;
    surface.hidePopover();
  }

  // --- Positioning ---

  private _updatePosition() {
    const surface = this._getSurface();
    if (!surface || !this._anchorEl) return;

    const result = computePlacement(this._anchorEl, surface, this.placement);
    surface.style.position = "fixed";
    surface.style.top = `${result.top - window.scrollY}px`;
    surface.style.left = `${result.left - window.scrollX}px`;
  }

  private _onScrollResize() {
    if (this._rafId !== null) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      if (this.open) {
        this._updatePosition();
      }
    });
  }

  private _addPositionListeners() {
    window.addEventListener("scroll", this._onScrollResize, { passive: true });
    window.addEventListener("resize", this._onScrollResize, { passive: true });
  }

  private _removePositionListeners() {
    window.removeEventListener("scroll", this._onScrollResize);
    window.removeEventListener("resize", this._onScrollResize);
  }

  // --- Focus management ---

  private _onFocusOut(e: FocusEvent) {
    if (!this.open) return;

    // Check if focus moved outside the menu tree
    requestAnimationFrame(() => {
      if (!this.open) return;
      const surface = this._getSurface();
      const activeEl = (this.getRootNode() as Document).activeElement;

      // Focus is still within the host or its children
      if (this.contains(activeEl)) return;
      // Focus is in shadow DOM
      if (surface?.contains(activeEl as Node)) return;

      this.hide();
    });
  }

  // --- Keyboard handling ---

  private _onMenuKeydown(e: KeyboardEvent) {
    const items = this._getItems();
    // Find the currently focused item by checking which item's button has tabindex="0"
    // or by traversing the composed path
    const currentItem = items.find((item) => {
      const btn = item.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;
      if (!btn) return false;
      // Check composed path for events bubbling from shadow DOM
      if (e.composedPath().includes(btn)) return true;
      // Check tabindex for programmatic focus tracking
      return btn.getAttribute("tabindex") === "0";
    });

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (currentItem) {
          this._focusNextItem(currentItem);
        } else {
          this._focusFirstItem();
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (currentItem) {
          this._focusPreviousItem(currentItem);
        } else {
          this._focusLastItem();
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        this._focusFirstItem();
        break;
      }
      case "End": {
        e.preventDefault();
        this._focusLastItem();
        break;
      }
      case "Escape": {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
        this._anchorEl?.focus();
        break;
      }
      case "Tab": {
        // Close menu but allow natural focus movement
        this.hide();
        break;
      }
    }
  }

  // --- Item activation ---

  private _onItemSelect() {
    this.hide();
    this._anchorEl?.focus();
  }

  // --- Popover toggle event (native light-dismiss) ---

  private _onSurfaceToggle(e: Event) {
    const toggleEvent = e as ToggleEvent;
    if (toggleEvent.newState === "closed" && this.open) {
      this.open = false;
      this._removePositionListeners();
      this._setAnchorExpanded(false);
      this._fireOpenEvent(false);
    }
  }

  // --- Events ---

  private _fireOpenEvent(open: boolean) {
    const detail: FdMenuOpenChangeDetail = { open };

    this.dispatchEvent(
      new CustomEvent("fd-menu-open-change", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    // @deprecated Compatibility event. Remove in the next breaking major version.
    this.dispatchEvent(
      new CustomEvent("fd-open", {
        bubbles: true,
        composed: true,
        detail: { open },
      }),
    );
  }

  render() {
    return html`
      <div
        part="surface"
        class="surface"
        popover="auto"
        @toggle=${this._onSurfaceToggle}
      >
        <div
          part="menu"
          class="menu"
          role="menu"
          aria-label=${ifDefined(this.label)}
          aria-labelledby=${ifDefined(this.labelledby)}
          tabindex="-1"
          @keydown=${this._onMenuKeydown}
          @focusout=${this._onFocusOut}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}
