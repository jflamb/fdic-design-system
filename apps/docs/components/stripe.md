# Stripe

A decorative accent stripe for lightweight grouping and section framing.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p>Use <code>fd-stripe</code> when a small color-coded accent helps users scan grouped content faster. The surrounding heading, copy, and layout still carry the meaning; the stripe is decorative support only.</p>
</div>

## When to use

- **Heading accents** — above or beside a heading when you want a lightweight visual cue for a section.
- **Grouped supporting content** — to reinforce that related cards, summaries, or checklist content belong together.
- **Repeatable decorative framing** — when teams need the FDIC stripe treatment without recreating one-off CSS.

## When not to use

- **Semantic document separation** — use real structure, spacing, or native separators when the boundary itself needs meaning.
- **Interactive or stateful UI** — `fd-stripe` is not clickable, selectable, dismissible, or focusable.
- **Color-only communication** — if the stripe is the only clue that a section matters, the pattern is too weak on its own.

## Examples

<StoryEmbed
  storyId="supporting-primitives-stripe--docs-overview"
  linkStoryId="supporting-primitives-stripe--playground"
  height="360"
  caption="Tone variants and heading composition. Open Storybook for the focused playground and in-context examples."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `"neutral"` \| `"cool"` \| `"warm"` | `neutral` | Visual tone for the decorative stripe. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-stripe-width` | `80px` | Rendered stripe width. The component clamps to the available container width. |
| `--fd-stripe-height` | `4px` | Rendered stripe thickness. |
| `--fd-stripe-radius` | `0` | Corner radius for the stripe. |
| `--fd-stripe-bg-neutral` | `var(--ds-color-border-divider, var(--fdic-border-divider, #bdbdbf))` | Neutral stripe color. |
| `--fd-stripe-bg-cool` | `var(--ds-color-info-100, #38b6ff)` | Cool stripe color. |
| `--fd-stripe-bg-warm` | `var(--ds-color-secondary-500, #d9af45)` | Warm stripe color. |

## Shadow parts

| Name | Description |
|---|---|
| `stripe` | Internal decorative line element. |

- `fd-stripe` stays decorative-only in v1 and sets `aria-hidden="true"` on the host.
- Use surrounding headings or landmarks for structure; the stripe itself is not a semantic separator.
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Let text and structure carry the meaning</h4>
    <p>The stripe should reinforce grouping, not replace headings, landmarks, or explanatory copy.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Treat the stripe like a rule with semantics</h4>
    <p>If the separator itself needs to be announced or understood structurally, choose a semantic pattern instead.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep the accent compact</h4>
    <p>The default 80 by 4 geometry matches the Figma primitive and stays intentionally lightweight.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on tone alone</h4>
    <p>Warm, neutral, and cool help scanning, but nearby visible labels still need to explain what is grouped.</p>
  </div>
</div>

## Composition guidance

- Place `fd-stripe` near the heading or summary it supports instead of leaving it isolated.
- Use `neutral` as the baseline tone. Reserve `cool` and `warm` for intentional visual emphasis that still has nearby text context.
- Prefer CSS custom properties for layout-level overrides instead of stretching the public API with width or height attributes.

```html
<section>
  <fd-stripe type="cool"></fd-stripe>
  <h2>Account activity</h2>
  <p>Review recent deposits, withdrawals, and scheduled transfers.</p>
</section>
```

## Accessibility

- `fd-stripe` is **decorative-only in v1** and sets `aria-hidden="true"` on the host.
- The component exposes **no keyboard interaction**, no focus target, and no semantic separator role.
- Do not rely on the stripe alone to communicate category, status, or section importance.
- Forced-colors mode preserves a visible line using system colors.

## Known limitations

- `fd-stripe` does not provide an announced structural separator in v1.
- The component has no slots, events, labels, or interactive states.
- Geometry overrides are styling hooks only; there are no public width or height attributes.

## Related components

- [Visual](/components/visual) — use when the decorative accent should be a compact shaped surface instead of a line.
- [Badge](/components/badge) — use when the compact surface must include visible text.
- [Alert](/components/alert) — use when the accent must pair with semantic messaging, states, and recovery guidance.
