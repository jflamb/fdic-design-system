import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
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
  style?: string;
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
    style=${[
      args.density === "tight" ? "--fd-event-list-col-3-gap: 20px;" : "",
      args.style ?? "",
    ].join(" ")}
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

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-event-list") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector('[part="base"]');
  const events = host?.querySelectorAll("fd-event") ?? [];
  const firstEvent = events[0] as HTMLElement | undefined;

  expect(base?.getAttribute("role")).toBe("list");
  expect(base?.getAttribute("aria-label")).toBe("Upcoming events");
  expect(events.length).toBe(4);
  expect(firstEvent?.getAttribute("role")).toBe("listitem");
};

const DOCS_OVERVIEW_EVENT_LIST_STYLE = [
  "--fd-event-list-col-2-gap-mobile: var(--fdic-layout-col-2-gap, 48px);",
  "--fd-event-list-col-2-row-gap-mobile: var(--fdic-layout-section-block-padding-compact, 24px);",
].join(" ");

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
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive event grouping</strong>
        ${renderEventList({
          columns: "2",
          label: "Upcoming events",
          tone: "cool",
          density: "default",
          style: DOCS_OVERVIEW_EVENT_LIST_STYLE,
        })}
      </section>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Shared official-event tone</strong>
        ${renderEventList({
          columns: "2",
          label: "Official events",
          tone: "warm",
          density: "default",
          style: DOCS_OVERVIEW_EVENT_LIST_STYLE,
        })}
      </section>
    </div>
  `,
};
