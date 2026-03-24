import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

const meta = {
  title: "Supporting Primitives/Field",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`fd-field` is a supporting composition primitive. It has no public attributes or events of its own; its contract is direct-child auto-wiring for one `fd-label`, one `fd-input`, and one `fd-message`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AutoWiring: Story = {
  render: () => html`
    <fd-field style="max-width: 22rem;">
      <fd-label
        label="Email address"
        required
        description="We'll use this address for filing follow-up."
      ></fd-label>
      <fd-input
        name="email"
        type="email"
        required
        placeholder="you@example.gov"
      ></fd-input>
      <fd-message
        state="error"
        message="Enter a valid email address."
      ></fd-message>
    </fd-field>
  `,
};

AutoWiring.play = async ({ canvasElement }) => {
  const field = canvasElement.querySelector("fd-field") as HTMLElement | null;
  const input = field?.querySelector("fd-input") as HTMLElement | null;
  const label = field?.querySelector("fd-label") as HTMLElement | null;
  const message = field?.querySelector("fd-message") as HTMLElement | null;

  expect(input?.id.startsWith("fd-field-")).toBe(true);
  expect(label?.getAttribute("for")).toBe(input?.id);
  expect(message?.getAttribute("for")).toBe(input?.id);
};

export const PreservesExplicitId: Story = {
  render: () => html`
    <fd-field style="max-width: 22rem;">
      <fd-label label="Account number"></fd-label>
      <fd-input id="field-explicit-account" name="account"></fd-input>
      <fd-message
        message="Use the number exactly as shown on the statement."
      ></fd-message>
    </fd-field>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "If the input already has an ID, `fd-field` preserves it and wires the matching `for` attributes to that existing value.",
      },
    },
  },
};

export const DirectChildrenOnly: Story = {
  render: () => html`
    <fd-field style="max-width: 22rem;">
      <fd-label label="Search institutions"></fd-label>
      <div>
        <fd-input placeholder="Nested inputs are not auto-wired"></fd-input>
      </div>
      <fd-message
        message="Wrap children only when you plan to wire the relationships yourself."
      ></fd-message>
    </fd-field>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "`fd-field` only discovers direct children. If you nest the input inside another wrapper element, the field no longer owns the relationship.",
      },
    },
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Auto-wiring</p>
        <fd-field style="max-width: 22rem;">
          <fd-label label="Routing number" required></fd-label>
          <fd-input placeholder="e.g. 021000021" required></fd-input>
          <fd-message
            state="error"
            message="Enter a valid 9-digit routing number."
          ></fd-message>
        </fd-field>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Preserves explicit IDs</p>
        <fd-field style="max-width: 22rem;">
          <fd-label label="Certificate number"></fd-label>
          <fd-input
            id="fd-field-docs-cert"
            value="CERT-2024-00847"
            readonly
          ></fd-input>
          <fd-message
            message="Read-only values still keep their explicit authored IDs."
          ></fd-message>
        </fd-field>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Supporting primitive role</p>
        <p>
          Use <code>fd-field</code> when you want the label, input, and message
          relationship wired for you. Use direct child components when you need
          a different layout or different child types.
        </p>
      </div>
    </div>
  `,
};
