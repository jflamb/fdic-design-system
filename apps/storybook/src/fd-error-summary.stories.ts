import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import type { ErrorSummaryItem } from "../../../packages/components/src/components/fd-error-summary";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

const defaultItems: ErrorSummaryItem[] = [
  {
    href: "#routing-number",
    text: "Enter the 9-digit routing number.",
  },
  {
    href: "#contact-method-group",
    text: "Select how we should contact you if a reviewer needs clarification.",
  },
];

const meta = {
  title: "Supporting Primitives/Error Summary",
  tags: ["autodocs"],
  render: () => html`
    <fd-error-summary
      .items=${defaultItems}
      heading="Fix the following before you continue"
      intro="Review each item and return to the linked field or group."
      open
    ></fd-error-summary>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AutofocusHeading: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <fd-error-summary
        .items=${defaultItems}
        heading="Fix the following before you continue"
        intro="Review each item and return to the linked field or group."
        focus-target="heading"
        autofocus
        open
      ></fd-error-summary>
    </div>
  `,
};

AutofocusHeading.play = async ({ canvasElement }) => {
  const summary = canvasElement.querySelector("fd-error-summary") as HTMLElement | null;

  await waitFor(() => {
    expect(summary?.shadowRoot?.activeElement?.getAttribute("part")).toBe("heading");
  });
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Blocked submit navigation</p>
        <fd-error-summary
          .items=${defaultItems}
          heading="Fix the following before you continue"
          intro="Review each item and return to the linked field or group."
          open
        ></fd-error-summary>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Focus behavior</p>
        <p style="margin: 0;">
          Use <code>autofocus</code> after a blocked submit when keyboard and
          screen-reader users need immediate confirmation that submission
          failed. Keep the linked inline field or group errors visible at the
          correction point.
        </p>
      </div>
    </div>
  `,
};
