import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@jflamb/fdic-ds-components/register-all";

const meta = {
  title: "Prose/Footnotes",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  args: {},
  render: () => html`
    <article style="max-width: var(--prose-max-width, 65ch);">
      <p>
        Deposit insurance covers up to $250,000 per depositor, per insured bank,
        for each account ownership category.<sup id="ref1"><fd-infotip
          text='Federal Deposit Insurance Corporation. "Deposit Insurance FAQs." Coverage limits were last adjusted by the Dodd-Frank Act of 2010.'
          label="Footnote 1"
          trigger="1"
          href="#fn1"
          variant="inline"
          mode="hover-focus"
        ></fd-infotip></sup>
        Joint accounts receive separate coverage from single-ownership
        accounts.<sup id="ref2"><fd-infotip
          text="12 C.F.R. Part 330 governs the general rules for deposit insurance coverage."
          label="Footnote 2"
          trigger="2"
          href="#fn2"
          variant="inline"
          mode="hover-focus"
        ></fd-infotip></sup>
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
          <li id="fn2">
            <p>
              12 C.F.R. Part 330 governs the general rules for deposit insurance
              coverage.
              <a href="#ref2" role="doc-backlink" aria-label="Back to footnote reference 2">&#x21a9; Back</a>
            </p>
          </li>
        </ol>
      </section>
    </article>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
