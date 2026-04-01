# Getting Started

This page explains what the FDIC Design System provides, how to run it locally, and how to use your first component.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Start here</span>
  <p>The FDIC Design System is a library of Web Components and design tokens built for government and financial-services interfaces. It provides accessible, tested UI controls that you drop into HTML pages. It is not a page builder, a CSS framework, or a layout system.</p>
</div>

## What you get

- **Web Components** (`fd-button`, `fd-input`, `fd-alert`, etc.) — drop-in HTML elements with built-in accessibility, keyboard support, and FDIC visual styling.
- **Design tokens** — a shared vocabulary of colors, typography, and spacing values that keep pages visually consistent.
- **Documentation and usage guidance** — every component page explains when to use it, when not to use it, and how to avoid common mistakes.

## What this is not

- **Not a page builder.** You still write your own HTML structure, layout, and page logic.
- **Not a CSS framework.** The components ship their own encapsulated styles. You do not add utility classes to make them work.
- **Not a JavaScript framework.** The components are framework-agnostic Web Components. They work in plain HTML, React, Vue, Angular, or any other environment that supports custom elements.

## Install and run locally

```bash
npm install
```

Start the documentation site:

```bash
npm run dev:docs
```

## Your first component

Here is a minimal working page that uses an FDIC button:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FDIC Design System — Hello World</title>
  <script type="module">
    import '@fdic/components';
  </script>
</head>
<body>
  <h1>Hello, FDIC Design System</h1>
  <fd-button variant="primary">Submit filing</fd-button>
</body>
</html>
```

That is all you need. The `fd-button` element registers itself, renders a native `<button>` inside Shadow DOM, and includes keyboard support, focus rings, and FDIC styling automatically.

## Where to go next

1. **Understand the building blocks** — read the [Foundations](/guide/foundations/) section to learn about colors, typography, and spacing.
2. **Pick the right component** — read [Choosing a Component](/guide/choosing-a-component) to find the correct element for your use case.
3. **Build a form** — read [Form Workflows](/guide/form-workflows) for step-by-step guidance on building accessible, high-stakes forms.
4. **Check accessibility requirements** — read [Accessibility](/guide/accessibility) to understand the non-negotiable WCAG 2.1 AA rules.
5. **Browse components** — the [Components](/components/) section documents every available element with usage examples, API tables, and Do/Don't guidance.
