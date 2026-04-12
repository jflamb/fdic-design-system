import { LitElement, css, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type ReviewListHeadingLevel = 2 | 3 | 4;
export type ReviewListDensity = "default" | "compact";

export interface ReviewListItem {
  label: string;
  value?: string;
  href?: string;
  changeLabel?: string;
  emptyText?: string;
}

/**
 * `fd-review-list` — Structured review-before-submit summary.
 */
export class FdReviewList extends LitElement {
  static properties = {
    heading: { reflect: true },
    headingLevel: { attribute: "heading-level", reflect: true },
    density: { reflect: true },
    dividers: { type: Boolean, reflect: true },
    items: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      color: var(--fdic-color-text-primary, #212123);
    }

    [part="base"] {
      display: grid;
      gap: var(--fd-review-list-gap, var(--fdic-spacing-md, 16px));
    }

    [part="heading"] {
      margin: 0;
      font-size: var(--fdic-font-size-h4, 1.25rem);
      line-height: 1.2;
    }

    [part="list"] {
      margin: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
      gap: 0 var(--fdic-spacing-md, 16px);
      align-items: start;
    }

    [part="term"],
    [part="detail"] {
      padding-block: var(--fdic-spacing-sm, 12px);
    }

    :host([density="compact"]) [part="term"],
    :host([density="compact"]) [part="detail"] {
      padding-block: var(--fdic-spacing-xs, 8px);
    }

    :host([dividers]) [part="term"],
    :host([dividers]) [part="detail"] {
      border-block-end: 1px solid var(--fdic-color-border-divider, #d6d6d8);
    }

    :host([dividers]) [part="term"]:first-of-type,
    :host([dividers]) [part="detail"]:first-of-type {
      border-block-start: 1px solid var(--fdic-color-border-divider, #d6d6d8);
    }

    [part="term"] {
      margin: 0;
      font-weight: 600;
    }

    [part="detail"] {
      margin: 0;
      min-width: 0;
      text-align: start;
    }

    [part="detail-layout"] {
      display: flex;
      justify-content: space-between;
      gap: var(--fdic-spacing-sm, 12px);
      align-items: start;
    }

    [part="value"] {
      margin: 0;
      color: var(--fdic-color-text-primary, #212123);
      overflow-wrap: anywhere;
      min-width: 0;
    }

    [part="value-empty"] {
      color: var(--fdic-color-text-secondary, #595961);
      font-style: italic;
    }

    [part="change-link"] {
      color: var(--fdic-color-text-link, #1278b0);
      white-space: nowrap;
    }

    @media (max-width: 40rem) {
      [part="list"] {
        grid-template-columns: 1fr;
      }

      [part="detail-layout"] {
        flex-direction: column;
      }
    }
  `;

  declare heading: string | undefined;
  declare headingLevel: ReviewListHeadingLevel;
  declare density: ReviewListDensity;
  declare dividers: boolean;
  declare items: ReviewListItem[];

  constructor() {
    super();
    this.heading = undefined;
    this.headingLevel = 2;
    this.density = "default";
    this.dividers = false;
    this.items = [];
  }

  private _renderHeading() {
    if (!this.heading?.trim()) {
      return nothing;
    }

    const tagName = `h${this.headingLevel}` as "h2" | "h3" | "h4";
    return tagName === "h2"
      ? html`<h2 part="heading">${this.heading}</h2>`
      : tagName === "h3"
        ? html`<h3 part="heading">${this.heading}</h3>`
        : html`<h4 part="heading">${this.heading}</h4>`;
  }

  render() {
    return html`
      <section part="base">
        ${this._renderHeading()}
        <dl part="list">
          ${this.items.map((item) => {
            const value = item.value?.trim() || item.emptyText || "Not provided";

            return html`
              <dt part="term">${item.label}</dt>
              <dd part="detail">
                <div part="detail-layout">
                  <span
                    part=${ifDefined(
                      item.value?.trim() ? "value" : "value value-empty",
                    )}
                  >
                    ${value}
                  </span>
                  ${item.href
                    ? html`
                        <a part="change-link" href=${item.href}>
                          ${item.changeLabel ?? "Change"}
                        </a>
                      `
                    : nothing}
                </div>
              </dd>
            `;
          })}
        </dl>
      </section>
    `;
  }
}
