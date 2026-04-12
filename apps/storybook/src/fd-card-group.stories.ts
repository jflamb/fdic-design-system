import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import coolHero from "./assets/hero/cool.webp";
import warmHero from "./assets/hero/warm.webp";
import neutralHero from "./assets/hero/neutral.webp";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type CardGroupArgs = {
  columns: "2" | "3" | "4";
  label?: string;
};

const CARD_FIXTURES = [
  {
    category: "Press release",
    title: "Quarterly banking profile",
    href: "/news/quarterly-banking-profile",
    metadata: "April 3, 2026",
    imageSrc: coolHero,
  },
  {
    category: "Statement",
    title: "Annual consumer compliance outlook",
    href: "/news/annual-consumer-compliance-outlook",
    metadata: "March 18, 2026",
    imageSrc: warmHero,
  },
  {
    category: "Update",
    title: "Deposit insurance resources",
    href: "/resources/deposit-insurance",
    metadata: "Updated April 1, 2026",
    imageSrc: neutralHero,
  },
  {
    category: "Resource",
    title: "Consumer news archive",
    href: "/news/archive",
    metadata: "March 29, 2026",
    imageSrc: coolHero,
  },
  {
    category: "Report",
    title: "Supervision highlights",
    href: "/reports/supervision-highlights",
    metadata: "March 10, 2026",
    imageSrc: warmHero,
  },
] as const;

const renderCardSet = (count = CARD_FIXTURES.length) =>
  CARD_FIXTURES.slice(0, count).map(
    (card) => html`
      <fd-card
        size="large"
        category=${card.category}
        title=${card.title}
        href=${card.href}
        metadata=${card.metadata}
        image-src=${card.imageSrc}
      ></fd-card>
    `,
  );

const meta = {
  title: "Components/Card Group",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A responsive collection wrapper for related cards. It uses the public `--ds-layout-col-*` collection recipes and adapts fluidly as container space tightens.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-card-group"),
  },
  args: {
    ...getComponentArgs("fd-card-group"),
    columns: "3",
    label: "Latest updates",
  },
  render: (args: CardGroupArgs) => html`
    <fd-card-group columns=${args.columns} label=${ifDefined(args.label)}>
      ${renderCardSet()}
    </fd-card-group>
  `,
} satisfies Meta<CardGroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-card-group") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector('[part="base"]');
  const cards = host?.querySelectorAll("fd-card") ?? [];
  const firstCard = cards[0] as HTMLElement | undefined;

  expect(base?.getAttribute("role")).toBe("list");
  expect(base?.getAttribute("aria-label")).toBe("Latest updates");
  expect(cards.length).toBe(5);
  expect(firstCard?.getAttribute("role")).toBe("listitem");
};

export const TwoColumns: Story = {
  args: {
    columns: "2",
    label: "Featured updates",
  },
};

export const FourColumns: Story = {
  args: {
    columns: "4",
    label: "Quick links",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Two-column constraints</strong>
        <fd-card-group columns="2" label="Featured updates">
          ${renderCardSet(4)}
        </fd-card-group>
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Three-column constraints</strong>
        <fd-card-group columns="3" label="Latest updates">
          ${renderCardSet()}
        </fd-card-group>
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Four-column constraints</strong>
        <fd-card-group columns="4" label="Quick links">
          ${renderCardSet()}
        </fd-card-group>
      </section>
    </div>
  `,
};
