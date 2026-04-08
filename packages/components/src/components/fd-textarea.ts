import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { SingleValueFormController } from "./single-value-form-controller.js";
import type { FdLabel } from "./fd-label.js";
import type { FdMessage, MessageState } from "./fd-message.js";
import { forcedColorsTextInput } from "./forced-colors.js";

/**
 * `fd-textarea` — A form-associated multiline text input web component.
 *
 * Wraps a native `<textarea>` in shadow DOM for style encapsulation while
 * preserving native text-editing behavior, form submission, and resize affordance.
 *
 * Designed to be paired with `fd-label` and `fd-message` as siblings in the
 * same DOM tree, matching the existing `fd-input` composition model.
 *
 * `fd-textarea` is the single owner of `aria-describedby` on the inner
 * `<textarea>`. It discovers associated `fd-label` and `fd-message` siblings
 * via matching `for` attributes and reads their stable public getters
 * (`descriptionId`, `messageId`, `state`) to assemble the description.
 *
 * ## Parts
 *
 * - `base` — the visual textarea container (border, background, radius, states)
 * - `native` — the actual `<textarea>` element
 * - `wrapper` — outermost wrapper containing the control and char count
 * - `char-count` — the visible character count display
 */
export class FdTextarea extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { reflect: true },
    value: { reflect: true },
    placeholder: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    rows: { type: Number, reflect: true },
    maxlength: { type: Number, reflect: true },
    minlength: { type: Number, reflect: true },
    autocomplete: { reflect: true },
    _messageState: { state: true },
  };

  declare name: string;
  declare value: string;
  declare placeholder: string | undefined;
  declare disabled: boolean;
  declare readonly: boolean;
  declare required: boolean;
  declare rows: number;
  declare maxlength: number | undefined;
  declare minlength: number | undefined;
  declare autocomplete: string | undefined;
  declare _messageState: MessageState;

  private _formController: SingleValueFormController;
  private _siblingObserver: MutationObserver | null = null;
  private _charCountId: string;
  private _srCharCountId: string;
  private _announced80 = false;
  private _announced100 = false;

  private static _instanceCounter = 0;

  constructor() {
    super();
    this.name = "";
    this.value = "";
    this.placeholder = undefined;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.rows = 5;
    this.maxlength = undefined;
    this.minlength = undefined;
    this.autocomplete = undefined;
    this._messageState = "default";
    this._formController = new SingleValueFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._textarea ?? undefined,
    });
    this._formController.internals.setFormValue(null);
    this._charCountId = `fdt-cc-${FdTextarea._instanceCounter}`;
    this._srCharCountId = `fdt-sr-cc-${FdTextarea._instanceCounter}`;
    FdTextarea._instanceCounter++;
  }

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

    const nativeValidity = this._textarea?.validity;

    if (nativeValidity?.tooShort) {
      this._formController.internals.setValidity(
        { tooShort: true },
        `Please use at least ${this.minlength} characters.`,
        anchor,
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  private _findLabel(): FdLabel | null {
    if (!this.id) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    const labels = root.querySelectorAll(`fd-label[for="${this.id}"]`);
    if (labels.length > 1) {
      console.warn(
        `[fd-textarea] Multiple fd-label elements found for "#${this.id}". Only the first in tree order will be used.`,
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
        `[fd-textarea] Multiple fd-message elements found for "#${this.id}". Only the first in tree order will be used.`,
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

  private _assembleAriaLabel(): string | null {
    const authoredAriaLabel = this.getAttribute("aria-label")?.trim();
    if (authoredAriaLabel) {
      return authoredAriaLabel;
    }

    const label = this._findLabel();
    const siblingLabel = label?.label?.trim();
    return siblingLabel || null;
  }

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

  private get _textarea(): HTMLTextAreaElement | null {
    return this.shadowRoot?.querySelector("[part=native]") ?? null;
  }

  override focus(options?: FocusOptions) {
    this._textarea?.focus(options);
  }

  override blur() {
    this._textarea?.blur();
  }

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

  private _onInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;
    this._formController.markInteracted();
    this._formController.sync();
    this._updateCharCountAnnouncement();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private _onChange() {
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private _onBlur() {
    this._announceCharCount();
    this._formController.revealIfInteractedAndInvalid();
  }

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
      sr.textContent = "";
      requestAnimationFrame(() => {
        sr.textContent = text;
      });
    }
  }

  static styles = [forcedColorsTextInput, css`
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
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
      min-height: var(--fd-textarea-min-height, 140px);
      border: 1px solid
        var(
          --fd-textarea-border-color,
          var(--fdic-border-input-rest, #bdbdbf)
        );
      border-radius: var(
        --fd-textarea-border-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(
        --fd-textarea-bg,
        var(--fdic-background-base, #ffffff)
      );
      box-sizing: border-box;
    }

    [part="native"] {
      display: block;
      width: 100%;
      min-height: var(--fd-textarea-min-height, 140px);
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
      resize: vertical;
      overflow: auto;
    }

    [part="native"]::placeholder {
      color: var(
        --fd-textarea-placeholder-color,
        var(--fdic-text-secondary, #595961)
      );
      opacity: 1;
    }

    [part="base"]:hover:not(:has(:disabled)):not(:has(:read-only)) {
      border-color: var(
        --fd-textarea-border-color-hover,
        var(--fdic-border-input-active, #424244)
      );
    }

    [part="base"]:has([part="native"]:focus-visible) {
      outline: none;
      border: 2px solid var(--fdic-border-input-active, #424244);
      box-shadow: 0 0 2.5px 2px
        var(
          --fd-textarea-border-color-focus,
          var(--fdic-border-input-focus, #38b6ff)
        );
    }

    :host([disabled]) [part="base"] {
      color: var(--fdic-text-disabled, #9e9ea0);
      border-color: var(--fdic-border-divider, #bdbdbf);
      background: var(--fdic-background-container, #f5f5f7);
      cursor: not-allowed;
    }

    :host([disabled]) [part="native"] {
      cursor: not-allowed;
      resize: none;
    }

    :host([readonly]) [part="base"] {
      background: var(--fdic-background-container, #f5f5f7);
      border-color: var(--fdic-border-divider, #bdbdbf);
      border-style: dashed;
    }

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

    .fd-textarea__sr-only {
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

    /* forced-colors: provided by forcedColorsTextInput */

    @media print {
      [part="base"] {
        border: 1px solid #000;
        background: none;
      }

      [part="char-count"] {
        display: none;
      }
    }
  `];

  override render() {
    const ariaLabel = this._assembleAriaLabel();
    const describedBy = this._assembleDescribedBy();
    const isUserInvalid = this.hasAttribute("data-user-invalid");
    const hasCharCount = this.maxlength != null;
    const used = this.value.length;
    const rows = this.rows > 0 ? this.rows : 5;

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
        <div part="base">
          <textarea
            part="native"
            .value=${this.value}
            rows=${rows}
            placeholder=${this.placeholder ?? nothing}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            maxlength=${this.maxlength ?? nothing}
            minlength=${this.minlength ?? nothing}
            autocomplete=${this.autocomplete ?? nothing}
            aria-label=${ariaLabel ?? nothing}
            aria-describedby=${describedBy ?? nothing}
            aria-invalid=${isUserInvalid ? "true" : nothing}
            aria-required=${this.required ? "true" : nothing}
            @input=${this._onInput}
            @change=${this._onChange}
            @blur=${this._onBlur}
          ></textarea>
        </div>
        ${hasCharCount
          ? html`
              <div part="char-count" id=${this._charCountId} aria-hidden="true">
                ${used} / ${this.maxlength}
              </div>
              <div
                id=${this._srCharCountId}
                class="fd-textarea__sr-only"
                aria-live="polite"
                role="status"
              ></div>
            `
          : nothing}
      </div>
    `;
  }
}
