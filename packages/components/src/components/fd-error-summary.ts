import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type ErrorSummaryFocusTarget = "container" | "heading";

export interface ErrorSummaryItem {
  href: string;
  text: string;
}

/**
 * `fd-error-summary` — Submit-scoped navigation summary for blocking errors.
 *
 * This component is intentionally presentational. Consumers provide the
 * authored list of links, decide when the summary opens, and decide whether
 * focus should move after a blocked submit.
 */
export class FdErrorSummary extends LitElement {
  static properties = {
    heading: { reflect: true },
    intro: { reflect: true },
    open: { type: Boolean, reflect: true },
    autofocus: { type: Boolean, reflect: true },
    focusTarget: { attribute: "focus-target", reflect: true },
    items: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      color: var(--fdic-color-text-primary, #212123);
    }

    :host([hidden]) {
      display: none;
    }

    [part="base"] {
      display: grid;
      gap: var(--fdic-spacing-sm, 12px);
      padding: var(--fdic-spacing-lg, 20px);
      border-inline-start: 4px solid
        var(--fdic-color-semantic-border-error, #b10b2d);
      background: var(--fd-error-summary-background, var(--fdic-color-bg-container, #f5f5f7));
      box-sizing: border-box;
      outline: none;
    }

    [part="heading"] {
      margin: 0;
      font-size: var(--fdic-font-size-h4, 1.25rem);
      line-height: 1.2;
    }

    [part="intro"] {
      margin: 0;
      color: var(--fdic-color-text-secondary, #595961);
      font-size: var(--fdic-font-size-body, 18px);
      line-height: 1.375;
    }

    [part="list"] {
      margin: 0;
      padding-inline-start: 1.25rem;
      display: grid;
      gap: var(--fdic-spacing-2xs, 4px);
    }

    [part="item"] {
      margin: 0;
    }

    [part="link"] {
      color: var(--fdic-color-bg-active, #0d6191);
    }

    [part="base"]:focus-visible,
    [part="heading"]:focus-visible {
      outline: 2px solid var(--fdic-focus-ring-color, #38b6ff);
      outline-offset: 2px;
    }

    @media (forced-colors: active) {
      [part="base"] {
        border-inline-start-color: LinkText;
      }

      [part="link"] {
        color: LinkText;
      }
    }
  `;

  declare heading: string;
  declare intro: string | undefined;
  declare open: boolean;
  declare autofocus: boolean;
  declare focusTarget: ErrorSummaryFocusTarget;
  declare items: ErrorSummaryItem[];

  private static _instanceCounter = 0;
  private readonly _instanceId: number;

  constructor() {
    super();
    this.heading = "Fix the following before you continue";
    this.intro = undefined;
    this.open = false;
    this.autofocus = false;
    this.focusTarget = "container";
    this.items = [];
    this._instanceId = FdErrorSummary._instanceCounter++;
  }

  override updated(changed: PropertyValues<this>) {
    if (
      this.open &&
      this.autofocus &&
      (changed.has("open") || changed.has("autofocus") || changed.has("focusTarget"))
    ) {
      requestAnimationFrame(() => this.focus());
    }
  }

  override focus(options?: FocusOptions) {
    const target =
      this.focusTarget === "heading" ? this._headingElement : this._baseElement;
    target?.focus(options);
  }

  private get _headingId() {
    return `fd-error-summary-heading-${this._instanceId}`;
  }

  private get _baseElement(): HTMLElement | null {
    return this.shadowRoot?.querySelector('[part="base"]') ?? null;
  }

  private get _headingElement(): HTMLElement | null {
    return this.shadowRoot?.querySelector('[part="heading"]') ?? null;
  }

  render() {
    if (!this.open || this.items.length === 0) {
      return nothing;
    }

    return html`
      <section
        part="base"
        tabindex="-1"
        aria-labelledby=${this._headingId}
      >
        <h2
          part="heading"
          id=${this._headingId}
          tabindex=${ifDefined(this.focusTarget === "heading" ? "-1" : undefined)}
        >
          ${this.heading}
        </h2>
        ${this.intro
          ? html`<p part="intro">${this.intro}</p>`
          : nothing}
        <ul part="list">
          ${this.items.map(
            (item) => html`
              <li part="item">
                <a part="link" href=${item.href}>${item.text}</a>
              </li>
            `,
          )}
        </ul>
      </section>
    `;
  }
}
