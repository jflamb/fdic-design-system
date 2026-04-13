import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { DOCS_OVERVIEW_STACK_STYLE } from "./docs-overview";

type ProgressArgs = {
  value: number;
  max: number;
  label: string;
  valueText: string;
};

const meta = {
  title: "Prose/Progress",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 5, step: 1 } },
    max: { control: "number" },
    label: { control: "text" },
    valueText: { control: "text" }
  },
  args: {
    value: 3,
    max: 5,
    label: "Application completion",
    valueText: "3 of 5 steps (60%)"
  },
  render: (args: ProgressArgs) => html`
    <div class="prose-progress-group">
      <label for="story-progress">${args.label}</label>
      <progress
        id="story-progress"
        value=${args.value}
        max=${args.max}
        aria-label=${`${args.label}: ${args.valueText}`}
      >${args.valueText}</progress>
      <span class="prose-progress-value">${args.valueText}</span>
    </div>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
  render: () => html`
    <div class="prose-progress-group">
      <label for="story-progress-ind">Validating filing data</label>
      <progress
        id="story-progress-ind"
        aria-label="Validating filing data"
      >Processing...</progress>
      <span class="prose-progress-value">Processing...</span>
    </div>
  `
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div class="prose-progress-group">
        <label for="docs-progress-determinate">Call report review</label>
        <progress
          id="docs-progress-determinate"
          value="3"
          max="5"
          aria-label="Call report review: 3 of 5 review steps complete (60%)"
        >3 of 5 review steps complete (60%)</progress>
        <span class="prose-progress-value">3 of 5 review steps complete (60%)</span>
      </div>

      <div class="prose-progress-group">
        <label for="docs-progress-indeterminate">Validating filing data</label>
        <progress
          id="docs-progress-indeterminate"
          aria-label="Validating filing data"
        >Processing...</progress>
        <span class="prose-progress-value">Processing...</span>
      </div>

      <div class="prose-progress-group">
        <label for="docs-meter">Tier 1 leverage ratio</label>
        <meter
          id="docs-meter"
          value="12.4"
          min="0"
          max="20"
          low="4"
          high="5"
          optimum="10"
          aria-label="Tier 1 leverage ratio: 12.4% (well-capitalized)"
        >12.4% (well-capitalized)</meter>
        <span class="prose-progress-value">12.4% (well-capitalized)</span>
      </div>
    </div>
  `
};
