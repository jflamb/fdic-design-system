import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { DOCS_OVERVIEW_STACK_STYLE } from "./docs-overview";

type TocItem = { label: string; href: string };

type TocArgs = {
  items: TocItem[];
  activeIndex: number;
};

const defaultItems: TocItem[] = [
  { label: "When to Use", href: "#when-to-use" },
  { label: "Live Examples", href: "#live-examples" },
  { label: "Best Practices", href: "#best-practices" },
  { label: "Interaction Behavior", href: "#interaction-behavior" },
  { label: "Accessibility", href: "#accessibility" }
];

const fullPageItems: TocItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Growth in NDFI Lending", href: "#growth-in-ndfi-lending" },
  { label: "Changes to the Call Report", href: "#changes-to-the-call-report" },
  { label: "NDFI Lending Trends", href: "#ndfi-lending-trends" }
];

const meta = {
  title: "Prose/TOC",
  tags: ["autodocs"],
  argTypes: {
    activeIndex: {
      control: { type: "range", min: -1, max: 4, step: 1 },
      description: "Index of the active item (-1 for none)"
    }
  },
  args: {
    items: defaultItems,
    activeIndex: -1
  },
  render: (args: TocArgs) => html`
    <nav class="prose-toc" aria-label="Table of contents">
      <p class="prose-toc-title">On this page</p>
      <ul>
        ${args.items.map(
          (item, i) => html`
            <li>
              <a
                href=${item.href}
                class=${i === args.activeIndex ? "prose-toc-active" : nothing}
              >${item.label}</a>
            </li>
          `
        )}
      </ul>
    </nav>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveState: Story = {
  args: {
    activeIndex: 2
  }
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${`${DOCS_OVERVIEW_STACK_STYLE} max-width: 22.5rem;`}>
      <nav class="prose-toc" aria-label="Table of contents">
        <p class="prose-toc-title">On this page</p>
        <ul>
          ${defaultItems.map(
            (item, i) => html`
              <li>
                <a
                  href=${item.href}
                  class=${i === 2 ? "prose-toc-active" : nothing}
                >${item.label}</a>
              </li>
            `
          )}
        </ul>
      </nav>
    </div>
  `
};

export const FullPageNavigation: Story = {
  render: () => html`
    <article class="prose" style="max-width: 65ch;">
      <h1>Bank Lending to Nondepository Financial Institutions</h1>
      <p class="lead">
        Bank lending to nondepository financial institutions, or NDFIs, has become
        a more visible part of commercial bank balance sheets. The pattern matters
        because it changes where credit risk sits and how supervisors interpret
        concentrations in bank portfolios.
      </p>

      <nav class="prose-toc" id="article-toc" aria-label="Table of contents">
        <p class="prose-toc-title">On this page</p>
        <ul>
          ${fullPageItems.map(
            (item) => html`
              <li><a href=${item.href}>${item.label}</a></li>
            `
          )}
        </ul>
      </nav>

      <h2 id="overview">Overview</h2>
      <p>
        NDFIs include lenders, investment funds, and other financial firms that
        provide credit without taking insured deposits. Banks lend to these firms
        through credit facilities, warehouse lines, and other wholesale funding
        arrangements that can grow quickly when market conditions support private
        credit activity.
      </p>
      <p>
        These relationships can support liquidity and credit availability, but they
        can also make exposures harder to interpret if the bank's borrower is itself
        extending credit to other leveraged counterparties. Clear disclosure and
        consistent reporting help examiners understand the scale of that activity.
      </p>
      <p class="prose-back-to-top"><a href="#article-toc">Back to top</a></p>

      <h2 id="growth-in-ndfi-lending">Growth in NDFI Lending</h2>
      <p>
        Recent growth reflects a wider role for private funds and specialty finance
        firms in credit markets that were once dominated by traditional banks.
        Warehouse funding, subscription facilities, and structured credit lines have
        expanded as nonbank lenders have taken a larger share of origination activity.
      </p>
      <p>
        For banks, that growth can create earnings opportunities, but it can also
        increase concentration risk if exposures are clustered in a few business
        models or are tied to common funding conditions. The same market stress can
        affect many borrowers at once, even when the legal counterparties are different.
      </p>
      <p class="prose-back-to-top"><a href="#article-toc">Back to top</a></p>

      <h2 id="changes-to-the-call-report">Changes to the Call Report</h2>
      <p>
        Call Report revisions are intended to make NDFI exposures easier to identify
        and compare across banks. More specific categories improve supervisory
        visibility and reduce the need to infer these balances from broad commercial
        and industrial loan groupings.
      </p>
      <p>
        Better reporting also helps analysts distinguish direct lending to households
        and businesses from lending to financial intermediaries. That distinction is
        important when evaluating risk transfer, underwriting standards, and the
        channels through which credit stress may return to the banking system.
      </p>
      <p class="prose-back-to-top"><a href="#article-toc">Back to top</a></p>

      <h2 id="ndfi-lending-trends">NDFI Lending Trends</h2>
      <p>
        Trend analysis should look at both absolute balances and the share of total
        loans tied to NDFIs. Growth over time may be manageable in one bank but
        signal a material portfolio shift in another, depending on capital, funding,
        and the broader mix of commercial exposures.
      </p>
      <p>
        Supervisory analysis is stronger when trend data is read alongside borrower
        type, collateral structure, and repayment sources. Those details clarify
        whether rising balances reflect diversified client demand or a narrower buildup
        in a segment that could amplify losses under stress.
      </p>
      <p class="prose-back-to-top"><a href="#article-toc">Back to top</a></p>
    </article>
  `
};
