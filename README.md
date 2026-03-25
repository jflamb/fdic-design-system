# FDIC Design System

An open source design system for government websites in the financial sector, built with TypeScript and Web Components. The system prioritizes accessibility, trust, clarity, and long-term maintainability.

## Tech Stack

- **Component authoring**: [Lit](https://lit.dev/) (LitElement) — all first-party components use Lit
- **Build**: tsup for component and React wrapper packages
- **Testing**: Vitest with happy-dom environment; Storybook interaction and accessibility tests in Chromium
- **Documentation**: [VitePress](https://vitepress.dev/) (`apps/docs/`) — the primary documentation site, deployed via GitHub Pages
- **Component workbench**: [Storybook](https://storybook.js.org/) (`apps/storybook/`)
- **Icons**: Phosphor Icons embedded as inline SVG strings in an icon registry

## Packages

| Package | Purpose |
|---------|---------|
| `packages/components` | First-party Web Components (TypeScript + Lit) |
| `packages/react` | Auto-generated React wrappers for React consumers |
| `apps/docs` | VitePress documentation site |
| `apps/storybook` | Storybook component workbench |

Framework-specific packages adapt the first-party component APIs rather than becoming the source of truth for design decisions.

## Getting Started

```sh
npm install
npm run build
```

Build order matters because downstream packages depend on upstream outputs:

```
npm run build:components  →  npm run build:react  →  npm run build:docs
```

`npm run build` runs this full sequence.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Full sequential build (components → react → docs) |
| `npm run test:components` | Run component tests (Vitest + happy-dom + axe-core) |
| `npm run test:storybook` | Run browser-backed Storybook interaction and accessibility tests |
| `npm run build:storybook` | Build Storybook for deployment |
| `npm run dev:docs` | Start VitePress dev server |
| `npm run dev:storybook` | Start Storybook dev server |
| `npm run dev-server:start -- docs\|storybook\|all` | Start or reuse managed local dev servers |
| `npm run dev-server:stop -- docs\|storybook\|all` | Stop managed local dev servers |
| `npm run dev-server:status -- docs\|storybook\|all` | Show running dev server status and URLs |
| `npm run sync:components` | Regenerate exports, register entrypoints, docs API blocks, and Storybook arg helpers |
| `npm run validate:components` | Verify component metadata, docs, stories, and generated files stay in sync |
| `npm run new:component -- --name component-name --kind first-class` | Scaffold a new component with test, docs page, story, and metadata |

## Validation

- `npm run test:components` runs the fast `packages/components` Vitest suite, including reusable `axe-core` audits for structural accessibility issues that `happy-dom` can catch reliably.
- `npm run test:storybook` runs browser-backed Storybook interaction and accessibility tests in Chromium. It is part of the expected validation path for first-class component story files and their qualifying high-complexity flows.
- `npm run build:storybook` verifies the Storybook workbench still builds cleanly for review and deployment.

## Component Authoring

Component authoring is metadata-driven:

- `scripts/components/inventory.mjs` defines component inventory, classifications, docs routing, and register/export behavior.
- `scripts/components/api-metadata.json` defines the generated API reference data used by docs and Storybook helpers.
- `npm run sync:components` regenerates package wiring, docs API blocks, and Storybook arg helpers from these sources.
- `npm run validate:components` verifies that source, metadata, docs, stories, and generated files stay aligned.

VitePress is the primary documentation site. Storybook serves as the component workbench for local development and interactive testing.

## Collaboration

Use [CONTRIBUTING.md](./CONTRIBUTING.md) for issue, label, and pull request workflow guidance.

Use [SECURITY.md](./SECURITY.md) for vulnerability reporting expectations.
