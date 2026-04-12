import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, userEvent, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type CheckboxArgs = {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
  label: string;
  description: string;
};

const renderCheckbox = (args: CheckboxArgs) => html`
  <fd-checkbox
    ?checked=${args.checked}
    ?indeterminate=${args.indeterminate}
    ?disabled=${args.disabled}
    ?required=${args.required}
    name=${ifDefined(args.name || undefined)}
    value=${ifDefined(args.value || undefined)}
  >
    ${args.label}
    ${args.description
      ? html`<span slot="description">${args.description}</span>`
      : ""}
  </fd-checkbox>
`;

const meta = {
  title: "Components/Checkbox",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    value: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    name: "consent",
    value: "yes",
    label: "Email me account updates",
    description: "",
  },
  render: renderCheckbox,
} satisfies Meta<CheckboxArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-checkbox") as HTMLElement | null;
  const input = host?.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement | undefined;

  expect(host).toBeDefined();
  expect(input?.type).toBe("checkbox");
};

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, label: "Selected option" },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Select all accounts" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled option" },
};

export const WithDescription: Story = {
  args: {
    label: "Allow partner data sharing",
    description: "Your information may be shared with other federal agencies as permitted under the Privacy Act.",
  },
};

export const Required: Story = {
  args: {
    required: true,
    label: "I agree to the terms and conditions",
    name: "terms",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Validation lifecycle: the checkbox stays internally invalid until submit/reportValidity or blur after interaction reveals the invalid state. Once checked, invalid styling clears automatically.",
      },
    },
  },
};

export const FormIntegration: Story = {
  render: () => html`
    <form style="display: grid; gap: 12px; max-width: 28rem;">
      <fd-checkbox name="terms" required>
        I agree to the terms and conditions
      </fd-checkbox>
      <fd-checkbox name="updates" checked>
        Email me account updates
      </fd-checkbox>
      <fd-button type="submit">Submit</fd-button>
    </form>
  `,
};

export const ValidationLifecycle: Story = {
  render: () => html`
    <form style="display: grid; gap: 12px; max-width: 28rem;">
      <fd-checkbox name="terms" required>
        I agree to the terms and conditions
      </fd-checkbox>
      <fd-button type="submit">Submit</fd-button>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Submit reveals the visible invalid state for an unchecked required checkbox. Checking the box clears the invalid styling and `aria-invalid` immediately.",
      },
    },
  },
};

ValidationLifecycle.play = async ({ canvasElement }) => {
  const form = canvasElement.querySelector("form") as HTMLFormElement | null;
  const checkboxHost = form?.querySelector("fd-checkbox") as HTMLElement | null;
  const checkboxInput = checkboxHost?.shadowRoot?.querySelector('input[type="checkbox"]') as
    | HTMLInputElement
    | null;

  expect(checkboxHost?.hasAttribute("data-user-invalid")).toBe(false);

  form?.requestSubmit();

  await waitFor(() => {
    expect(checkboxHost?.hasAttribute("data-user-invalid")).toBe(true);
    expect(checkboxInput?.getAttribute("aria-invalid")).toBe("true");
  });

  await userEvent.click(checkboxInput!);

  await waitFor(() => {
    expect(checkboxHost?.hasAttribute("data-user-invalid")).toBe(false);
    expect(checkboxInput?.getAttribute("aria-invalid")).toBeNull();
  });
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default and checked</strong>
        <div style="display: grid; gap: 12px;">
          <fd-checkbox>Short label</fd-checkbox>
          <fd-checkbox checked>Selected option</fd-checkbox>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Description and indeterminate</strong>
        <div style="display: grid; gap: 12px;">
          <fd-checkbox indeterminate>Select all accounts</fd-checkbox>
          <fd-checkbox>
            Allow partner data sharing
            <span slot="description">
              Your information may be shared with other federal agencies as permitted under the Privacy Act.
            </span>
          </fd-checkbox>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Disabled state</strong>
        <fd-checkbox disabled>Disabled option</fd-checkbox>
      </section>
    </div>
  `,
};
