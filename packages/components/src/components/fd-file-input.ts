import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";
import { FormControlController } from "./form-control-controller.js";

export type FileInputItemState =
  | "uploading"
  | "success"
  | "error"
  | "invalid";

export type FileInputRejectReason = "type" | "size" | "count";

export type FileInputRejectedFile = {
  file: File;
  reason: FileInputRejectReason;
};

export type FileInputItem = {
  id: string;
  fileName: string;
  state: FileInputItemState;
  message?: string;
  progress?: number;
  file?: File;
};

export interface FdFileInputChangeDetail {
  files: File[];
  rejectedFiles: FileInputRejectedFile[];
}

export interface FdFileInputActionDetail {
  action: "cancel" | "remove" | "retry" | "dismiss";
  itemId: string;
}

const DEFAULT_SELECT_LABEL = "Select file";
const DEFAULT_DROP_TEXT = "or drop here";
const DEFAULT_REQUIRED_MESSAGE = "Select a file.";
const DEFAULT_INVALID_MESSAGE = "Choose a valid file.";
const DEFAULT_LIMIT_MESSAGE = "You’ve reached the file upload limit.";

export class FdFileInput extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { reflect: true },
    label: { reflect: true },
    hint: { reflect: true },
    buttonText: { attribute: "button-text", reflect: true },
    dropText: { attribute: "drop-text", reflect: true },
    errorMessage: { attribute: "error-message", reflect: true },
    limitText: { attribute: "limit-text", reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    multiple: { type: Boolean, reflect: true },
    accept: { reflect: true },
    maxFiles: { attribute: "max-files", type: Number, reflect: true },
    maxFileSize: { attribute: "max-file-size", type: Number, reflect: true },
    items: { attribute: false },
    _dragActive: { state: true },
    _liveMessage: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      color: var(--ds-color-text-primary, #212123);
    }

    :host([hidden]) {
      display: none;
    }

    [part="container"] {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--fd-file-input-gap, var(--ds-spacing-md, 16px));
      padding: var(--ds-spacing-lg, 20px) var(--ds-spacing-xl, 24px);
      border: 1px solid
        var(
          --fd-file-input-border-color,
          var(--ds-color-border-input, #bdbdbf)
        );
      border-radius: var(
        --fd-file-input-radius,
        var(--ds-corner-radius-md, 5px)
      );
      background: var(
        --fd-file-input-background,
        var(--ds-color-bg-base, #ffffff)
      );
      box-sizing: border-box;
      overflow: clip;
    }

    [part="container"]::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      box-shadow: inset 0 0 0 0 var(--ds-color-overlay-hover, rgba(0, 0, 0, 0));
      transition:
        box-shadow var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease),
        background-color var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease),
        border-color var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease);
    }

    [part="container"]:hover {
      border-color: var(
        --fd-file-input-border-color-hover,
        var(--ds-color-border-input-active, #424244)
      );
    }

    :host([data-user-invalid]) [part="container"] {
      border-width: 2px;
      border-color: var(--ds-color-semantic-fg-error, #d80e3a);
    }

    :host([data-drag-active]) [part="container"] {
      border-width: 2px;
      border-color: var(
        --fd-file-input-border-color-hover,
        var(--ds-color-border-input-active, #424244)
      );
    }

    :host([data-drag-active]) [part="container"]::before {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-file-input-drop-overlay,
          var(--ds-color-overlay-hover)
        );
    }

    [part="container"]:focus-within {
      border-width: 2px;
      border-color: var(--ds-color-border-input-active, #424244);
      box-shadow: 0 0 2.5px 2px
        var(
          --fd-file-input-focus-ring,
          var(--ds-focus-ring-color, #38b6ff)
        );
    }

    :host([disabled]) [part="container"] {
      border-color: var(--ds-color-border-divider, #d6d6d8);
      background: var(--ds-color-bg-container, #f5f5f7);
      color: var(--ds-color-text-secondary, #595961);
    }

    [part="label"] {
      margin: 0;
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 600;
      line-height: 1.375;
    }

    .fd-file-input__required {
      color: var(--ds-color-semantic-fg-error, #d80e3a);
    }

    .fd-file-input__controls {
      display: flex;
      align-items: center;
      gap: var(--ds-spacing-xl, 24px);
      flex-wrap: wrap;
    }

    .fd-file-input__browse {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: var(--fd-file-input-height, 44px);
      min-width: var(--fd-file-input-min-width, 44px);
      padding-inline: 11px;
      gap: var(--ds-spacing-2xs, 4px);
      border-radius: var(--ds-corner-radius-sm, 3px);
      background: var(--ds-color-bg-interactive, #f5f5f7);
      color: inherit;
      box-sizing: border-box;
      overflow: hidden;
    }

    .fd-file-input__browse-icon {
      display: inline-flex;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .fd-file-input__browse-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: var(--fd-file-input-height, 44px);
      padding-inline: 6px;
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 400;
      line-height: 1.375;
      white-space: nowrap;
    }

    [part="native"] {
      position: absolute;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 1;
      margin: 0;
    }

    :host([disabled]) [part="native"] {
      cursor: not-allowed;
    }

    .fd-file-input__browse:has([part="native"]:focus-visible) {
      outline: 2px solid var(--ds-color-border-input-active, #424244);
      outline-offset: 2px;
    }

    .fd-file-input__drop-text {
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 400;
      line-height: 1.375;
      color: inherit;
      white-space: nowrap;
    }

    [part="hint"],
    [part="error"],
    [part="limit"],
    [part="summary"] {
      margin: 0;
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: 1.375;
    }

    [part="hint"],
    [part="summary"] {
      color: var(--ds-color-text-secondary, #595961);
    }

    [part="error"] {
      color: var(--ds-color-semantic-fg-error, #d80e3a);
    }

    [part="limit"] {
      color: var(--ds-color-text-primary, #212123);
      font-size: var(--fdic-font-size-body, 18px);
      line-height: 1.375;
    }

    [part="list"] {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ds-spacing-md, 16px);
      list-style: none;
      padding: 0;
      margin: 0;
    }

    [part="item"] {
      display: flex;
      flex: 1 1 344px;
      min-width: 280px;
      flex-direction: column;
      gap: var(--ds-spacing-xs, 8px);
      padding: var(--ds-spacing-xs, 8px) var(--ds-spacing-sm, 12px)
        var(--ds-spacing-sm, 12px);
      border: 1px solid
        var(
          --fd-file-input-item-border-color,
          var(--ds-color-border-input-interactive, #e8e8ed)
        );
      border-radius: var(--ds-corner-radius-sm, 3px);
      background: var(--ds-color-bg-base, #ffffff);
      box-sizing: border-box;
    }

    .fd-file-input__item-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ds-spacing-sm, 12px);
    }

    .fd-file-input__item-copy {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--ds-spacing-2xs, 4px);
      min-width: 0;
    }

    .fd-file-input__file-name {
      margin: 0;
      font-size: var(--fdic-font-size-body, 18px);
      line-height: 1.375;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part="item-status"] {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--ds-spacing-2xs, 4px);
      font-size: var(--fdic-font-size-body-small, 1rem);
      line-height: 1.375;
      color: var(--ds-color-text-secondary, #595961);
    }

    .fd-file-input__status-icon {
      display: inline-flex;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .fd-file-input__status-icon--uploading {
      animation: fd-file-input-spin 0.8s linear infinite;
    }

    [data-state="error"] [part="item-status"] {
      color: var(--ds-color-semantic-fg-error, #d80e3a);
    }

    [data-state="success"] [part="item-status"] {
      color: var(--ds-color-semantic-fg-success, #1e8232);
    }

    [data-state="invalid"] [part="item-status"] {
      color: var(--ds-color-semantic-fg-warning, #8a6100);
    }

    [part="item-action"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 44px;
      block-size: 44px;
      padding: 0;
      border: none;
      border-radius: var(--ds-corner-radius-sm, 3px);
      background: transparent;
      color: inherit;
      cursor: pointer;
      flex-shrink: 0;
    }

    [part="item-action"]:hover {
      box-shadow: inset 0 0 0 999px
        var(--ds-color-overlay-hover);
    }

    [part="item-action"]:active {
      box-shadow: inset 0 0 0 999px
        var(--ds-color-overlay-pressed);
    }

    [part="item-action"]:focus-visible {
      outline: 2px solid var(--ds-color-border-input-active, #424244);
      outline-offset: -2px;
      box-shadow: 0 0 2.5px 2px var(--ds-focus-ring-color, #38b6ff);
    }

    :host([disabled]) [part="item-action"] {
      cursor: not-allowed;
      opacity: 0.45;
      pointer-events: none;
    }

    .fd-file-input__indicator {
      display: flex;
      inline-size: 100%;
      block-size: 2px;
      overflow: hidden;
      border-radius: 1px;
      background: var(--ds-color-bg-interactive, #f5f5f7);
    }

    .fd-file-input__indicator-progress {
      block-size: 100%;
      background: var(
        --fd-file-input-progress-color,
        var(--ds-color-border-input-focus, #38b6ff)
      );
      min-inline-size: 0;
      transition: inline-size var(--ds-motion-duration-fast, 120ms) var(--ds-motion-easing-default, ease);
    }

    [data-state="success"] .fd-file-input__indicator-progress {
      inline-size: 100%;
      background: var(--ds-color-semantic-fg-success, #1e8232);
    }

    [data-state="error"] .fd-file-input__indicator-progress {
      inline-size: 100%;
      background: var(--ds-color-semantic-fg-error, #d80e3a);
    }

    [data-state="invalid"] .fd-file-input__indicator-progress {
      inline-size: 100%;
      background: var(--ds-color-semantic-fg-warning, #8a6100);
    }

    .fd-file-input__sr-only {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes fd-file-input-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part="container"]::before,
      .fd-file-input__indicator-progress,
      .fd-file-input__status-icon--uploading {
        transition: none;
        animation: none;
      }
    }

    @media (forced-colors: active) {
      [part="container"] {
        border-color: ButtonText;
      }

      :host([data-user-invalid]) [part="container"] {
        border-color: LinkText;
      }

      [part="container"]:focus-within {
        border-color: LinkText;
        box-shadow: none;
      }

      .fd-file-input__browse {
        background: ButtonFace;
        border: 1px solid ButtonText;
      }

      .fd-file-input__browse:has([part="native"]:focus-visible) {
        outline-color: LinkText;
      }

      [part="error"] {
        color: LinkText;
        forced-color-adjust: none;
      }

      [data-state="success"] [part="item-status"],
      [data-state="invalid"] [part="item-status"],
      [data-state="error"] [part="item-status"] {
        color: ButtonText;
        forced-color-adjust: none;
      }

      .fd-file-input__indicator-progress {
        background: Highlight;
        forced-color-adjust: none;
      }

      [part="item-action"]:focus-visible {
        box-shadow: none;
        outline-color: LinkText;
      }
    }

    @media print {
      [part="container"] {
        border: 1px solid #000;
        background: none;
        box-shadow: none;
      }

      [part="container"]::before {
        display: none;
      }

      .fd-file-input__status-icon--uploading {
        animation: none;
      }
    }
  `;

  declare name: string;
  declare label: string;
  declare hint: string;
  declare buttonText: string;
  declare dropText: string;
  declare errorMessage: string;
  declare limitText: string;
  declare required: boolean;
  declare disabled: boolean;
  declare multiple: boolean;
  declare accept: string;
  declare maxFiles: number | undefined;
  declare maxFileSize: number | undefined;
  declare items: FileInputItem[];
  declare _dragActive: boolean;
  declare _liveMessage: string;

  private _acceptedFiles: File[] = [];
  private _selectionError = false;
  private _dragDepth = 0;
  private _instanceId: number;
  private _formController: FormControlController;

  private static _instanceCounter = 0;

  constructor() {
    super();
    this.name = "";
    this.label = "";
    this.hint = "";
    this.buttonText = DEFAULT_SELECT_LABEL;
    this.dropText = DEFAULT_DROP_TEXT;
    this.errorMessage = "";
    this.limitText = DEFAULT_LIMIT_MESSAGE;
    this.required = false;
    this.disabled = false;
    this.multiple = false;
    this.accept = "";
    this.maxFiles = undefined;
    this.maxFileSize = undefined;
    this.items = [];
    this._dragActive = false;
    this._liveMessage = "";
    this._instanceId = FdFileInput._instanceCounter++;
    this._formController = new FormControlController({
      host: this,
      syncFormValue: () => this._syncFormValue(),
      syncValidity: () => this._syncValidity(),
      getValidationAnchor: () => this._input ?? undefined,
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

  get files(): File[] {
    return [...this._acceptedFiles];
  }

  override connectedCallback() {
    super.connectedCallback();
    this._formController.sync();
  }

  override updated(changed: PropertyValues<this>) {
    if (
      changed.has("name") ||
      changed.has("required") ||
      changed.has("disabled") ||
      changed.has("maxFiles") ||
      changed.has("maxFileSize") ||
      changed.has("errorMessage")
    ) {
      this._formController.sync();
    }
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  checkValidity() {
    return this._formController.checkValidity();
  }

  reportValidity() {
    this._formController.markInteracted();
    this._formController.revealIfInvalid();
    return this._formController.reportCurrentValidity();
  }

  clear() {
    this._acceptedFiles = [];
    this._selectionError = false;
    this._liveMessage = "";
    this._dragDepth = 0;
    this._setDragActive(false);
    if (this._input) {
      this._input.value = "";
    }
    this._formController.reset();
    this.requestUpdate();
  }

  formResetCallback() {
    this.clear();
  }

  private get _input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector("[part=native]") ?? null;
  }

  private get _labelId() {
    return `fd-file-input-label-${this._instanceId}`;
  }

  private get _hintId() {
    return `fd-file-input-hint-${this._instanceId}`;
  }

  private get _errorId() {
    return `fd-file-input-error-${this._instanceId}`;
  }

  private get _liveId() {
    return `fd-file-input-live-${this._instanceId}`;
  }

  private get _isFull() {
    return this.maxFiles != null && this._acceptedFiles.length >= this.maxFiles;
  }

  private get _showError() {
    return this.hasAttribute("data-user-invalid") && Boolean(this.validationMessage);
  }

  private get _renderedItems() {
    return Array.isArray(this.items) ? this.items : [];
  }

  private get _summaryText() {
    if (this._renderedItems.length > 0 || this._acceptedFiles.length === 0) {
      return "";
    }

    return this._acceptedFiles.length === 1
      ? "1 file selected."
      : `${this._acceptedFiles.length} files selected.`;
  }

  private _syncFormValue() {
    if (!this.name || this._acceptedFiles.length === 0) {
      this._formController.internals.setFormValue(null);
      return;
    }

    if (!this.multiple) {
      this._formController.internals.setFormValue(this._acceptedFiles[0] ?? null);
      return;
    }

    const formData = new FormData();
    for (const file of this._acceptedFiles) {
      formData.append(this.name, file, file.name);
    }
    this._formController.internals.setFormValue(formData);
  }

  private _syncValidity() {
    const anchor = this._input ?? undefined;

    if (this.disabled) {
      this._formController.internals.setValidity({});
      return;
    }

    if (this.required && this._acceptedFiles.length === 0) {
      this._formController.internals.setValidity(
        { valueMissing: true },
        this.errorMessage || DEFAULT_REQUIRED_MESSAGE,
        anchor,
      );
      return;
    }

    if (this._selectionError && this._acceptedFiles.length === 0) {
      this._formController.internals.setValidity(
        { customError: true },
        this.errorMessage || DEFAULT_INVALID_MESSAGE,
        anchor,
      );
      return;
    }

    this._formController.internals.setValidity({});
  }

  private _setDragActive(value: boolean) {
    this._dragActive = value;
    if (value) {
      this.setAttribute("data-drag-active", "");
    } else {
      this.removeAttribute("data-drag-active");
    }
  }

  private _dispatchChange(rejectedFiles: FileInputRejectedFile[]) {
    const detail: FdFileInputChangeDetail = {
      files: [...this._acceptedFiles],
      rejectedFiles,
    };

    this.dispatchEvent(
      new CustomEvent<FdFileInputChangeDetail>("fd-file-input-change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _dispatchAction(detail: FdFileInputActionDetail) {
    this.dispatchEvent(
      new CustomEvent<FdFileInputActionDetail>("fd-file-input-action", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _announceSelection(
    acceptedCount: number,
    rejectedFiles: FileInputRejectedFile[],
  ) {
    if (rejectedFiles.length > 0 && acceptedCount === 0) {
      this._liveMessage = this.errorMessage || DEFAULT_INVALID_MESSAGE;
      return;
    }

    if (acceptedCount > 0 && rejectedFiles.length > 0) {
      this._liveMessage = `${acceptedCount} file${acceptedCount === 1 ? "" : "s"} selected. ${rejectedFiles.length} file${rejectedFiles.length === 1 ? "" : "s"} rejected.`;
      return;
    }

    if (acceptedCount > 0) {
      this._liveMessage = `${acceptedCount} file${acceptedCount === 1 ? "" : "s"} selected.`;
      return;
    }

    this._liveMessage = "";
  }

  private _getRemainingSlots() {
    if (!this.multiple) {
      return 1;
    }

    if (this.maxFiles == null) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.max(this.maxFiles - this._acceptedFiles.length, 0);
  }

  private _matchesAccept(file: File) {
    if (!this.accept.trim()) {
      return true;
    }

    const candidates = this.accept
      .split(",")
      .map((candidate) => candidate.trim().toLowerCase())
      .filter(Boolean);

    if (candidates.length === 0) {
      return true;
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    return candidates.some((candidate) => {
      if (candidate.startsWith(".")) {
        return fileName.endsWith(candidate);
      }

      if (candidate.endsWith("/*")) {
        return fileType.startsWith(candidate.slice(0, -1));
      }

      return fileType === candidate;
    });
  }

  private _handleSelection(files: File[]) {
    this._formController.markInteracted();

    const accepted: File[] = [];
    const rejectedFiles: FileInputRejectedFile[] = [];
    const remainingSlots = this._getRemainingSlots();
    const baseAccepted = this.multiple ? [...this._acceptedFiles] : [...this._acceptedFiles];

    for (const file of files) {
      if (
        (!this.multiple && accepted.length >= 1) ||
        (this.multiple && accepted.length >= remainingSlots)
      ) {
        rejectedFiles.push({ file, reason: "count" });
        continue;
      }

      if (!this._matchesAccept(file)) {
        rejectedFiles.push({ file, reason: "type" });
        continue;
      }

      if (this.maxFileSize != null && file.size > this.maxFileSize) {
        rejectedFiles.push({ file, reason: "size" });
        continue;
      }

      accepted.push(file);
    }

    if (this.multiple) {
      this._acceptedFiles = [...baseAccepted, ...accepted];
    } else if (accepted.length > 0) {
      this._acceptedFiles = [accepted[0]];
    }

    this._selectionError = rejectedFiles.length > 0 && this._acceptedFiles.length === 0;
    this._formController.sync();

    if (this._selectionError) {
      this._formController.markUserInvalid();
    }

    this._announceSelection(accepted.length, rejectedFiles);
    this._dispatchChange(rejectedFiles);
    this.requestUpdate();
  }

  private _onInputChange = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (files.length > 0) {
      this._handleSelection(files);
    }

    input.value = "";
  };

  private _isFileDrag(event: DragEvent) {
    const items = Array.from(event.dataTransfer?.items ?? []);
    return items.some((item) => item.kind === "file");
  }

  private _onDragEnter = (event: DragEvent) => {
    if (this.disabled || this._isFull || !this._isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    this._dragDepth += 1;
    this._setDragActive(true);
    this._liveMessage = "Entered drop zone.";
  };

  private _onDragOver = (event: DragEvent) => {
    if (this.disabled || this._isFull || !this._isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  private _onDragLeave = (event: DragEvent) => {
    if (!this._dragActive || !this._isFileDrag(event)) {
      return;
    }

    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && this.renderRoot.contains(relatedTarget)) {
      return;
    }

    this._dragDepth = Math.max(this._dragDepth - 1, 0);
    if (this._dragDepth === 0) {
      this._setDragActive(false);
      this._liveMessage = "Left drop zone.";
    }
  };

  private _onDrop = (event: DragEvent) => {
    if (this.disabled || this._isFull || !this._isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files ?? []);
    this._dragDepth = 0;
    this._setDragActive(false);

    if (files.length > 0) {
      this._handleSelection(files);
    }
  };

  private _removeAcceptedFile(targetFile: File | undefined) {
    if (!targetFile) return;

    const nextFiles = this._acceptedFiles.filter((file) => file !== targetFile);
    if (nextFiles.length === this._acceptedFiles.length) {
      return;
    }

    this._acceptedFiles = nextFiles;
    this._selectionError = false;
    this._formController.sync();
    if (this.required && this._acceptedFiles.length === 0) {
      this._formController.markInteracted();
      this._formController.revealIfInvalid();
    }
    this._announceSelection(this._acceptedFiles.length, []);
    this._dispatchChange([]);
    this.requestUpdate();
  }

  private _onItemAction(item: FileInputItem) {
    const action =
      item.state === "uploading"
        ? "cancel"
        : item.state === "success"
          ? "remove"
          : item.state === "error"
            ? "retry"
            : "dismiss";

    if (action === "cancel" || action === "remove" || action === "dismiss") {
      this._removeAcceptedFile(item.file);
    }

    this._dispatchAction({
      action,
      itemId: item.id,
    });
  }

  private _renderIcon(name: string, className?: string) {
    const svg = iconRegistry.get(name);
    if (!svg) {
      return nothing;
    }

    return html`<span class=${className ?? nothing}>${unsafeSVG(svg)}</span>`;
  }

  private _renderStatusIcon(item: FileInputItem) {
    if (item.state === "uploading") {
      return this._renderIcon(
        "spinner-gap",
        "fd-file-input__status-icon fd-file-input__status-icon--uploading",
      );
    }

    if (item.state === "success") {
      return this._renderIcon("check", "fd-file-input__status-icon");
    }

    if (item.state === "error") {
      return this._renderIcon("warning-circle", "fd-file-input__status-icon");
    }

    return this._renderIcon("warning", "fd-file-input__status-icon");
  }

  private _renderActionIcon(item: FileInputItem) {
    if (item.state === "success") {
      return this._renderIcon("trash", "fd-file-input__status-icon");
    }

    if (item.state === "error") {
      return this._renderIcon("upload", "fd-file-input__status-icon");
    }

    return this._renderIcon("x", "fd-file-input__status-icon");
  }

  private _getItemMessage(item: FileInputItem) {
    if (item.message) {
      return item.message;
    }

    switch (item.state) {
      case "uploading":
        return "Uploading…";
      case "success":
        return "Upload successful";
      case "error":
        return "Upload failed";
      case "invalid":
        return "Invalid file";
    }
  }

  private _getActionLabel(item: FileInputItem) {
    if (item.state === "uploading") {
      return `Cancel ${item.fileName}`;
    }

    if (item.state === "success") {
      return `Remove ${item.fileName}`;
    }

    if (item.state === "error") {
      return `Retry ${item.fileName}`;
    }

    return `Dismiss ${item.fileName}`;
  }

  private _renderIndicator(item: FileInputItem) {
    const width =
      item.state === "uploading"
        ? `${Math.max(16, Math.min(item.progress ?? 20, 100))}%`
        : "100%";

    return html`
      <div class="fd-file-input__indicator" aria-hidden="true">
        <div class="fd-file-input__indicator-progress" style=${`inline-size: ${width};`}></div>
      </div>
    `;
  }

  private _renderItem(item: FileInputItem): TemplateResult {
    return html`
      <li part="item" data-state=${item.state}>
        <div class="fd-file-input__item-header">
          <div class="fd-file-input__item-copy">
            <p class="fd-file-input__file-name">${item.fileName}</p>
            <span part="item-status">
              ${this._renderStatusIcon(item)}
              <span>${this._getItemMessage(item)}</span>
            </span>
          </div>
          <button
            part="item-action"
            type="button"
            ?disabled=${this.disabled}
            aria-label=${this._getActionLabel(item)}
            @click=${() => this._onItemAction(item)}
          >
            ${this._renderActionIcon(item)}
          </button>
        </div>
        ${this._renderIndicator(item)}
      </li>
    `;
  }

  override render() {
    const describedBy = [
      this.hint ? this._hintId : null,
      this._showError ? this._errorId : null,
      this._liveMessage ? this._liveId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div
        part="container"
        @dragenter=${this._onDragEnter}
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this.label
          ? html`
              <p part="label" id=${this._labelId}>
                ${this.label}
                ${this.required && this._acceptedFiles.length === 0
                  ? html`<span class="fd-file-input__required" aria-hidden="true"> *</span>`
                  : nothing}
              </p>
            `
          : nothing}

        ${!this._isFull
          ? html`
              <div class="fd-file-input__controls">
                <div class="fd-file-input__browse" part="browse-button">
                  ${this._renderIcon("upload", "fd-file-input__browse-icon")}
                  <span class="fd-file-input__browse-label">${this.buttonText || DEFAULT_SELECT_LABEL}</span>
                  <input
                    part="native"
                    id=${`fd-file-input-native-${this._instanceId}`}
                    type="file"
                    name=${this.name || nothing}
                    accept=${this.accept || nothing}
                    ?multiple=${this.multiple}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    aria-labelledby=${this.label ? this._labelId : nothing}
                    aria-label=${!this.label
                      ? this.buttonText || DEFAULT_SELECT_LABEL
                      : nothing}
                    aria-describedby=${describedBy || nothing}
                    aria-invalid=${this._showError ? "true" : nothing}
                    aria-required=${this.required ? "true" : nothing}
                    @change=${this._onInputChange}
                  />
                </div>
                <span class="fd-file-input__drop-text" part="drop-text">${this.dropText || DEFAULT_DROP_TEXT}</span>
              </div>
            `
          : nothing}

        ${!this._isFull && this.hint
          ? html`<p part="hint" id=${this._hintId}>${this.hint}</p>`
          : nothing}

        ${this._showError
          ? html`<p part="error" id=${this._errorId}>${this.validationMessage}</p>`
          : nothing}

        ${!this._showError && this._isFull
          ? html`<p part="limit">${this.limitText || DEFAULT_LIMIT_MESSAGE}</p>`
          : nothing}

        ${this._summaryText
          ? html`<p part="summary">${this._summaryText}</p>`
          : nothing}

        ${this._renderedItems.length > 0
          ? html`<ul part="list">${this._renderedItems.map((item) => this._renderItem(item))}</ul>`
          : nothing}

        <div id=${this._liveId} class="fd-file-input__sr-only" part="live-region" aria-live="polite">
          ${this._liveMessage}
        </div>
      </div>
    `;
  }
}
