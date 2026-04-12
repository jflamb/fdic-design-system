import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

const meta = {
  title: "Supporting Primitives/Form Field",
  tags: ["autodocs"],
  render: () => html`
    <fd-form-field
      label="Routing number"
      description="Enter the 9-digit number used for this transfer report."
      error="Enter the 9-digit routing number."
      required
    >
      <fd-input name="routing-number" value="12345"></fd-input>
    </fd-form-field>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const GroupedControl: Story = {
  render: () => html`
    <fd-form-field
      label="Preferred follow-up method"
      description="Choose the method you monitor during the filing window."
      error="Select how we should contact you if a reviewer needs clarification."
      required
      invalid
    >
      <fd-radio-group>
        <fd-radio name="contact-method" value="email">Email</fd-radio>
        <fd-radio name="contact-method" value="phone">Phone</fd-radio>
        <fd-radio name="contact-method" value="secure-message">
          Secure message
        </fd-radio>
      </fd-radio-group>
    </fd-form-field>
  `,
};

export const FileInput: Story = {
  render: () => html`
    <fd-form-field
      label="Supporting document"
      description="Upload the signed filing support letter."
      error="Select a file before you continue."
      required
      invalid
    >
      <fd-file-input name="supporting-document"></fd-file-input>
    </fd-form-field>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Text-entry shell</p>
        <fd-form-field
          label="Routing number"
          description="Enter the 9-digit number used for this transfer report."
          error="Enter the 9-digit routing number."
          required
        >
          <fd-input name="routing-number" value="12345"></fd-input>
        </fd-form-field>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Grouped-control shell</p>
        <fd-form-field
          label="Preferred follow-up method"
          description="Choose the method you monitor during the filing window."
          error="Select how we should contact you if a reviewer needs clarification."
          required
          invalid
        >
          <fd-radio-group>
            <fd-radio name="contact-method" value="email">Email</fd-radio>
            <fd-radio name="contact-method" value="phone">Phone</fd-radio>
            <fd-radio name="contact-method" value="secure-message">
              Secure message
            </fd-radio>
          </fd-radio-group>
        </fd-form-field>
      </div>
    </div>
  `,
};
