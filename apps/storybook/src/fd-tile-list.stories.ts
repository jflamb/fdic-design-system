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

type TileItem = {
  iconName: string;
  title: string;
  href: string;
  description?: string;
  links?: FdTileLinkItem[];
};

type TileListArgs = {
  columns: "2" | "3" | "4";
  label: string;
  tone: "neutral" | "cool" | "warm";
  density: "default" | "tight";
};

const SAMPLE_ITEMS: TileItem[] = [
  {
    iconName: "download",
    title: "Dental insurance",
    href: "/benefits/dental",
    description: "Review plan summaries, enrollment steps, and provider details.",
  },
  {
    iconName: "eye",
    title: "Vision insurance",
    href: "/benefits/vision",
    description: "Compare coverage, network options, and annual deadlines.",
  },
  {
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
    iconName: "download",
    title: "Flexible spending accounts",
    href: "/benefits/fsa",
    description: "Find annual contribution limits and reimbursement guidance.",
  },
];

const renderTile = (item: TileItem) => html`
  <fd-tile
    icon-name=${item.iconName}
    title=${item.title}
    href=${item.href}
    description=${item.description ?? ""}
    .links=${item.links ?? []}
  ></fd-tile>
`;

const renderTileList = (args: TileListArgs) => html`
  <fd-tile-list
    columns=${args.columns}
    label=${args.label}
    tone=${args.tone}
    style=${args.density === "tight" ? "--fd-tile-list-col-3-gap: 20px;" : ""}
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
    columns: {
      control: "radio",
      options: ["2", "3", "4"],
    },
    density: {
      control: "radio",
      options: ["default", "tight"],
      description: "Story-only helper for previewing layout spacing.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-tile-list"),
    columns: "3",
    label: "Benefits links",
    tone: "neutral",
    density: "default",
  },
  render: renderTileList,
} satisfies Meta<TileListArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-tile-list") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector('[part="base"]');
  const tiles = host?.querySelectorAll("fd-tile") ?? [];
  const firstTile = tiles[0] as HTMLElement | undefined;

  expect(base?.getAttribute("role")).toBe("list");
  expect(base?.getAttribute("aria-label")).toBe("Benefits links");
  expect(tiles.length).toBe(4);
  expect(firstTile?.getAttribute("role")).toBe("listitem");
  expect(firstTile?.getAttribute("tone")).toBe("neutral");
};

export const TightSpacing: Story = {
  args: {
    density: "tight",
  },
};

export const TwoColumns: Story = {
  args: {
    columns: "2",
  },
};

export const WarmSet: Story = {
  args: {
    tone: "warm",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive wrapping</strong>
        ${renderTileList({
          columns: "3",
          label: "Benefits links",
          tone: "neutral",
          density: "default",
        })}
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Shared warm tone</strong>
        ${renderTileList({
          columns: "4",
          label: "Benefits links",
          tone: "warm",
          density: "default",
        })}
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Tighter list density</strong>
        ${renderTileList({
          columns: "2",
          label: "Benefits links",
          tone: "cool",
          density: "tight",
        })}
      </section>
    </div>
  `,
};
