import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import type { FdAlertDismissDetail } from "../public-events.js";
import { iconRegistry } from "../icons/registry.js";

export const ALERT_VARIANTS = ["default", "slim", "site"] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export const ALERT_TYPES = [
  "info",
  "success",
  "warning",
  "error",
  "emergency",
] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_LIVE_MODES = ["off", "polite", "assertive"] as const;
export type AlertLive = (typeof ALERT_LIVE_MODES)[number];

const ALERT_VARIANT_SET = new Set<string>(ALERT_VARIANTS);
const ALERT_TYPE_SET = new Set<string>(ALERT_TYPES);
const ALERT_LIVE_SET = new Set<string>(ALERT_LIVE_MODES);

const FALLBACK_ICON_SVG: Record<AlertType | "dismiss", string> = {
  info:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/></svg>',
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/></svg>',
  error:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,112V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/></svg>',
  emergency:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M120,136V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0ZM232,91.55v72.9a15.86,15.86,0,0,1-4.69,11.31l-51.55,51.55A15.86,15.86,0,0,1,164.45,232H91.55a15.86,15.86,0,0,1-11.31-4.69L28.69,175.76A15.86,15.86,0,0,1,24,164.45V91.55a15.86,15.86,0,0,1,4.69-11.31L80.24,28.69A15.86,15.86,0,0,1,91.55,24h72.9a15.86,15.86,0,0,1,11.31,4.69l51.55,51.55A15.86,15.86,0,0,1,232,91.55Zm-16,0L164.45,40H91.55L40,91.55v72.9L91.55,216h72.9L216,164.45ZM128,160a12,12,0,1,0,12,12A12,12,0,0,0,128,160Z"/></svg>',
  dismiss:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
};

const ALERT_ICON_NAMES: Record<AlertType, string> = {
  info: "info",
  success: "check",
  warning: "warning",
  error: "warning-circle",
  emergency: "warning-octagon",
};

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  info: "Information alert",
  success: "Success alert",
  warning: "Warning alert",
  error: "Error alert",
  emergency: "Emergency alert",
};

function normalizeAlertVariant(value: string | undefined): AlertVariant {
  return value && ALERT_VARIANT_SET.has(value)
    ? (value as AlertVariant)
    : "default";
}

function normalizeAlertType(value: string | undefined): AlertType {
  return value && ALERT_TYPE_SET.has(value) ? (value as AlertType) : "info";
}

function normalizeAlertLive(value: string | undefined): AlertLive {
  return value && ALERT_LIVE_SET.has(value) ? (value as AlertLive) : "off";
}

function hasRenderableNodes(nodes: Iterable<Node>) {
  return Array.from(nodes).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }

    return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
  });
}

/**
 * `fd-alert` — Page-level alert surface for concise, high-visibility messaging.
 */
export class FdAlert extends LitElement {
  static properties = {
    variant: { reflect: true },
    type: { reflect: true },
    title: { reflect: true },
    dismissible: { type: Boolean, reflect: true },
    dismissLabel: { attribute: "dismiss-label", reflect: true },
    live: { reflect: true },
    _hasBodyContent: { state: true },
  };

