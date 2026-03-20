# Table of Contents

The `.prose-toc` component provides in-page navigation for long-form content. It lists anchor links to section headings so readers can scan the page structure and jump directly to a topic.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Navigation component</span>
  <p>Use <code>.prose-toc</code> at the top of long articles or regulatory documents to give readers an overview of the page and direct access to each section.</p>
</div>

## Live example

<div class="prose">
  <nav class="prose-toc" aria-label="Table of contents">
    <p class="prose-toc-title" id="demo-toc">On this page</p>
    <ul>
      <li><a href="#html-pattern">HTML Pattern</a></li>
      <li><a href="#styling-details">Styling Details</a></li>
      <li><a href="#active-state">Active State</a></li>
      <li><a href="#accessibility">Accessibility</a></li>
    </ul>
  </nav>
</div>

## HTML pattern

The component uses a `<nav>` element with an `aria-label` for assistive technology. The title is a `<p>` tag — not a heading — so it does not appear in the document outline or interfere with the heading hierarchy of the article itself.

```html
<nav class="prose-toc" aria-label="Table of contents">
  <p class="prose-toc-title" id="toc">On this page</p>
  <ul>
    <li><a href="#deposit-insurance">Deposit Insurance Coverage</a></li>
    <li><a href="#account-types">Covered Account Types</a></li>
    <li><a href="#ownership-categories">Ownership Categories</a></li>
    <li><a href="#coverage-limits">Standard Coverage Limits</a></li>
    <li><a href="#filing-claims">Filing a Claim</a></li>
  </ul>
</nav>
```

## Styling details

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Property</span>
    <span>Token</span>
    <span>Value</span>
  </div>
  <div class="fdic-roles-row">
    <span>Background</span>
    <span><code>--fdic-background-container</code></span>
    <span>#f5f5f7</span>
  </div>
  <div class="fdic-roles-row">
    <span>Border</span>
    <span><code>--fdic-border-divider</code></span>
    <span>#bdbdbf (1px solid)</span>
  </div>
  <div class="fdic-roles-row">
    <span>Border radius</span>
    <span><code>--fdic-corner-radius-lg</code></span>
    <span>7px</span>
  </div>
  <div class="fdic-roles-row">
    <span>Title font size</span>
    <span><code>--fdic-font-size-h3</code></span>
    <span>1.4063rem, weight 600</span>
  </div>
  <div class="fdic-roles-row">
    <span>Link underline (default)</span>
    <span>--</span>
    <span>None</span>
  </div>
  <div class="fdic-roles-row">
    <span>Link underline (hover/focus)</span>
    <span>--</span>
    <span>Underline</span>
  </div>
  <div class="fdic-roles-row">
    <span>Focus ring</span>
    <span><code>--fdic-border-input-focus</code></span>
    <span>2px solid #38b6ff, offset 2px</span>
  </div>
</div>

### Title element

The `.prose-toc-title` class styles the title at h3 size with weight 600. It uses a `<p>` element deliberately: a heading here would pollute the document outline with "On this page" alongside the article's real headings, creating a confusing experience for screen reader users who navigate by heading.

### Link styles

TOC links suppress the default underline to keep the list visually clean. Underline appears on `:hover` and `:focus-visible`, matching the interaction model readers expect from navigation lists.

## Active state

The `.prose-toc-active` class highlights the link corresponding to the currently visible section. When applied, the link switches to primary color (`#212123`) and weight 600, with a `color` transition at `0.2s ease`.

This state requires JavaScript. A minimal implementation uses `IntersectionObserver` to detect which section heading is in view:

```js
const tocLinks = document.querySelectorAll('.prose-toc a');
const sections = document.querySelectorAll('.prose h2[id], .prose h3[id]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      tocLinks.forEach((link) => {
        link.classList.toggle(
          'prose-toc-active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '0px 0px -60% 0px' });

sections.forEach((section) => observer.observe(section));
```

::: info Smooth scrolling
The `.prose-toc` pattern expects `html { scroll-behavior: smooth }` to be set globally. Under `prefers-reduced-motion: reduce`, scroll behavior falls back to `auto` (instant jump) to respect user preferences.
:::

## Accessibility

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Landmark</span>
    <p>The <code>&lt;nav&gt;</code> element with <code>aria-label="Table of contents"</code> creates a named navigation landmark. Screen reader users can jump directly to it from their landmarks list.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Title semantics</span>
    <p>The title uses <code>&lt;p class="prose-toc-title"&gt;</code>, not a heading. This avoids polluting the document outline with navigation chrome that is not part of the article's content hierarchy.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Focus visibility</span>
    <p>All TOC links use the standard focus ring: <code>outline: 2px solid var(--fdic-border-input-focus)</code>, <code>outline-offset: 2px</code>, <code>border-radius: 2px</code>.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Motion sensitivity</span>
    <p>The active-state color transition (0.2s ease) is suppressed under <code>prefers-reduced-motion: reduce</code>. Smooth scrolling also falls back to instant navigation.</p>
  </div>
</div>

## Print and responsive behavior

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Print</span>
    <p>The TOC is hidden entirely in print stylesheets. In a printed document, the table of contents serves no navigational purpose and would waste space.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Responsive</span>
    <p>The TOC renders at full width within <code>.prose</code> and respects the container's <code>max-width: 65ch</code>. No layout changes at the 640px breakpoint — the component is already single-column.</p>
  </div>
</div>

## Usage guidance

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use the TOC for articles with three or more sections. Place it after the lead paragraph and before the first <code>&lt;h2&gt;</code>.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not nest a TOC inside a callout or sidebar. It is a standalone navigation block that should sit in the main content flow.</p>
  </div>
</div>
