# Getting Started

This page explains what the FDIC Design System provides, how to run it locally, and the supported setup path for consumers.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Start here</span>
  <p>The FDIC Design System is a library of Web Components and design tokens built for government and financial-services interfaces. It provides accessible, tested UI controls that you drop into HTML pages. It is not a page builder, a CSS framework, or a layout system.</p>
</div>

## What you get

- **Web Components** (`fd-button`, `fd-input`, `fd-alert`, etc.) — drop-in HTML elements with built-in accessibility, keyboard support, and FDIC visual styling.
- **Design tokens** — a shared vocabulary of colors, typography, spacing, layout, and interaction values that keep pages visually consistent.
- **Documentation and usage guidance** — every component page explains when to use it, when not to use it, and how to avoid common mistakes.

## What this is not

- **Not a page builder.** You still write your own HTML structure, layout, and page logic.
- **Not a CSS framework.** The components ship their own encapsulated styles. You do not add utility classes to make them work.
- **Not a JavaScript framework.** The components are framework-agnostic Web Components. They work anywhere custom elements are supported. A public React wrapper package is not part of the supported release surface yet.

## Install and run locally

```bash
npm install
```

Start the documentation site:

```bash
npm run dev:docs
```

## Supported consumer path

Install the components package. It brings the tokens package with it.

```bash
npm install @jflamb/fdic-ds-components
```

Import the component stylesheet before you register any components:

```ts
import "@jflamb/fdic-ds-components/styles.css";
import "@jflamb/fdic-ds-components/register-all";
```

Use the tokens package directly only if you need foundation tokens without the component library:

```ts
import "@jflamb/fdic-ds-tokens/styles.css";
```

## Your first component

Here is a minimal working app entry that uses an FDIC button:

```ts
import "@jflamb/fdic-ds-components/styles.css";
import "@jflamb/fdic-ds-components/register-all";
```

```html
<h1>Hello, FDIC Design System</h1>
<fd-button variant="primary">Submit filing</fd-button>
```

The stylesheet import is required. FDIC components consume shared `--ds-*` and `--fdic-*` runtime tokens, so using the component package without `@jflamb/fdic-ds-components/styles.css` is unsupported. The registration modules also warn at runtime when those tokens are missing.

## Stable public API

- Stable component registration entrypoint: <code>@jflamb/fdic-ds-components/register-all</code>
- Stable component stylesheet: <code>@jflamb/fdic-ds-components/styles.css</code>
- Stable token stylesheet: <code>@jflamb/fdic-ds-tokens/styles.css</code>
- Stable token data export: <code>@jflamb/fdic-ds-tokens/fdic.tokens.json</code>

Compatibility note: <code>@jflamb/fdic-ds-tokens/semantic.css</code> remains available as an alias, but new integrations should use <code>styles.css</code>.

## Where to go next

1. **Understand the building blocks** — read the [Foundations](/guide/foundations/) section to learn about colors, typography, and spacing.
2. **Pick the right component** — read [Choosing a Component](/guide/choosing-a-component) to find the correct element for your use case.
3. **Build a form** — read [Form Workflows](/guide/form-workflows) for step-by-step guidance on building accessible, high-stakes forms.
4. **Check accessibility requirements** — read [Accessibility](/guide/accessibility) to understand the non-negotiable WCAG 2.1 AA rules.
5. **Browse components** — the [Components](/components/) section documents every available element with usage examples, API tables, and Do/Don't guidance.
