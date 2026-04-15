import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import type { FdTileLinkItem } from "@jflamb/fdic-ds-components";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type TileArgs = {
  tone: "neutral" | "cool" | "warm";
  visualType: "auto" | "neutral" | "cool" | "warm" | "avatar";
  iconName: string;
  title: string;
  href: string;
  description: string;
  linksMode: "none" | "two" | "four";
  width: "sm" | "md" | "lg";
};

const LINK_PRESETS: Record<TileArgs["linksMode"], FdTileLinkItem[]> = {
  none: [],
  two: [
    { label: "Plan overview", href: "/benefits/overview" },
    { label: "Enrollment deadlines", href: "/benefits/deadlines" },
  ],
  four: [
    { label: "Plan overview", href: "/benefits/overview" },
    { label: "Enrollment deadlines", href: "/benefits/deadlines" },
    { label: "Eligibility", href: "/benefits/eligibility" },
    { label: "Support contacts", href: "/benefits/support" },
  ],
};

const WIDTH_PRESETS: Record<TileArgs["width"], string> = {
  sm: "320px",
  md: "378px",
  lg: "520px",
};

const TILE_FRAME_STYLE =
  "display:block; inline-size: min(100%, var(--tile-frame-width));";

const renderTile = (args: TileArgs) => html`
  <div style=${`${TILE_FRAME_STYLE} --tile-frame-width:${WIDTH_PRESETS[args.width]};`}>
    <fd-tile
      tone=${args.tone}
      visual-type=${args.visualType === "auto" ? "" : args.visualType}
      icon-name=${args.iconName}
      title=${args.title}
      href=${args.href}
      description=${args.description}
      .links=${LINK_PRESETS[args.linksMode]}
    ></fd-tile>
  </div>
`;

const meta = {
  title: "Components/Tile",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static content tile with a decorative visual, one primary destination, optional supporting description, and an optional stack of supporting links.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-tile"),
    visualType: {
      control: "radio",
      options: ["auto", "neutral", "cool", "warm", "avatar"],
      description:
        "Optional override for the internal fd-visual type. Use avatar for editorial identity snippets.",
      table: { category: "Story controls" },
    },
    linksMode: {
      control: "radio",
      options: ["none", "two", "four"],
      description:
        "Story-only helper for previewing the optional supporting-links stack.",
      table: { category: "Story controls" },
    },
    width: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description:
        "Story-only width wrapper used to show the responsive tile sizing family.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-tile"),
    tone: "neutral",
    visualType: "auto",
    iconName: "download",
    title: "Benefits",
    href: "/benefits",
    description:
      "Review insurance, leave, and retirement resources in one place.",
    linksMode: "two",
    width: "md",
  },
  render: renderTile,
} satisfies Meta<TileArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const tile = canvasElement.querySelector("fd-tile");
  const primaryLink = tile?.shadowRoot?.querySelector(".title-link");

  expect(tile?.getAttribute("tabindex")).toBeNull();
  expect(primaryLink?.textContent).toContain("Benefits");
};

export const Compact: Story = {
  args: {
    width: "sm",
    linksMode: "none",
    description: "",
    title: "Travel policy",
    href: "/travel-policy",
    iconName: "eye",
  },
};

export const WithFourLinks: Story = {
  args: {
    tone: "warm",
    iconName: "star",
    title: "Employee support",
    href: "/employee-support",
    description:
      "Find program details, deadlines, and support contacts for common questions.",
    linksMode: "four",
    width: "lg",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive tile sizing</strong>
        <div style="display:grid; gap:1rem;">
          ${renderTile({
            tone: "neutral",
            iconName: "download",
            title: "Benefits",
            href: "/benefits",
            description:
              "Review insurance, leave, and retirement resources in one place.",
            linksMode: "none",
            width: "sm",
          })}
          ${renderTile({
            tone: "cool",
            iconName: "eye",
            title: "Vision coverage",
            href: "/vision",
            description: "Compare plans, provider networks, and enrollment steps.",
            linksMode: "two",
            width: "md",
          })}
          ${renderTile({
            tone: "warm",
            iconName: "star",
            title: "Employee support",
            href: "/employee-support",
            description:
              "Find program details, deadlines, and support contacts for common questions.",
            linksMode: "four",
            width: "lg",
          })}
        </div>
      </section>
    </div>
  `,
};
