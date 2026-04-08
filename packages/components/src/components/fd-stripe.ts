import { LitElement, css, html } from "lit";

export const STRIPE_TYPES = ["neutral", "cool", "warm"] as const;
export type StripeType = (typeof STRIPE_TYPES)[number];

const STRIPE_TYPE_SET = new Set<string>(STRIPE_TYPES);

function normalizeStripeType(value: string | undefined): StripeType {
  return value && STRIPE_TYPE_SET.has(value) ? (value as StripeType) : "neutral";
}

/**
 * `fd-stripe` — Decorative accent stripe for lightweight grouping.
 */
export class FdStripe extends LitElement {
  static properties = {
    type: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: 100%;
      line-height: 0;
    }

    .stripe {
      display: block;
      inline-size: min(100%, var(--fd-stripe-width, 80px));
      block-size: var(--fd-stripe-height, 4px);
      border-radius: var(--fd-stripe-radius, 0);
      background: var(
        --fd-stripe-bg-neutral,
        var(--ds-color-border-divider, #bdbdbf)
      );
    }

    .type-cool {
      background: var(--fd-stripe-bg-cool, var(--ds-color-info-100, #38b6ff));
    }

    .type-warm {
      background: var(
        --fd-stripe-bg-warm,
        var(--ds-color-secondary-500, #d9af45)
      );
    }

    @media (forced-colors: active) {
      .stripe {
        background: CanvasText;
        forced-color-adjust: none;
      }
    }
  `;

  declare type: string;

  constructor() {
    super();
    this.type = "neutral";
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }

  render() {
    const type = normalizeStripeType(this.type);

    return html`<span part="stripe" class=${`stripe type-${type}`}></span>`;
  }
}
