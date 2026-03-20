import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type ProgressArgs = {
  value: number;
  max: number;
  label: string;
  valueText: string;
};

const meta = {
  title: "Prose/Progress",
  tags: ["autodocs"],
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
