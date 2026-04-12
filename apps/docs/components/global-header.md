# Global Header

The global header provides the FDICnet-style masthead, attached mega-menu, mobile drill-down drawer, and composed header-search family for FDIC sites and applications.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-global-header</code> when the product needs the approved FDICnet header pattern with a top-level search component, reference-aligned grouped navigation, and application-owned information architecture.</p>
</div>

## When to use

- **The page needs one durable site header contract** — The brand area, utility actions, primary navigation, and search belong together and should stay consistent across routes.
- **The experience needs the approved FDICnet header structure** — The desktop trigger row, attached three-column mega-menu, mobile drill-down hierarchy, and search behavior are designed to match the approved reference closely.
- **Some top-level items are direct links and others expand into grouped navigation** — The component supports both without switching to action-menu semantics.
- **The information architecture already exists in application data** — The component expects navigation and search configuration to be passed in as JavaScript data, not fetched by the component.

## When not to use

- **Don't use it for local section navigation** — `fd-global-header` is for the site or application shell, not a page subsection.
- **Don't use it when the framework shell already owns the masthead semantics** — If another shell controls primary navigation, avoid nesting a second site header.
- **Don't use it as an action menu or command palette** — The component renders navigation, not command actions. `fd-menu` remains the action-menu primitive.
- **Don't use it when the component would need to fetch its own navigation or search data** — Runtime content stays framework-agnostic and application-provided.

## Examples

<StoryEmbed
  storyId="components-global-header--desktop"
  linkStoryId="components-global-header--shy-header"
  height="520"
  caption="Reference-aligned desktop story using the exact FDICnet main-menu YAML-derived fixture. Storybook also includes dedicated shy-header, search-open, mobile drawer, and mobile drill-down states."
/>

- Pass the navigation tree as a JavaScript property. Assign a new array or object when content changes so the component can re-render.
- Use the `brand` slot for the branded home link or wordmark content.
- Use the `utility` slot for application-specific support links or actions. Keep the set short and high-value.
- Enable `shy` only on pages that benefit from reclaiming vertical space while scrolling. Keep it off by default for short or highly task-dense screens.
- The reference stories and tests use the exact exported fixture from <code>packages/components/src/components/fd-global-header.reference-content.ts</code> and <code>packages/components/src/components/fd-global-header.reference.ts</code>.

## Integration contract

- Treat `FdGlobalHeaderNavigationItem[]` as the canonical runtime contract.
- Normalize CMS or API payloads before assigning `navigation` and `search`.
- Keep fetching and source-specific payload handling outside the component.
- Use `@jflamb/fdic-ds-components` for generic content helpers and `@jflamb/fdic-ds-components/fd-global-header-drupal` for Drupal-oriented structural mapping.

```ts
import { createFdGlobalHeaderContent } from "@jflamb/fdic-ds-components";
import { createFdGlobalHeaderContentFromDrupal } from "@jflamb/fdic-ds-components/fd-global-header-drupal";

const content = createFdGlobalHeaderContentFromDrupal({
  items: drupalMenuItems,
  search: {
    action: "/search",
    label: "Search FDICnet",
    placeholder: "Search FDICnet",
  },
});

const header = document.querySelector("fd-global-header");

if (header) {
  const resolved = createFdGlobalHeaderContent(content);
  header.navigation = resolved.navigation;
  header.search = resolved.search ?? null;
}
```

- The Drupal helper targets a minimal structural menu shape. It does not fetch Drupal data and it does not require one exact backend response format.
- The header contract supports one top-level row, section groups, section items, and one nested child-link level. Normalize deeper CMS trees before passing them to the helper.

### Generic workflow

1. Fetch or assemble menu data in the application layer.
2. Normalize the source payload into the design system's content contract.
3. Assign a fresh `navigation` array and `search` object to `fd-global-header`.
4. Handle routing or search submit interception at the application layer when needed.

### Shy header adoption

- Set `shy` to opt into the sticky hide/reveal behavior. Leave it unset to preserve the current in-flow header behavior.
- When `shy` is enabled the header switches to `position: fixed` and exposes `--fd-global-header-shy-height` on the host element. The consumer is responsible for reserving space in the document flow using this property (e.g., `padding-top` on a wrapper).
- On desktop, scrolling down past the threshold hides the full header and reveals a **compact sticky header** with the brand, utility actions, and a menu toggle for accessing the full navigation. Scrolling back up reveals the full header. The transition between states is animated (250ms ease).
- On mobile, scrolling down hides the header entirely (`translateY(-100%)`). Scrolling up reveals it. There is no compact mobile variant.
- Use `shyThreshold` when the page needs a threshold that differs from the header's own height.
- The component owns scroll tracking, hide/reveal state, transition timing, and overlay awareness.
- The application owns whether shy mode should be enabled, any `shyThreshold` override, and surrounding page layout (including reserving space for the fixed header).
- **Placement requirement:** Shy mode uses `position: fixed`. The header must be a direct child of `<body>` or an ancestor without `transform`, `filter`, or `perspective` — these CSS properties create a new containing block and break fixed positioning.

