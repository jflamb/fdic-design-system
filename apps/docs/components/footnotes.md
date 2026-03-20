# Footnotes

A bidirectional footnote pattern with DPUB-ARIA roles for accessible, navigable citations in long-form prose content.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Prose component</span>
  <p>The <code>.prose-footnotes</code> component pairs inline superscript references with a numbered endnote section, enabling readers to move between citation and source in both directions. The pattern uses DPUB-ARIA roles so assistive technologies can announce footnote structure without custom labeling.</p>
</div>

## Live example

<div class="prose">
  <p>Deposit insurance covers up to $250,000 per depositor, per insured bank, for each account ownership category.<sup><a href="#demo-fn1" id="demo-ref1" role="doc-noteref">[1]</a></sup> Joint accounts receive separate coverage from single-ownership accounts.<sup><a href="#demo-fn2" id="demo-ref2" role="doc-noteref">[2]</a></sup></p>

  <section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
    <hr />
    <ol>
      <li id="demo-fn1" role="doc-footnote">
        Federal Deposit Insurance Corporation. "Deposit Insurance FAQs." Coverage limits were last adjusted by the Dodd-Frank Act of 2010. <a href="#demo-ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
      <li id="demo-fn2" role="doc-footnote">
        12 C.F.R. Part 330 governs the general rules for deposit insurance coverage. <a href="#demo-ref2" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
    </ol>
  </section>
</div>

## Inline reference

Each footnote reference is a superscript link that points to the corresponding footnote entry. References use bracketed numbers (`[1]`, `[2]`, etc.) and carry the `doc-noteref` ARIA role.

```html
<p>
  Deposit insurance covers up to $250,000 per depositor, per insured
  bank, for each account ownership
  category.<sup><a href="#fn1" id="ref1" role="doc-noteref">[1]</a></sup>
</p>
```

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Tap target</span>
    <h3>Enlarged hit area</h3>
    <p>Footnote reference links use padding with a compensating negative margin to enlarge the tap target without shifting surrounding text. This makes the small superscript number easier to activate on touch devices.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Numbering</span>
    <h3>Bracketed integers</h3>
    <p>Use sequential bracketed numbers: <code>[1]</code>, <code>[2]</code>, <code>[3]</code>. Do not use asterisks, daggers, or other symbolic footnote markers.</p>
  </div>
</div>

## Footnote section

The footnote section appears at the end of the article. It contains an `<hr>` separator, an ordered list of footnote entries, and back-links that return readers to the inline reference.

```html
<section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
  <hr />
  <ol>
    <li id="fn1" role="doc-footnote">
      Federal Deposit Insurance Corporation. "Deposit Insurance FAQs."
      Coverage limits were last adjusted by the Dodd-Frank Act of
      2010. <a href="#ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
    </li>
    <li id="fn2" role="doc-footnote">
      12 C.F.R. Part 330 governs the general rules for deposit
      insurance
      coverage. <a href="#ref2" role="doc-backlink" title="Back to reference">&#x21a9;</a>
    </li>
    <li id="fn3" role="doc-footnote">
      Joint accounts are insured up to $250,000 per co-owner, provided
      each co-owner has equal withdrawal
      rights. <a href="#ref3" role="doc-backlink" title="Back to reference">&#x21a9;</a>
    </li>
  </ol>
</section>
```

## Complete example

A realistic banking-content example showing inline references and the corresponding footnote section together:

```html
<article class="prose" id="main">
  <h2>Understanding deposit insurance coverage</h2>
  <p>
    The Federal Deposit Insurance Corporation
    (<abbr title="Federal Deposit Insurance Corporation">FDIC</abbr>)
    insures deposits at member banks up to the standard maximum deposit
    insurance amount of $250,000 per depositor, per insured bank, for
    each account ownership
    category.<sup><a href="#fn1" id="ref1" role="doc-noteref">[1]</a></sup>
    This coverage applies automatically when a deposit account is
    opened at an FDIC-insured institution.
  </p>
  <p>
    Joint accounts receive separate coverage from single-ownership
    accounts.<sup><a href="#fn2" id="ref2" role="doc-noteref">[2]</a></sup>
    Each co-owner's share is insured up to $250,000, meaning a joint
    account held by two people is insured up to
    $500,000.<sup><a href="#fn3" id="ref3" role="doc-noteref">[3]</a></sup>
  </p>

  <section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
    <hr />
    <ol>
      <li id="fn1" role="doc-footnote">
        Federal Deposit Insurance Corporation. "Deposit Insurance FAQs."
        Coverage limits were last adjusted by the Dodd-Frank Act of
        2010. <a href="#ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
      <li id="fn2" role="doc-footnote">
        12 C.F.R. Part 330 governs the general rules for deposit insurance
        coverage. <a href="#ref2" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
      <li id="fn3" role="doc-footnote">
        Joint accounts are insured up to $250,000 per co-owner, provided each
        co-owner has equal withdrawal
        rights. <a href="#ref3" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
    </ol>
  </section>
</article>
```

