# Visual

A static circular visual primitive for decorative icon and avatar cues.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p>Use <code>fd-visual</code> when a compact decorative cue helps users scan or group related content faster. The component stays intentionally narrow in v1: it owns the circular surface, size, clipping, and fallback rendering, while the surrounding interface owns the meaning.</p>
</div>

## When to use

- **Decorative icon surfaces** — when you want a consistent circular cue next to a card title, list item, or grouped summary.
- **Decorative avatar framing** — when you need a circular avatar placeholder or clipped image next to nearby identifying text.
- **Repeated visual grouping** — when a shared size and tone system helps related content feel clearly associated.

## When not to use

- **Interactive controls** — `fd-visual` is not a button, toggle, chip, or link in v1.
- **Standalone semantic images** — if the visual must carry meaning on its own, use a different pattern instead of relying on this decorative primitive.
- **Managed media APIs** — if you need built-in `src`, `alt`, overlays, counters, or richer media composition, `fd-visual` is too narrow for that job in v1.

## Examples

<StoryEmbed
  storyId="supporting-primitives-visual--docs-overview"
  linkStoryId="supporting-primitives-visual--playground"
  height="460"
  caption="Decorative icon surfaces, size presets, and avatar composition. Open Storybook for slot-composition examples and individual states."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `"neutral"` \| `"cool"` \| `"warm"` \| `"avatar"` | `neutral` | Visual treatment for the circular surface. Use `avatar` when the visual should clip avatar media or render the placeholder avatar fallback. |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"2xl"` | `md` | Applies one of the fixed Figma size presets for the overall circle and its inner content. |

## Slots

| Name | Description |
|---|---|
| (default) | Optional decorative icon or avatar media. Leave empty to use the built-in fallback glyph or avatar placeholder. |

Slot content is decorative in v1. Do not slot interactive controls or content that must be announced independently.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-visual-size` | Preset from `size` | Overrides the rendered circle size. |
| `--fd-visual-padding` | Preset from `size` | Overrides the inner padding for non-avatar variants. |
| `--fd-visual-content-size` | Preset from `size` | Overrides the inner content box size for non-avatar variants. |
| `--fd-visual-radius` | `9999px` | Corner radius for the circular surface. |
| `--fd-visual-bg-neutral` | `var(--ds-color-bg-interactive, #f5f5f7)` | Neutral surface background. |
| `--fd-visual-fg-neutral` | `var(--ds-color-text-primary, #212123)` | Neutral foreground color used by the fallback glyph and slotted icon content. |
| `--fd-visual-bg-cool` | `var(--ds-color-info-100, #38b6ff)` | Cool surface background. |
| `--fd-visual-fg-cool` | `var(--ds-color-text-inverted, #ffffff)` | Cool foreground color used by the fallback glyph and slotted icon content. |
| `--fd-visual-bg-warm` | `var(--ds-color-secondary-200, #ebd49b)` | Warm surface background. |
| `--fd-visual-fg-warm` | `var(--ds-color-text-primary, #212123)` | Warm foreground color used by the fallback glyph and slotted icon content. |
| `--fd-visual-bg-avatar` | `transparent` | Avatar background surface. |
| `--fd-visual-avatar-placeholder-color` | `#b0b0b3` | Placeholder avatar silhouette color. |

## Shadow parts

| Name | Description |
|---|---|
| `surface` | Outer circular wrapper. |
| `content` | Inner frame that centers slotted media or the fallback visual. |
| `fallback` | Built-in archive glyph or placeholder avatar wrapper when no slot content is supplied. |

- `fd-visual` stays decorative-only in v1 and sets `aria-hidden="true"` on the host.
- For avatar images, prefer empty `alt` text when adjacent content already names the subject.
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Pair the visual with nearby text</h4>
    <p>The visual should support recognition, not replace the visible label or description that explains the content.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Turn the circle into a mystery control</h4>
    <p>Adding click or toggle behavior changes the semantics materially. Use a real interactive component when users must act on the visual.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use decorative slot content only</h4>
    <p>Compose <code>fd-icon</code> or an avatar image when needed, but keep that slotted media presentational and non-interactive.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on color alone for grouping</h4>
    <p>The tone helps scanning, but users still need nearby text, headings, or layout structure to understand what is related.</p>
  </div>
</div>

## Composition guidance

- **Default fallback** — Non-avatar tones render a built-in archive-style glyph when no slot content is provided. Use that when a generic visual cue is sufficient.
- **Custom icon** — Slot an `fd-icon` when you need a different decorative glyph:

```html
<fd-visual type="cool" size="lg">
  <fd-icon name="download" aria-hidden="true"></fd-icon>
</fd-visual>
```

- **Avatar image** — Slot an image only when the surrounding UI already names the person or entity:

```html
<fd-visual type="avatar" size="xl">
  <img alt="" src="/team/jordan-hall.jpg" />
</fd-visual>
```

## Accessibility

- `fd-visual` is **decorative-only in v1**. The host sets `aria-hidden="true"` and does not create its own accessible name.
- The component exposes **no keyboard interaction** and no tab stop.
- Slotted content should remain **presentational**. Do not slot focusable controls or content that must be announced independently.
- For avatar images, prefer **empty `alt` text** when adjacent text already names the subject.
- Forced-colors mode preserves a visible circular boundary and visible fallback glyph or placeholder silhouette.

## Known limitations

- `fd-visual` does not support built-in `src`, `alt`, `name`, or `label` convenience properties in v1.
- The component does not provide overlays, counters, badges, or status markers inside the circle.
- The primitive is intentionally static. Interactive, selectable, or dismissible variations are out of scope.

## Related components

- [Icon](/components/icon) — use `fd-icon` inside `fd-visual` when you need a different decorative glyph.
- [Badge](/components/badge) — use a badge when the visible text label itself should be rendered inside the compact surface.
- [Chip](/components/chip) — use a chip when users must remove an item from a visible set.
