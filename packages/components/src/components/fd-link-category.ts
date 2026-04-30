import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { normalizeLinkRel } from "./link-utils.js";

export const LINK_CATEGORY_SIZES = ["medium", "large"] as const;
export type LinkCategorySize = (typeof LINK_CATEGORY_SIZES)[number];

export const LINK_CATEGORY_TONES = ["neutral", "cool", "warm"] as const;
export type LinkCategoryTone = (typeof LINK_CATEGORY_TONES)[number];

export interface FdLinkCategoryLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

const LINK_CATEGORY_SIZE_SET = new Set<string>(LINK_CATEGORY_SIZES);
const LINK_CATEGORY_TONE_SET = new Set<string>(LINK_CATEGORY_TONES);

let linkCategoryTitleIds = 0;

function normalizeLinkCategorySize(value: string | undefined): LinkCategorySize {
  return value && LINK_CATEGORY_SIZE_SET.has(value)
    ? (value as LinkCategorySize)
    : "medium";
}

function normalizeLinkCategoryTone(value: string | undefined): LinkCategoryTone {
  return value && LINK_CATEGORY_TONE_SET.has(value)
    ? (value as LinkCategoryTone)
    : "neutral";
}

function booleanAttributeDefaultTrue(value: string | null) {
  return value === null || value.toLowerCase() !== "false";
}

function booleanAttributeDefaultTrueToAttribute(value: boolean) {
  return value ? "true" : "false";
}

/**
 * `fd-link-category` — Static category block for a short list of related links.
 */
export class FdLinkCategory extends LitElement {
  static properties = {
    size: { reflect: true },
    tone: { reflect: true },
    iconName: { attribute: "icon-name", reflect: true },
    category: { reflect: true },
    overview: { reflect: true },
    showVisual: {
      attribute: "show-visual",
      converter: {
        fromAttribute: booleanAttributeDefaultTrue,
        toAttribute: booleanAttributeDefaultTrueToAttribute,
      },
      reflect: true,
    },
    showStripe: {
      attribute: "show-stripe",
      converter: {
        fromAttribute: booleanAttributeDefaultTrue,
        toAttribute: booleanAttributeDefaultTrueToAttribute,
      },
      reflect: true,
    },
    links: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: var(--fd-link-category-max-width, 344px);
      color: var(--fdic-color-text-primary);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
    }

    :host([hidden]) {
      display: none;
    }

    [part="base"] {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
      gap: var(--_fd-link-category-gap);
      min-inline-size: 0;
    }

    [part="visual"] {
      display: inline-flex;
      flex: none;
      line-height: 0;
    }

    [part="visual"] fd-visual {
      --fd-visual-size: var(--_fd-link-category-visual-size);
      --fd-visual-padding: var(--_fd-link-category-visual-padding);
      --fd-visual-content-size: var(--_fd-link-category-visual-content-size);
    }

    [part="content"] {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      min-inline-size: 0;
      inline-size: 100%;
    }

    [part="text"] {
      display: flex;
      flex-direction: column;
      gap: 0;
      min-inline-size: 0;
      inline-size: 100%;
    }

    [part="category"] {
      margin: 0;
      color: var(--fd-link-category-category-color, var(--fdic-color-text-primary));
      font-size: var(--_fd-link-category-category-font-size);
      font-weight: var(--fd-link-category-category-font-weight, 600);
      line-height: var(--_fd-link-category-category-line-height);
      letter-spacing: var(--_fd-link-category-category-letter-spacing);
      overflow-wrap: anywhere;
    }

    [part="overview"] {
      margin: 0;
      color: var(
        --fd-link-category-overview-color,
        var(--fdic-color-text-secondary)
      );
      font-size: var(
        --fd-link-category-overview-font-size,
        var(--fdic-font-size-body, 18px)
      );
      font-weight: 400;
      line-height: var(--fd-link-category-overview-line-height, 1.375);
      overflow-wrap: anywhere;
    }

    [part="category"] + [part="overview"] {
      margin-block-start: var(--_fd-link-category-title-gap);
    }

    [part="stripe"] {
      display: block;
      inline-size: 100%;
      margin-block: var(--_fd-link-category-stripe-margin-block);
    }

