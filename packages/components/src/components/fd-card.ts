import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { normalizeLinkRel } from "./link-utils.js";

export const CARD_SIZES = ["medium", "large"] as const;
export type CardSize = (typeof CARD_SIZES)[number];

const CARD_SIZE_SET = new Set<string>(CARD_SIZES);

let cardTitleIds = 0;

function normalizeCardSize(value: string | undefined): CardSize {
  return value && CARD_SIZE_SET.has(value) ? (value as CardSize) : "medium";
}

/**
 * `fd-card` — Static editorial preview card with decorative media.
 */
export class FdCard extends LitElement {
  static properties = {
    size: { reflect: true },
    category: { reflect: true },
    title: { reflect: true },
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    metadata: { reflect: true },
    imageSrc: { attribute: "image-src", reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--fdic-text-primary, #212123);
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
    }

    :host([hidden]) {
      display: none;
    }

    article {
      display: flex;
      flex-direction: column;
      min-inline-size: 0;
      min-block-size: var(--fd-card-min-height-medium, 192px);
      overflow: clip;
      border: 1px solid transparent;
      border-radius: var(--fd-card-radius, 7px);
      box-sizing: border-box;
      background: var(--fd-card-background, #ffffff);
      box-shadow: var(
        --fd-card-shadow,
        0 1px 1px rgba(0, 0, 0, 0.08),
        0 2px 2px rgba(0, 0, 0, 0.08),
        0 4px 4px rgba(0, 0, 0, 0.08),
        0 6px 8px rgba(0, 0, 0, 0.08)
      );
    }

    article.size-large {
      min-block-size: var(--fd-card-min-height-large, 416px);
    }

    article:has(.title-link:hover),
    article:has(.title-link:focus-visible) {
      border-color: var(--fd-card-border-hover, #bdbdbf);
      box-shadow: var(
        --fd-card-shadow-hover,
        0 1px 1px rgba(0, 0, 0, 0.08),
        0 2px 2px rgba(0, 0, 0, 0.08),
        0 4px 4px rgba(0, 0, 0, 0.08),
        0 8px 8px rgba(0, 0, 0, 0.08),
        0 16px 16px rgba(0, 0, 0, 0.08)
      );
    }

    [part="body"] {
      display: flex;
      flex: 1 1 auto;
      min-inline-size: 0;
    }

    [part="body"].size-medium {
      gap: var(--fd-card-medium-gap, 24px);
      align-items: flex-start;
      padding: var(--fd-card-medium-padding, 16px);
    }

    [part="body"].size-large {
      flex-direction: column;
    }

    [part="content"] {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-inline-size: 0;
    }

    [part="content"].size-medium {
      gap: var(--fd-card-medium-content-gap, 16px);
      padding-block: 0;
    }

    [part="content"].size-large {
      gap: var(--fd-card-large-content-gap, 8px);
      padding: var(--fd-card-large-content-padding, 8px 16px 16px);
    }

    [part="media"] {
      flex: none;
      overflow: hidden;
      background: var(--fd-card-media-background, #f5f5f7);
    }

    [part="media"].size-medium {
      inline-size: var(--fd-card-medium-media-size, 160px);
      block-size: var(--fd-card-medium-media-size, 160px);
      border-radius: var(--fd-card-media-radius, 3px);
    }

    [part="media"].size-large {
      inline-size: 100%;
      aspect-ratio: var(--fd-card-large-media-aspect-ratio, 67 / 44);
    }

    [part="media"] img {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }

    [part="category"],
    [part="metadata"] {
      margin: 0;
      color: var(--fd-card-supporting-color, var(--ds-color-text-secondary, #595961));
      font-size: var(--fd-card-supporting-font-size, 16px);
      font-weight: 400;
      line-height: 1.375;
      overflow-wrap: anywhere;
    }

    [part="title"] {
      min-inline-size: 0;
    }

    .title-link,
    .title-text {
      display: -webkit-box;
      margin: 0;
      min-inline-size: 0;
      overflow: hidden;
      overflow-wrap: anywhere;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      color: var(--fd-card-title-color, var(--fdic-text-primary, #212123));
    }

    .title-link {
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      outline-color: transparent;
      text-decoration: none;
    }

    .title-link:hover,
    .title-link:focus-visible {
      color: var(--fd-card-title-link-color, var(--ds-color-text-link, #1278b0));
      text-decoration-line: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: var(--fd-card-link-underline-thickness, 1px);
      text-underline-offset: 0.14em;
      text-decoration-skip-ink: auto;
    }

    .title-link:focus-visible {
      box-shadow:
        0 0 0 2px var(--fd-card-focus-gap, var(--fd-card-background, #ffffff)),
        0 0 0 4px
          var(
            --fd-card-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
    }

    .title-medium {
      min-block-size: calc(var(--fd-card-medium-title-font-size, 20px) * 1.25 * 2);
      font-size: var(--fd-card-medium-title-font-size, 20px);
      font-weight: var(--fd-card-medium-title-font-weight, 450);
      line-height: var(--fd-card-medium-title-line-height, 1.25);
    }

    .title-large {
      min-block-size: calc(var(--fd-card-large-title-font-size, 18px) * 1.375 * 2);
      font-size: var(--fd-card-large-title-font-size, 18px);
      font-weight: var(--fd-card-large-title-font-weight, 600);
      line-height: var(--fd-card-large-title-line-height, 1.375);
    }

    [part="footer"] {
      display: flex;
      align-items: center;
      min-inline-size: 0;
      padding: var(--fd-card-footer-padding, 12px 16px);
      border-top: 1px solid
        var(--fd-card-divider-color, var(--ds-color-border-subtle, #e0e0e2));
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      [part="media"].size-medium {
        inline-size: var(--fd-card-medium-media-size-tablet, 120px);
        block-size: var(--fd-card-medium-media-size-tablet, 120px);
      }
    }

    @media (forced-colors: active) {
      article {
        border-color: CanvasText;
        background: Canvas;
        color: CanvasText;
        box-shadow: none;
        forced-color-adjust: none;
      }

      [part="media"] {
        background: Canvas;
        border: 1px solid CanvasText;
      }

      [part="media"] img {
        forced-color-adjust: none;
      }

      [part="category"],
      [part="metadata"],
      .title-link,
      .title-text {
        color: CanvasText;
      }

      .title-link:hover,
      .title-link:focus-visible {
        color: LinkText;
      }

      .title-link:focus-visible {
        box-shadow:
          0 0 0 2px Canvas,
          0 0 0 4px Highlight;
      }
    }
  `;

  declare size: string;
  declare category: string;
  declare title: string;
  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare metadata: string;
  declare imageSrc: string | undefined;
  private readonly _titleId: string;

  constructor() {
    super();
    this.size = "medium";
    this.category = "";
    this.title = "";
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.metadata = "";
    this.imageSrc = undefined;
    cardTitleIds += 1;
    this._titleId = `fd-card-title-${cardTitleIds}`;
  }

  private renderTitle(size: CardSize) {
    const title = this.title?.trim();
    const href = this.href?.trim();
    const titleClass = size === "large" ? "title-large" : "title-medium";

    if (!title) {
      return nothing;
    }

    if (!href) {
      return html`<p id=${this._titleId} class=${`title-text ${titleClass}`}>${title}</p>`;
    }

    return html`
      <a
        id=${this._titleId}
        class=${`title-link ${titleClass}`}
        href=${href}
        target=${ifDefined(this.target || undefined)}
        rel=${ifDefined(normalizeLinkRel(this.target, this.rel) || undefined)}
      >
        ${title}
      </a>
    `;
  }

  render() {
    const size = normalizeCardSize(this.size);
    const category = this.category?.trim();
    const metadata = this.metadata?.trim();
    const hasTitle = Boolean(this.title?.trim());
    const hasImage = Boolean(this.imageSrc?.trim());

    return html`
      <article
        part="base"
        class=${`size-${size}`}
        aria-labelledby=${ifDefined(hasTitle ? this._titleId : undefined)}
      >
        <div part="body" class=${`size-${size}`}>
          ${size === "large" && hasImage
            ? html`
                <div part="media" class="size-large">
                  <img src=${this.imageSrc!} alt="" />
                </div>
              `
            : nothing}
          <div part="content" class=${`size-${size}`}>
            ${category ? html`<p part="category">${category}</p>` : nothing}
            <div part="title">${this.renderTitle(size)}</div>
          </div>
          ${size === "medium" && hasImage
            ? html`
                <div part="media" class="size-medium">
                  <img src=${this.imageSrc!} alt="" />
                </div>
              `
            : nothing}
        </div>
        <div part="footer">
          ${metadata ? html`<p part="metadata">${metadata}</p>` : nothing}
        </div>
      </article>
    `;
  }
}
