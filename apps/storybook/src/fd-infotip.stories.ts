import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

const meta = {
  title: "Supporting Primitives/Infotip",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-infotip"),
  },
  args: {
    ...getComponentArgs("fd-infotip"),
    text: "A beneficial owner is any individual who owns 25% or more of the legal entity, or who controls the entity.",
    label: "More information about beneficial owner",
  },
  render: (args) => html`
    <fd-infotip
      text=${args.text}
      label=${args.label}
      trigger=${args.trigger}
      href=${args.href}
      variant=${args.variant}
      mode=${args.mode}
      ?open=${args.open}
    ></fd-infotip>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InlineFootnote: Story = {
  args: {
    text: 'Federal Deposit Insurance Corporation. "Deposit Insurance FAQs." Coverage limits were last adjusted by the Dodd-Frank Act of 2010.',
    label: "Footnote 1",
    trigger: "1",
    href: "#fn1",
    variant: "inline",
    mode: "hover-focus",
  },
  render: (args) => html`
    <p>
      Deposit insurance coverage applies per depositor, per insured bank.<sup
        ><fd-infotip
          text=${args.text}
          label=${args.label}
          trigger=${args.trigger}
          href=${args.href}
          variant=${args.variant}
          mode=${args.mode}
        ></fd-infotip
      ></sup>
    </p>
    <section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
      <hr />
      <ol>
        <li id="fn1">
          <p>
            Federal Deposit Insurance Corporation. "Deposit Insurance FAQs."
            Coverage limits were last adjusted by the Dodd-Frank Act of 2010.
            <a href="#ref1" role="doc-backlink" aria-label="Back to footnote reference 1">&#x21a9; Back</a>
          </p>
        </li>
      </ol>
    </section>
  `,
};
