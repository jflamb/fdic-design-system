import { LitElement, css, html, nothing } from "lit";

export type FdDrawerPlacement = "top";

export interface FdDrawerCloseRequestDetail {
  source: "backdrop" | "escape";
}

const DRAWER_CLOSE_MS = 240;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export class FdDrawer extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: { reflect: true },
    modal: { type: Boolean, reflect: true },
    placement: { reflect: true },
    _mounted: { state: true },
    _closing: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      z-index: 0;
    }

    :host([hidden]) {
      display: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .base {
      position: relative;
      z-index: 0;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 0;
      background: rgba(0, 18, 32, 0.34);
      opacity: 0;
      transition: opacity 240ms ease;
    }

    .surface {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 0.875rem;
      width: 100%;
      background: var(--fd-drawer-surface, #ffffff);
      color: var(--fd-drawer-color, inherit);
      border-block-end: 1px solid
        var(--fd-drawer-border-color, rgba(9, 53, 84, 0.14));
      box-shadow: var(
        --fd-drawer-shadow,
        0 18px 48px rgba(0, 18, 32, 0.22)
      );
      transform: translateY(-1.25rem);
      opacity: 0;
      transition:
        transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 240ms ease;
      will-change: transform, opacity;
    }

    .surface[data-placement="top"] {
      transform-origin: top center;
    }

    .surface[data-open="true"] {
      transform: translateY(0);
      opacity: 1;
    }

    .backdrop[data-open="true"] {
      opacity: 1;
    }

    .header {
      display: block;
    }

    .header[hidden] {
      display: none;
    }

    .body {
      display: block;
      min-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .surface {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .surface {
        border-color: CanvasText;
        box-shadow: none;
        forced-color-adjust: none;
      }

      .backdrop {
        background: Canvas;
        opacity: 0.65;
      }
    }
  `;

  declare open: boolean;
  declare label: string;
  declare modal: boolean;
  declare placement: FdDrawerPlacement;
  declare _mounted: boolean;
  declare _closing: boolean;

  private _closeTimer: number | null = null;
  private readonly _onDocumentKeyDownBound = this._onDocumentKeyDown.bind(this);

  constructor() {
    super();
    this.open = false;
    this.label = "";
    this.modal = false;
    this.placement = "top";
    this._mounted = false;
    this._closing = false;
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._onDocumentKeyDownBound, true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._clearCloseTimer();
    document.removeEventListener("keydown", this._onDocumentKeyDownBound, true);
  }

  override updated(changed: Map<PropertyKey, unknown>) {
    if (!changed.has("open")) {
      return;
    }

    if (this.open) {
      this._clearCloseTimer();
      this._mounted = true;
      this._closing = false;
      return;
    }

    if (!this._mounted) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this._closing = false;
      this._mounted = false;
      return;
    }

    this._closing = true;
    this._closeTimer = window.setTimeout(() => {
      this._closeTimer = null;
      if (!this.open) {
        this._closing = false;
        this._mounted = false;
      }
    }, DRAWER_CLOSE_MS);
  }

  override focus(options?: FocusOptions) {
    const firstFocusable = this._getFocusableElements()[0];
    if (firstFocusable) {
      firstFocusable.focus(options);
      return;
    }

    const surface = this.shadowRoot?.querySelector<HTMLElement>(".surface");
    surface?.focus(options);
  }

  private _clearCloseTimer() {
    if (this._closeTimer == null) {
      return;
    }

    window.clearTimeout(this._closeTimer);
    this._closeTimer = null;
  }

  private _onBackdropClick() {
    this._requestClose("backdrop");
  }

  private _onDocumentKeyDown(event: KeyboardEvent) {
    if (!this.open || !this.modal) {
      return;
    }

    const eventTarget = event.composedPath()[0];
    const isWithinDrawer =
      eventTarget instanceof Node &&
      (this.contains(eventTarget) || this.shadowRoot?.contains(eventTarget));

    if (!isWithinDrawer) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this._requestClose("escape");
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = this._getFocusableElements();
    if (focusable.length === 0) {
      return;
    }

    const active = this._getDeepActiveElement();
    const currentIndex = active ? focusable.indexOf(active) : -1;
    const nextIndex = event.shiftKey
      ? currentIndex <= 0
        ? focusable.length - 1
        : currentIndex - 1
      : currentIndex >= focusable.length - 1
        ? 0
        : currentIndex + 1;

    if (currentIndex === -1) {
      focusable[event.shiftKey ? focusable.length - 1 : 0]?.focus();
      event.preventDefault();
      return;
    }

    focusable[nextIndex]?.focus();
    event.preventDefault();
  }

  private _getFocusableElements(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) =>
        !element.hasAttribute("hidden") &&
        !element.closest("[hidden]") &&
        !element.hasAttribute("disabled"),
    );
  }

  private _getDeepActiveElement() {
    let active: Element | null = this.ownerDocument.activeElement;

    while (active instanceof HTMLElement && active.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }

    return active instanceof HTMLElement ? active : null;
  }

  private _requestClose(source: FdDrawerCloseRequestDetail["source"]) {
    const closeRequest = new CustomEvent<FdDrawerCloseRequestDetail>("fd-drawer-close-request", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { source },
    });

    this.dispatchEvent(closeRequest);
  }

  override render() {
    if (!this._mounted && !this.open) {
      return nothing;
    }

    const isVisible = this.open && !this._closing;
    const hasHeaderSlot = this.querySelector("[slot='header']");

    return html`
      <div class="base" part="base">
        ${this.modal
          ? html`
              <div
                class="backdrop"
                part="backdrop"
                data-open=${String(isVisible)}
                aria-hidden="true"
                @click=${this._onBackdropClick}
              ></div>
            `
          : nothing}
        <section
          class="surface"
          part="surface"
          data-placement=${this.placement}
          data-open=${String(isVisible)}
          role=${this.modal ? "dialog" : "region"}
          aria-label=${this.label || nothing}
          aria-modal=${this.modal ? "true" : nothing}
          tabindex="-1"
        >
          <div
            class="header"
            part="header"
            ?hidden=${!hasHeaderSlot}
          >
            <slot name="header"></slot>
          </div>
          <div class="body" part="body">
            <slot></slot>
          </div>
        </section>
      </div>
    `;
  }
}
