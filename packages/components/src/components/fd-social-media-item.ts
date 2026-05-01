import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { GLOBAL_FOOTER_SOCIAL_ICONS } from "./fd-global-footer.icons.js";

export const SOCIAL_MEDIA_PLATFORMS = [
  "facebook",
  "youtube",
  "instagram",
  "x",
  "reddit",
  "linkedin",
  "threads",
] as const;
export type SocialMediaPlatform = (typeof SOCIAL_MEDIA_PLATFORMS)[number];

const SOCIAL_MEDIA_PLATFORM_SET = new Set<string>(SOCIAL_MEDIA_PLATFORMS);

const SOCIAL_MEDIA_PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  x: "X",
  reddit: "Reddit",
  linkedin: "LinkedIn",
  threads: "Threads",
};

const PLATFORM_ICONS: Record<SocialMediaPlatform, string> = {
  ...GLOBAL_FOOTER_SOCIAL_ICONS,
  reddit:
    '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75"/><circle cx="9" cy="11.5" r="1.15" fill="currentColor"/><circle cx="15" cy="11.5" r="1.15" fill="currentColor"/><path d="M8.5 15c1.9 1.35 5.1 1.35 7 0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M14.25 6.75 16 4.5l2.75.75" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  threads:
    '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M16.8 10.45c-.42-2.35-2-3.7-4.55-3.7-2.9 0-4.85 2.1-4.85 5.25 0 3.27 1.98 5.25 5.05 5.25 2.27 0 3.95-1.1 3.95-2.78 0-1.28-1.1-2.17-2.82-2.17h-1.35" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M12 22c5.25 0 8-3.7 8-10S17.25 2 12 2 4 5.7 4 12s2.75 10 8 10Z" fill="none" stroke="currentColor" stroke-width="1.75"/></svg>',
};

function normalizePlatform(value: string): SocialMediaPlatform | undefined {
  const normalized = value.trim().toLowerCase();
  return SOCIAL_MEDIA_PLATFORM_SET.has(normalized)
    ? (normalized as SocialMediaPlatform)
    : undefined;
}

function normalizePlatforms(value: SocialMediaPlatform[] | string | undefined) {
  const tokens = Array.isArray(value)
    ? value
    : (value ?? "").split(/[\s,]+/).filter(Boolean);
  const platforms: SocialMediaPlatform[] = [];

  for (const token of tokens) {
    const platform = normalizePlatform(token);
    if (platform && !platforms.includes(platform)) {
      platforms.push(platform);
    }
  }

  return platforms;
}

/**
 * `fd-social-media-item` — Static social post summary with platform attribution.
 */
export class FdSocialMediaItem extends LitElement {
  static properties = {
    timestamp: { reflect: true },
    imageSrc: { attribute: "image-src", reflect: true },
    imageAlt: { attribute: "image-alt", reflect: true },
    platforms: {
      reflect: true,
      converter: {
        fromAttribute: (value: string | null) => normalizePlatforms(value ?? ""),
        toAttribute: (value: SocialMediaPlatform[]) =>
          normalizePlatforms(value).join(" "),
      },
    },
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
      justify-content: center;
      gap: var(--fd-social-media-item-gap, var(--fdic-spacing-xs, 8px));
      min-inline-size: 0;
      overflow: clip;
      box-sizing: border-box;
    }

