# fd-selector popover deferral

`fd-selector` still uses an absolutely positioned listbox with `z-index: 9999`.

We reviewed whether to replace that path with the Popover API during the cleanup and hardening phase on April 11, 2026. The result was a deferral, not because the browser platform is standing still, but because this repository still lacks an explicit browser support policy that says which browser versions are in scope for core form controls.

## Why this is deferred

- The Popover API is broadly available across current browsers.
- CSS anchor positioning only reached MDN Baseline in January 2026, which is too recent to treat as an implicit requirement for all consumers without a documented support target.
- `fd-selector` is a first-class input control with a large existing test surface and form behavior contracts. A migration would change dismissal, focus, keyboard, and placement behavior at the platform primitive level.
- Replacing the current path before the project declares browser guarantees would turn a platform compatibility decision into an implementation detail.

## Revisit trigger

Revisit this migration when all of the following are true:

1. The design system publishes a browser support matrix or browserslist-equivalent policy.
2. That policy explicitly includes browsers with stable Popover API and CSS anchor positioning support.
3. The migration plan includes regression coverage for open/close behavior, `Esc` dismissal, click-outside dismissal, keyboard navigation, form validity anchoring, and constrained container layouts.

## Preferred future direction

When the support matrix allows it, prefer:

- a popover-backed listbox in the top layer
- browser-managed dismissal semantics where they match the component contract
- anchor-positioned placement instead of a hard-coded stacking escape hatch

That should allow the component to drop the `z-index: 9999` fallback and simplify dismissal plumbing.
