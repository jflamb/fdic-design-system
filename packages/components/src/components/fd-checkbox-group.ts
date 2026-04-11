import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { FdCheckboxGroupChangeDetail } from "../public-events.js";
import { GroupFormController } from "./group-form-controller.js";
import type { FdCheckbox } from "./fd-checkbox.js";
import "./fd-checkbox.js";
import { forcedColorsFieldGroup } from "./forced-colors.js";

export type CheckboxGroupOrientation = "vertical" | "horizontal";

export class FdCheckboxGroup extends LitElement {
  static formAssociated = true;

  static properties = {
    orientation: { reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { reflect: true },
    _descHasContent: { state: true },
    _errorHasContent: { state: true },
  };

  static styles = [forcedColorsFieldGroup, css`
    :host {
      display: block;
      max-inline-size: var(--fd-checkbox-group-max-width, 32rem);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
    }

    [part="fieldset"] {
      border: none;
      padding: 0;
      margin: 0;
      min-inline-size: 0;
      display: grid;
      gap: 0;
    }

    [part="legend"] {
      padding: 0;
      margin: 0 0 var(--fd-checkbox-group-legend-gap, var(--ds-spacing-xs, 8px)) 0;
      float: none;
      width: 100%;
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 600;
      line-height: 1.375;
      color: var(--ds-color-text-primary, #212123);
    }

    [part="description"] {
      color: var(--ds-color-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: var(--fdic-line-height-body, 1.5);
      margin: 0 0 var(--fd-checkbox-group-description-gap, var(--ds-spacing-sm, 12px)) 0;
    }

    [part="description"][hidden] {
      display: none;
    }

    [part="items"] {
      display: grid;
      gap: var(--fd-checkbox-group-gap, var(--ds-spacing-sm, 12px));
    }

    [part="items"].horizontal {
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      align-items: start;
    }

    [part="error"] {
      display: none;
      color: var(--ds-color-semantic-fg-error, #B10B2D);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    :host([data-user-invalid]) [part="error"] {
      display: block;
    }

    :host([data-user-invalid]) [part="fieldset"] {
      border-inline-start: 3px solid var(--ds-color-semantic-border-error, #B10B2D);
      padding-inline-start: var(--ds-spacing-sm, 12px);
    }

    /* forced-colors: provided by forcedColorsFieldGroup */

    @media (prefers-reduced-motion: reduce) {
      :host {
        transition: none !important;
      }
    }
  `];

  declare orientation: CheckboxGroupOrientation;
  declare required: boolean;
  declare disabled: boolean;
  declare label: string;
  declare _descHasContent: boolean;
  declare _errorHasContent: boolean;

  private _formController: GroupFormController;

  constructor() {
    super();
    this.orientation = "vertical";
    this.required = false;
    this.disabled = false;
    this.label = "";
    this._descHasContent = false;
    this._errorHasContent = false;
    this._formController = new GroupFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._getValidationAnchor(),
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

  override firstUpdated() {
    this._applyDisabledState();
    this._formController.sync();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._descHasContent = this._slotHasContent("description");
    this._errorHasContent = this._slotHasContent("error");
    this.addEventListener("change", this._onCheckboxChange as EventListener);
    this.addEventListener("focusout", this._onFocusOut as EventListener);
  }

  override disconnectedCallback() {
    this.removeEventListener("change", this._onCheckboxChange as EventListener);
    this.removeEventListener("focusout", this._onFocusOut as EventListener);
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has("disabled")) {
      this._applyDisabledState();
    }

    if (changed.has("required") || changed.has("disabled")) {
      this._formController.sync();
    }
  }

  checkValidity() {
    return this._formController.checkValidity();
  }

  reportValidity() {
    return this._formController.reportValidity();
  }

  formResetCallback() {
    this._formController.reset();
  }

  private _getCheckboxes() {
    return Array.from(this.querySelectorAll("fd-checkbox")) as FdCheckbox[];
  }

  private _getValidationAnchor() {
    return this._getCheckboxes().find((checkbox) => !checkbox.disabled);
  }

  private _syncFormValue() {
    this._formController.internals.setFormValue(null);
  }

  private _syncValidity() {
    if (!this.required || this.disabled) {
      this._formController.internals.setValidity({});
      return;
    }

    const checkboxes = this._getCheckboxes();
    const anyChecked = checkboxes.some((checkbox) => checkbox.checked);

    if (!anyChecked) {
      this._formController.internals.setValidity(
        { valueMissing: true },
        "Please select at least one option.",
        this._formController.getValidationAnchor(),
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  private _applyDisabledState() {
    const checkboxes = this._getCheckboxes();

    if (this.disabled) {
      for (const checkbox of checkboxes) {
        if (!checkbox.disabled) {
          checkbox.setAttribute("data-group-disabled", "");
          checkbox.disabled = true;
        }
      }
      return;
    }

    for (const checkbox of checkboxes) {
      if (checkbox.hasAttribute("data-group-disabled")) {
        checkbox.disabled = false;
        checkbox.removeAttribute("data-group-disabled");
      }
    }
  }

  private _slotHasContent(name: string) {
    return Array.from(this.querySelectorAll(`[slot="${name}"]`)).some(
      (node) => Boolean(node.textContent?.trim()),
    );
  }

  private _onDescSlotChange() {
    this._descHasContent = this._slotHasContent("description");
  }

  private _onErrorSlotChange() {
    this._errorHasContent = this._slotHasContent("error");
  }

  private _containsComposedTarget(target: EventTarget | null) {
    let current: Node | null = target instanceof Node ? target : null;

    while (current) {
      if (current === this) {
        return true;
      }

      if (current instanceof ShadowRoot) {
        current = current.host;
        continue;
      }

      current = current.parentNode;
    }

    return false;
  }

  private _getFieldsetDescribedBy() {
    const ids: string[] = [];
    if (this._descHasContent) {
      ids.push("desc");
    }
    if (this._errorHasContent && this.hasAttribute("data-user-invalid")) {
      ids.push("error-msg");
    }
    return ids.length > 0 ? ids.join(" ") : undefined;
  }

  private _onSlotChange() {
    this._applyDisabledState();
    this._formController.sync();
  }

  private _onCheckboxChange = (event?: Event) => {
    const target = event?.target;
    if (!(target instanceof HTMLElement) || target === this) {
      return;
    }
    if (!target.closest("fd-checkbox")) {
      return;
    }

    this._formController.markInteracted();
    this._formController.sync();

    const checkedValues = this._getCheckboxes()
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const detail: FdCheckboxGroupChangeDetail = {
      value: checkedValues[0] ?? "",
      values: checkedValues,
    };

    this.dispatchEvent(
      new CustomEvent("fd-checkbox-group-change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    // @deprecated Compatibility event. Remove in the next breaking major version.
    this.dispatchEvent(
      new CustomEvent("fd-group-change", {
        detail: { checkedValues },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _onFocusOut = (event: FocusEvent) => {
    if (this._containsComposedTarget(event.relatedTarget)) {
      return;
    }

    this._formController.revealIfInteractedAndInvalid();
  };

  render() {
    const describedBy = this._getFieldsetDescribedBy();
    const isUserInvalid = this.hasAttribute("data-user-invalid");

    return html`
      <fieldset
        part="fieldset"
        aria-describedby=${ifDefined(describedBy)}
        aria-invalid=${isUserInvalid ? "true" : nothing}
      >
        <legend part="legend">
          <slot name="legend">${this.label}</slot>
        </legend>
        <div part="description" id="desc" ?hidden=${!this._descHasContent}>
          <slot name="description" @slotchange=${this._onDescSlotChange}></slot>
        </div>
        <div
          part="items"
          class=${this.orientation === "horizontal" ? "horizontal" : "vertical"}
        >
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
        <div part="error" id="error-msg">
          <slot name="error" @slotchange=${this._onErrorSlotChange}></slot>
        </div>
      </fieldset>
    `;
  }
}