    [part="stripe"] fd-stripe {
      --fd-stripe-width: var(--fd-link-category-stripe-width, 80px);
      --fd-stripe-height: var(--fd-link-category-stripe-height, 4px);
      --fd-stripe-bg-neutral: var(
        --fd-link-category-stripe-bg-neutral,
        var(--fdic-color-border-divider)
      );
      --fd-stripe-bg-cool: var(
        --fd-link-category-stripe-bg-cool,
        var(--fdic-color-primary-400)
      );
      --fd-stripe-bg-warm: var(
        --fd-link-category-stripe-bg-warm,
        var(--fdic-color-secondary-500)
      );
    }

    [part="links"] {
      display: grid;
      gap: var(--_fd-link-category-links-gap);
      margin: 0;
      padding: 0;
      list-style: none;
      min-inline-size: 0;
      inline-size: 100%;
    }

    [part="link-item"] {
      min-inline-size: 0;
    }

    [part="link"] {
      display: inline;
      color: var(--fd-link-category-link-color, var(--fdic-color-text-link));
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      font-size: var(--_fd-link-category-link-font-size);
      font-weight: var(--_fd-link-category-link-font-weight);
      line-height: var(--_fd-link-category-link-line-height);
      outline-color: transparent;
      overflow-wrap: anywhere;
      text-decoration-line: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: var(
        --fd-link-category-link-underline-thickness,
        1px
      );
      text-underline-offset: 0.12em;
      text-decoration-skip-ink: auto;
    }

    [part="link"]:hover,
    [part="link"]:focus-visible {
      text-decoration-thickness: var(
        --fd-link-category-link-underline-thickness-emphasis,
        2px
      );
    }

    [part="link"]:focus-visible {
      box-shadow: 0 0 0 var(--fdic-focus-gap-width, 2px)
          var(--fd-link-category-focus-gap, var(--fdic-focus-gap-color)),
        0 0 0 var(--fdic-focus-ring-width, 4px)
          var(
            --fd-link-category-focus-ring,
            var(--fdic-focus-ring-color)
          );
    }

    .size-medium {
      --_fd-link-category-gap: var(--fd-link-category-gap-medium, var(--fdic-spacing-xs, 8px));
      --_fd-link-category-visual-size: var(--fd-link-category-visual-size-medium, 60px);
      --_fd-link-category-visual-padding: var(--fd-link-category-visual-padding-medium, 10px);
      --_fd-link-category-visual-content-size: var(--fd-link-category-visual-content-size-medium, 28px);
      --_fd-link-category-category-font-size: var(
        --fd-link-category-category-font-size-medium,
        var(--fdic-font-size-h3, 22.5px)
      );
      --_fd-link-category-category-line-height: var(
        --fd-link-category-category-line-height-medium,
        1.25
      );
      --_fd-link-category-category-letter-spacing: var(
        --fd-link-category-category-letter-spacing-medium,
        0
      );
      --_fd-link-category-title-gap: var(--fd-link-category-title-gap-medium, 11px);
      --_fd-link-category-stripe-margin-block: var(
        --fd-link-category-stripe-margin-block-medium,
        var(--fdic-spacing-lg, 20px)
      );
      --_fd-link-category-links-gap: var(
        --fd-link-category-links-gap-medium,
        var(--fdic-spacing-xs, 8px)
      );
      --_fd-link-category-link-font-size: var(
        --fd-link-category-link-font-size-medium,
        var(--fdic-font-size-body, 18px)
      );
      --_fd-link-category-link-font-weight: var(
        --fd-link-category-link-font-weight-medium,
        400
      );
      --_fd-link-category-link-line-height: var(
        --fd-link-category-link-line-height-medium,
        1.375
      );
    }

