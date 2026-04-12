import { LitElement, nothing } from "lit";
import type { PropertyValues } from "lit";

export type FormFieldLayout = "stacked" | "inline-compact";
export type FormFieldControlType =
  | "text"
  | "textarea"
  | "select"
  | "choice"
  | "file"
  | "custom";

/**
 * `fd-form-field` — Long-term field-shell primitive for supported control
 * families.
 *
 * This wrapper keeps the public contract explicit while letting each control
 * family keep its own semantics under the hood. Text-entry controls still use
 * real `fd-label` and `fd-message` siblings; grouped controls receive their
 * legend, description, and error content through their existing public API.
 */
export class FdFormField extends LitElement {
  static properties = {
    label: { reflect: true },
    description: { reflect: true },
    error: { reflect: true },
    required: { type: Boolean, reflect: true },
    optional: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    for: { reflect: true },
    fieldId: { attribute: "field-id", reflect: true },
    layout: { reflect: true },
    controlType: { attribute: "control-type", reflect: true },
  };

  declare label: string;
  declare description: string | undefined;
  declare error: string | undefined;
  declare required: boolean;
  declare optional: boolean;
  declare invalid: boolean;
  declare for: string | undefined;
  declare fieldId: string | undefined;
  declare layout: FormFieldLayout;
  declare controlType: FormFieldControlType | undefined;

  private static _instanceCounter = 0;

  private readonly _instanceId: number;
  private _observer: MutationObserver | null = null;
  private _syncing = false;

  private static readonly _TEXT_ENTRY_TAGS = new Set(["FD-INPUT", "FD-TEXTAREA"]);
  private static readonly _GROUP_TAGS = new Set([
    "FD-RADIO-GROUP",
    "FD-CHECKBOX-GROUP",
  ]);
  private static readonly _SUPPORTED_TAGS = new Set([
    "FD-INPUT",
    "FD-TEXTAREA",
    "FD-SELECTOR",
    "FD-RADIO-GROUP",
    "FD-CHECKBOX-GROUP",
    "FD-FILE-INPUT",
  ]);

