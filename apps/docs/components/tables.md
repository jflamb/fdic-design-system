# Tables

Tables present structured data in rows and columns. They are the right choice when readers need to compare values, scan for specific entries, or understand relationships between data points.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>The table wrapper component provides accessible horizontal scrolling for wide tables while preserving native table semantics for screen readers.</p>
</div>

## When to use

- **Data has a clear tabular structure** — rows represent items, columns represent attributes.
- **Readers need to compare values across rows** — bank financial metrics, deposit limits by category, quarterly filing statistics.
- **The data has consistent attributes** — every row shares the same columns.
- **Presenting regulatory data, filing statistics, or financial summaries** where precision and scannability matter.

## When not to use

- **Don't use tables for layout.** Tables are for data, not for positioning content side by side.
- **Don't use a table for a single column of items.** A bulleted or numbered list is simpler and more accessible.
- **Don't use a table when each "row" needs rich content** (paragraphs, images, nested lists). Use a card layout or definition list instead.

## Live examples

<div class="prose">
  <div class="prose-table-wrapper" role="region" aria-label="Quarterly deposit summary by account type" tabindex="0">
    <table>
      <caption>FDIC-insured deposit balances, Q4 2025</caption>
      <thead>
        <tr>
          <th>Account type</th>
          <th>Interest rate</th>
          <th>Total deposits</th>
          <th>Change from Q3</th>
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
</div>

<StoryEmbed storyId="prose-table--default" caption="Default table with striped rows and hover highlights" />

<StoryEmbed storyId="prose-table--numeric" caption="Table with right-aligned numeric columns" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Include a descriptive caption</h4>
    <p>Include a caption that describes what the table contains — "FDIC-insured deposit balances by ownership category." The caption serves as the table's accessible name.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't omit or use vague captions</h4>
    <p>Don't omit the caption or use vague text like "Data table." Without a meaningful caption, screen reader users cannot tell what data the table presents before navigating into it.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Right-align numeric columns</h4>
    <p>Right-align numeric columns using the <code>.prose-td-numeric</code> class so decimal points and digit places line up for easy comparison.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't left-align financial figures</h4>
    <p>Left-aligned numbers are harder to compare visually. Misaligned decimal points force readers to count digits manually.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep tables scannable</h4>
    <p>Aim for 3 to 7 columns. Focused tables are easier to read and less likely to require horizontal scrolling.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't cram too many columns</h4>
    <p>Dozens of columns in one table overwhelm readers. Split complex datasets into multiple focused tables, each answering a specific question.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use the table footer for summary values</h4>
    <p>Use <code>&lt;tfoot&gt;</code> for totals, averages, or summary values. The footer row receives distinct styling that separates it from individual entries.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't put summaries inline as regular rows</h4>
    <p>Placing summary calculations as regular body rows makes it difficult to distinguish aggregate data from individual entries.</p>
  </div>
</div>

## Interaction behavior

- **Horizontal scrolling** — Tables wider than their container become horizontally scrollable. The wrapper provides keyboard-accessible scrolling: users can Tab to the table area and scroll with arrow keys.
- **Row hover highlight** — On hover, table rows receive a subtle background highlight to help readers track across columns. The transition is suppressed under `prefers-reduced-motion`.
- **Striped rows** — Alternating row backgrounds provide a visual guide for scanning long tables without adding visual noise.

## Content guidelines

<div class="fdic-content-rule">
  <h3>Write descriptive column headers</h3>
  <p>Headers should label the data clearly and specifically. A header read in isolation should tell the reader what values appear in that column.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span> "Quarterly Net Income ($000s)"
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span> "Income"
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <h3>Include units in headers, not in every cell</h3>
  <p>Putting units in the header keeps cells clean and avoids redundant text that clutters the table.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span> Header says "Total Deposits ($M)" with cells showing "1,234.5"
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span> Every cell says "$1,234.5M"
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <h3>Use consistent formatting within a column</h3>
  <p>All dates should use the same format, all currencies the same precision. Inconsistent formatting forces readers to mentally translate values.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span> "03/31/2026, 06/30/2026, 09/30/2026"
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span> "March 31, 2026, 6/30/26, 2026-09-30"
    </div>
  </div>
</div>

## Accessibility

- **Every table needs a descriptive label.** Use a `<caption>` element or give the scrollable wrapper an `aria-label` that describes what data the table contains.
- **Screen reader users navigate tables cell by cell.** Column and row headers tell them where they are — make sure headers are specific enough to be useful in isolation.
- **The scrollable wrapper is keyboard accessible.** Readers can Tab to it and scroll with arrow keys without a mouse. The wrapper shows a visible focus ring when focused.
- **Don't merge cells unless the data genuinely spans multiple columns or rows.** Merged cells confuse screen reader navigation and break the predictable row-column grid.

## Design specs

<FigmaEmbed url="" caption="Table anatomy — headers, striped rows, numeric alignment, and footer" />
