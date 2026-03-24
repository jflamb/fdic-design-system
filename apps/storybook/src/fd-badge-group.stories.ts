import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
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

type BadgeGroupArgs = {
  label: string;
};

const renderBadgeGroup = (args: BadgeGroupArgs) => html`
  <fd-badge-group label=${ifDefined(args.label || undefined)}>
    <fd-badge>Small business</fd-badge>
    <fd-badge type="cool">New account</fd-badge>
    <fd-badge type="positive">Approved</fd-badge>
  </fd-badge-group>
`;

const meta = {
  title: "Components/Badge Group",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-badge-group"),
  },
  args: {
    ...getComponentArgs("fd-badge-group"),
    label: "",
  },
  render: (args: BadgeGroupArgs) => renderBadgeGroup(args),
} satisfies Meta<BadgeGroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-badge-group") as HTMLElement | null;
  const slot = host?.shadowRoot?.querySelector("slot") as HTMLSlotElement | null;
  expect(slot?.assignedElements()).toHaveLength(3);
};

export const LabeledGroup: Story = {
  args: {
    label: "Account tags",
  },
};

LabeledGroup.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-badge-group") as HTMLElement | null;
  const container = host?.shadowRoot?.querySelector("[part=container]");
  expect(container?.getAttribute("role")).toBe("group");
  expect(container?.getAttribute("aria-label")).toBe("Account tags");
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default wrapping group</strong>
        <fd-badge-group>
          <fd-badge>Small business</fd-badge>
          <fd-badge type="cool">New account</fd-badge>
          <fd-badge type="warm">Needs follow-up</fd-badge>
          <fd-badge type="positive">Approved</fd-badge>
          <fd-badge type="alert">Past due</fd-badge>
        </fd-badge-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Labeled tag set</strong>
        <fd-badge-group label="Account tags">
          <fd-badge>Small business</fd-badge>
          <fd-badge type="cool">Branch office</fd-badge>
          <fd-badge type="positive">Insured</fd-badge>
        </fd-badge-group>
      </section>
    </div>
  `,
};
