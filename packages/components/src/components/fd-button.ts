import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

export type ButtonVariant =
  | "primary"
  | "neutral"
  | "subtle"
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
    }
    :host([disabled]) {
      pointer-events: none;
    }

    .base {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--fd-button-gap, var(--fdic-spacing-2xs, 4px));
      min-height: var(--fd-button-height, 44px);
      min-width: var(--fd-button-min-width, 44px);
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* --- Focus --- */
    .base:focus {
      outline: none;
    }
    .base:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px
          var(--fd-button-focus-gap, var(--ds-color-bg-input, #ffffff)),
        0 0 0 4px
          var(
            --fd-button-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
    }

    /* --- Variant: Primary --- */
    .primary {
      background-color: var(
        --fd-button-bg-primary,
        var(--ds-color-bg-active, #0d6191)
      );
      color: var(
        --fd-button-text-primary,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    /* --- Variant: Destructive --- */
    .destructive {
      background-color: var(
        --fd-button-bg-destructive,
        var(--ds-color-bg-destructive, #d80e3a)
      );
      color: var(
        --fd-button-text-destructive,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    /* --- Variant: Neutral --- */
    .neutral {
      background-color: var(
        --fd-button-bg-neutral,
        var(--ds-color-bg-interactive, #f5f5f7)
      );
      color: var(
        --fd-button-text-neutral,
        var(--ds-color-text-primary, #212123)
      );
      font-weight: 400;
    }

    /* --- Variant: Subtle --- */
    .subtle {
      background-color: transparent;
      color: var(
        --fd-button-text-subtle,
        var(--ds-color-text-primary, #212123)
      );
      font-weight: 400;
    }

    /* --- Variant: Outline --- */
    .outline {
      background-color: var(--ds-color-bg-input, #ffffff);
      color: var(
        --fd-button-text-outline,
        var(--ds-color-text-link, #1278b0)
      );
      font-weight: 400;
      border: 2px solid
        var(--fd-button-border-outline, var(--ds-color-bg-active, #0d6191));
    }

    /* --- Hover (all non-disabled) --- */
    .primary:hover,
    .destructive:hover,
    .neutral:hover,
    .subtle:hover,
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
  `;

  static properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    type: { reflect: true },
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
  };

  declare variant: ButtonVariant;
  declare disabled: boolean;
  declare type: "button" | "submit" | "reset";
  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;

  constructor() {
    super();
    this.variant = "primary";
    this.disabled = false;
    this.type = "button";
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
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

  render() {
    const isLink = this.href !== undefined;
    const isDisabled = this.disabled;
    const { ariaLabel, ariaLabelledby } = this._getAccessibleNameAttributes();

    const classes = {
      base: true,
      [this.variant]: !isDisabled,
      disabled: isDisabled,
      outline: this.variant === "outline",
    };

    const content = html`
      <slot name="icon-start"></slot>
      <span part="label" class="label"><slot></slot></span>
      <slot name="icon-end"></slot>
    `;

    if (isLink) {
      if (isDisabled) {
        return html`<a
          part="base"
          class=${classMap(classes)}
          aria-disabled="true"
          aria-label=${ariaLabel}
          aria-labelledby=${ariaLabelledby}
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
      aria-label=${ariaLabel}
      aria-labelledby=${ariaLabelledby}
      ?disabled=${isDisabled}
    >
      ${content}
    </button>`;
  }
}

if (!customElements.get("fd-button")) {
  customElements.define("fd-button", FdButton);
}
