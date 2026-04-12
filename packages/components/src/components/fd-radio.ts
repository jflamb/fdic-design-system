import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { SingleValueFormController } from "./single-value-form-controller.js";

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
      color: var(--ds-color-text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: var(--ds-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--ds-font-size-body, 18px);
      line-height: 1.375;
    }

    :host([hidden]) {
      display: none;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: var(--fd-radio-gap, var(--ds-spacing-xs, 8px));
      max-inline-size: 100%;
      cursor: pointer;
      position: relative;
    }

    :host([disabled]) label {
      cursor: default;
    }

    [part="control"] {
      display: grid;
      place-content: center;
      inline-size: var(--fd-radio-size, 1.5em);
      block-size: var(--fd-radio-size, 1.5em);
      color: var(--fd-radio-icon-color, var(--ds-color-text-primary));
      flex-shrink: 0;
    }

    [part="control"] input {
      inline-size: var(--fd-radio-size, 1.5em);
      block-size: var(--fd-radio-size, 1.5em);
      margin: 0;
      box-sizing: border-box;
      accent-color: currentColor;
      outline-color: transparent;
      transition:
        outline-color var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease),
        box-shadow var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease),
        color var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease);
    }

    [part="control"] input:focus-visible {
      outline: 2.5px solid
        var(
          --fd-radio-focus-color,
          var(--ds-focus-ring-color)
        );
      outline-offset: 2px;
    }

    :host(:hover:not([disabled])) [part="control"] input {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-radio-overlay-hover,
          var(--ds-color-overlay-hover)
        );
    }

    :host(:active:not([disabled])) [part="control"] input {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-radio-overlay-active,
          var(--ds-color-overlay-pressed)
        );
    }

    :host([disabled]) [part="control"] {
      color: var(--fd-radio-icon-disabled, var(--ds-color-text-disabled));
    }

    :host([data-user-invalid]) [part="control"] {
      color: var(--fd-radio-invalid-color, var(--ds-color-semantic-fg-error));
    }

    [part="label"] {
      display: grid;
      gap: var(--ds-spacing-3xs, 2px);
      min-inline-size: 0;
      flex: 1;
      color: inherit;
    }

    .label-text {
      display: inline;
    }

    [part="description"] {
      display: block;
      color: var(--ds-color-text-secondary);
      font-size: var(--ds-font-size-body-small, 1rem);
    }

    [part="description"][hidden] {
      display: none;
    }

    :host([disabled]) [part="label"] {
      color: var(--ds-color-text-disabled);
    }

    @media (forced-colors: active) {
      [part="control"] input {
        box-shadow: none;
        outline-color: transparent;
      }

      :host([disabled]) [part="control"] input {
        color: GrayText;
      }

      [part="control"] input:focus-visible {
        outline-color: LinkText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part="control"] input {
        transition: none !important;
      }
    }

    @media print {
      [part="control"] input {
        box-shadow: none;
      }

      [part="control"] {
        color: #000;
      }
    }
  `;

  declare checked: boolean;
  declare disabled: boolean;
  declare required: boolean;
  declare name: string;
  declare value: string;
  declare _descriptionHasContent: boolean;

  private _formController: SingleValueFormController;
  private _input: HTMLInputElement | null = null;
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
    this._formController = new SingleValueFormController({
      host: this,
      syncFormValue: () => this._syncOwnFormValue(),
      syncValidity: () => this._syncOwnValidity(),
      getValidationAnchor: () => this._input ?? undefined,
    });
    this._formController.internals.setFormValue(null);
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

  override focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  override firstUpdated() {
    this._input = this.shadowRoot?.querySelector("input") ?? null;
    this._syncInputFromHost();
    if (this.checked) {
      this._uncheckGroupPeers();
    }
    this._syncGroupControllers();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._defaultChecked = this.hasAttribute("checked");
    this._descriptionHasContent = this._slotHasContent("description");
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
      this._syncGroupControllers();
    }
  }

  formResetCallback() {
    this.checked = this._defaultChecked;
    this._syncInputFromHost();
    if (this.checked) {
      this._uncheckGroupPeers();
    }
    this._formController.reset();
    this._syncGroupControllers();
  }

  checkValidity() {
    this._syncGroupControllers();
    return this._formController.checkCurrentValidity();
  }

  reportValidity() {
    this._syncGroupControllers();
    return this._formController.reportValidity();
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

  private _syncOwnFormValue() {
    this._formController.internals.setFormValue(this.checked ? this.value : null);
  }

  private _syncOwnValidity() {
    const hasGroupSelection = this._getGroupRadios().some((radio) => radio.checked);

    if (this.required && !hasGroupSelection) {
      this._formController.internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        this._formController.getValidationAnchor(),
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  private _syncGroupControllers() {
    for (const radio of this._getGroupRadios()) {
      radio._formController.sync();
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
    this._formController.markInteracted();
    this._uncheckGroupPeers();
    this._syncGroupControllers();
  }

  private _onInput() {
    this._commitUserSelection();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private _onChange() {
    this._commitUserSelection();
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private _onBlur() {
    this._formController.revealIfInteractedAndInvalid();
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
  render() {
    const describedBy = this._descriptionHasContent ? "description" : undefined;
    const isUserInvalid = this.hasAttribute("data-user-invalid");

    return html`
      <label>
        <span part="control">
          <input
            type="radio"
            aria-describedby=${ifDefined(describedBy)}
            aria-invalid=${isUserInvalid ? "true" : nothing}
            @input=${this._onInput}
            @change=${this._onChange}
            @keydown=${this._onKeydown}
            @blur=${this._onBlur}
          />
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
