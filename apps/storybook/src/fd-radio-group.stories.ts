import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_STYLE,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

type RadioGroupArgs = {
  orientation: "vertical" | "horizontal";
  required: boolean;
  disabled: boolean;
  label: string;
  description: string;
  error: string;
};

const renderGroup = (args: RadioGroupArgs) => html`
  <fd-radio-group
    orientation=${args.orientation}
    ?required=${args.required}
    ?disabled=${args.disabled}
    label=${ifDefined(args.label || undefined)}
  >
    <span slot="legend">${args.label}</span>
    ${args.description
      ? html`<span slot="description">${args.description}</span>`
      : ""}
    <fd-radio name="contact" value="email" checked>Email</fd-radio>
    <fd-radio name="contact" value="phone">Phone</fd-radio>
    <fd-radio name="contact" value="mail">Physical mail</fd-radio>
    ${args.error ? html`<span slot="error">${args.error}</span>` : ""}
  </fd-radio-group>
`;

const meta = {
  title: "Components/Radio Group",
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
    label: "Preferred contact method",
    description: "",
    error: "Please select a contact method.",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Public event contract: `fd-radio-group-change` emits `{ value }`. Deprecated `fd-group-change` still fires with `{ selectedValue }` during the transition window. Validation contract: `checkValidity()` updates validity without showing an error; submit, `reportValidity()`, or focus leaving the group after interaction can reveal `data-user-invalid` and fieldset `aria-invalid`.",
      },
    },
  },
  render: renderGroup,
} satisfies Meta<RadioGroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-radio-group") as HTMLElement | null;
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
    <fd-radio-group disabled label="Account type">
      <span slot="legend">Account type</span>
      <fd-radio name="account" value="checking">Checking</fd-radio>
      <fd-radio name="account" value="savings">Savings</fd-radio>
      <fd-radio name="account" value="trust" disabled>
        Trust account (not available in your state)
      </fd-radio>
    </fd-radio-group>
  `,
};

export const FormValidation: Story = {
  render: () => html`
    <form style="display: grid; gap: 12px; max-width: 32rem;">
      <fd-radio-group required>
        <span slot="legend">Preferred contact method (required)</span>
        <span slot="description">Select how you would like to be contacted.</span>
        <fd-radio name="contact" value="email">Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
        <fd-radio name="contact" value="mail">Physical mail</fd-radio>
        <span slot="error">Please select a contact method.</span>
      </fd-radio-group>
      <fd-button type="submit">Submit</fd-button>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Submit the form to reveal the group error state. Choosing an option clears the visible invalid state immediately, and reset clears it as well. The authored error slot remains the primary visible error surface.",
      },
    },
  },
};

FormValidation.play = async ({ canvasElement, userEvent }) => {
  const form = canvasElement.querySelector("form");
  const group = form?.querySelector("fd-radio-group");
  const radio = form?.querySelector("fd-radio");
  const control = radio?.shadowRoot?.querySelector('input[type="radio"]') as
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
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>Vertical group</strong>
        <fd-radio-group>
          <span slot="legend">Preferred contact method</span>
          <fd-radio name="contact-v" value="email" checked>Email</fd-radio>
          <fd-radio name="contact-v" value="phone">Phone</fd-radio>
          <fd-radio name="contact-v" value="mail">Physical mail</fd-radio>
        </fd-radio-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>Long labels and disabled option</strong>
        <fd-radio-group>
          <span slot="legend">Account type</span>
          <fd-radio name="account" value="selected" checked>Selected option</fd-radio>
          <fd-radio name="account" value="short">Short label</fd-radio>
          <fd-radio name="account" value="long">
            A much longer label that provides an example of content wrapping to a second line
          </fd-radio>
          <fd-radio name="account" value="other">Another short label</fd-radio>
          <fd-radio name="account" value="disabled" disabled>Disabled option</fd-radio>
        </fd-radio-group>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong style=${DOCS_OVERVIEW_HEADING_STYLE}>Required group with description</strong>
        <fd-radio-group required>
          <span slot="legend">Preferred contact method (required)</span>
          <span slot="description">Select how you would like to be contacted.</span>
          <fd-radio name="contact-r" value="email">Email</fd-radio>
          <fd-radio name="contact-r" value="phone">Phone</fd-radio>
          <fd-radio name="contact-r" value="mail">Physical mail</fd-radio>
          <span slot="error">Please select a contact method.</span>
        </fd-radio-group>
      </section>
    </div>
  `,
};
