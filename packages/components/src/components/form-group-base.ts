import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import type { CSSResult, PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { forcedColorsFieldGroup } from "./forced-colors.js";
import { GroupFormController } from "./group-form-controller.js";
import { reducedMotion } from "./reduced-motion.js";

export type FormGroupOrientation = "vertical" | "horizontal";

type FormGroupChild = HTMLElement & {
  checked: boolean;
  disabled: boolean;
  value: string;
};

interface FormGroupBaseOptions {
  childTagName: string;
}

export function fieldGroupStyles(customPropertyPrefix: string): CSSResult[] {
  const prefix = unsafeCSS(customPropertyPrefix);

  return [forcedColorsFieldGroup, css`
    :host {
      display: block;
      max-inline-size: var(--${prefix}-max-width, 32rem);
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
      margin: 0 0 var(--${prefix}-legend-gap, var(--fdic-spacing-xs, 8px)) 0;
      float: none;
      width: 100%;
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 600;
      line-height: 1.375;
      color: var(--fdic-color-text-primary, #212123);
    }

    [part="description"] {
      color: var(--fdic-color-text-secondary, #595961);
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: var(--fdic-line-height-body, 1.5);
      margin: 0 0 var(--${prefix}-description-gap, var(--fdic-spacing-sm, 12px)) 0;
    }

    [part="description"][hidden] {
      display: none;
    }

    [part="items"] {
      display: grid;
      gap: var(--${prefix}-gap, var(--fdic-spacing-sm, 12px));
    }

    [part="items"].horizontal {
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      align-items: start;
    }

    [part="error"] {
      display: none;
      color: var(--fdic-color-semantic-fg-error, #B10B2D);
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    :host([data-user-invalid]) [part="error"] {
      display: block;
    }

    :host([data-user-invalid]) [part="fieldset"] {
      border-inline-start: 3px solid var(--fdic-color-semantic-border-error, #B10B2D);
      padding-inline-start: var(--fdic-spacing-sm, 12px);
    }

    ${reducedMotion`
      :host {
        transition: none !important;
      }
    `}
  `];
}

export abstract class FormGroupBase<TChild extends FormGroupChild> extends LitElement {
  static formAssociated = true;

  static properties = {
    orientation: { reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { reflect: true },
    _descHasContent: { state: true },
    _errorHasContent: { state: true },
  };

  declare orientation: FormGroupOrientation;
  declare required: boolean;
  declare disabled: boolean;
  declare label: string;
  declare _descHasContent: boolean;
  declare _errorHasContent: boolean;

  protected _formController: GroupFormController;
  private _childTagName: string;

  constructor(options: FormGroupBaseOptions) {
    super();
    this.orientation = "vertical";
    this.required = false;
    this.disabled = false;
    this.label = "";
    this._descHasContent = false;
    this._errorHasContent = false;
    this._childTagName = options.childTagName;
    this._formController = new GroupFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._getValidationAnchor(),
      beforeSyncValidity: () => this._beforeSyncValidity(),
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
    this.addEventListener("change", this._onChildChange as EventListener);
    this.addEventListener("focusout", this._onFocusOut as EventListener);
  }

  override disconnectedCallback() {
    this.removeEventListener("change", this._onChildChange as EventListener);
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

  protected _getChildren() {
    return Array.from(this.querySelectorAll(this._childTagName)) as TChild[];
  }

  protected _getValidationAnchor() {
    return this._getChildren().find((child) => !child.disabled);
  }

  protected _syncFormValue() {
    this._formController.internals.setFormValue(null);
  }

  protected _beforeSyncValidity() {}

  protected abstract _syncValidity(): void;

  protected abstract _dispatchGroupChange(): void;

  protected _applyDisabledState() {
    const children = this._getChildren();

    if (this.disabled) {
      for (const child of children) {
        if (!child.disabled) {
          child.setAttribute("data-group-disabled", "");
          child.disabled = true;
        }
      }
      return;
    }

    for (const child of children) {
      if (child.hasAttribute("data-group-disabled")) {
        child.disabled = false;
        child.removeAttribute("data-group-disabled");
      }
    }
  }

  protected _slotHasContent(name: string) {
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

  protected _onSlotChange() {
    this._applyDisabledState();
    this._formController.sync();
  }

  private _onChildChange = (event?: Event) => {
    const target = event?.target;
    if (!(target instanceof HTMLElement) || target === this) {
      return;
    }
    if (!target.closest(this._childTagName)) {
      return;
    }

    this._formController.markInteracted();
    this._formController.sync();
    this._dispatchGroupChange();
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
