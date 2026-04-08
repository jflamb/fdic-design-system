import { LitElement, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { computePlacement } from "./placement.js";

/**
 * `fd-label` — A form label component with optional required indicator,
 * description/hint text, and InfoTip disclosure.
 *
 * Renders in **light DOM** (no shadow root) so the native `<label for>`
 * association works across the same DOM tree. This means the `for`/`id`
 * relationship between fd-label's internal `<label>` and the consumer's
 * `<input>` is real and robust for screen readers, click-to-focus, etc.
 *
 * **Same-root limitation:** The target control must share the same DOM root
 * tree as `fd-label` (typically the document). If the target input lives
 * inside another component's shadow root, the native `for`/`id` association
 * will not cross that boundary.
 *
 * @example
 * ```html
 * <fd-label for="account" label="Account number" required
 *   description="9-digit routing number"></fd-label>
 * <input id="account" type="text" required />
 * ```
 */
export class FdLabel extends LitElement {
  static properties = {
    for: { reflect: true },
    label: { reflect: true },
    required: { type: Boolean, reflect: true },
    description: { reflect: true },
    infotip: { reflect: true },
    infotipLabel: { attribute: "infotip-label", reflect: true },
    _infotipOpen: { state: true },
  };

  declare for: string | undefined;
  declare label: string;
  declare required: boolean;
  declare description: string | undefined;
  declare infotip: string | undefined;
  declare infotipLabel: string | undefined;
  declare _infotipOpen: boolean;

  private static _instanceCounter = 0;
  private _instanceId: number;
  private _wiredTarget: Element | null = null;
  private _wiredDescId: string | null = null;
  private _usesFallback = false;
  private _rafId: number | null = null;
  private _targetObserver: MutationObserver | null = null;
  private _removalObserver: MutationObserver | null = null;

  constructor() {
    super();
    this.for = undefined;
    this.label = "";
    this.required = false;
    this.description = undefined;
    this.infotip = undefined;
    this.infotipLabel = undefined;
    this._infotipOpen = false;
    this._instanceId = FdLabel._instanceCounter++;
  }

  /** Render into light DOM — no shadow root. */
  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Defer wiring so the target input has time to connect.
    // If the target doesn't exist yet, start observing for late arrivals.
    requestAnimationFrame(() => this._wireOrObserve());
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unwireDescribedBy();
    this._stopObserving();
    this._stopRemovalObserver();
    this._cleanupInfotip();
    this._removePositionListeners();
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  override updated(changed: PropertyValues) {
    if (changed.has("for")) {
      this._unwireDescribedBy();
      this._stopObserving();
      this._stopRemovalObserver();
      requestAnimationFrame(() => this._wireOrObserve());
    }
    if (changed.has("description")) {
      this._unwireDescribedBy();
      this._stopObserving();
      this._stopRemovalObserver();
      if (this.description) {
        requestAnimationFrame(() => this._wireOrObserve());
      }
    }
    // Close and clean up infotip if the attribute is removed while open.
    // Defer the state change to avoid triggering a re-update during update.
    if (changed.has("infotip") && !this.infotip && this._infotipOpen) {
      this._removePositionListeners();
      this._removeFallbackDismissListeners();
      this._usesFallback = false;
      requestAnimationFrame(() => {
        this._infotipOpen = false;
      });
    }
    if (changed.has("_infotipOpen") && this._infotipOpen) {
      requestAnimationFrame(() => this._positionInfotip());
    }
  }

  // --- Element IDs ---

  private get _descId(): string {
    const base = this.for || "label";
    return `${base}-desc-${this._instanceId}`;
  }

  private get _labelElId(): string {
    return `fdl-label-${this._instanceId}`;
  }

  private get _hasDescription(): boolean {
    return Boolean(this.description?.trim());
  }

  /**
   * Public getter for the rendered `<label>` element's ID.
   * Used by sibling components (e.g. `fd-input`) to wire `aria-labelledby`
   * on their inner focus target.
   */
  get labelId(): string {
    return this._labelElId;
  }

  /**
   * Public getter for the description element's ID.
   * Returns the ID when description text is present, `null` otherwise.
   * Used by sibling components (e.g. `fd-input`) to wire `aria-describedby`.
   */
  get descriptionId(): string | null {
    return this._hasDescription ? this._descId : null;
  }

  // --- aria-describedby auto-wiring ---

  private _resolveTarget(): Element | null {
    if (!this.for) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    return (
      root.getElementById?.(this.for) ??
      document.getElementById(this.for)
    );
  }

  /**
   * Try to wire aria-describedby. If the target doesn't exist yet,
   * start a MutationObserver to watch for it.
   */
  private _wireOrObserve() {
    this._wireDescribedBy();
    // If wiring failed (target not found yet) and we have a description, observe
    if (!this._wiredTarget && this._hasDescription && this.for) {
      this._observeForTarget();
    }
  }

  private _wireDescribedBy() {
    if (!this._hasDescription || !this.for) return;

    const target = this._resolveTarget();
    if (!target) {
      // Don't warn here — the observer may find the target later.
      // Warning is deferred to _observeForTarget timeout or disconnect.
      return;
    }

    // If the target is an fd-input, skip auto-wiring — fd-input owns
    // aria-describedby assembly and reads our descriptionId getter instead.
    if (target.tagName === "FD-INPUT") {
      this._stopObserving();
      return;
    }

    // Target found — stop observing if we were
    this._stopObserving();

    const descId = this._descId;
    const existing = target.getAttribute("aria-describedby") || "";
    const tokens = existing.split(/\s+/).filter(Boolean);

    if (!tokens.includes(descId)) {
      tokens.push(descId);
      target.setAttribute("aria-describedby", tokens.join(" "));
    }

    this._wiredTarget = target;
    this._wiredDescId = descId;

    // Watch for the target being removed so we can re-wire a replacement
    this._watchForTargetRemoval(target);
  }

  /**
   * Watch for the wired target element being removed from the DOM.
   * If removed, unwire and start observing for a replacement with the same ID.
   */
  private _watchForTargetRemoval(target: Element) {
    this._stopRemovalObserver();
    const root = target.parentElement || document.body;

    this._removalObserver = new MutationObserver(() => {
      // Check if the target is still connected
      if (!target.isConnected) {
        this._unwireDescribedBy();
        this._stopRemovalObserver();
        // Start observing for a replacement element with the same ID
        this._wireOrObserve();
      }
    });

    this._removalObserver.observe(root, { childList: true, subtree: true });
  }

  private _stopRemovalObserver() {
    if (this._removalObserver) {
      this._removalObserver.disconnect();
      this._removalObserver = null;
    }
  }

  /**
   * Watch the parent (or document body) for child additions until
   * the target element appears. Stops after finding it or on disconnect.
   */
  private _observeForTarget() {
    this._stopObserving();
    const root = this.parentElement || document.body;

    this._targetObserver = new MutationObserver(() => {
      if (this._resolveTarget()) {
        this._wireDescribedBy();
        this._stopObserving();
      }
    });

    this._targetObserver.observe(root, { childList: true, subtree: true });
  }

  private _stopObserving() {
    if (this._targetObserver) {
      this._targetObserver.disconnect();
      this._targetObserver = null;
    }
  }

  private _unwireDescribedBy() {
    if (!this._wiredTarget || !this._wiredDescId) return;

    const existing =
      this._wiredTarget.getAttribute("aria-describedby") || "";
    const tokens = existing
      .split(/\s+/)
      .filter((t) => t && t !== this._wiredDescId);

    if (tokens.length > 0) {
      this._wiredTarget.setAttribute("aria-describedby", tokens.join(" "));
    } else {
      this._wiredTarget.removeAttribute("aria-describedby");
    }

    this._wiredTarget = null;
    this._wiredDescId = null;
  }

  // --- InfoTip ---

  private _toggleInfotip() {
    if (this._infotipOpen) {
      this._closeInfotip();
    } else {
      this._openInfotip();
    }
  }

  private _openInfotip() {
    this._infotipOpen = true;
    const panel = this._getInfotipPanel();
    if (!panel) return;

    if (typeof panel.showPopover === "function") {
      try {
        panel.showPopover();
        this._usesFallback = false;
        this._positionInfotip();
        this._addPositionListeners();
        return;
      } catch {
        // popover not supported — fall through
      }
    }

    // Fallback
    this._usesFallback = true;
    panel.classList.add("fd-label__infotip-panel--fallback");
    panel.removeAttribute("hidden");
    this._positionInfotip();
    this._addPositionListeners();
    this._addFallbackDismissListeners();
  }

  private _closeInfotip() {
    this._infotipOpen = false;
    const panel = this._getInfotipPanel();
    if (!panel) return;

    this._removePositionListeners();

    if (!this._usesFallback && typeof panel.hidePopover === "function") {
      try {
        panel.hidePopover();
      } catch {
        // ignore
      }
    } else {
      panel.classList.remove("fd-label__infotip-panel--fallback");
      panel.setAttribute("hidden", "");
      this._removeFallbackDismissListeners();
    }
  }

  /** Force-close infotip and clean up all listeners/state. */
  private _cleanupInfotip() {
    if (this._infotipOpen) {
      this._infotipOpen = false;
    }
    this._usesFallback = false;
    this._removePositionListeners();
    this._removeFallbackDismissListeners();
  }

  private _getInfotipPanel(): HTMLElement | null {
    return this.querySelector(".fd-label__infotip-panel") as HTMLElement | null;
  }

  private _getInfotipTrigger(): HTMLButtonElement | null {
    return this.querySelector(
      ".fd-label__infotip-trigger",
    ) as HTMLButtonElement | null;
  }

  private _positionInfotip() {
    const trigger = this._getInfotipTrigger();
    const panel = this._getInfotipPanel();
    if (!trigger || !panel) return;

    const result = computePlacement(trigger, panel, "top-end");
    const anchorRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const isTop = result.placement.startsWith("top");

    // Toggle caret direction class
    panel.classList.toggle("fd-label__infotip-panel--below", !isTop);

    panel.style.position = "fixed";
    // Extra 8px gap for caret space
    panel.style.top = isTop
      ? `${anchorRect.top - panelRect.height - 8}px`
      : `${anchorRect.bottom + 8}px`;
    panel.style.left = `${anchorRect.right - panelRect.width}px`;
  }

  private _onInfotipKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && this._infotipOpen) {
      e.preventDefault();
      e.stopPropagation();
      this._closeInfotip();
      this._getInfotipTrigger()?.focus();
    }
  }

  private _onInfotipToggle(e: Event) {
    const toggleEvent = e as ToggleEvent;
    if (toggleEvent.newState === "closed" && this._infotipOpen) {
      this._infotipOpen = false;
      this._removePositionListeners();
    }
  }

  // --- Positioning listeners ---

  private _onScrollResize = () => {
    if (this._rafId !== null) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      if (this._infotipOpen) {
        this._positionInfotip();
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
  }

  // --- Fallback dismiss ---

  private _fallbackKeydownHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._infotipOpen) {
      e.preventDefault();
      this._closeInfotip();
      this._getInfotipTrigger()?.focus();
    }
  };

  private _fallbackClickHandler = (e: MouseEvent) => {
    if (!this._infotipOpen) return;
    const panel = this._getInfotipPanel();
    const trigger = this._getInfotipTrigger();
    const target = e.target as Node;
    if (trigger?.contains(target)) return;
    if (panel && !panel.contains(target)) {
      this._closeInfotip();
    }
  };

  private _addFallbackDismissListeners() {
    document.addEventListener("keydown", this._fallbackKeydownHandler);
    document.addEventListener("click", this._fallbackClickHandler, true);
  }

  private _removeFallbackDismissListeners() {
    document.removeEventListener("keydown", this._fallbackKeydownHandler);
    document.removeEventListener("click", this._fallbackClickHandler, true);
  }

  // --- Accessible label for InfoTip button ---

  private get _computedInfotipLabel(): string {
    if (this.infotipLabel) return this.infotipLabel;
    return this.label
      ? `More information about ${this.label}`
      : "More information";
  }

  // --- Render ---

  /** Inline <style> scoped via tag-qualified selectors. */
  private _renderStyles() {
    return html`<style>
      fd-label {
        display: block;
        margin-bottom: 6px;
        font-family: var(
          --fdic-font-family-sans-serif,
          "Source Sans 3",
          "Source Sans Pro",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          "Helvetica Neue",
          Arial,
          sans-serif
        );
        font-size: var(--fdic-font-size-body, 18px);
        line-height: 1.375;
        color: var(--fdic-text-primary, #212123);
        position: relative;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      fd-label[hidden] {
        display: none;
      }

      /* --- Label row --- */

      fd-label [part="label-row"] {
        display: flex;
        align-items: flex-start;
        gap: var(--fdic-spacing-xs, 8px);
        position: relative;
      }

      fd-label [part="label"] {
        display: inline-flex;
        gap: var(--fdic-spacing-3xs, 2px);
        align-items: baseline;
        margin: 0;
        padding: 0;
        cursor: pointer;
        font: inherit;
        color: inherit;
      }

      fd-label [part="required-indicator"] {
        font-weight: 600;
        color: var(--fdic-text-error, #d80e3a);
      }

      fd-label .fd-label__sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* --- Description --- */

      fd-label [part="description"] {
        color: var(--fdic-text-secondary, #595961);
        font-size: var(--fdic-font-size-body-small, 1rem);
        padding-right: 32px;
      }

      fd-label [part="description"][hidden] {
        display: none;
      }

      /* --- InfoTip trigger --- */

      fd-label [part="infotip-trigger"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 6px;
        border: none;
        border-radius: var(--fdic-corner-radius-full, 9999px);
        background: transparent;
        color: var(--fdic-icon-primary, #424244);
        cursor: pointer;
        position: absolute;
        /* Align icon visually with label text cap height */
        top: -6px;
        /* Shift right so the icon's right edge (not the padding) aligns with container edge */
        right: -6px;
        box-sizing: border-box;
      }

      fd-label [part="infotip-trigger"]:hover {
        box-shadow: inset 0 0 0 999px
          var(--fdic-overlay-emphasize-100, rgba(0, 0, 0, 0.04));
      }

      fd-label [part="infotip-trigger"]:active {
        box-shadow: inset 0 0 0 999px
          var(--fdic-overlay-emphasize-200, rgba(0, 0, 0, 0.08));
      }

      fd-label [part="infotip-trigger"]:focus-visible {
        outline-color: transparent;
        border: 2px solid var(--fdic-border-input-active, #424244);
        box-shadow: 0 0 2.5px 2px
          var(--fdic-border-input-focus, #38b6ff);
      }

      fd-label [part="infotip-trigger"][aria-expanded="true"] {
        color: var(--fdic-text-link, #1278b0);
      }

      fd-label [part="infotip-trigger"] .fd-label__infotip-icon {
        display: block;
        width: 24px;
        height: 24px;
      }

      /* --- InfoTip panel --- */

      fd-label .fd-label__infotip-panel {
        position: relative;
        margin: 0;
        padding: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-sm, 12px);
        border: none;
        border-radius: var(--fdic-corner-radius-lg, 7px);
        background: var(--fdic-background-tooltip, #212123);
        color: var(--ds-color-neutral-000, #ffffff);
        font-size: var(--fdic-font-size-body-small, 1rem);
        line-height: 1.375;
        max-width: 224px;
        box-shadow:
          0 1px 1px rgba(0, 0, 0, 0.08),
          0 2px 2px rgba(0, 0, 0, 0.06),
          0 4px 4px rgba(0, 0, 0, 0.04),
          0 6px 8px rgba(0, 0, 0, 0.04),
          0 8px 16px rgba(0, 0, 0, 0.04);
        z-index: 9999;
        box-sizing: border-box;
      }

      fd-label .fd-label__infotip-panel[popover] {
        inset: unset;
      }

      fd-label
        .fd-label__infotip-panel:not([open]):not(
          :popover-open
        ) {
        display: none;
      }

      fd-label .fd-label__infotip-panel--fallback {
        position: fixed;
        z-index: 9999;
      }

      fd-label
        .fd-label__infotip-panel--fallback[hidden] {
        display: none;
      }

      fd-label .fd-label__infotip-caret {
        position: absolute;
        bottom: -6px;
        right: 14px;
        width: 12px;
        height: 6px;
        overflow: hidden;
      }

      fd-label .fd-label__infotip-caret::after {
        content: "";
        position: absolute;
        top: -6px;
        left: 0;
        width: 12px;
        height: 12px;
        background: var(--fdic-background-tooltip, #212123);
        transform: rotate(45deg);
        transform-origin: center center;
      }

      /* Flip caret when panel is below the trigger */
      fd-label
        .fd-label__infotip-panel--below
        .fd-label__infotip-caret {
        bottom: unset;
        top: -6px;
      }

      fd-label
        .fd-label__infotip-panel--below
        .fd-label__infotip-caret::after {
        top: unset;
        bottom: -6px;
      }

      /* --- Forced colors --- */
      @media (forced-colors: active) {
        fd-label [part="required-indicator"] {
          color: LinkText;
          forced-color-adjust: none;
        }

        fd-label [part="infotip-trigger"] {
          color: ButtonText;
          border-color: ButtonText;
        }

        fd-label [part="infotip-trigger"]:focus-visible {
          border-color: LinkText;
          outline: 2px solid LinkText;
        }

        fd-label .fd-label__infotip-panel {
          border: 1px solid ButtonText;
          forced-color-adjust: none;
        }

        fd-label .fd-label__infotip-caret::after {
          background: ButtonText;
          forced-color-adjust: none;
        }
      }

      /* --- Reduced motion --- */
      @media (prefers-reduced-motion: reduce) {
        fd-label [part="infotip-trigger"] {
          transition: none;
        }
      }

      /* --- Print --- */
      @media print {
        fd-label [part="infotip-trigger"],
        fd-label .fd-label__infotip-panel {
          display: none !important;
        }

        fd-label [part="description"] {
          padding-right: 0;
        }
      }
    </style>`;
  }

  render() {
    const descId = this._descId;
    const panelId = `fd-label-panel-${this._instanceId}`;
    const hasInfotip = Boolean(this.infotip);
    const hasDesc = this._hasDescription;

    return html`
      ${this._renderStyles()}
      <div part="base">
        <div part="label-row">
          <label part="label" id=${this._labelElId} for=${this.for || nothing}>
            ${this.label}
            ${this.required
              ? html`<span part="required-indicator" aria-hidden="true"
                    >*</span
                  ><span class="fd-label__sr-only">(required)</span>`
              : nothing}
          </label>
          ${hasInfotip
            ? html`
                <button
                  part="infotip-trigger"
                  class="fd-label__infotip-trigger"
                  type="button"
                  aria-label=${this._computedInfotipLabel}
                  aria-expanded=${String(this._infotipOpen)}
                  aria-controls=${panelId}
                  @click=${this._toggleInfotip}
                  @keydown=${this._onInfotipKeydown}
                >
                  <svg
                    class="fd-label__infotip-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"
                    />
                  </svg>
                </button>
              `
            : nothing}
        </div>
        <div
          part="description"
          id=${descId}
          ?hidden=${!hasDesc}
        >
          ${hasDesc ? this.description : nothing}
        </div>
        ${hasInfotip
          ? html`
              <div
                class="fd-label__infotip-panel"
                id=${panelId}
                popover="auto"
                @toggle=${this._onInfotipToggle}
              >
                ${this.infotip}
                <span class="fd-label__infotip-caret" aria-hidden="true"></span>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}
