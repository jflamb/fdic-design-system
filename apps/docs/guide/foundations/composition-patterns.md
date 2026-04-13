# Composition Patterns

This page documents the small set of reusable page-composition classes that ship in `@jflamb/fdic-ds-components/styles.css` for CMS and static-page consumers.

These patterns are intentionally lightweight:

- they use semantic HTML you author in the CMS template or content source
- they rely on the public `--fdic-*` layout, spacing, color, and typography tokens
- they do not replace first-class components such as `fd-page-header`, `fd-event-list`, or `fd-global-footer`

Use them when a page needs stable section and collection composition without introducing a new custom element.

## Required semantics

These classes style layout only. They do not add headings, landmarks, lists, or labels for you.

Use them with authored HTML that already carries the right meaning:

- wrap major page bands in `section` or `nav`
- name each landmark with `aria-labelledby` or `aria-label`
- keep heading order sensible and visible in the source HTML
- use real `ul` and `li` elements for repeated link groups
- use `aside` only when the content is supportive, not primary
- keep images meaningful when they convey information, or give them empty `alt` text when they are decorative

## Do not

- do not use `div` wrappers as the only structure for repeated links or grouped content
- do not use `role="list"` instead of a real list when `ul` and `li` work
- do not treat these classes as a page shell, navigation component, or accessibility layer
- do not skip headings or rely on CSS alone to imply hierarchy
- do not add one-off semantic workarounds that make the content harder to read or navigate

## Stable pattern surface

The following classes are part of the supported stylesheet contract:

- `.fdic-composition-section`
- `.fdic-composition-section__inner`
- `.fdic-composition-section--highlight`
- `.fdic-composition-section--warm`
- `.fdic-composition-feature-rail`
- `.fdic-composition-story`
- `.fdic-composition-story__media`
- `.fdic-composition-story__body`
- `.fdic-composition-link-grid`
- `.fdic-composition-link-card`
- `.fdic-composition-link-card__icon`
- `.fdic-composition-link-card__body`
- `.fdic-composition-link-columns`
- `.fdic-composition-link-column`
- `.fdic-composition-link-column__title`
- `.fdic-composition-link-column__list`
- `.fdic-composition-dual`
- `.fdic-composition-dual__panel`

These classes are additive CSS patterns, not components. They assume you keep the underlying HTML semantic and accessible.

## Section shell

Use `.fdic-composition-section` for a full-bleed page band and `.fdic-composition-section__inner` for the aligned content wrapper inside it.

```html
<section class="fdic-composition-section" aria-labelledby="latest-news-title">
  <div class="fdic-composition-section__inner">
    <h2 id="latest-news-title">Latest news</h2>
    <p>Section content goes here.</p>
  </div>
</section>
```

Modifiers:

- `.fdic-composition-section--highlight` adds the cool highlighted band treatment
- `.fdic-composition-section--warm` adds the warm supporting-band treatment

Use modifier classes only when the section surface itself needs that system treatment. Do not stack custom one-off color overrides on top without a documented reason.

## Feature rail

Use `.fdic-composition-feature-rail` when one primary content rail sits beside a supporting aside or message column.

```html
<section class="fdic-composition-section" aria-labelledby="feature-title">
  <div class="fdic-composition-section__inner fdic-composition-feature-rail">
    <article aria-labelledby="feature-story-title">
      <h2 id="feature-title">Featured story</h2>
      <div class="fdic-composition-story">
        <figure class="fdic-composition-story__media">
          <img src="/feature.png" alt="FDIC staff reviewing guidance on a laptop" />
        </figure>
        <div class="fdic-composition-story__body">
          <p class="fdic-eyebrow">Featured update</p>
          <h3 id="feature-story-title"><a href="/story">Story title</a></h3>
          <p>Supporting copy.</p>
          <p><a href="/story">Read the full update</a></p>
        </div>
      </div>
    </article>

    <section aria-labelledby="messages-title">
      <h2 id="messages-title">Messages</h2>
      <ul>
        <li><a href="/message">Message title</a></li>
      </ul>
    </section>
  </div>
</section>
```

