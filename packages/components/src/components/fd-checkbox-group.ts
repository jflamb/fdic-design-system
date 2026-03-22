import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { attachInternalsCompat, type ElementInternalsLike } from "./internals.js";
import type { FdCheckbox } from "./fd-checkbox.js";
import "./fd-checkbox.js";

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

  static styles = css`
    :host {
      display: block;
      max-inline-size: var(--fd-checkbox-group-max-width, 32rem);
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
      margin: 0 0 var(--fd-checkbox-group-section-gap, 0.5em) 0;
      float: none;
      width: 100%;
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 600;
      line-height: 1.375;
      color: var(--fdic-text-primary, #212123);
    }

    [part="description"] {
      color: var(--fdic-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    [part="description"][hidden] {
      display: none;
    }

    [part="items"] {
      display: grid;
      gap: var(--fd-checkbox-group-gap, var(--fdic-spacing-sm, 12px));
    }

    [part="items"].horizontal {
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      align-items: start;
    }

    [part="error"] {
      display: none;
      color: rgb(190, 40, 40);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    :host([data-user-invalid]) [part="error"] {
      display: block;
    }

    :host([data-user-invalid]) [part="fieldset"] {
      border-inline-start: 3px solid rgb(190, 40, 40);
      padding-inline-start: var(--fdic-spacing-sm, 12px);
    }

    @media (forced-colors: active) {
      :host([data-user-invalid]) [part="fieldset"] {
        border-inline-start-color: LinkText;
      }

      [part="error"] {
        color: LinkText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        transition: none !important;
      }
    }
  `;

  declare orientation: CheckboxGroupOrientation;
  declare required: boolean;
  declare disabled: boolean;
  declare label: string;
  declare _descHasContent: boolean;
  declare _errorHasContent: boolean;

  private _internals: ElementInternalsLike;
  private _userHasInteracted = false;

  constructor() {
    super();
    this.orientation = "vertical";
    this.required = false;
    this.disabled = false;
    this.label = "";
    this._descHasContent = false;
    this._errorHasContent = false;
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

  override firstUpdated() {
    this._applyDisabledState();
    this._syncGroupValidity();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._descHasContent = this._slotHasContent("description");
    this._errorHasContent = this._slotHasContent("error");
    this.addEventListener("invalid", this._onInvalid as EventListener);
    this.addEventListener("change", this._onCheckboxChange as EventListener);
  }

  override disconnectedCallback() {
    this.removeEventListener("invalid", this._onInvalid as EventListener);
    this.removeEventListener("change", this._onCheckboxChange as EventListener);
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has("disabled")) {
      this._applyDisabledState();
    }

    if (changed.has("required") || changed.has("disabled")) {
      this._syncGroupValidity();
    }
  }

  checkValidity() {
    this._syncGroupValidity();
    return this._internals.checkValidity();
  }

  reportValidity() {
    this._syncGroupValidity();
    return this._internals.reportValidity();
  }

  formResetCallback() {
    this._userHasInteracted = false;
    this.removeAttribute("data-user-invalid");
    this._syncGroupValidity();
  }

  private _getCheckboxes() {
    return Array.from(this.querySelectorAll("fd-checkbox")) as FdCheckbox[];
  }

  private _getValidationAnchor() {
    return this._getCheckboxes().find((checkbox) => !checkbox.disabled);
  }

  private _syncGroupValidity() {
    this._internals.setFormValue(null);

    if (!this.required) {
      this._internals.setValidity({});
      if (this.hasAttribute("data-user-invalid")) {
        this.removeAttribute("data-user-invalid");
        this.requestUpdate();
      }
      return;
    }

    const checkboxes = this._getCheckboxes();
    const anyChecked = checkboxes.some((checkbox) => checkbox.checked);

    if (!anyChecked) {
      this._internals.setValidity(
        { valueMissing: true },
        "Please select at least one option.",
        this._getValidationAnchor(),
      );
      if (this._userHasInteracted) {
        if (!this.hasAttribute("data-user-invalid")) {
          this.setAttribute("data-user-invalid", "");
          this.requestUpdate();
        }
      }
      return;
    }

    this._internals.setValidity({});
    if (this.hasAttribute("data-user-invalid")) {
      this.removeAttribute("data-user-invalid");
      this.requestUpdate();
    }
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
    this._syncGroupValidity();
  }

  private _onCheckboxChange = (event?: Event) => {
    const target = event?.target;
    if (!(target instanceof HTMLElement) || target === this) {
      return;
    }
    if (!target.closest("fd-checkbox")) {
      return;
    }

    this._userHasInteracted = true;
    this._syncGroupValidity();

    const checkedValues = this._getCheckboxes()
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    this.dispatchEvent(
      new CustomEvent("fd-group-change", {
        detail: { checkedValues },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _onInvalid = () => {
    this.setAttribute("data-user-invalid", "");
    this.requestUpdate();
  };

  render() {
    const describedBy = this._getFieldsetDescribedBy();

    return html`
      <fieldset
        part="fieldset"
        aria-describedby=${ifDefined(describedBy)}
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

if (!customElements.get("fd-checkbox-group")) {
  customElements.define("fd-checkbox-group", FdCheckboxGroup);
}
