# Global Header

The global header provides the masthead, primary navigation, responsive grouped navigation, and integrated header search for FDIC sites and applications.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-global-header</code> for site-level or application-level navigation when you need a reusable brand area, utility actions, grouped navigation panels, a mobile drill-down drawer, and a local header-search experience driven entirely by consumer-provided data.</p>
</div>

## When to use

- **The page needs one durable site header contract** — The brand area, utility actions, primary navigation, and search belong together and should stay consistent across routes.
- **Some top-level items are direct links and others expand into grouped navigation** — The component supports both without switching to action-menu semantics.
- **The information architecture already exists in application data** — The component expects navigation and search configuration to be passed in as JavaScript data, not fetched by the component.

## When not to use

- **Don't use it for local section navigation** — `fd-global-header` is for the site or application shell, not a page subsection.
- **Don't use it when the framework shell already owns the masthead semantics** — If another shell controls primary navigation, avoid nesting a second site header.
- **Don't use it as an action menu or command palette** — The component renders navigation, not command actions. `fd-menu` remains the action-menu primitive.
- **Don't use it when the component would need to fetch its own navigation or search data** — In v1, the application owns the information architecture payload.

## Examples

<StoryEmbed
  storyId="components-global-header--docs-overview"
  linkStoryId="components-global-header--desktop-mega-menu"
  height="460"
  caption="Global Header overview — desktop masthead, grouped navigation, and integrated search in the default documentation preview. Use Storybook to inspect the dedicated mobile drawer story."
/>

- Pass the navigation tree as a JavaScript property. Assign a new array or object when content changes so the component can re-render.
- Use the `brand` slot for the branded home link or wordmark content.
- Use the `utility` slot for application-specific support links or actions. Keep the set short and high-value.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `navigation` | `FdGlobalHeaderNavigationItem[]` | `[]` | Consumer-provided navigation tree. Set this as a JavaScript property; it is not reflected to an HTML attribute. |
| `search` | `FdGlobalHeaderSearchConfig \| null` | `null` | Optional header-search configuration. When present, the component renders desktop and mobile search surfaces and derives suggestions from `navigation`. |

- `fd-global-header` owns its open, preview, drill-down, and query state internally. The application owns navigation data, current-link flags, and routing.
- Assign a new array or object when updating `navigation` or `search` so Lit can detect the change.

## Slots

| Name | Description |
|---|---|
| `brand` | Required brand or home-link content for the masthead |
| `utility` | Optional utility links or actions rendered in the masthead |

- Author brand and utility content as real links or controls. The component only provides the layout and state management.

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-global-header-search-submit` | `{ query: string, href: string, firstMatchHref?: string, surface: \"desktop\" \| \"mobile\" }` | Cancelable event fired when the user submits header search. If not canceled, the component navigates to `firstMatchHref` when a direct match exists or to `href` as the configured fallback results URL. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-global-header-border-color` | `var(--fdic-border-divider, #bdbdbf)` | Border color for masthead and navigation separators |
| `--fd-global-header-panel-border-color` | `var(--fdic-border-divider, #bdbdbf)` | Border color for desktop and mobile navigation panels |
| `--fd-global-header-surface` | `#ffffff` | Base masthead and top-nav surface color |
| `--fd-global-header-panel-surface` | `var(--fdic-background-base, #ffffff)` | Desktop mega-menu, mobile drawer, and search-popover surface color |
| `--fd-global-header-accent` | `var(--ds-color-bg-active, #0d6191)` | Accent color used for active top-level items and the search submit button |
| `--fd-global-header-focus-gap` | `var(--ds-color-bg-input, #ffffff)` | Inner gap color for the focus ring |
| `--fd-global-header-focus-ring` | `var(--ds-color-border-input-focus, #38b6ff)` | Outer focus-ring color |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root header wrapper |
| `masthead` | Top masthead row containing the brand, utilities, and search |
| `primary-nav` | Desktop primary navigation region |
| `panel` | Desktop attached mega-menu panel |
| `panel-column` | Individual desktop panel columns |
| `mobile-drawer` | Mobile drawer surface |
| `search-form` | Search form wrapper for desktop and mobile search surfaces |
| `search-results` | Search suggestion list surface |

- `fd-global-header` intentionally does not expose every internal row or cell as a styling hook. Keep theming focused on the documented surfaces.
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Author real navigation destinations</h4>
    <p>Use actual URLs for top-level links, panel overviews, section links, and child links so search suggestions and mobile drill-down links stay useful.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Feed prototype-only placeholders into production layouts</h4>
    <p>Empty links, fake hrefs, or CMS-specific placeholders make the header harder to test and less trustworthy for users.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep the public family small</h4>
    <p>Use one <code>fd-global-header</code> instance with slots and data. Publish follow-on utilities only when the design system has a clear semantic reason.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Force navigation into <code>fd-menu</code></h4>
    <p>The header family needs navigation semantics. <code>fd-menu</code> is the action-menu primitive and is intentionally not reused for the mega-menu contract.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Keep top-level labels short and durable.</strong>
  <p>Top-level labels should describe stable navigation areas, not campaign language or temporary slogans.</p>
</div>

<div class="fdic-content-rule">
  <strong>Use section and item descriptions for orientation, not marketing copy.</strong>
  <p>The desktop panel and mobile drill-down surfaces use descriptions to help people decide where to go next. Keep the text brief and task-oriented.</p>
</div>

<div class="fdic-content-rule">
  <strong>Document the fallback search destination.</strong>
  <p>If no direct destination matches the query, the component falls back to the configured search results URL. Make sure that destination exists and is understandable to users.</p>
</div>

## Accessibility

- **Semantics stay native** — Top-level direct destinations render as links. Grouped destinations render as disclosure buttons. Desktop panel and mobile drill-down content render as navigation structures, not action menus.
- **Keyboard model is intentionally bounded** — Top-level desktop items support Left, Right, Home, End, and ArrowDown convenience. Panel content, mobile drill-down content, and search suggestions stay in plain tab order.
- **Focus restoration is component-owned only for ephemeral surfaces** — Closing the desktop panel, mobile drawer, or mobile search surface returns focus to the invoking control when it still exists. Broader page-level focus after navigation remains application-owned.
- **Closed content must stay out of the tab order** — The component hides closed desktop and mobile surfaces so keyboard users do not tab into unavailable content.
- **Search is local and deterministic in v1** — Suggestions are derived only from the supplied navigation tree and search configuration. The fallback submission path is explicit and testable.
- **Multiple instances are supported** — The component does not rely on global IDs or singleton state. If multiple headers render in Storybook or docs, their controls do not collide.

## Known limitations

- The component expects navigation and search data to be supplied by the application. It does not fetch CMS data or search results.
- Utility-slot content does not get a dedicated alternate mobile placement contract in v1.
- Richer async search-result providers, sticky/condensed header variants, and broader shell composition are intentionally deferred.

## Related components

- [Button](/components/button)
- [Icon](/components/icon)
- [Input](/components/input)
- [Menu](/components/menu)
