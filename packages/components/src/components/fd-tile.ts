import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { normalizeLinkRel } from "./link-utils.js";

export const TILE_TONES = ["neutral", "cool", "warm"] as const;
export type TileTone = (typeof TILE_TONES)[number];
export const TILE_VISUAL_TYPES = ["neutral", "cool", "warm", "avatar"] as const;
export type TileVisualType = (typeof TILE_VISUAL_TYPES)[number];

export interface FdTileLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

const TILE_TONE_SET = new Set<string>(TILE_TONES);
const TILE_VISUAL_TYPE_SET = new Set<string>(TILE_VISUAL_TYPES);

let tileTitleIds = 0;

function normalizeTileTone(value: string | undefined): TileTone {
  return value && TILE_TONE_SET.has(value) ? (value as TileTone) : "neutral";
}

function normalizeTileVisualType(
  value: string | undefined,
  fallback: TileTone,
): TileVisualType {
  return value && TILE_VISUAL_TYPE_SET.has(value)
    ? (value as TileVisualType)
    : fallback;
}

/**
 * `fd-tile` — Static content tile with a decorative visual and native links.
 */
export class FdTile extends LitElement {
  static properties = {
    tone: { reflect: true },
    visualType: { attribute: "visual-type", reflect: true },
    iconName: { attribute: "icon-name", reflect: true },
    title: { reflect: true },
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    description: { reflect: true },
    links: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      color: var(--fdic-color-text-primary);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
    }

    :host([hidden]) {
      display: none;
    }

    [part="base"] {
      display: flex;
      align-items: flex-start;
      gap: var(--fd-tile-gap, var(--fdic-spacing-sm, 12px));
      min-inline-size: 0;
      box-sizing: border-box;
    }

    [part="base"].compact {
      align-items: center;
    }

