import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type StripeArgs = {
  type: "neutral" | "cool" | "warm";
};

function renderStripe(args: StripeArgs) {
  return html`<fd-stripe type=${args.type}></fd-stripe>`;
}

const meta = {
  title: "Supporting Primitives/Stripe",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A decorative stripe primitive for lightweight grouping accents. `fd-stripe` is intentionally hidden from assistive technology and does not provide semantic separator behavior in v1.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-stripe"),
  },
  args: {
    ...getComponentArgs("fd-stripe"),
    type: "neutral",
  },
  render: (args: StripeArgs) => renderStripe(args),
} satisfies Meta<StripeArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cool: Story = {
  args: {
    type: "cool",
  },
};

export const Warm: Story = {
  args: {
    type: "warm",
  },
};

export const Neutral: Story = {
  args: {
    type: "neutral",
  },
};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-stripe");
  expect(host?.getAttribute("aria-hidden")).toBe("true");
  expect(host?.shadowRoot?.querySelector("button")).toBeNull();
};

export const Tones: Story = {
  render: () => html`
    <div style="display: grid; gap: var(--fdic-spacing-sm, 0.75rem);">
      <fd-stripe type="neutral"></fd-stripe>
      <fd-stripe type="cool"></fd-stripe>
      <fd-stripe type="warm"></fd-stripe>
    </div>
  `,
};

export const InContext: Story = {
  render: () => html`
    <div style="display: grid; gap: var(--fdic-spacing-2xl, 2rem); max-width: 30rem;">
      <section style="display: grid; gap: var(--fdic-spacing-sm, 0.75rem);">
        <fd-stripe type="cool"></fd-stripe>
        <div>
          <h3 style="margin: 0;">Account activity</h3>
          <p style="margin: 0.5rem 0 0; color: var(--fdic-text-secondary, #595961);">
            Use the stripe as a decorative accent when the heading and surrounding
            copy already explain the grouping.
          </p>
        </div>
      </section>

      <section style="display: grid; gap: var(--fdic-spacing-sm, 0.75rem);">
        <fd-stripe type="warm"></fd-stripe>
        <div>
          <h3 style="margin: 0;">Document checklist</h3>
          <p style="margin: 0.5rem 0 0; color: var(--fdic-text-secondary, #595961);">
            Color supports scanning, but the visible text still carries the meaning.
          </p>
        </div>
      </section>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Tone set</strong>
        <div style="display: grid; gap: var(--fdic-spacing-sm, 0.75rem);">
          <fd-stripe type="neutral"></fd-stripe>
          <fd-stripe type="cool"></fd-stripe>
          <fd-stripe type="warm"></fd-stripe>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Heading composition</strong>
        <div style="display: grid; gap: var(--fdic-spacing-xl, 1.25rem); max-width: 30rem;">
          <section style="display: grid; gap: var(--fdic-spacing-sm, 0.75rem);">
            <fd-stripe type="cool"></fd-stripe>
            <div>
              <h3 style="margin: 0;">Account activity</h3>
              <p style="margin: 0.5rem 0 0; color: var(--fdic-text-secondary, #595961);">
                Decorative accent above a section heading.
              </p>
            </div>
          </section>

          <section style="display: grid; gap: var(--fdic-spacing-sm, 0.75rem);">
            <fd-stripe type="warm"></fd-stripe>
            <div>
              <h3 style="margin: 0;">Document checklist</h3>
              <p style="margin: 0.5rem 0 0; color: var(--fdic-text-secondary, #595961);">
                Lightweight grouping without pretending to be the document structure.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  `,
};
