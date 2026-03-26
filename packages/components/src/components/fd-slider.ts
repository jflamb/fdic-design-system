import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { SingleValueFormController } from "./single-value-form-controller.js";

type NormalizedSliderConfig = {
  min: number;
  max: number;
  step: number;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const DEFAULT_INPUT_LABEL_SUFFIX = " value";

export class FdSlider extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { reflect: true },
    label: { reflect: true },
    hint: { reflect: true },
    min: { type: Number, reflect: true },
    max: { type: Number, reflect: true },
    step: { type: Number, reflect: true },
    value: { type: Number, reflect: true },
    disabled: { type: Boolean, reflect: true },
    showInput: { attribute: "show-input", type: Boolean, reflect: true },
    _bubbleVisible: { state: true },
    _draftValue: { state: true },
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
      color: var(--fdic-text-primary, #212123);
    }

    :host([hidden]) {
      display: none;
    }

    :host([disabled]) {
      color: var(--fdic-text-secondary, #595961);
    }

    .fd-slider {
      display: flex;
      flex-direction: column;
      gap: var(--fdic-spacing-xs, 8px);
      width: 100%;
    }

    [part="label"] {
      margin: 0;
      font: inherit;
      color: inherit;
    }

    [part="hint"] {
      margin: 0;
      font-size: var(--fdic-font-size-body-small, 1rem);
      color: var(--fdic-text-secondary, #595961);
    }

    [part="hint"][hidden] {
      display: none;
    }

    [part="control"] {
      display: flex;
      align-items: center;
      gap: var(--fdic-spacing-md, 16px);
      width: 100%;
    }

    .fd-slider__range-shell {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      min-width: 0;
      min-height: 44px;
    }

    [part="track"],
    [part="fill"] {
      position: absolute;
      inset-inline: 0;
      top: 50%;
      height: var(--fd-slider-track-height, 8px);
      transform: translateY(-50%);
      border-radius: var(
        --fd-slider-track-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      pointer-events: none;
    }

    [part="track"] {
      background: var(
        --fd-slider-track-background,
        var(--fdic-border-input-interactive, #e0e0e2)
      );
    }

    [part="fill"] {
      inset-inline-end: auto;
      width: calc(var(--fd-slider-percent, 0) * 1%);
      background: var(
        --fd-slider-track-fill,
        var(--fdic-brand-core-default, #0d6191)
      );
    }

    :host([disabled]) [part="fill"] {
      background: var(--fdic-border-divider, #bdbdbf);
    }

    [part="range"] {
      position: relative;
      z-index: 2;
      inline-size: 100%;
      block-size: 44px;
      margin: 0;
      border: none;
      background: transparent;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      accent-color: var(--fdic-brand-core-default, #0d6191);
    }

    [part="range"]:focus {
      outline: none;
    }

    :host([disabled]) [part="range"] {
      cursor: not-allowed;
    }

    [part="range"]::-webkit-slider-runnable-track {
      height: var(--fd-slider-track-height, 8px);
      background: transparent;
      border: none;
      border-radius: var(
        --fd-slider-track-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
    }

    [part="range"]::-moz-range-track {
      height: var(--fd-slider-track-height, 8px);
      background: transparent;
      border: none;
      border-radius: var(
        --fd-slider-track-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
    }

    [part="range"]::-webkit-slider-thumb {
      margin-top: calc((var(--fd-slider-track-height, 8px) - 20px) / 2);
      inline-size: var(--fd-slider-thumb-size, 20px);
      block-size: var(--fd-slider-thumb-size, 20px);
      border: 4px solid
        var(
          --fd-slider-thumb-border,
          var(--fdic-color-icon-active, #1278b0)
        );
      border-radius: 9999px;
      background: var(
        --fd-slider-thumb-background,
        var(--fdic-background-base, #ffffff)
      );
      box-sizing: border-box;
      appearance: none;
      -webkit-appearance: none;
      transition: background-color 120ms ease, border-color 120ms ease,
        box-shadow 120ms ease;
    }

    [part="range"]::-moz-range-thumb {
      inline-size: var(--fd-slider-thumb-size, 20px);
      block-size: var(--fd-slider-thumb-size, 20px);
      border: 4px solid
        var(
          --fd-slider-thumb-border,
          var(--fdic-color-icon-active, #1278b0)
        );
      border-radius: 9999px;
      background: var(
        --fd-slider-thumb-background,
        var(--fdic-background-base, #ffffff)
      );
      box-sizing: border-box;
      transition: background-color 120ms ease, border-color 120ms ease,
        box-shadow 120ms ease;
    }

    :host([data-range-hover]) [part="range"]::-webkit-slider-thumb {
      background: var(
        --fd-slider-thumb-hover-background,
        var(--fdic-background-container, #f5f5f7)
      );
    }

    :host([data-range-hover]) [part="range"]::-moz-range-thumb {
      background: var(
        --fd-slider-thumb-hover-background,
        var(--fdic-background-container, #f5f5f7)
      );
    }

    :host([data-range-dragging]) [part="range"]::-webkit-slider-thumb {
      background: var(
        --fd-slider-thumb-pressed-background,
        var(--fdic-background-selected, #b4e4f8)
      );
    }

    :host([data-range-dragging]) [part="range"]::-moz-range-thumb {
      background: var(
        --fd-slider-thumb-pressed-background,
        var(--fdic-background-selected, #b4e4f8)
      );
    }

    [part="range"]:focus-visible::-webkit-slider-thumb {
      box-shadow:
        0 0 0 2px var(--fdic-background-base, #ffffff),
        0 0 0 4px var(--fdic-border-input-focus, #38b6ff);
    }

    [part="range"]:focus-visible::-moz-range-thumb {
      box-shadow:
        0 0 0 2px var(--fdic-background-base, #ffffff),
        0 0 0 4px var(--fdic-border-input-focus, #38b6ff);
    }

    :host([disabled]) [part="range"]::-webkit-slider-thumb {
      border-color: var(--fdic-border-divider, #bdbdbf);
      background: var(--fdic-background-container, #f5f5f7);
    }

    :host([disabled]) [part="range"]::-moz-range-thumb {
      border-color: var(--fdic-border-divider, #bdbdbf);
      background: var(--fdic-background-container, #f5f5f7);
    }

    [part="value-bubble"] {
      position: absolute;
      left: calc(
        ((100% - var(--fd-slider-thumb-size, 20px)) * var(--fd-slider-percent, 0) / 100) +
          (var(--fd-slider-thumb-size, 20px) / 2)
      );
      bottom: calc(50% + (var(--fd-slider-thumb-size, 20px) / 2) + 8px);
      z-index: 3;
      min-width: 24px;
      padding: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-sm, 12px);
      border-radius: var(
        --fd-slider-bubble-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(--fd-slider-bubble-background, var(--ds-color-bg-inverted, #212123));
      color: var(--fd-slider-bubble-color, var(--ds-color-text-inverted, #ffffff));
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: 1.375;
      text-align: center;
      transform: translateX(-50%);
      white-space: nowrap;
      box-shadow:
        0 8px 16px rgba(0, 0, 0, 0.16),
        0 6px 8px rgba(0, 0, 0, 0.12),
        0 4px 4px rgba(0, 0, 0, 0.08),
        0 2px 2px rgba(0, 0, 0, 0.06),
        0 1px 1px rgba(0, 0, 0, 0.05);
      pointer-events: none;
    }

    [part="value-bubble"]::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -6px;
      width: 12px;
      height: 12px;
      background: inherit;
      transform: translateX(-50%) rotate(45deg);
    }

    [part="value-bubble"][hidden] {
      display: none;
    }

    [part="input"] {
      flex: 0 0 auto;
      inline-size: var(--fd-slider-input-width, 56px);
      min-block-size: 44px;
      padding: 8px 12px;
      border: 1px solid
        var(
          --fd-slider-input-border-color,
          var(--fdic-border-input-rest, #bdbdbf)
        );
      border-radius: var(
        --fd-slider-input-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
      background: var(
        --fd-slider-input-background,
        var(--fdic-background-base, #ffffff)
      );
      box-sizing: border-box;
      font: inherit;
      color: inherit;
      text-align: center;
      appearance: textfield;
      -moz-appearance: textfield;
    }

    [part="input"]:focus-visible {
      outline: 2px solid var(--fdic-border-input-active, #424244);
      outline-offset: 0;
      border-width: 2px;
      box-shadow: 0 0 2.5px 2px var(--fdic-border-input-focus, #38b6ff);
    }

    [part="input"]::-webkit-outer-spin-button,
    [part="input"]::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    :host([disabled]) [part="input"] {
      border-color: var(--fdic-border-divider, #d6d6d8);
      background: var(--fdic-background-container, #f5f5f7);
      color: var(--fdic-text-disabled, #9e9ea0);
      cursor: not-allowed;
    }

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

    @media (forced-colors: active) {
      [part="track"] {
        background: GrayText;
      }

      [part="fill"] {
        background: Highlight;
      }

      [part="range"]::-webkit-slider-thumb {
        border-color: ButtonText;
        background: Canvas;
      }

      [part="range"]::-moz-range-thumb {
        border-color: ButtonText;
        background: Canvas;
      }

      [part="range"]:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 4px Highlight;
      }

      [part="range"]:focus-visible::-moz-range-thumb {
        box-shadow: 0 0 0 4px Highlight;
      }

      [part="input"] {
        border-color: ButtonText;
        background: Canvas;
        color: CanvasText;
      }

      :host([disabled]) [part="input"] {
        border-color: GrayText;
        color: GrayText;
      }

      [part="value-bubble"] {
        border: 1px solid ButtonText;
        background: CanvasText;
        color: Canvas;
        box-shadow: none;
      }
    }
  `;

  declare name: string;
  declare label: string;
  declare hint: string;
  declare min: number;
  declare max: number;
  declare step: number;
  declare value: number;
  declare disabled: boolean;
  declare showInput: boolean;
  declare _bubbleVisible: boolean;
  declare _draftValue: string;

  private _formController: SingleValueFormController;
  private _instanceId: number;
  private _numberInputFocused = false;
  private _hasExplicitValue = false;
  private _hasInitializedValue = false;
  private _isNormalizingValue = false;
  private _defaultValue = 0;
  private _normalizationWarnings = new Set<string>();

  private static _instanceCounter = 0;

  constructor() {
    super();
    this.name = "";
    this.label = "";
    this.hint = "";
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = 0;
    this.disabled = false;
    this.showInput = false;
    this._bubbleVisible = false;
    this._draftValue = "0";
    this._instanceId = FdSlider._instanceCounter++;
    this._formController = new SingleValueFormController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._rangeInput ?? undefined,
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

  override connectedCallback() {
    super.connectedCallback();
    this._normalizeAuthorState();
    this._formController.sync();
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has("value") && !this._isNormalizingValue) {
      this._hasExplicitValue = true;
    }

    if (
      changed.has("min") ||
      changed.has("max") ||
      changed.has("step") ||
      changed.has("value")
    ) {
      if (this._normalizeAuthorState()) {
        return;
      }
    }

    if (changed.has("disabled") && this.disabled) {
      this._setRangeHover(false);
      this._setRangeDragging(false);
      this._setBubbleVisible(false);
    }

    if (
      changed.has("name") ||
      changed.has("disabled") ||
      changed.has("value") ||
      changed.has("min") ||
      changed.has("max") ||
      changed.has("step")
    ) {
      this._formController.sync();
    }

    if ((changed.has("value") || changed.has("showInput")) && !this._numberInputFocused) {
      this._draftValue = String(this.value);
    }
  }

  override focus(options?: FocusOptions) {
    this._rangeInput?.focus(options);
  }

  checkValidity() {
    return this._formController.checkValidity();
  }

  reportValidity() {
    return this._formController.reportValidity();
  }

  stepUp(increment = 1) {
    const config = this._normalizedConfig;
    this._commitValue(this.value + config.step * increment, {
      emitInput: false,
      emitChange: false,
    });
  }

  stepDown(decrement = 1) {
    const config = this._normalizedConfig;
    this._commitValue(this.value - config.step * decrement, {
      emitInput: false,
      emitChange: false,
    });
  }

  formResetCallback() {
    this._setNormalizedValue(this._defaultValue);
    this._draftValue = String(this._defaultValue);
    this._setBubbleVisible(false);
    this._formController.reset();
  }

  private get _rangeInput(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector("[part=range]") ?? null;
  }

  private get _numberInput(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector("[part=input]") ?? null;
  }

  private get _labelId() {
    return `fd-slider-label-${this._instanceId}`;
  }

  private get _hintId() {
    return `fd-slider-hint-${this._instanceId}`;
  }

  private get _rangeId() {
    return `fd-slider-range-${this._instanceId}`;
  }

  private get _normalizedConfig(): NormalizedSliderConfig {
    return this._normalizeConstraints();
  }

  private get _percent() {
    const { min, max } = this._normalizedConfig;
    if (max <= min) {
      return 0;
    }

    return ((this.value - min) / (max - min)) * 100;
  }

  private get _groupDescribedBy() {
    return this.hint ? this._hintId : undefined;
  }

  private get _numberInputLabel() {
    const baseLabel = this.label?.trim() || "Slider";
    return `${baseLabel}${DEFAULT_INPUT_LABEL_SUFFIX}`;
  }

  private _syncFormValue() {
    if (this.disabled || !this.name) {
      this._formController.internals.setFormValue(null);
      return;
    }

    this._formController.internals.setFormValue(String(this.value));
  }

  private _syncValidity() {
    this._formController.internals.setValidity({});
  }

  private _normalizeConstraints(): NormalizedSliderConfig {
    let min = this._coerceInteger(this.min, DEFAULT_MIN, "min");
    let max = this._coerceInteger(this.max, DEFAULT_MAX, "max");
    let step = this._coerceInteger(this.step, DEFAULT_STEP, "step");

    if (step <= 0) {
      this._warnNormalization(
        "step-non-positive",
        `Invalid step "${this.step}" received. Falling back to ${DEFAULT_STEP}.`,
      );
      step = DEFAULT_STEP;
    }

    if (min > max) {
      this._warnNormalization(
        "min-max-order",
        `min (${min}) is greater than max (${max}). Swapping the values.`,
      );
      [min, max] = [max, min];
    }

    return { min, max, step };
  }

  private _normalizeAuthorState() {
    const config = this._normalizedConfig;
    const shouldUseMidpoint =
      !this._hasInitializedValue &&
      !this.hasAttribute("value") &&
      !this._hasExplicitValue;
    const candidate = shouldUseMidpoint
      ? config.min + (config.max - config.min) / 2
      : this.value;
    const normalized = this._normalizeCommittedValue(candidate, config);

    if (!this._hasInitializedValue) {
      this._defaultValue = normalized;
      this._hasInitializedValue = true;
    }

    if (normalized !== this.value) {
      this._setNormalizedValue(normalized);
      return true;
    }

    if (!this._numberInputFocused) {
      this._draftValue = String(normalized);
    }

    return false;
  }

  private _coerceInteger(
    value: number,
    fallback: number,
    fieldName: "min" | "max" | "step",
  ) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      this._warnNormalization(
        `${fieldName}-non-finite`,
        `Invalid ${fieldName} "${value}" received. Falling back to ${fallback}.`,
      );
      return fallback;
    }

    if (!Number.isInteger(numericValue)) {
      const rounded = Math.round(numericValue);
      this._warnNormalization(
        `${fieldName}-rounded`,
        `${fieldName} "${numericValue}" is not an integer. Rounding to ${rounded}.`,
      );
      return rounded;
    }

    return numericValue;
  }

  private _normalizeCommittedValue(
    rawValue: number,
    config: NormalizedSliderConfig,
  ) {
    const candidate = Number.isFinite(rawValue)
      ? Math.round(rawValue)
      : config.min + (config.max - config.min) / 2;
    const clamped = Math.min(config.max, Math.max(config.min, candidate));
    const stepsFromMin = Math.round((clamped - config.min) / config.step);
    const aligned = config.min + stepsFromMin * config.step;
    return Math.min(config.max, Math.max(config.min, aligned));
  }

  private _setNormalizedValue(nextValue: number) {
    this._isNormalizingValue = true;
    this.value = nextValue;
    this._isNormalizingValue = false;
  }

  private _warnNormalization(key: string, message: string) {
    if (this._normalizationWarnings.has(key)) {
      return;
    }

    this._normalizationWarnings.add(key);
    console.warn(`[fd-slider] ${message}`);
  }

  private _isStepAligned(value: number, config: NormalizedSliderConfig) {
    return Math.abs((value - config.min) % config.step) < 0.000001;
  }

  private _parseDraftValue(draft: string) {
    const trimmed = draft.trim();
    if (!trimmed || !/^-?\d+$/.test(trimmed)) {
      return null;
    }

    const parsed = Number(trimmed);
    const config = this._normalizedConfig;
    if (
      !Number.isSafeInteger(parsed) ||
      parsed < config.min ||
      parsed > config.max ||
      !this._isStepAligned(parsed, config)
    ) {
      return null;
    }

    return parsed;
  }

  private _commitValue(
    nextValue: number,
    options: { emitInput: boolean; emitChange: boolean },
  ) {
    const normalized = this._normalizeCommittedValue(
      nextValue,
      this._normalizedConfig,
    );
    const changed = normalized !== this.value;

    if (changed) {
      this._setNormalizedValue(normalized);
    }

    this._draftValue = String(normalized);
    this._formController.markInteracted();
    this._formController.sync();

    if (options.emitInput && changed) {
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    if (options.emitChange) {
      this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    }
  }

  private _commitDraftValue() {
    const input = this._numberInput;
    if (!input) {
      return;
    }

    const rawDraft = input.value;
    if (!rawDraft.trim()) {
      this._draftValue = String(this.value);
      input.value = this._draftValue;
      return;
    }

    const normalized = this._normalizeCommittedValue(
      Number(rawDraft),
      this._normalizedConfig,
    );
    const changed = normalized !== this.value;

    this._commitValue(normalized, {
      emitInput: changed,
      emitChange: changed,
    });
    input.value = String(this.value);
  }

  private _setBubbleVisible(value: boolean) {
    this._bubbleVisible = value && !this.disabled;
  }

  private _setRangeHover(value: boolean) {
    this.toggleAttribute("data-range-hover", value && !this.disabled);
    this._setBubbleVisible(
      value || this.hasAttribute("data-range-dragging") || this.matches("[data-range-focus]"),
    );
  }

  private _setRangeDragging(value: boolean) {
    this.toggleAttribute("data-range-dragging", value && !this.disabled);
    this._setBubbleVisible(
      value || this.hasAttribute("data-range-hover") || this.matches("[data-range-focus]"),
    );
  }

  private _setRangeFocus(value: boolean) {
    this.toggleAttribute("data-range-focus", value && !this.disabled);
    this._setBubbleVisible(
      value || this.hasAttribute("data-range-hover") || this.hasAttribute("data-range-dragging"),
    );
  }

  private _onRangeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._commitValue(Number(input.value), { emitInput: true, emitChange: false });
  }

  private _onRangeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this._commitValue(Number(input.value), {
      emitInput: false,
      emitChange: true,
    });
  }

  private _onNumberFocus() {
    this._numberInputFocused = true;
    this._draftValue = String(this.value);
  }

  private _onNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._numberInputFocused = true;
    this._draftValue = input.value;

    const parsed = this._parseDraftValue(this._draftValue);
    if (parsed == null) {
      return;
    }

    this._commitValue(parsed, { emitInput: true, emitChange: false });
  }

  private _onNumberBlur() {
    this._numberInputFocused = false;
    this._commitDraftValue();
  }

  private _onNumberKeydown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event.key === "Enter") {
      event.preventDefault();
      this._commitDraftValue();
      input.select();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this._draftValue = String(this.value);
      input.value = this._draftValue;
      input.select();
    }
  }

  render() {
    const percent = this._percent;
    const config = this._normalizedConfig;

    return html`
      <div class="fd-slider">
        <label id=${this._labelId} for=${this._rangeId} part="label">
          ${this.label}
        </label>
        ${this.hint
          ? html`
              <p id=${this._hintId} part="hint">
                ${this.hint}
              </p>
            `
          : nothing}
        <div
          part="control"
          role="group"
          aria-labelledby=${this._labelId}
          aria-describedby=${ifDefined(this._groupDescribedBy)}
        >
          <div
            class="fd-slider__range-shell"
            style=${`--fd-slider-percent: ${percent};`}
          >
            <div part="track" aria-hidden="true"></div>
            <div part="fill" aria-hidden="true"></div>
            <input
              id=${this._rangeId}
              part="range"
              type="range"
              min=${String(config.min)}
              max=${String(config.max)}
              step=${String(config.step)}
              .value=${String(this.value)}
              ?disabled=${this.disabled}
              aria-labelledby=${this._labelId}
              aria-describedby=${ifDefined(this._groupDescribedBy)}
              @input=${this._onRangeInput}
              @change=${this._onRangeChange}
              @focus=${() => this._setRangeFocus(true)}
              @blur=${() => this._setRangeFocus(false)}
              @pointerenter=${() => this._setRangeHover(true)}
              @pointerleave=${() => this._setRangeHover(false)}
              @pointerdown=${() => this._setRangeDragging(true)}
              @pointerup=${() => this._setRangeDragging(false)}
              @pointercancel=${() => this._setRangeDragging(false)}
            />
            <output
              part="value-bubble"
              aria-hidden="true"
              ?hidden=${!this._bubbleVisible}
            >
              ${this.value}
            </output>
          </div>
          ${this.showInput
            ? html`
                <input
                  part="input"
                  type="number"
                  inputmode="numeric"
                  min=${String(config.min)}
                  max=${String(config.max)}
                  step=${String(config.step)}
                  .value=${this._draftValue}
                  ?disabled=${this.disabled}
                  aria-label=${this._numberInputLabel}
                  aria-describedby=${ifDefined(this._groupDescribedBy)}
                  @focus=${this._onNumberFocus}
                  @input=${this._onNumberInput}
                  @blur=${this._onNumberBlur}
                  @keydown=${this._onNumberKeydown}
                />
              `
            : nothing}
        </div>
        <span class="sr-only" aria-live="polite"></span>
      </div>
    `;
  }
}
