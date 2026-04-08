import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { SingleValueFormController } from "./single-value-form-controller.js";
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
 * Supports `prefix` and `suffix` named slots for leading icons and
 * trailing action buttons (clear, password reveal, etc.).
 *
 * Designed to be paired with `fd-label` (accessible name) and `fd-message`
 * (validation/helper messages) as siblings in the same DOM tree.
 *
 * `fd-input` is the **single owner** of `aria-describedby` on the inner
 * `<input>`. It discovers associated `fd-label` and `fd-message` siblings
 * via their `for` attributes and reads their stable public getters
 * (`descriptionId`, `messageId`, `state`) to assemble the description.
 *
 * ## Parts
 *
 * - `base` — the visual input container (border, background, radius, states).
 *   Style this part to customize the input's appearance.
 * - `native` — the actual `<input>` element. Exposed for JS access;
 *   `::part()` cannot chain with pseudo-elements like `::placeholder`.
 *   Use `--fd-input-placeholder-color` to style placeholder text instead.
 * - `wrapper` — outermost wrapper containing the input container and char count.
 * - `char-count` — the visible character count display.
 *
 * ## CSS Custom Properties
 *
 * - `--fd-input-height` — min-height of the input (default: 44px)
 * - `--fd-input-border-color` — border color at rest
 * - `--fd-input-border-color-hover` — border color on hover
 * - `--fd-input-border-color-focus` — glow color on focus
 * - `--fd-input-border-radius` — corner radius
 * - `--fd-input-bg` — background color
 * - `--fd-input-placeholder-color` — placeholder text color
 * - `--fd-input-slot-size` — width of prefix/suffix slot containers (default: 44px)
 * - `--fd-input-icon-size` — icon glyph size inside prefix/suffix slots (default: 22px)
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
 *
 * @example Prefix/suffix slots
 * ```html
 * <fd-input id="search" type="search" placeholder="Search accounts">
 *   <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
 *   <button slot="suffix" type="button" aria-label="Clear search field">
 *     <fd-icon name="x" aria-hidden="true"></fd-icon>
 *   </button>
 * </fd-input>
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
    _hasPrefix: { state: true },
    _hasSuffix: { state: true },
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
  declare _hasPrefix: boolean;
  declare _hasSuffix: boolean;

  private _formController: SingleValueFormController;
  private _siblingObserver: MutationObserver | null = null;
  private _pendingDiscovery: number | null = null;
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
    this._hasPrefix = false;
    this._hasSuffix = false;
    this._formController = new SingleValueFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._input ?? undefined,
    });
    this._formController.internals.setFormValue(null);
    this._charCountId = `fdi-cc-${FdInput._instanceCounter}`;
    this._srCharCountId = `fdi-sr-cc-${FdInput._instanceCounter}`;
    FdInput._instanceCounter++;
  }

  private static _instanceCounter = 0;

  // --- Lifecycle ---

  override connectedCallback() {
    super.connectedCallback();
    this._formController.sync();
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
      changed.has("minlength") ||
      changed.has("maxlength") ||
      changed.has("disabled")
    ) {
      this._formController.sync();
    }
    if (changed.has("id")) {
      this._discoverSiblings();
    }
  }

  formResetCallback() {
    this.value = "";
    this._formController.reset();
    this._announced80 = false;
    this._announced100 = false;
  }

  // --- Form validity sync ---

  private _syncFormValue() {
    this._formController.internals.setFormValue(this.value || null);
  }

  private _syncValidity() {
    const anchor = this._formController.getValidationAnchor();

    if (this.disabled) {
      this._formController.internals.setValidity({});
      return;
    }

    if (this.required && !this.value) {
      this._formController.internals.setValidity(
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
      this._formController.internals.setValidity(
        { tooShort: true },
        `Please use at least ${this.minlength} characters.`,
        anchor,
      );
      return;
    }

    if (nativeValidity?.patternMismatch) {
      this._formController.internals.setValidity(
        { patternMismatch: true },
        "Please match the requested format.",
        anchor,
      );
      return;
    }

    this._formController.internals.setValidity({});
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
    // Prefer local parent to limit observation scope and avoid O(n*m)
    // cost when many fd-input instances each observe document.body.
    const observeTarget =
      this.parentElement ||
      (this.getRootNode() instanceof ShadowRoot
        ? (this.getRootNode() as unknown as Node)
        : document.body);
    this._siblingObserver = new MutationObserver(() => {
      // Debounce via rAF so rapid DOM mutations (e.g. framework renders)
      // coalesce into a single _discoverSiblings() call per frame.
      if (this._pendingDiscovery == null) {
        this._pendingDiscovery = requestAnimationFrame(() => {
          this._pendingDiscovery = null;
          this._discoverSiblings();
        });
      }
    });
    this._siblingObserver.observe(observeTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["for", "state", "message", "description"],
    });
  }

  private _stopObservingSiblings() {
    if (this._pendingDiscovery != null) {
      cancelAnimationFrame(this._pendingDiscovery);
      this._pendingDiscovery = null;
    }
    if (this._siblingObserver) {
      this._siblingObserver.disconnect();
      this._siblingObserver = null;
    }
  }

  // --- Accessible name assembly ---

  private _assembleAriaLabel(): string | null {
    const authoredAriaLabel = this.getAttribute("aria-label")?.trim();
    if (authoredAriaLabel) {
      return authoredAriaLabel;
    }

    const label = this._findLabel();
    const siblingLabel = label?.label?.trim();

    if (siblingLabel) {
      return siblingLabel;
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
    return this.shadowRoot?.querySelector("[part=native]") ?? null;
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
    return this._formController.form;
  }

  get validity() {
    return this._formController.validity;
  }

  get validationMessage() {
    return this._formController.validationMessage;
  }

  get willValidate() {
    return this._formController.willValidate;
  }

  checkValidity(): boolean {
    return this._formController.checkValidity();
  }

  reportValidity(): boolean {
    return this._formController.reportValidity();
  }

  // --- Events ---

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this._formController.markInteracted();
    this._formController.sync();
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
    this._formController.revealIfInteractedAndInvalid();
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

    /* --- Visual input container --- */
    [part="base"] {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: var(--fd-input-height, 44px);
      border: 2px solid transparent;
      border-color: var(
        --fd-input-border-color,
        var(--fdic-border-input-rest, #bdbdbf)
      );
      /* Reserve 2px border at rest so focus (which also uses 2px) causes no
         layout shift.  The visual difference vs. the old 1px border is
         negligible at this scale and the trade-off is worth the stability. */
      border-radius: var(
        --fd-input-border-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(--fd-input-bg, var(--fdic-background-base, #ffffff));
      box-sizing: border-box;
    }

    /* --- Native input --- */
    [part="native"] {
      flex: 1 1 auto;
      min-width: 0;
      min-height: var(--fd-input-height, 44px);
      padding: 8px 12px;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      box-sizing: border-box;
      outline: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    [part="native"]::placeholder {
      color: var(
        --fd-input-placeholder-color,
        var(--fdic-text-secondary, #595961)
      );
      opacity: 1;
    }

    /* Suppress browser-native search clear button (we provide our own) */
    [part="native"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
    }

    /* --- Hover --- */
    [part="base"]:hover:not(:has(:disabled)):not(:has(:read-only)) {
      border-color: var(
        --fd-input-border-color-hover,
        var(--fdic-border-input-active, #424244)
      );
    }

    /* --- Focus (on native input) --- */
    [part="base"]:has([part="native"]:focus-visible) {
      outline: none;
      border-color: var(--fdic-border-input-active, #424244);
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

    :host([disabled]) [part="native"] {
      cursor: not-allowed;
    }

    /* --- Read-only --- */
    :host([readonly]) [part="base"] {
      background: var(--fdic-background-container, #f5f5f7);
      border-color: var(--fdic-border-divider, #bdbdbf);
      border-style: dashed;
    }

    /* --- Validation state borders --- */
    :host([data-state="error"]) [part="base"] {
      border-color: var(--fdic-status-error, #d80e3a);
    }

    :host([data-state="warning"]) [part="base"] {
      border-color: var(--fdic-status-warning, #b48c14);
    }

    :host([data-state="success"]) [part="base"] {
      border-color: var(--fdic-status-success, #1e8232);
    }

    /* --- Prefix/suffix: decorative icons ---
       fd-icon sizes itself via :host { inline-size: var(--fd-icon-size) }.
       We set --fd-icon-size for proportional sizing and add padding so
       the icon is centered within a 44px-wide area without overriding
       the icon's own inline-size/block-size (which would stretch the SVG). */
    ::slotted(fd-icon[slot="prefix"]),
    ::slotted(fd-icon[slot="suffix"]) {
      --fd-icon-size: var(--fd-input-icon-size, 22px);
      flex-shrink: 0;
      /* Pad to center the glyph within the slot area */
      padding: 0 11px;
    }

    /* Decorative state icons should inherit the field state color. */
    :host([data-state="error"]) ::slotted(fd-icon[slot="suffix"]) {
      color: var(--fdic-status-error, #d80e3a);
    }

    /* --- Prefix/suffix: action buttons ---
       Buttons get explicit dimensions for the full 44×44 hit target.
       The fd-icon inside inherits --fd-icon-size from the button.
       Note: hover/active/focus styles below target suffix only —
       interactive buttons in the prefix slot are discouraged (see docs). */
    ::slotted(button[slot="prefix"]),
    ::slotted(button[slot="suffix"]) {
      --fd-icon-size: var(--fd-input-icon-size, 22px);
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--fd-input-slot-size, 44px);
      height: var(--fd-input-height, 44px);
      flex-shrink: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--fdic-corner-radius-sm, 3px);
      padding: 0;
      color: inherit;
      box-sizing: border-box;
    }

    ::slotted(button[slot="suffix"]:hover) {
      box-shadow: inset 0 0 0 999px
        var(--fdic-overlay-emphasize-100, rgba(0, 0, 0, 0.04));
    }

    ::slotted(button[slot="suffix"]:active) {
      box-shadow: inset 0 0 0 999px
        var(--fdic-overlay-emphasize-200, rgba(0, 0, 0, 0.08));
    }

    /* Suffix button focus — inset ring, independent of container */
    ::slotted(button[slot="suffix"]:focus-visible) {
      outline: 2px solid var(--fdic-border-input-active, #424244);
      outline-offset: -2px;
      box-shadow: 0 0 2.5px 2px
        var(--fdic-border-input-focus, #38b6ff);
      border-radius: var(--fdic-corner-radius-sm, 3px);
    }

    /* Reduce padding on native input when slots are present */
    .fd-input__has-prefix [part="native"] {
      padding-inline-start: 0;
    }

    .fd-input__has-suffix [part="native"] {
      padding-inline-end: 0;
    }

    /* Disabled slotted content */
    :host([disabled]) ::slotted([slot="prefix"]),
    :host([disabled]) ::slotted([slot="suffix"]) {
      opacity: 0.4;
      pointer-events: none;
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
      color: var(--fdic-status-warning, #8a6100);
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

      [part="base"]:has([part="native"]:focus-visible) {
        border-color: LinkText;
        outline: 2px solid LinkText;
      }

      :host([data-state="error"]) [part="base"] {
        border-color: LinkText;
        forced-color-adjust: none;
      }

      :host([data-state="error"]) ::slotted(fd-icon[slot="suffix"]) {
        color: LinkText;
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

      ::slotted(button[slot="suffix"]:focus-visible) {
        outline-color: LinkText;
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

      ::slotted(button[slot="suffix"]) {
        display: none;
      }
    }
  `;

  // --- Slot change handling ---

  private _onPrefixSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasPrefix = slot.assignedElements().length > 0;
  }

  private _onSuffixSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasSuffix = slot.assignedElements().length > 0;
  }

  // --- Render ---

  override render() {
    const ariaLabel = this._assembleAriaLabel();
    const describedBy = this._assembleDescribedBy();
    const isUserInvalid = this.hasAttribute("data-user-invalid");
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

    const baseClasses = [
      this._hasPrefix ? "fd-input__has-prefix" : "",
      this._hasSuffix ? "fd-input__has-suffix" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div part="wrapper">
        <div part="base" class=${baseClasses || nothing}>
          <slot name="prefix" @slotchange=${this._onPrefixSlotChange}></slot>
          <input
            part="native"
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
            aria-label=${ariaLabel ?? nothing}
            aria-describedby=${describedBy ?? nothing}
            aria-invalid=${isUserInvalid ? "true" : nothing}
            aria-required=${this.required ? "true" : nothing}
            @input=${this._onInput}
            @change=${this._onChange}
            @blur=${this._onBlur}
          />
          <slot name="suffix" @slotchange=${this._onSuffixSlotChange}></slot>
        </div>
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
