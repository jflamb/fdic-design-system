import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

export const HERO_TONES = ["cool", "warm", "neutral"] as const;
export type HeroTone = (typeof HERO_TONES)[number];

const HERO_TONE_SET = new Set<string>(HERO_TONES);

const ARROW_SQUARE_OUT_SVG = html`
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path
      d="M216,64V184a16,16,0,0,1-16,16H80a16,16,0,0,1-16-16V64A16,16,0,0,1,80,48H200A16,16,0,0,1,216,64Zm-16,0H80V184H200Zm-84.69,82.34,48-48V136a8,8,0,0,0,16,0V80a8,8,0,0,0-8-8H115.31a8,8,0,0,0,0,16h37.66l-48,48a8,8,0,0,0,11.32,11.32Z"
    />
  </svg>
`;

function normalizeHeroTone(value: string | undefined): HeroTone {
  return value && HERO_TONE_SET.has(value) ? (value as HeroTone) : "cool";
}

function hasRenderableNodes(nodes: Iterable<Node>) {
  return Array.from(nodes).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }

    return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
  });
}

/**
 * `fd-hero` — Prominent introductory section with decorative background media.
 */
export class FdHero extends LitElement {
  static properties = {
    tone: { reflect: true },
    imageSrc: { attribute: "image-src", reflect: true },
    actionLabel: { attribute: "action-label", reflect: true },
    actionHref: { attribute: "action-href", reflect: true },
    actionTarget: { attribute: "action-target", reflect: true },
    actionRel: { attribute: "action-rel", reflect: true },
    _hasHeading: { state: true },
    _hasLede: { state: true },
    _hasBody: { state: true },
    _headingId: { state: true },
  };

