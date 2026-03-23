import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_STYLE,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

type SelectorArgs = {
  variant: "simple" | "single" | "multiple";
  label: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  description: string;
  error: string;
};

const ACCOUNT_OPTIONS = html`
  <fd-option value="checking">Checking</fd-option>
  <fd-option value="savings">Savings</fd-option>
  <fd-option value="cd" description="Fixed-term deposit with guaranteed rate"
    >Certificate of Deposit</fd-option
  >
  <fd-option value="mma">Money Market Account</fd-option>
  <fd-option value="ira" description="Tax-advantaged retirement account"
    >Individual Retirement Account</fd-option
  >
`;

const renderSelector = (args: SelectorArgs) => html`
  <fd-selector
    variant=${args.variant}
    label=${ifDefined(args.label || undefined)}
    placeholder=${ifDefined(args.placeholder || undefined)}
    ?required=${args.required}
    ?disabled=${args.disabled}
  >
    ${args.description
      ? html`<span slot="description">${args.description}</span>`
      : nothing}
    ${ACCOUNT_OPTIONS}
    ${args.error ? html`<span slot="error">${args.error}</span>` : nothing}
  </fd-selector>
`;

const meta = {
  title: "Components/Selector",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["simple", "single", "multiple"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    description: { control: "text" },
    error: { control: "text" },
  },
  args: {
    variant: "simple",
    label: "Account type",
    placeholder: "Select\u2026",
    required: false,
    disabled: false,
    description: "",
    error: "",
  },
  render: renderSelector,
} satisfies Meta<SelectorArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-selector") as HTMLElement | null;
  const trigger = host?.shadowRoot?.querySelector(
    "[part=trigger]",
  ) as HTMLElement | null;

  expect(host).toBeDefined();
  expect(trigger?.tagName).toBe("BUTTON");
};

export const Simple: Story = {
  args: {
    variant: "simple",
    description: "Choose from a basic dropdown list.",
  },
};

export const SingleSelect: Story = {
  args: {
    variant: "single",
    label: "Primary account",
    description: "Radio indicators show only one option can be selected.",
  },
};

export const MultipleSelect: Story = {
  args: {
    variant: "multiple",
    label: "Report categories",
    placeholder: "Select one or more\u2026",
    description: "Checkbox indicators show multiple options can be selected.",
  },
};

export const WithDescriptions: Story = {
  args: {
    variant: "single",
    label: "Account type",
    description: "Options include additional context to help your decision.",
  },
};

export const FormValidation: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        const output = form.querySelector("#result") as HTMLElement;
        output.textContent = JSON.stringify(Object.fromEntries(data.entries()));
      }}
      style="display: grid; gap: 1rem; max-width: 20rem;"
    >
      <fd-selector
        label="Account type"
        name="account"
        variant="single"
        required
      >
        <span slot="description">This field is required.</span>
        <fd-option value="checking">Checking</fd-option>
        <fd-option value="savings">Savings</fd-option>
        <fd-option value="cd">Certificate of Deposit</fd-option>
      </fd-selector>

      <div style="display: flex; gap: 0.5rem;">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <pre id="result" style="font-size: 0.875rem; margin: 0;"></pre>
    </form>
  `,
};

export const Disabled: Story = {
  args: {
    variant: "single",
    label: "Account type",
    disabled: true,
  },
};

export const DisabledOptions: Story = {
  render: () => html`
    <fd-selector label="Account type" variant="single">
      <fd-option value="checking">Checking</fd-option>
      <fd-option value="savings" disabled>Savings (unavailable)</fd-option>
      <fd-option value="cd">Certificate of Deposit</fd-option>
    </fd-selector>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Simple variant</p>
        <fd-selector label="Account type" variant="simple">
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings">Savings</fd-option>
          <fd-option value="cd">Certificate of Deposit</fd-option>
        </fd-selector>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Single variant (radio indicators)</p>
        <fd-selector label="Primary account" variant="single">
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings">Savings</fd-option>
          <fd-option value="cd">Certificate of Deposit</fd-option>
        </fd-selector>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>
          Multiple variant (checkbox indicators)
        </p>
        <fd-selector
          label="Report categories"
          variant="multiple"
          placeholder="Select one or more\u2026"
        >
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings">Savings</fd-option>
          <fd-option value="cd" description="Fixed-term deposit"
            >Certificate of Deposit</fd-option
          >
        </fd-selector>
      </div>
    </div>
  `,
};
