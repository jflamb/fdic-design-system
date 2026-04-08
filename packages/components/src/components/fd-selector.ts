import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import type {
  FdSelectorChangeDetail,
  FdSelectorOpenChangeDetail,
} from "../public-events.js";
import { SingleValueFormController } from "./single-value-form-controller.js";
import type { FdOption } from "./fd-option.js";

export type SelectorVariant = "simple" | "single" | "multiple";

export class FdSelector extends LitElement {
  static formAssociated = true;

  static properties = {
    variant: { reflect: true },
    label: { reflect: true },
    name: { reflect: true },
    value: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    placeholder: { reflect: true },
    _activeDescendantId: { state: true },
    _descHasContent: { state: true },
    _errorHasContent: { state: true },
  };

  static styles = css`
    :host {
      display: block;
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
      color: var(--ds-color-text-primary, light-dark(#212123, #ffffff));
      position: relative;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([hidden]) {
      display: none;
    }

    /* --- Label --- */

    [part="label"] {
      display: flex;
      gap: var(--fdic-spacing-3xs, 2px);
      align-items: baseline;
      margin: 0;
      padding: 0;
      cursor: default;
    }

    [part="label-text"] {
      font-weight: 400;
      color: var(--ds-color-text-primary, light-dark(#212123, #ffffff));
    }

    [part="required-marker"] {
      font-weight: 600;
      color: var(--fd-selector-required-color, var(--ds-color-text-error, light-dark(#d80e3a, #ffcccc)));
    }

    :host([disabled]) [part="label-text"] {
      color: var(--ds-color-text-secondary, light-dark(#595961, #e0e0e2));
    }

    /* --- Description --- */

    [part="description"] {
      color: var(--ds-color-text-secondary, light-dark(#595961, #e0e0e2));
      font-size: var(--fdic-font-size-body-small, 1rem);
    }

    [part="description"][hidden] {
      display: none;
    }

    /* --- Trigger --- */

    [part="trigger"] {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: var(--fd-selector-trigger-height, 44px);
      margin-top: 6px;
      padding: 0;
      border: 1px solid
        var(
          --fd-selector-trigger-border,
          var(--ds-color-border-input, light-dark(#bdbdbf, #595961))
        );
      border-radius: var(--fd-selector-border-radius, var(--fdic-corner-radius-sm, 3px));
      background: var(--fd-selector-trigger-bg, var(--ds-color-bg-base, light-dark(#ffffff, #000000)));
      font: inherit;
      color: inherit;
      cursor: pointer;
      box-sizing: border-box;
      text-align: start;
    }

    [part="trigger"]:focus-visible {
      outline: 2px solid
        var(
          --fd-selector-trigger-border-focus,
          var(--ds-color-border-input-focus, light-dark(#38b6ff, #0d6191))
        );
      outline-offset: 2px;
      border-radius: 2px;
    }

    :host([disabled]) [part="trigger"] {
      cursor: default;
      opacity: 0.5;
      pointer-events: none;
    }

    :host([data-user-invalid]) [part="trigger"] {
      border-color: var(--fd-selector-error-border, var(--ds-color-semantic-border-error, light-dark(#b10b2d, #f66f8b)));
    }

    [part="value-display"] {
      flex: 1;
      min-width: 0;
      padding: 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .placeholder {
      color: var(
        --fd-selector-trigger-placeholder,
        var(--ds-color-text-secondary, light-dark(#595961, #e0e0e2))
      );
    }

    [part="chevron"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--fd-selector-trigger-height, 44px);
      align-self: stretch;
      flex-shrink: 0;
    }

    .chevron-icon {
      width: 24px;
      height: 24px;
      transition: transform 0.2s ease;
    }

    :host([open]) .chevron-icon {
      transform: rotate(180deg);
    }

    /* --- Listbox / dropdown --- */

    [part="listbox"] {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      margin-top: 2px;
      max-height: var(--fd-selector-dropdown-max-height, 280px);
      overflow-y: auto;
      background: var(--fd-selector-dropdown-bg, var(--ds-color-bg-base, light-dark(#ffffff, #000000)));
      border: 1px solid
        var(
          --fd-selector-dropdown-border,
          var(--ds-color-border-input, light-dark(#bdbdbf, #595961))
        );
      border-radius: var(--fd-selector-border-radius, var(--fdic-corner-radius-sm, 3px));
      box-shadow: var(
        --fd-selector-dropdown-shadow,
        0px 1px 2px var(--ds-color-effect-shadow, light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.28))),
        0px 2px 12px var(--ds-color-effect-shadow, light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.28)))
      );
      z-index: 9999;
      box-sizing: border-box;
    }

    [part="listbox"][hidden] {
      display: none;
    }

    [part="listbox"]:focus-visible {
      outline-color: transparent;
    }

    /* --- Error --- */

    [part="error"] {
      color: var(--fd-selector-error-color, var(--ds-color-semantic-fg-error, light-dark(#b10b2d, #f66f8b)));
      font-size: var(--fdic-font-size-body-small, 1rem);
      margin-top: var(--fdic-spacing-3xs, 2px);
    }

    [part="error"][hidden] {
      display: none;
    }

    /* --- Live region (visually hidden) --- */

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      [part="trigger"] {
        border-color: ButtonText;
      }

      [part="trigger"]:focus-visible {
        outline-color: LinkText;
      }

      [part="listbox"] {
        border-color: ButtonText;
        forced-color-adjust: none;
      }

      :host([data-user-invalid]) [part="trigger"] {
        border-color: LinkText;
      }
    }

    /* --- Reduced motion --- */
    @media (prefers-reduced-motion: reduce) {
      [part="chevron"] {
        transition: none !important;
      }
    }

    /* --- Print --- */
    @media print {
      [part="listbox"] {
        display: none !important;
      }

      [part="chevron"] {
        display: none;
      }
    }
  `;

