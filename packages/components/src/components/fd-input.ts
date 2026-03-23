import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import {
  attachInternalsCompat,
  type ElementInternalsLike,
} from "./internals.js";
import type { FdLabel } from "./fd-label.js";
import type { FdMessage, MessageState } from "./fd-message.js";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "search";

/**
 * `fd-input` — A form-associated text input web component.
 *
 * Wraps a native `<input>` in shadow DOM for style encapsulation while
 * preserving autofill, spell-check, input modes, and form submission.
 *
 * Designed to be paired with `fd-label` (accessible name) and `fd-message`
 * (validation/helper messages) as siblings in the same DOM tree.
 *
 * `fd-input` is the **single owner** of `aria-describedby` on the inner
 * `<input>`. It discovers associated `fd-label` and `fd-message` siblings
 * via their `for` attributes and reads their stable public getters
 * (`descriptionId`, `messageId`, `state`) to assemble the description.
 *
 * @example
 * ```html
 * <fd-label for="routing" label="Routing number" required
 *   description="9-digit number on the bottom of your check"></fd-label>
 * <fd-input id="routing" name="routing" required
 *   maxlength="9" placeholder="e.g. 021000021"></fd-input>
 * <fd-message for="routing" state="error"
 *   message="Enter a valid 9-digit routing number"></fd-message>
 * ```
 */
export class FdInput extends LitElement {
  static formAssociated = true;

  static properties = {
    type: { reflect: true },
    name: { reflect: true },
    value: { reflect: true },
    placeholder: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    maxlength: { type: Number, reflect: true },
    minlength: { type: Number, reflect: true },
    pattern: { reflect: true },
    autocomplete: { reflect: true },
    inputmode: { reflect: true },
    // Internal reactive state
    _messageState: { state: true },
  };

  declare type: InputType;
  declare name: string;
  declare value: string;
  declare placeholder: string | undefined;
  declare disabled: boolean;
  declare readonly: boolean;
  declare required: boolean;
  declare maxlength: number | undefined;
  declare minlength: number | undefined;
  declare pattern: string | undefined;
  declare autocomplete: string | undefined;
  declare inputmode: string | undefined;
  declare _messageState: MessageState;

  private _internals: ElementInternalsLike;
  private _siblingObserver: MutationObserver | null = null;
  private _charCountId: string;
  private _srCharCountId: string;
  /** Track which thresholds have been announced to avoid repeats */
  private _announced80 = false;
  private _announced100 = false;

  constructor() {
    super();
    this.type = "text";
    this.name = "";
    this.value = "";
    this.placeholder = undefined;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.maxlength = undefined;
    this.minlength = undefined;
    this.pattern = undefined;
    this.autocomplete = undefined;
    this.inputmode = undefined;
    this._messageState = "default";
    this._internals = attachInternalsCompat(this);
    this._charCountId = `fdi-cc-${FdInput._instanceCounter}`;
    this._srCharCountId = `fdi-sr-cc-${FdInput._instanceCounter}`;
    FdInput._instanceCounter++;
  }

  private static _instanceCounter = 0;

  // --- Lifecycle ---

