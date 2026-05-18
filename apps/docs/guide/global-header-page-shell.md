# Global Header And Page Shell Composition

Use this guide when a site or application needs to assemble `fd-global-header`, page-level navigation, content regions, feedback, and footer into one coherent shell.

The page shell is a composition contract, not a component. The design system provides Web Components, tokens, and documented layout classes. Applications, CMS themes, and framework layers adapt source data, routing, search, caching, and page state into those contracts.

## Core decision

Keep `fd-global-header` focused on the durable global header surface:

- brand or home-link content
- short utility actions
- primary global navigation
- local deterministic header-search suggestions
- cancelable search submit handoff
- optional shy-header behavior

Do not make `fd-global-header` responsible for the whole page shell. Local navigation, breadcrumbs, page actions, route focus, search results, and CMS-specific behavior belong outside the component.

## Canonical shell anatomy

The recommended shell order is:

```html
<div class="fdic-page" data-page-overflow="false">
  <fd-global-header></fd-global-header>

  <main id="main" class="fdic-page__main">
    <fd-page-header></fd-page-header>
    <!-- Route content, local navigation, alerts, forms, lists, or prose -->
  </main>

  <div class="fdic-page__chrome-end">
    <fd-page-feedback></fd-page-feedback>
    <fd-global-footer></fd-global-footer>
  </div>
</div>
```

This structure keeps landmarks predictable:

- the global header is the site or application banner
- the `main` element owns the route content
- local navigation is a labeled `nav` inside or adjacent to `main`
- footer and feedback remain bottom chrome, not fixed overlays

Use the [Page Shell](/guide/foundations/page-shell) foundation for width, gutter, and viewport-height layout rules.

## Ownership table

| Concern | Design system owns | Application or CMS layer owns |
| --- | --- | --- |
| Global header rendering | `fd-global-header` structure, desktop/mobile menu behavior, search surface, focus restoration for header-owned overlays | Navigation source data, current-page state, utility-slot content, route integration |
| Page identity | `fd-page-header` anatomy and slots | Breadcrumb data, page title, description, page-level actions |
| Local navigation | `fd-sidebar-nav` and `fd-sidebar-menu` component behavior | Route tree, current route, whether local nav appears on a route |
| Search | Header suggestion filtering and cancelable submit event | Remote search, loading, empty, error, analytics, results-page focus, URL state |
| Shy-header behavior | Hide/reveal state when `shy` is enabled, header height custom property, reduced-motion handling | Whether to enable `shy`, layout reservation, overflow detection, nested-scroll decisions |
| CMS/framework integration | Published package entrypoints, tokens, data helper contracts | Data fetching, caching, permissions, routing, Drupal or framework-specific adapters |

## Supported composition recipes

### Standard Content Shell

Use for ordinary public or internal content pages.

- `fd-global-header`
- `fd-page-header`
- one main content rail or page-band stack
- optional `fd-page-feedback`
- `fd-global-footer`

Keep page actions in `fd-page-header` or the route content, not in the global header utility slot.

### Content-Heavy Shell

Use for long-form articles, news sections, policy pages, or archives with local navigation.

- global header for site-wide movement
- `fd-page-header` for page identity and breadcrumbs
- `fd-sidebar-nav` for route-driven local navigation
- prose or collection layout in the main content rail

Do not put local section navigation inside the global-header drawer. On narrow viewports, collapse local navigation separately using the documented content-page recipe.

### Task Or Form Shell

Use for high-consequence workflows such as filings, updates, reviews, or confirmations.

- keep global navigation available but visually secondary to the task
- put task title, status, and primary actions in the page header or form content
- use `fd-form-field`, validation messages, and error summary inside `main`
- keep review and confirmation states route-owned

Do not add task-step navigation, submit state, or form progress to `fd-global-header`.

### Search Results Shell

Use when header search hands off to a full results page.

