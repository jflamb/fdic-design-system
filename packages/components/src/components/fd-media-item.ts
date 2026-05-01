import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { normalizeLinkRel } from "./link-utils.js";

let mediaItemTitleIds = 0;

/**
 * `fd-media-item` — Compact multimedia resource summary with a native title link.
 */
export class FdMediaItem extends LitElement {
  static properties = {
    title: { reflect: true },
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    metadata: { reflect: true },
    imageSrc: { attribute: "image-src", reflect: true },
    imageAlt: { attribute: "image-alt", reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      min-inline-size: 0;
      color: var(--fdic-color-text-primary, #212123);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
    }

    :host([hidden]) {
      display: none;
    }

    [part="base"] {
      display: flex;
      flex-direction: column;
      gap: var(--fd-media-item-gap, var(--fdic-spacing-sm, 12px));
      min-inline-size: 0;
      box-sizing: border-box;
    }

    [part="media"] {
      inline-size: 100%;
      block-size: var(--fd-media-item-media-height, auto);
      aspect-ratio: var(--fd-media-item-media-aspect-ratio, 366 / 201);
      overflow: hidden;
      border-radius: var(
        --fd-media-item-media-radius,
        var(--fdic-corner-radius-lg, 7px)
      );
      background: var(
        --fd-media-item-media-background,
        var(--fdic-color-bg-container, #f5f5f7)
      );
    }

    [part="image"] {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }

    [part="content"] {
      display: flex;
      flex-direction: column;
      gap: var(--fd-media-item-content-gap, var(--fdic-spacing-2xs, 4px));
      min-inline-size: 0;
    }

    [part~="title"] {
      display: -webkit-box;
      margin: 0;
      min-inline-size: 0;
      overflow: hidden;
      overflow-wrap: anywhere;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      color: var(--fd-media-item-title-color, var(--fdic-color-text-link, #1278b0));
      font-size: var(
        --fd-media-item-title-font-size,
        var(--fdic-font-size-body-big, 20px)
      );
      font-weight: var(--fd-media-item-title-font-weight, 450);
      line-height: var(--fd-media-item-title-line-height, 1.25);
    }

    [part~="title-link"] {
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      outline-color: transparent;
      text-decoration-line: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: var(--fd-media-item-link-underline-thickness, 1px);
      text-underline-offset: 0.12em;
      text-decoration-skip-ink: auto;
    }

    [part~="title-link"]:hover,
    [part~="title-link"]:focus-visible {
      text-decoration-thickness: var(
        --fd-media-item-link-underline-thickness-emphasis,
        2px
      );
    }

    [part~="title-link"]:focus-visible {
      box-shadow: 0 0 0 var(--fdic-focus-gap-width, 2px)
          var(--fd-media-item-focus-gap, var(--fdic-focus-gap-color)),
        0 0 0 var(--fdic-focus-ring-width, 4px)
          var(--fd-media-item-focus-ring, var(--fdic-focus-ring-color));
    }

    [part~="title-text"] {
      color: var(--fdic-color-text-primary, #212123);
      text-decoration-line: none;
    }

    [part="metadata"] {
      margin: 0;
      color: var(
        --fd-media-item-metadata-color,
        var(--fdic-color-text-secondary, #595961)
      );
      font-size: var(
        --fd-media-item-metadata-font-size,
        var(--fdic-font-size-body, 18px)
      );
      font-weight: 400;
      line-height: var(--fd-media-item-metadata-line-height, 1.375);
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    @media (forced-colors: active) {
      [part="media"] {
        border: 1px solid CanvasText;
        background: Canvas;
        forced-color-adjust: none;
      }

      [part~="title"],
      [part="metadata"] {
        color: CanvasText;
      }

      [part~="title-link"] {
        color: LinkText;
      }
    }
  `;

  declare title: string;
  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare metadata: string;
  declare imageSrc: string | undefined;
  declare imageAlt: string;

  private readonly _titleId = `fd-media-item-title-${mediaItemTitleIds++}`;

  constructor() {
    super();
    this.title = "";
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.metadata = "";
    this.imageSrc = undefined;
    this.imageAlt = "";
  }

  private renderTitle(title: string, href: string | undefined) {
    if (!title) {
      return nothing;
    }

    const target = this.target?.trim() || undefined;
    const rel = normalizeLinkRel(target, this.rel);

    if (href) {
      return html`
        <a
          id=${this._titleId}
          part="title title-link"
          class="title-link"
          href=${href}
          target=${ifDefined(target)}
          rel=${ifDefined(rel || undefined)}
        >
          ${title}
        </a>
      `;
    }

    return html`
      <p id=${this._titleId} part="title title-text" class="title-text">
        ${title}
      </p>
    `;
  }

  render() {
    const title = this.title?.trim();
    const href = this.href?.trim() || undefined;
    const metadata = this.metadata?.trim();
    const imageSrc = this.imageSrc?.trim();
    const imageAlt = this.imageAlt?.trim() ?? "";

    return html`
      <article
        part="base"
        aria-labelledby=${ifDefined(title ? this._titleId : undefined)}
      >
        ${imageSrc
          ? html`
              <div part="media">
                <img part="image" src=${imageSrc} alt=${imageAlt} />
              </div>
            `
          : nothing}
        <div part="content">
          ${this.renderTitle(title, href)}
          ${metadata ? html`<p part="metadata">${metadata}</p>` : nothing}
        </div>
      </article>
    `;
  }
}
