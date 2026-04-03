import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components/register-all";
import type { FdTileLinkItem } from "@fdic-ds/components";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type TileItem = {
  tone: "neutral" | "cool" | "warm";
  iconName: string;
  title: string;
  href: string;
  description?: string;
  links?: FdTileLinkItem[];
};

type TileListArgs = {
  label: string;
  density: "default" | "tight";
};

const SAMPLE_ITEMS: TileItem[] = [
  {
    tone: "neutral",
    iconName: "download",
    title: "Dental insurance",
    href: "/benefits/dental",
    description: "Review plan summaries, enrollment steps, and provider details.",
  },
  {
    tone: "cool",
    iconName: "eye",
    title: "Vision insurance",
    href: "/benefits/vision",
    description: "Compare coverage, network options, and annual deadlines.",
  },
  {
    tone: "warm",
    iconName: "star",
    title: "Long-term disability insurance",
    href: "/benefits/disability",
    description: "Understand coverage terms and claim-support contacts.",
    links: [
      { label: "Eligibility", href: "/benefits/disability/eligibility" },
      { label: "Plan guide", href: "/benefits/disability/guide" },
    ],
  },
  {
    tone: "neutral",
    iconName: "download",
    title: "Flexible spending accounts",
    href: "/benefits/fsa",
    description: "Find annual contribution limits and reimbursement guidance.",
  },
];

const renderTile = (item: TileItem) => html`
  <fd-tile
    tone=${item.tone}
    icon-name=${item.iconName}
    title=${item.title}
    href=${item.href}
    description=${item.description ?? ""}
    .links=${item.links ?? []}
  ></fd-tile>
`;

const renderTileList = (args: TileListArgs) => html`
  <fd-tile-list
    label=${args.label}
    style=${args.density === "tight"
      ? "--fd-tile-list-row-gap: 16px; --fd-tile-list-column-gap: 20px;"
      : ""}
  >
    ${SAMPLE_ITEMS.map((item) => renderTile(item))}
  </fd-tile-list>
`;

const meta = {
  title: "Components/Tile List",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-tile-list"),
    density: {
      control: "radio",
      options: ["default", "tight"],
      description: "Story-only helper for previewing layout spacing.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-tile-list"),
    label: "Benefits links",
    density: "default",
  },
  render: renderTileList,
} satisfies Meta<TileListArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TightSpacing: Story = {
  args: {
    density: "tight",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive wrapping</strong>
        ${renderTileList({
          label: "Benefits links",
          density: "default",
        })}
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Tighter list density</strong>
        ${renderTileList({
          label: "Benefits links",
          density: "tight",
        })}
      </section>
    </div>
  `,
};
