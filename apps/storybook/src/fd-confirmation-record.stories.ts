import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

const meta = {
  title: "Supporting Primitives/Confirmation Record",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  render: () => html`
    <fd-confirmation-record
      heading="Filing update received"
      summary="We received the filing update and assigned a confirmation number."
      reference-label="Confirmation number"
      reference-value="CMS-2026-004182"
      next-steps="A reviewer will email the filing contact if clarification is needed."
      record-note="Keep this number until the filing review is complete."
    >
      <a slot="actions" href="/print">Print confirmation</a>
      <a slot="actions" href="/dashboard">Return to dashboard</a>
    </fd-confirmation-record>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PendingReceipt: Story = {
  render: () => html`
    <fd-confirmation-record
      heading="Submission received and pending review"
      summary="We received the filing update. The confirmation number below stays valid while the request is reviewed."
      reference-label="Receipt number"
      reference-value="CMS-2026-004182"
      next-steps="Review typically takes 2 business days. We will email the filing contact when the decision is ready."
      record-note="Keep this receipt number until the review is complete."
      variant="receipt"
      status="pending"
    >
      <a slot="actions" href="/print">Print receipt</a>
    </fd-confirmation-record>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Completion and record-keeping</p>
        <fd-confirmation-record
          heading="Filing update received"
          summary="We received the filing update and assigned a confirmation number."
          reference-label="Confirmation number"
          reference-value="CMS-2026-004182"
          next-steps="A reviewer will email the filing contact if clarification is needed."
          record-note="Keep this number until the filing review is complete."
        >
          <a slot="actions" href="/print">Print confirmation</a>
          <a slot="actions" href="/dashboard">Return to dashboard</a>
        </fd-confirmation-record>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Actions remain authored</p>
        <p style="margin: 0;">
          Use the <code>actions</code> slot for print, download, dashboard, or
          follow-up links. Keep business rules and routing outside the
          component.
        </p>
      </div>
    </div>
  `,
};
