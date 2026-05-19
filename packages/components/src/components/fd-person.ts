import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { normalizeLinkRel } from "./link-utils.js";

export const PERSON_VARIANTS = [
  "byline",
  "contact",
  "contact-with-image",
  "contact-details",
  "name-title",
  "spotlight",
  "profile-card",
] as const;

export type PersonVariant = (typeof PERSON_VARIANTS)[number];

export const PERSON_IMAGE_POSITIONS = ["left", "top"] as const;
export type PersonImagePosition = (typeof PERSON_IMAGE_POSITIONS)[number];

const PERSON_VARIANT_SET = new Set<string>(PERSON_VARIANTS);

let personTitleIds = 0;

function normalizePersonVariant(value: string | undefined): PersonVariant {
  return value && PERSON_VARIANT_SET.has(value)
    ? (value as PersonVariant)
    : "contact";
}

/**
 * Decorative person silhouette shown in the image frame when no headshot is
 * supplied. Sits in an `aria-hidden` frame, so it carries no alt semantics.
 * Fill is left to CSS so each variant can tone it via `--fd-person-placeholder-color`.
 */
const PERSON_PLACEHOLDER_ICON = html`
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill-rule="evenodd"
      d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 0 0 .09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 0 0 .091.317z"
    />
  </svg>
`;

/**
 * `fd-person` — Governed Person display pattern with purpose-named variants.
 */