  static styles = css`
    :host {
      --_fd-alert-bg: var(--fd-alert-bg-info, var(--ds-color-semantic-bg-info, #f1f8fe));
      --_fd-alert-accent: var(--fd-alert-accent-info, var(--ds-color-semantic-border-info, #0776cb));
      --_fd-alert-text: var(--fd-alert-text-color, var(--ds-color-text-primary, #212123));
      --_fd-alert-link: var(--fd-alert-link-color, var(--ds-color-bg-active, #0d6191));
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
      color: var(--fdic-text-primary, #212123);
    }

    :host([hidden]) {
      display: none;
    }

    :host([type="info"]) {
      --_fd-alert-bg: var(--fd-alert-bg-info, var(--ds-color-semantic-bg-info, #f1f8fe));
      --_fd-alert-accent: var(--fd-alert-accent-info, var(--ds-color-semantic-border-info, #0776cb));
    }

    :host([type="success"]) {
      --_fd-alert-bg: var(--fd-alert-bg-success, var(--ds-color-semantic-bg-success, #e8f5e9));
      --_fd-alert-accent: var(--fd-alert-accent-success, var(--ds-color-semantic-border-success, #4caf50));
    }

    :host([type="warning"]) {
      --_fd-alert-bg: var(--fd-alert-bg-warning, var(--ds-color-semantic-bg-warning, #fcf7ee));
      --_fd-alert-accent: var(--fd-alert-accent-warning, var(--ds-color-semantic-border-warning, #f49f00));
    }

    :host([type="error"]) {
      --_fd-alert-bg: var(--fd-alert-bg-error, var(--ds-color-semantic-bg-error, #fdedea));
      --_fd-alert-accent: var(--fd-alert-accent-error, var(--ds-color-semantic-border-error, #b10b2d));
    }

    :host([type="emergency"]) {
      --_fd-alert-bg: var(--fd-alert-bg-emergency, var(--ds-color-bg-destructive, #d80e3a));
      --_fd-alert-accent: var(--fd-alert-accent-emergency, var(--ds-color-semantic-border-error, #b10b2d));
      --_fd-alert-text: var(--fd-alert-text-color-inverted, var(--ds-color-neutral-000, #ffffff));
      --_fd-alert-link: var(--fd-alert-link-color-inverted, var(--ds-color-neutral-000, #ffffff));
    }

    .base {
      display: block;
      position: relative;
      box-sizing: border-box;
      background: var(--_fd-alert-bg);
      color: var(--_fd-alert-text);
      border-radius: var(--fd-alert-radius, 0);
      overflow-wrap: anywhere;
    }

    .base.variant-default,
    .base.variant-slim {
      border-inline-start: var(--fd-alert-accent-width, 8px) solid
        var(--_fd-alert-accent);
      padding-block: var(--fd-alert-block-padding, 16px);
      padding-inline-start: var(--fd-alert-inline-padding-start, 24px);
      padding-inline-end: var(--fd-alert-inline-padding-end, 16px);
    }

    .base.variant-site {
      border-block-start: var(--fd-alert-site-accent-width, 8px) solid
        var(--_fd-alert-accent);
      padding-block-start: var(--fd-alert-site-block-padding-start, 24px);
      padding-block-end: var(--fd-alert-site-block-padding-end, 16px);
      padding-inline: var(--fd-alert-site-inline-padding, 20px);
    }

    .site-shell {
      max-inline-size: var(--fd-alert-site-max-width, 1440px);
      margin-inline: auto;
    }

    .content-shell {
      position: relative;
      min-inline-size: 0;
    }

    .content-shell[role] {
      display: block;
    }

    .stacked-shell {
      display: grid;
      gap: var(--fd-alert-stack-gap, 8px);
      padding-inline-end: var(--fd-alert-dismiss-space, 48px);
    }

    .variant-site .stacked-shell {
      gap: var(--fd-alert-site-stack-gap, 11.25px);
    }

    .slim-shell {
      display: flex;
      align-items: flex-start;
      gap: var(--fd-alert-inline-gap, 8px);
      min-inline-size: 0;
      padding-inline-end: var(--fd-alert-dismiss-space, 48px);
    }

    .heading-row,
    .body-row {
      display: flex;
      align-items: flex-start;
      gap: var(--fd-alert-inline-gap, 8px);
      min-inline-size: 0;
    }

    .heading-row {
      padding-inline-end: 0;
    }

    .variant-site .heading-row {
      align-items: flex-start;
    }

    .variant-site .body-row {
      padding-inline-start: var(--fd-alert-site-body-offset, 36px);
      max-inline-size: var(--fd-alert-site-body-max-width, 720px);
    }

    .variant-site .body-row.body-row-icon-leading {
      padding-inline-start: 0;
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      inline-size: var(--fd-alert-icon-size, 22px);
      block-size: var(--fd-alert-icon-size, 22px);
      color: var(--_fd-alert-accent);
    }

    .variant-site .icon {
      inline-size: var(--fd-alert-site-icon-size, 28px);
      block-size: var(--fd-alert-site-icon-size, 28px);
    }

    .type-emergency .icon {
      color: var(--fd-alert-text-color-inverted, var(--ds-color-neutral-000, #ffffff));
    }

    .icon svg {
      inline-size: 100%;
      block-size: 100%;
    }

    .title {
      font-size: var(--fdic-font-size-h4, 18px);
      font-weight: 600;
      line-height: 1.25;
      min-inline-size: 0;
      color: inherit;
    }

    .variant-site .title {
      font-size: var(--fdic-font-size-h3, 22.5px);
    }

    .slim-title {
      margin-inline-end: var(--fd-alert-slim-title-gap, 4px);
    }

    .body {
      min-inline-size: 0;
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 400;
      line-height: 1.375;
      color: inherit;
    }

    .body-slot {
      display: inline;
    }

    .body-slot::slotted(*) {
      color: var(--_fd-alert-text);
      font: inherit;
      line-height: inherit;
      max-inline-size: 100%;
    }

    .body-slot::slotted(p) {
      margin: 0;
    }

    .body-slot::slotted(a) {
      color: var(--_fd-alert-link);
      text-decoration: underline;
      text-underline-offset: 0.12em;
    }

    .body-slot::slotted(a:focus-visible) {
      outline: 2px solid var(--fd-alert-focus-ring, var(--ds-color-border-input-focus, #38b6ff));
      outline-offset: 2px;
      border-radius: 2px;
    }

    .type-emergency .body-slot::slotted(a) {
      color: var(--_fd-alert-link);
      font-weight: 600;
    }

    .dismiss-button {
      position: absolute;
      inset-block-start: var(--fd-alert-dismiss-top, 6px);
      inset-inline-end: var(--fd-alert-dismiss-inline-end, 6px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-alert-dismiss-button-size, 44px);
      block-size: var(--fd-alert-dismiss-button-size, 44px);
      padding: 0;
      margin: 0;
      border: none;
      border-radius: var(--fdic-corner-radius-sm, 3px);
      background: transparent;
      color: inherit;
      cursor: pointer;
      box-sizing: border-box;
    }

    .dismiss-button::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }

    .dismiss-button:hover::before {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-alert-dismiss-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    .dismiss-button:active::before {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-alert-dismiss-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    .dismiss-button:focus {
      outline-color: transparent;
    }

    .dismiss-button:focus-visible {
      outline-color: transparent;
      box-shadow: 0 0 0 2px var(--fd-alert-focus-gap, var(--ds-color-bg-surface, #ffffff)),
        0 0 0 4px var(--fd-alert-focus-ring, var(--ds-color-border-input-focus, #38b6ff));
    }

    .variant-slim .dismiss-button {
      inset-block-start: var(--fd-alert-slim-dismiss-top, 8px);
      inset-inline-end: var(--fd-alert-slim-dismiss-inline-end, 8px);
    }

    .variant-site .dismiss-button {
      inset-block-start: var(--fd-alert-site-dismiss-top, -8px);
      inset-inline-end: var(--fd-alert-site-dismiss-inline-end, 0);
    }

    .dismiss-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-alert-dismiss-icon-size, 18px);
      block-size: var(--fd-alert-dismiss-icon-size, 18px);
      pointer-events: none;
    }

    .dismiss-icon svg {
      inline-size: 100%;
      block-size: 100%;
    }

    .sr-only {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    @media (forced-colors: active) {
      .base {
        background: Canvas;
        color: CanvasText;
        border-color: ButtonText;
        forced-color-adjust: none;
      }

      :host([type="info"]) {
        --_fd-alert-accent: LinkText;
      }

      :host([type="success"]),
      :host([type="warning"]) {
        --_fd-alert-accent: ButtonText;
      }

      :host([type="error"]) {
        --_fd-alert-accent: Highlight;
      }

      :host([type="emergency"]) {
        --_fd-alert-accent: HighlightText;
        --_fd-alert-text: HighlightText;
        --_fd-alert-link: HighlightText;
      }

      .base.type-emergency {
        background: Highlight;
        color: HighlightText;
      }

      .body-slot::slotted(a) {
        color: var(--_fd-alert-link);
      }

      .dismiss-button:hover::before,
      .dismiss-button:active::before {
        box-shadow: none;
      }

      .dismiss-button:focus-visible {
        box-shadow: none;
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }

    @media print {
      .dismiss-button {
        display: none;
      }
    }
  `;

