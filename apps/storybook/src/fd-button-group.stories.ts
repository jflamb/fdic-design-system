import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type ButtonGroupArgs = {
  align: "start" | "end" | "spread";
  direction: "horizontal" | "vertical";
  label: string;
};

const renderButtonGroup = (args: ButtonGroupArgs) => html`
  <fd-button-group
    align=${args.align}
    direction=${args.direction}
    label=${ifDefined(args.label || undefined)}
  >
    <fd-button variant="primary">Save</fd-button>
    <fd-button variant="outline">Save and continue</fd-button>
    <fd-button variant="subtle">Cancel</fd-button>
  </fd-button-group>
`;

const meta = {
  title: "Components/Button Group",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-button-group"),
  },
  args: {
    ...getComponentArgs("fd-button-group"),
  },
  render: renderButtonGroup,
} satisfies Meta<ButtonGroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-button-group") as HTMLElement | null;
  const container = host?.shadowRoot?.querySelector("[part=container]") as HTMLElement | undefined;

  expect(host).toBeDefined();
  expect(container).toBeDefined();
  expect(container?.classList.contains("horizontal")).toBe(true);
};

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    direction: "vertical",
  },
};

export const AlignEnd: Story = {
  args: {
    align: "end",
  },
};

export const AlignSpread: Story = {
  args: {
    align: "spread",
  },
};

export const NarrowWrap: Story = {
  render: () => html`
    <div style="max-width: 320px; border: 1px dashed #bdbdbf; padding: 12px;">
      <fd-button-group>
        <fd-button variant="primary">Approve</fd-button>
        <fd-button variant="outline">Request changes</fd-button>
        <fd-button variant="subtle">Cancel</fd-button>
      </fd-button-group>
    </div>
  `,
};

export const LabeledGroup: Story = {
  args: {
    label: "Document actions",
  },
};

export const MixedVariants: Story = {
  render: () => html`
    <fd-button-group align="spread">
      <fd-button variant="primary">Submit filing</fd-button>
      <fd-button variant="outline">Save draft</fd-button>
      <fd-button variant="destructive">Discard</fd-button>
    </fd-button-group>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default horizontal group</strong>
        <fd-button-group>
          <fd-button variant="primary">Save</fd-button>
          <fd-button variant="outline">Save and continue</fd-button>
          <fd-button variant="subtle">Cancel</fd-button>
        </fd-button-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Separated primary and escape action</strong>
        <fd-button-group align="spread">
          <fd-button variant="primary">Submit filing</fd-button>
          <fd-button variant="outline">Save draft</fd-button>
          <fd-button variant="subtle">Cancel</fd-button>
        </fd-button-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Labeled action set</strong>
        <fd-button-group label="Document actions">
          <fd-button variant="outline">Download PDF</fd-button>
          <fd-button variant="outline">Download CSV</fd-button>
          <fd-button variant="subtle">Share</fd-button>
        </fd-button-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Wrapping in a narrow container</strong>
        <div style="max-width: 320px;">
          <fd-button-group>
            <fd-button variant="primary">Approve</fd-button>
            <fd-button variant="outline">Escalate</fd-button>
            <fd-button variant="subtle">Cancel</fd-button>
          </fd-button-group>
        </div>
      </section>
    </div>
  `,
};