  static styles = css`
    :host {
      display: block;
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
      color: var(--fdic-text-inverted, #ffffff);
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      --_fd-hero-overlay-start: rgba(13, 97, 145, 0.1);
      --_fd-hero-overlay-end: rgba(7, 60, 91, 0.7);
      --_fd-hero-panel-bg: rgba(7, 60, 91, 0.7);
      --_fd-hero-stripe-bg: var(--fdic-brand-core-light, #38b6ff);
      display: block;
      box-sizing: border-box;
      padding-block: var(--fd-hero-padding-block, 64px);
      padding-inline: var(--fd-hero-padding-inline, 64px);
      background-color: var(--_fd-hero-panel-bg);
      background-image:
        linear-gradient(
          180deg,
          var(--_fd-hero-overlay-start) 0%,
          var(--_fd-hero-overlay-end) 100%
        ),
        var(--_fd-hero-image, none);
      background-position:
        center,
        var(--fd-hero-image-position, center);
      background-repeat: no-repeat;
      background-size:
        cover,
        cover;
      color: inherit;
    }

    .tone-warm {
      --_fd-hero-overlay-start: rgba(136, 105, 28, 0.1);
      --_fd-hero-overlay-end: rgba(136, 105, 28, 0.7);
      --_fd-hero-panel-bg: rgba(96, 81, 27, 0.7);
      --_fd-hero-stripe-bg: var(--fdic-brand-highlight-default, #d9af45);
    }

    .tone-neutral {
      --_fd-hero-overlay-start: rgba(66, 66, 68, 0.1);
      --_fd-hero-overlay-end: rgba(66, 66, 68, 0.7);
      --_fd-hero-panel-bg: rgba(66, 66, 68, 0.7);
      --_fd-hero-stripe-bg: var(--fdic-text-inverted, #ffffff);
    }

    .content {
      display: flex;
      align-items: center;
      min-block-size: var(--fd-hero-min-height, 332px);
      max-inline-size: var(--fd-hero-max-width, 1440px);
      margin-inline: auto;
      width: 100%;
    }

    .panel {
      display: flex;
      flex-direction: column;
      inline-size: min(100%, var(--fd-hero-panel-max-width, 480px));
      min-inline-size: 0;
      background: var(--_fd-hero-panel-bg);
      backdrop-filter: blur(8px);
      box-shadow: 0 0 0 var(--fd-hero-panel-halo, 24px) var(--_fd-hero-panel-bg);
      color: inherit;
    }

    .heading-shell,
    .lede-shell,
    .body-shell {
      display: block;
    }

    .heading-shell.is-empty,
    .lede-shell.is-empty,
    .copy.is-empty,
    .body-shell.is-empty {
      display: none;
    }

    .copy {
      display: flex;
      flex-direction: column;
      gap: var(--fd-hero-copy-gap, 20px);
    }

    .lede-shell {
      margin-block-start: var(--fd-hero-heading-gap, 16px);
    }

    .stripe-shell {
      display: flex;
      align-items: center;
      padding-block: 12px;
    }

    .stripe-shell.is-hidden {
      display: none;
    }

    .stripe {
      display: block;
      inline-size: var(--fd-hero-stripe-width, 80px);
      block-size: var(--fd-hero-stripe-height, 4px);
      background: var(--_fd-hero-stripe-bg);
      flex: none;
    }

    .action {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      align-self: flex-start;
      margin-block-start: var(--fd-hero-action-gap, 24px);
      color: inherit;
      font-size: var(--fdic-font-size-body-big, 20px);
      font-weight: 450;
      line-height: 1.25;
      text-decoration: none;
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      outline: none;
      overflow-wrap: anywhere;
    }

    .action:hover {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.14em;
    }

    .action:focus-visible {
      box-shadow:
        0 0 0 2px var(--fd-hero-focus-gap, var(--_fd-hero-panel-bg)),
        0 0 0 4px
          var(
            --fd-hero-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.14em;
    }

    .action-icon {
      display: inline-flex;
      inline-size: 18px;
      block-size: 18px;
      align-items: center;
      justify-content: center;
      flex: none;
    }

    .action-icon svg {
      inline-size: 100%;
      block-size: 100%;
    }

    slot[name="heading"],
    slot[name="lede"],
    slot[name="body"] {
      display: block;
    }

    ::slotted([slot="heading"]) {
      display: block;
      margin: 0;
      color: var(--fdic-text-inverted, #ffffff);
      font-size: var(--fdic-font-size-h2, 27px);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.005em;
      overflow-wrap: anywhere;
    }

    ::slotted([slot="lede"]) {
      display: block;
      margin: 0;
      color: var(--fdic-text-inverted, #ffffff);
      font-size: var(--fdic-font-size-body-big, 20px);
      font-weight: 450;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    ::slotted([slot="body"]) {
      display: block;
      margin: 0;
      color: var(--fdic-text-inverted, #ffffff);
      font-size: var(--fdic-font-size-body, 18px);
      font-weight: 400;
      line-height: 1.375;
      overflow-wrap: anywhere;
    }

    @media (max-width: 640px) {
      .base {
        padding-inline: var(--fd-hero-padding-inline-mobile, 16px);
      }

      .content {
        min-block-size: 0;
      }

      .panel {
        inline-size: 100%;
        box-shadow: none;
      }

      .action {
        font-size: var(--fdic-font-size-body, 18px);
      }

      .action-icon {
        inline-size: 16px;
        block-size: 16px;
      }
    }

    @media print {
      :host {
        color: #000;
      }

      .base {
        padding: 0;
        background: none;
      }

      .panel {
        inline-size: 100%;
        background: none;
        box-shadow: none;
        backdrop-filter: none;
        color: inherit;
      }

      .action {
        color: inherit;
      }
    }

    @media (forced-colors: active) {
      .base {
        background: Canvas;
        color: CanvasText;
        forced-color-adjust: none;
      }

      .panel {
        background: Canvas;
        box-shadow: none;
        border: 1px solid CanvasText;
        backdrop-filter: none;
      }

      .stripe {
        background: CanvasText;
      }

      .action {
        color: LinkText;
      }

      .action:focus-visible {
        box-shadow: none;
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }
  `;

  declare tone: string;
  declare imageSrc: string | undefined;
  declare actionLabel: string | undefined;
  declare actionHref: string | undefined;
  declare actionTarget: string | undefined;
  declare actionRel: string | undefined;
  declare _hasHeading: boolean;
  declare _hasLede: boolean;
  declare _hasBody: boolean;
  declare _headingId: string;