  declare variant: SelectorVariant;
  declare label: string;
  declare name: string;
  declare value: string;
  declare disabled: boolean;
  declare required: boolean;
  declare open: boolean;
  declare placeholder: string;
  declare _activeDescendantId: string;
  declare _descHasContent: boolean;
  declare _errorHasContent: boolean;

  private _formController: SingleValueFormController;
  private _defaultValue: string;
  private _defaultSelectedValues: string[] = [];
  private _typeAheadBuffer = "";
  private _typeAheadTimer: ReturnType<typeof setTimeout> | null = null;
  private _optionIdCounter = 0;
  private _clickOutsideHandler: ((e: MouseEvent) => void) | null = null;

  constructor() {
    super();
    this.variant = "simple";
    this.label = "";
    this.name = "";
    this.value = "";
    this.disabled = false;
    this.required = false;
    this.open = false;
    this.placeholder = "Select\u2026";
    this._activeDescendantId = "";
    this._descHasContent = false;
    this._errorHasContent = false;
    this._defaultValue = "";
    this._formController = new SingleValueFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._getTrigger() ?? undefined,
    });
    this._formController.internals.setFormValue(null);
  }

  // --- Form integration ---

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

  checkValidity() {
    return this._formController.checkValidity();
  }

  reportValidity() {
    return this._formController.reportValidity();
  }

  formResetCallback() {
    // Restore initial selected state captured in firstUpdated
    const defaults = new Set(this._defaultSelectedValues);
    for (const opt of this._getOptions()) {
      opt.selected = defaults.has(opt.value);
    }
    this.value = this._defaultValue;
    this._formController.reset();
    this.requestUpdate();
  }

  // --- Values property (collection-safe for multiple) ---

  get values(): string[] {
    return this._getOptions()
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
  }

  set values(vals: string[]) {
    const set = new Set(vals);
    for (const opt of this._getOptions()) {
      opt.selected = set.has(opt.value);
    }
    // Sync the value attribute to first selected
    this.value = vals[0] ?? "";
    this._formController.sync();
    this.requestUpdate();
  }

  // --- Lifecycle ---

  override connectedCallback() {
    super.connectedCallback();
    this._defaultValue = this.value;
    this._descHasContent = this._slotHasContent("description");
    this._errorHasContent = this._slotHasContent("error");
    this.addEventListener("fd-option-select", this._onOptionSelectHost as EventListener);
  }

  override disconnectedCallback() {
    this.removeEventListener("fd-option-select", this._onOptionSelectHost as EventListener);
    this._removeClickOutside();
    if (this._typeAheadTimer !== null) {
      clearTimeout(this._typeAheadTimer);
      this._typeAheadTimer = null;
    }
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this._syncOptionsVariant();
    this._assignOptionIds();
    // Capture initial selected state for form reset
    this._defaultSelectedValues = this._getOptions()
      .filter((o) => o.selected)
      .map((o) => o.value);
    // If value is pre-set, select the matching option
    if (this.value) {
      this._selectByValue(this.value, false);
    }
    this._formController.sync();
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has("variant")) {
      this._syncOptionsVariant();
    }
    if (changed.has("open")) {
      if (this.open) {
        this._onOpenChange();
      } else {
        this._onCloseChange();
      }
    }
    if (changed.has("value") && this.variant !== "multiple") {
      // Sync option selected state when value is set programmatically
      this._selectByValue(this.value, false);
      // Re-render to update display text from child state
      this.requestUpdate();
    }
    if (
      changed.has("value") ||
      changed.has("required") ||
      changed.has("disabled")
    ) {
      this._formController.sync();
    }
  }

  // --- Option management ---

  private _getOptions(): FdOption[] {
    return Array.from(this.querySelectorAll("fd-option")) as FdOption[];
  }

  private _getEnabledOptions(): FdOption[] {
    return this._getOptions().filter((opt) => !opt.disabled);
  }

  private _syncOptionsVariant() {
    for (const opt of this._getOptions()) {
      opt._variant = this.variant;
    }
  }

  private _assignOptionIds() {
    for (const opt of this._getOptions()) {
      if (!opt.id) {
        opt.id = `fd-option-${++this._optionIdCounter}`;
      }
    }
  }

  private _getFocusedOption(): FdOption | null {
    if (!this._activeDescendantId) return null;
    return this.querySelector(`#${CSS.escape(this._activeDescendantId)}`) as FdOption | null;
  }

  private _setFocusedOption(opt: FdOption | null) {
    // Remove focus indicator from previous
    for (const o of this._getOptions()) {
      o.removeAttribute("data-focused");
    }
    if (opt) {
      opt.setAttribute("data-focused", "");
      this._activeDescendantId = opt.id;
      // Scroll into view
      opt.scrollIntoView?.({ block: "nearest" });
    } else {
      this._activeDescendantId = "";
    }
  }

  // --- Open / close ---

  private _openListbox() {
    if (this.disabled || this.open) return;
    this.open = true;
  }

  private _closeListbox() {
    if (!this.open) return;
    this.open = false;
  }

  private _onOpenChange() {
    this._assignOptionIds();
    // Focus the listbox
    requestAnimationFrame(() => {
      const listbox = this._getListbox();
      listbox?.focus();
      // Set active descendant to selected option or first enabled
      const selected = this._getOptions().find((o) => o.selected && !o.disabled);
      const first = this._getEnabledOptions()[0];
      this._setFocusedOption(selected ?? first ?? null);
    });
    this._addClickOutside();
    const detail: FdSelectorOpenChangeDetail = { open: true };

    this.dispatchEvent(
      new CustomEvent("fd-selector-open-change", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    // @deprecated Compatibility event. Remove in the next breaking major version.
    this.dispatchEvent(
      new CustomEvent("fd-selector-open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onCloseChange() {
    this._setFocusedOption(null);
    this._removeClickOutside();
    this._formController.revealIfInteractedAndInvalid();
    const detail: FdSelectorOpenChangeDetail = { open: false };

    this.dispatchEvent(
      new CustomEvent("fd-selector-open-change", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    // @deprecated Compatibility event. Remove in the next breaking major version.
    this.dispatchEvent(
      new CustomEvent("fd-selector-close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  // --- Click outside ---

  private _addClickOutside() {
    this._removeClickOutside();
    this._clickOutsideHandler = (e: MouseEvent) => {
      const path = e.composedPath();
      // If the click is anywhere inside this component (host, shadow, or slotted), ignore
      if (path.includes(this)) return;
      this._closeListbox();
    };
    // Use rAF to avoid closing from the same interaction that opened
    requestAnimationFrame(() => {
      if (this._clickOutsideHandler) {
        document.addEventListener("pointerdown", this._clickOutsideHandler, true);
      }
    });
  }

  private _removeClickOutside() {
    if (this._clickOutsideHandler) {
      document.removeEventListener("pointerdown", this._clickOutsideHandler, true);
      this._clickOutsideHandler = null;
    }
  }

  // --- Selection ---

  private _selectOption(opt: FdOption) {
    if (opt.disabled) return;
    this._formController.markInteracted();

    if (this.variant === "multiple") {
      opt.selected = !opt.selected;
      // Sync value to first selected option per approved contract
      this._syncMultipleValue();
      this._formController.sync();
      this._fireEvents();
      this.requestUpdate();
    } else {
      // Single-select: deselect all, select this one
      for (const o of this._getOptions()) {
        o.selected = o === opt;
      }
      this.value = opt.value;
      this._formController.sync();
      this._fireEvents();
      this._closeListbox();
      // Return focus to trigger
      requestAnimationFrame(() => this._getTrigger()?.focus());
    }
  }

  /** In multiple mode, sync this.value to the first selected option's value. */
  private _syncMultipleValue() {
    const selected = this._getOptions().find((o) => o.selected);
    this.value = selected?.value ?? "";
  }

  private _selectByValue(val: string, fireEvents: boolean) {
    const options = this._getOptions();
    const opt = options.find((o) => o.value === val);

    if (!opt) {
      // No matching option — clear selection so state stays consistent
      for (const o of options) {
        o.selected = false;
      }
      if (this.variant !== "multiple") {
        this.value = "";
      }
      return;
    }

    if (this.variant === "multiple") {
      opt.selected = true;
    } else {
      for (const o of options) {
        o.selected = o === opt;
      }
    }
    if (fireEvents) {
      this._fireEvents();
    }
  }

  // --- Form state ---

  private _syncFormValue() {
    if (this.variant === "multiple") {
      const selectedValues = this.values;
      if (selectedValues.length > 0) {
        const fd = new FormData();
        for (const v of selectedValues) {
          fd.append(this.name, v);
        }
        this._formController.internals.setFormValue(fd);
      } else {
        this._formController.internals.setFormValue(null);
      }
      return;
    }

    this._formController.internals.setFormValue(this.value || null);
  }

  private _syncValidity() {
    const trigger = this._formController.getValidationAnchor();

    if (this.variant === "multiple") {
      const selectedValues = this.values;
      if (this.required && selectedValues.length === 0) {
        this._formController.internals.setValidity(
          { valueMissing: true },
          "Please select at least one option.",
          trigger,
        );
        return;
      }
    } else if (this.required && !this.value) {
      this._formController.internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        trigger,
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  // --- Events ---

  private _fireEvents() {
    const detail: FdSelectorChangeDetail = {
      value: this.value,
      values: this.values,
    };

    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent("fd-selector-change", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }
  private _onLabelClick() {
    this._getTrigger()?.focus();
  }

  private _isFocusWithinWidget(target: EventTarget | null) {
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

  private _onTriggerBlur = (event: FocusEvent) => {
    if (this._isFocusWithinWidget(event.relatedTarget)) {
      return;
    }

    this._formController.revealIfInteractedAndInvalid();
  };

  private _onListboxFocusOut = (event: FocusEvent) => {
    if (this._isFocusWithinWidget(event.relatedTarget)) {
      return;
    }

    this._formController.revealIfInteractedAndInvalid();
  };

  // --- Keyboard ---

  private _onTriggerKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        this._openListbox();
        break;
      case "ArrowDown":
        e.preventDefault();
        this._openListbox();
        break;
      case "ArrowUp":
        e.preventDefault();
        this._openListbox();
        break;
      default:
        // Type-ahead when closed — open and search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this._openListbox();
          requestAnimationFrame(() => this._handleTypeAhead(e.key));
        }
        break;
    }
  }

  private _onListboxKeydown(e: KeyboardEvent) {
    const options = this._getEnabledOptions();
    const focused = this._getFocusedOption();
    const focusedIndex = focused ? options.indexOf(focused) : -1;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = options[focusedIndex + 1];
        if (next) this._setFocusedOption(next);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = options[focusedIndex - 1];
        if (prev) this._setFocusedOption(prev);
        break;
      }
      case "Home": {
        e.preventDefault();
        if (options.length) this._setFocusedOption(options[0]);
        break;
      }
      case "End": {
        e.preventDefault();
        if (options.length) this._setFocusedOption(options[options.length - 1]);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (focused) this._selectOption(focused);
        break;
      }
      case "Escape": {
        e.preventDefault();
        e.stopPropagation();
        this._closeListbox();
        this._getTrigger()?.focus();
        break;
      }
      case "Tab": {
        // Allow natural focus movement — close the popup
        this._closeListbox();
        break;
      }
      default: {
        // Type-ahead
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this._handleTypeAhead(e.key);
        }
        break;
      }
    }
  }

  private _handleTypeAhead(char: string) {
    this._typeAheadBuffer += char.toLowerCase();

    if (this._typeAheadTimer !== null) {
      clearTimeout(this._typeAheadTimer);
    }
    this._typeAheadTimer = setTimeout(() => {
      this._typeAheadBuffer = "";
      this._typeAheadTimer = null;
    }, 500);

    const options = this._getEnabledOptions();
    const focused = this._getFocusedOption();
    const focusedIndex = focused ? options.indexOf(focused) : -1;

    // Search from after the current focused option, then wrap to the start.
    // This allows cycling through options that share the same prefix.
    const searchOrder = [
      ...options.slice(focusedIndex + 1),
      ...options.slice(0, focusedIndex + 1),
    ];

    const match = searchOrder.find((opt) =>
      opt.displayText.toLowerCase().startsWith(this._typeAheadBuffer),
    );

    if (match) {
      this._setFocusedOption(match);
    }
  }

  // --- Option click ---

  private _onOptionSelect(e: Event) {
    const customEvent = e as CustomEvent;
    const opt = customEvent.detail?.option as FdOption | undefined;
    if (opt && !opt.disabled) {
      this._selectOption(opt);
    }
  }

  private _onOptionSelectHost = (e: Event) => {
    this._onOptionSelect(e);
  };

  // --- Slot changes ---

  private _onDefaultSlotChange() {
    this._syncOptionsVariant();
    this._assignOptionIds();
  }

  private _onDescSlotChange() {
    this._descHasContent = this._slotHasContent("description");
  }

  private _onErrorSlotChange() {
    this._errorHasContent = this._slotHasContent("error");
  }

  private _slotHasContent(name: string) {
    return Array.from(this.querySelectorAll(`[slot="${name}"]`)).some(
      (node) => Boolean(node.textContent?.trim()),
    );
  }

  // --- Shadow DOM queries ---

  private _getTrigger(): HTMLButtonElement | null {
    return this.shadowRoot?.querySelector("[part=trigger]") as HTMLButtonElement | null;
  }

  private _getListbox(): HTMLElement | null {
    return this.shadowRoot?.querySelector("[part=listbox]") as HTMLElement | null;
  }

  // --- Display text ---

  private _getDisplayText(): string {
    const selected = this._getOptions().filter((o) => o.selected);
    if (selected.length === 0) return "";
    return selected.map((o) => o.displayText).join(", ");
  }

  private _getLiveRegionText(): string {
    if (this.variant !== "multiple") return "";
    const total = this._getOptions().length;
    const selectedCount = this.values.length;
    return `${selectedCount} of ${total} options selected`;
  }

  // --- Render ---

  render() {
    const displayText = this._getDisplayText();
    const hasValue = displayText.length > 0;
    const labelId = "selector-label";
    const descId = "selector-desc";
    const errorId = "selector-error";
    const listboxId = "selector-listbox";

    const isInvalid = this.hasAttribute("data-user-invalid");
    const describedBy = [
      this._descHasContent ? descId : "",
      this._errorHasContent && isInvalid ? errorId : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div part="base">
        ${this.label
          ? html`
              <label
                part="label"
                id=${labelId}
                @click=${this._onLabelClick}
              >
                <span part="label-text">${this.label}</span>
                ${this.required
                  ? html`<span part="required-marker" aria-hidden="true">*</span>`
                  : nothing}
              </label>
            `
          : nothing}

        <div
          part="description"
          id=${descId}
          ?hidden=${!this._descHasContent}
        >
          <slot name="description" @slotchange=${this._onDescSlotChange}></slot>
        </div>

        <button
          part="trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded=${String(this.open)}
          aria-controls=${listboxId}
          aria-labelledby=${this.label ? labelId : ""}
          aria-describedby=${describedBy || nothing}
          aria-invalid=${this.hasAttribute("data-user-invalid") ? "true" : nothing}
          ?disabled=${this.disabled}
          @click=${() => (this.open ? this._closeListbox() : this._openListbox())}
          @keydown=${this._onTriggerKeydown}
          @blur=${this._onTriggerBlur}
        >
          <span
            part="value-display"
            class=${hasValue ? "" : "placeholder"}
          >
            ${hasValue ? displayText : this.placeholder}
          </span>
          <span part="chevron" aria-hidden="true">
            <svg
              class="chevron-icon"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 6.75L9 11.25L13.5 6.75"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>

        <div
          part="listbox"
          id=${listboxId}
          role="listbox"
          aria-labelledby=${this.label ? labelId : ""}
          aria-multiselectable=${this.variant === "multiple" ? "true" : nothing}
          aria-activedescendant=${this._activeDescendantId || nothing}
          tabindex="-1"
          ?hidden=${!this.open}
          @keydown=${this._onListboxKeydown}
          @focusout=${this._onListboxFocusOut}
        >
          <slot @slotchange=${this._onDefaultSlotChange}></slot>
        </div>

        <div
          part="error"
          id=${errorId}
          ?hidden=${!this._errorHasContent}
          role="alert"
        >
          <slot name="error" @slotchange=${this._onErrorSlotChange}></slot>
        </div>

        ${this.variant === "multiple"
          ? html`<div class="sr-only" aria-live="polite">
              ${this._getLiveRegionText()}
            </div>`
          : nothing}
      </div>
    `;
  }
}
