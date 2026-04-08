import { LitElement, css, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { iconRegistry } from "../icons/registry.js";

export type ButtonVariant =
  | "primary"
  | "neutral"
  | "subtle"
  | "subtle-inverted"
  | "outline"
  | "destructive";

export class FdButton extends LitElement {
  static override get observedAttributes() {
    return [...super.observedAttributes, "aria-label", "aria-labelledby"];
  }

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    :host([disabled]),
    :host([loading]) {
      pointer-events: none;
    }

    .base {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--fd-button-gap, var(--fdic-spacing-2xs, 4px));
      min-height: var(--fd-button-height, 44px);
      min-width: var(--fd-button-min-width, 44px);
      min-inline-size: 0;
      padding-inline: 7px;
      border: none;
      border-radius: var(
        --fd-button-radius,
        var(--fdic-corner-radius-sm, 3px)
      );
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
      font-size: var(--fd-button-font-size, var(--fdic-font-size-body, 18px));
      line-height: 1.375;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
    }
    .icon-only {
      width: var(
        --fd-button-icon-only-size,
        var(--fd-button-height, 44px)
      );
      height: var(
        --fd-button-icon-only-size,
        var(--fd-button-height, 44px)
      );
      gap: 0;
      padding-inline: 0;
    }
    .has-leading-visual:not(.icon-only) {
      padding-inline-start: 13px;
    }
    .has-icon-end:not(.icon-only) {
      padding-inline-end: var(--fd-button-icon-edge-padding, 11px);
    }

    /* --- Focus --- */
    .base:focus {
      outline-color: transparent;
    }
    .base:focus-visible {
      outline-color: transparent;
      box-shadow: 0 0 0 2px
          var(--fd-button-focus-gap, var(--ds-color-bg-input, light-dark(#ffffff, #212123))),
        0 0 0 4px
          var(
            --fd-button-focus-ring,
            var(--ds-color-border-input-focus, light-dark(#38b6ff, #0d6191))
          );
    }

    /* --- Variant: Primary --- */
    .primary {
      background-color: var(
        --fd-button-bg-primary,
        var(--ds-color-bg-active, light-dark(#0d6191, #84dbff))
      );
      color: var(
        --fd-button-text-primary,
        var(--ds-color-text-inverted, light-dark(#ffffff, #000000))
      );
      font-weight: 600;
    }

    /* --- Variant: Destructive --- */
    .destructive {
      background-color: var(
        --fd-button-bg-destructive,
        var(--ds-color-bg-destructive, light-dark(#d80e3a, #442121))
      );
      color: var(
        --fd-button-text-destructive,
        var(--ds-color-neutral-000, light-dark(#ffffff, #000000))
      );
      font-weight: 600;
    }

    /* --- Variant: Neutral --- */
    .neutral {
      background-color: var(
        --fd-button-bg-neutral,
        var(--ds-color-bg-interactive, light-dark(#f5f5f7, #212123))
      );
      color: var(
        --fd-button-text-neutral,
        var(--ds-color-text-primary, light-dark(#212123, #ffffff))
      );
      font-weight: 400;
    }

    /* --- Variant: Subtle --- */
    .subtle {
      background-color: transparent;
      color: var(
        --fd-button-text-subtle,
        var(--ds-color-text-primary, light-dark(#212123, #ffffff))
      );
      font-weight: 400;
    }

    /* --- Variant: Subtle Inverted --- */
    .subtle-inverted {
      background-color: transparent;
      color: var(
        --fd-button-text-subtle-inverted,
        var(--ds-color-neutral-000, light-dark(#ffffff, #000000))
      );
      font-weight: 400;
      --fd-button-overlay-hover: var(
        --fd-button-overlay-hover-inverted,
        rgba(255, 255, 255, 0.12)
      );
      --fd-button-overlay-active: var(
        --fd-button-overlay-active-inverted,
        rgba(255, 255, 255, 0.18)
      );
    }

    /* --- Variant: Outline --- */
    .outline {
      background-color: var(--ds-color-bg-input, light-dark(#ffffff, #212123));
      color: var(
        --fd-button-text-outline,
        var(--ds-color-text-link, light-dark(#1278b0, #add8e6))
      );
      font-weight: 400;
      border: 2px solid
        var(--fd-button-border-outline, var(--ds-color-bg-active, light-dark(#0d6191, #84dbff)));
    }

    /* --- Hover (all non-disabled) --- */
    .primary:hover,
    .destructive:hover,
    .neutral:hover,
    .subtle:hover,
    .subtle-inverted:hover,
    .outline:hover {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-hover,
          var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
        );
    }

    /* --- Active (all non-disabled) --- */
    .primary:active,
    .destructive:active,
    .neutral:active,
    .subtle:active,
    .subtle-inverted:active,
    .outline:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Disabled --- */
    .disabled {
      background-color: var(
        --fd-button-bg-disabled,
        var(--ds-color-bg-container, #f5f5f7)
      );
      color: var(
        --fd-button-text-disabled,
        var(--ds-color-text-disabled, #9e9ea0)
      );
      cursor: default;
    }
    .disabled:hover,
    .disabled:active {
      box-shadow: none;
    }
    .disabled.outline {
      border-color: var(
        --fd-button-border-outline-disabled,
        var(--ds-color-border-input-disabled, #d6d6d8)
      );
    }

    /* --- Slots --- */
    ::slotted([slot="icon-start"]),
    ::slotted([slot="icon-end"]) {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }
    .label {
      display: inline-flex;
      align-items: center;
      padding-inline: 6px;
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }
    .icon-only .label,
    .icon-only .loading-label {
      padding-inline: 0;
    }

    /* --- Loading --- */
    @keyframes fd-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .spinner {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      width: var(--fd-button-spinner-size, 1em);
      height: var(--fd-button-spinner-size, 1em);
      animation: fd-spin var(--fd-button-spinner-speed, 0.8s) linear infinite;
    }
    .spinner svg {
      width: 100%;
      height: 100%;
    }
    .loading .label {
      /* keep label visible alongside spinner by default */
    }
    .loading-label {
      display: inline-flex;
      align-items: center;
      padding-inline: 6px;
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation: none;
      }
    }

    /* --- Forced colors --- */
    @media (forced-colors: active) {
      .base {
        border: 1px solid ButtonText;
      }
      .base:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
      .disabled {
        border-color: GrayText;
        color: GrayText;
      }
    }

    @media print {
      .base {
        box-shadow: none;
        border: 1px solid #000;
      }

      .spinner {
        animation: none;
      }
    }
  `;

  static properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    type: { reflect: true },
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    loading: { type: Boolean, reflect: true },
    loadingLabel: { attribute: "loading-label", reflect: true },
  };

  declare variant: ButtonVariant;
  declare disabled: boolean;
  declare type: "button" | "submit" | "reset";
  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare loading: boolean;
  declare loadingLabel: string | undefined;

  constructor() {
    super();
    this.variant = "primary";
    this.disabled = false;
    this.type = "button";
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.loading = false;
    this.loadingLabel = undefined;
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (
      oldValue !== newValue &&
      (name === "aria-label" || name === "aria-labelledby")
    ) {
      this.requestUpdate();
    }
  }

  private _handleDisabledClick(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  private _getAccessibleNameAttributes() {
    return {
      ariaLabel: ifDefined(this.getAttribute("aria-label") ?? undefined),
      ariaLabelledby: ifDefined(
        this.getAttribute("aria-labelledby") ?? undefined,
      ),
    };
  }

  private _getNormalizedRel() {
    if (this.target !== "_blank") {
      return this.rel;
    }

    const tokens = new Set(
      (this.rel ?? "")
        .split(/\s+/)
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean),
    );

    tokens.add("noopener");
    tokens.add("noreferrer");

    return [...tokens].join(" ");
  }

  private _renderSpinner() {
    const svg = iconRegistry.get("spinner-gap") ?? "";
    return html`<span
      part="spinner"
      class="spinner"
      aria-hidden="true"
      .innerHTML=${svg}
    ></span>`;
  }

  private _isIconOnly() {
    const hasVisibleLabel = this.textContent?.trim().length;
    const hasIcon = this.querySelector('[slot="icon-start"], [slot="icon-end"]');

    return !hasVisibleLabel && Boolean(hasIcon);
  }

  render() {
    const isLink = this.href !== undefined;
    const isLoading = this.loading;
    const isInert = this.disabled || isLoading;
    const isIconOnly = this._isIconOnly();
    const hasIconStart = Boolean(this.querySelector('[slot="icon-start"]'));
    const hasIconEnd = Boolean(this.querySelector('[slot="icon-end"]'));
    const hasLeadingVisual = hasIconStart || isLoading;
    const { ariaLabel, ariaLabelledby } = this._getAccessibleNameAttributes();

    // When loading-label is active, override the accessible name and
    // suppress aria-labelledby so it doesn't take precedence over aria-label
    const hasLoadingLabel = isLoading && this.loadingLabel;
    const effectiveAriaLabel = hasLoadingLabel ? this.loadingLabel : ariaLabel;
    const effectiveAriaLabelledby = hasLoadingLabel ? nothing : ariaLabelledby;

    const classes = {
      base: true,
      [this.variant]: !this.disabled,
      disabled: this.disabled,
      loading: isLoading && !this.disabled,
      "icon-only": isIconOnly,
      "has-leading-visual": hasLeadingVisual,
      "has-icon-start": hasIconStart,
      "has-icon-end": hasIconEnd,
      outline: this.variant === "outline",
    };

    const content = html`
      ${isLoading ? this._renderSpinner() : nothing}
      ${isLoading
        ? html`<slot name="icon-start" style="display:none"></slot>`
        : html`<slot name="icon-start"></slot>`}
      ${isLoading && this.loadingLabel
        ? html`<span part="label" class="loading-label"
              >${this.loadingLabel}</span
            ><span class="label" style="display:none"><slot></slot></span>`
        : html`<span part="label" class="label"><slot></slot></span>`}
      <slot name="icon-end"></slot>
    `;

    if (isLink) {
      if (isInert) {
        return html`<a
          part="base"
          class=${classMap(classes)}
          aria-disabled="true"
          aria-busy=${isLoading ? "true" : nothing}
          aria-label=${effectiveAriaLabel}
          aria-labelledby=${effectiveAriaLabelledby}
          tabindex="-1"
          @click=${this._handleDisabledClick}
          >${content}</a
        >`;
      }
      return html`<a
        part="base"
        class=${classMap(classes)}
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
        rel=${ifDefined(this._getNormalizedRel())}
        aria-label=${ariaLabel}
        aria-labelledby=${ariaLabelledby}
        >${content}</a
      >`;
    }

    return html`<button
      part="base"
      class=${classMap(classes)}
      type="button"
      aria-label=${effectiveAriaLabel}
      aria-labelledby=${effectiveAriaLabelledby}
      aria-busy=${isLoading ? "true" : nothing}
      ?disabled=${isInert}
    >
      ${content}
    </button>`;
  }
}
