import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type MeterArgs = {
  value: number;
  min: number;
  max: number;
  low: number;
  high: number;
  optimum: number;
  label: string;
  valueText: string;
};

const meta = {
  title: "Prose/Meter",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 20, step: 0.1 } },
    min: { control: "number" },
    max: { control: "number" },
    low: { control: "number" },
    high: { control: "number" },
    optimum: { control: "number" },
    label: { control: "text" },
    valueText: { control: "text" }
  },
  args: {
    value: 12.4,
    min: 0,
    max: 20,
    low: 4,
    high: 5,
    optimum: 10,
    label: "Tier 1 leverage ratio",
    valueText: "12.4% (well-capitalized)"
  },
  render: (args: MeterArgs) => html`
    <div class="prose-progress-group">
      <label for="story-meter">${args.label}</label>
      <meter
        id="story-meter"
        value=${args.value}
        min=${args.min}
        max=${args.max}
        low=${args.low}
        high=${args.high}
        optimum=${args.optimum}
        aria-label=${`${args.label}: ${args.valueText}`}
      >${args.valueText}</meter>
      <span class="prose-progress-value">${args.valueText}</span>
    </div>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
