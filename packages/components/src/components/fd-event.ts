import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { normalizeLinkRel } from "./link-utils.js";

export const EVENT_TONES = ["neutral", "cool", "warm"] as const;
export type EventTone = (typeof EVENT_TONES)[number];

const EVENT_TONE_SET = new Set<string>(EVENT_TONES);

let eventTitleIds = 0;

function normalizeEventTone(value: string | undefined): EventTone {
  return value && EVENT_TONE_SET.has(value) ? (value as EventTone) : "neutral";
}

/**
 * `fd-event` — Dated event summary with an optional native title link.
 */
export class FdEvent extends LitElement {
  static properties = {
    tone: { reflect: true },
    month: { reflect: true },
    day: { reflect: true },
    title: { reflect: true },
    href: { reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
    metadata: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      color: var(--fdic-color-text-primary, #212123);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
    }

    :host([hidden]) {
      display: none;
    }

    article,
    .event-link {
      display: flex;
      align-items: flex-start;
      gap: var(--fd-event-gap, var(--fdic-spacing-sm, 12px));
      min-inline-size: 0;
      box-sizing: border-box;
    }

    .event-link {
      color: inherit;
      text-decoration: none;
      border-radius: 2px;
      outline-color: transparent;
    }

    [part="date"] {
      display: flex;
      flex: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-event-date-size, 48px);
      block-size: var(--fd-event-date-size, 48px);
      min-inline-size: var(--fd-event-date-size, 48px);
      min-block-size: var(--fd-event-date-size, 48px);
      padding: var(--fd-event-date-padding-block, var(--fdic-spacing-xs, 8px))
        var(--fd-event-date-padding-inline, var(--fdic-spacing-2xs, 4px));
      gap: var(--fd-event-date-gap, 3px);
      border-radius: var(--fd-event-date-radius, var(--fdic-corner-radius-sm, 3px));
      box-sizing: border-box;
      text-align: center;
      white-space: nowrap;
      background: var(
        --fd-event-date-bg-neutral,
        var(--fdic-color-overlay-hover)
      );
      color: var(--fd-event-date-color-neutral, var(--fdic-color-text-primary));
    }

    :host([tone="warm"]) [part="date"] {
      background: var(
        --fd-event-date-bg-warm,
        var(--fdic-color-secondary-300)
      );
      color: var(--fd-event-date-color-warm, var(--fdic-color-text-primary));
    }

    :host([tone="cool"]) [part="date"] {
      background: var(
        --fd-event-date-bg-cool,
        var(--fdic-color-primary-200)
      );
      color: var(--fd-event-date-color-cool, var(--fdic-color-text-primary));
    }

    .event-link:hover [part="date"],
    .event-link:focus-visible [part="date"],
    article:has(.title-link:hover) [part="date"],
    article:has(.title-link:focus-visible) [part="date"] {
      background: var(
        --fd-event-date-bg-neutral-emphasis,
        var(--fdic-color-icon-primary)
      );
      color: var(
        --fd-event-date-color-neutral-emphasis,
        var(--fdic-color-text-inverted)
      );
    }

    :host([tone="warm"]) .event-link:hover [part="date"],
    :host([tone="warm"]) .event-link:focus-visible [part="date"],
    :host([tone="warm"]) article:has(.title-link:hover) [part="date"],
    :host([tone="warm"]) article:has(.title-link:focus-visible) [part="date"] {
      background: var(
        --fd-event-date-bg-warm-emphasis,
        var(--fdic-color-secondary-800)
      );
      color: var(
        --fd-event-date-color-warm-emphasis,
        var(--fdic-color-text-inverted)
      );
    }

    :host([tone="cool"]) .event-link:hover [part="date"],
    :host([tone="cool"]) .event-link:focus-visible [part="date"],
    :host([tone="cool"]) article:has(.title-link:hover) [part="date"],
    :host([tone="cool"]) article:has(.title-link:focus-visible) [part="date"] {
      background: var(
        --fd-event-date-bg-cool-emphasis,
        var(--fdic-color-primary-500)
      );
      color: var(
        --fd-event-date-color-cool-emphasis,
        var(--fdic-color-text-inverted)
      );
    }

    [part="month"] {
      display: block;
      margin: 0;
      font-size: var(--fd-event-month-font-size, 12px);
      font-weight: var(--fd-event-month-font-weight, 600);
      line-height: var(--fd-event-month-line-height, 1);
      margin-block: var(--fd-event-month-leading-trim, -0.06em);
      letter-spacing: var(--fd-event-month-letter-spacing, 0.03em);
      text-transform: uppercase;
    }

    [part="day"] {
      display: block;
      margin: 0;
      font-size: var(--fd-event-day-font-size, 22px);
      font-weight: var(--fd-event-day-font-weight, 500);
      line-height: var(--fd-event-day-line-height, 1);
      margin-block: var(--fd-event-day-leading-trim, -0.15em);
    }

    [part="content"] {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--fd-event-content-gap, 1px);
      min-inline-size: 0;
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
      font-size: var(
        --fd-event-title-font-size,
        var(--fdic-font-size-body-big, 20px)
      );
      font-weight: var(--fd-event-title-font-weight, 450);
      line-height: var(--fd-event-title-line-height, 1.25);
    }

