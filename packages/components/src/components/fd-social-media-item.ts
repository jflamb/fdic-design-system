import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { GLOBAL_FOOTER_SOCIAL_ICONS } from "./fd-global-footer.icons.js";
import { forcedColorsMediaFrame } from "./forced-colors.js";

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

type SocialMediaPlatformHrefProperty =
  | "facebookHref"
  | "youtubeHref"
  | "instagramHref"
  | "xHref"
  | "redditHref"
  | "linkedinHref"
  | "threadsHref";

const SOCIAL_MEDIA_PLATFORM_HREF_PROPERTIES = {
  facebook: "facebookHref",
  youtube: "youtubeHref",
  instagram: "instagramHref",
  x: "xHref",
  reddit: "redditHref",
  linkedin: "linkedinHref",
  threads: "threadsHref",
} as const satisfies Record<SocialMediaPlatform, SocialMediaPlatformHrefProperty>;

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
    datetime: { reflect: true },
    imageSrc: { attribute: "image-src", reflect: true },
    imageAlt: { attribute: "image-alt", reflect: true },
    facebookHref: { attribute: "facebook-href", reflect: true },
    youtubeHref: { attribute: "youtube-href", reflect: true },
    instagramHref: { attribute: "instagram-href", reflect: true },
    xHref: { attribute: "x-href", reflect: true },
    redditHref: { attribute: "reddit-href", reflect: true },
    linkedinHref: { attribute: "linkedin-href", reflect: true },
    threadsHref: { attribute: "threads-href", reflect: true },
    activeFocusPlatform: { state: true },
    activePointerPlatform: { state: true },
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
      display: block;
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
      overflow-wrap: anywhere;
    }

    [part="body"] ::slotted(p) {
      margin-block-start: 0;
      margin-block-end: var(
        --fd-social-media-item-paragraph-gap,
        var(--fdic-spacing-sm, 16px)
      );
    }

    [part="body"] ::slotted(p:last-child) {
      margin-block-end: 0;
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
      color: var(--fd-social-media-item-platform-color, currentColor);
    }

    fd-button[part="platform-link"] {
      --fd-button-height: var(--fd-social-media-item-platform-button-size, 32px);
      --fd-button-icon-only-size: var(--fd-social-media-item-platform-button-size, 32px);
      --fd-button-min-width: var(--fd-social-media-item-platform-button-size, 32px);
      --fd-button-radius: var(--fd-social-media-item-platform-button-radius, var(--fdic-corner-radius-sm, 3px));
      --fd-button-text-subtle: var(--fd-social-media-item-platform-color, currentColor);
      --fd-button-focus-gap: var(--fdic-color-bg-input, #ffffff);
      display: inline-flex;
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

    ${forcedColorsMediaFrame}

    @media (forced-colors: active) {
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
  declare datetime: string | undefined;
  declare imageSrc: string | undefined;
  declare imageAlt: string;
  declare facebookHref: string | undefined;
  declare youtubeHref: string | undefined;
  declare instagramHref: string | undefined;
  declare xHref: string | undefined;
  declare redditHref: string | undefined;
  declare linkedinHref: string | undefined;
  declare threadsHref: string | undefined;
  declare activeFocusPlatform: SocialMediaPlatform | undefined;
  declare activePointerPlatform: SocialMediaPlatform | undefined;
  declare platforms: SocialMediaPlatform[];

  constructor() {
    super();
    this.timestamp = "";
    this.datetime = undefined;
    this.imageSrc = undefined;
    this.imageAlt = "";
    this.facebookHref = undefined;
    this.youtubeHref = undefined;
    this.instagramHref = undefined;
    this.xHref = undefined;
    this.redditHref = undefined;
    this.linkedinHref = undefined;
    this.threadsHref = undefined;
    this.activeFocusPlatform = undefined;
    this.activePointerPlatform = undefined;
    this.platforms = [];
  }

  private getPlatformHref(platform: SocialMediaPlatform) {
    const property = SOCIAL_MEDIA_PLATFORM_HREF_PROPERTIES[platform];
    const value = this[property];
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  }

  private getPlatformLinks(platforms: SocialMediaPlatform[]) {
    const orderedPlatforms = platforms.length ? platforms : SOCIAL_MEDIA_PLATFORMS;

    return orderedPlatforms
      .map((platform) => ({
        platform,
        href: this.getPlatformHref(platform),
      }))
      .filter(
        (link): link is { platform: SocialMediaPlatform; href: string } =>
          Boolean(link.href),
      );
  }

  private getPlatformLabel() {
    const activePlatform = this.activePointerPlatform ?? this.activeFocusPlatform;

    return activePlatform
      ? `Posted on ${SOCIAL_MEDIA_PLATFORM_LABELS[activePlatform]}`
      : "Posted on";
  }

  private setFocusPlatform(platform: SocialMediaPlatform) {
    this.activeFocusPlatform = platform;
  }

  private clearFocusPlatform(platform: SocialMediaPlatform) {
    if (this.activeFocusPlatform === platform) {
      this.activeFocusPlatform = undefined;
    }
  }

  private setPointerPlatform(platform: SocialMediaPlatform) {
    this.activePointerPlatform = platform;
  }

  private clearPointerPlatform(platform: SocialMediaPlatform) {
    if (this.activePointerPlatform === platform) {
      this.activePointerPlatform = undefined;
    }
  }

  private renderPlatforms(platformLinks: { platform: SocialMediaPlatform; href: string }[]) {
    if (!platformLinks.length) {
      return nothing;
    }

    return html`
      <div part="platforms">
        <p part="platform-label">${this.getPlatformLabel()}</p>
        <ul part="platform-list" aria-label="Published platforms">
          ${platformLinks.map(
            ({ platform, href }) => html`
              <li part="platform-item">
                <fd-button
                  part="platform-link"
                  variant="subtle"
                  href=${href}
                  aria-label=${`View post on ${SOCIAL_MEDIA_PLATFORM_LABELS[platform]}`}
                  @focusin=${() => this.setFocusPlatform(platform)}
                  @focusout=${() => this.clearFocusPlatform(platform)}
                  @pointerenter=${() => this.setPointerPlatform(platform)}
                  @pointerleave=${() => this.clearPointerPlatform(platform)}
                >
                  <span slot="icon-start" part="platform-icon" aria-hidden="true">
                    ${unsafeSVG(PLATFORM_ICONS[platform])}
                  </span>
                </fd-button>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }

  private renderTimestamp(timestamp: string | undefined, datetime: string | undefined) {
    if (!timestamp) {
      return nothing;
    }

    return datetime
      ? html`<time part="timestamp" datetime=${datetime}>${timestamp}</time>`
      : html`<p part="timestamp">${timestamp}</p>`;
  }

  render() {
    const timestamp = this.timestamp?.trim();
    const datetime = this.datetime?.trim();
    const imageSrc = this.imageSrc?.trim();
    const imageAlt = this.imageAlt?.trim();
    const platforms = normalizePlatforms(this.platforms);
    const platformLinks = this.getPlatformLinks(platforms);

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
          ${this.renderTimestamp(timestamp, datetime)}
          <div part="body">
            <slot></slot>
          </div>
        </div>
        ${this.renderPlatforms(platformLinks)}
      </article>
    `;
  }
}
