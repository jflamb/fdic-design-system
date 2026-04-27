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

if (!("attachInternals" in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, "attachInternals", {
    configurable: true,
    value(this: HTMLElement) {
      const host = this;
      let validity = createValidityState();
      let validationMessage = "";
      let formValue: string | File | FormData | null = null;

      const internals = {
        get form() {
          return host.closest("form");
        },
        get validity() {
          return validity;
        },
        get validationMessage() {
          return validationMessage;
        },
        get willValidate() {
          return !host.hasAttribute("disabled");
        },
        checkValidity() {
          return validity.valid;
        },
        reportValidity() {
          if (validity.valid) {
            return true;
          }

          host.dispatchEvent(
            new Event("invalid", { bubbles: false, cancelable: true }),
          );
          return false;
        },
        setFormValue(value: string | File | FormData | null) {
          formValue = value;
        },
        getFormValue() {
          return formValue;
        },
        setValidity(flags: ValidityStateFlags = {}, message = "") {
          validity = createValidityState(flags);
          validationMessage = validity.valid ? "" : message;
        },
      };

      return internals as unknown as ElementInternals;
    },
  });
}
