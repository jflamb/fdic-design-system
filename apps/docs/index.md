# FDIC Design System

The FDIC Design System is a library of accessible Web Components, design tokens, and documentation patterns for government and financial-service interfaces.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Public service UI</span>
  <p>Use this system when you need official, trustworthy UI building blocks with explicit accessibility contracts, plain-language guidance, and a small, stable token surface. It is designed for high-stakes workflows where clarity matters more than novelty.</p>
</div>

## Why it exists

- Build consistent FDIC experiences with reusable components and tokens.
- Reduce accessibility drift with documented semantics, keyboard behavior, and validation rules.
- Support downstream adoption in apps, documentation sites, and CMS-driven frontends.

## Start with a real example

```ts
import "@jflamb/fdic-ds-components/styles.css";
import "@jflamb/fdic-ds-components/register-all";
```

```html
<fd-page-header>
  <h1 slot="heading">Institution profile updates</h1>
  <p slot="description">
    Submit changes to mailing address, contact information, and filing status.
  </p>
</fd-page-header>

<fd-alert variant="info" heading="Before you submit">
  Review all institution identifiers before sending the update.
</fd-alert>

<fd-button variant="primary">Start update</fd-button>
```

## What you will find here

<div class="fdic-card-grid">
  <div class="fdic-card">
    <span class="fdic-eyebrow">Get started</span>
    <h3><a href="/guide/getting-started">Install the runtime and ship your first component</a></h3>
    <p>Start with the supported package entrypoints, token runtime, and component registration path.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Foundations</span>
    <h3><a href="/guide/foundations/">Learn the public token and layout contract</a></h3>
    <p>Use stable semantic tokens, spacing rules, responsive guidance, and trust patterns.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Components</span>
    <h3><a href="/components/">Choose the right building block</a></h3>
    <p>Each component page explains when to use it, when not to use it, and how to keep it accessible.</p>
  </div>
</div>

## Current public surface

- Framework-agnostic Web Components for forms, navigation, feedback, shell, and content support
- Published CSS and DTCG token artifacts for downstream integration
- VitePress docs and Storybook examples that match the generated component inventory

## Recommended path

1. Read [Getting Started](/guide/getting-started).
2. Review [Foundations](/guide/foundations/) before writing local overrides.
3. Use [Choosing a Component](/guide/choosing-a-component) and the component docs to select the right pattern.
4. Use [Form Workflows](/guide/form-workflows) and [Accessibility](/guide/accessibility) for consequential forms and public-service flows.