- header search remains the entry point
- the application cancels `fd-global-header-search-submit` only when it will route or fetch results itself
- loading, empty, error, result count, pagination, and focus behavior live near the results
- preserve the query in the URL

For unknown or unstable result counts, do not stretch `fd-pagination` beyond its bounded-page contract. Use a documented results pattern or application-owned behavior until unbounded result-set guidance is approved.

## Shy-header rules

`fd-global-header` supports opt-in `shy` behavior, but the shell owns whether and how to use it.

Use shy mode when:

- the page has vertical overflow
- reclaiming vertical space helps the route
- the header can be placed as a direct child of `body` or inside an ancestor that does not break fixed positioning

Avoid shy mode when:

- the page is short or task dense
- the header sits inside a transformed or constrained application frame
- the route scrolls inside a nested container
- other sticky shell regions would overlap without explicit choreography

The design system currently supports `window` scrolling only. Do not infer nested scroll-container support from the shell recipes. If a product needs nested scrolling, treat it as a future explicit API decision, not a theme workaround.

Layout reservation remains application-owned in v1. Use `.fdic-page[data-page-overflow="true"]` and `--fd-global-header-shy-height` as documented in [Page Shell](/guide/foundations/page-shell).

## Utility slot policy

The `utility` slot is for durable shell actions that remain useful across routes:

- help
- profile
- app switcher
- language or account affordances when approved by the product shell

Do not use the utility slot for:

- page-specific primary actions
- filters
- local navigation
- form submit actions
- temporary alerts
- route tabs

Those belong in `fd-page-header`, the route content, or a local navigation component.

## Mobile behavior

The global header mobile drawer owns global navigation and global search only.

Keep these separate:

- global navigation in `fd-global-header`
- local section navigation in `fd-sidebar-nav` or `fd-sidebar-menu` placement patterns
- breadcrumbs in `fd-page-header`
- page actions in the page header or content

Do not merge local navigation, task steps, filters, or page actions into the global header drawer. That makes scope ambiguous and creates avoidable focus and wayfinding risk.

## Accessibility checklist

Every shell composition must preserve:

- one skip link targeting `#main`
- one primary `main` landmark
- labeled `nav` landmarks for global, local, and breadcrumb navigation
- native links for navigation destinations
- visible focus across header, local nav, content, feedback, and footer
- no hidden-but-focusable shell regions
- route-owned focus after search, pagination, or route changes
- reduced-motion-safe behavior for header and overlay transitions

Do not use scroll position alone to change landmark semantics. The current shy-header contract keeps the header semantically stable while translated out of view. Any future `aria-hidden` or assistive-technology exposure change needs concrete testing evidence.

## CMS and framework boundary

CMS and framework layers may adapt source data into the design-system contract. They should not move design authority into the integration layer.

This package owns:

- Web Component APIs
- design tokens
- published stylesheet entrypoints
- framework-agnostic helpers
- documented composition rules

Drupal or other CMS integration layers own:

- source-specific menu loading and caching
- routing
- permissions and visibility
- remote search integration
- theme library wiring
- source-payload normalization before assigning component properties

The design system may document a Drupal adoption path, but Drupal-specific adapter code and product integration behavior should remain outside the core page-shell contract.

## Unsupported for v1

These are intentionally not part of the current shell contract:

- condensed global-header variant
- automatic layout spacer insertion by `fd-global-header`
- automatic scroll-container detection
- nested scroll-container support
- global-header ownership of local navigation
- remote search providers inside the header
- in-header loading, empty, or error states for search results
- data-rich breadcrumbs beyond the current page-header contract

Track these as narrower follow-up issues when adopter evidence proves the need.

## Related guidance

- [Page Shell](/guide/foundations/page-shell)
- [Navigation Shell Reference](/guide/navigation-shell-reference)
- [Content Page Recipes](/guide/content-page-recipes)
- [CMS Integration](/guide/cms-integration)
- [Global Header](/components/global-header)
- [Page Header](/components/page-header)
- [Sidebar Nav](/components/sidebar-nav)
