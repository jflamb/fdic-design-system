# Tables

Accessible, scrollable data tables for presenting structured financial and regulatory content within `.prose` containers.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>The <code>.prose-table-wrapper</code> component preserves native table semantics while enabling horizontal scroll on narrow viewports. It provides striped rows, hover highlights, numeric column alignment, and totals rows out of the box.</p>
</div>

## Live example

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

## HTML pattern

Wrap every `<table>` in a `.prose-table-wrapper` div. The wrapper handles overflow — never put `display: block` on the `<table>` element itself, as this breaks screen reader table navigation.

```html
<div class="prose-table-wrapper"
     role="region"
     aria-label="Quarterly deposit summary by account type"
     tabindex="0">
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
```

## Wrapper requirements

The wrapper div needs three attributes to be accessible and functional:

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Attribute</span>
    <span>Value</span>
    <span>Purpose</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>role="region"</code></span>
    <span>Fixed</span>
    <span>Announces the scrollable area as a landmark to screen readers</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>aria-label</code></span>
    <span>Descriptive text</span>
    <span>Gives screen readers context about the table content (do not repeat the caption)</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>tabindex="0"</code></span>
    <span>Fixed</span>
    <span>Makes the overflow region keyboard-scrollable</span>
  </div>
</div>

The wrapper applies `overflow-x: auto` so that wide tables scroll horizontally without breaking the page layout. When the wrapper receives keyboard focus, it shows a visible focus ring: `outline: 2px solid var(--fdic-border-input-focus, #38b6ff)` with `outline-offset: 2px`.

## Visual features

### Striped rows

Even rows in `<tbody>` receive a subtle background via `nth-child(even)`, using `var(--fdic-background-container, #f5f5f7)`. This improves scanability in dense data tables without adding visual noise.

### Hover highlight

Table rows transition their background color on hover (`0.15s ease`), giving users a visual anchor when scanning across wide columns. This transition is suppressed under `prefers-reduced-motion: reduce`.

### Rounded header corners

The first and last `<th>` in `<thead>` receive rounded top corners using `var(--fdic-corner-radius-lg, 7px)`, giving the table header a contained appearance.

### Numeric columns

Add `.prose-td-numeric` to any `<td>` that contains numeric data (dollar amounts, percentages, counts). This right-aligns the content and uses tabular-nums for consistent digit width:

```html
<td class="prose-td-numeric">$5,842,300,000</td>
```

Right alignment is the standard convention for financial data, as it keeps decimal points and digit places visually aligned for comparison.

### Totals rows with tfoot

Use `<tfoot>` for summary or totals rows. The footer receives distinct styling to separate it from body data, making aggregate figures easy to locate.

```html
<tfoot>
  <tr>
    <td><strong>Total insured deposits</strong></td>
    <td class="prose-td-numeric"><strong>$13,687,200,000</strong></td>
  </tr>
</tfoot>
```

## Semantic structure

Use real table elements for their intended purpose. Screen readers rely on this structure to navigate rows and columns:

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, and <code>&lt;tfoot&gt;</code> to group header, data, and summary rows. Use <code>&lt;th&gt;</code> for all header cells. Use <code>&lt;caption&gt;</code> when the table needs a visible title.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not apply <code>display: block</code> to <code>&lt;table&gt;</code> elements. Do not use tables for layout. Do not omit <code>&lt;thead&gt;</code> or use <code>&lt;td&gt;</code> where <code>&lt;th&gt;</code> belongs.</p>
  </div>
</div>

## Accessibility

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Requirement</span>
    <span>Implementation</span>
  </div>
  <div class="fdic-roles-row">
    <span>Keyboard scrolling</span>
    <span><code>tabindex="0"</code> on <code>.prose-table-wrapper</code> enables arrow-key scrolling when focused</span>
  </div>
  <div class="fdic-roles-row">
    <span>Screen reader landmark</span>
    <span><code>role="region"</code> + descriptive <code>aria-label</code> announces the scrollable container</span>
  </div>
  <div class="fdic-roles-row">
    <span>Table semantics preserved</span>
    <span>The <code>&lt;table&gt;</code> element keeps its default display — never override with <code>display: block</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Focus visibility</span>
    <span><code>:focus-visible</code> on the wrapper shows a <code>2px solid #38b6ff</code> outline with <code>2px</code> offset</span>
  </div>
  <div class="fdic-roles-row">
    <span>Column headers</span>
    <span>Use <code>&lt;th scope="col"&gt;</code> in <code>&lt;thead&gt;</code> and <code>&lt;th scope="row"&gt;</code> for row headers when applicable</span>
  </div>
</div>

::: warning Never use display: block on tables
Applying `display: block` to a `<table>` element destroys the implicit ARIA table role. Screen readers will no longer announce row/column positions, making the data inaccessible. Always use the `.prose-table-wrapper` pattern to handle overflow instead.
:::

## Print styles

In print output, decorative table styles are stripped for clean reproduction:

- **Row striping** is removed (no alternating backgrounds)
- **Hover highlights** are removed
- **Header row** retains a black background with white text for clear visual separation
- **Borders** are preserved for cell delineation
- Tables respect `break-inside: avoid` on rows where possible

## Forced-colors mode

Under `@media (forced-colors: active)` (Windows High Contrast), table borders use system colors (`ButtonText` for cell borders, `LinkText` for header backgrounds) so that table structure remains visible regardless of the user's color scheme. Striping and hover backgrounds are suppressed since they cannot be guaranteed to meet contrast in forced-colors mode.

## Minimal example

A simple two-column table with no footer:

```html
<div class="prose-table-wrapper"
     role="region"
     aria-label="Current FDIC insurance coverage limits"
     tabindex="0">
  <table>
    <thead>
      <tr>
        <th>Account category</th>
        <th>Coverage limit per depositor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Single accounts</td>
        <td class="prose-td-numeric">$250,000</td>
      </tr>
      <tr>
        <td>Joint accounts</td>
        <td class="prose-td-numeric">$250,000 per co-owner</td>
      </tr>
      <tr>
        <td>Retirement accounts</td>
        <td class="prose-td-numeric">$250,000</td>
      </tr>
      <tr>
        <td>Trust accounts</td>
        <td class="prose-td-numeric">$250,000 per beneficiary</td>
      </tr>
    </tbody>
  </table>
</div>
```
