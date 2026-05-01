import type { FdCheckboxGroupChangeDetail } from "../public-events.js";
import type { FdCheckbox } from "./fd-checkbox.js";
import "./fd-checkbox.js";
import {
  FormGroupBase,
  fieldGroupStyles,
  type FormGroupOrientation,
} from "./form-group-base.js";

export type CheckboxGroupOrientation = FormGroupOrientation;

export class FdCheckboxGroup extends FormGroupBase<FdCheckbox> {
  static formAssociated = true;

  static properties = {
    orientation: { reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { reflect: true },
    _descHasContent: { state: true },
    _errorHasContent: { state: true },
  };

  static styles = fieldGroupStyles("fd-checkbox-group");

  declare orientation: CheckboxGroupOrientation;
  declare required: boolean;
  declare disabled: boolean;
  declare label: string;
  declare _descHasContent: boolean;
  declare _errorHasContent: boolean;

  constructor() {
    super({ childTagName: "fd-checkbox" });
    this.orientation = "vertical";
    this.required = false;
    this.disabled = false;
    this.label = "";
    this._descHasContent = false;
    this._errorHasContent = false;
  }

  private _getCheckboxes() {
    return this._getChildren();
  }

  protected _syncValidity() {
    if (!this.required || this.disabled) {
      this._formController.internals.setValidity({});
      return;
    }

    const anyChecked = this._getCheckboxes().some((checkbox) => checkbox.checked);

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

  protected _dispatchGroupChange() {
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
  }
}

// Public API markers for metadata validation: --fd-checkbox-group-max-width --fd-checkbox-group-legend-gap --fd-checkbox-group-description-gap --fd-checkbox-group-gap
// <slot name="legend"></slot> <slot name="description"></slot> <slot></slot> <slot name="error"></slot> part="fieldset" part="legend" part="description" part="items" part="error"