  private static _instanceCounter = 0;
  private readonly _instanceId = FdHero._instanceCounter++;

  constructor() {
    super();
    this.tone = "cool";
    this.imageSrc = undefined;
    this.actionLabel = undefined;
    this.actionHref = undefined;
    this.actionTarget = undefined;
    this.actionRel = undefined;
    this._hasHeading = false;
    this._hasLede = false;
    this._hasBody = false;
    this._headingId = "";
  }

  override firstUpdated() {
    this._syncSlot("heading");
    this._syncSlot("lede");
    this._syncSlot("body");
  }

  private _syncSlot(name: "heading" | "lede" | "body") {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(
      `slot[name="${name}"]`,
    );

    if (!slot) {
      return;
    }

    const assignedNodes = slot.assignedNodes({ flatten: true });
    const hasContent = hasRenderableNodes(assignedNodes);

    if (name === "heading") {
      this._hasHeading = hasContent;
      const headingElement = assignedNodes.find(
        (node): node is HTMLElement =>
          node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement,
      );

      if (headingElement) {
        if (!headingElement.id) {
          headingElement.id = `fd-hero-heading-${this._instanceId}`;
        }

        this._headingId = headingElement.id;
      } else {
        this._headingId = "";
      }

      return;
    }

    if (name === "lede") {
      this._hasLede = hasContent;
      return;
    }

    this._hasBody = hasContent;
  }

  private _handleSlotChange(event: Event) {
    const slot = event.currentTarget as HTMLSlotElement | null;
    const name = slot?.name;

    if (
      name === "heading" ||
      name === "lede" ||
      name === "body"
    ) {
      this._syncSlot(name);
    }
  }

  private _getNormalizedRel() {
    if (this.actionTarget !== "_blank") {
      return this.actionRel;
    }

    const tokens = new Set(
      (this.actionRel ?? "")
        .split(/\s+/)
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean),
    );

    tokens.add("noopener");
    tokens.add("noreferrer");

    return [...tokens].join(" ");
  }

  private get _hasAction() {
    return Boolean(this.actionLabel?.trim() && this.actionHref?.trim());
  }

  render() {
    const tone = normalizeHeroTone(this.tone);
    const imageStyle =
      this.imageSrc && this.imageSrc.trim()
        ? styleMap({ "--_fd-hero-image": `url("${this.imageSrc}")` })
        : nothing;

    return html`
      <section
        part="base"
        class=${`base tone-${tone}`}
        style=${imageStyle}
        aria-labelledby=${ifDefined(this._headingId || undefined)}
      >
        <div part="content" class="content">
          <div part="panel" class="panel">
            <div
              part="heading"
              class=${`heading-shell${this._hasHeading ? "" : " is-empty"}`}
            >
              <slot name="heading" @slotchange=${this._handleSlotChange}></slot>
            </div>
            <div
              class=${`copy${
                this._hasLede || this._hasBody ? "" : " is-empty"
              }`}
            >
              <div
                part="lede"
                class=${`lede-shell${this._hasLede ? "" : " is-empty"}`}
              >
                <slot name="lede" @slotchange=${this._handleSlotChange}></slot>
              </div>
              ${this._hasLede && this._hasBody
                ? html`
                    <div class="stripe-shell" aria-hidden="true">
                      <span part="stripe" class="stripe"></span>
                    </div>
                  `
                : nothing}
              <div
                part="body"
                class=${`body-shell${this._hasBody ? "" : " is-empty"}`}
              >
                <slot name="body" @slotchange=${this._handleSlotChange}></slot>
              </div>
            </div>
            ${this._hasAction
              ? html`
                  <a
                    part="action"
                    class="action"
                    href=${this.actionHref!}
                    target=${ifDefined(this.actionTarget)}
                    rel=${ifDefined(this._getNormalizedRel())}
                  >
                    <span>${this.actionLabel}</span>
                    <span part="action-icon" class="action-icon">
                      ${ARROW_SQUARE_OUT_SVG}
                    </span>
                  </a>
                `
              : nothing}
          </div>
        </div>
      </section>
    `;
  }
}
