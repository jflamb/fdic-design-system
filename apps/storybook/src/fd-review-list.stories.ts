import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@jflamb/fdic-ds-components/register-all";
import type { ReviewListItem } from "../../../packages/components/src/components/fd-review-list";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

const reviewItems: ReviewListItem[] = [
  {
    label: "Institution name",
    value: "First Community Bank",
    href: "#institution-name",
    changeLabel: "Change institution name",
  },
  {
    label: "Certificate number",
    value: "12345",
    href: "#certificate-number",
  },
  {
    label: "Follow-up method",
    value: "Secure message",
    href: "#contact-method",
  },
];

const meta = {
  title: "Supporting Primitives/Review List",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  render: () => html`
    <fd-review-list
      heading="Review the information before you submit"
      .items=${reviewItems}
      dividers
    ></fd-review-list>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Compact: Story = {
  render: () => html`
    <fd-review-list
      heading="Review the information before you submit"
      density="compact"
      .items=${reviewItems}
      dividers
    ></fd-review-list>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Review-before-submit</p>
        <fd-review-list
          heading="Review the information before you submit"
          .items=${reviewItems}
          dividers
        ></fd-review-list>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Change actions stay explicit</p>
        <p style="margin: 0;">
          Use change links only when the workflow supports returning to the
          authored editing step. Keep the review list focused on label, value,
          and optional change action semantics.
        </p>
      </div>
    </div>
  `,
};
