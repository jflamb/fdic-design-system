import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
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

type EventItem = {
  month: string;
  day: string;
  title: string;
  href?: string;
  metadata: string[];
};

type EventListArgs = {
  columns: "2" | "3" | "4";
  label: string;
  tone: "neutral" | "cool" | "warm";
  density: "default" | "tight";
};

const SAMPLE_EVENTS: EventItem[] = [
  {
    month: "SEP",
    day: "18",
    title: "Building a Strong Personal Brand",
    metadata: ["FDIC-wide", "Conference"],
  },
  {
    month: "SEP",
    day: "18",
    title: "Board Meeting",
    metadata: ["FDIC-wide", "Conference"],
  },
  {
    month: "SEP",
    day: "18",
    title: "Audit Analytics Training",
    metadata: ["FDIC-wide", "Conference"],
  },
  {
    month: "SEP",
    day: "18",
    title: "Westlaw Dockets Training",
    metadata: ["FDIC-wide", "Conference"],
  },
];

const renderEvent = (item: EventItem) => html`
  <fd-event
    month=${item.month}
    day=${item.day}
    title=${item.title}
    href=${item.href ?? ""}
    .metadata=${item.metadata}
  ></fd-event>
`;

const renderEventList = (args: EventListArgs) => html`
  <fd-event-list
    columns=${args.columns}
    label=${args.label}
    tone=${args.tone}
    style=${args.density === "tight" ? "--fd-event-list-col-3-gap: 20px;" : ""}
  >
    ${SAMPLE_EVENTS.map((item) => renderEvent(item))}
  </fd-event-list>
`;

const meta = {
  title: "Components/Event List",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-event-list"),
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
    ...getComponentArgs("fd-event-list"),
    columns: "3",
    label: "Upcoming events",
    tone: "cool",
    density: "default",
  },
  render: renderEventList,
} satisfies Meta<EventListArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OfficialSet: Story = {
  args: {
    tone: "warm",
  },
};

export const TwoColumns: Story = {
  args: {
    columns: "2",
  },
};

export const TightSpacing: Story = {
  args: {
    density: "tight",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive event grouping</strong>
        ${renderEventList({
          columns: "3",
          label: "Upcoming events",
          tone: "cool",
          density: "default",
        })}
      </section>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Shared official-event tone</strong>
        ${renderEventList({
          columns: "4",
          label: "Official events",
          tone: "warm",
          density: "tight",
        })}
      </section>
    </div>
  `,
};
