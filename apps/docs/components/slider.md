# Slider

A single-value slider for choosing a bounded integer, with an optional inline input when users need exact entry.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-slider</code> when users benefit from adjusting a value by position as well as by number. Keep the scope narrow: one thumb, one value, and one clear scale.</p>
</div>

::: tip Wrap in fd-field
This component should almost always be wrapped in [`fd-field`](/components/field) for proper label and error message association.
:::

## When to use

- **Bounded numeric choices** — when users are choosing within a known minimum and maximum.
- **Exploratory adjustment** — when the value benefits from quick drag or arrow-key changes.
- **Exact review with light support** — when the optional inline input helps users confirm or fine-tune the selected number.

## When not to use

- **High-stakes exact entry** — if users must verify the number character by character, prefer [Input](/components/input).
- **Two related values** — minimum/maximum range selection is out of scope for <code>fd-slider</code> v1.
- **Unclear scales** — if the meaning of higher or lower values is not obvious, use a more explicit field pattern.

## Examples

<StoryEmbed
  storyId="components-slider--docs-overview"
  linkStoryId="components-slider--playground"
  height="980"
  caption="Slider states — default, optional exact-value input, keyboard focus, and disabled. Open Storybook for interactive controls."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `` | Form field name used when the committed slider value is submitted. |
| `label` | `string` | `` | Visible field label rendered inside the component. |
| `hint` | `string` | `` | Optional supporting guidance shared by the range input and inline helper input. |
| `min` | `number` | `0` | Lower bound of the slider range. Non-integer values are rounded in v1. |
| `max` | `number` | `100` | Upper bound of the slider range. Non-integer values are rounded in v1. |
| `step` | `number` | `1` | Integer increment used by the native range input and the optional helper input. |
| `value` | `number` | `0` | Committed slider value. When no explicit value is supplied, the component initializes to the normalized midpoint. |
| `disabled` | `boolean` | `false` | Disables the range input and the optional helper input. |
| `showInput` | `boolean` | `false` | Shows the inline exact-value helper input. |

- v1 is intentionally limited to single-value integer selection.
- Invalid authored numeric constraints are normalized predictably, with console warnings for authoring mistakes.

## Events

| Name | Detail | Description |
|---|---|---|
| `input` | Native `Event` | Fired when the committed value changes through drag, keyboard input, or valid inline-input edits. |
| `change` | Native `Event` | Fired when a value change is committed by the range input or the inline helper input. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-slider-track-height` | `8px` | Visual rail height. |
| `--fd-slider-track-radius` | `var(--fdic-corner-radius-sm, 3px)` | Corner radius for the visual rail and fill. |
| `--fd-slider-track-background` | `var(--fdic-color-border-input-interactive, #e0e0e2)` | Unfilled rail color. |
| `--fd-slider-track-fill` | `var(--fdic-color-primary-500, #0d6191)` | Filled rail color up to the committed value. |
| `--fd-slider-thumb-size` | `20px` | Thumb diameter. |
| `--fd-slider-thumb-border` | `var(--fdic-color-icon-active, #1278b0)` | Thumb border color. |
| `--fd-slider-thumb-background` | `var(--fdic-color-bg-base, #ffffff)` | Thumb background color at rest. |
| `--fd-slider-thumb-hover-background` | `var(--fdic-color-bg-container, #f5f5f7)` | Thumb background while hovered. |
| `--fd-slider-thumb-pressed-background` | `var(--fdic-color-bg-selected, #b4e4f8)` | Thumb background while dragged or pressed. |
| `--fd-slider-bubble-background` | `#212123` | Current-value bubble background color. |
| `--fd-slider-bubble-color` | `#ffffff` | Current-value bubble text color. |
| `--fd-slider-bubble-radius` | `var(--fdic-corner-radius-sm, 3px)` | Current-value bubble corner radius. |
| `--fd-slider-input-width` | `56px` | Width of the optional inline helper input. |
| `--fd-slider-input-border-color` | `var(--fdic-color-border-input, #bdbdbf)` | Inline helper input border color. |
| `--fd-slider-input-radius` | `var(--fdic-corner-radius-sm, 3px)` | Inline helper input corner radius. |
| `--fd-slider-input-background` | `var(--fdic-color-bg-base, #ffffff)` | Inline helper input background color. |

## Shadow parts

| Name | Description |
|---|---|
| `label` | Visible field label. |
| `hint` | Optional supporting guidance text. |
| `control` | Wrapper that groups the range input and optional helper input. |
| `track` | Visual unfilled rail under the native range input. |
| `fill` | Visual filled rail up to the committed value. |
| `range` | Internal native `<input type="range">`. |
| `value-bubble` | Visual current-value bubble shown for hover, drag, and focus states. |
| `input` | Optional inline `<input type="number">` used for exact entry. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Explain the scale clearly</h4>
    <p>Tell users what the minimum and maximum mean so the thumb position is understandable without guesswork.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use a slider for legal or financial confirmation</h4>
    <p>If the exact number carries high-stakes consequences, use a plain text or number field instead.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Enable the inline input when exact review matters</h4>
    <p>The optional helper input gives users a second precise path without replacing the slider’s quick adjustment pattern.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Assume the thumb position is enough</h4>
    <p>Do not rely on the visual track alone to communicate the selected value or what that value means.</p>
  </div>
</div>

## Content guidelines

- **Use direct labels.** Name the thing being adjusted, not the control itself.
- **State the scale meaning.** Hint text should explain what lower and higher values represent when the consequence is not obvious.
- **Keep examples realistic.** Use ranges that reflect real decisions instead of placeholder extremes.
- **Show exact entry intentionally.** Turn on <code>show-input</code> when users benefit from reviewing or fine-tuning the number.

## Accessibility

- `fd-slider` keeps a real internal <code>&lt;input type="range"&gt;</code> as the semantic source of truth.
- The component owns its visible label and optional hint text internally.
- When <code>show-input</code> is enabled, the range input and number input are exposed as one grouped field with coordinated labeling.
- The value bubble is visual only. It supplements, but does not replace, the native value announced by assistive technologies.
- Keyboard interaction stays native to the range input. Users can tab to the slider first and the helper input second when it is present.
- The helper input supports exact entry without creating a second submitted form value.
- Forced-colors support preserves the track, fill, thumb, focus ring, and helper input boundaries.

## Known limitations

- v1 supports **one thumb and one value only**. The related dual-thumb range design is a separate future track.
- `fd-slider` is for **integers only** in v1.
- v1 does not provide tick marks, scale labels on the rail, vertical orientation, or custom value-text formatting.
- If users need to compare or confirm multiple exact numeric values, prefer [Input](/components/input) instead.

## Related components

- [Input](/components/input) — precise text or numeric entry when the exact value is the main task
- [Field](/components/field) — supporting composition helper for label/input/message patterns
