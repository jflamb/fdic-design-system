import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type AsideArgs = {
  content: string;
  label: string;
};

const meta = {
  title: "Prose/Aside",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    content: { control: "text" },
    label: { control: "text" }
  },
  args: {
    content:
      "The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.",
    label: "Key fact about deposit insurance"
  },
  render: (args: AsideArgs) => html`
    <p>
      When evaluating deposit insurance coverage, it is important to understand
      how the FDIC categorizes account ownership. Each ownership category —
      single accounts, joint accounts, revocable trust accounts, and certain
      retirement accounts — is insured separately up to the standard maximum
      amount.
    </p>
    <aside aria-label=${args.label}>
      <p>${args.content}</p>
    </aside>
    <p>
      This means a depositor with accounts in multiple ownership categories at
      the same insured bank can potentially be insured for more than $250,000 in
      total. For example, funds in a single account, a joint account, and an IRA
      at the same bank are each insured separately.
    </p>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
