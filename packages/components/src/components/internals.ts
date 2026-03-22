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

export function attachInternalsCompat(host: HTMLElement): ElementInternalsLike {
  if ("attachInternals" in host && typeof host.attachInternals === "function") {
    return host.attachInternals() as unknown as ElementInternalsLike;
  }

  return new FallbackInternals(host);
}
