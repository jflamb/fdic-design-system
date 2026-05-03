# Content Page Recipes

Content-heavy pages need more than component examples. They need repeatable page structures that keep long reading, side navigation, filters, metadata, and related content understandable.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Guide</span>
  <p>Use these recipes for news, articles, policy pages, and other authored content where the main task is reading, scanning, filtering, or moving through a section of content.</p>
</div>

The examples are based on the FDICnet News Article and News Stories with Filters frames. They use existing components, semantic HTML, and the shared page-shell contract instead of creating a page-template component.

## Current recipes

<StoryEmbed
  storyId="patterns-content-page-recipes--news-article-with-sidebar"
  caption="News article with sidebar — page header, section navigation, readable prose rail, cover image, topics, related stories, page feedback, and footer."
/>

<StoryEmbed
  storyId="patterns-content-page-recipes--news-stories-with-filters"
  caption="News stories with filters — sidebar navigation, filter criteria, action row, and a dense headline list with metadata."
/>

## When to use

- Long-form news, policy, guidance, or editorial pages.
- Section pages where a sidebar helps readers understand location and sibling pages.
- News or archive pages where readers need keyword, topic, office, or date filtering.
- CMS templates where authors need constrained layout choices instead of freeform spacer and column controls.

## When not to use

- Application screens where the main task is data entry or transaction completion.
- Short landing pages or hub pages that work better with section bands and resource tiles.
- Navigation that must behave like a disclosure tree, menu, or route-aware app shell. That should be promoted to a component only after the interaction contract is clear.

## Layout contract

Use `.fdic-content-layout` inside a shell-aligned `.fdic-page-band__content` row:

```html
<section class="fdic-page-band" aria-label="Article content">
  <div class="fdic-page-band__content fdic-content-layout">
    <div class="fdic-content-layout__sidebar">
      <!-- section navigation -->
    </div>

    <article class="fdic-content-layout__main prose" aria-label="Article title">
      <!-- article body -->
    </article>
  </div>
</section>
```

The default layout uses a 320-ish sidebar rail and a readable content rail. At tablet and mobile widths, the sidebar stacks above the main content.

## Sidebar navigation

Use [Sidebar Nav](/components/sidebar-nav) for governed, repeated section navigation:

- Pass structured `root` and `items` data so the component can render native lists and links consistently.
- Pass `currentHref` or `currentId` from the current route. Do not mark multiple item objects as current.
- Use the optional `root` for the web-area link shown above the divider.
- Keep indentation shallow. The component supports four levels, but deeper trees usually need IA review.
- Do not use sidebar navigation for article table-of-contents links. Use the Prose table-of-contents pattern for in-page navigation.
- Do not wrap the sidebar in `aside` when it sits inside `main`; the labeled `nav` is the meaningful landmark.

The `.fdic-section-nav` class remains available as a legacy recipe bridge or low-level fallback when a page cannot use the Web Component yet. New governed section navigation should prefer `fd-sidebar-nav`.

## Article pages

Article pages should keep the main story in `.prose`:

- Use one page `h1` in `fd-page-header`.
- Start article body headings at `h2`.
- Put author, office, and date metadata before the cover image when present.
- Use `.fdic-article-media` for 16:9 cover images and captions.
- Omit the topics block when there are no topics.
- Keep related stories to a small set and use descriptive link text.

## Filtered news lists

Use `.fdic-content-filter` for filter controls above a list of results:

- Label the filter form with the visible heading.
- Use `fd-input` for keyword search and `fd-selector` for constrained choices.
- Keep actions in `.fdic-content-filter__actions`.
- Keep results as a real `ol` or `ul`; use `.fdic-headline-list` for dense headline-and-metadata rows.
- Provide an empty state when no results match. Do not leave a blank results area.

Filtering behavior belongs to the application or CMS integration. The design system owns the layout, spacing, semantics, and component composition.

## Accessibility

- Preserve landmark order: header, main, labeled section navigation, article or results section, feedback, footer.
- Sidebar links must have unique labels or enough surrounding context to distinguish them.
- Filter controls need visible labels and predictable reset behavior.
- Result counts and empty states should be announced in the application when filters update dynamically.
- Images need useful alt text when they convey story content. Use empty `alt` only for decorative related-story thumbnails.
- The layout must reflow without horizontal scrolling at 400% zoom and narrow mobile widths.

## Related guidance

- [Patterns](/guide/patterns)
- [Page Shell](/guide/foundations/page-shell)
- [Composition Patterns](/guide/foundations/composition-patterns)
- [Prose](/components/prose)