Use a real `<aside>` only when the supporting rail is a top-level complementary landmark. If the rail sits inside another named section, a `section` is usually safer. On narrow screens, the pattern collapses to one column.

## Story split

Use `.fdic-composition-story` when an image or visual sits beside one short stack of content.

Recommended child structure:

- media wrapper: `.fdic-composition-story__media`
- text/action wrapper: `.fdic-composition-story__body`

Keep the body short and purposeful. If the content becomes a long article, switch back to a normal prose flow.

## Link grid

Use the link-grid pattern for a set of short linked resources with optional icons and one or two lines of supporting copy.

```html
<div class="fdic-composition-link-grid" role="list" aria-label="Featured links">
  <article class="fdic-composition-link-card" role="listitem">
    <span class="fdic-composition-link-card__icon" aria-hidden="true">
      <svg viewBox="0 0 32 32"></svg>
    </span>
    <div class="fdic-composition-link-card__body">
      <h3><a href="/resource">Performance management</a></h3>
      <p>Employee performance management program.</p>
    </div>
  </article>
</div>
```

Accessibility expectations:

- keep the resource title as a real heading or list label
- keep the repeated resources in a real `ul` with `li` items
- treat the icon as decorative unless it conveys unique meaning not present in text
- do not use this pattern for dense navigation trees or long descriptions

## Link columns

Use `.fdic-composition-link-columns` when several short related link groups share equal visual weight.

```html
<nav class="fdic-composition-section" aria-labelledby="tools-title">
  <div class="fdic-composition-section__inner">
    <h2 id="tools-title">Tools and services</h2>
    <div class="fdic-composition-link-columns">
      <section class="fdic-composition-link-column" aria-labelledby="benefits-title">
        <h3 id="benefits-title" class="fdic-composition-link-column__title">Benefits</h3>
        <ul class="fdic-composition-link-column__list">
          <li><a href="/tool-a">Tool A</a></li>
        </ul>
      </section>
    </div>
  </div>
</nav>
```

This pattern is appropriate for employee resources, service directories, and grouped utility links. It is not a substitute for application navigation menus.

Do not collapse the links into bare `div` elements:

```html
<div class="fdic-composition-link-columns">
  <div>
    <a href="/tool-a">Tool A</a>
    <a href="/tool-b">Tool B</a>
  </div>
</div>
```

That version looks similar, but it removes the landmark, heading, and list structure that screen readers and keyboard users depend on.

## Dual panel

Use `.fdic-composition-dual` when two peer content panels need equal weight on desktop and a clean single-column collapse on mobile.

```html
<section class="fdic-composition-section" aria-labelledby="spotlight-and-updates-title">
  <div class="fdic-composition-section__inner fdic-composition-dual">
    <h2 id="spotlight-and-updates-title">Employee spotlight and social updates</h2>
    <article class="fdic-composition-dual__panel">
      <h3>Employee spotlight</h3>
      <p>Supporting copy.</p>
    </article>
    <article class="fdic-composition-dual__panel">
      <h3>Social updates</h3>
      <p>Supporting copy.</p>
    </article>
  </div>
</section>
```

Use it for peers. If one panel is clearly secondary, prefer the feature-rail pattern instead.

## Guardrails

- Keep these classes at the page-composition layer. Do not reach into Web Component shadow DOM or use them to restyle component internals.
- Prefer existing components for alerts, page headers, event collections, cards, tiles, and navigation.
- Keep semantics in authored HTML. These classes do not add roles, headings, or landmarks for you.
- Use public `--fdic-*` tokens for any allowed overrides around these patterns.

## Related guidance

- [Spacing and Layout](./spacing-layout.md)
- [CMS Integration](/guide/cms-integration)
- [Using Tokens In Your Project](/guide/using-tokens)
