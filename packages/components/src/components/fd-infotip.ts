import { LitElement, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { computePlacement } from "./placement.js";

export type InfotipVariant = "icon" | "inline";
export type InfotipTriggerMode = "click" | "hover-focus";

const INFO_ICON_SVG = html`
  <svg
    class="fd-infotip__icon"
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"
    />
  </svg>
`;

/**
 * `fd-infotip` — A plain-text supplementary help disclosure.
 *
 * The default icon variant uses a button and click disclosure. The inline
 * variant can render an anchor trigger for text references such as footnotes.
 */
export class FdInfotip extends LitElement {
  static properties = {
    text: { reflect: true },
    label: { reflect: true },
    trigger: { reflect: true },
    href: { reflect: true },
    variant: { reflect: true },
    mode: { reflect: true },
    open: { type: Boolean, reflect: true },
  };

  declare text: string;
  declare label: string;
  declare trigger: string;
  declare href: string | undefined;
  declare variant: InfotipVariant;
  declare mode: InfotipTriggerMode;
  declare open: boolean;

  private static _instanceCounter = 0;
  private _instanceId: number;
  private _usesFallback = false;
  private _rafId: number | null = null;
  private _closeTimer: number | null = null;

  constructor() {
    super();
    this.text = "";
    this.label = "More information";
    this.trigger = "";
    this.href = undefined;
    this.variant = "icon";
    this.mode = "click";
    this.open = false;
    this._instanceId = FdInfotip._instanceCounter++;
  }

  /** Render into light DOM so aria-describedby and aria-controls IDREFs work. */
  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._onDocumentKeydown);
    document.addEventListener("click", this._onDocumentClick, true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup();
    document.removeEventListener("keydown", this._onDocumentKeydown);
    document.removeEventListener("click", this._onDocumentClick, true);
  }

  override updated(changed: PropertyValues) {
    if (changed.has("open")) {
      if (this.open) {
        this._showPanel();
      } else {
        this._hidePanel();
      }
    }

    if (changed.has("text") && !this._hasText && this.open) {
      this.open = false;
    }
  }

  get panelId(): string {
    return `fd-infotip-panel-${this._instanceId}`;
  }

  get triggerId(): string {
    return `fd-infotip-trigger-${this._instanceId}`;
  }

  private get _hasText(): boolean {
    return Boolean(this.text?.trim());
  }

  private get _isInline(): boolean {
    return this.variant === "inline";
  }

  private get _isHoverFocusMode(): boolean {
    return this.mode === "hover-focus";
  }

  private _getPanel(): HTMLElement | null {
    return this.querySelector(".fd-infotip__panel") as HTMLElement | null;
  }

  private _getTrigger(): HTMLElement | null {
    return this.querySelector(".fd-infotip__trigger") as HTMLElement | null;
  }

  private _openPanel() {
    if (!this._hasText) return;
    this._clearCloseTimer();
    this.open = true;
  }

  private _closePanel() {
    this.open = false;
  }

  private _togglePanel(event: Event) {
    if (this._isHoverFocusMode) return;
    event.preventDefault();
    this.open = !this.open;
  }

  private _showPanel() {
    const panel = this._getPanel();
    if (!panel) return;

    if (typeof panel.showPopover === "function") {
      try {
        panel.showPopover();
        this._usesFallback = false;
        this._positionPanel();
        this._addPositionListeners();
        return;
      } catch {
        // Popover not available in this environment; use the fallback path.
      }
    }

    this._usesFallback = true;
    panel.removeAttribute("hidden");
    panel.classList.add("fd-infotip__panel--fallback");
    this._positionPanel();
    this._addPositionListeners();
  }

  private _hidePanel() {
    const panel = this._getPanel();
    this._removePositionListeners();
    this._clearCloseTimer();
    if (!panel) return;

    if (!this._usesFallback && typeof panel.hidePopover === "function") {
      try {
        panel.hidePopover();
      } catch {
        // Ignore stale popover state.
      }
    } else {
      panel.setAttribute("hidden", "");
      panel.classList.remove("fd-infotip__panel--fallback");
    }
  }

  private _cleanup() {
    this._removePositionListeners();
    this._clearCloseTimer();
    this._usesFallback = false;
  }

  private _positionPanel() {
    const trigger = this._getTrigger();
    const panel = this._getPanel();
    if (!trigger || !panel) return;

    const result = computePlacement(trigger, panel, "top-end");
    const anchorRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const isTop = result.placement.startsWith("top");
    const gap = 8;
    const viewportPadding = 8;

    const top = isTop
      ? anchorRect.top - panelRect.height - gap
      : anchorRect.bottom + gap;
    const preferredLeft = anchorRect.right - panelRect.width;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - panelRect.width - viewportPadding);
    const left = Math.min(Math.max(viewportPadding, preferredLeft), maxLeft);

    panel.classList.toggle("fd-infotip__panel--below", !isTop);
    panel.style.position = "fixed";
    panel.style.top = `${Math.max(viewportPadding, top)}px`;
    panel.style.left = `${left}px`;
  }

  private _onScrollResize = () => {
    if (this._rafId !== null) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      if (this.open) {
        this._positionPanel();
      }
    });
  };

  private _addPositionListeners() {
    window.addEventListener("scroll", this._onScrollResize, { passive: true });
    window.addEventListener("resize", this._onScrollResize, { passive: true });
  }

  private _removePositionListeners() {
    window.removeEventListener("scroll", this._onScrollResize);
    window.removeEventListener("resize", this._onScrollResize);
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  private _onDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !this.open) return;
    event.preventDefault();
    this._closePanel();
    if (!this._isHoverFocusMode) {
      this._getTrigger()?.focus();
    }
  };

  private _onDocumentClick = (event: MouseEvent) => {
    if (!this.open || this._isHoverFocusMode) return;
    const target = event.target as Node | null;
    if (target && this.contains(target)) return;
    this._closePanel();
  };

  private _onToggle(event: Event) {
    const toggleEvent = event as ToggleEvent;
    if (toggleEvent.newState === "closed" && this.open) {
      this.open = false;
      this._cleanup();
    }
  }

  private _onTriggerPointerEnter() {
    if (!this._isHoverFocusMode) return;
    this._openPanel();
  }

  private _onTriggerPointerLeave() {
    if (!this._isHoverFocusMode) return;
    this._scheduleClose();
  }

  private _onTriggerFocus() {
    if (!this._isHoverFocusMode) return;
    this._openPanel();
  }

  private _onTriggerBlur() {
    if (!this._isHoverFocusMode) return;
    this._scheduleClose();
  }

  private _onPanelPointerEnter() {
    if (!this._isHoverFocusMode) return;
    this._clearCloseTimer();
  }

  private _onPanelPointerLeave() {
    if (!this._isHoverFocusMode) return;
    this._scheduleClose();
  }

  private _scheduleClose() {
    this._clearCloseTimer();
    this._closeTimer = window.setTimeout(() => this._closePanel(), 120);
  }

  private _clearCloseTimer() {
    if (this._closeTimer === null) return;
    window.clearTimeout(this._closeTimer);
    this._closeTimer = null;
  }

  private _renderStyles() {
    return html`<style>
      fd-infotip {
        display: inline-flex;
        font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
        position: relative;
        vertical-align: baseline;
      }

      fd-infotip[hidden] {
        display: none;
      }

      fd-infotip[variant="inline"] {
        display: inline;
        font-family: inherit;
      }

      :where(p, li):has(fd-infotip[variant="inline"]) {
        position: relative;
        z-index: 0;
      }

      fd-infotip[variant="inline"]::before {
        border-radius: 999px;
        content: "";
        block-size: 24px;
        inline-size: 24px;
        inset-block-start: 50%;
        inset-inline-start: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        z-index: -1;
      }

      fd-infotip .fd-infotip__trigger {
        border: none;
        border-radius: var(--fdic-corner-radius-full, 9999px);
        background: transparent;
        color: var(--fdic-color-icon-primary, #424244);
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
      }

      fd-infotip button.fd-infotip__trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 6px;
      }

      fd-infotip a.fd-infotip__trigger {
        color: var(--fdic-color-text-link, #1278b0);
        font-weight: 600;
        text-decoration: none;
      }

      fd-infotip a.fd-infotip__trigger .fd-infotip__trigger-label {
        position: relative;
      }

      fd-infotip .fd-infotip__trigger:hover {
        box-shadow: inset 0 0 0 999px
          var(--fdic-color-overlay-hover, rgba(0, 0, 0, 0.04));
      }

      fd-infotip a.fd-infotip__trigger:hover {
        box-shadow: none;
        text-decoration: underline;
      }

      fd-infotip[variant="inline"]:has(a.fd-infotip__trigger:hover)::before,
      fd-infotip[variant="inline"]:has(a.fd-infotip__trigger:focus-visible)::before,
      fd-infotip[variant="inline"][open]::before {
        background-color: var(--fdic-color-bg-container, #f5f5f7);
        box-shadow: inset 0 0 0 999px
          var(--fdic-color-overlay-hover, rgba(0, 0, 0, 0.04));
      }

      fd-infotip .fd-infotip__trigger:active {
        box-shadow: inset 0 0 0 999px
          var(--fdic-color-overlay-pressed, rgba(0, 0, 0, 0.08));
      }

      fd-infotip a.fd-infotip__trigger:active {
        box-shadow: none;
      }

      fd-infotip .fd-infotip__trigger:focus-visible {
        outline: 2px solid var(--fdic-color-border-input-focus, #38b6ff);
        outline-offset: 4px;
      }

      fd-infotip button.fd-infotip__trigger:focus-visible {
        outline-color: transparent;
        border: 2px solid var(--fdic-color-border-input-active, #424244);
        box-shadow: 0 0 2.5px 2px
          var(--fdic-color-border-input-focus, #38b6ff);
      }

      fd-infotip[open] button.fd-infotip__trigger {
        color: var(--fdic-color-text-link, #1278b0);
      }

      fd-infotip .fd-infotip__icon {
        display: block;
        width: 24px;
        height: 24px;
      }

      fd-infotip .fd-infotip__panel {
        position: relative;
        margin: 0;
        padding: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-sm, 12px);
        border: none;
        border-radius: var(--fdic-corner-radius-lg, 7px);
        background: var(--fdic-color-bg-inverted, #212123);
        color: var(--fdic-color-neutral-000, #ffffff);
        font-size: var(--fdic-font-size-body-small, 1rem);
        font-weight: 400;
        line-height: 1.375;
        max-width: min(224px, calc(100vw - 16px));
        box-shadow:
          0 1px 1px rgba(0, 0, 0, 0.08),
          0 2px 2px rgba(0, 0, 0, 0.06),
          0 4px 4px rgba(0, 0, 0, 0.04),
          0 6px 8px rgba(0, 0, 0, 0.04),
          0 8px 16px rgba(0, 0, 0, 0.04);
        z-index: 9999;
        box-sizing: border-box;
      }

      fd-infotip[variant="inline"] .fd-infotip__panel {
        font-size: var(--fdic-font-size-body-xs, 0.8125rem);
        max-width: min(22rem, calc(100vw - 16px));
      }

      fd-infotip .fd-infotip__panel[popover] {
        inset: unset;
      }

      fd-infotip .fd-infotip__panel:not([open]):not(:popover-open) {
        display: none;
      }

      fd-infotip .fd-infotip__panel--fallback {
        position: fixed;
      }

      fd-infotip .fd-infotip__panel--fallback[hidden] {
        display: none;
      }

      fd-infotip .fd-infotip__caret {
        position: absolute;
        bottom: -6px;
        right: 14px;
        width: 12px;
        height: 6px;
        overflow: hidden;
      }

      fd-infotip .fd-infotip__caret::after {
        content: "";
        position: absolute;
        top: -6px;
        left: 0;
        width: 12px;
        height: 12px;
        background: var(--fdic-color-bg-inverted, #212123);
        transform: rotate(45deg);
        transform-origin: center center;
      }

      fd-infotip .fd-infotip__panel--below .fd-infotip__caret {
        bottom: unset;
        top: -6px;
      }

      fd-infotip .fd-infotip__panel--below .fd-infotip__caret::after {
        top: unset;
        bottom: -6px;
      }

      @media (forced-colors: active) {
        fd-infotip .fd-infotip__trigger {
          color: ButtonText;
          border-color: ButtonText;
        }

        fd-infotip .fd-infotip__trigger:focus-visible {
          border-color: LinkText;
          outline: 2px solid LinkText;
        }

        fd-infotip .fd-infotip__panel {
          border: 1px solid ButtonText;
          forced-color-adjust: none;
        }

        fd-infotip .fd-infotip__caret::after {
          background: ButtonText;
          forced-color-adjust: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        fd-infotip .fd-infotip__trigger,
        fd-infotip .fd-infotip__panel {
          transition: none;
        }
      }

      @media print {
        fd-infotip .fd-infotip__panel,
        fd-infotip button.fd-infotip__trigger {
          display: none !important;
        }
      }
    </style>`;
  }

  render() {
    if (!this._hasText) return nothing;

    const common = {
      id: this.triggerId,
      class: "fd-infotip__trigger",
      "aria-label": this.label,
      "aria-expanded": String(this.open),
      "aria-controls": this.panelId,
      "aria-describedby": this.panelId,
    };

    const trigger = this.href
      ? html`<a
          part="trigger infotip-trigger"
          id=${common.id}
          class=${common.class}
          href=${this.href}
          role=${this._isInline ? "doc-noteref" : nothing}
          aria-label=${common["aria-label"]}
          aria-expanded=${common["aria-expanded"]}
          aria-controls=${common["aria-controls"]}
          aria-describedby=${common["aria-describedby"]}
          @pointerenter=${this._onTriggerPointerEnter}
          @pointerleave=${this._onTriggerPointerLeave}
          @focus=${this._onTriggerFocus}
          @blur=${this._onTriggerBlur}
        ><span class="fd-infotip__trigger-label">${this.trigger || this.label}</span></a>`
      : html`
          <button
            part="trigger infotip-trigger"
            id=${common.id}
            class=${common.class}
            type="button"
            aria-label=${common["aria-label"]}
            aria-expanded=${common["aria-expanded"]}
            aria-controls=${common["aria-controls"]}
            aria-describedby=${common["aria-describedby"]}
            @click=${this._togglePanel}
          >
            ${this.trigger || INFO_ICON_SVG}
          </button>
        `;

    const panel = html`<div
        class="fd-infotip__panel"
        id=${this.panelId}
        role="tooltip"
        popover="auto"
        ?hidden=${!this.open && this._usesFallback}
        @toggle=${this._onToggle}
        @pointerenter=${this._onPanelPointerEnter}
        @pointerleave=${this._onPanelPointerLeave}
      >
        ${this.text}
        <span class="fd-infotip__caret" aria-hidden="true"></span>
      </div>`;

    return html`${this._renderStyles()}${trigger}${panel}`;
  }
}
