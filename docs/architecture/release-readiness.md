# Release Readiness

This document defines the validation tiers for changes to the FDIC Design System. Choose the tier that matches the scope of your change.

## Tier 1 — Contributor-fast checks

For most edits (component logic, internal styles, test updates):

```bash
npm run validate:packages
npm run validate:components
npm run test:components
npm run test:storybook
```

These run in under two minutes and catch contract drift, sync issues, and regressions.

## Tier 2 — Adoption-sensitive checks

When public docs, package surfaces, tokens, or downstream references change, add:

```bash
npm run validate:react
```

This rebuilds the React wrapper and validates its package surface. The `validate:packages` script already covers downstream reference validation.

## Tier 3 — Release-readiness check

For release prep, milestone branches, or pre-merge release candidates:

```bash
npm run validate:release
```

This runs the full chain: package surfaces, component sync, component tests, Storybook tests, React validation, and a complete production build. Use it as:

- a pre-release gate before tagging a version
- a high-confidence CI lane for milestone branches
- a "full green" verification for audits

## When to use each tier

| Change type | Minimum tier |
|---|---|
| Component logic, styles, tests | Tier 1 |
| Public docs, token names, downstream refs | Tier 2 |
| Version release, milestone branch, audit prep | Tier 3 |
| New component scaffolding | Tier 1 + `npm run sync:components` |

## CI integration

The `validate:release` script is intentionally not required for every PR. It is available for release branches and audit checkpoints. Teams can add it to a dedicated CI lane when release cadence warrants it.
