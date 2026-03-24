import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type TextareaArgs = {
  id: string;
  label: string;
  description: string;
  name: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  rows: number;
  maxlength: number | undefined;
  autocomplete: string;
  messageState: string;
  messageText: string;
};

const renderTextarea = (args: TextareaArgs) => html`
  <div style="max-width: 328px;">
    <fd-label
      for=${args.id}
      label=${args.label}
      ?required=${args.required}
      description=${ifDefined(args.description || undefined)}
    ></fd-label>
    <fd-textarea
      id=${args.id}
      name=${ifDefined(args.name || undefined)}
      value=${ifDefined(args.value || undefined)}
      placeholder=${ifDefined(args.placeholder || undefined)}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      rows=${args.rows}
      maxlength=${ifDefined(args.maxlength ?? undefined)}
      autocomplete=${ifDefined(args.autocomplete || undefined)}
    ></fd-textarea>
    ${args.messageText
      ? html`<fd-message
          for=${args.id}
          state=${args.messageState}
          message=${args.messageText}
        ></fd-message>`
      : ""}
  </div>
`;

const meta = {
  title: "Components/Text Area",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    ...getComponentArgTypes("fd-textarea"),
    messageState: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
    messageText: { control: "text" },
  },
  args: {
    ...getComponentArgs("fd-textarea"),
    id: "case-details",
    label: "Case details",
    name: "case-details",
    description: "",
    messageState: "default",
    messageText: "",
  },
  render: renderTextarea,
} satisfies Meta<TextareaArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-textarea") as HTMLElement | null;
  expect(host).toBeDefined();
  expect(host?.shadowRoot?.querySelector("[part=base]")?.tagName).toBe("DIV");
  expect(host?.shadowRoot?.querySelector("[part=native]")?.tagName).toBe(
    "TEXTAREA",
  );
};

export const Default: Story = {};

export const WithLabelAndDescription: Story = {
  args: {
    id: "case-summary",
    label: "Case summary",
    name: "case-summary",
    description: "Summarize the issue in 2 to 4 sentences.",
    placeholder: "Include what happened, when it happened, and who was involved.",
  },
};

export const Required: Story = {
  args: {
    id: "explanation-required",
    label: "Explanation",
    name: "explanation",
    required: true,
    description: "Explain why you are requesting this exception.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Validation contract: the field can be internally invalid before it is visibly invalid. Submit, `reportValidity()`, or blur after interaction can reveal invalid styling; authored `fd-message` remains the user-facing error content.",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    id: "details-error",
    label: "Additional details",
    name: "details",
    required: true,
    value: "Too short",
    messageState: "error",
    messageText: "Provide at least 10 characters.",
  },
};

export const Disabled: Story = {
  args: {
    id: "details-disabled",
    label: "Internal notes",
    name: "details",
    value: "This field is disabled while the case is closed.",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    id: "details-readonly",
    label: "Original submission",
    name: "details",
    value:
      "Customer submitted this explanation on March 12 and cannot edit it after attestation.",
    readonly: true,
  },
};

export const WithCharacterCount: Story = {
  args: {
    id: "details-count",
    label: "Additional comments",
    name: "details",
    maxlength: 250,
    description: "Share any context that will help the reviewer understand your request.",
    placeholder: "Add supporting details here.",
  },
};

export const WithCharacterCountNearLimit: Story = {
  args: {
    id: "details-near-limit",
    label: "Reason for change",
    name: "details",
    maxlength: 120,
    value:
      "We corrected the mailing address after the original notice was returned and need the customer record updated before the next billing cycle.",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Default</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-textarea-default" label="Case details"></fd-label>
          <fd-textarea
            id="docs-textarea-default"
            name="details"
            placeholder="Describe what happened and when it happened."
          ></fd-textarea>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>With description</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-textarea-desc"
            label="Additional comments"
            description="Share any extra context that could help the reviewer."
          ></fd-label>
          <fd-textarea
            id="docs-textarea-desc"
            name="comments"
            placeholder="Add supporting details here."
          ></fd-textarea>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Error state</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-textarea-error"
            label="Explanation"
            required
          ></fd-label>
          <fd-textarea
            id="docs-textarea-error"
            name="explanation"
            required
            value="Too short"
          ></fd-textarea>
          <fd-message
            for="docs-textarea-error"
            state="error"
            message="Provide at least 10 characters."
          ></fd-message>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Character count</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-textarea-count"
            label="Additional comments"
          ></fd-label>
          <fd-textarea
            id="docs-textarea-count"
            name="comments"
            maxlength="250"
            placeholder="Share any additional context."
          ></fd-textarea>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Read-only</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-textarea-readonly"
            label="Original submission"
          ></fd-label>
          <fd-textarea
            id="docs-textarea-readonly"
            name="original"
            readonly
            value="Customer submitted this note before the case was escalated."
          ></fd-textarea>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Field composition</p>
        <fd-field>
          <fd-label
            label="Internal reviewer note"
            description="This note is visible to staff only."
          ></fd-label>
          <fd-textarea
            name="reviewer-note"
            maxlength="180"
            placeholder="Summarize the decision and next step."
          ></fd-textarea>
          <fd-message
            message="Keep internal notes factual and action-oriented."
            live="off"
          ></fd-message>
        </fd-field>
      </div>
    </div>
  `,
};
