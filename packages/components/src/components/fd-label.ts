import { LitElement, html, nothing } from "lit";
import type { PropertyValues } from "lit";

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
  };

  declare for: string | undefined;
  declare label: string;
  declare required: boolean;
  declare description: string | undefined;
  declare infotip: string | undefined;
  declare infotipLabel: string | undefined;

  private static _instanceCounter = 0;
  private _instanceId: number;
  private _wiredTarget: Element | null = null;
  private _wiredDescId: string | null = null;
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
        font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
        font-size: var(--fdic-font-size-body, 18px);
        line-height: 1.375;
        color: var(--fdic-color-text-primary, #212123);
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
        color: var(--fdic-color-text-error, #d80e3a);
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
        color: var(--fdic-color-text-secondary, #595961);
        font-size: var(--fdic-font-size-body-small, 1rem);
      }

      fd-label[infotip] [part="description"] {
        padding-right: 32px;
      }

      fd-label [part="description"][hidden] {
        display: none;
      }

      fd-label .fd-label__infotip {
        position: absolute;
        /* Align icon visually with label text cap height */
        top: -6px;
        /* Shift right so the icon's right edge (not the padding) aligns with container edge */
        right: -6px;
      }

      /* --- Forced colors --- */
      @media (forced-colors: active) {
        fd-label [part="required-indicator"] {
          color: LinkText;
          forced-color-adjust: none;
        }

      }

      /* --- Print --- */
      @media print {
        fd-label [part="description"] {
          padding-right: 0;
        }
      }
    </style>`;
  }

  render() {
    const descId = this._descId;
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
                <fd-infotip
                  part="infotip"
                  class="fd-label__infotip"
                  text=${this.infotip || nothing}
                  label=${this._computedInfotipLabel}
                ></fd-infotip>
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
      </div>
    `;
  }
}
