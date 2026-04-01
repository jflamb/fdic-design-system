# Badge

A static text-first pill for tags, categories, and lightweight status labels.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-badge</code> when you need a compact visible label without adding another button or link to the interface. The text stays primary; color only supports scanning.</p>
</div>

## When to use

- **Status labels** — short states like “Approved” or “Past due”.
- **Categorical tags** — compact labels such as “Small business” or “Branch office”.
- **Dense supporting context** — when users benefit from a lightweight visual cue that does not add interaction.

## When not to use

- **Dismissible items** — use [Chip](/components/chip) when the user must remove one item from a visible set.
- **Clickable pills** — `fd-badge` intentionally does not expose host-level interaction in v1.
- **Critical warnings or recovery guidance** — use a fuller message pattern when the user needs explanation, prevention, or next steps.

## Examples

<StoryEmbed
  storyId="components-badge--docs-overview"
  linkStoryId="components-badge--playground"
  height="320"
  caption="Static badges in representative tones. Open Storybook for the full tone set."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `"neutral"` \| `"cool"` \| `"warm"` \| `"positive"` \| `"alert"` | `neutral` | Visual tone for the badge surface. See tone guidance below. |

## Slots

| Name | Description |
|---|---|
| (default) | Visible badge label text. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-badge-height` | `28px` | Minimum badge height. |
| `--fd-badge-padding-inline` | `var(--fdic-spacing-sm, 12px)` | Horizontal badge padding. |
| `--fd-badge-radius` | `9999px` | Pill corner radius. |
| `--fd-badge-font-size` | `var(--fdic-font-size-body-small, 1rem)` | Label font size. |
| `--fd-badge-text-color` | `var(--ds-color-text-primary, #212123)` | Shared text color across tones. |
| `--fd-badge-bg-neutral` | `var(--ds-color-bg-interactive, #f5f5f7)` | Neutral badge background. |
| `--fd-badge-bg-cool` | `var(--ds-color-info-050, #f1f8fe)` | Cool badge background. |
| `--fd-badge-bg-warm` | `var(--ds-color-secondary-050, #f8efda)` | Warm badge background. |
| `--fd-badge-bg-positive` | `var(--ds-color-success-050, #e8f5e9)` | Positive badge background. |
| `--fd-badge-bg-alert` | `var(--ds-color-error-050, #fdedea)` | Alert badge background. |

## Shadow parts

| Name | Description |
|---|---|
| `container` | Outer pill container. |
| `label` | Visible label wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Tone guidance

Choose the tone that supports scanning without replacing the label text:

| Tone | When to use | Example labels |
|------|------------|----------------|
| `neutral` | Default. General-purpose tags and categories with no semantic weight. | "Branch office", "Q4 2025" |
| `cool` | Informational context that benefits from a subtle blue tint. | "New", "Updated" |
| `warm` | Items that need mild visual emphasis without implying risk. | "Pending review", "Draft" |
| `positive` | Conditions that represent a good or completed state. | "Approved", "Active" |
| `alert` | Conditions that need attention, without reaching alert-level urgency. | "Past due", "Expiring soon" |

**The text must carry the meaning on its own.** Tone only supports scanning — if the badge text says "Approved", the `positive` tone reinforces that at a glance, but a user who cannot perceive color still understands the status.

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep the badge readable without color</h4>
    <p>The text should still carry the meaning if the user cannot perceive the tone.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Style a badge like a button</h4>
    <p>If the user can act on it, choose a component with real interaction semantics instead of a static badge.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use short, scannable labels</h4>
    <p>Compact phrases keep the badge lightweight and help avoid wrapping in dense layouts.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Treat a badge as your only warning copy</h4>
    <p>High-stakes conditions still need fuller surrounding text or message guidance.</p>
  </div>
</div>

## Content guidelines

- **Prefer plain language.** Use direct terms like “Approved”, “Needs follow-up”, or “Small business”.
- **Keep the label stable.** Badges work best when the meaning does not change rapidly or require announcement behavior.
- **Choose tone intentionally.** Neutral is the baseline; use semantic tones only when the text also expresses that meaning.

## Accessibility

- `fd-badge` is **static by default**. It does not expose a host button, link, or keyboard behavior in v1.
- The visible label stays the primary meaning source. Tone is supportive, not sufficient on its own.
- Forced-colors support preserves a readable label and a visible pill boundary.
- The Figma source includes non-removable hover, pressed, and focus explorations. **That host-level interactivity is intentionally out of scope for `fd-badge` v1.**

## Known limitations

- `fd-badge` is **not** a clickable badge or notification counter in v1.
- The component does not support built-in leading icons, avatars, or numeric-dot variants.
- Host-level hover, pressed, and focus visuals from the non-removable Figma exploration are intentionally not shipped in v1.

## Choosing between Badge, Chip, and Alert

These three components are frequently confused. Use the right one:

- **Badge** (this component) = static metadata label. The user reads it but cannot act on it. Use for tags, categories, and status indicators.
- **[Chip](/components/chip)** = user-removable token. The user can dismiss it from a visible set. Use for active filters and selected items.
- **[Alert](/components/alert)** = system message requiring attention. Use for time-sensitive or high-priority information that changes the user's next step.

If the user can dismiss it, use a chip. If it communicates something urgent, use an alert. For everything else, use a badge.

## Related components

- [Chip](/components/chip) — dismissible pill with a real remove button
- [Badge Group](/components/badge-group) — wrapping layout for related badges
- [Chip Group](/components/chip-group) — wrapping layout for related chips
- [Alert](/components/alert) — page-level or section-level messaging for time-sensitive information
