import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import coolHero from "./assets/hero/cool.jpg";
import warmHero from "./assets/hero/warm.png";
import neutralHero from "./assets/hero/neutral.png";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type CardArgs = {
  size: "medium" | "large";
  category: string;
  title: string;
  href?: string;
  metadata: string;
  imageSrc: string;
  frameWidth: "medium" | "large";
};

const CARD_IMAGES = {
  cool: coolHero,
  warm: warmHero,
  neutral: neutralHero,
} as const;

const CARD_WIDTHS = {
  medium: "480px",
  large: "357px",
} as const;

const renderCard = (args: CardArgs) => html`
  <div style=${`display:block; inline-size:min(100%, ${CARD_WIDTHS[args.frameWidth]});`}>
    <fd-card
      size=${args.size}
      category=${args.category}
      title=${args.title}
      href=${args.href || nothing}
      metadata=${args.metadata}
      image-src=${args.imageSrc}
    ></fd-card>
  </div>
`;

const meta = {
  title: "Components/Card",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static editorial preview card with decorative media, one title destination, and footer metadata.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-card"),
    imageSrc: {
      control: "radio",
      options: ["cool", "warm", "neutral"],
      mapping: CARD_IMAGES,
      name: "image-src",
    },
    frameWidth: {
      control: "radio",
      options: ["medium", "large"],
      description:
        "Story-only width wrapper used to preview the two Figma card proportions.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-card"),
    size: "medium",
    category: "Press release",
    title: "Quarterly banking profile",
    href: "/news/quarterly-banking-profile",
    metadata: "April 3, 2026",
    imageSrc: CARD_IMAGES.cool,
    frameWidth: "medium",
  },
  render: renderCard,
} satisfies Meta<CardArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const card = canvasElement.querySelector("fd-card");
  const title = card?.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
  const media = card?.shadowRoot?.querySelector<HTMLImageElement>("[part=media] img");

  expect(card?.getAttribute("tabindex")).toBeNull();
  expect(title?.textContent).toContain("Quarterly");
  expect(media?.getAttribute("alt")).toBe("");
};

export const Large: Story = {
  args: {
    size: "large",
    category: "Statement",
    title: "Annual consumer compliance outlook",
    href: "/news/annual-consumer-compliance-outlook",
    metadata: "March 18, 2026",
    imageSrc: CARD_IMAGES.warm,
    frameWidth: "large",
  },
};

export const Unlinked: Story = {
  args: {
    size: "medium",
    category: "Update",
    title: "Deposit insurance resources",
    href: undefined,
    metadata: "Updated April 1, 2026",
    imageSrc: CARD_IMAGES.neutral,
    frameWidth: "medium",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Medium layout</strong>
        ${renderCard({
          size: "medium",
          category: "Press release",
          title: "Quarterly banking profile",
          href: "/news/quarterly-banking-profile",
          metadata: "April 3, 2026",
          imageSrc: CARD_IMAGES.cool,
          frameWidth: "medium",
        })}
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Large layout</strong>
        ${renderCard({
          size: "large",
          category: "Statement",
          title: "Annual consumer compliance outlook",
          href: "/news/annual-consumer-compliance-outlook",
          metadata: "March 18, 2026",
          imageSrc: CARD_IMAGES.warm,
          frameWidth: "large",
        })}
      </section>
    </div>
  `,
};