export class FdPerson extends LitElement {
  static properties = {
    variant: { reflect: true },
    name: { reflect: true },
    title: { reflect: true },
    organization: { reflect: true },
    email: { reflect: true },
    phone: { reflect: true },
    location: { reflect: true },
    profileUrl: { attribute: "profile-url", reflect: true },
    profileLabel: { attribute: "profile-label", reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    imageSrc: { attribute: "image-src", reflect: true },
    imageSrcset: { attribute: "image-srcset", reflect: true },
    imageAlt: { attribute: "image-alt", reflect: true },
    imagePosition: { attribute: "image-position", reflect: true },
    summary: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      min-inline-size: 0;
      color: var(--fdic-color-text-primary, #212123);
      font-family: var(
        --fdic-font-family-sans-serif,
        "Source Sans 3",
        sans-serif
      );
    }

    :host([hidden]) {
      display: none;
    }

    [part~="base"] {
      display: flex;
      min-inline-size: 0;
      box-sizing: border-box;
    }

    [part~="base"][data-density="compact"] {
      align-items: flex-start;
      gap: var(--fd-person-compact-gap, var(--fdic-spacing-sm, 12px));
    }

    [part~="base"][data-density="standard"] {
      align-items: flex-start;
      gap: var(--fd-person-standard-gap, var(--fdic-spacing-md, 16px));
    }

    [part~="base"][data-density="featured"] {
      flex-direction: column;
      gap: var(--fd-person-featured-gap, var(--fdic-spacing-md, 16px));
    }

    :host([image-position="top"]) [part~="base"][data-density="compact"],
    :host([image-position="top"]) [part~="base"][data-density="standard"] {
      flex-direction: column;
      align-items: flex-start;
    }

    [part="content"] {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--fd-person-section-gap, var(--fdic-spacing-sm, 12px));
      min-inline-size: 0;
    }

    [part="identity"] {
      display: flex;
      flex-direction: column;
      gap: var(--fd-person-identity-gap, var(--fdic-spacing-2xs, 4px));
      min-inline-size: 0;
    }

    [part~="name"] {
      margin: 0;
      color: var(
        --fd-person-name-color,
        var(--fdic-color-text-primary, #212123)
      );
      font-size: var(
        --fd-person-name-font-size,
        var(--fdic-font-size-body, 1.125rem)
      );
      font-weight: var(
        --fd-person-name-font-weight,
        var(--fdic-font-weight-semibold, 600)
      );
      line-height: var(
        --fd-person-name-line-height,
        var(--fdic-line-height-tight, 1.25)
      );
      overflow-wrap: anywhere;
    }

    [part~="base"][data-density="featured"] [part~="name"] {
      font-size: var(
        --fd-person-featured-name-font-size,
        var(--fdic-font-size-h3, 1.40625rem)
      );
      line-height: var(
        --fd-person-featured-name-line-height,
        var(--fdic-line-height-h3, 1.25)
      );
    }

    [part~="byline"] [part~="name"],
    [part~="name-title"] [part~="name"] {
      font-weight: var(
        --fd-person-compact-name-font-weight,
        var(--fdic-font-weight-semibold, 600)
      );
    }

    [part~="link"],
    [part~="email-link"],
    [part~="profile-link"] {
      color: var(--fd-person-link-color, var(--fdic-color-text-link, #1278b0));
      border-radius: 2px;
      outline-color: transparent;
      text-decoration-line: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: var(--fd-person-link-underline-thickness, 1px);
      text-underline-offset: 0.12em;
      text-decoration-skip-ink: auto;
    }

    [part~="link"]:hover,
    [part~="link"]:focus-visible,
    [part~="email-link"]:hover,
    [part~="email-link"]:focus-visible,
    [part~="profile-link"]:hover,
    [part~="profile-link"]:focus-visible {
      text-decoration-thickness: var(
        --fd-person-link-underline-thickness-emphasis,
        2px
      );
    }

    [part~="link"]:focus-visible,
    [part~="email-link"]:focus-visible,
    [part~="profile-link"]:focus-visible {
      box-shadow:
        0 0 0 var(--fdic-focus-gap-width, 2px)
          var(--fd-person-focus-gap, var(--fdic-focus-gap-color, #ffffff)),
        0 0 0 var(--fdic-focus-ring-width, 4px)
          var(--fd-person-focus-ring, var(--fdic-focus-ring-color, #38b6ff));
    }

    [part~="meta"] {
      margin: 0;
      color: var(
        --fd-person-meta-color,
        var(--fdic-color-text-secondary, #595961)
      );
      font-size: var(
        --fd-person-meta-font-size,
        var(--fdic-font-size-body-small, 1rem)
      );
      font-weight: var(--fdic-font-weight-regular, 400);
      line-height: var(
        --fd-person-meta-line-height,
        var(--fdic-line-height-body, 1.375)
      );
      overflow-wrap: anywhere;
    }

    [part="summary"] {
      margin: 0;
      color: var(
        --fd-person-summary-color,
        var(--fdic-color-text-primary, #212123)
      );
      font-size: var(
        --fd-person-summary-font-size,
        var(--fdic-font-size-body, 1.125rem)
      );
      font-weight: var(--fdic-font-weight-regular, 400);
      line-height: var(
        --fd-person-summary-line-height,
        var(--fdic-line-height-body, 1.375)
      );
      overflow-wrap: anywhere;
    }

    [part="contact-list"] {
      display: flex;
      flex-wrap: wrap;
      gap: 0 var(--fd-person-contact-gap, var(--fdic-spacing-xs, 8px));
      margin: 0;
      padding: 0;
      list-style: none;
    }

    [part="contact-item"] {
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }

    [part="image-frame"] {
      flex: none;
      inline-size: var(--fd-person-image-size, 64px);
      block-size: var(--fd-person-image-size, 64px);
      overflow: hidden;
      border-radius: var(--fd-person-image-radius, 50%);
      background: var(
        --fd-person-image-background,
        var(--fdic-color-bg-container, #f5f5f7)
      );
    }

    [part="image"] {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }

    [part="placeholder"] {
      display: grid;
      inline-size: 100%;
      block-size: 100%;
      place-items: center;
    }

    [part="placeholder"] svg {
      inline-size: 100%;
      block-size: 100%;
      fill: var(
        --fd-person-placeholder-color,
        var(--fdic-color-text-secondary, #595961)
      );
    }

    [part~="contact-with-image"] {
      --fd-person-image-size: var(--fd-person-small-image-size, 56px);
    }

    [part~="contact-details"] {
      --fd-person-image-size: var(--fd-person-standard-image-size, 112px);
    }

    [part~="spotlight"] {
      --fd-person-image-size: var(--fd-person-spotlight-image-size, 240px);
      --fd-person-image-radius: var(--fd-person-featured-image-radius, 0);
    }

    [part~="profile-card"] {
      --fd-person-image-size: var(--fd-person-profile-card-image-size, 192px);
      --fd-person-image-radius: var(
        --fd-person-profile-card-image-radius,
        var(--fdic-corner-radius-lg, 7px)
      );
      max-inline-size: var(--fd-person-profile-card-max-width, 280px);
    }

    [part~="profile-card"] [part="image-frame"] {
      inline-size: 100%;
      block-size: auto;
      aspect-ratio: var(--fd-person-profile-card-image-aspect-ratio, 1 / 1);
    }

    [part~="spotlight"] [part="image-frame"] {
      inline-size: var(--fd-person-spotlight-image-size, 240px);
      max-inline-size: 100%;
      block-size: auto;
      aspect-ratio: var(--fd-person-spotlight-image-aspect-ratio, 4 / 5);
    }

    [part~="profile-cta"] {
      align-self: flex-start;
    }

    @container (min-width: 40rem) {
      [part~="base"][part~="spotlight"] {
        flex-direction: row;
        align-items: center;
      }
    }

    @media (forced-colors: active) {
      [part~="name"],
      [part~="meta"],
      [part="summary"] {
        color: CanvasText;
      }

      [part~="link"],
      [part~="email-link"],
      [part~="profile-link"] {
        color: LinkText;
      }

      [part="image-frame"] {
        border: 1px solid CanvasText;
      }

      [part="placeholder"] svg {
        fill: CanvasText;
      }

      [part~="link"]:focus-visible,
      [part~="email-link"]:focus-visible,
      [part~="profile-link"]:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
    }
  `;

  declare variant: PersonVariant;
  declare name: string;
  declare title: string;
  declare organization: string;
  declare email: string | undefined;
  declare phone: string | undefined;
  declare location: string | undefined;
  declare profileUrl: string | undefined;
  declare profileLabel: string;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare imageSrc: string | undefined;
  declare imageSrcset: string | undefined;
  declare imageAlt: string;
  declare imagePosition: PersonImagePosition;
  declare summary: string;

  private readonly _nameId = `fd-person-name-${personTitleIds++}`;

  constructor() {
    super();
    this.variant = "contact";
    this.name = "";
    this.title = "";
    this.organization = "";
    this.email = undefined;
    this.phone = undefined;
    this.location = undefined;
    this.profileUrl = undefined;
    this.profileLabel = "Read more";
    this.target = undefined;
    this.rel = undefined;
    this.imageSrc = undefined;
    this.imageSrcset = undefined;
    this.imageAlt = "";
    this.imagePosition = "left";
    this.summary = "";
  }

  private getMailto() {
    const email = this.email?.trim();
    return email ? `mailto:${email}` : undefined;
  }

  private renderName(linkHref: string | undefined) {
    const name = this.name?.trim();

    if (!name) {
      return nothing;
    }

    if (!linkHref) {
      return html`<p id=${this._nameId} part="name">${name}</p>`;
    }

    const target = linkHref.startsWith("mailto:")
      ? undefined
      : this.target?.trim() || undefined;
    const rel = normalizeLinkRel(target, this.rel);

    return html`
      <p part="name">
        <a
          id=${this._nameId}
          part=${linkHref.startsWith("mailto:")
            ? "link email-link"
            : "link profile-link"}
          href=${linkHref}
          target=${ifDefined(target)}
          rel=${ifDefined(rel || undefined)}
        >
          ${name}
        </a>
      </p>
    `;
  }

  private renderMeta(...items: Array<string | undefined>) {
    const rendered = items.map((item) => item?.trim()).filter(Boolean);

    if (!rendered.length) {
      return nothing;
    }

    return html`${rendered.map((item) => html`<p part="meta">${item}</p>`)}`;
  }

  private renderEmail() {
    const email = this.email?.trim();

    if (!email) {
      return nothing;
    }

    return html`
      <ul part="contact-list">
        <li part="contact-item">
          <a part="email-link" href=${`mailto:${email}`}>${email}</a>
        </li>
      </ul>
    `;
  }

  private renderProfileLink() {
    const profileUrl = this.profileUrl?.trim();

    if (!profileUrl) {
      return nothing;
    }

    const label = this.profileLabel?.trim() || "Read more";
    const target = this.target?.trim() || undefined;
    const rel = normalizeLinkRel(target, this.rel);

    return html`
      <a
        part="profile-link profile-cta"
        href=${profileUrl}
        target=${ifDefined(target)}
        rel=${ifDefined(rel || undefined)}
      >
        ${label}
      </a>
    `;
  }

  private renderSummary() {
    const summary = this.summary?.trim();

    if (!summary) {
      return nothing;
    }

    return html`<p part="summary">${summary}</p>`;
  }

  private renderImage() {
    const imageSrc = this.imageSrc?.trim();

    if (!imageSrc) {
      return html`
        <div part="image-frame" aria-hidden="true">
          <span part="placeholder">${PERSON_PLACEHOLDER_ICON}</span>
        </div>
      `;
    }

    const name = this.name?.trim();
    const alt = name ? "" : (this.imageAlt?.trim() ?? "");

    return html`
      <div part="image-frame">
        <img
          part="image"
          src=${imageSrc}
          srcset=${ifDefined(this.imageSrcset?.trim() || undefined)}
          alt=${alt}
        />
      </div>
    `;
  }

  private getDensity(variant: PersonVariant) {
    if (variant === "contact-details") {
      return "standard";
    }

    if (variant === "spotlight" || variant === "profile-card") {
      return "featured";
    }

    return "compact";
  }

  private renderVariant(variant: PersonVariant) {
    const mailto = this.getMailto();
    const profileUrl = this.profileUrl?.trim() || undefined;

    switch (variant) {
      case "byline":
        return html`
          <div part="content">
            <div part="identity">
              ${this.renderName(mailto)} ${this.renderMeta(this.organization)}
            </div>
          </div>
        `;
      case "contact-with-image":
        return html`
          ${this.renderImage()}
          <div part="content">
            <div part="identity">
              ${this.renderName(mailto)}
              ${this.renderMeta(this.title, this.organization)}
            </div>
          </div>
        `;
      case "contact-details":
        return html`
          ${this.renderImage()}
          <div part="content">
            <div part="identity">
              ${this.renderName(undefined)} ${this.renderEmail()}
            </div>
            ${this.renderSummary()}
          </div>
        `;
      case "name-title":
        return html`
          <div part="content">
            <div part="identity">
              ${this.renderName(undefined)}
              ${this.renderMeta(this.title, this.organization)}
            </div>
          </div>
        `;
      case "spotlight":
        return html`
          ${this.renderImage()}
          <div part="content">
            <div part="identity">
              ${this.renderName(undefined)}
              ${this.renderMeta(this.title, this.organization)}
            </div>
            ${this.renderSummary()} ${this.renderProfileLink()}
          </div>
        `;
      case "profile-card":
        return html`
          ${this.renderImage()}
          <div part="content">
            <div part="identity">
              ${this.renderName(profileUrl)}
              ${this.renderMeta(this.title, this.organization)}
            </div>
          </div>
        `;
      case "contact":
      default:
        return html`
          <div part="content">
            <div part="identity">
              ${this.renderName(undefined)}
              ${this.renderMeta(this.title, this.organization)}
              ${this.renderEmail()}
            </div>
          </div>
        `;
    }
  }

  render() {
    const variant = normalizePersonVariant(this.variant);
    const density = this.getDensity(variant);
    const hasName = Boolean(this.name?.trim());

    return html`
      <article
        part="base ${variant}"
        data-density=${density}
        aria-labelledby=${ifDefined(hasName ? this._nameId : undefined)}
      >
        ${this.renderVariant(variant)}
      </article>
    `;
  }
}