  override connectedCallback() {
    super.connectedCallback();
    this._syncFormState();
    requestAnimationFrame(() => {
      this._discoverSiblings();
      this._observeSiblings();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopObservingSiblings();
  }

  override updated(changed: PropertyValues) {
    if (
      changed.has("value") ||
      changed.has("required") ||
      changed.has("pattern") ||
      changed.has("minlength")
    ) {
      this._syncFormState();
    }
    if (changed.has("id")) {
      this._discoverSiblings();
    }
  }

  formResetCallback() {
    this.value = "";
    this._syncFormState();
    this._announced80 = false;
    this._announced100 = false;
  }

  // --- Form validity sync ---

  private _syncFormState() {
    this._internals.setFormValue(this.value || null);
    const anchor = this._input ?? undefined;

    if (this.required && !this.value) {
      this._internals.setValidity(
        { valueMissing: true },
        "Please fill out this field.",
        anchor,
      );
      return;
    }

    // Mirror native constraint state into ElementInternals.
    // Visual state is NOT derived from these — fd-message owns visible state.
    const nativeValidity = this._input?.validity;

    if (nativeValidity?.tooShort) {
      this._internals.setValidity(
        { tooShort: true },
        `Please use at least ${this.minlength} characters.`,
        anchor,
      );
      return;
    }

    if (nativeValidity?.patternMismatch) {
      this._internals.setValidity(
        { patternMismatch: true },
        "Please match the requested format.",
        anchor,
      );
      return;
    }

    this._internals.setValidity({});
  }

  // --- Sibling discovery ---

  private _findLabel(): FdLabel | null {
    if (!this.id) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    const labels = root.querySelectorAll(`fd-label[for="${this.id}"]`);
    if (labels.length > 1) {
      console.warn(
        `[fd-input] Multiple fd-label elements found for "#${this.id}". Only the first in tree order will be used.`,
      );
    }
    return (labels[0] as FdLabel | undefined) ?? null;
  }

  private _findMessage(): FdMessage | null {
    if (!this.id) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    const messages = root.querySelectorAll(`fd-message[for="${this.id}"]`);
    if (messages.length > 1) {
      console.warn(
        `[fd-input] Multiple fd-message elements found for "#${this.id}". Only the first in tree order will be used.`,
      );
    }
    return (messages[0] as FdMessage | undefined) ?? null;
  }

  private _discoverSiblings() {
    const message = this._findMessage();
    this._messageState = (message?.state as MessageState) ?? "default";
    this.requestUpdate();
  }

  private _observeSiblings() {
    this._stopObservingSiblings();
    // Observe the same root used for discovery so late-added siblings
    // anywhere in the DOM root are detected, not just under parentElement.
    const rootNode = this.getRootNode();
    const observeTarget =
      rootNode instanceof Document
        ? rootNode.body
        : rootNode instanceof ShadowRoot
          ? (rootNode as unknown as Node)
          : this.parentElement || document.body;
    this._siblingObserver = new MutationObserver(() => {
      this._discoverSiblings();
    });
    this._siblingObserver.observe(observeTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["for", "state", "message", "description"],
    });
  }

  private _stopObservingSiblings() {
    if (this._siblingObserver) {
      this._siblingObserver.disconnect();
      this._siblingObserver = null;
    }
  }

  // --- aria-labelledby assembly ---

  private _assembleLabelledBy(): string | null {
    const label = this._findLabel();
    if (label?.labelId) {
      return label.labelId;
    }
    return null;
  }

  // --- aria-describedby assembly ---

  private _assembleDescribedBy(): string | null {
    const ids: string[] = [];

    const label = this._findLabel();
    if (label?.descriptionId) {
      ids.push(label.descriptionId);
    }

    const message = this._findMessage();
    if (message?.messageId && message.message?.trim()) {
      ids.push(message.messageId);
    }

    if (this.maxlength != null) {
      ids.push(this._charCountId);
    }

    return ids.length > 0 ? ids.join(" ") : null;
  }

  // --- Focus delegation ---

  private get _input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector("[part=base]") ?? null;
  }

  override focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  override blur() {
    this._input?.blur();
  }

  select() {
    this._input?.select();
  }

  // --- Form-associated getters (match fd-checkbox, fd-selector) ---

  get form() {
    return this._internals.form;
  }

  get validity() {
    return this._internals.validity;
  }

  get validationMessage() {
    return this._internals.validationMessage;
  }

  get willValidate() {
    return this._internals.willValidate;
  }

  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  // --- Events ---

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this._syncFormState();
    this._updateCharCountAnnouncement();

