# Testing Strategy

This page defines the current validation contract for the FDIC Design System. It also records the decision from [#23](https://github.com/jflamb/fdic-design-system/issues/23): do not add a separate real-browser component runner yet.

The system already has two active test layers that cover the v1 public contract:

| Layer | Command | Environment | Primary purpose |
| --- | --- | --- | --- |
| Component tests | `npm run test:components` | Vitest with happy-dom | Component API, rendered attributes, ARIA wiring, form behavior, events, and focused unit-level accessibility checks |
| Storybook browser tests | `npm run test:storybook` | Vitest with Playwright Chromium | Real-browser rendering, keyboard and focus behavior, Storybook play functions, and rendered accessibility checks including color contrast |

`validate:release` keeps those layers tied to the rest of the public contract by also checking package surfaces, generated component metadata, docs contrast, docs build, and built package exports.

## Current decision

Keep the current two-layer model for v1.

A dedicated runner such as `@web/test-runner` would add another dependency stack, another CI lane, and another place for package-resolution drift. The recent GitHub Enterprise Server (GHES) validation work showed that the better immediate investment is making the existing release gates explicit and stable:

- build the component package before Storybook tests that import public package exports
- keep GHES artifact actions on versions supported by GitHub Enterprise Server
- keep Playwright trace collection off in GHES unless a targeted debug run needs it
- use condition-based waits in component tests instead of fixed sleeps for async DOM wiring

Those fixes address the real failures without expanding the toolchain.

## What each layer owns

Component tests own low-level component contracts:

- reflected properties and attributes
- default values and fallback behavior
- public events and event detail payloads
- form-associated behavior
- accessible names, descriptions, and state wiring
- warnings for invalid authoring patterns

Storybook browser tests own rendered integration behavior:

- keyboard interaction and focus order
- browser-rendered accessibility checks
- behavior that depends on layout, shadow DOM, browser event order, or actual Chromium rendering
- high-value documentation examples and composed recipes

Docs and package validators own public-surface integrity:

- generated component API metadata
- package export maps and built files
- documented accessibility and contrast expectations
- downstream references that use only the supported public package and token surface

## When to revisit #23

Reopen implementation work for a dedicated real-browser component runner only when one of these triggers is present:

- a component needs browser-only behavior that is too low-level or too noisy to test through Storybook
- CSS custom property resolution or shadow DOM behavior needs isolated per-component browser assertions
- screenshot or visual-regression baselines become a release requirement
- Storybook browser tests become too slow or too coarse to cover critical component-level behavior
- multiple CI failures are caused by Storybook-specific infrastructure rather than component behavior

Until then, add browser assertions to Storybook stories when the behavior is user-facing, and keep component tests in happy-dom when the behavior is structural or API-level.
