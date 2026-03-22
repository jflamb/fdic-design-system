import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type TableArgs = {
  caption: string;
  showNumeric: boolean;
  showFooter: boolean;
};

const meta = {
  title: "Prose/Table",
  tags: ["autodocs"],
  argTypes: {
    caption: { control: "text" },
    showNumeric: { control: "boolean" },
    showFooter: { control: "boolean" }
  },
  args: {
    caption: "FDIC-insured deposit balances, Q4 2025",
    showNumeric: false,
    showFooter: true
  },
  render: (args: TableArgs) => {
    const nc = args.showNumeric ? "prose-td-numeric" : "";
    const nhc = args.showNumeric ? "prose-th-numeric" : "";
    return html`
      <div class="prose-table-wrapper" role="region"
        aria-label="Quarterly deposit summary by account type" tabindex="0">
        <table>
          <caption>${args.caption}</caption>
          <thead>
            <tr>
              <th>Account type</th>
              <th class=${nhc}>Interest rate</th>
              <th class=${nhc}>Total deposits</th>
              <th class=${nhc}>Change from Q3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Checking</td>
              <td class=${nc}>0.07%</td>
              <td class=${nc}>$5,842,300,000</td>
              <td class=${nc}>+2.1%</td>
            </tr>
            <tr>
              <td>Savings</td>
              <td class=${nc}>0.46%</td>
              <td class=${nc}>$3,217,600,000</td>
              <td class=${nc}>+1.8%</td>
            </tr>
            <tr>
              <td>Money market</td>
              <td class=${nc}>4.25%</td>
              <td class=${nc}>$1,985,400,000</td>
              <td class=${nc}>+5.3%</td>
            </tr>
            <tr>
              <td>Certificates of deposit</td>
              <td class=${nc}>4.80%</td>
              <td class=${nc}>$2,641,900,000</td>
              <td class=${nc}>+8.7%</td>
            </tr>
          </tbody>
          ${args.showFooter
            ? html`<tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td></td>
                  <td class=${nc}><strong>$13,687,200,000</strong></td>
                  <td class=${nc}><strong>+3.9%</strong></td>
                </tr>
              </tfoot>`
            : ""}
        </table>
      </div>
    `;
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Numeric: Story = {
  args: {
    showNumeric: true,
    showFooter: true
  }
};

export const DocsOverview: Story = {
  render: () => html`
    <div class="prose-table-wrapper" role="region"
      aria-label="Quarterly deposit summary by account type" tabindex="0">
      <table>
        <caption>FDIC-insured deposit balances, Q4 2025</caption>
        <thead>
          <tr>
            <th>Account type</th>
            <th class="prose-th-numeric">Interest rate</th>
            <th class="prose-th-numeric">Total deposits</th>
            <th class="prose-th-numeric">Change from Q3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Checking</td>
            <td class="prose-td-numeric">0.07%</td>
            <td class="prose-td-numeric">$5,842,300,000</td>
            <td class="prose-td-numeric">+2.1%</td>
          </tr>
          <tr>
            <td>Savings</td>
            <td class="prose-td-numeric">0.46%</td>
            <td class="prose-td-numeric">$3,217,600,000</td>
            <td class="prose-td-numeric">+1.8%</td>
          </tr>
          <tr>
            <td>Money market</td>
            <td class="prose-td-numeric">4.25%</td>
            <td class="prose-td-numeric">$1,985,400,000</td>
            <td class="prose-td-numeric">+5.3%</td>
          </tr>
          <tr>
            <td>Certificates of deposit</td>
            <td class="prose-td-numeric">4.80%</td>
            <td class="prose-td-numeric">$2,641,900,000</td>
            <td class="prose-td-numeric">+8.7%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td class="prose-td-numeric"><strong>$13,687,200,000</strong></td>
            <td class="prose-td-numeric"><strong>+3.9%</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `
};
