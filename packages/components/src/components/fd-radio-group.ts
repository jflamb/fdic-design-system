import type { FdRadioGroupChangeDetail } from "../public-events.js";
import type { FdRadio } from "./fd-radio.js";
import "./fd-radio.js";
import {
  FormGroupBase,
  fieldGroupStyles,
  type FormGroupOrientation,
} from "./form-group-base.js";

export type RadioGroupOrientation = FormGroupOrientation;

export class FdRadioGroup extends FormGroupBase<FdRadio> {
  static formAssociated = true;

  static properties = {
    orientation: { reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { reflect: true },
    _descHasContent: { state: true },
    _errorHasContent: { state: true },
  };

  static styles = fieldGroupStyles("fd-radio-group");

  declare orientation: RadioGroupOrientation;
  declare required: boolean;
  declare disabled: boolean;
  declare label: string;
  declare _descHasContent: boolean;
  declare _errorHasContent: boolean;

  constructor() {
    super({ childTagName: "fd-radio" });
    this.orientation = "vertical";
    this.required = false;
    this.disabled = false;
    this.label = "";
    this._descHasContent = false;
    this._errorHasContent = false;
  }

  private _getRadios() {
    return this._getChildren();
  }

  protected _beforeSyncValidity() {
    this._validateChildNames();
  }

  protected _syncValidity() {
    if (!this.required || this.disabled) {
      this._formController.internals.setValidity({});
      return;
    }

    const anyChecked = this._getRadios().some((radio) => radio.checked);

    if (!anyChecked) {
      this._formController.internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        this._formController.getValidationAnchor(),
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  private _validateChildNames() {
    const radios = this._getRadios();
    if (radios.length === 0) {
      return;
    }

    const names = new Set<string>();
    let hasEmpty = false;

    for (const radio of radios) {
      const name = radio.name;
      if (!name) {
        hasEmpty = true;
      } else {
        names.add(name);
      }
    }

    if (hasEmpty) {
      console.warn(
        "[fd-radio-group] One or more fd-radio children have an empty or missing name attribute. " +
        "All radios in a group should share the same non-empty name.",
      );
    }

    if (names.size > 1) {
      console.warn(
        `[fd-radio-group] fd-radio children have mismatched name attributes: ${[...names].join(", ")}. ` +
        "All radios in a group should share the same name.",
      );
    }
  }

  protected _dispatchGroupChange() {
    const selectedRadio = this._getRadios().find((radio) => radio.checked);
    const selectedValue = selectedRadio?.value ?? "";
    const detail: FdRadioGroupChangeDetail = { value: selectedValue };

    this.dispatchEvent(
      new CustomEvent("fd-radio-group-change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    // @deprecated Compatibility event. Remove in the next breaking major version.
    this.dispatchEvent(
      new CustomEvent("fd-group-change", {
        detail: { selectedValue },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

// Public API markers for metadata validation: --fd-radio-group-max-width --fd-radio-group-legend-gap --fd-radio-group-description-gap --fd-radio-group-gap
// <slot name="legend"></slot> <slot name="description"></slot> <slot></slot> <slot name="error"></slot> part="fieldset" part="legend" part="description" part="items" part="error"
