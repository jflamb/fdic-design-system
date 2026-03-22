# Button And Icon Components

## Status

Accepted for initial implementation planning.

## Scope

This note records the durable decisions for the first interactive components:

- `<fd-icon>`
- `<fd-button>`

Implementation task breakdown should live in GitHub Issues or PRs, not here.

## Decisions

### `fd-icon`

- Ship a first-party `<fd-icon>` component now rather than deferring icon support.
- Use a global inline SVG registry pattern.
- Seed the registry with a curated built-in subset of Phosphor Regular icons used by the Figma system and common FDIC patterns.
- Keep `FdIcon.register(name, svg)` and `FdIcon.register(record)` public for app-level extension.
- Treat registered SVG as trusted input. Basic sanitization is defense-in-depth, not a general untrusted-content pipeline.
- Render decorative icons by default with `aria-hidden="true"`.
- Support semantic icons via a `label` attribute that exposes an accessible name.
- Default icon sizing to 18px via CSS custom property, with `currentColor` inheritance.

### `fd-button`

- Ship a first-party `<fd-button>` Web Component that renders a native internal control.
- Support variants: `primary`, `neutral`, `subtle`, `outline`, and `destructive`.
- Keep icon composition slot-based:
  - default slot for label
  - `icon-start`
  - `icon-end`
- Recommend `<fd-icon>` in those slots, while still allowing custom slotted markup.
- Render `<button>` when `href` is absent.
- Render `<a>` when `href` is present, preserving link semantics. Do not apply `role="button"` to links.
- For disabled links, remove `href`, add `aria-disabled="true"` and `tabindex="-1"`, and suppress activation defensively.
- For icon-only buttons, require the accessible name on `<fd-button>` itself via `aria-label` or `aria-labelledby`, and forward that name to the rendered native control.
- When rendering `target="_blank"` links, ensure `noopener` and `noreferrer` are present by default.

## Accessibility Constraints

- Use native keyboard behavior for `<button>` and `<a>`.
- Preserve visible focus with the documented 2px gap plus 2px ring treatment.
- Keep icon-only controls explicitly named.
- Treat disabled contrast as exempt only for genuinely disabled controls.
- Use forced-colors overrides narrowly; prefer native system adaptation unless preserving meaning requires otherwise.

## Explicit V1 Non-Goals

- loading or spinner states
- size variants
- button groups or split buttons
- toggle or pressed states
- automatic external-link icon insertion
- form association through `ElementInternals`
- submit or reset semantics on the custom element before form association exists
- dark-mode-specific variants

## Follow-Up Work

- Add implementation tracking in GitHub using the existing proposal or maintenance issue templates.
- Document the action-only v1 button contract and the shadow-DOM form submission limitation on the button docs page.
- Add tests for icon registration, missing icon behavior, anchor vs button rendering, disabled link behavior, and icon-only accessible naming.
