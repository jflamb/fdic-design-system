import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import type { FdLinkCategoryLinkItem } from "@jflamb/fdic-ds-components";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";

type LinkCategoryArgs = {
  size: "medium" | "large";
  tone: "neutral" | "cool" | "warm";
  iconName: string;
  category: string;
  overview: string;
  showVisual: boolean;
  showStripe: boolean;
  linksMode: "none" | "four" | "six";
};

const LINK_PRESETS: Record<LinkCategoryArgs["linksMode"], FdLinkCategoryLinkItem[]> = {
  none: [],
  four: [
    { label: "Account access", href: "/resources/account-access" },
    { label: "Deposit insurance", href: "/resources/deposit-insurance" },
    { label: "Consumer assistance", href: "/resources/consumer-assistance" },
    { label: "Bank information", href: "/resources/bank-information" },
  ],
  six: [
    { label: "Account access", href: "/resources/account-access" },
    { label: "Deposit insurance", href: "/resources/deposit-insurance" },
    { label: "Consumer assistance", href: "/resources/consumer-assistance" },
    { label: "Bank information", href: "/resources/bank-information" },
    { label: "Fraud prevention", href: "/resources/fraud-prevention" },
    { label: "Contact options", href: "/resources/contact-options" },
  ],
};

const renderLinkCategory = (args: LinkCategoryArgs) => html`
  <div style="inline-size:min(100%, 344px);">
    <fd-link-category
      size=${args.size}
      tone=${args.tone}
      icon-name=${args.iconName}
      category=${args.category}
      overview=${args.overview}
      show-visual=${args.showVisual ? "true" : "false"}
      show-stripe=${args.showStripe ? "true" : "false"}
      .links=${LINK_PRESETS[args.linksMode]}
    ></fd-link-category>
  </div>
`;

const meta = {
  title: "Components/Link Category",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static category block that groups a short overview with up to six related native links.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-link-category"),
    linksMode: {
      control: "radio",
      options: ["none", "four", "six"],
      description:
        "Story-only helper for previewing the supporting links property.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-link-category"),
    size: "medium",
    tone: "neutral",
    iconName: "download",
    category: "Consumer resources",
    overview: "Find common banking resources and support options in one place.",
    showVisual: true,
    showStripe: true,
    linksMode: "four",
  },
  render: renderLinkCategory,
} satisfies Meta<LinkCategoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const category = canvasElement.querySelector("fd-link-category");
  const links = category?.shadowRoot?.querySelectorAll('[part="link"]');

  expect(category?.getAttribute("tabindex")).toBeNull();
  expect(links).toHaveLength(4);
};

export const LargeWarm: Story = {
  args: {
    size: "large",
    tone: "warm",
    category: "Programs and services",
    overview: "Browse service areas, contact paths, and program guidance.",
    linksMode: "four",
  },
};

export const WithoutVisualOrStripe: Story = {
  args: {
    tone: "cool",
    showVisual: false,
    showStripe: false,
    category: "Quick links",
    overview: "Use a quieter treatment when surrounding layout already provides emphasis.",
    linksMode: "four",
  },
};

export const WithSixLinks: Story = {
  args: {
    tone: "cool",
    category: "Banking help",
    overview: "Start with the topic that best matches your banking question.",
    linksMode: "six",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Figma-backed treatments</strong>
        <div
          style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:2rem; align-items:start;"
        >
          ${renderLinkCategory({
            size: "medium",
            tone: "cool",
            iconName: "download",
            category: "Consumer help",
            overview: "Find account, insurance, and contact resources.",
            showVisual: true,
            showStripe: true,
            linksMode: "four",
          })}
          ${renderLinkCategory({
            size: "medium",
            tone: "neutral",
            iconName: "download",
            category: "Reports",
            overview: "Browse reports, data, and public information.",
            showVisual: true,
            showStripe: true,
            linksMode: "four",
          })}
          ${renderLinkCategory({
            size: "large",
            tone: "warm",
            iconName: "download",
            category: "Programs",
            overview: "Review program areas and support contacts.",
            showVisual: true,
            showStripe: true,
            linksMode: "four",
          })}
        </div>
      </section>
    </div>
  `,
};
