import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components";
import {
  DOCS_OVERVIEW_HEADING_STYLE,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

type SplitButtonArgs = {
  variant: "primary" | "neutral" | "subtle" | "outline" | "destructive";
  disabled: boolean;
  triggerDisabled: boolean;
  triggerLabel: string;
  menuPlacement: "bottom-start" | "bottom-end" | "top-start" | "top-end";
};

const meta = {
  title: "Components/Split Button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral", "subtle", "outline", "destructive"],
    },
    disabled: { control: "boolean" },
    triggerDisabled: { control: "boolean" },
    triggerLabel: { control: "text" },
    menuPlacement: {
      control: "select",
      options: ["bottom-start", "bottom-end", "top-start", "top-end"],
    },
  },
  args: {
    variant: "primary",
    disabled: false,
    triggerDisabled: false,
    triggerLabel: "More options",
    menuPlacement: "bottom-start",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: SplitButtonArgs) => html`
    <fd-split-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      ?trigger-disabled=${args.triggerDisabled}
      trigger-label=${ifDefined(args.triggerLabel || undefined)}
      menu-placement=${ifDefined(args.menuPlacement || undefined)}
    >
      Save
      <fd-menu-item slot="menu">Save as draft</fd-menu-item>
      <fd-menu-item slot="menu">Save &amp; submit for review</fd-menu-item>
    </fd-split-button>
  `,
};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-split-button") as HTMLElement | null;
  expect(host).toBeDefined();

  const primary = host?.shadowRoot?.querySelector("[part=primary]") as HTMLButtonElement | undefined;
  expect(primary).toBeDefined();

  const trigger = host?.shadowRoot?.querySelector("[part=trigger]") as HTMLButtonElement | undefined;
  expect(trigger).toBeDefined();
};

export const Primary: Story = {
  render: () => html`
    <fd-split-button variant="primary">
      Save
      <fd-menu-item slot="menu">Save as draft</fd-menu-item>
      <fd-menu-item slot="menu">Save &amp; submit for review</fd-menu-item>
    </fd-split-button>
  `,
};

Primary.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-split-button") as HTMLElement | null;
  expect(host).toBeDefined();

  const primary = host?.shadowRoot?.querySelector("[part=primary]") as HTMLButtonElement | undefined;
  expect(primary).toBeDefined();
  expect(primary?.disabled).toBe(false);
};

export const Neutral: Story = {
  render: () => html`
    <fd-split-button variant="neutral">
      Export
      <fd-menu-item slot="menu">Export as CSV</fd-menu-item>
      <fd-menu-item slot="menu">Export as PDF</fd-menu-item>
    </fd-split-button>
  `,
};

export const Subtle: Story = {
  render: () => html`
    <fd-split-button variant="subtle">
      Submit filing
      <fd-menu-item slot="menu">Submit as draft</fd-menu-item>
      <fd-menu-item slot="menu">Submit &amp; notify</fd-menu-item>
    </fd-split-button>
  `,
};

export const Outline: Story = {
  render: () => html`
    <fd-split-button variant="outline">
      Submit filing
      <fd-menu-item slot="menu">Submit as draft</fd-menu-item>
      <fd-menu-item slot="menu">Submit &amp; notify</fd-menu-item>
    </fd-split-button>
  `,
};

export const Destructive: Story = {
  render: () => html`
    <fd-split-button variant="destructive">
      Delete
      <fd-menu-item slot="menu">Delete permanently</fd-menu-item>
      <fd-menu-item slot="menu">Archive instead</fd-menu-item>
    </fd-split-button>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <fd-split-button variant="primary">
      <fd-icon slot="icon-start" name="download"></fd-icon>
      Download report
      <fd-menu-item slot="menu">Download as CSV</fd-menu-item>
      <fd-menu-item slot="menu">Download as PDF</fd-menu-item>
    </fd-split-button>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <fd-split-button variant="primary" disabled>
      Save
      <fd-menu-item slot="menu">Save as draft</fd-menu-item>
      <fd-menu-item slot="menu">Save &amp; submit for review</fd-menu-item>
    </fd-split-button>
  `,
};

Disabled.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-split-button") as HTMLElement | null;
  expect(host).toBeDefined();
  expect(host?.hasAttribute("disabled")).toBe(true);

  const primary = host?.shadowRoot?.querySelector("[part=primary]") as HTMLButtonElement | undefined;
  expect(primary?.disabled).toBe(true);

  const trigger = host?.shadowRoot?.querySelector("[part=trigger]") as HTMLButtonElement | undefined;
  expect(trigger?.disabled).toBe(true);
};

export const TriggerDisabled: Story = {
  render: () => html`
    <fd-split-button variant="primary" trigger-disabled>
      Save
      <fd-menu-item slot="menu">Save as draft</fd-menu-item>
      <fd-menu-item slot="menu">Save &amp; submit for review</fd-menu-item>
    </fd-split-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-split-button variant="primary">
        Primary
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="neutral">
        Neutral
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="subtle">
        Subtle
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="outline">
        Outline
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="destructive">
        Destructive
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
    </div>
  `,
};

export const AllVariantsDisabled: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-split-button variant="primary" disabled>
        Primary
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="neutral" disabled>
        Neutral
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="subtle" disabled>
        Subtle
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="outline" disabled>
        Outline
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
      <fd-split-button variant="destructive" disabled>
        Destructive
        <fd-menu-item slot="menu">Option one</fd-menu-item>
        <fd-menu-item slot="menu">Option two</fd-menu-item>
      </fd-split-button>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>Default with menu items</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <fd-split-button variant="primary">
            Save
            <fd-menu-item slot="menu">Save as draft</fd-menu-item>
            <fd-menu-item slot="menu">Save &amp; submit for review</fd-menu-item>
          </fd-split-button>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>With icon</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <fd-split-button variant="primary">
            <fd-icon slot="icon-start" name="download"></fd-icon>
            Download report
            <fd-menu-item slot="menu">Download as CSV</fd-menu-item>
            <fd-menu-item slot="menu">Download as PDF</fd-menu-item>
          </fd-split-button>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>Destructive action</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <fd-split-button variant="destructive">
            Delete
            <fd-menu-item slot="menu">Delete permanently</fd-menu-item>
            <fd-menu-item slot="menu">Archive instead</fd-menu-item>
          </fd-split-button>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>Disabled</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <fd-split-button variant="primary" disabled>
            Save
            <fd-menu-item slot="menu">Save as draft</fd-menu-item>
            <fd-menu-item slot="menu">Save &amp; submit for review</fd-menu-item>
          </fd-split-button>
        </div>
      </section>
    </div>
  `,
};
