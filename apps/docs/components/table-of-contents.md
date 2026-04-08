# Table of Contents

The table of contents provides in-page navigation for long-form documents. It helps readers scan the structure of a page and jump directly to the section they need.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Prose sub-topic</span>
  <p>Use the TOC pattern inside <a href="./prose">Prose</a> content on pages with three or more sections to help readers orient themselves and navigate directly to the content they need.</p>
</div>

## When to use

- **The page has three or more distinct sections with headings** — Fewer than three sections rarely justifies the added navigation overhead.
- **Readers are likely looking for specific information rather than reading top-to-bottom** — regulatory guidance, procedural manuals, reference documents, and policy summaries.
- **The document is long enough that scrolling to find a section is inconvenient** — If the full page fits comfortably on one or two screens, a TOC adds clutter without value.

## Examples

<StoryEmbed
  storyId="prose-toc--docs-overview"
  linkStoryId="prose-toc--active-state"
  height="250"
  caption="Overview — the TOC pattern with an active section highlight. Open Storybook to inspect the active-state variant directly."
/>

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Place the TOC near the top</h4>
    <p>Position the TOC after any introductory content and before the first section. Readers need it before they start navigating.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't bury it mid-page</h4>
    <p>A TOC placed in the middle or at the bottom of a document is too late to help readers orient themselves.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Mirror the exact heading text</h4>
    <p>TOC links should use the same wording as the section headings they point to. Consistent labels help readers match what they see in the TOC with what they find on the page.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't paraphrase or abbreviate headings</h4>
    <p>Inconsistency between the TOC link text and the actual heading confuses readers looking for a match — especially screen reader users navigating by heading.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Limit to top-level sections</h4>
    <p>List only h2-level headings in the TOC to keep it scannable. A short, focused list lets readers find what they need at a glance.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't include every sub-heading</h4>
    <p>A deeply nested TOC that includes h3s and h4s defeats its purpose as a quick-scan navigation aid and becomes as overwhelming as the document itself.</p>
  </div>
</div>

## Interaction behavior

- **Smooth scroll** — Clicking a TOC link smooth-scrolls to the target section. Users who prefer reduced motion see an instant jump instead.
- **Active section highlight** — As the reader scrolls, the active section highlights in the TOC, showing which section is currently in view. The active state updates automatically based on scroll position — no manual interaction needed.
- **Keyboard navigation** — TOC links are keyboard navigable — users can Tab through them and activate with Enter, following the standard link interaction model.

## Returning to the top

Back-to-top links are the companion return path for the TOC. The TOC helps readers move down into a long document; a back-to-top link at the end of each `h2` section lets them return to the TOC without manually scrolling back up.

Place one `<p class="prose-back-to-top">` at the end of each `h2` section's content. The link target should point back to the TOC container near the top of the page.

```html
<article class="prose">
  <nav class="prose-toc" id="article-toc" aria-label="Table of contents">
    <p class="prose-toc-title">On this page</p>
    <ul>
      <li><a href="#overview">Overview</a></li>
      <li><a href="#growth">Growth in NDFI Lending</a></li>
      <li><a href="#call-report">Changes to the Call Report</a></li>
    </ul>
  </nav>

  <h2 id="overview">Overview</h2>
  <p>Section content...</p>
  <p class="prose-back-to-top"><a href="#article-toc">Back to top</a></p>
</article>
```

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Place one after each h2 section</h4>
    <p>Treat back-to-top as the return half of the TOC pattern. Readers should be able to reorient after every major section, not just after finishing the entire page.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't add only one at the bottom</h4>
    <p>A single link at the very end breaks the navigation loop. It helps only readers who reached the bottom instead of supporting section-by-section movement.</p>
  </div>
</div>

See the Storybook <code>FullPageNavigation</code> story for the full working example of the paired TOC and back-to-top pattern.

## Accessibility

- The TOC is wrapped in a `<nav>` landmark with `aria-label="Table of contents"`, so screen reader users can find it quickly from their landmarks list.
- The title uses a `<p>` element, not a heading. This avoids polluting the document outline with a "Table of contents" entry that would appear alongside the actual content headings.
- TOC links use the same text as the target headings, so screen reader users hear consistent labels when navigating between the TOC and the document sections.

## Design specs

<FigmaEmbed url="" caption="TOC layout — default state and active section highlight" />

## Related components

<ul class="fdic-related-list">
  <li><code>.prose-back-to-top</code> — Use back-to-top links as the paired return path for section-level TOC navigation on long-form pages.</li>
  <li><a href="./footnotes">Footnotes</a> — Both are document navigation aids. TOC navigates between sections; footnotes navigate between references and their sources.</li>
</ul>
