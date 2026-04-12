import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import coolHero from "./assets/hero/cool.webp";
import neutralHero from "./assets/hero/neutral.webp";
import warmHero from "./assets/hero/warm.webp";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type HeroArgs = {
  tone: "cool" | "warm" | "neutral";
  imageSrc: string;
  actionLabel: string;
  actionHref: string;
  actionTarget: string;
  actionRel: string;
  headingTag: "h1" | "h2";
  heading: string;
  lede: string;
  body: string;
};

const HERO_IMAGES = {
  cool: coolHero,
  warm: warmHero,
  neutral: neutralHero,
  none: "",
} as const;

const HERO_FRAME_STYLE =
  "display: block; inline-size: 100%; background: var(--ds-color-bg-container, #f5f5f7);";

const renderHero = (args: HeroArgs) => {
  const headingTemplate =
    args.headingTag === "h1"
      ? html`<h1 slot="heading">${args.heading}</h1>`
      : html`<h2 slot="heading">${args.heading}</h2>`;

  return html`
    <div style=${HERO_FRAME_STYLE}>
      <fd-hero
        tone=${args.tone}
        image-src=${args.imageSrc || nothing}
        action-label=${args.actionLabel || nothing}
        action-href=${args.actionHref || nothing}
        action-target=${args.actionTarget || nothing}
        action-rel=${args.actionRel || nothing}
      >
        ${headingTemplate}
        ${args.lede
          ? html`<p slot="lede">${args.lede}</p>`
          : nothing}
        ${args.body
          ? html`<p slot="body">${args.body}</p>`
          : nothing}
      </fd-hero>
    </div>
  `;
};

const meta = {
  title: "Components/Hero",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-hero"),
    imageSrc: {
      control: "select",
      options: Object.keys(HERO_IMAGES),
      mapping: HERO_IMAGES,
      name: "image-src",
    },
    actionLabel: { control: "text", name: "action-label" },
    actionHref: { control: "text", name: "action-href" },
    actionTarget: { control: "text", name: "action-target" },
    actionRel: { control: "text", name: "action-rel" },
    headingTag: {
      control: "inline-radio",
      options: ["h1", "h2"],
    },
    heading: {
      control: "text",
      table: { category: "Story controls" },
    },
    lede: {
      control: "text",
      table: { category: "Story controls" },
    },
    body: {
      control: "text",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-hero"),
    tone: "cool",
    imageSrc: HERO_IMAGES.cool,
    actionLabel: "Explore benefits",
    actionHref: "/benefits",
    actionTarget: "",
    actionRel: "",
    headingTag: "h2",
    heading: "Benefits",
    lede:
      "Your compensation at FDIC includes competitive pay, clear policies, and structured performance management.",
    body:
      "Access the Federal Employee Health Benefits Program (FEHB), dental and vision insurance through FEDVIP, life insurance with FEGLI, long-term care options, and more. These benefits are designed to support you and your family's well-being.",
  },
  render: renderHero,
} satisfies Meta<HeroArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cool: Story = {
  args: {
    tone: "cool",
    imageSrc: HERO_IMAGES.cool,
  },
};

Cool.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-hero") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector('[part="base"]') as HTMLElement | null;
  const action = host?.shadowRoot?.querySelector('[part="action"]') as HTMLAnchorElement | null;
  const heading = host?.querySelector('[slot="heading"]') as HTMLElement | null;

  expect(base?.className).toContain("tone-cool");
  expect(action?.getAttribute("href")).toBe("/benefits");
  expect(action?.textContent).toContain("Explore benefits");
  expect(base?.getAttribute("aria-labelledby")).toBe(heading?.id);
};

export const Warm: Story = {
  args: {
    tone: "warm",
    imageSrc: HERO_IMAGES.warm,
  },
};

export const Neutral: Story = {
  args: {
    tone: "neutral",
    imageSrc: HERO_IMAGES.neutral,
  },
};

export const NoAction: Story = {
  args: {
    actionLabel: "",
    actionHref: "",
  },
};

export const NoImage: Story = {
  args: {
    imageSrc: HERO_IMAGES.none,
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Cool tone</p>
        ${renderHero({
          tone: "cool",
          imageSrc: HERO_IMAGES.cool,
          actionLabel: "Explore benefits",
          actionHref: "/benefits",
          actionTarget: "",
          actionRel: "",
          headingTag: "h2",
          heading: "Benefits",
          lede:
            "Your compensation at FDIC includes competitive pay, clear policies, and structured performance management.",
          body:
            "Access the Federal Employee Health Benefits Program (FEHB), dental and vision insurance through FEDVIP, life insurance with FEGLI, long-term care options, and more.",
        })}
      </div>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Warm and neutral tones</p>
        <div style="display: grid; gap: 1.5rem;">
          ${renderHero({
            tone: "warm",
            imageSrc: HERO_IMAGES.warm,
            actionLabel: "Explore benefits",
            actionHref: "/benefits",
            actionTarget: "",
            actionRel: "",
            headingTag: "h2",
            heading: "Benefits",
            lede:
              "Your compensation at FDIC includes competitive pay, clear policies, and structured performance management.",
            body:
              "Access the Federal Employee Health Benefits Program (FEHB), dental and vision insurance through FEDVIP, life insurance with FEGLI, long-term care options, and more.",
          })}
          ${renderHero({
            tone: "neutral",
            imageSrc: HERO_IMAGES.neutral,
            actionLabel: "Explore benefits",
            actionHref: "/benefits",
            actionTarget: "",
            actionRel: "",
            headingTag: "h2",
            heading: "Benefits",
            lede:
              "Your compensation at FDIC includes competitive pay, clear policies, and structured performance management.",
            body:
              "Access the Federal Employee Health Benefits Program (FEHB), dental and vision insurance through FEDVIP, life insurance with FEGLI, long-term care options, and more.",
          })}
        </div>
      </div>
    </div>
  `,
};
