# Pagination

Pagination helps people move through a bounded set of content pages without losing their place. `fd-pagination` ships the FDIC desktop and mobile layouts for known page counts while keeping page state owned by the application.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-pagination</code> when a collection or result set has a known last page and people need to move between discrete pages. The component renders a real pagination landmark, keeps native controls in plain tab order, and collapses to a compact mobile page picker when space is tight.</p>
</div>

## When to use

- **The last page is known** — `fd-pagination` is for bounded sets such as “24 pages of results” or “12 pages of articles.”
- **People need orientation as well as navigation** — The current page, neighboring pages, and last page stay visible so users can gauge progress quickly.
- **The layout needs a narrow-screen fallback** — The component swaps the desktop page list for a mobile page picker rather than forcing horizontal scrolling.

## When not to use

- **Don't use it for unbounded search results** — If the total page count is unknown or unstable, this v1 component is the wrong fit.
- **Don't use it for steps in a workflow** — Checkouts, onboarding, and multi-step forms need progress or step indicators, not page navigation.
- **Don't use it when “load more” or infinite scroll is the established pattern** — Pagination is most useful when users need stable locations and page numbers.

## Examples

<StoryEmbed
  storyId="components-pagination--docs-overview"
  linkStoryId="components-pagination--playground"
  height="420"
  caption="Desktop first, middle, and last page states plus the compact mobile fallback. Open Storybook to test action mode, link mode, and different page counts."
/>

<StoryEmbed
  storyId="components-pagination--mobile-collapsed"
  linkStoryId="components-pagination--playground"
  height="120"
  caption="The mobile layout replaces the desktop page list with a native page select, visible current-page summary, and the same previous/next controls."
/>

## Usage

Action mode keeps navigation application-owned and emits `fd-page-request`:

```html
<fd-pagination
  current-page="7"
  total-pages="24"
  aria-label="Search results pages"
></fd-pagination>

<script type="module">
  const pagination = document.querySelector("fd-pagination");

  pagination.addEventListener("fd-page-request", (event) => {
    const { page } = event.detail;
    pagination.setAttribute("current-page", String(page));
    // Update the surrounding results for the requested page.
  });
</script>
```

Link mode generates real page URLs from `href-template`:

```html
<fd-pagination
  current-page="7"
  total-pages="24"
  href-template="/results?page={page}"
  aria-label="Search results pages"
></fd-pagination>
```

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `current-page` | `number` | `1` | Current page in the bounded set. Values below `1` normalize to `1`; values above `total-pages` clamp to the last page for rendering. |
| `total-pages` | `number` | `1` | Total number of pages in the bounded set. V1 intentionally requires a known last page. |
| `href-template` | `string \| undefined` | `undefined` | Optional href template for link mode. Use a `{page}` token, for example `/results?page={page}`. |

- Set `aria-label` on `fd-pagination` when more than one pagination landmark appears on the page.
- Without `href-template`, the component stays action-based and emits `fd-page-request` for the application to handle.

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-page-request` | `CustomEvent<{ page: number, href?: string }>` | Fired when the user requests another page from a numbered control, previous/next control, or the mobile page select. |

Cancel `fd-page-request` to intercept link-mode navigation, including the mobile select behavior when `href-template` is present.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-pagination-gap` | `var(--fdic-spacing-xl, 24px)` | Gap between previous/next controls and the desktop page list. |
| `--fd-pagination-page-gap` | `var(--fdic-spacing-xs, 8px)` | Gap between numbered desktop page items. |
| `--fd-pagination-mobile-gap` | `var(--fdic-spacing-sm, 12px)` | Gap between controls in the mobile layout. |
| `--fd-pagination-control-min-size` | `44px` | Minimum touch target size for pagination controls. |
| `--fd-pagination-radius` | `var(--fdic-corner-radius-sm, 3px)` | Corner radius for controls and the mobile page select. |
| `--fd-pagination-control-bg` | `var(--fdic-color-bg-interactive, #f5f5f7)` | Background for non-current page controls. |
| `--fd-pagination-control-color` | `var(--fdic-color-text-primary, #212123)` | Text color for non-current page controls and the mobile summary. |
| `--fd-pagination-control-bg-disabled` | `var(--fdic-color-bg-container, #f5f5f7)` | Background for disabled previous/next controls. |
| `--fd-pagination-control-color-disabled` | `var(--fdic-color-text-disabled, #9e9ea0)` | Text color for disabled controls and ellipsis items. |
| `--fd-pagination-current-bg` | `var(--fdic-color-bg-active, #0d6191)` | Background for the current page control. |
| `--fd-pagination-current-color` | `var(--fdic-color-text-inverted, #ffffff)` | Text color for the current page control. |
| `--fd-pagination-select-bg` | `var(--fdic-color-bg-input, #ffffff)` | Background for the mobile page select. |
| `--fd-pagination-select-border` | `var(--fdic-border-input-rest, #bdbdbf)` | Border color for the mobile page select. |
| `--fd-pagination-focus-gap` | `var(--fdic-color-bg-input, #ffffff)` | Inner gap color in the focus ring. |
| `--fd-pagination-focus-ring` | `var(--fdic-color-border-input-focus, #38b6ff)` | Outer focus ring color. |
| `--fd-pagination-collapse-at` | `480px` | Width threshold below which the component switches to the mobile layout. |

