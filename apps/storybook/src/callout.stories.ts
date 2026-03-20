import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type CalloutArgs = {
  variant: "default" | "info" | "warning" | "success" | "danger";
  content: string;
  label: string;
};

const variantClass = (v: string) =>
  v === "default" ? "" : ` prose-callout-${v}`;

const variantRole = (v: string) =>
  v === "danger" ? "status" : "note";

const meta = {
  title: "Prose/Callout",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "warning", "success", "danger"]
    },
    content: { control: "text" },
    label: { control: "text" }
  },
  args: {
    variant: "default",
    content:
      "Deposit insurance coverage is determined by the ownership category of the depositor's accounts, not by the number of accounts held.",
    label: "Tip"
  },
  render: (args: CalloutArgs) => html`
    <div
      class=${`prose-callout${variantClass(args.variant)}`}
      role=${variantRole(args.variant)}
      aria-label=${args.label}
    >
      <span class="prose-callout-icon" aria-hidden="true"></span>
      <div class="prose-callout-content">
        <p>${args.content}</p>
      </div>
    </div>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Info: Story = {
  args: {
    variant: "info",
    content:
      "The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.",
    label: "Information"
  }
};

export const Warning: Story = {
  args: {
    variant: "warning",
    content:
      "If your combined deposits at a single institution exceed $250,000, amounts above the limit may not be insured. Review your account ownership categories before the reporting deadline.",
    label: "Warning"
  }
};

export const Success: Story = {
  args: {
    variant: "success",
    content:
      "Your Call Report has been submitted and accepted. A confirmation number has been sent to the contact email on file.",
    label: "Success"
  }
};

export const Danger: Story = {
  args: {
    variant: "danger",
    content:
      "This action will permanently close the account and cannot be reversed. All associated records will be archived according to retention policy.",
    label: "Critical alert"
  }
};