## Styling details

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Property</span>
    <span>Value</span>
    <span>Notes</span>
  </div>
  <div class="fdic-roles-row">
    <span>Font size</span>
    <span>0.875em</span>
    <span>Smaller than body text to visually subordinate footnotes</span>
  </div>
  <div class="fdic-roles-row">
    <span>Color</span>
    <span><span class="fdic-role-dot" style="background:#595961;"></span> <code>#595961</code></span>
    <span>Secondary text color (<code>--fdic-text-secondary</code>)</span>
  </div>
  <div class="fdic-roles-row">
    <span>HR width</span>
    <span>33%</span>
    <span>Left-aligned separator — visually lighter than a full-width rule</span>
  </div>
  <div class="fdic-roles-row">
    <span>Back-link character</span>
    <span>&#x21a9; (<code>&amp;#x21a9;</code>)</span>
    <span>Return arrow — always include <code>title="Back to reference"</code></span>
  </div>
</div>

### Inline reference styles

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Element</span>
    <span>Treatment</span>
    <span>Purpose</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>sup</code></span>
    <span>0.75em, <code>line-height: 0</code></span>
    <span>Prevents the superscript from distorting line height of surrounding text</span>
  </div>
  <div class="fdic-roles-row">
    <span>Footnote ref link</span>
    <span>Padding + negative margin</span>
    <span>Enlarges the tap target around the small bracketed number without affecting text flow</span>
  </div>
</div>

## Target highlight animation

When a reader activates a footnote reference link and the browser scrolls to the corresponding `<li>`, the `:target` pseudo-class triggers a yellow flash animation to help the reader locate the footnote.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Default behavior</span>
    <h3>Animated flash</h3>
    <p>The <code>@keyframes footnote-flash</code> animation applies a <code>#fff3cd</code> yellow background that fades to transparent over 1.5 seconds. This draws the eye to the targeted footnote without persisting as a distraction.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Reduced motion</span>
    <h3>Static highlight</h3>
    <p>Under <code>prefers-reduced-motion: reduce</code>, the animation is suppressed. A static <code>#fff3cd</code> yellow background is applied instead, so the footnote is still visually indicated without any motion.</p>
  </div>
</div>

```css
/* Default: animated highlight */
@keyframes footnote-flash {
  from { background-color: #fff3cd; }
  to   { background-color: transparent; }
}

.prose-footnotes li:target {
  animation: footnote-flash 1.5s ease;
}

/* Reduced motion: static highlight */
@media (prefers-reduced-motion: reduce) {
  .prose-footnotes li:target {
    animation: none;
    background-color: #fff3cd;
  }
}
```

## Accessibility

The footnote pattern uses DPUB-ARIA roles to give assistive technologies explicit knowledge of the document structure. These roles are part of the Digital Publishing WAI-ARIA Module.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Element</span>
    <span>ARIA role</span>
    <span>Purpose</span>
  </div>
  <div class="fdic-roles-row">
    <span>Inline reference link</span>
    <span><code>doc-noteref</code></span>
    <span>Identifies the link as a footnote reference so screen readers can announce "footnote reference" rather than a generic link</span>
  </div>
  <div class="fdic-roles-row">
    <span>Footnote section</span>
    <span><code>doc-endnotes</code></span>
    <span>Marks the container as a collection of endnotes, making it a landmark for screen reader navigation</span>
  </div>
  <div class="fdic-roles-row">
    <span>Each <code>&lt;li&gt;</code></span>
    <span><code>doc-footnote</code></span>
    <span>Identifies each list item as an individual footnote entry</span>
  </div>
  <div class="fdic-roles-row">
    <span>Back-link</span>
    <span><code>doc-backlink</code></span>
    <span>Identifies the return link so screen readers announce navigation back to the referencing text</span>
  </div>
</div>

Additional requirements:

- The footnote section must include `aria-label="Footnotes"` for landmark identification
- Back-links must include `title="Back to reference"` for tooltip context
- The `id` on each `<li>` must match the `href` on the corresponding inline reference
- The `id` on each inline reference must match the `href` on the corresponding back-link

::: warning Bidirectional linking is required
Both directions of the link must be present. A footnote reference without a back-link traps keyboard users in the footnote section with no efficient way to return to their reading position.
:::

## Print behavior

In print stylesheets, footnotes receive the following treatment:

- The footnote section itself is preserved (footnotes are content, not chrome)
- Back-link URLs are **not** appended via `::after { content: " (" attr(href) ")" }` because they are internal anchors, not external resources
- The `:target` highlight animation is naturally inactive in print
- The HR separator is preserved as a structural divider

## Content guidance

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use footnotes for citations, legal references, regulatory code sections, and supplementary context that would interrupt the reading flow if inline.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not use footnotes for essential information that readers must see to understand the main text. If the content is critical, include it inline.</p>
  </div>
</div>

- Place the `<section class="prose-footnotes">` at the end of the `<article>`, after all body content
- Use sequential numbering starting at 1 — do not restart numbering per section
- Write footnote text as complete thoughts, not fragments
- Include the source or regulation name when citing legal or regulatory material
