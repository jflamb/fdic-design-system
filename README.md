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

## Notes

All implementation code is placeholder-only at this stage.

Framework-specific packages should adapt the first-party component APIs rather than becoming the source of truth for design decisions.

Storybook is available as a component workbench for local development. VitePress remains the primary documentation site.

## Collaboration

Use [CONTRIBUTING.md](./CONTRIBUTING.md) for issue, label, and pull request workflow guidance.

Use [SECURITY.md](./SECURITY.md) for vulnerability reporting expectations.
