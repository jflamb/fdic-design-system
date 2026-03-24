# FDIC Design System

Early-stage open source scaffold for an FDIC design system.

## Packages

- `packages/components`: TypeScript + Web Components implementation
- `packages/react`: placeholder React adapter package for future framework-specific delivery
- `apps/docs`: VitePress documentation site for GitHub Pages

## Commands

- `npm install`
- `npm run dev:docs`
- `npm run dev:storybook`
- `npm run build`
- `npm run test:components`
- `npm run test:storybook`
- `npm run build:storybook`
- `npm run sync:components`
- `npm run validate:components`
- `npm run new:component -- --name component-name --kind first-class`

## Validation

- `npm run test:components` runs the fast `packages/components` Vitest suite, including reusable `axe-core` audits for structural accessibility issues that `happy-dom` can catch reliably.
- `npm run test:storybook` runs browser-backed Storybook interaction tests for component stories, covering keyboard flow and rendered output in Chromium.
- `npm run build:storybook` verifies the Storybook workbench still builds cleanly for review and deployment.

## Notes

All implementation code is placeholder-only at this stage.

Framework-specific packages should adapt the first-party component APIs rather than becoming the source of truth for design decisions.

Storybook is available as a component workbench for local development. VitePress remains the primary documentation site.

Component authoring is metadata-driven:

- `scripts/components/inventory.mjs` defines component inventory, classifications, docs routing, and register/export behavior.
- `scripts/components/api-metadata.json` defines the generated API reference data used by docs and Storybook helpers.
- `npm run sync:components` regenerates package wiring, docs API blocks, and Storybook arg helpers.
- `npm run validate:components` verifies that source, metadata, docs, stories, and generated files stay aligned.

## Collaboration

Use [CONTRIBUTING.md](./CONTRIBUTING.md) for issue, label, and pull request workflow guidance.

Use [SECURITY.md](./SECURITY.md) for vulnerability reporting expectations.
