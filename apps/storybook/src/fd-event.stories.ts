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

type EventArgs = {
  tone: "neutral" | "cool" | "warm";
  month: string;
  day: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  title: string;
  href?: string;
  metadataMode: "one" | "two" | "three";
};

const METADATA_PRESETS: Record<EventArgs["metadataMode"], string[]> = {
  one: ["FDIC-wide"],
  two: ["FDIC-wide", "Conference"],
  three: ["FDIC-wide", "Conference", "In person"],
};

const renderEvent = (args: EventArgs) => html`
  <fd-event
    tone=${args.tone}
    month=${args.month}
    day=${args.day}
    date=${args.date ?? ""}
    start-date=${args.startDate ?? ""}
    end-date=${args.endDate ?? ""}
    title=${args.title}
    href=${args.href ?? ""}
    .metadata=${METADATA_PRESETS[args.metadataMode]}
  ></fd-event>
`;

const meta = {
  title: "Components/Event",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static event summary with a visible month and day block, a native title link when provided, and lightweight metadata.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-event"),
    metadataMode: {
      control: "radio",
      options: ["one", "two", "three"],
      description: "Story-only helper for previewing the metadata list density.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-event"),
    tone: "cool",
    month: "SEP",
    day: "18",
    date: "2026-09-18",
    startDate: undefined,
    endDate: undefined,
    title: "FFIEC International Banking Conference",
    href: "/events/ffiec-international-banking-conference",
    metadataMode: "two",
  },
  render: renderEvent,
} satisfies Meta<EventArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const event = canvasElement.querySelector("fd-event");
  const title = event?.shadowRoot?.querySelector(".title-link");
  const date = event?.shadowRoot?.querySelector<HTMLTimeElement>("[part=date]");

  expect(title?.textContent).toContain("FFIEC");
  expect(date?.getAttribute("datetime")).toBe("2026-09-18");
  expect(event?.getAttribute("tabindex")).toBeNull();
};

export const Unlinked: Story = {
  args: {
    tone: "neutral",
    title: "Board Meeting",
    href: undefined,
    metadataMode: "two",
  },
};

export const Official: Story = {
  args: {
    tone: "warm",
    title: "Community Banking Forum",
    href: "/events/community-banking-forum",
    metadataMode: "three",
  },
};

export const StructuredDate: Story = {
  args: {
    tone: "cool",
    month: "SEP",
    day: "18",
    date: undefined,
    startDate: "2026-09-18T13:00:00-04:00",
    endDate: "2026-09-18T14:00:00-04:00",
    title: "FFIEC International Banking Conference",
    href: "/events/ffiec-international-banking-conference",
    metadataMode: "three",
  },
};

StructuredDate.play = async ({ canvasElement }) => {
  const event = canvasElement.querySelector("fd-event");
  const date = event?.shadowRoot?.querySelector<HTMLTimeElement>("[part=date]");

  expect(date?.tagName.toLowerCase()).toBe("time");
  expect(date?.getAttribute("datetime")).toBe("2026-09-18T13:00:00-04:00");
  expect(event?.getAttribute("end-date")).toBe("2026-09-18T14:00:00-04:00");
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Tone guidance</strong>
        <div style="display:grid; gap:1rem;">
          ${renderEvent({
            tone: "warm",
            month: "SEP",
            day: "18",
            date: "2026-09-18",
            startDate: undefined,
            endDate: undefined,
            title: "Community Banking Forum",
            href: "/events/community-banking-forum",
            metadataMode: "two",
          })}
          ${renderEvent({
            tone: "neutral",
            month: "SEP",
            day: "18",
            date: "2026-09-18",
            startDate: undefined,
            endDate: undefined,
            title: "Board Meeting",
            href: undefined,
            metadataMode: "two",
          })}
          ${renderEvent({
            tone: "cool",
            month: "SEP",
            day: "18",
            date: "2026-09-18",
            startDate: undefined,
            endDate: undefined,
            title: "FFIEC International Banking Conference",
            href: "/events/ffiec-international-banking-conference",
            metadataMode: "three",
          })}
        </div>
      </section>
    </div>
  `,
};
