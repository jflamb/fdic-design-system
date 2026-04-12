import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type CheckboxGroupArgs = {
  orientation: "vertical" | "horizontal";
  required: boolean;
  disabled: boolean;
  label: string;
  description: string;
  error: string;
};

const renderGroup = (args: CheckboxGroupArgs) => html`
  <fd-checkbox-group
    orientation=${args.orientation}
    ?required=${args.required}
    ?disabled=${args.disabled}
    label=${ifDefined(args.label || undefined)}
  >
    <span slot="legend">${args.label}</span>
    ${args.description
      ? html`<span slot="description">${args.description}</span>`
      : ""}
    <fd-checkbox name="contact" value="email" checked>Email</fd-checkbox>
    <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
    <fd-checkbox name="contact" value="mail">Physical mail</fd-checkbox>
    ${args.error ? html`<span slot="error">${args.error}</span>` : ""}
  </fd-checkbox-group>
`;

const meta = {
  title: "Components/Checkbox Group",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
  },
  args: {
    orientation: "vertical",
    required: false,
    disabled: false,
    label: "Communication preferences",
    description: "",
    error: "Please select at least one contact method.",
  },
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "Public event contract: `fd-checkbox-group-change` emits `{ value, values }`, where `value` mirrors the first selected value in DOM order. Deprecated `fd-group-change` still fires with `{ checkedValues }` during the transition window. Validation contract: `checkValidity()` updates validity without showing an error; submit, `reportValidity()`, or focus leaving the group after interaction can reveal `data-user-invalid` and fieldset `aria-invalid`.",
      },
    },
  },
  render: renderGroup,
} satisfies Meta<CheckboxGroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-checkbox-group") as HTMLElement | null;
  const fieldset = host?.shadowRoot?.querySelector("fieldset") as HTMLFieldSetElement | undefined;

  expect(host).toBeDefined();
  expect(fieldset?.tagName).toBe("FIELDSET");
};

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
};

export const Required: Story = {
  args: {
    required: true,
    description: "Select how you would like to be contacted.",
  },
};

export const DisabledGroup: Story = {
  render: () => html`
    <fd-checkbox-group disabled label="Account types">
      <span slot="legend">Account types</span>
      <fd-checkbox name="account" value="checking">Checking</fd-checkbox>
      <fd-checkbox name="account" value="savings">Savings</fd-checkbox>
      <fd-checkbox name="account" value="trust" disabled>
        Trust account (not available in your state)
      </fd-checkbox>
    </fd-checkbox-group>
  `,
};

export const FormValidation: Story = {
  render: () => html`
    <form style="display: grid; gap: 12px; max-width: 32rem;">
      <fd-checkbox-group required>
        <span slot="legend">Communication preferences (required)</span>
        <span slot="description">Select at least one option.</span>
        <fd-checkbox name="contact" value="email">Email</fd-checkbox>
        <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
        <fd-checkbox name="contact" value="mail">Physical mail</fd-checkbox>
        <span slot="error">Please select at least one contact method.</span>
      </fd-checkbox-group>
      <button type="submit">Submit</button>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Submit the form to reveal the group error state. The fieldset keeps invalid styling until at least one checkbox is selected or the form is reset, and authored error content remains the primary visible error surface.",
      },
    },
  },
};

FormValidation.play = async ({ canvasElement, userEvent }) => {
  const form = canvasElement.querySelector("form");
  const group = form?.querySelector("fd-checkbox-group");
  const checkbox = form?.querySelector("fd-checkbox");
  const control = checkbox?.shadowRoot?.querySelector('input[type="checkbox"]') as
    | HTMLInputElement
    | null;

  form?.requestSubmit();

  await waitFor(() => {
    expect(group?.hasAttribute("data-user-invalid")).toBe(true);
  });

  await userEvent.click(control!);

  await waitFor(() => {
    expect(group?.hasAttribute("data-user-invalid")).toBe(false);
  });
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Vertical group</strong>
        <fd-checkbox-group>
          <span slot="legend">Communication preferences</span>
          <fd-checkbox name="contact" value="email" checked>Email</fd-checkbox>
          <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
          <fd-checkbox name="contact" value="mail">Physical mail</fd-checkbox>
        </fd-checkbox-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Long labels and disabled option</strong>
        <fd-checkbox-group>
          <span slot="legend">Account types</span>
          <fd-checkbox name="account" value="selected" checked>Selected option</fd-checkbox>
          <fd-checkbox name="account" value="short">Short label</fd-checkbox>
          <fd-checkbox name="account" value="long">
            A much longer label that provides an example of content wrapping to a second line
          </fd-checkbox>
          <fd-checkbox name="account" value="other">Another short label</fd-checkbox>
          <fd-checkbox name="account" value="disabled" disabled>Disabled option</fd-checkbox>
        </fd-checkbox-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Required group with description</strong>
        <fd-checkbox-group required>
          <span slot="legend">Communication preferences (required)</span>
          <span slot="description">Select how you would like to be contacted.</span>
          <fd-checkbox name="contact" value="email">Email</fd-checkbox>
          <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
          <fd-checkbox name="contact" value="mail">Physical mail</fd-checkbox>
          <span slot="error">Please select at least one contact method.</span>
        </fd-checkbox-group>
      </section>
    </div>
  `,
};