  declare variant: AlertVariant;
  declare type: AlertType;
  declare dismissible: boolean;
  declare dismissLabel: string | undefined;
  declare live: AlertLive;
  declare _hasBodyContent: boolean;

  private static _instanceCounter = 0;

  private readonly _instanceId: number;
  private readonly _bodyObserver: MutationObserver;
  private readonly _managedLinks = new Map<
    HTMLAnchorElement,
    {
      color: string;
      textDecoration: string;
      textUnderlineOffset: string;
      fontWeight: string;
    }
  >();

  constructor() {
    super();
    this.variant = "default";
    this.type = "info";
    this.title = "";
    this.dismissible = false;
    this.dismissLabel = undefined;
    this.live = "off";
    this._hasBodyContent = false;
    this._instanceId = FdAlert._instanceCounter++;
    this._bodyObserver = new MutationObserver(() => {
      this._syncBodyContent();
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this._syncBodyContent();
    this._bodyObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  override disconnectedCallback() {
    this._bodyObserver.disconnect();
    this._restoreManagedLinks();
    super.disconnectedCallback();
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    if (
      changedProperties.has("type") ||
      changedProperties.has("variant") ||
      changedProperties.has("_hasBodyContent")
    ) {
      this._syncManagedLinkStyles();
    }
  }

  override focus(options?: FocusOptions) {
    this.shadowRoot
      ?.querySelector<HTMLButtonElement>("[part=dismiss-button]")
      ?.focus(options);
  }

  private get _normalizedVariant() {
    return normalizeAlertVariant(this.variant);
  }

  private get _normalizedType() {
    return normalizeAlertType(this.type);
  }

  private get _normalizedLive() {
    return normalizeAlertLive(this.live);
  }

  private get _titleText() {
    const value = (this.title ?? "").trim();
    return value ? value : null;
  }

  private get _titleId() {
    return `fd-alert-title-${this._instanceId}`;
  }

  private get _severityId() {
    return `fd-alert-severity-${this._instanceId}`;
  }

  private get _dismissButtonLabel() {
    const override = this.dismissLabel?.trim();

    if (override) {
      return override;
    }

    const title = this._titleText;
    return title ? `Dismiss ${title}` : "Dismiss alert";
  }

  private _syncBodyContent() {
    this._hasBodyContent = hasRenderableNodes(this.childNodes);
  }

  private _restoreManagedLinks(retain = new Set<HTMLAnchorElement>()) {
    for (const [link, previous] of this._managedLinks) {
      if (retain.has(link)) {
        continue;
      }

      link.style.color = previous.color;
      link.style.textDecoration = previous.textDecoration;
      link.style.textUnderlineOffset = previous.textUnderlineOffset;
      link.style.fontWeight = previous.fontWeight;
      this._managedLinks.delete(link);
    }
  }

  private _syncManagedLinkStyles() {
    const links = Array.from(this.querySelectorAll("a"));
    const retainedLinks = new Set(links);
    const styles = getComputedStyle(this);
    const isEmergency = this._normalizedType === "emergency";

    // Read the resolved private token which includes the full CSS fallback
    // chain and responds to dark mode, rather than the public API override
    // (--fd-alert-link-color) which is typically unset.
    const linkColor = styles.getPropertyValue("--_fd-alert-link").trim();

    this._restoreManagedLinks(retainedLinks);

    for (const link of links) {
      if (!this._managedLinks.has(link)) {
        this._managedLinks.set(link, {
          color: link.style.color,
          textDecoration: link.style.textDecoration,
          textUnderlineOffset: link.style.textUnderlineOffset,
          fontWeight: link.style.fontWeight,
        });
      }

      link.style.color = linkColor || (isEmergency ? "#ffffff" : "#0d6191");
      link.style.textDecoration = "underline";
      link.style.textUnderlineOffset = "0.12em";
      link.style.fontWeight = isEmergency ? "600" : "";
    }
  }

  private _handleSlotChange = (event: Event) => {
    this._hasBodyContent = hasRenderableNodes(
      (event.currentTarget as HTMLSlotElement).assignedNodes({ flatten: true }),
    );
    this._syncManagedLinkStyles();
  };

  private _handleDismissClick() {
    this.dispatchEvent(
      new CustomEvent<FdAlertDismissDetail>("fd-alert-dismiss", {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  private _renderIcon(type: AlertType, iconSizeClass = "icon") {
    const registryName = ALERT_ICON_NAMES[type];
    const svg = iconRegistry.get(registryName) ?? FALLBACK_ICON_SVG[type];

    return html`<span
      part="icon"
      class=${iconSizeClass}
      aria-hidden="true"
    >
      ${unsafeSVG(svg)}
    </span>`;
  }

  private _renderDismissButton() {
    if (!this.dismissible) {
      return nothing;
    }

    const svg = iconRegistry.get("x") ?? FALLBACK_ICON_SVG.dismiss;

    return html`
      <button
        part="dismiss-button"
        class="dismiss-button"
        type="button"
        aria-label=${this._dismissButtonLabel}
        @click=${this._handleDismissClick}
      >
        <span part="dismiss-icon" class="dismiss-icon" aria-hidden="true">
          ${unsafeSVG(svg)}
        </span>
      </button>
    `;
  }

  private _renderBodySlot() {
    if (!this._hasBodyContent) {
      return nothing;
    }

    return html`<slot class="body-slot" @slotchange=${this._handleSlotChange}></slot>`;
  }

  private _renderStackedContent(type: AlertType) {
    const title = this._titleText;
    const hasBodyContent = this._hasBodyContent;

    if (!title && !hasBodyContent) {
      return nothing;
    }

    return html`
      <div class="stacked-shell">
        <span class="sr-only" id=${this._severityId}>
          ${ALERT_TYPE_LABELS[type]}
        </span>
        ${title
          ? html`
              <div class="heading-row">
                ${this._renderIcon(type)}
                <span part="title" class="title" id=${this._titleId}>
                  ${title}
                </span>
              </div>
            `
          : nothing}
        ${hasBodyContent
          ? html`
              <div class=${`body-row ${title ? "" : "body-row-icon-leading"}`}>
                ${title ? nothing : this._renderIcon(type)}
                <div part="body" class="body">
                  ${this._renderBodySlot()}
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderSlimContent(type: AlertType) {
    const title = this._titleText;
    const hasBodyContent = this._hasBodyContent;

    if (!title && !hasBodyContent) {
      return nothing;
    }

    return html`
      <div class="slim-shell">
        <span class="sr-only" id=${this._severityId}>
          ${ALERT_TYPE_LABELS[type]}
        </span>
        ${this._renderIcon(type)}
        <div part="body" class="body">
          ${title
            ? html`
                <span part="title" class="title slim-title" id=${this._titleId}>
                  ${title}
                </span>
              `
            : nothing}
          ${hasBodyContent ? this._renderBodySlot() : nothing}
        </div>
      </div>
    `;
  }

  private _renderLiveWrapper(content: unknown) {
    const live = this._normalizedLive;
    if (live === "off") {
      return content;
    }

    return html`
      <div
        class="content-shell"
        role=${live === "assertive" ? "alert" : "status"}
        aria-atomic="true"
      >
        ${content}
      </div>
    `;
  }

  render() {
    const variant = this._normalizedVariant;
    const type = this._normalizedType;
    const content =
      variant === "slim"
        ? this._renderSlimContent(type)
        : this._renderStackedContent(type);

    if (content === nothing) {
      return nothing;
    }

    const baseClasses = `base variant-${variant} type-${type}`;

    if (variant === "site") {
      const title = this._titleText;
      const labelledBy = title
        ? `${this._severityId} ${this._titleId}`
        : nothing;
      const ariaLabel = title ? nothing : "Site alert";

      return html`
        <section
          part="base"
          class=${baseClasses}
          aria-labelledby=${ifDefined(
            typeof labelledBy === "string" ? labelledBy : undefined,
          )}
          aria-label=${ifDefined(typeof ariaLabel === "string" ? ariaLabel : undefined)}
        >
          <div class="site-shell">
            ${this._renderLiveWrapper(content)} ${this._renderDismissButton()}
          </div>
        </section>
      `;
    }

    const live = this._normalizedLive;

    return html`
      <div
        part="base"
        class=${baseClasses}
        role=${ifDefined(
          live === "off" ? undefined : live === "assertive" ? "alert" : "status",
        )}
        aria-atomic=${ifDefined(live === "off" ? undefined : "true")}
      >
        <div class="content-shell">${content}</div>
        ${this._renderDismissButton()}
      </div>
    `;
  }
}
