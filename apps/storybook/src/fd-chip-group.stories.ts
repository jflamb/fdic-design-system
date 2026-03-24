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

type ChipGroupArgs = {
  label: string;
};

const renderChipGroup = (args: ChipGroupArgs) => html`
  <fd-chip-group label=${ifDefined(args.label || undefined)}>
    <fd-chip>Pending review</fd-chip>
    <fd-chip type="cool">Information added</fd-chip>
    <fd-chip type="alert">Past due</fd-chip>
  </fd-chip-group>
`;

const meta = {
  title: "Components/Chip Group",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-chip-group"),
  },
  args: {
    ...getComponentArgs("fd-chip-group"),
    label: "",
  },
  render: (args: ChipGroupArgs) => renderChipGroup(args),
} satisfies Meta<ChipGroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-chip-group") as HTMLElement | null;
  const slot = host?.shadowRoot?.querySelector("slot") as HTMLSlotElement | null;
  expect(slot?.assignedElements()).toHaveLength(3);
};

export const LabeledGroup: Story = {
  args: {
    label: "Active filters",
  },
};

LabeledGroup.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-chip-group") as HTMLElement | null;
  const container = host?.shadowRoot?.querySelector("[part=container]");
  expect(container?.getAttribute("role")).toBe("group");
  expect(container?.getAttribute("aria-label")).toBe("Active filters");
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default wrapping group</strong>
        <fd-chip-group>
          <fd-chip>Pending review</fd-chip>
          <fd-chip type="cool">Information added</fd-chip>
          <fd-chip type="warm">Needs follow-up</fd-chip>
          <fd-chip type="positive">Approved</fd-chip>
          <fd-chip type="alert">Past due</fd-chip>
        </fd-chip-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Labeled active-filter set</strong>
        <fd-chip-group label="Active filters">
          <fd-chip>Pending review</fd-chip>
          <fd-chip type="cool">Small business</fd-chip>
          <fd-chip type="warm">Under $250K</fd-chip>
        </fd-chip-group>
      </section>
    </div>
  `,
};