```html
<div class="page-wrapper">
  <fd-global-header shy></fd-global-header>
  <main>…</main>
</div>

<style>
  .page-wrapper {
    padding-top: var(--fd-global-header-shy-height, 0px);
  }
</style>
```

```ts
const header = document.querySelector("fd-global-header");

if (header) {
  header.navigation = resolved.navigation;
  header.search = resolved.search ?? null;
  header.shy = true;
  header.shyThreshold = 64;
}
```

Use the generic helpers when the source is already close to the header contract:

```ts
import {
  createFdGlobalHeaderContent,
  createFdGlobalHeaderSearchConfig,
  createHeaderSearchItemsFromNavigation,
} from "@jflamb/fdic-ds-components";

const navigation = [
  {
    kind: "panel",
    id: "services",
    label: "Services",
    sections: [
      {
        label: "Services Overview",
        href: "/services",
        items: [],
      },
      {
        label: "Programs",
        href: "/services/programs",
        items: [
          {
            label: "Bank Data",
            href: "/services/programs/bank-data",
          },
        ],
      },
    ],
  },
];

const content = createFdGlobalHeaderContent({
  navigation,
  search: createFdGlobalHeaderSearchConfig({
    action: "/search",
    label: "Search",
    items: createHeaderSearchItemsFromNavigation(navigation),
  }),
});
```

### Drupal integration guide

The Drupal helper is designed for the common case where Drupal already exposes a menu tree through preprocess output, JSON, JSON:API, GraphQL, or a custom controller. The helper expects a small structural shape rather than one specific Drupal response contract.

#### Recommended integration pattern

- Query or build the Drupal menu tree outside the Web Component.
- Map the Drupal payload into the helper's structural `items` shape.
- Let `createFdGlobalHeaderContentFromDrupal()` convert that shape into `navigation` and default search items.
- Override search labels or the fallback search URL in the `search` option when the product shell needs different copy.

#### Minimal Drupal-shaped input

```ts
import { createFdGlobalHeaderContentFromDrupal } from "@jflamb/fdic-ds-components/fd-global-header-drupal";

const content = createFdGlobalHeaderContentFromDrupal({
  items: [
    {
      title: "News & Events",
      url: "/news-events",
      description: "Stay current with FDIC announcements and events.",
      below: [
        {
          title: "News",
          url: "/news-events/news",
          below: [
            {
              title: "FDICNews",
              url: "/news-events/news/fdicnews",
            },
            {
              title: "Global Messages",
              url: "/news-events/news/global-messages",
              below: [
                {
                  title: "Global Digest FAQ",
                  url: "/news-events/news/global-messages/global-digest-faq",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Benefits",
      url: "/benefits",
      current: true,
    },
  ],
  search: {
    action: "/search",
    label: "Search FDICnet",
    placeholder: "Search FDICnet",
  },
});
```

#### What the Drupal helper does

- Top-level items with no `below` array become direct header links.
- Top-level items with children become mega-menu panels.
- Second-level items become panel sections.
- Third-level items become section items.
- Fourth-level items become the nested child-link column.
- Search items are derived automatically from the normalized navigation tree unless you provide your own `search.items`.
- A top-level item marked `current` or containing a current descendant marks the corresponding header item as current.

#### What the Drupal helper does not do

- It does not fetch Drupal menu data.
- It does not understand every possible Drupal response field automatically.
- It does not preserve arbitrary tree depth beyond the header's supported information architecture.
- It does not replace application-owned routing, caching, or access-control decisions.

#### Normalizing a raw Drupal payload

If your Drupal response uses different field names, map it into the structural helper input before calling the adapter:

```ts
import { createFdGlobalHeaderContentFromDrupal } from "@jflamb/fdic-ds-components/fd-global-header-drupal";

function normalizeDrupalMenuItem(item) {
  return {
    id: item.id,
    title: item.title,
    url: item.url?.path || item.url || undefined,
    description: item.description || item.summary || undefined,
    current: Boolean(item.in_active_trail),
    below: (item.children || item.below || []).map(normalizeDrupalMenuItem),
  };
}

const content = createFdGlobalHeaderContentFromDrupal({
  items: drupalMenu.items.map(normalizeDrupalMenuItem),
  search: {
    action: "/search",
    label: "Search FDICnet",
  },
});
```

#### Drupal implementation notes

