type SetValidityArgs = [
  flags?: ValidityStateFlags,
  message?: string,
  anchor?: HTMLElement,
];

export interface ElementInternalsLike {
  form: HTMLFormElement | null;
  states?: CustomStateSet;
  validity: ValidityState;
  validationMessage: string;
  willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setFormValue(value: string | File | FormData | null): void;
  getFormValue?(): string | File | FormData | null;
  setValidity(...args: SetValidityArgs): void;
}

function createValidityState(overrides: ValidityStateFlags = {}): ValidityState {
  const flags = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
    ...overrides,
  };

  flags.valid = !Object.entries(flags).some(
    ([key, value]) => key !== "valid" && Boolean(value),
  );

  return flags as ValidityState;
}

class FallbackInternals implements ElementInternalsLike {
  states?: CustomStateSet;
  validity: ValidityState;
  validationMessage: string;
  willValidate: boolean;
  #host: HTMLElement;
  #formValue: string | File | FormData | null;
  #anchor: HTMLElement | undefined;

  constructor(host: HTMLElement) {
    this.#host = host;
    this.validity = createValidityState();
    this.validationMessage = "";
    this.willValidate = true;
    this.#formValue = null;
  }

  get form() {
    return this.#host.closest("form");
  }

  setFormValue(value: string | File | FormData | null) {
    this.#formValue = value;
  }

  getFormValue() {
    return this.#formValue;
  }

  setValidity(
    flags: ValidityStateFlags = {},
    message = "",
    anchor?: HTMLElement,
  ) {
    this.validity = createValidityState(flags);
    this.validationMessage = this.validity.valid ? "" : message;
    this.#anchor = anchor;
  }

  checkValidity() {
    return this.validity.valid;
  }

  reportValidity() {
    if (this.validity.valid) {
      return true;
    }

    const event = new Event("invalid", {
      bubbles: false,
      cancelable: true,
    });

    this.#host.dispatchEvent(event);
    return false;
  }
}

class TrackedInternals implements ElementInternalsLike {
  states?: CustomStateSet;
  #internals: ElementInternalsLike;
  #formValue: string | File | FormData | null = null;

  constructor(internals: ElementInternalsLike) {
    this.#internals = internals;
    this.states = internals.states;
  }

  get form() {
    return this.#internals.form;
  }

  get validity() {
    return this.#internals.validity;
  }

  get validationMessage() {
    return this.#internals.validationMessage;
  }

  get willValidate() {
    return this.#internals.willValidate;
  }

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }

  setFormValue(value: string | File | FormData | null) {
    this.#formValue = value;
    this.#internals.setFormValue(value);
  }

  getFormValue() {
    return this.#formValue;
  }

  setValidity(...args: SetValidityArgs) {
    this.#internals.setValidity(...args);
  }
}

export function attachInternalsCompat(host: HTMLElement): ElementInternalsLike {
  if ("attachInternals" in host && typeof host.attachInternals === "function") {
    return new TrackedInternals(
      host.attachInternals() as unknown as ElementInternalsLike,
    );
  }

  return new TrackedInternals(new FallbackInternals(host));
}
