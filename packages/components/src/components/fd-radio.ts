import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { attachInternalsCompat, type ElementInternalsLike } from "./internals.js";

export class FdRadio extends LitElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    name: { reflect: true },
    value: { reflect: true },
    _descriptionHasContent: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--fdic-text-primary, #212123);
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
    }

    :host([hidden]) {
      display: none;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: var(--fd-radio-gap, var(--fdic-spacing-xs, 8px));
      max-inline-size: 100%;
      cursor: pointer;
      position: relative;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([disabled]) label {
      cursor: default;
    }

    [part="control"] {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-radio-size, 24px);
      block-size: var(--fd-radio-size, 24px);
      color: var(--fd-radio-icon-color, var(--fdic-text-primary, #212123));
      flex-shrink: 0;
    }

    [part="control"] input {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
      opacity: 0;
    }

    .visual {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 100%;
      block-size: 100%;
      border-radius: 9999px;
      box-sizing: border-box;
      transition:
        box-shadow 120ms ease,
        color 120ms ease,
        opacity 120ms ease;
    }

    .outer {
      inline-size: var(--fd-radio-glyph-size, 22px);
      block-size: var(--fd-radio-glyph-size, 22px);
      border-radius: 9999px;
      border: var(--fd-radio-border-width, 2px) solid currentColor;
      box-sizing: border-box;
    }

    .dot {
      position: absolute;
      inline-size: var(--fd-radio-dot-size, 8px);
      block-size: var(--fd-radio-dot-size, 8px);
      border-radius: 9999px;
      background: currentColor;
      opacity: 0;
      transform: scale(0.75);
      transition:
        opacity 120ms ease,
        transform 120ms ease;
    }

    :host([checked]) .dot {
      opacity: 1;
      transform: scale(1);
    }

    [part="control"]:has(input:focus-visible) .outer,
    [part="control"] input:focus-visible + .visual .outer {
      outline: 2.5px solid
        var(
          --fd-radio-focus-color,
          var(--fdic-border-input-focus, #38b6ff)
        );
      outline-offset: 2px;
    }

    :host(:hover:not([disabled])) .visual {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-radio-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    :host(:active:not([disabled])) .visual {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-radio-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    :host([disabled]) [part="control"] {
      color: var(--fd-radio-icon-disabled, var(--fdic-text-disabled, #9e9ea0));
    }

    :host([data-user-invalid]) [part="control"] {
      color: var(--fd-radio-invalid-color, rgb(190, 40, 40));
    }

    [part="label"] {
      display: grid;
      gap: var(--fdic-spacing-3xs, 2px);
      min-inline-size: 0;
      flex: 1;
      color: inherit;
    }

    .label-text {
      display: inline;
    }

    [part="description"] {
      display: block;
      color: var(--fdic-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    [part="description"][hidden] {
      display: none;
    }

    :host([disabled]) [part="label"] {
      color: var(--fdic-text-disabled, var(--ds-color-text-disabled, #9e9ea0));
    }

    @media (forced-colors: active) {
      .visual {
        forced-color-adjust: none;
        box-shadow: none;
        color: ButtonText;
      }

      :host([disabled]) .visual {
        color: GrayText;
      }

      :host([checked]) .outer,
      :host([checked]) .dot {
        color: Highlight;
      }

      [part="control"]:has(input:focus-visible) .outer,
      [part="control"] input:focus-visible + .visual .outer {
        outline-color: LinkText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .visual,
      .dot {
        transition: none !important;
      }
    }
  `;

  declare checked: boolean;
  declare disabled: boolean;
  declare required: boolean;
  declare name: string;
  declare value: string;
  declare _descriptionHasContent: boolean;

  private _internals: ElementInternalsLike;
  private _input: HTMLInputElement | null = null;
  private _userHasInteracted = false;
  private _defaultChecked: boolean;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.name = "";
    this.value = "on";
    this._descriptionHasContent = false;
    this._defaultChecked = this.hasAttribute("checked");
    this._internals = attachInternalsCompat(this);
    this._internals.setFormValue(null);
  }

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

  override focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  override firstUpdated() {
    this._input = this.shadowRoot?.querySelector("input") ?? null;
    this._syncInputFromHost();
    if (this.checked) {
      this._uncheckGroupPeers();
    }
    this._syncGroupValidity();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._defaultChecked = this.hasAttribute("checked");
    this._descriptionHasContent = this._slotHasContent("description");
    this.addEventListener("invalid", this._onInvalid as EventListener);
  }

  override disconnectedCallback() {
    this.removeEventListener("invalid", this._onInvalid as EventListener);
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValues<this>) {
    if (
      changed.has("checked") ||
      changed.has("disabled") ||
      changed.has("required") ||
      changed.has("name") ||
      changed.has("value")
    ) {
      this._syncInputFromHost();
      if (this.checked) {
        this._uncheckGroupPeers();
      }
      this._syncGroupValidity();
    }
  }

  formResetCallback() {
    this.checked = this._defaultChecked;
    this._userHasInteracted = false;
    this.removeAttribute("data-user-invalid");
    this._syncInputFromHost();
    if (this.checked) {
      this._uncheckGroupPeers();
    }
    this._syncGroupValidity();
  }

  checkValidity() {
    this._syncGroupValidity();
    return this._internals.checkValidity();
  }

  reportValidity() {
    this._syncGroupValidity();
    return this._internals.reportValidity();
  }

  private _getAllRadios() {
    const root = this.getRootNode() as Document | ShadowRoot;
    return Array.from(root.querySelectorAll("fd-radio")) as FdRadio[];
  }

  private _isInSameGroup(other: FdRadio) {
    if (other === this) return true;
    if (other.name !== this.name) return false;

    if (this.form || other.form) {
      return this.form === other.form;
    }

    return this.getRootNode() === other.getRootNode();
  }

  private _getGroupRadios() {
    if (!this.name) {
      return [this];
    }

    return this._getAllRadios().filter((radio) => this._isInSameGroup(radio));
  }

  private _getEnabledGroupRadios() {
    return this._getGroupRadios().filter((radio) => !radio.disabled);
  }

  private _syncInputFromHost() {
    if (!this._input) {
      return;
    }

    this._input.checked = this.checked;
    this._input.disabled = this.disabled;
    this._input.required = this.required;
    this._input.name = this.name;
    this._input.value = this.value;
  }

  private _syncOwnFormState() {
    this._internals.setFormValue(this.checked ? this.value : null);

    const hasGroupSelection = this._getGroupRadios().some((radio) => radio.checked);

    if (this.required && !hasGroupSelection) {
      this._internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        this._input ?? undefined,
      );
      if (this._userHasInteracted) {
        this.setAttribute("data-user-invalid", "");
      }
      return;
    }

    this._internals.setValidity({});
    this.removeAttribute("data-user-invalid");
  }

  private _syncGroupValidity() {
    for (const radio of this._getGroupRadios()) {
      radio._syncOwnFormState();
    }
  }

  private _uncheckGroupPeers() {
    if (!this.checked || !this.name) {
      return;
    }

    for (const radio of this._getGroupRadios()) {
      if (radio !== this && radio.checked) {
        radio.checked = false;
        radio._syncInputFromHost();
      }
    }
  }

  private _slotHasContent(name: string) {
    return Array.from(this.querySelectorAll(`[slot="${name}"]`)).some(
      (node) => Boolean(node.textContent?.trim()),
    );
  }

  private _onDescriptionSlotChange() {
    this._descriptionHasContent = this._slotHasContent("description");
  }

  private _commitUserSelection() {
    this.checked = true;
    this._userHasInteracted = true;
    this._uncheckGroupPeers();
    this._syncGroupValidity();
  }

  private _onInput() {
    this._commitUserSelection();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private _onChange() {
    this._commitUserSelection();
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private _onKeydown(event: KeyboardEvent) {
    if (!["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.key)) {
      return;
    }

    const radios = this._getEnabledGroupRadios();
    if (radios.length < 2) {
      return;
    }

    event.preventDefault();
    const currentIndex = Math.max(0, radios.indexOf(this));
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + radios.length) % radios.length;
    const nextRadio = radios[nextIndex];

    nextRadio._commitUserSelection();
    nextRadio.focus();
    // Shadow-root-separated radios do not get the browser's native group event
    // behavior, so mirror both events for consumers listening at the host level.
    nextRadio.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    nextRadio.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private _onInvalid = () => {
    this.setAttribute("data-user-invalid", "");
  };

  render() {
    const describedBy = this._descriptionHasContent ? "description" : undefined;

    return html`
      <label>
        <span part="control">
          <input
            type="radio"
            aria-describedby=${ifDefined(describedBy)}
            @input=${this._onInput}
            @change=${this._onChange}
            @keydown=${this._onKeydown}
          />
          <span class="visual" aria-hidden="true">
            <span class="outer"></span>
            <span class="dot"></span>
          </span>
        </span>
        <span part="label">
          <span class="label-text"><slot></slot></span>
          <span
            part="description"
            id="description"
            ?hidden=${!this._descriptionHasContent}
          >
            <slot name="description" @slotchange=${this._onDescriptionSlotChange}></slot>
          </span>
        </span>
      </label>
    `;
  }
}

if (!customElements.get("fd-radio")) {
  customElements.define("fd-radio", FdRadio);
}