- Prefer producing the structural `items` shape in the Drupal integration layer rather than passing raw backend payloads throughout the frontend.
- If the Drupal tree is deeper than four levels, choose intentionally which levels belong in the header and flatten or reroute the rest.
- Use stable URLs and durable labels. Search suggestions and mobile drill-down behavior become less trustworthy when menu entries rely on placeholders or temporary campaign language.
- If Drupal owns active-trail state, map it into `current` during normalization so the header reflects the current destination consistently.
- If the site needs custom search suggestions, pass `search.items` explicitly instead of relying on derived items.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `navigation` | `FdGlobalHeaderNavigationItem[]` | `[]` | Consumer-provided navigation tree. Set this as a JavaScript property; it is not reflected to an HTML attribute. |
| `search` | `FdGlobalHeaderSearchConfig \| null` | `null` | Optional header-search configuration. When present, the component renders desktop and mobile search surfaces and derives suggestions from `navigation`. |
| `shy` | `boolean` | `false` | Opt-in sticky hide/reveal behavior. When `true`, the header uses `position: fixed` and exposes `--fd-global-header-shy-height`. On desktop, scrolling down transitions to a compact header. Reveals the full header on upward scroll or immediate interaction. |
| `shyThreshold` | `number \| undefined` | `undefined` | Optional downward-scroll threshold in pixels before shy behavior engages. When omitted, `fd-global-header` uses its own rendered height. |

- `fd-global-header` owns desktop menu preview state, mobile drill-down state, the shared query string coordinated with `fd-header-search`, shy-header scroll tracking, and compact desktop state when `shy` is enabled.
- The application owns navigation data, current-link flags, routing, any custom submit handling, and page-layout decisions related to sticky shy mode.
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
| `--fd-global-header-shy-transition-duration` | `0.3s` | Hide-transition duration used when `shy` is enabled. Reveal timing is derived internally as a proportionally faster transition. |
| `--fd-global-header-shy-height` | — | Read-only. Set on the host when `shy` is enabled. Contains the header's full (non-compact) rendered height as a pixel value. Use it on a parent wrapper to reserve space for the fixed header (e.g., `padding-top: var(--fd-global-header-shy-height, 0px)`). Removed when `shy` is disabled. |

- `--fd-global-header-shy-transition-duration` is ignored when the user requests reduced motion because the component suppresses shy-header transitions entirely.
- `--fd-global-header-shy-height` updates automatically when the header resizes (e.g., viewport changes).

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root header wrapper |
| `masthead` | Top masthead row containing the brand, utilities, and search |
| `primary-nav` | Desktop primary navigation region |
| `panel` | Desktop attached mega-menu panel |
| `panel-column` | Individual desktop panel columns |
| `mobile-drawer` | Mobile drawer surface |

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
    <h4>Feed placeholder-only links into production layouts</h4>
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
- **Keyboard model follows the approved header interaction pattern without giving up semantics** — Top-level desktop items support Left, Right, Home, End, and ArrowDown convenience. Mega-menu columns support directional movement between rows and columns. Mobile drill-down and search surfaces stay link/button based.
- **Focus restoration is component-owned only for ephemeral surfaces** — Closing the desktop panel, mobile drawer, or mobile search surface returns focus to the invoking control when it still exists. Broader page-level focus after navigation remains application-owned.
- **Shy mode never hides the header from focused users** — When `shy` is enabled, focus moving into the header reveals it immediately and keeps it visible while the desktop panel, mobile drawer, or mobile search surface is open. In the compact desktop state, the full navigation remains accessible via the compact menu toggle button.
- **Compact-mode transitions respect reduced motion** — The animated transition between full and compact header states (padding, scale, opacity) is suppressed when users request reduced motion.
- **Mobile overlays behave like true modal surfaces only while open** — The menu drawer and mobile search shell trap focus while open, restore focus to their invoking control on close, and do not keep dialog semantics attached when hidden.
- **Closed content stays out of the tab order** — The component hides closed desktop and mobile surfaces so keyboard users do not tab into unavailable content.
- **Reduced motion is honored across the full component** — Non-essential transitions and animations are suppressed when users request reduced motion, including overlay, mega-menu, and shy-header state changes.
- **Search is local and deterministic in v1** — Suggestions are derived only from the supplied navigation tree and search configuration. The fallback submission path is explicit and testable.
- **Multiple instances are supported** — The component does not rely on global IDs or singleton state. If multiple headers render in Storybook or docs, their controls do not collide.

## Known limitations

- The component expects navigation and search data to be supplied by the application. It does not fetch CMS data or search results.
- Utility-slot content does not get a dedicated alternate mobile placement contract in v1.
- Shy mode uses `position: fixed`, which positions the header relative to the viewport. It requires the header to be a direct child of `<body>` or an ancestor without `transform`, `filter`, `perspective`, or `will-change` set — any of these on an ancestor creates a new containing block and breaks fixed positioning. Do not enable `shy` when the header lives inside a constrained shell, embedded app frame, or transformed container.
- Configurable scroll-container support (e.g., observing a scrollable ancestor other than `window`) and broader shell composition are intentionally deferred.

## Related components

- [Button](/components/button)
- [Drawer](/components/drawer)
- [Header Search](/components/header-search)
- [Icon](/components/icon)
- [Input](/components/input)
- [Menu](/components/menu)