    .size-large {
      --_fd-link-category-gap: var(--fd-link-category-gap-large, var(--fdic-spacing-sm, 12px));
      --_fd-link-category-visual-size: var(--fd-link-category-visual-size-large, 72px);
      --_fd-link-category-visual-padding: var(--fd-link-category-visual-padding-large, var(--fdic-spacing-sm, 12px));
      --_fd-link-category-visual-content-size: var(--fd-link-category-visual-content-size-large, 36px);
      --_fd-link-category-category-font-size: var(
        --fd-link-category-category-font-size-large,
        var(--fdic-font-size-h2, 27px)
      );
      --_fd-link-category-category-line-height: var(
        --fd-link-category-category-line-height-large,
        1.2
      );
      --_fd-link-category-category-letter-spacing: var(
        --fd-link-category-category-letter-spacing-large,
        -0.005em
      );
      --_fd-link-category-title-gap: var(--fd-link-category-title-gap-large, var(--fdic-spacing-md, 16px));
      --_fd-link-category-stripe-margin-block: var(
        --fd-link-category-stripe-margin-block-large,
        var(--fdic-spacing-xl, 24px)
      );
      --_fd-link-category-links-gap: var(
        --fd-link-category-links-gap-large,
        var(--fdic-spacing-sm, 12px)
      );
      --_fd-link-category-link-font-size: var(
        --fd-link-category-link-font-size-large,
        var(--fdic-font-size-body-big, 20px)
      );
      --_fd-link-category-link-font-weight: var(
        --fd-link-category-link-font-weight-large,
        450
      );
      --_fd-link-category-link-line-height: var(
        --fd-link-category-link-line-height-large,
        1.25
      );
    }

    @media (forced-colors: active) {
      [part="category"],
      [part="overview"] {
        color: CanvasText;
      }

      [part="link"] {
        color: LinkText;
        background: Canvas;
      }

      [part="link"]:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
    }
  `;

  declare size: LinkCategorySize;
  declare tone: LinkCategoryTone;
  declare iconName: string | undefined;
  declare category: string;
  declare overview: string | undefined;
  declare showVisual: boolean;
  declare showStripe: boolean;
  declare links: FdLinkCategoryLinkItem[];

  private readonly _categoryId = `fd-link-category-title-${linkCategoryTitleIds++}`;

  constructor() {
    super();
    this.size = "medium";
    this.tone = "neutral";
    this.iconName = undefined;
    this.category = "";
    this.overview = undefined;
    this.showVisual = true;
    this.showStripe = true;
    this.links = [];
  }

  private _getNormalizedLinks() {
    return (Array.isArray(this.links) ? this.links : [])
      .filter(
        (link): link is FdLinkCategoryLinkItem =>
          Boolean(link?.label?.trim()) && Boolean(link?.href?.trim()),
      )
      .slice(0, 6);
  }

  private _renderVisual(tone: LinkCategoryTone) {
    if (!this.showVisual) {
      return nothing;
    }

    return html`
      <div part="visual">
        <fd-visual type=${tone}>
          ${this.iconName?.trim()
            ? html`<fd-icon name=${this.iconName} aria-hidden="true"></fd-icon>`
            : nothing}
        </fd-visual>
      </div>
    `;
  }

  private _renderText() {
    const category = this.category.trim();
    const overview = this.overview?.trim();

    if (!category && !overview) {
      return nothing;
    }

    return html`
      <div part="text">
        ${category
          ? html`<div part="category" id=${this._categoryId}>${category}</div>`
          : nothing}
        ${overview ? html`<p part="overview">${overview}</p>` : nothing}
      </div>
    `;
  }

  private _renderStripe(tone: LinkCategoryTone) {
    if (!this.showStripe) {
      return nothing;
    }

    return html`
      <div part="stripe">
        <fd-stripe type=${tone}></fd-stripe>
      </div>
    `;
  }

  private _renderLinks() {
    const links = this._getNormalizedLinks();

    if (!links.length) {
      return nothing;
    }

    return html`
      <ul part="links">
        ${links.map(
          (link) => html`
            <li part="link-item">
              <a
                part="link"
                href=${link.href}
                target=${ifDefined(link.target ?? undefined)}
                rel=${ifDefined(
                  normalizeLinkRel(link.target, link.rel) ?? undefined,
                )}
              >
                ${link.label}
              </a>
            </li>
          `,
        )}
      </ul>
    `;
  }

  render() {
    const size = normalizeLinkCategorySize(this.size);
    const tone = normalizeLinkCategoryTone(this.tone);
    const category = this.category.trim();

    return html`
      <article
        part="base"
        class=${`size-${size} tone-${tone}`}
        aria-labelledby=${ifDefined(category ? this._categoryId : undefined)}
      >
        ${this._renderVisual(tone)}
        <div part="content">
          ${this._renderText()}
          ${this._renderStripe(tone)}
          ${this._renderLinks()}
        </div>
      </article>
    `;
  }
}
