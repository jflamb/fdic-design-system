import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  attachInternalsCompat,
  type ElementInternalsLike,
} from "./internals.js";

export interface FormControlHost extends ReactiveControllerHost, HTMLElement {}

export interface FormControllerOptions {
  host: FormControlHost;
  syncFormValue: () => void;
  syncValidity: () => void;
  getValidationAnchor?: () => HTMLElement | undefined;
  beforeSyncValidity?: () => void;
  onResetDirtyState?: () => void;
}

export class FormControlController implements ReactiveController {
  readonly internals: ElementInternalsLike;

  protected readonly host: FormControlHost;
  protected readonly options: FormControllerOptions;
  protected userHasInteracted = false;
  protected suppressInvalidVisibility = false;

  constructor(options: FormControllerOptions) {
    this.host = options.host;
    this.options = options;
    this.internals = attachInternalsCompat(this.host);
    this.host.addController(this);
  }

  get form() {
    return this.internals.form;
  }

  get validity() {
    return this.internals.validity;
  }

  get validationMessage() {
    return this.internals.validationMessage;
  }

  get willValidate() {
    return this.internals.willValidate;
  }

  hostConnected() {
    this.host.addEventListener("invalid", this.onInvalid as EventListener);
  }

  hostDisconnected() {
    this.host.removeEventListener("invalid", this.onInvalid as EventListener);
  }

  markInteracted() {
    this.userHasInteracted = true;
  }

  getValidationAnchor() {
    return this.options.getValidationAnchor?.();
  }

  markUserInvalid() {
    if (!this.host.hasAttribute("data-user-invalid")) {
      this.host.setAttribute("data-user-invalid", "");
      this.host.requestUpdate();
    }
  }

  clearUserInvalid() {
    if (this.host.hasAttribute("data-user-invalid")) {
      this.host.removeAttribute("data-user-invalid");
      this.host.requestUpdate();
    }
  }

  sync() {
    this.options.beforeSyncValidity?.();
    this.options.syncFormValue();
    this.options.syncValidity();

    if (this.internals.validity.valid) {
      this.clearUserInvalid();
    }
  }

  revealIfInvalid() {
    this.sync();
    if (!this.internals.validity.valid) {
      this.markUserInvalid();
    }
  }

  revealIfInteractedAndInvalid() {
    if (!this.userHasInteracted) {
      return;
    }

    this.revealIfInvalid();
  }

  checkCurrentValidity() {
    this.suppressInvalidVisibility = true;
    try {
      return this.internals.checkValidity();
    } finally {
      this.suppressInvalidVisibility = false;
    }
  }

  reportCurrentValidity() {
    const valid = this.internals.reportValidity();
    if (!valid) {
      this.markUserInvalid();
    }
    return valid;
  }

  checkValidity() {
    this.sync();
    return this.checkCurrentValidity();
  }

  reportValidity() {
    this.markInteracted();
    this.revealIfInvalid();
    return this.reportCurrentValidity();
  }

  reset() {
    this.userHasInteracted = false;
    this.clearUserInvalid();
    this.options.onResetDirtyState?.();
    this.sync();
  }

  private onInvalid = () => {
    if (this.suppressInvalidVisibility) {
      return;
    }

    this.userHasInteracted = true;
    this.markUserInvalid();
  };
}
