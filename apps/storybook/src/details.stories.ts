import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type DetailsArgs = {
  summary: string;
  content: string;
  open: boolean;
};

const meta = {
  title: "Prose/Details",
  tags: ["autodocs"],
  argTypes: {
    summary: { control: "text" },
    content: { control: "text" },
    open: { control: "boolean" }
  },
  args: {
    summary: "What is FDIC deposit insurance?",
    content:
      "The Federal Deposit Insurance Corporation (FDIC) insures deposits at member banks up to $250,000 per depositor, per insured bank, for each account ownership category.",
    open: false
  },
  render: (args: DetailsArgs) => html`
    <details ?open=${args.open}>
      <summary>${args.summary}</summary>
      <p>${args.content}</p>
    </details>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FaqGroup: Story = {
  render: () => html`
    <details>
      <summary>What is FDIC deposit insurance?</summary>
      <p>The Federal Deposit Insurance Corporation (FDIC) insures deposits at member banks up to $250,000 per depositor, per insured bank, for each account ownership category.</p>
    </details>
    <details>
      <summary>What types of accounts are insured?</summary>
      <p>FDIC insurance covers checking accounts, savings accounts, money market deposit accounts, and certificates of deposit (CDs) at insured institutions.</p>
    </details>
    <details>
      <summary>Are joint accounts insured separately?</summary>
      <p>Yes. Joint accounts are insured separately from single-ownership accounts. Each co-owner's share is insured up to $250,000.</p>
    </details>
  `
};
