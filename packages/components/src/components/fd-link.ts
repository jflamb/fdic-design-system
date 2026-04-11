import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

export const LINK_VARIANTS = [
  "normal",
  "visited",
  "subtle",
  "inverted",
] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];

export const LINK_SIZES = ["sm", "md", "lg"] as const;
export type LinkSize = (typeof LINK_SIZES)[number];

const LINK_VARIANT_SET = new Set<string>(LINK_VARIANTS);
const LINK_SIZE_SET = new Set<string>(LINK_SIZES);

function normalizeLinkVariant(value: string | undefined): LinkVariant {
  return value && LINK_VARIANT_SET.has(value)
    ? (value as LinkVariant)
    : "normal";
}

function normalizeLinkSize(value: string | undefined): LinkSize {
  return value && LINK_SIZE_SET.has(value) ? (value as LinkSize) : "md";
}

/**
 * `fd-link` — Text-first hyperlink component for FDIC link treatments.
 */
export class FdLink extends LitElement {
  static override get observedAttributes() {
    return [
      ...super.observedAttributes,
      "aria-current",
      "aria-label",
      "aria-labelledby",
    ];
  }

  static properties = {
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    variant: { reflect: true },
    size: { reflect: true },
  };

  static styles = css`
    :host {
      display: inline;
      vertical-align: baseline;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      color: var(
        --fd-link-color-normal,
        var(--ds-color-bg-active)
      );
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 400;
      line-height: 1.375;
      color-scheme: light dark;
      text-decoration-color: currentColor;
      text-decoration-line: underline;
      text-decoration-thickness: var(--fd-link-underline-thickness, 1px);
      text-underline-offset: var(--fd-link-underline-offset, 0.12em);
      text-decoration-skip-ink: auto;
      border-radius: 2px;
      outline-color: transparent;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      overflow-wrap: anywhere;
    }

    .base:hover,
    .base:focus-visible {
      background: var(
        --fd-link-hover-overlay,
        var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))
      );
      text-decoration-thickness: var(
        --fd-link-underline-thickness-emphasis,
        2px
      );
    }

    .base:focus-visible {
      box-shadow: 0 0 0 var(--ds-focus-gap-width, 2px)
          var(--fd-link-focus-gap, var(--ds-focus-gap-color)),
        0 0 0 var(--ds-focus-ring-width, 4px)
          var(
            --fd-link-focus-ring,
            var(--ds-focus-ring-color)
          );
    }

    .variant-normal {
      color: var(
        --fd-link-color-normal,
        var(--ds-color-bg-active)
      );
    }

    .variant-visited {
      color: var(
        --fd-link-color-visited,
        var(--ds-color-text-link-visited)
      );
    }

    .variant-subtle {
      color: var(
        --fd-link-color-subtle,
        var(--ds-color-text-primary)
      );
      text-decoration-line: none;
    }

    .variant-subtle:hover,
    .variant-subtle:focus-visible {
      color: var(
        --fd-link-color-normal,
        var(--ds-color-bg-active)
      );
      text-decoration-line: underline;
    }

    .variant-inverted {
      color: var(
        --fd-link-color-inverted,
        var(--ds-color-neutral-000)
      );
    }

    .size-sm {
      font-size: var(--fdic-font-size-body-small, 1rem);
      font-weight: 400;
      line-height: 1.375;
    }

    .size-md {
      font-size: var(--fdic-font-size-body, 1.125rem);
      font-weight: 400;
      line-height: 1.375;
    }

    .size-lg {
      font-size: var(--fdic-font-size-body-big, 1.25rem);
      font-weight: 450;
      line-height: 1.25;
    }

    @media (forced-colors: active) {
      .base,
      .variant-normal,
      .variant-visited,
      .variant-subtle,
      .variant-inverted {
        color: LinkText;
        background: Canvas;
        text-decoration-line: underline;
        text-decoration-color: currentColor;
      }

      .base:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
    }
  `;

  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare variant: LinkVariant;
  declare size: LinkSize;

  constructor() {
    super();
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.variant = "normal";
    this.size = "md";
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (
      oldValue !== newValue &&
      (name === "aria-current" ||
        name === "aria-label" ||
        name === "aria-labelledby")
    ) {
      this.requestUpdate();
    }
  }

  override focus(options?: FocusOptions) {
    this.shadowRoot
      ?.querySelector<HTMLAnchorElement>("[part=base]")
      ?.focus(options);
  }

  private _getAccessibleAttributes() {
    return {
      ariaCurrent: ifDefined(this.getAttribute("aria-current") ?? undefined),
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
    const classes = {
      base: true,
      [`variant-${normalizeLinkVariant(this.variant)}`]: true,
      [`size-${normalizeLinkSize(this.size)}`]: true,
    };
    const { ariaCurrent, ariaLabel, ariaLabelledby } =
      this._getAccessibleAttributes();

    return html`
      <a
        part="base"
        class=${classMap(classes)}
        href=${ifDefined(this.href ?? undefined)}
        target=${ifDefined(this.target ?? undefined)}
        rel=${ifDefined(this._getNormalizedRel() ?? undefined)}
        aria-current=${ariaCurrent}
        aria-label=${ariaLabel}
        aria-labelledby=${ariaLabelledby}
      >
        <slot></slot>
      </a>
    `;
  }
}