    [part="visual"] {
      flex: none;
      inline-size: var(--fd-tile-visual-track-size, 46px);
      padding-block: var(--fd-tile-visual-track-padding-block, 3px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    [part="visual"] fd-visual {
      --fd-visual-size: var(--fd-tile-visual-size, 40px);
      --fd-visual-padding: var(--fd-tile-visual-padding, var(--fdic-spacing-xs, 8px));
      --fd-visual-content-size: var(--fd-tile-visual-content-size, 18px);
      flex: none;
    }

    [part="content"] {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: 0;
      min-inline-size: 0;
      padding-block: var(--fd-tile-content-padding-block, 0);
    }

    [part="text"] {
      display: flex;
      flex-direction: column;
      gap: var(--fd-tile-text-gap, 0);
      min-inline-size: 0;
    }

    [part="title"] {
      min-inline-size: 0;
    }

    .title-link,
    .title-text,
    .support-link {
      color: var(--fd-tile-link-color, var(--fdic-color-text-link));
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      outline-color: transparent;
      overflow-wrap: anywhere;
      text-decoration-line: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: var(--fd-tile-link-underline-thickness, 1px);
      text-underline-offset: 0.12em;
      text-decoration-skip-ink: auto;
    }

    .title-link,
    .title-text {
      display: inline;
      font-size: var(--fd-tile-title-font-size, var(--fdic-font-size-body, 18px));
      font-weight: var(--fd-tile-title-font-weight, 400);
      line-height: var(--fd-tile-title-line-height, 1.375);
    }

    .title-text {
      color: var(--fdic-color-text-primary);
      text-decoration-line: none;
    }

    .title-link:hover,
    .title-link:focus-visible,
    .support-link:hover,
    .support-link:focus-visible {
      background: var(
        --fd-tile-link-hover-overlay,
        var(--fdic-color-overlay-hover)
      );
      text-decoration-thickness: var(
        --fd-tile-link-underline-thickness-emphasis,
        2px
      );
    }

    .title-link:focus-visible,
    .support-link:focus-visible {
      box-shadow: 0 0 0 var(--fdic-focus-gap-width, 2px)
          var(--fd-tile-focus-gap, var(--fdic-focus-gap-color)),
        0 0 0 var(--fdic-focus-ring-width, 4px)
          var(
            --fd-tile-focus-ring,
            var(--fdic-focus-ring-color)
          );
    }

    [part="description"] {
      margin: 0;
      color: var(
        --fd-tile-description-color,
        var(--fdic-color-text-secondary)
      );
      font-size: var(
        --fd-tile-description-font-size,
        var(--fdic-font-size-body-small, 16px)
      );
      font-weight: 400;
      line-height: 1.375;
      overflow-wrap: anywhere;
    }

    [part="links"] {
      display: grid;
      gap: var(--fd-tile-links-gap, var(--fdic-spacing-2xs, 4px));
      margin: 0;
      margin-block-start: var(--fd-tile-links-margin-block-start, var(--fdic-spacing-xs, 8px));
      padding: 0;
      list-style: none;
    }

    [part="link-item"] {
      min-inline-size: 0;
    }

    .support-link {
      display: inline;
      font-size: var(
        --fd-tile-support-link-font-size,
        var(--fdic-font-size-body, 18px)
      );
      font-weight: 400;
      line-height: 1.375;
    }

    @container (min-width: 360px) {
      [part="visual"] {
        inline-size: 48px;
        padding-block: 0;
      }

      [part="visual"] fd-visual {
        --fd-visual-size: 48px;
        --fd-visual-content-size: 22px;
      }

      [part="text"] {
        gap: var(--fdic-spacing-3xs, 2px);
      }

      .title-link,
      .title-text {
        font-size: var(--fdic-font-size-body-big, 20px);
        font-weight: 450;
        line-height: 1.25;
      }
    }

    @container (min-width: 440px) {
      [part="base"] {
        gap: var(--fdic-spacing-md, 16px);
      }

      [part="visual"] {
        inline-size: 60px;
        padding-block: 0;
      }

      [part="visual"] fd-visual {
        --fd-visual-size: 60px;
        --fd-visual-padding: 10px;
        --fd-visual-content-size: 28px;
      }

      [part="content"] {
        padding-block: 2px;
      }

      [part="description"] {
        font-size: var(--fdic-font-size-body, 18px);
      }
    }

    @media (forced-colors: active) {
      .title-link,
      .support-link,
      .title-text {
        color: LinkText;
        background: Canvas;
      }

      .title-text {
        color: CanvasText;
      }

      .title-link:focus-visible,
      .support-link:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }

      [part="description"] {
        color: CanvasText;
      }
    }
  `;

  declare tone: TileTone;
  declare visualType: TileVisualType | undefined;
  declare iconName: string | undefined;
  declare title: string;
  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare description: string | undefined;
  declare links: FdTileLinkItem[];

  private readonly _titleId = `fd-tile-title-${tileTitleIds++}`;

  constructor() {
    super();
    this.tone = "neutral";
    this.visualType = undefined;
    this.iconName = undefined;
    this.title = "";
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.description = undefined;
    this.links = [];
  }

  private _getNormalizedLinks() {
    return (Array.isArray(this.links) ? this.links : [])
      .filter(
        (link): link is FdTileLinkItem =>
          Boolean(link?.label?.trim()) && Boolean(link?.href?.trim()),
      )
      .slice(0, 4);
  }

  private _renderTitle() {
    const title = this.title.trim();

    if (!title) {
      return nothing;
    }

    if (!this.href?.trim()) {
      return html`<span id=${this._titleId} class="title-text">${title}</span>`;
    }

    return html`
      <a
        id=${this._titleId}
        class="title-link"
        href=${this.href}
        target=${ifDefined(this.target ?? undefined)}
        rel=${ifDefined(normalizeLinkRel(this.target, this.rel) ?? undefined)}
      >
        ${title}
      </a>
    `;
  }

  private _renderDescription() {
    const description = this.description?.trim();

    if (!description) {
      return nothing;
    }

    return html`<p part="description">${description}</p>`;
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
                class="support-link"
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
    const title = this.title.trim();
    const description = this.description?.trim();
    const links = this._getNormalizedLinks();
    const compact = !description && links.length === 0;
    const tone = normalizeTileTone(this.tone);
    const visualType = normalizeTileVisualType(this.visualType, tone);

    return html`
      <article
        part="base"
        class=${compact ? "compact" : ""}
        aria-labelledby=${ifDefined(title ? this._titleId : undefined)}
      >
        <div part="visual">
          <fd-visual type=${visualType}>
            ${this.iconName?.trim()
              ? html`<fd-icon name=${this.iconName} aria-hidden="true"></fd-icon>`
              : nothing}
          </fd-visual>
        </div>
        <div part="content">
          <div part="text">
            <div part="title">${this._renderTitle()}</div>
            ${this._renderDescription()}
          </div>
          ${this._renderLinks()}
        </div>
      </article>
    `;
  }
}