    .title-text {
      color: var(--fd-event-title-color, var(--fdic-color-text-primary));
    }

    .title-link {
      color: var(--fd-event-link-color, var(--fdic-color-text-link));
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      outline-color: transparent;
      text-decoration-line: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: var(--fd-event-link-underline-thickness, 1px);
      text-underline-offset: 0.12em;
      text-decoration-skip-ink: auto;
    }

    .title-link:hover,
    .title-link:focus-visible {
      text-decoration-thickness: var(
        --fd-event-link-underline-thickness-emphasis,
        2px
      );
    }

    .title-link:focus-visible {
      box-shadow: 0 0 0 var(--fdic-focus-gap-width, 2px)
          var(--fd-event-focus-gap, var(--fdic-focus-gap-color)),
        0 0 0 var(--fdic-focus-ring-width, 4px)
          var(
            --fd-event-focus-ring,
            var(--fdic-focus-ring-color)
          );
    }

    .event-link:focus-visible {
      box-shadow: 0 0 0 var(--fdic-focus-gap-width, 2px)
          var(--fd-event-focus-gap, var(--fdic-focus-gap-color)),
        0 0 0 var(--fdic-focus-ring-width, 4px)
          var(
            --fd-event-focus-ring,
            var(--fdic-focus-ring-color)
          );
    }

    [part="metadata"] {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
      margin: 0;
      padding: 0;
      list-style: none;
      color: var(
        --fd-event-metadata-color,
        var(--fdic-color-text-secondary)
      );
      font-size: var(
        --fd-event-metadata-font-size,
        var(--fdic-font-size-body-small, 16px)
      );
      font-weight: 400;
      line-height: var(--fd-event-metadata-line-height, 1.375);
    }

    [part="metadata-item"] {
      display: inline-flex;
      align-items: center;
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }

    [part="metadata-item"] + [part="metadata-item"]::before {
      content: "|";
      margin-inline: var(--fd-event-metadata-separator-gap, 6px);
      color: currentColor;
    }

    @media (forced-colors: active) {
      .title-link:focus-visible {
        box-shadow: none;
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part="date"],
      .title-link {
        transition: none;
      }
    }
  `;

  declare tone: EventTone;
  declare month: string;
  declare day: string;
  declare title: string;
  declare href: string | undefined;
  declare target: string | undefined;
  declare rel: string | undefined;
  declare metadata: string[];

  private readonly _titleId = `fd-event-title-${eventTitleIds += 1}`;

  constructor() {
    super();
    this.tone = "neutral";
    this.month = "";
    this.day = "";
    this.title = "";
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.metadata = [];
  }

  render() {
    const tone = normalizeEventTone(this.tone);
    const title = this.title.trim();
    const month = this.month.trim();
    const day = this.day.trim();
    const href = this.href?.trim() || undefined;
    const target = this.target?.trim() || undefined;
    const rel = normalizeLinkRel(target, this.rel?.trim() || undefined);
    const metadata = this.metadata.filter((item) => item.trim().length > 0);
    const titleTemplate = href
      ? html`<p id=${this._titleId} class="title-link">${title}</p>`
      : html`<p id=${this._titleId} class="title-text">${title}</p>`;

    const contentTemplate = html`
      <div part="date">
        <p part="month">${month}</p>
        <p part="day">${day}</p>
      </div>
      <div part="content">
        <div part="title">${title ? titleTemplate : nothing}</div>
        ${metadata.length
          ? html`
              <ul part="metadata">
                ${metadata.map(
                  (item) => html`<li part="metadata-item">${item}</li>`,
                )}
              </ul>
            `
          : nothing}
      </div>
    `;

    return html`
      <article
        part="base"
        aria-labelledby=${ifDefined(title ? this._titleId : undefined)}
      >
        ${href
          ? html`
              <a
                class="event-link"
                href=${href}
                target=${ifDefined(target)}
                rel=${ifDefined(rel)}
                aria-labelledby=${ifDefined(title ? this._titleId : undefined)}
              >
                ${contentTemplate}
              </a>
            `
          : contentTemplate}
      </article>
    `;
  }
}
