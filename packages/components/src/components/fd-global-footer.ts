import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { normalizeLinkRel } from "./link-utils.js";
import { GLOBAL_FOOTER_SOCIAL_ICONS } from "./fd-global-footer.icons.js";

export const GLOBAL_FOOTER_SOCIAL_ICON_NAMES = [
  "facebook",
  "x",
  "instagram",
  "youtube",
  "linkedin",
] as const;

export type GlobalFooterSocialIcon =
  (typeof GLOBAL_FOOTER_SOCIAL_ICON_NAMES)[number];

export interface FdGlobalFooterLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export interface FdGlobalFooterSocialLink extends FdGlobalFooterLink {
  icon: GlobalFooterSocialIcon;
}

const SOCIAL_ICON_SET = new Set<string>(GLOBAL_FOOTER_SOCIAL_ICON_NAMES);

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

function isLinkLike(value: FdGlobalFooterLink | null | undefined) {
  return Boolean(normalizeText(value?.label) && normalizeText(value?.href));
}

function normalizeLinks(links: FdGlobalFooterLink[] | null | undefined) {
  return Array.isArray(links) ? links.filter(isLinkLike) : [];
}

function normalizeSocialLinks(
  links: FdGlobalFooterSocialLink[] | null | undefined,
) {
  return Array.isArray(links)
    ? links.filter(
        (link) =>
          isLinkLike(link) && SOCIAL_ICON_SET.has(normalizeText(link.icon)),
      )
    : [];
}

/**
 * `fd-global-footer` — Static FDICnet footer shell with agency, utility,
 * social, and updated metadata plus an optional composed feedback slot.
 */
export class FdGlobalFooter extends LitElement {
  static properties = {
    agencyName: { attribute: "agency-name", reflect: true },
    agencyHref: { attribute: "agency-href", reflect: true },
    updatedText: { attribute: "updated-text", reflect: true },
    utilityLinks: { attribute: false },
    socialLinks: { attribute: false },
    _hasFeedback: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ds-color-text-primary);
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

    .feedback {
      margin-block-end: var(--fd-global-footer-feedback-gap, 0px);
    }

