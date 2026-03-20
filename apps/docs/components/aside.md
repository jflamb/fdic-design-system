# Aside / Pull Quote

Asides present supplementary content that relates to a specific passage in the main text. They float alongside the body content on desktop and linearize to full width on mobile.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use asides for extended commentary, historical context, or regulatory background that enriches the main text without being essential to understanding it.</p>
</div>

## When to use

- **Providing historical context or background that enriches a specific passage** — "The FDIC was created in 1933 in response to thousands of bank failures during the Great Depression."
- **Highlighting a related policy, regulation, or definition** — The aside supports but doesn't replace the main text, giving readers deeper context without derailing the narrative.
- **Pulling out a key quote or statistic that deserves visual emphasis** — A notable figure or finding that relates directly to the passage it sits beside.

## When not to use

- **Don't use an aside for short tips or warnings** — That's a [callout](./callouts). Asides are for longer supplementary content (a paragraph or more).
- **Don't use an aside for content the reader must see** — If it's required reading, put it in the body text. Asides can be skipped.
- **Don't use more than one aside per page section** — Multiple floating elements create layout collisions and visual clutter.
- **Don't use an aside as a sidebar navigation element** — It's for content, not for links or menus.

## Live examples

<div class="prose">
  <p>When evaluating deposit insurance coverage, it is important to understand how the FDIC categorizes account ownership. Each ownership category — single accounts, joint accounts, revocable trust accounts, and certain retirement accounts — is insured separately up to the standard maximum amount.</p>
  <aside aria-label="Key fact about deposit insurance">
    <p>The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.</p>
  </aside>
  <p>This means a depositor with accounts in multiple ownership categories at the same insured bank can potentially be insured for more than $250,000 in total. For example, funds in a single account, a joint account, and an IRA at the same bank are each insured separately.</p>
</div>

<StoryEmbed storyId="prose-aside--default" caption="Aside — supplementary content floating alongside body text" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Place the aside near the paragraph it relates to</h4>
    <p>Proximity creates the visual and semantic connection between the aside and its context.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Put asides at the top or bottom of a page as general context</h4>
    <p>Use a lead paragraph or callout for page-level introductions and disclaimers.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep asides to 1-2 short paragraphs</h4>
    <p>Brief supplementary content works best in a floated 40%-width container.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Put lengthy multi-paragraph content in an aside</h4>
    <p>If it needs that much space, it should be a full section with its own heading.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use asides for content that enriches without duplicating</h4>
    <p>The aside should add new perspective — historical context, a related statistic, or a regulatory reference.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Repeat information from the main text in an aside</h4>
    <p>The aside should add new perspective, not echo what's already been said.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Write aside content in the same voice as the main text.</strong>
  <p>The aside should feel like a natural extension of the document, not a jarring interruption.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>The 2008 financial crisis led to the largest number of bank failures since the savings and loan crisis of the 1980s, reinforcing the importance of deposit insurance reform.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>FUN FACT: Did you know that 465 banks failed between 2008 and 2012?</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Aside content should make sense without reading the surrounding text.</strong>
  <p>A reader who notices the aside first should understand it on its own.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>The FDIC's Deposit Insurance Fund (DIF) maintained a reserve ratio of 1.38% as of Q4 2025, above the statutory minimum of 1.35%.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>This ratio exceeded the minimum described above.</p>
    </div>
  </div>
</div>

## Accessibility

- The `<aside>` element is an ARIA landmark — screen reader users can navigate to it directly from the page's landmark list.
- Give each aside a descriptive `aria-label` that tells screen reader users what the supplementary content is about — for example, `aria-label="Historical context on deposit insurance"`.
- On small screens and in print, the aside linearizes to full width — content authors should ensure the aside reads well in both floated and stacked layouts.

## Design specs

<FigmaEmbed url="" caption="Aside layout — desktop float, mobile stack, and brand-blue border" />

## Related components

<ul class="fdic-related-list">
  <li><a href="./callouts">Callouts</a> — Use for short, urgent supplementary information (1-3 sentences) that the reader should not miss. Callouts use color and icons to signal severity; asides use position and border.</li>
  <li><a href="./details">Details / Accordion</a> — Use when supplementary content should be hidden by default and revealed on demand. Asides are always visible; accordions require interaction.</li>
</ul>