## Shadow parts

| Name | Description |
|---|---|
| `nav` | Internal pagination landmark. |
| `list` | Desktop unordered list of numbered page controls. |
| `item` | Desktop list item wrapper for a page control or ellipsis. |
| `control` | Internal previous, next, or page control. |
| `ellipsis` | Ellipsis marker used when page ranges are omitted. |
| `mobile-select` | Mobile native page select. |
| `mobile-summary` | Mobile `of N` page-count summary. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Label the navigation for its content set</h4>
    <p>Use <code>aria-label</code> values such as “Search results pages” or “Article archive pages,” especially when a page includes more than one pagination landmark.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on “Pagination” alone when context is ambiguous</h4>
    <p>Generic naming makes it harder for screen reader users to distinguish multiple page-navigation regions.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep the current page in sync with the content</h4>
    <p>When `fd-page-request` fires in action mode, update both the visible results and the component’s <code>current-page</code> value together.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Leave the component visually stale after a page change</h4>
    <p>If the page content updates but the current-page marker does not, users lose trust in both the navigation and the results.</p>
  </div>
</div>

## Content guidelines

- **Name the landmark for the content, not the mechanism** — “Search results pages” is more useful than “Pagination.”
- **Place pagination near the results it controls** — Users should not have to guess which collection or table the page picker affects.
- **Preserve a heading or summary outside the component** — `fd-pagination` shows position, but the surrounding page should still explain what content is being paged.
- **Use the same page count in nearby summary text** — If the page says “24 pages of results,” the component should also reflect `total-pages="24"`.

## Accessibility

- `fd-pagination` renders an internal **`<nav>` landmark**. Set `aria-label` on the host whenever the page contains more than one pagination region.
- The desktop layout uses **native controls in plain tab order**. It does not implement roving tabindex, arrow-key navigation, or active-descendant behavior.
- The current page uses **`aria-current="page"`** so screen readers can announce the user’s present location inside the set.
- Disabled edge controls remain visible on the first and last page because the supplied FDIC design keeps them in view. They are still **non-interactive** in those states.
- The mobile layout uses a **native `<select>`** with an accessible name of “Page” plus a visible `of N` summary for context.
- `focus()` on the host delegates to the current page control in desktop mode and to the mobile select in collapsed mode.
- The component does **not move focus after a page request**. If the surrounding application refreshes results in place, it owns any follow-up focus strategy such as moving to a results heading.

## Known limitations

- **Bounded sets only in v1** — The component requires a known last page and does not model unbounded search-result pagination.
- **No dedicated First / Last text controls** — The component always shows numbered first and last page items instead.
- **No custom page-window configuration** — The desktop range follows the shipped FDIC pattern rather than exposing sibling-count or slot-based overrides.
- **English visible labels are fixed in v1** — The public contract does not yet expose localization hooks for “Previous,” “Next,” “Prev,” or `of N`.

## Related components

<ul class="fdic-related-list">
  <li><a href="./link">Link</a> — Use <code>fd-link</code> when you need standalone hyperlinks, not a managed page-navigation pattern.</li>
  <li><a href="./selector">Selector</a> — The mobile pagination layout uses a compact page picker pattern, but <code>fd-selector</code> remains the general-purpose form field for authored option sets.</li>
  <li><a href="./button">Button</a> — Pagination borrows familiar FDIC action sizing, but its controls are tied to page navigation rather than generic actions.</li>
</ul>