    footer {
      display: block;
      box-sizing: border-box;
      color: var(
        --fd-global-footer-text-color,
        var(--ds-color-text-inverted, #ffffff)
      );
      background: var(--fd-global-footer-background, #003256);
    }

    footer::before {
      content: "";
      display: block;
      block-size: var(--fd-global-footer-stripe-height, 12px);
      background: var(
        --fd-global-footer-stripe,
        linear-gradient(
          90deg,
          #d4a62a 0%,
          #f0cf74 30%,
          #c59316 60%,
          #e9c45d 100%
        )
      );
    }

    .base {
      box-sizing: border-box;
      padding-block: var(--fd-global-footer-padding-block, 48px);
      padding-inline: var(--fd-global-footer-padding-inline, 64px);
    }

    .content {
      display: flex;
      gap: var(--fd-global-footer-content-gap, 20px);
      align-items: flex-start;
      max-inline-size: var(--fd-global-footer-max-width, 1440px);
      margin-inline: auto;
      min-inline-size: 0;
    }

    .seal {
      flex: none;
      inline-size: var(--fd-global-footer-seal-size, 80px);
      block-size: var(--fd-global-footer-seal-size, 80px);
      border: 1.5px solid currentColor;
      border-radius: 999px;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }

    .seal::before {
      content: "";
      position: absolute;
      inset: 9px;
      border: 1px solid currentColor;
      border-radius: inherit;
      opacity: 0.72;
    }

    .seal-mark {
      display: grid;
      gap: 2px;
      justify-items: center;
      line-height: 1;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      position: relative;
      z-index: 1;
    }

    .seal-mark strong {
      font-size: 0.98rem;
      font-weight: 700;
    }

    .seal-mark span {
      font-size: 0.48rem;
      font-weight: 600;
      letter-spacing: 0.12em;
    }

    .body {
      display: grid;
      gap: var(--fd-global-footer-body-gap, 8px);
      flex: 1 1 auto;
      min-inline-size: 0;
    }

    .top-row,
    .bottom-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      min-inline-size: 0;
    }

    .brand-block {
      display: grid;
      gap: 8px;
      min-inline-size: 0;
    }

    .agency,
    .updated {
      margin: 0;
      font-size: var(--fd-global-footer-body-font-size, 18px);
      font-weight: 400;
      line-height: 1.375;
      color: inherit;
      overflow-wrap: anywhere;
    }

    .agency-link,
    .utility-link,
    .social-link {
      color: inherit;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.14em;
      text-decoration-skip-ink: auto;
      border-radius: 2px;
      outline-color: transparent;
    }

    .agency-link {
      text-decoration-line: none;
      font-size: var(--fd-global-footer-agency-font-size, 18px);
      font-weight: 600;
      line-height: 1.25;
    }

    .agency-link:hover,
    .agency-link:focus-visible,
    .utility-link:hover,
    .utility-link:focus-visible,
    .social-link:hover,
    .social-link:focus-visible {
      text-decoration-thickness: 2px;
    }

    .agency-link:focus-visible,
    .utility-link:focus-visible,
    .social-link:focus-visible {
      box-shadow:
        0 0 0 var(--ds-focus-gap-width, 2px)
          var(--fd-global-footer-background, #003256),
        0 0 0 var(--ds-focus-ring-width, 4px)
          var(
            --fd-global-footer-focus-ring,
            var(--ds-focus-ring-color, #38b6ff)
          );
    }

    .agency-text {
      font-size: var(--fd-global-footer-agency-font-size, 18px);
      font-weight: 600;
      line-height: 1.25;
    }

    .utility-list,
    .social-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0;
      margin: 0;
      min-inline-size: 0;
    }

    .utility-link,
    .updated {
      font-size: var(--fd-global-footer-body-font-size, 18px);
      line-height: 1.375;
    }

    .social-list {
      justify-content: flex-end;
      gap: 4px;
      flex: none;
    }

    .social-link {
      inline-size: var(--fd-global-footer-social-size, 36px);
      block-size: var(--fd-global-footer-social-size, 36px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration-line: none;
      position: relative;
    }

    .social-link::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 3px;
      box-shadow: inset 0 0 0 0 transparent;
    }

    .social-link:hover::before,
    .social-link:focus-visible::before {
      box-shadow: inset 0 0 0 1px currentColor;
      opacity: 0.92;
    }

    .social-icon {
      display: inline-flex;
      inline-size: 18px;
      block-size: 18px;
      color: inherit;
      line-height: 0;
    }

    .social-icon svg {
      inline-size: 100%;
      block-size: 100%;
    }

    @media (max-width: 640px) {
      .base {
        padding-block: var(--fd-global-footer-padding-block-mobile, 16px);
        padding-inline: var(--fd-global-footer-padding-inline-mobile, 16px);
      }

      .content {
        flex-direction: column;
        align-items: center;
        gap: var(--fd-global-footer-content-gap-mobile, 20px);
      }

      .body,
      .brand-block,
      .top-row,
      .bottom-row {
        inline-size: 100%;
      }

      .top-row {
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      .brand-block,
      .bottom-row {
        justify-items: center;
        text-align: center;
      }

      .agency,
      .agency-link,
      .agency-text,
      .updated,
      .utility-link {
        font-size: var(--fd-global-footer-body-font-size-mobile, 16px);
      }

      .agency-link,
      .agency-text {
        max-inline-size: 16rem;
      }

      .utility-list,
      .social-list {
        justify-content: center;
      }

      .social-link {
        inline-size: var(--fd-global-footer-social-size-mobile, 32px);
        block-size: var(--fd-global-footer-social-size-mobile, 32px);
      }

      .social-icon {
        inline-size: 16px;
        block-size: 16px;
      }

      .bottom-row {
        justify-content: center;
      }
    }

    @media (forced-colors: active) {
      footer {
        background: Canvas;
        color: CanvasText;
        border-block-start: 1px solid CanvasText;
      }

      footer::before {
        background: CanvasText;
      }

      .agency-link,
      .utility-link,
      .social-link {
        color: LinkText;
      }

      .social-link::before {
        box-shadow: inset 0 0 0 1px currentColor;
      }
    }
  `;

  declare agencyName: string;
  declare agencyHref: string;
  declare updatedText: string;
  declare utilityLinks: FdGlobalFooterLink[];
  declare socialLinks: FdGlobalFooterSocialLink[];
  private declare _hasFeedback: boolean;

  constructor() {
    super();
    this.agencyName = "";
    this.agencyHref = "";
    this.updatedText = "";
    this.utilityLinks = [];
    this.socialLinks = [];
    this._hasFeedback = false;
  }

  private _handleFeedbackSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this._hasFeedback = this._slotHasContent(slot);
  }

  private _slotHasContent(slot: HTMLSlotElement) {
    const assigned = slot.assignedNodes({ flatten: true });
    return assigned.some((node) =>
      node.nodeType === Node.ELEMENT_NODE
        ? true
        : Boolean(node.textContent?.trim()),
    );
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="feedback"]',
    ) as HTMLSlotElement | null;

    if (!slot) {
      return;
    }

    this._hasFeedback = this._slotHasContent(slot);
  }

  private _renderLink(link: FdGlobalFooterLink, className: string) {
    const rel = normalizeLinkRel(link.target, link.rel);
    return html`<a
      class=${className}
      href=${link.href}
      target=${ifDefined(link.target)}
      rel=${ifDefined(rel)}
      >${link.label}</a
    >`;
  }

  private _renderSocialLink(link: FdGlobalFooterSocialLink) {
    const rel = normalizeLinkRel(link.target, link.rel);
    return html`<li>
      <a
        class="social-link"
        href=${link.href}
        target=${ifDefined(link.target)}
        rel=${ifDefined(rel)}
        aria-label=${link.label}
      >
        <span class="social-icon" aria-hidden="true">
          ${unsafeSVG(GLOBAL_FOOTER_SOCIAL_ICONS[link.icon])}
        </span>
      </a>
    </li>`;
  }

  render() {
    const agencyName = normalizeText(this.agencyName);
    const utilityLinks = normalizeLinks(this.utilityLinks);
    const socialLinks = normalizeSocialLinks(this.socialLinks);
    const updatedText = normalizeText(this.updatedText);

    return html`
      <div
        class="feedback"
        part="feedback"
        ?hidden=${!this._hasFeedback}
      >
        <slot name="feedback" @slotchange=${this._handleFeedbackSlotChange}></slot>
      </div>

      <footer part="base">
        <div class="base">
          <div class="content" part="content">
            <div class="seal" part="seal" aria-hidden="true">
              <div class="seal-mark">
                <strong>FDIC</strong>
                <span>1933</span>
              </div>
            </div>

            <div class="body">
              <div class="top-row">
                <div class="brand-block" part="brand">
                  ${agencyName
                    ? html`<p class="agency" part="agency">
                        ${normalizeText(this.agencyHref)
                          ? this._renderLink(
                              {
                                label: agencyName,
                                href: this.agencyHref,
                              },
                              "agency-link",
                            )
                          : html`<span class="agency-text">${agencyName}</span>`}
                      </p>`
                    : nothing}

                  ${utilityLinks.length
                    ? html`<ul class="utility-list" part="utility-links">
                        ${utilityLinks.map(
                          (link) =>
                            html`<li>
                              ${this._renderLink(link, "utility-link")}
                            </li>`,
                        )}
                      </ul>`
                    : nothing}
                </div>

                ${socialLinks.length
                  ? html`<ul class="social-list" part="social-links">
                      ${socialLinks.map((link) => this._renderSocialLink(link))}
                    </ul>`
                  : nothing}
              </div>

              ${updatedText
                ? html`<div class="bottom-row">
                    <p class="updated" part="updated">${updatedText}</p>
                  </div>`
                : nothing}
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
