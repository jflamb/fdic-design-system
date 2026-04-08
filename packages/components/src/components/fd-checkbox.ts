import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { SingleValueFormController } from "./single-value-form-controller.js";

export class FdCheckbox extends LitElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    indeterminate: { type: Boolean, reflect: true },
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
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
      gap: var(--fd-checkbox-gap, var(--fdic-spacing-xs, 8px));
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
      inline-size: var(--fd-checkbox-size, 1.5em);
      block-size: var(--fd-checkbox-size, 1.5em);
      color: var(--fd-checkbox-border-color, var(--fdic-text-primary, #212123));
      flex-shrink: 0;
    }

    [part="control"] input {
      inline-size: var(--fd-checkbox-size, 1.5em);
      block-size: var(--fd-checkbox-size, 1.5em);
      margin: 0;
      border-radius: var(
        --fd-checkbox-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      accent-color: currentColor;
      box-sizing: border-box;
      outline-color: transparent;
      transition:
        outline-color 120ms ease,
        box-shadow 120ms ease,
        color 120ms ease;
    }

    [part="control"] input:focus-visible {
      outline: 2.5px solid
        var(
          --fd-checkbox-focus-color,
          var(--fdic-border-input-focus, #38b6ff)
        );
      outline-offset: 2px;
    }

    :host(:hover:not([disabled])) [part="control"] input {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-checkbox-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    :host(:active:not([disabled])) [part="control"] input {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-checkbox-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    :host([disabled]) [part="control"] {
      color: var(--fdic-text-disabled, #9e9ea0);
    }

    :host([data-user-invalid]) [part="control"] {
      color: var(--fd-checkbox-invalid-color, var(--ds-color-semantic-fg-error, #B10B2D));
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
      color: var(--fdic-text-disabled, #9e9ea0);
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
        outline: 2px solid LinkText;
        outline-offset: 2px;
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
  declare indeterminate: boolean;
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
    this.indeterminate = false;
    this.disabled = false;
    this.required = false;
    this.name = "";
    this.value = "on";
    this._descriptionHasContent = false;
    this._defaultChecked = this.hasAttribute("checked");
    this._formController = new SingleValueFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
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
    this._formController.sync();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._defaultChecked = this.hasAttribute("checked");
    this._descriptionHasContent = this._slotHasContent("description");
  }

  override updated(changed: PropertyValues<this>) {
    if (
      changed.has("checked") ||
      changed.has("indeterminate") ||
      changed.has("disabled") ||
      changed.has("required") ||
      changed.has("name") ||
      changed.has("value")
    ) {
      this._syncInputFromHost();
      this._formController.sync();
    }
  }

  formResetCallback() {
    this.checked = this._defaultChecked;
    this.indeterminate = false;
    this._syncInputFromHost();
    this._formController.reset();
  }

  checkValidity() {
    return this._formController.checkValidity();
  }

  reportValidity() {
    return this._formController.reportValidity();
  }

  private _syncInputFromHost() {
    if (!this._input) {
      return;
    }

    this._input.checked = this.checked;
    this._input.indeterminate = this.indeterminate;
    this._input.disabled = this.disabled;
    this._input.required = this.required;
    this._input.name = this.name;
    this._input.value = this.value;
  }

  private _syncFormValue() {
    this._formController.internals.setFormValue(this.checked ? this.value : null);
  }

  private _syncValidity() {
    if (this.required && !this.checked) {
      this._formController.internals.setValidity(
        { valueMissing: true },
        "This checkbox is required.",
        this._formController.getValidationAnchor(),
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  private _slotHasContent(name: string) {
    return Array.from(this.querySelectorAll(`[slot="${name}"]`)).some(
      (node) => Boolean(node.textContent?.trim()),
    );
  }

  private _onDescriptionSlotChange() {
    this._descriptionHasContent = this._slotHasContent("description");
  }

  private _syncFromInput(input: HTMLInputElement) {
    this.checked = input.checked;
    this.indeterminate = false;
    this._formController.markInteracted();
    this._formController.sync();
  }

  private _onInput(event: Event) {
    this._syncFromInput(event.target as HTMLInputElement);
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private _onChange(event: Event) {
    this._syncFromInput(event.target as HTMLInputElement);
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private _onBlur() {
    this._formController.revealIfInteractedAndInvalid();
  }
  render() {
    const describedBy = this._descriptionHasContent ? "description" : undefined;
    const isUserInvalid = this.hasAttribute("data-user-invalid");

    return html`
      <label>
        <span part="control">
          <input
            type="checkbox"
            aria-describedby=${ifDefined(describedBy)}
            aria-invalid=${isUserInvalid ? "true" : nothing}
            @input=${this._onInput}
            @change=${this._onChange}
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
