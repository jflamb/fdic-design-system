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

type BadgeArgs = {
  type: "neutral" | "cool" | "warm" | "positive" | "alert";
  label: string;
};

const renderBadge = (args: BadgeArgs) => html`
  <fd-badge type=${args.type}>${args.label}</fd-badge>
`;

const meta = {
  title: "Components/Badge",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static text-first pill for tags and lightweight statuses. `fd-badge` intentionally does not expose host-level interactive behavior in v1.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-badge"),
    label: {
      control: "text",
      description: "Visible badge label rendered through the default slot.",
    },
  },
  args: {
    ...getComponentArgs("fd-badge"),
    type: "neutral",
    label: "Small business",
  },
  render: (args: BadgeArgs) => renderBadge(args),
} satisfies Meta<BadgeArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-badge") as HTMLElement | null;
  expect(host?.shadowRoot?.querySelector("button")).toBeNull();
};

export const Tones: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
      <fd-badge type="neutral">Neutral</fd-badge>
      <fd-badge type="cool">Cool</fd-badge>
      <fd-badge type="warm">Warm</fd-badge>
      <fd-badge type="positive">Positive</fd-badge>
      <fd-badge type="alert">Alert</fd-badge>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Static status labels</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          <fd-badge>Small business</fd-badge>
          <fd-badge type="cool">New account</fd-badge>
          <fd-badge type="positive">Approved</fd-badge>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>All tones</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          <fd-badge type="neutral">Neutral</fd-badge>
          <fd-badge type="cool">Cool</fd-badge>
          <fd-badge type="warm">Warm</fd-badge>
          <fd-badge type="positive">Positive</fd-badge>
          <fd-badge type="alert">Alert</fd-badge>
        </div>
      </section>
    </div>
  `,
};
