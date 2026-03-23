import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { attachInternalsCompat, type ElementInternalsLike } from "./internals.js";
import "./fd-icon.js";

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
      inline-size: var(--fd-checkbox-size, 24px);
      block-size: var(--fd-checkbox-size, 24px);
      color: var(--fd-checkbox-border-color, var(--fdic-text-primary, #212123));
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

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 100%;
      block-size: 100%;
      border-radius: var(
        --fd-checkbox-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      box-sizing: border-box;
      transition:
        box-shadow 120ms ease,
        color 120ms ease,
        opacity 120ms ease;
    }

    .icon fd-icon {
      --fd-icon-size: var(--fd-checkbox-icon-size, 24px);
    }

    [part="control"]:has(input:focus-visible) .icon {
      box-shadow: inset 0 0 0 2.5px
        var(
          --fd-checkbox-focus-color,
          var(--fdic-border-input-focus, #38b6ff)
        );
    }

    :host(:hover:not([disabled])) .icon {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-checkbox-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    :host(:active:not([disabled])) .icon {
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
      color: var(--fd-checkbox-invalid-color, rgb(190, 40, 40));
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
      .icon {
        forced-color-adjust: none;
        box-shadow: none;
        color: ButtonText;
      }

      :host([disabled]) .icon {
        color: GrayText;
      }

      :host([checked]) .icon,
      :host([indeterminate]) .icon {
        background: Highlight;
        color: HighlightText;
      }

      [part="control"]:has(input:focus-visible) .icon {
        outline: 2px solid LinkText;
        outline-offset: 2px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .icon {
        transition: none !important;
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

  private _internals: ElementInternalsLike;
  private _input: HTMLInputElement | null = null;
  private _userHasInteracted = false;
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
    this._syncFormState();
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
      changed.has("indeterminate") ||
      changed.has("disabled") ||
      changed.has("required") ||
      changed.has("name") ||
      changed.has("value")
    ) {
      this._syncInputFromHost();
      this._syncFormState();
    }
  }

  formResetCallback() {
    this.checked = this._defaultChecked;
    this.indeterminate = false;
    this._userHasInteracted = false;
    this.removeAttribute("data-user-invalid");
    this._syncInputFromHost();
    this._syncFormState();
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
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

  private _syncFormState() {
    this._internals.setFormValue(this.checked ? this.value : null);

    if (this.required && !this.checked) {
      this._internals.setValidity(
        { valueMissing: true },
        "This checkbox is required.",
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

  private _getIconName() {
    if (this.indeterminate) {
      return "minus-square";
    }

    if (this.checked) {
      return "check-square";
    }

    return "square";
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
    this._userHasInteracted = true;
    this._syncFormState();
  }

  private _onInput(event: Event) {
    this._syncFromInput(event.target as HTMLInputElement);
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private _onChange(event: Event) {
    this._syncFromInput(event.target as HTMLInputElement);
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
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
            type="checkbox"
            aria-describedby=${ifDefined(describedBy)}
            @input=${this._onInput}
            @change=${this._onChange}
          />
          <span class="icon" aria-hidden="true">
            <fd-icon name=${this._getIconName()}></fd-icon>
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
