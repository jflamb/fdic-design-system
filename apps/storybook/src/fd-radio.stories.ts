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

type RadioArgs = {
  checked: boolean;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
  label: string;
  description: string;
};

const renderRadio = (args: RadioArgs) => html`
  <fd-radio
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    ?required=${args.required}
    name=${ifDefined(args.name || undefined)}
    value=${ifDefined(args.value || undefined)}
  >
    ${args.label}
    ${args.description
      ? html`<span slot="description">${args.description}</span>`
      : ""}
  </fd-radio>
`;

const meta = {
  title: "Components/Radio",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    value: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
    name: "contact",
    value: "email",
    label: "Email",
    description: "",
  },
  render: renderRadio,
} satisfies Meta<RadioArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-radio") as HTMLElement | null;
  const input = host?.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement | undefined;

  expect(host).toBeDefined();
  expect(input?.type).toBe("radio");
};

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, label: "Phone" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Mail" },
};

export const WithDescription: Story = {
  args: {
    label: "Paper mail",
    value: "mail",
    description: "Use this when the customer does not have reliable internet access.",
  },
};

export const Required: Story = {
  render: () => html`
    <form style="display: grid; gap: 12px; max-width: 28rem;">
      <fieldset
        role="radiogroup"
        style="border: none; margin: 0; padding: 0; display: grid; gap: 12px;"
      >
        <legend style="font-weight: 600;">Preferred contact method</legend>
        <fd-radio name="contact" value="email" required>Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
        <fd-radio name="contact" value="mail">Paper mail</fd-radio>
      </fieldset>
      <fd-button type="submit">Submit</fd-button>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Validation lifecycle: `checkValidity()` updates validity without showing an error. Submit, `reportValidity()`, or blur after interaction reveals invalid state only when no radio is selected. A valid selection clears the visible invalid state and `aria-invalid` automatically.",
      },
    },
  },
};

Required.play = async ({ canvasElement }) => {
  const form = canvasElement.querySelector("form") as HTMLFormElement | null;
  const radioHost = form?.querySelector("fd-radio") as HTMLElement | null;
  const radioInput = radioHost?.shadowRoot?.querySelector('input[type="radio"]') as
    | HTMLInputElement
    | null;

  expect(radioHost?.hasAttribute("data-user-invalid")).toBe(false);

  form?.requestSubmit();

  await waitFor(() => {
    expect(radioHost?.hasAttribute("data-user-invalid")).toBe(true);
    expect(radioInput?.getAttribute("aria-invalid")).toBe("true");
  });

  await userEvent.click(radioInput!);

  await waitFor(() => {
    expect(radioHost?.hasAttribute("data-user-invalid")).toBe(false);
    expect(radioInput?.getAttribute("aria-invalid")).toBeNull();
  });
};

export const FormIntegration: Story = {
  render: () => html`
    <form style="display: grid; gap: 16px; max-width: 28rem;">
      <fieldset
        role="radiogroup"
        style="border: none; margin: 0; padding: 0; display: grid; gap: 12px;"
      >
        <legend style="font-weight: 600;">Preferred contact method</legend>
        <fd-radio name="contact" value="email" checked>Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
        <fd-radio name="contact" value="mail">Paper mail</fd-radio>
      </fieldset>
      <fd-button type="submit">Submit</fd-button>
    </form>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default and selected</strong>
        <div style="display: grid; gap: 12px;">
          <fd-radio name="contact-default" value="email">Email</fd-radio>
          <fd-radio name="contact-default" value="phone" checked>Phone</fd-radio>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Description</strong>
        <fd-radio name="delivery" value="mail">
          Paper mail
          <span slot="description">
            Use this when the customer does not have reliable internet access.
          </span>
        </fd-radio>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Disabled state</strong>
        <div style="display: grid; gap: 12px;">
          <fd-radio name="disabled-contact" value="email" disabled>Email</fd-radio>
          <fd-radio name="disabled-contact" value="phone" checked disabled>Phone</fd-radio>
        </div>
      </section>
    </div>
  `,
};
