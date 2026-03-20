# Aside / Pull Quote

Asides surface supplementary content alongside the main narrative — key facts, regulatory highlights, deposit insurance limits, and other information that supports but does not replace the surrounding text.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>The <code>&lt;aside&gt;</code> element floats right at 40% width on desktop, providing a pull-quote or sidebar effect within prose content. It linearizes to full width on small screens and in print.</p>
</div>

## Live example

<div class="prose">
  <p>When evaluating deposit insurance coverage, it is important to understand how the FDIC categorizes account ownership. Each ownership category — single accounts, joint accounts, revocable trust accounts, and certain retirement accounts — is insured separately up to the standard maximum amount.</p>
  <aside aria-label="Key fact about deposit insurance">
    <p>The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.</p>
  </aside>
  <p>This means a depositor with accounts in multiple ownership categories at the same insured bank can potentially be insured for more than $250,000 in total. For example, funds in a single account, a joint account, and an IRA at the same bank are each insured separately.</p>
</div>

## Styling

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Layout</span>
    <h3>Float right, 40% width</h3>
    <p>The aside floats to the right of surrounding text, occupying 40% of the prose container width. Body text wraps around it naturally.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Border</span>
    <h3>Brand-blue left accent</h3>
    <p>A 4px solid left border in brand blue (<code>#0d6191</code>) visually connects the aside to the FDIC brand and distinguishes it from blockquotes and callouts.</p>
  </div>
</div>

## HTML pattern

The `<aside>` element is semantic HTML — no additional wrapper classes are required. Add `aria-label` to distinguish multiple asides on the same page.

```html
<aside aria-label="Key fact about deposit insurance">
  <p>The standard maximum deposit insurance amount is
  $250,000 per depositor, per insured bank, for each
  account ownership category.</p>
</aside>
```

When a page contains only one aside, the `aria-label` is optional but recommended:

```html
<aside aria-label="Reporting deadline reminder">
  <p>Institutions must file Call Reports within 30
  calendar days after the last business day of each
  calendar quarter.</p>
</aside>
```

## Responsive behavior

At `max-width: 640px`, the aside linearizes — the float is removed and the element spans the full width of the prose container. This prevents narrow, hard-to-read columns on small screens.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Property</span>
    <span>Desktop</span>
    <span>Mobile (640px)</span>
  </div>
  <div class="fdic-roles-row">
    <span>Float</span>
    <span><code>right</code></span>
    <span><code>none</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Width</span>
    <span><code>40%</code></span>
    <span><code>100%</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Margin</span>
    <span>Left margin for text clearance</span>
    <span>Standard block margins</span>
  </div>
</div>

## Accessibility

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">WCAG 1.3.1, 2.4.1</span>
    <h3>Landmark semantics</h3>
    <p>The <code>&lt;aside&gt;</code> element is an ARIA landmark. Screen readers list it alongside <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, and other landmarks, giving users a way to jump directly to supplementary content.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Labeling</span>
    <h3>aria-label for multiple asides</h3>
    <p>When a page contains more than one <code>&lt;aside&gt;</code>, each must have a distinct <code>aria-label</code> so screen reader users can distinguish between them in the landmarks list.</p>
  </div>
</div>

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Supplementary only</span>
    <p>The aside must contain content that is related to but not essential for understanding the surrounding text. Do not use it for primary content or navigation.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Label multiple asides</span>
    <p>When a page contains more than one aside, each needs a distinct <code>aria-label</code>: "Key fact about deposit insurance", "Reporting deadline reminder", etc.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Keep it concise</span>
    <p>Asides work best with short, focused content — a key statistic, a regulatory citation, or a brief clarification. Long content in a floated 40%-width container becomes difficult to read.</p>
  </div>
</div>

## Print behavior

When the page is printed, the aside linearizes to full width with no float, matching the mobile behavior. The brand-blue left border is preserved for visual structure on paper.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use asides for key facts, regulatory highlights, insurance limits, and brief supplementary context that supports the surrounding narrative.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not use asides for primary content, navigation, form elements, or long passages. Do not nest asides within other asides or within blockquotes.</p>
  </div>
</div>