    this.dispatchEvent(
      new Event("input", { bubbles: true, composed: true }),
    );
  }

  private _onChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, composed: true }),
    );
  }

  private _onBlur() {
    this._announceCharCount();
  }

  // --- Character count ---

  private _updateCharCountAnnouncement() {
    if (this.maxlength == null) return;

    const used = this.value.length;
    const pct = used / this.maxlength;

    if (pct >= 1 && !this._announced100) {
      this._announced100 = true;
      this._announced80 = true;
      this._setLiveRegion("Character limit reached");
    } else if (pct >= 0.8 && !this._announced80) {
      this._announced80 = true;
      const remaining = this.maxlength - used;
      this._setLiveRegion(`${remaining} characters remaining`);
    }

    // Reset thresholds when user deletes below them
    if (pct < 0.8) {
      this._announced80 = false;
      this._announced100 = false;
    } else if (pct < 1) {
      this._announced100 = false;
    }
  }

  private _announceCharCount() {
    if (this.maxlength == null || !this.value) return;
    const remaining = this.maxlength - this.value.length;
    this._setLiveRegion(`${remaining} characters remaining`);
  }

  private _setLiveRegion(text: string) {
    const sr = this.shadowRoot?.getElementById(this._srCharCountId);
    if (sr) {
      // Clear and re-set to force announcement
      sr.textContent = "";
      requestAnimationFrame(() => {
        sr.textContent = text;
      });
    }
  }

  // --- Styles ---

  static styles = css`
    :host {
      display: block;
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
    }

    :host([hidden]) {
      display: none;
    }

    [part="wrapper"] {
      position: relative;
    }

    [part="base"] {
      display: block;
      width: 100%;
      min-height: var(--fd-input-height, 44px);
      padding: 8px 12px;
      border: 1px solid
        var(--fd-input-border-color, var(--fdic-border-input-rest, #bdbdbf));
      border-radius: var(
        --fd-input-border-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(--fd-input-bg, var(--fdic-background-base, #ffffff));
      font: inherit;
      color: inherit;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    [part="base"]::placeholder {
      color: var(--fdic-text-secondary, #595961);
      opacity: 1;
    }

    /* --- Hover --- */
    [part="base"]:hover:not(:disabled):not(:read-only) {
      border-color: var(
        --fd-input-border-color-hover,
        var(--fdic-border-input-active, #424244)
      );
    }

    /* --- Focus --- */
    [part="base"]:focus-visible {
      outline: none;
      border: 2px solid var(--fdic-border-input-active, #424244);
      box-shadow: 0 0 2.5px 2px
        var(
          --fd-input-border-color-focus,
          var(--fdic-border-input-focus, #38b6ff)
        );
    }

    /* --- Disabled --- */
    :host([disabled]) [part="base"] {
      color: var(--fdic-text-disabled, #9e9ea0);
      border-color: var(--fdic-border-divider, #bdbdbf);
      background: var(--fdic-background-container, #f5f5f7);
      cursor: not-allowed;
    }

    /* --- Read-only --- */
    [part="base"]:read-only {
      background: var(--fdic-background-container, #f5f5f7);
      border-color: var(--fdic-border-divider, #bdbdbf);
      border-style: dashed;
    }

    /* --- Validation state borders --- */
    :host([data-state="error"]) [part="base"] {
      border-width: 2px;
      border-color: var(--fdic-status-error, #d80e3a);
    }

    :host([data-state="warning"]) [part="base"] {
      border-width: 2px;
      border-color: var(--fdic-status-warning, #b48c14);
    }

    :host([data-state="success"]) [part="base"] {
      border-width: 2px;
      border-color: var(--fdic-status-success, #1e8232);
    }

    /* --- Character count --- */
    [part="char-count"] {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
      font-size: var(--fdic-font-size-body-small, 1rem);
      color: var(--fdic-text-secondary, #595961);
    }

    :host([data-char-warn]) [part="char-count"] {
      color: var(--fdic-status-warning, #b48c14);
    }

    :host([data-char-limit]) [part="char-count"] {
      color: var(--fdic-status-error, #d80e3a);
    }

    /* --- SR-only --- */
    .fd-input__sr-only {
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

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      [part="base"] {
        border-color: ButtonText;
      }

      [part="base"]:focus-visible {
        border-color: LinkText;
        outline: 2px solid LinkText;
      }

      :host([data-state="error"]) [part="base"] {
        border-color: LinkText;
        forced-color-adjust: none;
      }

      :host([data-state="warning"]) [part="base"],
      :host([data-state="success"]) [part="base"] {
        border-color: ButtonText;
        forced-color-adjust: none;
      }

      :host([disabled]) [part="base"] {
        border-color: GrayText;
        color: GrayText;
      }
    }

    /* --- Print --- */
    @media print {
      [part="base"] {
        border: 1px solid #000;
        background: none;
      }

      [part="char-count"] {
        display: none;
      }
    }
  `;

  // --- Render ---

  override render() {
    const labelledBy = this._assembleLabelledBy();
    const describedBy = this._assembleDescribedBy();
    const isError = this._messageState === "error";
    const hasCharCount = this.maxlength != null;
    const used = this.value?.length ?? 0;

    // Set data attributes on host for CSS state selectors
    if (this._messageState !== "default") {
      this.setAttribute("data-state", this._messageState);
    } else {
      this.removeAttribute("data-state");
    }

    if (hasCharCount) {
      const pct = used / this.maxlength!;
      if (pct >= 1) {
        this.setAttribute("data-char-limit", "");
        this.removeAttribute("data-char-warn");
      } else if (pct >= 0.8) {
        this.setAttribute("data-char-warn", "");
        this.removeAttribute("data-char-limit");
      } else {
        this.removeAttribute("data-char-warn");
        this.removeAttribute("data-char-limit");
      }
    } else {
      this.removeAttribute("data-char-warn");
      this.removeAttribute("data-char-limit");
    }

    return html`
      <div part="wrapper">
        <input
          part="base"
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          maxlength=${this.maxlength ?? nothing}
          minlength=${this.minlength ?? nothing}
          pattern=${this.pattern ?? nothing}
          autocomplete=${this.autocomplete ?? nothing}
          inputmode=${this.inputmode ?? nothing}
          aria-labelledby=${labelledBy ?? nothing}
          aria-describedby=${describedBy ?? nothing}
          aria-invalid=${isError ? "true" : nothing}
          aria-required=${this.required ? "true" : nothing}
          @input=${this._onInput}
          @change=${this._onChange}
          @blur=${this._onBlur}
        />
        ${hasCharCount
          ? html`
              <div part="char-count" id=${this._charCountId} aria-hidden="true">
                ${used} / ${this.maxlength}
              </div>
              <div
                id=${this._srCharCountId}
                class="fd-input__sr-only"
                aria-live="polite"
                role="status"
              ></div>
            `
          : nothing}
      </div>
    `;
  }
}

if (!customElements.get("fd-input")) {
  customElements.define("fd-input", FdInput);
}
