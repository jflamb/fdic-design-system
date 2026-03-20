import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
  title: "Prose/Footnotes",
  tags: ["autodocs"],
  args: {},
  render: () => html`
    <p>
      Deposit insurance covers up to $250,000 per depositor, per insured bank,
      for each account ownership category.<sup><a href="#fn1" id="ref1" role="doc-noteref">[1]</a></sup>
      Joint accounts receive separate coverage from single-ownership
      accounts.<sup><a href="#fn2" id="ref2" role="doc-noteref">[2]</a></sup>
    </p>

    <section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
      <hr />
      <ol>
        <li id="fn1" role="doc-footnote">
          Federal Deposit Insurance Corporation. "Deposit Insurance FAQs."
          Coverage limits were last adjusted by the Dodd-Frank Act of 2010.
          <a href="#ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
        </li>
        <li id="fn2" role="doc-footnote">
          12 C.F.R. Part 330 governs the general rules for deposit insurance
          coverage.
          <a href="#ref2" role="doc-backlink" title="Back to reference">&#x21a9;</a>
        </li>
      </ol>
    </section>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
