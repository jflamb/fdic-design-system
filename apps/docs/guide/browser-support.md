# Browser Support

This page defines the browser support contract for the FDIC Design System as it is currently shipped.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Platform baseline</span>
  <p>Support is set by the runtime features already in the repository, not by an aspirational roadmap. The current floor is driven by shipped color-token behavior, registered custom properties, and native overlay primitives.</p>
</div>

## Support target

Use the current and previous stable release of the supported browser engines, with these minimum versions as the published floor:

| Browser | Supported floor | Why it matters |
| --- | --- | --- |
| Chrome | 123+ | Required for <code>light-dark()</code>, which the token runtime uses directly. |
| Edge | 123+ | Mirrors the Chromium support floor used by the same token runtime. |
| Firefox | 128+ | Required for both <code>@property</code> and the relative <code>oklch(from ...)</code> syntax used in shipped tokens and component styles. |
| Safari | 17.5+ | Required for <code>light-dark()</code> and aligns with the current drawer transition model. |

The root <code>browserslist</code> entry matches this floor so tooling and docs describe the same contract.

## Required platform features

These features are part of the shipped runtime with no separate legacy path:

- <code>light-dark()</code> for semantic color tokens in <code>@jflamb/fdic-ds-tokens/styles.css</code>
- Relative color syntax such as <code>oklch(from var(--fdic-color-primary-500) l c h / 0.08)</code>
- <code>@property</code> registration for interactive overlay color tokens
- Native <code>&lt;dialog&gt;</code> behavior for modal drawer mode via <code>showModal()</code>

If a browser does not support those features, core theming and overlay behavior no longer match the published design-system contract.

## Progressive enhancement

These features are already shipped, but failure to support them degrades presentation more than basic function:

- Popover API behavior in components such as <code>fd-menu</code> and the <code>fd-label</code> InfoTip
- <code>@starting-style</code> and <code>transition-behavior: allow-discrete</code> for smoother drawer entry and exit motion
- Top-layer styling hooks such as <code>:popover-open</code> and <code>dialog::backdrop</code>

In those cases, the intended behavior is a reduced interaction or animation experience rather than a different fallback implementation.

## Feature checkpoints

The current floor is based on the highest hard requirement among the features already in the repo:

| Feature | Chrome / Edge | Firefox | Safari | Notes |
| --- | --- | --- | --- | --- |
| <code>light-dark()</code> | 123 | 120 | 17.5 | Hard requirement for token-driven light/dark appearance. |
| Relative <code>oklch(from ...)</code> syntax | 122 | 128 | 16.4 partial, 18 full | The repo uses direct channel references rather than complex channel math. |
| <code>@property</code> | 85 | 128 | 16.4 | Hard requirement for registered custom properties in the token runtime. |
| Popover API surface | 114 | 125 | 17 | Used by <code>fd-menu</code> and <code>fd-label</code>. |
| <code>@starting-style</code> | 117 | 129 | 17.5 | Used by <code>fd-drawer</code> for entry transitions. |
| <code>transition-behavior: allow-discrete</code> | 117 | 129 | 17.4 | Used by <code>fd-drawer</code> for discrete dialog/backdrop transitions. |
| <code>HTMLDialogElement.showModal()</code> | 37 | 98 | 15.4 | Used by modal drawer mode. |

## Implications for component work

- The documented floor now unblocks future work that depends on Popover-based overlays, including the deferred <code>fd-selector</code> migration.
- New CSS platform features should be introduced only when they fit within this matrix or degrade cleanly above it.
- When a component depends on a newer feature than this page allows, document that explicitly before shipping the change.

## Sources

- [MDN browser compatibility data for <code>light-dark()</code>](https://github.com/mdn/browser-compat-data/blob/main/css/types/color.json)
- [MDN browser compatibility data for <code>@property</code>](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/property.json)
- [MDN browser compatibility data for <code>@starting-style</code>](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/starting-style.json)
- [MDN browser compatibility data for <code>transition-behavior</code>](https://github.com/mdn/browser-compat-data/blob/main/css/properties/transition-behavior.json)
- [MDN browser compatibility data for <code>HTMLDialogElement.showModal()</code>](https://github.com/mdn/browser-compat-data/blob/main/api/HTMLDialogElement.json)
- [MDN browser compatibility data for Popover-related <code>HTMLElement</code> APIs](https://github.com/mdn/browser-compat-data/blob/main/api/HTMLElement.json)
