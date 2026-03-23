import { LitElement, nothing } from "lit";
import type { PropertyValues } from "lit";

/**
 * `fd-field` — A lightweight convenience wrapper that auto-wires
 * `fd-label`, `fd-input`, and `fd-message` children with matching
 * `for`/`id` attributes.
 *
 * Renders in **light DOM** (no shadow root) to avoid shadow DOM
 * boundary issues. Provides vertical flex layout with 6px gap
 * and neutralizes child margins to own spacing.
 *
 * `fd-field` is purely additive sugar — the three child components
 * work standalone without it. It does not proxy props, enforce
 * child ordering, or own the label/input/message.
 *
 * @example
 * ```html
 * <fd-field>
 *   <fd-label label="Email" required
 *     description="We'll never share your email"></fd-label>
 *   <fd-input name="email" type="email" required></fd-input>
 *   <fd-message state="error"
 *     message="Enter a valid email address"></fd-message>
 * </fd-field>
 * ```
 */
export class FdField extends LitElement {
  private _fieldId: string;
  private _childObserver: MutationObserver | null = null;
  /** Tracks the wired input ID to avoid redundant setAttribute calls. */
  private _wiredId: string | null = null;

  private static _counter = 0;
  /** Ensures the shared stylesheet is injected at most once. */
  private static _stylesInjected = false;

  constructor() {
    super();
    this._fieldId = `fd-field-${FdField._counter++}`;
  }

  /** Render into light DOM — no shadow root. */
  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      this._validateStructure();
      this._wireChildren();
      this._observeChildren();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopObserving();
  }

  override updated(_changed: PropertyValues) {
    // Re-wire only if children have changed since last wiring
    if (!this._wiredId) {
      this._wireChildren();
    }
  }

  // --- Structure validation ---

  private _validateStructure() {
    // Warn on nested fd-field
    if (this.parentElement?.closest("fd-field")) {
      console.warn(
        "[fd-field] Nested fd-field is not supported. The inner fd-field will not auto-wire correctly.",
      );
    }

    // Warn on multiple direct child fd-input
    const inputs = this._directChildren("fd-input");
    if (inputs.length > 1) {
      console.warn(
        "[fd-field] Multiple fd-input children found. Only the first will be auto-wired.",
      );
    }

    // Warn on duplicate direct child fd-label
    const labels = this._directChildren("fd-label");
    if (labels.length > 1) {
      console.warn(
        "[fd-field] Multiple fd-label children found. Only the first will be auto-wired.",
      );
    }

    // Warn on duplicate direct child fd-message
    const messages = this._directChildren("fd-message");
    if (messages.length > 1) {
      console.warn(
        "[fd-field] Multiple fd-message children found. Only the first will be auto-wired.",
      );
    }
  }

  // --- Child discovery (direct children only) ---

  private _directChildren(tagName: string): Element[] {
    const results: Element[] = [];
    for (const child of Array.from(this.children)) {
      if (child.tagName === tagName.toUpperCase()) {
        results.push(child);
      }
    }
    return results;
  }

  private _wireChildren() {
    const labels = this._directChildren("fd-label");
    const inputs = this._directChildren("fd-input");
    const messages = this._directChildren("fd-message");

    const input = inputs[0] as HTMLElement | undefined;
    const label = labels[0] as HTMLElement | undefined;
    const message = messages[0] as HTMLElement | undefined;

    // Auto-set id on fd-input if not already present
    if (input && !input.id) {
      input.id = this._fieldId;
    }

    const id = input?.id || this._fieldId;

    // Auto-set for on fd-label if not already present
    if (label && !label.getAttribute("for")) {
      label.setAttribute("for", id);
    }

    // Auto-set for on fd-message if not already present
    if (message && !message.getAttribute("for")) {
      message.setAttribute("for", id);
    }

    this._wiredId = id;
  }

  // --- Observe child mutations ---

  private _observeChildren() {
    this._stopObserving();
    this._childObserver = new MutationObserver(() => {
      // Reset wired state so the next update cycle re-wires
      this._wiredId = null;
      this._validateStructure();
      this._wireChildren();
    });
    this._childObserver.observe(this, {
      childList: true,
    });
  }

  private _stopObserving() {
    if (this._childObserver) {
      this._childObserver.disconnect();
      this._childObserver = null;
    }
  }

  // --- Styles ---

  private static _STYLES = `
    fd-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    fd-field[hidden] {
      display: none;
    }

    /* Neutralize child margins — fd-field owns the gap */
    fd-field > fd-label {
      margin-bottom: 0;
    }

    fd-field > fd-message [part="message"] {
      margin-top: 0;
    }
  `;

  private _injectStyles() {
    if (FdField._stylesInjected) return;
    const style = document.createElement("style");
    style.textContent = FdField._STYLES;
    document.head.appendChild(style);
    FdField._stylesInjected = true;
  }

  // --- Render ---

  render() {
    this._injectStyles();
    return nothing;
  }
}

if (!customElements.get("fd-field")) {
  customElements.define("fd-field", FdField);
}
