import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
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

type EventArgs = {
  tone: "neutral" | "cool" | "warm";
  month: string;
  day: string;
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

  expect(title?.textContent).toContain("FFIEC");
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

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Tone guidance</strong>
        <div style="display:grid; gap:1rem;">
          ${renderEvent({
            tone: "warm",
            month: "SEP",
            day: "18",
            title: "Community Banking Forum",
            href: "/events/community-banking-forum",
            metadataMode: "two",
          })}
          ${renderEvent({
            tone: "neutral",
            month: "SEP",
            day: "18",
            title: "Board Meeting",
            href: undefined,
            metadataMode: "two",
          })}
          ${renderEvent({
            tone: "cool",
            month: "SEP",
            day: "18",
            title: "FFIEC International Banking Conference",
            href: "/events/ffiec-international-banking-conference",
            metadataMode: "three",
          })}
        </div>
      </section>
    </div>
  `,
};
