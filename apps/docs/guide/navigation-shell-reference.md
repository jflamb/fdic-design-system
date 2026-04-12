# Navigation Shell Reference

Use this page as the copyable downstream reference for a shell-integration adoption path. It stays on the published package surface, uses only public `--fdic-*` tokens, and demonstrates the layout and navigation contract without form composition.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Downstream reference</span>
  <p>This example shows a realistic institution-profile shell that a CMS or application team could adopt directly: semantic HTML landmarks first, progressive enhancement through published Web Component assets, token-scoped theming, and meaningful content before JavaScript upgrades complete.</p>
</div>

## What this reference proves

- The integration uses only `@jflamb/fdic-ds-components` and `@jflamb/fdic-ds-tokens`.
- Token overrides stay on documented `--fdic-*` names.
- The shell remains navigable as server-rendered HTML before upgrade.
- `fd-global-header` is configured through its published data model.
- Layout is driven by tokens and semantic landmarks, not component-private hooks.

## Client bundle entry

Import the published stylesheet and registration entrypoint into the application or CMS theme.

```ts
import "@jflamb/fdic-ds-components/styles.css";
import "@jflamb/fdic-ds-components/register-all";
```

## Theme-level token overrides

Apply token overrides at the application shell wrapper, not inside individual page content.

```css
.fdic-app-shell {
  --fdic-layout-shell-max-width: 90rem;
  --fdic-color-bg-base: #f4f8fb;
  --fdic-color-bg-surface: #ffffff;
  --fdic-color-text-primary: #17324d;
}
```

## Server-rendered page shell

This HTML is meaningful before upgrade and stays within the published public contract after upgrade.

```html
<div class="fdic-app-shell">
  <fd-global-header></fd-global-header>

  <fd-alert variant="info" heading="System maintenance scheduled">
    Online filing services will be unavailable Saturday, April 18 from
    2:00 a.m. to 6:00 a.m. Eastern for scheduled maintenance.
  </fd-alert>

  <main>
    <fd-page-header>
      <nav slot="breadcrumbs" aria-label="Breadcrumb">
        <a href="/institutions">Institutions</a>
        <a href="/institutions/12345">First Community Bank</a>
      </nav>
      <h1 slot="heading">Institution profile</h1>
      <p slot="description">
        Review the current institution record, filing contacts, and
        recent submission history.
      </p>
    </fd-page-header>

    <section aria-labelledby="overview-title">
      <h2 id="overview-title">Institution overview</h2>
      <dl>
        <dt>Certificate number</dt>
        <dd>12345</dd>
        <dt>Charter type</dt>
        <dd>State nonmember bank</dd>
        <dt>Primary regulator</dt>
        <dd>FDIC</dd>
        <dt>Established</dt>
        <dd>March 15, 1985</dd>
      </dl>
    </section>

    <section aria-labelledby="actions-title">
      <h2 id="actions-title">Actions</h2>
      <fd-button href="/institutions/12345/filing/start" variant="primary">
        Start new filing
      </fd-button>
      <fd-button href="/institutions/12345/contact/update" variant="outline">
        Update filing contact
      </fd-button>
    </section>

    <section aria-labelledby="history-title">
      <h2 id="history-title">Recent filing history</h2>
      <table>
        <caption>Filings submitted in the last 12 months</caption>
        <thead>
          <tr>
            <th>Filing type</th>
            <th>Date submitted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Annual report</td>
            <td>January 31, 2026</td>
            <td>Approved</td>
          </tr>
          <tr>
            <td>Contact update</td>
            <td>November 12, 2025</td>
            <td>Approved</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</div>
```

## Header data model

Configure the global header through its published JavaScript API, using application-owned data normalization.

```ts
import {
  createFdGlobalHeaderContentFromDrupal,
} from "@jflamb/fdic-ds-components/fd-global-header-drupal";

const headerContent = createFdGlobalHeaderContentFromDrupal({
  items: appMenuItems,
  search: {
    action: "/search",
    inputLabel: "Search FDIC.gov",
    submitLabel: "Search",
  },
});

const header = document.querySelector("fd-global-header");
header.content = headerContent;
```

## Operational notes

- Keep landmark headings and description lists in the server-rendered HTML so the page is navigable before JavaScript upgrades complete.
- Use `fd-alert` for time-sensitive system notices that affect the institution workflow.
- Use `fd-button` with `href` for navigation actions and `variant` for visual hierarchy.
- Let the application own data fetching and rendering for dynamic sections like filing history.

## Related guidance

- [CMS Integration](/guide/cms-integration)
- [Canonical CMS Filing Reference](/guide/cms-filing-reference)
- [Getting Started](/guide/getting-started)
- [Global Header](/components/global-header)
