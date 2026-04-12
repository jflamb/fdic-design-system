# CMS Integration

Use this guide when a CMS needs to consume FDIC tokens, styles, or Web Components without a framework-specific application shell.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Platform patterns</span>
  <p>The supported CMS path is progressive enhancement: load the shared stylesheet, register the components you need, and keep authored markup semantic so the page remains understandable before JavaScript upgrades complete.</p>
</div>

## Minimum browser-delivered assets

Every CMS integration needs the same two runtime assets:

```html
<link rel="stylesheet" href="/assets/fdic-ds/styles.css" />
<script type="module" src="/assets/fdic-ds/register-all.js"></script>
```

These map to the published package entrypoints:

- `@jflamb/fdic-ds-components/styles.css`
- `@jflamb/fdic-ds-components/register-all`

That pair is the stable browser-delivered contract for CMS adopters. Avoid reaching into unpublished workspace paths or generated source files from theme code.

If your CMS build prefers selective registration, you can ship only the components you use instead of `register-all`.

## Script-tag adoption

For static or CMS-rendered pages, compile the package assets into your frontend bundle and reference the output files directly.

```html
<link rel="stylesheet" href="/themes/custom/fdic-ds/styles.css" />
<script type="module" src="/themes/custom/fdic-ds/register-all.js"></script>

<fd-button variant="primary">Submit filing</fd-button>
<fd-alert variant="info" heading="Before you continue">
  Review the filing instructions before uploading supporting documents.
</fd-alert>
```

Keep the HTML meaningful even before upgrade:

- use headings, lists, and landmarks in the surrounding CMS template
- keep button and link labels explicit
- do not rely on client-side JavaScript to provide trust or privacy language

## Drupal pattern

Use Twig to render the custom element markup and attach the shared library from the theme or module.

### Theme library definition

```yaml
fdic_design_system:
  css:
    theme:
      dist/fdic-ds/styles.css: {}
  js:
    dist/fdic-ds/register-all.js:
      type: module
```

### Twig usage

```twig
{{ attach_library('fdic_theme/fdic_design_system') }}

<fd-page-header>
  <nav slot="breadcrumbs" aria-label="Breadcrumb">
    <a href="/institutions">Institutions</a>
  </nav>
  <h1 slot="heading">{{ page_title }}</h1>
  <p slot="description">
    Review the current institution profile and filing deadlines.
  </p>
</fd-page-header>

<fd-button href="/filings/start" variant="primary">
  Start filing
</fd-button>
```

### Drupal global header source mapping

The components package publishes `fd-global-header-drupal` for turning a Drupal menu tree into the `fd-global-header` navigation data model.

```ts
import {
  createFdGlobalHeaderContentFromDrupal,
} from "@jflamb/fdic-ds-components/fd-global-header-drupal";

const headerContent = createFdGlobalHeaderContentFromDrupal({
  items: drupalMenuItems,
  search: {
    action: "/search",
    label: "Search FDIC.gov",
    placeholder: "Search FDIC.gov",
    submitLabel: "Open first matching result",
    searchAllLabel: "Search all FDIC.gov",
  },
});
```

Use that adapter when your Drupal frontend needs the navigation structure but the authoritative menu data still comes from Drupal.

## WordPress block pattern

Use block templates or rendered block HTML to place the custom elements, then enqueue the shared assets from the theme.

```php
function fdic_enqueue_design_system() {
  wp_enqueue_style(
    'fdic-ds-styles',
    get_theme_file_uri('/assets/fdic-ds/styles.css'),
    array(),
    null
  );

  wp_enqueue_script_module(
    'fdic-ds-register-all',
    get_theme_file_uri('/assets/fdic-ds/register-all.js'),
    array(),
    null
  );
}
add_action('wp_enqueue_scripts', 'fdic_enqueue_design_system');
```

### Block markup

```html
<section class="wp-block-group">
  <fd-alert variant="warning" heading="Submission deadline">
    Institution profile updates submitted after 5 p.m. Eastern are processed on the next business day.
  </fd-alert>

  <fd-button href="/contact" variant="outline">
    Contact support
  </fd-button>
</section>
```

For authored long-form content, keep prose in normal HTML and use FDIC components around the consequential actions, status messaging, or structured shells.

## Token overrides in a CMS

CMSs often need regional or site-specific theming. Apply those overrides at the page shell or theme wrapper level.

```css
.site-shell {
  --fdic-color-bg-base: #f4f8fb;
  --fdic-color-bg-surface: #ffffff;
  --fdic-color-text-primary: #17324d;
  --fdic-layout-shell-max-width: 90rem;
}
```

Keep overrides:

- scoped to a real CMS container
- based on public `--fdic-*` and documented `--fd-*` names
- separate from content markup so editors do not have to manage token details manually

## Downstream guardrails

- Stay on the published component and token entrypoints documented here.
- Keep browser support aligned to the [Browser Support](/guide/browser-support) contract before adopting newer CSS features in theme overrides.
- Prefer application-owned data normalization for complex navigation, search, and form workflows instead of asking the Web Components to fetch or reshape source-specific payloads at runtime.

## Operational guidance

- Bundle the styles and registration modules as first-class theme assets.
- Register only the components you use if bundle size matters more than convenience.
- Preserve semantic fallback HTML in Twig, blocks, and CMS templates.
- Keep validation, trust language, and privacy explanation visible in server-rendered markup.

## Related guidance

- [Canonical CMS Filing Reference](/guide/cms-filing-reference)
- [Navigation Shell Reference](/guide/navigation-shell-reference)
- [Using Tokens In Your Project](/guide/using-tokens)
- [Getting Started](/guide/getting-started)
- [Global Header](/components/global-header)