  constructor() {
    super();
    this.label = "";
    this.description = undefined;
    this.error = undefined;
    this.required = false;
    this.optional = false;
    this.invalid = false;
    this.for = undefined;
    this.fieldId = undefined;
    this.layout = "stacked";
    this.controlType = undefined;
    this._instanceId = FdFormField._instanceCounter++;
  }

  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      this._syncField();
      this._observeChildren();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopObserving();
  }

  override updated(_changed: PropertyValues<this>) {
    this._syncField();
  }

  private _observeChildren() {
    this._stopObserving();
    this._observer = new MutationObserver(() => {
      if (this._syncing) {
        return;
      }
      this._syncField();
    });
    this._observer.observe(this, {
      childList: true,
    });
  }

  private _stopObserving() {
    this._observer?.disconnect();
    this._observer = null;
  }

  private _syncField() {
    this._syncing = true;

    try {
      const control = this._getPrimaryControl();

      this._validateStructure(control);

      if (!control) {
        this._cleanupManagedNodes();
        return;
      }

      if (FdFormField._TEXT_ENTRY_TAGS.has(control.tagName)) {
        this._syncTextEntryControl(control);
        return;
      }

      if (control.tagName === "FD-SELECTOR") {
        this._cleanupManagedTextNodes();
        this._syncSelector(control);
        return;
      }

      if (FdFormField._GROUP_TAGS.has(control.tagName)) {
        this._cleanupManagedTextNodes();
        this._syncChoiceGroup(control);
        return;
      }

      if (control.tagName === "FD-FILE-INPUT") {
        this._cleanupManagedTextNodes();
        this._syncFileInput(control);
      }
    } finally {
      this._syncing = false;
    }
  }

  private _validateStructure(control: HTMLElement | null) {
    const controls = this._directChildren().filter((child) =>
      FdFormField._SUPPORTED_TAGS.has(child.tagName),
    );

    if (controls.length > 1) {
      console.warn(
        "[fd-form-field] Multiple supported control children found. Only the first direct control will be managed.",
      );
    }

    if (!control) {
      console.warn(
        "[fd-form-field] No supported direct control child found. Add one supported control or keep the field shell manual.",
      );
    }
  }

  private _directChildren() {
    return Array.from(this.children).filter(
      (child) => !child.hasAttribute("data-fd-form-field-owned"),
    ) as HTMLElement[];
  }

  private _getPrimaryControl(): HTMLElement | null {
    return (
      this._directChildren().find((child) =>
        FdFormField._SUPPORTED_TAGS.has(child.tagName),
      ) ?? null
    );
  }

  private _resolvedControlId(control: HTMLElement) {
    const preferredId = this.for || this.fieldId;
    if (preferredId) {
      control.id = preferredId;
      return preferredId;
    }

    if (!control.id) {
      control.id = `fd-form-field-${this._instanceId}`;
    }

    return control.id;
  }

  private _labelText() {
    if (!this.optional || this.required) {
      return this.label;
    }

    return this.label ? `${this.label} (optional)` : this.label;
  }

  private _visibleInvalid() {
    return this.invalid || Boolean(this.error?.trim());
  }

  private _getOrCreateOwnedSibling(
    tagName: "fd-label" | "fd-message",
    type: "label" | "error",
  ) {
    const existing = this.querySelector(
      `${tagName}[data-fd-form-field-owned="${type}"]`,
    ) as HTMLElement | null;

    if (existing) {
      return existing;
    }

    const node = document.createElement(tagName) as HTMLElement;
    node.setAttribute("data-fd-form-field-owned", type);
    return node;
  }

  private _cleanupManagedTextNodes() {
    this.querySelectorAll("[data-fd-form-field-owned='label'], [data-fd-form-field-owned='error']")
      .forEach((node) => {
        if (node.parentElement === this) {
          node.remove();
        }
      });
  }

  private _cleanupManagedControlChildren(control: HTMLElement) {
    control
      .querySelectorAll("[data-fd-form-field-owned]")
      .forEach((node) => node.remove());
  }

  private _cleanupManagedNodes() {
    this._cleanupManagedTextNodes();
    const control = this._getPrimaryControl();
    if (control) {
      this._cleanupManagedControlChildren(control);
      control.removeAttribute("data-user-invalid");
    }
  }

  private _syncTextEntryControl(control: HTMLElement) {
    const controlId = this._resolvedControlId(control);
    this._cleanupManagedControlChildren(control);

    const label = this._getOrCreateOwnedSibling("fd-label", "label") as any;
    label.setAttribute("data-fd-form-field-owned", "label");
    label.label = this._labelText();
    label.description = this.description ?? undefined;
    label.required = this.required;
    label.setAttribute("for", controlId);
    if (label.parentElement !== this || label.nextElementSibling !== control) {
      this.insertBefore(label, control);
    }

    const errorText = this.error?.trim();
    const existingMessage = this.querySelector(
      'fd-message[data-fd-form-field-owned="error"]',
    ) as any;

    if (errorText) {
      const message = existingMessage ?? this._getOrCreateOwnedSibling("fd-message", "error");
      message.setAttribute("data-fd-form-field-owned", "error");
      message.setAttribute("for", controlId);
      message.state = "error";
      message.message = errorText;
      if (message.parentElement !== this || message.previousElementSibling !== control) {
        control.insertAdjacentElement("afterend", message);
      }
    } else if (existingMessage) {
      existingMessage.remove();
    }
  }

  private _upsertManagedControlSlot(
    control: HTMLElement,
    slotName: "legend" | "description" | "error",
    text: string | undefined,
  ) {
    const existing = control.querySelector(
      `[data-fd-form-field-owned="${slotName}"]`,
    ) as HTMLElement | null;

    const normalizedText = text?.trim();

    if (!normalizedText) {
      existing?.remove();
      return;
    }

    const node = existing ?? document.createElement("span");
    node.setAttribute("data-fd-form-field-owned", slotName);
    node.setAttribute("slot", slotName);
    node.textContent = normalizedText;

    if (!existing) {
      control.appendChild(node);
    }
  }

  private _syncSelector(control: HTMLElement) {
    const managedControl = control as any;
    this._cleanupManagedControlChildren(control);
    this._resolvedControlId(control);
    managedControl.label = this._labelText();
    managedControl.required = this.required;
    this._upsertManagedControlSlot(control, "description", this.description);
    this._upsertManagedControlSlot(control, "error", this.error);

    if (this._visibleInvalid()) {
      control.setAttribute("data-user-invalid", "");
    } else {
      control.removeAttribute("data-user-invalid");
    }
  }

  private _syncChoiceGroup(control: HTMLElement) {
    const managedControl = control as any;
    this._cleanupManagedControlChildren(control);
    this._resolvedControlId(control);
    managedControl.required = this.required;
    managedControl.label = this._labelText();
    this._upsertManagedControlSlot(control, "legend", this._labelText());
    this._upsertManagedControlSlot(control, "description", this.description);
    this._upsertManagedControlSlot(control, "error", this.error);

    if (this._visibleInvalid()) {
      control.setAttribute("data-user-invalid", "");
    } else {
      control.removeAttribute("data-user-invalid");
    }
  }

  private _syncFileInput(control: HTMLElement) {
    const managedControl = control as any;
    this._cleanupManagedControlChildren(control);
    this._resolvedControlId(control);
    managedControl.label = this._labelText();
    managedControl.hint = this.description ?? "";
    managedControl.errorMessage = this.error ?? "";
    managedControl.required = this.required;

    if (this._visibleInvalid()) {
      control.setAttribute("data-user-invalid", "");
    } else {
      control.removeAttribute("data-user-invalid");
    }
  }

  render() {
    return nothing;
  }
}