    [part="media"] {
      inline-size: 100%;
      block-size: var(--fd-social-media-item-media-height, auto);
      aspect-ratio: var(--fd-social-media-item-media-aspect-ratio, 368 / 341);
      overflow: hidden;
      border-radius: var(
        --fd-social-media-item-media-radius,
        var(--fdic-corner-radius-xl, 9px)
      );
      background: var(
        --fd-social-media-item-media-background,
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
      gap: var(--fd-social-media-item-content-gap, var(--fdic-spacing-xs, 8px));
      min-inline-size: 0;
    }

    [part="timestamp"],
    [part="platform-label"] {
      margin: 0;
      color: var(
        --fd-social-media-item-supporting-color,
        var(--fdic-color-text-secondary, #595961)
      );
      font-size: var(
        --fd-social-media-item-supporting-font-size,
        var(--fdic-font-size-body-small, 16px)
      );
      font-weight: 400;
      line-height: 1.375;
      overflow-wrap: anywhere;
    }

    [part="body"] {
      margin: 0;
      color: var(
        --fd-social-media-item-body-color,
        var(--fdic-color-text-primary, #212123)
      );
      font-size: var(
        --fd-social-media-item-body-font-size,
        var(--fdic-font-size-body, 18px)
      );
      font-weight: 400;
      line-height: 1.375;
      overflow-wrap: anywhere;
    }

    [part="body"] ::slotted(*) {
      margin-block: 0;
      overflow-wrap: anywhere;
    }

    [part="body"] ::slotted(a) {
      color: var(--fd-social-media-item-link-color, var(--fdic-color-text-link, #1278b0));
      text-decoration-line: underline;
      text-decoration-thickness: var(--fd-social-media-item-link-underline-thickness, 1px);
      text-underline-offset: 0.12em;
      text-decoration-skip-ink: auto;
    }

    [part="platforms"] {
      display: flex;
      flex-direction: column;
      gap: 0;
      min-inline-size: 0;
    }

    [part="platform-list"] {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--fd-social-media-item-platform-gap, var(--fdic-spacing-2xs, 4px));
      margin: 0;
      padding: 0;
      list-style: none;
    }

    [part="platform-item"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: var(--fd-social-media-item-platform-icon-size, 22px);
      min-block-size: var(--fd-social-media-item-platform-icon-size, 22px);
      color: var(--fd-social-media-item-platform-color, currentColor);
    }

    [part="platform-icon"] {
      display: inline-flex;
      inline-size: var(--fd-social-media-item-platform-icon-size, 22px);
      block-size: var(--fd-social-media-item-platform-icon-size, 22px);
      color: currentColor;
    }

    [part="platform-icon"] svg {
      inline-size: 100%;
      block-size: 100%;
    }

    .visually-hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      clip-path: inset(50%);
    }

    @media (forced-colors: active) {
      [part="media"] {
        border: 1px solid CanvasText;
        background: Canvas;
        forced-color-adjust: none;
      }

      [part="timestamp"],
      [part="platform-label"],
      [part="body"],
      [part="platform-item"] {
        color: CanvasText;
      }

      [part="body"] ::slotted(a) {
        color: LinkText;
      }
    }
  `;

  declare timestamp: string;
  declare imageSrc: string | undefined;
  declare imageAlt: string;
  declare platforms: SocialMediaPlatform[];

  constructor() {
    super();
    this.timestamp = "";
    this.imageSrc = undefined;
    this.imageAlt = "";
    this.platforms = [];
  }

  private renderPlatforms(platforms: SocialMediaPlatform[]) {
    if (!platforms.length) {
      return nothing;
    }

    return html`
      <div part="platforms">
        <p part="platform-label">Posted on</p>
        <ul part="platform-list" aria-label="Published platforms">
          ${platforms.map(
            (platform) => html`
              <li part="platform-item">
                <span part="platform-icon" aria-hidden="true">
                  ${unsafeSVG(PLATFORM_ICONS[platform])}
                </span>
                <span class="visually-hidden">${SOCIAL_MEDIA_PLATFORM_LABELS[platform]}</span>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }

  render() {
    const timestamp = this.timestamp?.trim();
    const imageSrc = this.imageSrc?.trim();
    const imageAlt = this.imageAlt?.trim();
    const platforms = normalizePlatforms(this.platforms);

    return html`
      <article part="base">
        ${imageSrc
          ? html`
              <div part="media">
                <img part="image" src=${imageSrc} alt=${imageAlt} />
              </div>
            `
          : nothing}
        <div part="content">
          ${timestamp ? html`<p part="timestamp">${timestamp}</p>` : nothing}
          <div part="body">
            <slot></slot>
          </div>
        </div>
        ${this.renderPlatforms(platforms)}
      </article>
    `;
  }
}
